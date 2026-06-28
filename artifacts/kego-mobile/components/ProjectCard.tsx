import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { ScoreRing } from './ScoreRing';
import { HealthBadge } from './HealthBadge';
import { formatTimeAgo } from '@/lib/data';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const colors = useColors();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/project/${project.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ScoreRing score={project.resumeScore} size={44} strokeWidth={4} />
          <View style={styles.titleBlock}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
              {project.name}
            </Text>
            <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={1}>
              {project.description}
            </Text>
          </View>
        </View>
        <HealthBadge health={project.health} size="sm" />
      </View>

      <View style={styles.footer}>
        <View style={styles.tags}>
          {project.tags.slice(0, 2).map(tag => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.muted }]}>
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {formatTimeAgo(project.lastActivity)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
