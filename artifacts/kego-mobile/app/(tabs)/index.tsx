import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { ScoreRing } from '@/components/ScoreRing';
import {
  mockProjects, mockRecoveryHub, mockAIInsights,
  formatTimeAgo, getScoreColor
} from '@/lib/data';

const priorityProjects = mockProjects.slice(0, 3);
const featuredProject = mockProjects[0];

export default function DashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 16 : insets.top + 8;
  const bottomPad = Platform.OS === 'web' ? 80 : 100;

  const activeCount = mockProjects.filter(p => p.health === 'active' || p.health === 'recovering' || p.health === 'healthy').length;
  const pausedCount = mockProjects.filter(p => p.health === 'at-risk' || p.health === 'stalled').length;
  const recoveredCount = mockProjects.filter(p => p.health === 'recovered').length;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Command Center</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>F</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <StatBlock label="ACTIVE" value={activeCount} accent={colors.accent} />
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <StatBlock label="PAUSED" value={pausedCount} accent="#ffffff" />
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <StatBlock label="RECOVERED" value={recoveredCount} accent="#ffffff" />
      </View>

      <TouchableOpacity
        style={[styles.insightBanner, { borderColor: colors.accent + '50', backgroundColor: colors.card }]}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <View style={styles.insightLeft}>
          <View style={styles.insightHeader}>
            <Text style={{ fontSize: 13, color: colors.accent }}>✦</Text>
            <Text style={[styles.insightTitle, { color: '#ffffff' }]}>AI Insights Ready</Text>
          </View>
          <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>
            3 projects ready for recovery{'\n'}based on current momentum.
          </Text>
        </View>
        <TouchableOpacity style={[styles.viewBtn, { backgroundColor: colors.accent }]}>
          <Text style={[styles.viewBtnText, { color: '#000000' }]}>VIEW</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>Priority Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/projects' as any)}>
            <Text style={[styles.seeAll, { color: colors.accent }]}>SEE ALL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.projectList}>
          {priorityProjects.map(project => (
            <TouchableOpacity
              key={project.id}
              style={[styles.priorityRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/project/${project.id}` as any)}
              activeOpacity={0.7}
            >
              <ScoreRing score={project.resumeScore} size={52} strokeWidth={3} />
              <View style={styles.priorityContent}>
                <Text style={[styles.priorityName, { color: '#ffffff' }]}>{project.name}</Text>
                <Text style={[styles.priorityMeta, { color: colors.textSecondary }]}>
                  {project.currentPhase ? `Phase: ${project.currentPhase}` : formatTimeAgo(project.lastActivity)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.memoryNodeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.memoryNodeGradient}>
          <Text style={[styles.memoryNodeLabel, { color: colors.accent }]}>MEMORY NODE</Text>
          <Text style={[styles.memoryNodeTitle, { color: '#ffffff' }]}>Global Architecture</Text>
        </View>
        <View style={styles.nodeLines}>
          {[0, 1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={[
                styles.nodeLine,
                {
                  top: `${20 + i * 15}%` as any,
                  left: `${10 + i * 12}%` as any,
                  width: `${40 + i * 8}%` as any,
                  opacity: 0.2 + i * 0.05,
                  backgroundColor: colors.accent,
                }
              ]}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.velocityCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.8}
      >
        <View style={styles.velocityHeader}>
          <View style={[styles.velocityIcon, { backgroundColor: colors.surface2 }]}>
            <Ionicons name="time-outline" size={18} color={colors.accent} />
          </View>
          <Text style={[styles.velocityDelta, { color: colors.accent }]}>
            +{mockRecoveryHub.momentumDelta}% vs LY
          </Text>
        </View>
        <Text style={[styles.velocityTitle, { color: '#ffffff' }]}>Recovery Velocity</Text>
        <View style={[styles.velocityBar, { backgroundColor: colors.border }]}>
          <View style={[styles.velocityFill, {
            backgroundColor: colors.accent,
            width: `${mockRecoveryHub.momentumScore}%` as any,
          }]} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.resumeBtn, { backgroundColor: colors.accent }]}
        onPress={() => router.push(`/project/${featuredProject.id}` as any)}
        activeOpacity={0.85}
      >
        <Ionicons name="play" size={16} color="#000000" />
        <Text style={styles.resumeBtnText}>Resume {featuredProject.name}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatBlock({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={[styles.statLabel, { color: '#5a5d63' }]}>{label}</Text>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 20,
  },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#ffffff', lineHeight: 34 },
  date: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#5a5d63', marginTop: 2 },
  avatarBtn: {},
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#c2ff00', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#000000' },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#141618', borderRadius: 14,
    borderWidth: 1, borderColor: '#252729',
    padding: 16,
  },
  statBlock: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 36, marginHorizontal: 8 },
  statLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 1 },
  statValue: { fontSize: 32, fontFamily: 'Inter_700Bold', lineHeight: 38 },
  insightBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginBottom: 24,
    borderRadius: 14, borderWidth: 1, padding: 16, gap: 12,
  },
  insightLeft: { flex: 1, gap: 6 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  insightDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  viewBtn: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  viewBtnText: { fontSize: 13, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  section: { marginHorizontal: 20, marginBottom: 20, gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  seeAll: { fontSize: 12, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5 },
  projectList: { gap: 8 },
  priorityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 12, borderWidth: 1, padding: 14,
  },
  priorityContent: { flex: 1, gap: 3 },
  priorityName: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  priorityMeta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  memoryNodeCard: {
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 14, borderWidth: 1,
    overflow: 'hidden', height: 100,
  },
  memoryNodeGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 14, zIndex: 2,
  },
  memoryNodeLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 1 },
  memoryNodeTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  nodeLines: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  nodeLine: { position: 'absolute', height: 1, borderRadius: 1 },
  velocityCard: {
    marginHorizontal: 20, marginBottom: 20,
    borderRadius: 14, borderWidth: 1, padding: 16, gap: 8,
  },
  velocityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  velocityIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  velocityDelta: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  velocityTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  velocityBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  velocityFill: { height: '100%', borderRadius: 2 },
  resumeBtn: {
    marginHorizontal: 20, borderRadius: 14, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  resumeBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#000000' },
});
