import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HAT_SIZES, ROUND_SECONDS_PRESETS, type GameMode, type WinCondition } from '@/game/types';
import { useDatabase } from '@/hooks/useDatabase';
import { useNewGameStore } from '@/hooks/useNewGameStore';
import { useStartGame } from '@/hooks/useStartGame';
import { t, type MessageKey } from '@/i18n';
import { Button } from '@/ui/Button';
import { Chip } from '@/ui/Chip';
import { useLayout } from '@/ui/layout';
import { Footer, Screen } from '@/ui/Screen';
import { SectionLabel } from '@/ui/Section';
import { StepHeader } from '@/ui/StepHeader';
import { gutter, space } from '@/ui/tokens';

// Labels are catalog keys, translated while rendering.
const WIN_CONDITIONS: { label: MessageKey; emoji: string; value: WinCondition; help: MessageKey }[] = [
  { label: 'newGame.settings.ends.rounds.label', emoji: '🔁', value: { kind: 'rounds', count: 4 }, help: 'newGame.settings.ends.rounds.help' },
  { label: 'newGame.settings.ends.score.label', emoji: '🎯', value: { kind: 'score', target: 20 }, help: 'newGame.settings.ends.score.help' },
  { label: 'newGame.settings.ends.deckOut.label', emoji: '🃏', value: { kind: 'deckExhausted' }, help: 'newGame.settings.ends.deckOut.help' },
  { label: 'newGame.settings.ends.endless.label', emoji: '♾️', value: { kind: 'endless' }, help: 'newGame.settings.ends.endless.help' },
];

const MODES: { mode: GameMode; label: MessageKey; emoji: string; help: MessageKey }[] = [
  { mode: 'classic', label: 'newGame.settings.modes.classic.label', emoji: '🗣️', help: 'newGame.settings.modes.classic.help' },
  { mode: 'taboo', label: 'newGame.settings.modes.taboo.label', emoji: '🚫', help: 'newGame.settings.modes.taboo.help' },
  { mode: 'threeRounds', label: 'newGame.settings.modes.threeRounds.label', emoji: '🎩', help: 'newGame.settings.modes.threeRounds.help' },
];

const ROUND_COUNTS = [2, 3, 4, 6, 8];
const SCORE_TARGETS = [10, 15, 20, 30];

/** Step three of three: how the game is played and how it ends. */
export default function NewGameSettingsScreen() {
  const router = useRouter();
  const { short } = useLayout();
  const database = useDatabase();

  const deckIds = useNewGameStore((s) => s.deckIds);
  const settings = useNewGameStore((s) => s.settings);
  const setRoundSeconds = useNewGameStore((s) => s.setRoundSeconds);
  const setPassPenalty = useNewGameStore((s) => s.setPassPenalty);
  const setWinCondition = useNewGameStore((s) => s.setWinCondition);
  const setGameMode = useNewGameStore((s) => s.setGameMode);
  const setChaos = useNewGameStore((s) => s.setChaos);
  const setForfeits = useNewGameStore((s) => s.setForfeits);
  const setHatSize = useNewGameStore((s) => s.setHatSize);
  const threeRounds = settings.mode === 'threeRounds';
  const resolvedTeams = useNewGameStore((s) => s.resolvedTeams);
  const resetDraft = useNewGameStore((s) => s.reset);

  const { start, starting } = useStartGame();

  const go = async () => {
    const started = await start({ deckIds, teams: resolvedTeams(), settings });
    if (started) resetDraft();
  };

  return (
    <Screen>
      <StepHeader
        step={3}
        of={3}
        title={t('newGame.settings.title')}
        subtitle={t('newGame.settings.subtitle')}
        onClose={() => router.dismissAll()}
        mood="excited"
      />

      <ScrollView contentContainerStyle={styles.body}>
        <View>
          <SectionLabel>{t('newGame.settings.modeSection')}</SectionLabel>
          <View style={styles.row}>
            {MODES.map((option) => (
              <Chip
                key={option.mode}
                grow
                emoji={option.emoji}
                label={t(option.label)}
                detail={t(option.help)}
                selected={settings.mode === option.mode}
                onPress={() => setGameMode(option.mode)}
              />
            ))}
          </View>

          {threeRounds ? (
            <View style={[styles.row, styles.sub]}>
              {HAT_SIZES.map((size) => (
                <Chip
                  key={size}
                  grow
                  label={t('newGame.settings.hatSize', { count: size })}
                  selected={settings.hatSize === size}
                  onPress={() => setHatSize(size)}
                  accessibilityLabel={t('newGame.settings.hatSizeA11y', { count: size })}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View>
          <SectionLabel>{t('newGame.settings.roundLength')}</SectionLabel>
          <View style={styles.row}>
            {ROUND_SECONDS_PRESETS.map((preset) => (
              <Chip
                key={preset}
                grow
                label={t('newGame.settings.seconds', { count: preset })}
                selected={settings.roundSeconds === preset}
                onPress={() => setRoundSeconds(preset)}
                accessibilityLabel={t('newGame.settings.secondsA11y', { count: preset })}
              />
            ))}
          </View>
        </View>

        {threeRounds ? null : (
          <View>
            <SectionLabel>{t('newGame.settings.endsOn')}</SectionLabel>
            <View style={styles.row}>
              {WIN_CONDITIONS.map((option) => (
                <Chip
                  key={option.label}
                  grow
                  emoji={option.emoji}
                  label={t(option.label)}
                  detail={t(option.help)}
                  // Two by two upright, four across sideways.
                  style={short ? null : styles.half}
                  selected={settings.winCondition.kind === option.value.kind}
                  onPress={() => setWinCondition(option.value)}
                />
              ))}
            </View>

            {settings.winCondition.kind === 'rounds' ? (
              <View style={[styles.row, styles.sub]}>
                {ROUND_COUNTS.map((count) => (
                  <Chip
                    key={count}
                    grow
                    label={String(count)}
                    selected={settings.winCondition.kind === 'rounds' && settings.winCondition.count === count}
                    onPress={() => setWinCondition({ kind: 'rounds', count })}
                    accessibilityLabel={t('newGame.settings.roundsEachA11y', { count })}
                  />
                ))}
              </View>
            ) : null}

            {settings.winCondition.kind === 'score' ? (
              <View style={[styles.row, styles.sub]}>
                {SCORE_TARGETS.map((target) => (
                  <Chip
                    key={target}
                    grow
                    label={String(target)}
                    selected={settings.winCondition.kind === 'score' && settings.winCondition.target === target}
                    onPress={() => setWinCondition({ kind: 'score', target })}
                    accessibilityLabel={t('newGame.settings.firstToA11y', { count: target })}
                  />
                ))}
              </View>
            ) : null}
          </View>
        )}

        <View>
          <SectionLabel>{t('newGame.settings.passing')}</SectionLabel>
          <View style={styles.row}>
            <Chip
              grow
              emoji="😌"
              label={t('newGame.settings.pass.free.label')}
              detail={t('newGame.settings.pass.free.detail')}
              selected={settings.passPenalty === 0}
              onPress={() => setPassPenalty(0)}
              accessibilityLabel={t('newGame.settings.pass.free.a11y')}
            />
            <Chip
              grow
              emoji="😬"
              label={t('newGame.settings.pass.penalty.label')}
              detail={t('newGame.settings.pass.penalty.detail')}
              selected={settings.passPenalty === 1}
              onPress={() => setPassPenalty(1)}
            />
          </View>
        </View>

        <View>
          <SectionLabel>{t('newGame.settings.extras')}</SectionLabel>
          <View style={styles.row}>
            {threeRounds ? null : (
              <Chip
                grow
                emoji="🌀"
                label={t('newGame.settings.chaos.label')}
                detail={t('newGame.settings.chaos.detail')}
                selected={settings.chaos}
                onPress={() => setChaos(!settings.chaos)}
                accessibilityLabel={t(settings.chaos ? 'newGame.settings.chaos.a11yOn' : 'newGame.settings.chaos.a11yOff')}
              />
            )}
            <Chip
              grow
              emoji="😈"
              label={t('newGame.settings.forfeits.label')}
              detail={t('newGame.settings.forfeits.detail')}
              selected={settings.forfeits}
              onPress={() => setForfeits(!settings.forfeits)}
              accessibilityLabel={t(settings.forfeits ? 'newGame.settings.forfeits.a11yOn' : 'newGame.settings.forfeits.a11yOff')}
            />
          </View>
        </View>
      </ScrollView>

      <Footer>
        <Button
          label={starting ? t('newGame.settings.starting') : t('newGame.settings.start')}
          variant="primary"
          size="lg"
          icon="play"
          disabled={starting || database.status !== 'ready'}
          onPress={() => void go()}
        />
      </Footer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: space.xs, paddingBottom: space.xl, gap: space.lg },
  row: { flexDirection: 'row', gap: space.sm + 2, paddingHorizontal: gutter, flexWrap: 'wrap' },
  half: { minWidth: '45%' },
  sub: { paddingTop: space.sm + 4 },
});
