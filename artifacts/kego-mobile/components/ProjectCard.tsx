import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScoreRing } from './ScoreRing';
import { HealthBadge } from './HealthBadge';
import { formatTimeAgo } from '@/lib/data';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  variant?: 'priority' | 'default';
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const router = useRouter();

  if (variant === 'priority') {
    return (
      <TouchableOpacity
        style={styles.priorityRow}
        onPress={() => router.push(`/project/${project.id}` as any)}
        activeOpacity={0.7}
      >
        <ScoreRing score={project.resumeScore} size={52} strokeWidth={3} />
        <View style={styles.priorityContent}>
          <Text style={styles.priorityName}>{project.name}</Text>
          <Text style={styles.priorityMeta}>
            {project.currentPhase ? `Phase: ${project.currentPhase}` : formatTimeAgo(project.lastActivity)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#5a5d63" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/project/${project.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <ScoreRing score={project.resumeScore} size={44} strokeWidth={3} />
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>{project.name}</Text>
          <Text style={styles.cardDesc} numberOfLines={1}>{project.description}</Text>
        </View>
        <HealthBadge health={project.health} size="sm" />
      </View>
      <View style={styles.cardFooter}>
        {project.tags.slice(0, 2).map(tag => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <Text style={styles.time}>{formatTimeAgo(project.lastActivity)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#141618',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252729',
    padding: 14,
  },
  priorityContent: { flex: 1, gap: 3 },
  priorityName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#ffffff' },
  priorityMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8a8d93' },
  card: {
    backgroundColor: '#141618',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252729',
    padding: 14,
    gap: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardContent: { flex: 1, gap: 2 },
  cardName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#ffffff' },
  cardDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#8a8d93' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: {
    backgroundColor: '#1c1e21',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 10, fontFamily: 'Inter_500Medium', color: '#5a5d63' },
  time: { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#5a5d63', marginLeft: 'auto' },
});
