import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ScoreRing({ score, size = 64, strokeWidth = 5, label }: ScoreRingProps) {
  const colors = useColors();

  const getScoreColor = (s: number) => {
    if (s >= 75) return colors.scoreHealthy;
    if (s >= 50) return colors.scoreWarning;
    return colors.scoreCritical;
  };

  const scoreColor = getScoreColor(score);
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[
        styles.outerRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.border,
        }
      ]}>
        <View style={[
          styles.progressOverlay,
          {
            position: 'absolute',
            top: -strokeWidth,
            left: -strokeWidth,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: scoreColor,
            borderTopColor: score < 25 ? 'transparent' : scoreColor,
            borderRightColor: score < 50 ? 'transparent' : scoreColor,
            borderBottomColor: score < 75 ? 'transparent' : scoreColor,
            borderLeftColor: score < 100 ? scoreColor : scoreColor,
            transform: [{ rotate: '-90deg' }],
          }
        ]} />
        <View style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: scoreColor,
          }
        ]}>
          <Text style={[styles.score, { fontSize: size < 50 ? 12 : 16, color: '#fff' }]}>
            {score}
          </Text>
        </View>
      </View>
      {label && (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressOverlay: {},
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
});
