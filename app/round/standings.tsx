import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeSessionId } from '@/game/ids';
import { playerStandings, standings } from '@/game/scoring';
import { canChangeDecks, rematch, sessionWinState, whoseTurn } from '@/game/session';
import { isJustPlay } from '@/game/teams';
import { nextRoundSeconds } from '@/game/types';
import { hatProgress, phaseInfo } from '@/game/threeRounds';
import { useDatabase } from '@/hooks/useDatabase';
import { useRoundScreenMode } from '@/hooks/useRoundScreenMode';
import { useSessionStore } from '@/hooks/useSessionStore';
import { useSounds } from '@/hooks/useSounds';
import { t } from '@/i18n';
import { forfeitText, phaseTitle, teamName } from '@/i18n/gameText';
import { getDeck } from '@/storage/deckRepo';
import { discardOtherUnfinishedSessions, saveSession } from '@/storage/sessionRepo';
import { Button } from '@/ui/Button';
import { Confetti } from '@/ui/Confetti';
import { EmptyState } from '@/ui/EmptyState';
import { fitCardText } from '@/ui/fitText';
import { READABLE_WIDTH, useLayout } from '@/ui/layout';
import { Mascot } from '@/ui/Mascot';
import { PopIn } from '@/ui/motion';
import { Footer, Screen } from '@/ui/Screen';
import { SectionLabel } from '@/ui/Section';
import { Avatar, ChatLine } from '@/ui/Social';
import { StatTile } from '@/ui/StatTile';
import { Text } from '@/ui/Text';
import { color, font, gutter, palette, radius, space } from '@/ui/tokens';

/**
 * Where the game stands, between rounds and at the end.
 *
 * One screen rather than two. The difference between "standings" and "final
 * standings" is what the game is asking you to do next, not what it is showing
 * you, so the table stays put and only the header and footer change — and the
 * end gets confetti, because it should feel like an ending.
 *
 * The phone comes off the forehead here and gets passed round, so it lays
 * out for whichever way it ends up being held.
 */
export default function StandingsScreen() {
  const router = useRouter();
  const database = useDatabase();

  const session = useSessionStore((s) => s.session);
  const poolExhausted = useSessionStore((s) => s.poolExhausted);
  const completeSessionInStore = useSessionStore((s) => s.completeSession);
  const startSession = useSessionStore((s) => s.startSession);
  const reset = useSessionStore((s) => s.reset);

  const [busy, setBusy] = useState(false);

  useRoundScreenMode();
  const { short, landscape, width } = useLayout();
  const insets = useSafeAreaInsets();
  const setRoundSeconds = useSessionStore((st) => st.setRoundSeconds);

  const winState = useMemo(
    () => (session ? sessionWinState(session, poolExhausted) : { over: false as const }),
    [session, poolExhausted],
  );

  const table = useMemo(() => (session ? standings(session) : []), [session]);
  const players = useMemo(() => (session ? playerStandings(session) : []), [session]);
  const solo = session ? isJustPlay(session.teams) : false;
  const hat = useMemo(() => (session?.hat ? hatProgress(session) : null), [session]);

  // Stamp the session complete as soon as it is over, so quitting from here
  // does not leave a finished game offering to resume.
  // A fanfare as the final standings land.
  const sound = useSounds();
  useEffect(() => {
    if (winState.over) sound('win');
  }, [sound, winState.over]);

  useEffect(() => {
    if (!winState.over || !session || session.completedAt || database.status !== 'ready') return;
    void completeSessionInStore(database.db, new Date().toISOString());
  }, [winState.over, session, database, completeSessionInStore]);

  if (!session) {
    return (
      <Screen>
        <EmptyState title={t('round.standings.noGameTitle')} body={t('round.standings.noGameBody')} />
        <Footer>
          <Button label={t('round.standings.home')} variant="primary" icon="home" onPress={() => router.replace('/')} />
        </Footer>
      </Screen>
    );
  }

  const turn = whoseTurn(session);
  const played = session.rounds.filter((r) => r.endedAt !== null).length;
  const loser = winState.over && session.settings.forfeits ? lastPlace(table, players, solo) : null;
  const nameOf = (name: string) => teamName({ name }, session.teams);

  const playAgain = async () => {
    if (database.status !== 'ready' || busy) return;
    setBusy(true);

    try {
      const next = rematch(session, makeSessionId(), new Date().toISOString());

      const loaded = await Promise.all(next.deckIds.map((id) => getDeck(database.db, id)));
      const decks = loaded.flatMap((deck) =>
        deck ? [{ id: deck.id, name: deck.name, accentColor: deck.accentColor, cards: deck.cards }] : [],
      );

      const created = startSession({
        id: next.id,
        decks,
        teams: next.teams,
        settings: next.settings,
        now: next.createdAt,
        seed: Date.now() >>> 0,
      });

      await saveSession(database.db, created);
      // Starting over mid-game leaves the old game behind for good.
      await discardOtherUnfinishedSessions(database.db, created.id);
      router.replace('/round/intro');
    } finally {
      setBusy(false);
    }
  };

  const confirmRestart = () =>
    Alert.alert(t('round.standings.restartTitle'), t('round.standings.restartMessage'), [
      { text: t('round.standings.keepGoing'), style: 'cancel' },
      { text: t('round.standings.startOver'), style: 'destructive', onPress: () => void playAgain() },
    ]);

  const goHome = () => {
    reset();
    router.dismissAll();
    router.replace('/');
  };

  const headline = winState.over
    ? solo
      ? t('round.standings.headlineSolo')
      : winState.winners.length === 1
        ? t('round.standings.headlineWinner', { team: nameOf(winState.winners[0]!.teamName) })
        : t('round.standings.headlineTie')
    : t('round.standings.headlineStandings');

  const bubble = winState.over
    ? solo
      ? t('round.standings.bubbleSolo', { count: table[0]?.score ?? 0 })
      : winState.winners.length === 1
        ? (table[0]?.score ?? 0) - (table[1]?.score ?? 0) <= 3
          ? t('round.standings.bubbleClose')
          : t('round.standings.bubbleNotClose')
        : t('round.standings.bubbleTie', {
            teams: winState.winners.map((w) => nameOf(w.teamName)).join(t('round.standings.teamListJoiner')),
          })
    : turn?.playerName
      ? t('round.standings.bubbleNextPlayer', { name: turn.playerName })
      : t('round.standings.bubbleRoundsDown', { count: played });

  // The headline sits beside the mascot, and upright that leaves it barely
  // half the screen: a winning team's name at the hero size broke mid-word.
  // It is fitted to the room it has, and the mascot gives a little back.
  const mascotSize = winState.over ? (landscape ? 120 : 96) : 84;
  const column = Math.min(width - insets.left - insets.right, READABLE_WIDTH);
  const headlineFit = fitCardText(headline, column - gutter * 2 - mascotSize - space.md, 160, {
    maxSize: 44,
    minSize: 24,
    maxLines: 3,
    lineHeight: 1.05,
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <PopIn style={styles.sticker}>
            <Mascot size={mascotSize} mood={winState.over ? 'excited' : 'happy'} glyph={winState.over ? '★' : '?'} poke />
          </PopIn>
          <PopIn delay={80} style={styles.headerCopy}>
            <Text
              variant="hero"
              accessibilityRole="header"
              accessibilityLabel={headline}
              allowFontScaling={false}
              numberOfLines={headlineFit.lines.length}
              adjustsFontSizeToFit
              style={{ fontSize: headlineFit.fontSize, lineHeight: headlineFit.lineHeight }}
            >
              {headlineFit.lines.join('\n')}
            </Text>
            <ChatLine>{bubble}</ChatLine>
          </PopIn>
        </View>

        {hat && !hat.done ? (
          <PopIn from="rise" delay={120} style={styles.hat}>
            <Text style={styles.hatEmoji} allowFontScaling={false}>
              {phaseInfo(hat.phase).emoji}
            </Text>
            <View style={styles.rowBody}>
              <Text variant="overline" tone="muted">
                {t('round.standings.hatOverline', { phase: hat.phase, title: phaseTitle(hat.phase).toUpperCase() })}
              </Text>
              <Text variant="heading">
                {t('round.standings.hatLeft', { remaining: hat.remaining.length, count: hat.total })}
              </Text>
              <View style={styles.hatTrack}>
                <View style={[styles.hatFill, { width: `${(hat.guessed / Math.max(1, hat.total)) * 100}%` }]} />
              </View>
            </View>
          </PopIn>
        ) : null}

        {loser ? (
          <PopIn from="rise" delay={140} style={styles.forfeit}>
            <Text variant="overline" style={{ color: palette.pink }}>
              {t('round.standings.forfeitOverline', { name: (solo ? loser : nameOf(loser)).toUpperCase() })}
            </Text>
            <Text variant="heading">{forfeitText(session.id)}</Text>
          </PopIn>
        ) : null}

        {/* Rounds too long or too short? Change it for the next one. */}
        {winState.over ? null : (
          <View style={styles.timerRow}>
            <Button
              label={t('round.standings.nextRoundSeconds', { seconds: session.settings.roundSeconds })}
              icon="timer"
              size="sm"
              onPress={() =>
                database.status === 'ready'
                  ? void setRoundSeconds(database.db, nextRoundSeconds(session.settings.roundSeconds))
                  : undefined
              }
              accessibilityHint={t('round.standings.nextRoundSecondsHint')}
            />
          </View>
        )}

        {/* With one team the team row is just the total, so the per-player
            table is the interesting one and goes first. */}
        {solo ? null : (
          <View style={styles.section}>
            <SectionLabel>{t('round.standings.teams')}</SectionLabel>
            {table.map((standing, index) => {
              const winner = winState.over && winState.winners.some((w) => w.teamId === standing.teamId);

              return (
                <PopIn key={standing.teamId} from="rise" delay={160 + index * 70}>
                  <View style={[styles.row, winner && styles.winnerRow]}>
                    <Text style={styles.rank}>{index + 1}</Text>
                    <Avatar name={nameOf(standing.teamName)} tint={standing.teamColor} badge={medal(index, winner)} />
                    <View style={styles.rowBody}>
                      <Text variant="heading" numberOfLines={1}>
                        {nameOf(standing.teamName)}
                      </Text>
                      <Text variant="caption" tone="muted">
                        {[
                          t('round.standings.statGot', { count: standing.correct }),
                          t('round.standings.statPasses', { count: standing.passed }),
                          t('round.standings.statRounds', { count: standing.roundsPlayed }),
                        ].join(' · ')}
                      </Text>
                    </View>
                    <Text style={[styles.score, winner && { color: color.brand }]}>{standing.score}</Text>
                  </View>
                </PopIn>
              );
            })}
          </View>
        )}

        {/* One team with no names has no table to show, so show the total. */}
        {solo && players.length === 0 && table[0] ? (
          <PopIn from="rise" delay={160} style={styles.totals}>
            <StatTile label={t('round.shared.points')} value={table[0].score} tint={color.brand} />
            <StatTile label={t('round.shared.gotIt')} value={table[0].correct} tint={color.correct} />
            <StatTile label={t('round.shared.roundsLabel', { count: played })} value={played} tint={palette.blue} />
          </PopIn>
        ) : null}

        {players.length > 0 ? (
          <View style={styles.section}>
            <SectionLabel>{solo ? t('round.standings.scores') : t('round.standings.byPlayer')}</SectionLabel>
            {players.map((player, index) => (
              <PopIn key={`${player.teamId}/${player.playerName}`} from="rise" delay={220 + index * 60}>
                <View style={styles.row}>
                  <Text style={styles.rank}>{index + 1}</Text>
                  <Avatar
                    name={player.playerName}
                    tint={PLAYER_TINTS[index % PLAYER_TINTS.length] ?? palette.purple}
                    badge={medal(index, false)}
                  />
                  <View style={styles.rowBody}>
                    <Text variant="heading" numberOfLines={1}>
                      {player.playerName}
                    </Text>
                    <Text variant="caption" tone="muted">
                      {[
                        t('round.standings.statGot', { count: player.correct }),
                        t('round.standings.statRounds', { count: player.roundsPlayed }),
                      ].join(' · ')}
                    </Text>
                  </View>
                  <Text style={styles.score}>{player.score}</Text>
                </View>
              </PopIn>
            ))}
          </View>
        ) : null}

        {poolExhausted ? (
          <Text variant="caption" tone="muted" align="center" style={styles.note}>
            {t('round.shared.reshuffled')}
          </Text>
        ) : null}
      </ScrollView>

      <Footer>
        {winState.over ? (
          <>
            <Button
              label={busy ? t('round.standings.starting') : t('round.standings.runItBack')}
              variant="primary"
              size="lg"
              icon="reset"
              disabled={busy}
              onPress={() => void playAgain()}
            />
            <View style={styles.footerRow}>
              <Button label={t('round.standings.wrapped')} icon="share" onPress={() => router.push('/wrapped')} style={styles.grow} />
              <Button label={t('round.standings.home')} icon="home" onPress={goHome} style={styles.grow} />
            </View>
          </>
        ) : (
          <>
            <Button
              label={turn?.playerName ? t('round.standings.nextUp', { name: turn.playerName }) : t('round.standings.nextRound')}
              variant="primary"
              size="lg"
              icon="play"
              onPress={() => router.replace('/round/intro')}
            />
            {/* Someone's miles ahead, or the decks are getting stale: fix it
                without leaving the game. */}
            {short ? (
              // Sideways the footer is already a row, so these join it.
              <Button label={t('round.standings.startOver')} icon="reset" onPress={confirmRestart} />
            ) : (
              <View style={styles.footerRow}>
                <Button label={t('round.standings.startOver')} icon="reset" size="sm" onPress={confirmRestart} style={styles.grow} />
                {canChangeDecks(session) ? (
                  <Button label={t('round.standings.changeDecks')} icon="decks" size="sm" onPress={() => router.push('/new/decks?change=1')} style={styles.grow} />
                ) : null}
              </View>
            )}
            {short && canChangeDecks(session) ? (
              <Button label={t('round.standings.decks')} icon="decks" onPress={() => router.push('/new/decks?change=1')} />
            ) : null}
            <Button label={t('round.standings.finishLater')} onPress={goHome} accessibilityHint={t('round.standings.finishLaterHint')} />
          </>
        )}
      </Footer>

      {winState.over ? <Confetti /> : null}
    </Screen>
  );
}

/**
 * Who does the forfeit: the bottom team, or the bottom player when everyone
 * played as one. Nobody when last place is shared with first — a tie at the
 * top is not a loss.
 */
function lastPlace(
  table: { teamName: string; score: number }[],
  players: { playerName: string; score: number }[],
  solo: boolean,
): string | null {
  const rows = solo
    ? players.map((p) => ({ name: p.playerName, score: p.score }))
    : table.map((t) => ({ name: t.teamName, score: t.score }));
  if (rows.length < 2) return null;
  const last = rows[rows.length - 1]!;
  return last.score === rows[0]!.score ? null : last.name;
}

const PLAYER_TINTS = [palette.pink, palette.blue, palette.yellow, palette.purple, palette.teal, palette.red];

/** The crown goes to the winner; second and third get the medals. */
function medal(index: number, winner: boolean): string | undefined {
  if (winner) return '👑';
  return index === 1 ? '🥈' : index === 2 ? '🥉' : undefined;
}

const styles = StyleSheet.create({
  body: { paddingBottom: space.lg, gap: space.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingTop: space.lg, paddingHorizontal: gutter },
  sticker: { transform: [{ rotate: '-8deg' }] },
  headerCopy: { flex: 1, gap: space.md },
  section: { gap: space.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: gutter,
    paddingHorizontal: space.md - 4,
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: color.surface,
  },
  winnerRow: { borderWidth: 2, borderColor: color.brand },
  rank: { fontFamily: font.heavy, fontSize: 14, lineHeight: 18, color: color.textFaint, width: 16, textAlign: 'center' },
  rowBody: { flex: 1, gap: 1 },
  score: { fontFamily: font.display, fontSize: 32, lineHeight: 36, color: color.text },
  note: { paddingHorizontal: gutter },
  footerRow: { flexDirection: 'row', gap: 10 },
  totals: { flexDirection: 'row', gap: space.sm, paddingHorizontal: gutter },
  grow: { flex: 1 },
  timerRow: { flexDirection: 'row', paddingHorizontal: gutter },
  hat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginHorizontal: gutter,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: color.surface,
  },
  hatEmoji: { fontSize: 40, lineHeight: 48 },
  hatTrack: { height: 8, borderRadius: 4, backgroundColor: color.surfaceRaised, overflow: 'hidden', marginTop: 6 },
  hatFill: { height: 8, borderRadius: 4, backgroundColor: color.brand },
  forfeit: {
    gap: space.xs,
    marginHorizontal: gutter,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: palette.pink,
    backgroundColor: color.surface,
  },
});
