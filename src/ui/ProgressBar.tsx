import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { color, radius } from './tokens';
import { t } from '@/i18n';

export type ProgressBarProps = {
  /** 0 to 1. */
  value: number;
  tint?: string;
  height?: number;
  track?: string;
};

/** A slim rounded bar that eases to its new value rather than jumping. */
export function ProgressBar({ value, tint = color.brand, height = 8, track = color.surfaceRaised }: ProgressBarProps) {
  const reduced = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, value));
  const [width] = useState(() => new Animated.Value(clamped));

  useEffect(() => {
    if (reduced) {
      width.setValue(clamped);
      return;
    }
    // Width cannot use the native driver; this is a handful of frames on a
    // change, not a per-frame timer.
    const animation = Animated.spring(width, { toValue: clamped, friction: 9, tension: 80, useNativeDriver: false });
    animation.start();
    return () => animation.stop();
  }, [clamped, reduced, width]);

  return (
    <View
      style={[styles.track, { height, backgroundColor: track }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: tint, width: width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
        ]}
      />
    </View>
  );
}

export type StoryBarProps = {
  count: number;
  /** The segment in progress. Earlier ones are full, later ones empty. */
  index: number;
  /** How far through the current segment, 0 to 1. */
  progress?: number | Animated.Value;
  /**
   * `canvas` sits on the menu background and follows the theme. `onColour`
   * sits on a full-bleed coloured story, where white always reads.
   */
  tone?: 'canvas' | 'onColour';
};

/**
 * Story segments: one thin bar per step, filled up to where you are. Used for
 * setup steps and the how-to-play, so "how much is left" reads at a glance.
 */
export function StoryBar({ count, index, progress = 1, tone = 'canvas' }: StoryBarProps) {
  const segment = [styles.segment, tone === 'canvas' && styles.segmentCanvas];
  const filled = [styles.segmentFill, tone === 'canvas' && styles.segmentFillCanvas];
  return (
    <View style={styles.story} accessibilityLabel={t('ui.storyBar.step', { step: index + 1, count })} accessible>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={segment}>
          {i < index ? <View style={[filled, { width: '100%' }]} /> : null}
          {i === index ? (
            typeof progress === 'number' ? (
              <View style={[filled, { width: `${Math.round(progress * 100)}%` }]} />
            ) : (
              <Animated.View
                style={[
                  ...filled,
                  { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                ]}
              />
            )
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flex: 1, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  story: { flexDirection: 'row', gap: 4, flex: 1 },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden',
  },
  segmentFill: { height: '100%', backgroundColor: color.bone, borderRadius: 2 },
  // On the light canvas white-on-white vanished, so the menu bar takes the
  // theme's text colour on a tinted track instead.
  segmentCanvas: { backgroundColor: color.glassStrong },
  segmentFillCanvas: { backgroundColor: color.text },
});
