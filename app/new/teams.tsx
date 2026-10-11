import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { recentPlayers } from '@/game/friends';
import { areTeamsReady, MAX_TEAMS, MIN_TEAMS } from '@/game/teams';
import { useDatabase } from '@/hooks/useDatabase';
import { useNewGameStore } from '@/hooks/useNewGameStore';
import { t } from '@/i18n';
import { listSessions } from '@/storage/sessionRepo';
import { Button } from '@/ui/Button';
import { Chip } from '@/ui/Chip';
import { cardTextOn } from '@/ui/contrast';
import { Field } from '@/ui/Field';
import { Footer, Screen } from '@/ui/Screen';
import { SectionLabel } from '@/ui/Section';
import { StepHeader } from '@/ui/StepHeader';
import { Text } from '@/ui/Text';
import { color, font, gutter, radius, space } from '@/ui/tokens';

/**
 * Step two of three: teams, or not.
 *
 * "Just play" comes first and is the default, because plenty of groups do not
 * want teams and making them set some up before playing is the friction that
 * gets an app deleted. It is still a team underneath, so scoring has one path.
 */
export default function NewGameTeamsScreen() {
  const router = useRouter();

  const mode = useNewGameStore((s) => s.mode);
  const teams = useNewGameStore((s) => s.teams);
  const soloPlayers = useNewGameStore((s) => s.soloPlayers);
  const setMode = useNewGameStore((s) => s.setMode);
  const setTeamCount = useNewGameStore((s) => s.setTeamCount);
  const renameTeam = useNewGameStore((s) => s.renameTeam);
  const setTeamPlayers = useNewGameStore((s) => s.setTeamPlayers);
  const setSoloPlayers = useNewGameStore((s) => s.setSoloPlayers);

  const ready = mode === 'justPlay' || areTeamsReady(teams);

  // People from earlier games, one tap to add back. The same group plays
  // together again and again, and retyping six names every night is a chore.
  const database = useDatabase();
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    if (database.status !== 'ready') return;
    let cancelled = false;
    void listSessions(database.db).then((sessions) => {
      if (!cancelled) setRecent(recentPlayers(sessions));
    });
    return () => {
      cancelled = true;
    };
  }, [database]);

  const taken = new Set(
    [...soloPlayers, ...teams.flatMap((team) => team.playerNames)].map((name) => name.toLocaleLowerCase()),
  );
  const suggestions = recent.filter((name) => !taken.has(name.toLocaleLowerCase()));

  return (
    <Screen>
      <StepHeader
        step={2}
        of={3}
        title={t('newGame.teams.title')}
        subtitle={t('newGame.teams.subtitle')}
        onClose={() => router.dismissAll()}
        mood="wink"
      />

      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
          <View style={styles.row}>
            <Chip
              grow
              emoji="🎉"
              label={t('newGame.teams.justPlay.label')}
              detail={t('newGame.teams.justPlay.detail')}
              selected={mode === 'justPlay'}
              onPress={() => setMode('justPlay')}
              accessibilityLabel={t('newGame.teams.justPlay.a11y')}
            />
            <Chip
              grow
              emoji="🏆"
              label={t('newGame.teams.teamsMode.label')}
              detail={t('newGame.teams.teamsMode.detail')}
              selected={mode === 'teams'}
              onPress={() => setMode('teams')}
            />
          </View>

          {mode === 'justPlay' ? (
            <View style={styles.section}>
              <SectionLabel>{t('newGame.teams.whosHere')}</SectionLabel>
              <View style={styles.pad}>
                <PlayerList names={soloPlayers} onChange={setSoloPlayers} suggestions={suggestions} />
                <Text variant="caption" tone="muted">
                  {t('newGame.teams.soloHint')}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <SectionLabel>{t('newGame.teams.howMany')}</SectionLabel>
              <View style={styles.row}>
                {Array.from({ length: MAX_TEAMS - MIN_TEAMS + 1 }, (_, i) => i + MIN_TEAMS)
                  .filter((count) => count >= 2)
                  .map((count) => (
                    <Chip
                      key={count}
                      grow
                      label={String(count)}
                      selected={teams.length === count}
                      onPress={() => setTeamCount(count)}
                      accessibilityLabel={t('newGame.teams.countA11y', { count })}
                    />
                  ))}
              </View>

              {teams.map((team) => (
                <View key={team.id} style={[styles.team, { borderColor: team.color }]}>
                  <View style={[styles.teamHeader, { backgroundColor: team.color }]}>
                    <Field
                      value={team.name}
                      onChangeText={(name) => renameTeam(team.id, name)}
                      placeholder={t('newGame.teams.teamName')}
                      accessibilityLabel={t('newGame.teams.teamName')}
                      maxLength={24}
                      size="heading"
                      style={[styles.teamName, { color: cardTextOn(team.color) }]}
                      placeholderTextColor={cardTextOn(team.color) === color.bone ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
                    />
                  </View>
                  <View style={styles.teamBody}>
                    <PlayerList
                      names={team.playerNames}
                      onChange={(names) => setTeamPlayers(team.id, names)}
                      suggestions={suggestions}
                    />
                  </View>
                </View>
              ))}

              {!ready ? (
                <Text variant="caption" tone="pass" style={styles.pad}>
                  {t('newGame.teams.notReady')}
                </Text>
              ) : null}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Footer>
        <Button
          label={t('common.next')}
          variant="blue"
          size="lg"
          icon={ready ? 'forward' : undefined}
          disabled={!ready}
          onPress={() => router.push('/new/settings')}
        />
      </Footer>
    </Screen>
  );
}

/**
 * Names as free text, one per line.
 *
 * A row of add-a-name fields is more taps and more chrome. People setting this
 * up are usually reading names off a room, and a single box keeps up with them.
 */
function PlayerList({
  names,
  onChange,
  suggestions = [],
}: {
  names: string[];
  onChange: (names: string[]) => void;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState(names.join('\n'));

  const update = (text: string) => {
    setDraft(text);
    onChange(text.split('\n'));
  };

  const add = (name: string) => {
    const lines = draft.split('\n').filter((line) => line.trim());
    update([...lines, name].join('\n'));
  };

  return (
    <View style={styles.list}>
      <Field
        value={draft}
        onChangeText={update}
        placeholder={t('newGame.teams.playersPlaceholder')}
        accessibilityLabel={t('newGame.teams.playersA11y')}
        multiline
        autoCapitalize="words"
        autoCorrect={false}
        style={styles.players}
      />
      {suggestions.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestions} keyboardShouldPersistTaps="handled">
          {suggestions.map((name) => (
            <Chip key={name} label={t('newGame.teams.addSuggestion', { name })} selected={false} onPress={() => add(name)} accessibilityLabel={t('newGame.teams.addSuggestionA11y', { name })} />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { paddingTop: space.xs, paddingBottom: space.xl, gap: space.lg },
  row: { flexDirection: 'row', gap: 10, paddingHorizontal: gutter },
  section: { gap: space.md },
  pad: { paddingHorizontal: gutter, gap: space.sm },
  team: {
    marginHorizontal: gutter,
    borderWidth: 2,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: color.surface,
  },
  teamHeader: { padding: space.sm },
  teamName: {
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderColor: 'transparent',
    fontFamily: font.display,
    fontSize: 22,
  },
  teamBody: { padding: space.sm },
  players: { minHeight: 104, backgroundColor: color.background, borderColor: color.background },
  list: { gap: space.sm },
  suggestions: { gap: space.sm },
});
