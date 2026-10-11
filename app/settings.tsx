import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useHaptics } from '@/hooks/useHaptics';
import { type InputMode, useSettings, useSettingsStore } from '@/hooks/useSettings';
import { t, type MessageKey } from '@/i18n';
import { Chip } from '@/ui/Chip';
import { Icon, type IconName } from '@/ui/Icon';
import { Screen } from '@/ui/Screen';
import { Group, IconBadge, SectionLabel, SwitchRow } from '@/ui/Section';
import { Tap } from '@/ui/Tap';
import { Text } from '@/ui/Text';
import { TopBar } from '@/ui/TopBar';
import { color, gutter, palette, space, type ThemeChoice } from '@/ui/tokens';

/**
 * App settings, as opposed to the per-game settings in the new game flow.
 *
 * These are preferences about the device and the person holding it, so they
 * persist across games rather than being chosen again every time.
 *
 * Grouped by what they change: how you answer, how the app looks, and what
 * you hear and feel.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const settings = useSettings();
  const set = useSettingsStore((s) => s.set);
  const resetAll = useSettingsStore((s) => s.resetAll);


  const setTheme = useSettingsStore((s) => s.setTheme);
  const switchTheme = (next: ThemeChoice) => {
    if (next === settings.theme) return;
    Alert.alert(t('settings.switchTheme.title'), t('settings.switchTheme.message'), [
      { text: t('settings.switchTheme.cancel'), style: 'cancel' },
      { text: t('settings.switchTheme.confirm'), onPress: () => setTheme(next) },
    ]);
  };

  const confirmReset = () => {
    Alert.alert(
      t('settings.reset.title'),
      t('settings.reset.message'),
      [
        { text: t('settings.reset.cancel'), style: 'cancel' },
        {
          text: t('settings.reset.confirm'),
          style: 'destructive',
          onPress: () => {
            resetAll();
            haptics.select();
          },
        },
      ],
    );
  };

  const answerNote = ANSWER_MODES.find((mode) => mode.key === settings.inputMode)?.note;

  return (
    <Screen>
      <TopBar leading="close" onLeading={router.back} leadingLabel={t('settings.close')} title={t('settings.title')} />

      <ScrollView contentContainerStyle={styles.body}>
        <View>
          <SectionLabel>{t('settings.answer.heading')}</SectionLabel>
          <View style={styles.choices}>
            {ANSWER_MODES.map((mode) => (
              <Chip
                key={mode.key}
                grow
                emoji={mode.emoji}
                label={t(mode.label)}
                detail={t(mode.detail)}
                selected={settings.inputMode === mode.key}
                onPress={() => set('inputMode', mode.key)}
                accessibilityLabel={t('settings.answer.accessibilityLabel', { mode: t(mode.label) })}
              />
            ))}
          </View>
          <Text variant="caption" tone="muted" style={styles.note}>
            {answerNote ? t(answerNote) : null}
          </Text>
        </View>

        <View>
          <SectionLabel>{t('settings.look.heading')}</SectionLabel>
          <View style={styles.choices}>
            {THEME_CHOICES.map((choice) => (
              <Chip
                key={choice.key}
                grow
                emoji={choice.emoji}
                label={t(choice.label)}
                selected={settings.theme === choice.key}
                onPress={() => switchTheme(choice.key)}
                accessibilityLabel={t('settings.look.accessibilityLabel', { theme: t(choice.label) })}
              />
            ))}
          </View>
          <Text variant="caption" tone="muted" style={styles.note}>
            {t('settings.look.note')}
          </Text>
        </View>

        <View>
          <SectionLabel>{t('settings.feel.heading')}</SectionLabel>
          <Group>
            <SwitchRow
              icon="sound"
              tint={palette.orange}
              title={t('settings.feel.sound')}
              detail={t('settings.feel.soundDetail')}
              value={settings.sound}
              onChange={(value) => set('sound', value)}
            />
            <SwitchRow
              icon="phone"
              tint={palette.purple}
              title={t('settings.feel.haptics')}
              detail={t('settings.feel.hapticsDetail')}
              value={settings.haptics}
              onChange={(value) => set('haptics', value)}
            />
            <SwitchRow
              icon="sun"
              tint={palette.yellow}
              title={t('settings.feel.brightness')}
              detail={t('settings.feel.brightnessDetail')}
              value={settings.boostBrightness}
              onChange={(value) => set('boostBrightness', value)}
              last
            />
          </Group>
        </View>

        <View>
          <SectionLabel>{t('settings.more.heading')}</SectionLabel>
          <Group>
            <NavRow icon="help" tint={palette.blue} title={t('settings.more.howToPlay')} onPress={() => router.push('/welcome?replay=1')} />
            <NavRow icon="reset" tint={palette.red} title={t('settings.more.reset')} onPress={confirmReset} last />
          </Group>
        </View>

        <View style={styles.colophon}>
          <Text variant="label" tone="faint" align="center">
            {t('settings.version', { appName: t('common.appName'), version: Constants.expoConfig?.version ?? '' })}
          </Text>
          <Text variant="caption" tone="faint" align="center">
            {t('settings.privacy')}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

// Copy below is message keys, translated on render.
const ANSWER_MODES: readonly { key: InputMode; emoji: string; label: MessageKey; detail: MessageKey; note: MessageKey }[] = [
  {
    key: 'tilt',
    emoji: '🙃',
    label: 'settings.answer.tilt.label',
    detail: 'settings.answer.tilt.detail',
    note: 'settings.answer.tilt.note',
  },
  {
    key: 'swipe',
    emoji: '☝️',
    label: 'settings.answer.swipe.label',
    detail: 'settings.answer.swipe.detail',
    note: 'settings.answer.swipe.note',
  },
  {
    key: 'tap',
    emoji: '👆',
    label: 'settings.answer.tap.label',
    detail: 'settings.answer.tap.detail',
    note: 'settings.answer.tap.note',
  },
];

const THEME_CHOICES: readonly { key: ThemeChoice; emoji: string; label: MessageKey }[] = [
  { key: 'dark', emoji: '🌙', label: 'settings.look.dark' },
  { key: 'light', emoji: '☀️', label: 'settings.look.light' },
  { key: 'system', emoji: '📱', label: 'settings.look.system' },
];

function NavRow({
  icon,
  tint,
  title,
  onPress,
  last = false,
}: {
  icon: IconName;
  tint: string;
  title: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Tap onPress={onPress} squish={0.98} accessibilityLabel={title} contentStyle={[styles.row, !last && styles.rowDivider]}>
      <IconBadge icon={icon} tint={tint} />
      <Text variant="heading" style={styles.rowTitle}>
        {title}
      </Text>
      <Icon name="forward" size={18} color={color.textFaint} weight={3} />
    </Tap>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: space.sm, paddingBottom: space.xl, gap: space.lg },
  choices: { flexDirection: 'row', gap: 10, paddingHorizontal: gutter },
  note: { paddingHorizontal: gutter, paddingTop: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: space.md, paddingVertical: 12 },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.line },
  rowTitle: { flex: 1 },
  colophon: { gap: space.xs, paddingHorizontal: space.xl, paddingTop: space.md },
});
