import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Outcome } from '@/game/types';
import { fitCardText } from './fitText';
import { color, font } from './tokens';

export type FlashOverlayProps = {
  outcome: Outcome;
  /** Taboo: the forbidden word that was said. Shows "Busted!" in red. */
  busted?: string;
};

const LINES = {
  correct: ['Got it', 'Yesss', 'Nailed it', 'Easy', 'Big brain'],
  pass: ['Pass', 'Next', 'Skip'],
} as const;

/**
 * The full-screen state flash.
 *
 * The signature element. Correct and pass each take over the whole display in
 * neon so the room reads the result without hunting for a small indicator.
 * The word slams in tilted, like a sticker; it is there for anyone who cannot
 * rely on colour alone.
 */
export function FlashOverlay({ outcome, busted }: FlashOverlayProps) {
  const reduced = useReducedMotion();
  const [pop] = useState(() => new Animated.Value(reduced ? 1 : 0));
  const [line] = useState(() => pick(LINES[outcome]));

  useEffect(() => {
    if (reduced) return;
    const animation = Animated.spring(pop, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [pop, reduced]);

  // Upright the screen is a third as wide, and "Nailed it" at full size ran
  // off both edges. The word is fitted to the width it actually has.
  const { width, height } = useWindowDimensions();
  const label = busted ? 'Busted!' : line;
  const fit = fitCardText(label, width - FLASH_PAD * 2, height * 0.5, { maxSize: 120, minSize: 40, maxLines: 2, lineHeight: 1.03 });

  const correct = outcome === 'correct';
  const background = correct ? color.correct : busted ? color.danger : color.pass;

  return (
    <View
      style={[styles.overlay, { backgroundColor: background }]}
      pointerEvents="none"
      accessibilityLiveRegion="assertive"
      accessibilityLabel={correct ? 'Got it' : busted ? `Busted: ${busted}` : 'Pass'}
    >
      <Animated.View
        style={{
          alignItems: 'center',
          transform: [
            { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [1.8, 1] }) },
            { rotate: correct ? '-5deg' : '4deg' },
          ],
        }}
      >
        <Text style={styles.emoji} allowFontScaling={false}>
          {correct ? '🔥' : busted ? '🚨' : '💨'}
        </Text>
        <Text
          style={[styles.label, { fontSize: fit.fontSize, lineHeight: fit.lineHeight, letterSpacing: fit.fontSize * -0.025 }, busted ? { color: color.bone } : null]}
          allowFontScaling={false}
          numberOfLines={fit.lines.length}
          adjustsFontSizeToFit
        >
          {fit.lines.join('\n')}
        </Text>
        {busted ? (
          <Text style={styles.said} allowFontScaling={false} numberOfLines={2} adjustsFontSizeToFit>
            Someone said “{busted}”
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

/** Room kept clear either side of the word, allowing for its tilt. */
const FLASH_PAD = 28;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] ?? (items[0] as T);
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  emoji: { fontSize: 64, lineHeight: 76 },
  said: { fontFamily: font.heavy, fontSize: 26, lineHeight: 32, color: color.bone, textAlign: 'center', paddingHorizontal: FLASH_PAD },
  label: {
    fontFamily: font.display,
    fontSize: 120,
    lineHeight: 124,
    color: color.ink,
    textAlign: 'center',
  },
});
