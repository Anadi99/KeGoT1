import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { ProjectHealth } from '@/lib/types';

interface HealthBadgeProps {
  health: ProjectHealth;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const healthConfig = {
  healthy: { label: 'Healthy', icon: 'checkmark-circle' as const },
  'at-risk': { label: 'At Risk', icon: 'warning' as const },
  stalled: { label: 'Stalled', icon: 'pause-circle' as const },
  dormant: { label: 'Dormant', icon: 'moon' as const },
};

export function HealthBadge({ health, showIcon = true, size = 'md' }: HealthBadgeProps) {
  const colors = useColors();
  const config = healthConfig[health];

  const getHealthColor = (h: ProjectHealth) => {
    switch (h) {
      case 'healthy': return colors.healthHealthy;
      case 'at-risk': return colors.healthAtRisk;
      case 'stalled': return colors.healthStalled;
      case 'dormant': return colors.healthDormant;
    }
  };

  const color = getHealthColor(health);
  const fontSize = size === 'sm' ? 11 : 12;
  const iconSize = size === 'sm' ? 12 : 14;
  const paddingH = size === 'sm' ? 6 : 8;
  const paddingV = size === 'sm' ? 2 : 4;

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: color + '18',
        borderColor: color + '40',
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
      }
    ]}>
      {showIcon && (
        <Ionicons name={config.icon} size={iconSize} color={color} />
      )}
      <Text style={[styles.label, { color, fontSize }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
  },
});
