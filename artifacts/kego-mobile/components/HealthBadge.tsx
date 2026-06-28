import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getHealthColor, getHealthLabel } from '@/lib/data';
import type { ProjectHealth } from '@/lib/types';

interface HealthBadgeProps {
  health: ProjectHealth;
  size?: 'sm' | 'md';
}

export function HealthBadge({ health, size = 'md' }: HealthBadgeProps) {
  const color = getHealthColor(health);
  const label = getHealthLabel(health);
  const fontSize = size === 'sm' ? 10 : 11;
  const paddingH = size === 'sm' ? 6 : 8;
  const paddingV = size === 'sm' ? 2 : 3;

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: color + '18',
        borderColor: color + '50',
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
      }
    ]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color, fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  label: { fontFamily: 'Inter_600SemiBold' },
});
