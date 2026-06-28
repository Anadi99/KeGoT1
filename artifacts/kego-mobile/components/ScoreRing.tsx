import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getScoreColor } from '@/lib/data';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLabel?: boolean;
}

export function ScoreRing({ score, size = 56, strokeWidth = 3, label, showLabel }: ScoreRingProps) {
  const color = getScoreColor(score);
  const innerSize = size - strokeWidth * 2 - 4;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[
        styles.outerRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color + '30',
          backgroundColor: '#0a0b0c',
        }
      ]}>
        <View style={[
          styles.innerCircle,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            borderWidth: strokeWidth,
            borderColor: color,
          }
        ]}>
          <Text style={[styles.score, { fontSize: size < 50 ? 12 : size < 70 ? 15 : 20, color }]}>
            {score}
          </Text>
          {size >= 70 && (
            <Text style={[styles.pct, { color: color + '80' }]}>%</Text>
          )}
        </View>
      </View>
      {showLabel && label && (
        <Text style={[styles.label, { color: '#5a5d63' }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 4 },
  outerRing: { alignItems: 'center', justifyContent: 'center' },
  innerCircle: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  score: { fontFamily: 'Inter_700Bold', lineHeight: 18 },
  pct: { fontSize: 9, fontFamily: 'Inter_600SemiBold', marginTop: -2 },
  label: { fontSize: 10, fontFamily: 'Inter_500Medium', textAlign: 'center' },
});
