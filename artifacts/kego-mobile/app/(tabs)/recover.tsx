import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import {
  mockProjects, mockRecoveryHub, mockTimeline,
  formatTimeAgo, formatShortDate
} from '@/lib/data';

const featuredProject = mockProjects[0];
const timeline = mockTimeline.filter(e => e.projectId === '1');

export default function RecoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === 'web' ? 16 : insets.top + 8;
  const [activated, setActivated] = useState(false);

  const daysSince = 42;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: Platform.OS === 'web' ? 80 : 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="aperture" size={14} color="#000" />
          </View>
          <Text style={[styles.logoText, { color: '#ffffff' }]}>KeGo</Text>
        </View>
        <View style={[styles.syncBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.syncText, { color: colors.mutedForeground }]}>{daysSince}d Since Last Sync</Text>
        </View>
      </View>

      <View style={styles.heroSection}>
        <Text style={[styles.reconstructionTag, { color: colors.accent }]}>
          MEMORY RECONSTRUCTION COMPLETE
        </Text>
        <Text style={[styles.heroTitle, { color: '#ffffff' }]}>Memory{'\n'}Restored</Text>
      </View>

      <View style={[styles.mainInsightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.insightHeader}>
          <Text style={{ fontSize: 14, color: colors.accent }}>✦</Text>
          <Text style={[styles.insightTitle, { color: '#ffffff' }]}>Main Insight</Text>
        </View>
        <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>
          You were connecting the Supabase Auth flow when you paused.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.timelineHeader}>
          <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>Recovery{'\n'}Timeline</Text>
          <View style={styles.timelineProject}>
            <Text style={[styles.timelineProjectName, { color: colors.accent }]}>
              {featuredProject.name} /
            </Text>
            <Text style={[styles.timelineProjectPhase, { color: colors.mutedForeground }]}>
              {'\n'}Sprint 4
            </Text>
          </View>
        </View>

        <View style={styles.timelineList}>
          {timeline.map((event, index) => {
            const isCompleted = event.status === 'completed';
            const isActive = event.status === 'active';
            const isUpcoming = event.status === 'upcoming';
            const dotColor = isCompleted ? colors.accent : isActive ? '#3b82f6' : '#5a5d63';

            return (
              <View key={event.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    {
                      borderColor: dotColor,
                      backgroundColor: isCompleted ? colors.accent + '20' : isActive ? '#3b82f620' : 'transparent',
                    }
                  ]}>
                    {isCompleted && <Ionicons name="checkmark" size={10} color={colors.accent} />}
                    {isActive && <View style={[styles.activeDotInner, { backgroundColor: '#3b82f6' }]} />}
                    {isUpcoming && <Text style={{ fontSize: 10, color: '#5a5d63' }}>Λ</Text>}
                  </View>
                  {index < timeline.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: '#ffffff' }]}>{event.title}</Text>
                  <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>{event.description}</Text>
                  {isCompleted && (
                    <Text style={[styles.timelineMeta, { color: colors.mutedForeground }]}>
                      COMPLETED {Math.floor((Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60 * 24))}D AGO
                    </Text>
                  )}
                  {isActive && (
                    <View style={[styles.activeTag, { backgroundColor: '#3b82f620', borderColor: '#3b82f640' }]}>
                      <Text style={[styles.activeTagText, { color: '#3b82f6' }]}>ACTIVE RESTORATION POINT</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="server" size={18} color={colors.accent} style={{ marginBottom: 6 }} />
          <Text style={[styles.statCardLabel, { color: colors.mutedForeground }]}>Context Restored</Text>
          <Text style={[styles.statCardValue, { color: '#ffffff' }]}>
            {featuredProject.contextSizeGB}GB
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="analytics" size={18} color={colors.accent} style={{ marginBottom: 6 }} />
          <Text style={[styles.statCardLabel, { color: colors.mutedForeground }]}>Confidence</Text>
          <Text style={[styles.statCardValue, { color: colors.accent }]}>
            {featuredProject.recoveryConfidence}%
          </Text>
        </View>
      </View>

      <View style={[styles.terminalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.terminalHeader, { borderBottomColor: colors.border }]}>
          <Ionicons name="terminal" size={14} color={colors.accent} />
          <Text style={[styles.terminalTag, { color: colors.accent }]}>TERMINAL INSTANCE CACHED</Text>
        </View>
        <Text style={[styles.terminalCommand, { color: '#ffffff' }]}>
          "Running `npm run dev` will{'\n'}restore the local server state{'\n'}exactly as it was on Dec 14."
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>Recovery Inbox</Text>
        {mockRecoveryHub.inbox.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.inboxCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/project/${item.projectId}` as any)}
            activeOpacity={0.75}
          >
            <View style={styles.inboxLeft}>
              <View style={[styles.inboxIcon, {
                backgroundColor: item.priority === 'high' ? colors.accent + '20' : colors.surface2,
              }]}>
                <Ionicons
                  name={item.type === 'recovery' ? 'refresh-circle' : item.type === 'sync' ? 'cloud-download' : 'bulb'}
                  size={16}
                  color={item.priority === 'high' ? colors.accent : colors.mutedForeground}
                />
              </View>
              <View style={styles.inboxContent}>
                <Text style={[styles.inboxProject, { color: colors.mutedForeground }]}>{item.projectName}</Text>
                <Text style={[styles.inboxTitle, { color: '#ffffff' }]}>{item.title}</Text>
                <Text style={[styles.inboxTime, { color: colors.mutedForeground }]}>
                  LAST SYNCED: {formatTimeAgo(item.lastSynced)}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.recoverBtn, { borderColor: colors.accent + '50', backgroundColor: colors.accent + '15' }]}>
              <Text style={[styles.recoverBtnText, { color: colors.accent }]}>RECOVER</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>Daily Summaries</Text>
        {mockRecoveryHub.dailySummaries.map((summary, i) => (
          <View key={i} style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryHeader}>
              <Text style={[styles.summaryDate, { color: colors.accent }]}>
                {formatShortDate(summary.date)}
              </Text>
              <Text style={[styles.summaryHours, { color: colors.mutedForeground }]}>
                {summary.hoursWorked}h worked
              </Text>
            </View>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
              {summary.progressRecap}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.activateBtn,
          { backgroundColor: activated ? colors.success : colors.accent }
        ]}
        onPress={() => setActivated(true)}
        activeOpacity={0.85}
      >
        <Ionicons name={activated ? 'checkmark-circle' : 'flash'} size={18} color="#000" />
        <Text style={styles.activateBtnText}>
          {activated ? 'Recovery Active' : 'Activate Recovery'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  syncBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6,
  },
  syncText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  heroSection: { paddingHorizontal: 20, paddingVertical: 20, gap: 6 },
  reconstructionTag: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  heroTitle: { fontSize: 44, fontFamily: 'Inter_700Bold', lineHeight: 50 },
  mainInsightCard: {
    marginHorizontal: 20, marginBottom: 24,
    borderRadius: 14, borderWidth: 1, padding: 16, gap: 10,
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  insightTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  insightDesc: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  section: { paddingHorizontal: 20, marginBottom: 24, gap: 12 },
  timelineHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', lineHeight: 26 },
  timelineProject: { alignItems: 'flex-end' },
  timelineProjectName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  timelineProjectPhase: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  timelineList: { gap: 0 },
  timelineItem: { flexDirection: 'row', gap: 14 },
  timelineLeft: { alignItems: 'center', width: 28, paddingTop: 2 },
  timelineDot: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  activeDotInner: { width: 8, height: 8, borderRadius: 4 },
  timelineLine: { flex: 1, width: 2, minHeight: 20, marginTop: 4, marginBottom: 4 },
  timelineContent: { flex: 1, paddingBottom: 20, gap: 4 },
  timelineTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  timelineDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  timelineMeta: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5 },
  activeTag: {
    borderRadius: 6, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start',
  },
  activeTagText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 16 },
  statCard: {
    flex: 1, borderRadius: 14, borderWidth: 1, padding: 14,
  },
  statCardLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  statCardValue: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  terminalCard: {
    marginHorizontal: 20, marginBottom: 24,
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
  },
  terminalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderBottomWidth: 1, padding: 10, paddingHorizontal: 14,
  },
  terminalTag: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  terminalCommand: {
    padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22,
    fontStyle: 'italic',
  },
  inboxCard: {
    borderRadius: 12, borderWidth: 1, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  inboxLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  inboxIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  inboxContent: { flex: 1, gap: 2 },
  inboxProject: { fontSize: 10, fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },
  inboxTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  inboxTime: { fontSize: 10, fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },
  recoverBtn: {
    borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6,
  },
  recoverBtnText: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  summaryCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryDate: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  summaryHours: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  summaryText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  activateBtn: {
    marginHorizontal: 20, borderRadius: 14, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  activateBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#000000' },
});
