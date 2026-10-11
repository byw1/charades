import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { countOutcomes, roundScore } from '@/game/scoring';
import { whoseTurn } from '@/game/session';
import { twistById } from '@/game/twists';
import type { Outcome } from '@/game/types';
import { useDatabase } from '@/hooks/useDatabase';
import { useRoundScreenMode } from '@/hooks/useRoundScreenMode';
import { findPoolCard, useSessionStore } from '@/hooks/useSessionStore';
import { t } from '@/i18n';
import { teamName, twistTitle } from '@/i18n/gameText';
import { Button } from '@/ui/Button';
import { Confetti } from '@/ui/Confetti';
import { Mascot, type MascotMood } from '@/ui/Mascot';
import { PopIn } from '@/ui/motion';
import { useLayout } from '@/ui/layout';
import { Footer, Screen } from '@/ui/Screen';
import { StatTile } from '@/ui/StatTile';
import { Tap } from '@/ui/Tap';
import { Text } from '@/ui/Text';
import { color, font, space } from '@/ui/tokens';

/**
 * Every card from the round, tappable to fix a mis-tap.
 *
 * Laid out like a message thread's receipts: a filled square for a card you
 * got, a hollow one for a pass, and how far into the round it happened.
 * Overrides matter because the holder is guessing blind and the group is
 * shouting; arguing about a mis-tap is worse than fixing it. Score is derived
 * from these results, so flipping one is the whole edit — and nothing is
 * written until Continue, so the edits land in one go.
 */
export default function RoundRecapScreen() {
  const router = useRouter();
  const database = useDatabase();

  const session = useSessionStore((s) => s.session);
  const results = useSessionStore((s) => s.roundState.results);
  const reshuffled = useSessionStore((s) => s.roundState.reshuffled && !s.roundState.retireCorrect);
  const cleared = useSessionStore((s) => s.roundState.cleared);
  const pool = useSessionStore((s) => s.pool);
  const overrideResult = useSessionStore((s) => s.overrideResult);
  const commitRound = useSessionStore((s) => s.commitRound);

  const [saving, setSaving] = useState(false);

  useRoundScreenMode();
  // Sideways: summary left, cards right. Upright: summary on top, cards
  // below, and the button pinned at the bottom where a thumb is.
  const { landscape } = useLayout();
  const upright = !landscape;

  const { correct, passed } = useMemo(() => countOutcomes(results), [results]);
  const penalty = session?.settings.passPenalty ?? 0;
  const openRound = session?.rounds.find((round) => round.endedAt === null);
  const twist = twistById(openRound?.twist);
  const score = useMemo(() => roundScore({ results, twist: twist?.id }, penalty), [results, twist, penalty]);

  // The round is still open, so whoseTurn names whoever just played it.
  const turn = session ? whoseTurn(session) : null;
  const showTeam = (session?.teams.length ?? 0) > 1;
  const who = [showTeam && turn && session ? teamName(turn.team, session.teams) : null, turn?.playerName].filter(Boolean).join(' · ');

  const { headline, mood } = verdict(correct);

  const done = async () => {
    if (database.status !== 'ready' || saving) return;
    setSaving(true);

    try {
      await commitRound(database.db, new Date().toISOString());
      router.replace('/round/standings');
    } finally {
      setSaving(false);
    }
  };

  const continueButton = (
    <Button label={saving ? t('round.recap.saving') : t('round.recap.continue')} variant="primary" size="lg" disabled={saving} onPress={() => void done()} />
  );

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.panes, upright && styles.panesUpright]}>
        <View style={[styles.summary, upright && styles.summaryUpright]}>
          <View style={styles.hero}>
            <PopIn style={styles.sticker}>
              <Mascot size={84} mood={mood} poke />
            </PopIn>
            <View style={styles.heroCopy}>
              {who ? (
                <Text variant="overline" style={{ color: showTeam && turn ? turn.team.color : color.textMuted }}>
                  {who.toUpperCase()}
                </Text>
              ) : null}
              <Text variant="display">{headline}</Text>
            </View>
          </View>

          <PopIn from="rise" delay={100} style={styles.stats}>
            <StatTile label={t('round.shared.gotIt')} value={correct} tint={color.correct} />
            <StatTile label={t('round.recap.passesLabel', { count: passed })} value={passed} tint={color.pass} />
            <StatTile label={t('round.shared.points')} value={score} tint={color.brand} />
          </PopIn>

          {twist ? (
            <Text variant="caption" tone="muted">
              {t(twist.effect === 'double' ? 'round.recap.twistDouble' : 'round.recap.twistPlain', {
                emoji: twist.emoji,
                title: twistTitle(twist.id),
              })}
            </Text>
          ) : null}

          {cleared ? (
            <Text variant="caption" tone="muted">
              {openRound?.phase === 3 ? t('round.recap.clearedGameOver') : t('round.recap.clearedPhase')}
            </Text>
          ) : null}

          {reshuffled ? (
            <Text variant="caption" tone="muted">
              {t('round.shared.reshuffled')}
            </Text>
          ) : null}

          {upright ? null : (
            <>
              <View style={styles.spacer} />
              {continueButton}
            </>
          )}
        </View>

        <View style={[styles.listPane, upright && styles.listPaneUpright]}>
          <Text variant="overline" tone="faint" style={styles.listLabel}>
            {results.length > 0 ? t('round.recap.listLabelFix') : t('round.recap.listLabelEmpty')}
          </Text>
          <FlatList
            data={results}
            keyExtractor={(result) => result.cardId}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text variant="heading" align="center">
                  {t('round.recap.emptyTitle')}
                </Text>
                <Text variant="caption" tone="muted" align="center">
                  {t('round.recap.emptyBody')}
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const card = findPoolCard(pool, item.cardId);
              const got = item.outcome === 'correct';
              const next: Outcome = got ? 'pass' : 'correct';
              const tint = got ? color.correct : item.busted ? color.danger : color.pass;
              const cardText = card?.text ?? t('round.recap.cardFallback');

              return (
                <Tap
                  onPress={() => overrideResult(item.cardId, next)}
                  squish={0.98}
                  accessibilityLabel={
                    got
                      ? t('round.recap.rowA11yGot', { card: cardText })
                      : item.busted
                        ? t('round.recap.rowA11yBusted', { card: cardText, word: item.busted })
                        : t('round.recap.rowA11yPassed', { card: cardText })
                  }
                  contentStyle={styles.row}
                >
                  <View style={[styles.receipt, got ? { backgroundColor: tint } : { borderColor: tint, borderWidth: 2.5 }]} />
                  <View style={styles.rowBody}>
                    <Text variant="heading" numberOfLines={1}>
                      {cardText}
                    </Text>
                    <Text style={[styles.status, { color: tint }]}>
                      {got ? t('round.recap.statusGot') : item.busted ? t('round.recap.statusBusted', { word: item.busted }) : t('round.recap.statusPassed')}
                      <Text style={styles.time}> · {clock(item.atMs)}</Text>
                      {/* The clue-giver hint. Shown here, never on the card. */}
                      {card?.note ? <Text style={styles.time}> · {card.note}</Text> : null}
                    </Text>
                  </View>
                </Tap>
              );
            }}
          />
        </View>
      </View>
      {upright ? <Footer>{continueButton}</Footer> : null}
      {/* A great round gets a little party of its own. */}
      {correct >= 5 ? <Confetti count={40} /> : null}
    </Screen>
  );
}

/** Milliseconds into the round as m:ss. */
function clock(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function verdict(correct: number): { headline: string; mood: MascotMood } {
  if (correct >= 8) return { headline: t('round.recap.verdict.unreal'), mood: 'excited' };
  if (correct >= 5) return { headline: t('round.recap.verdict.great'), mood: 'excited' };
  if (correct >= 2) return { headline: t('round.recap.verdict.nice'), mood: 'happy' };
  if (correct === 1) return { headline: t('round.recap.verdict.onTheBoard'), mood: 'wink' };
  return { headline: t('round.recap.verdict.rough'), mood: 'sad' };
}

const styles = StyleSheet.create({
  panes: { flex: 1, flexDirection: 'row' },
  summary: { width: '42%', paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.sm, gap: space.md },
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  sticker: { transform: [{ rotate: '-6deg' }] },
  heroCopy: { flex: 1, gap: 2 },
  stats: { flexDirection: 'row', gap: space.sm },
  spacer: { flex: 1 },
  listPane: { flex: 1, backgroundColor: color.surface, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 },
  panesUpright: { flexDirection: 'column' },
  summaryUpright: { width: '100%' },
  listPaneUpright: { marginHorizontal: space.sm, borderRadius: 24 },
  listLabel: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.sm },
  list: { paddingHorizontal: space.md, paddingBottom: space.lg, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md - 2, paddingHorizontal: space.sm, paddingVertical: 10, borderRadius: 14 },
  receipt: { width: 16, height: 16, borderRadius: 4 },
  rowBody: { flex: 1, gap: 1 },
  status: { fontFamily: font.heavy, fontSize: 13, lineHeight: 18 },
  time: { fontFamily: font.medium, color: color.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.xs, padding: space.lg },
});
