import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, useColorScheme
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { ScoreRing } from '@/components/ScoreRing';
import { HealthBadge } from '@/components/HealthBadge';
import {
  mockProjects, getRecoveryWorkspace, getVaultEntriesForProject,
  getTimelineForProject, formatTimeAgo, formatDate
} from '@/lib/data';
import type { MilestoneStatus, TimelineEventType } from '@/lib/types';

type Tab = 'recovery' | 'timeline' | 'vault';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('recovery');

  const project = mockProjects.find(p => p.id === id) ?? mockProjects[0];
  const workspace = getRecoveryWorkspace(project.id);
  const vault = getVaultEntriesForProject(project.id);
  const timeline = getTimelineForProject(project.id);

  const [checklist, setChecklist] = useState(workspace.recoveryChecklist);
  const completedCount = checklist.filter(c => c.completed).length;

  const toggleCheck = (checkId: string) => {
    setChecklist(prev => prev.map(c => c.id === checkId ? { ...c, completed: !c.completed } : c));
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === 'web' ? 34 : 30 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroHeader}>
            <View style={styles.heroTitles}>
              <Text style={[styles.projectName, { color: colors.foreground }]}>{project.name}</Text>
              <Text style={[styles.projectDesc, { color: colors.mutedForeground }]}>{project.description}</Text>
              <View style={styles.tagsRow}>
                {project.tags.map(tag => (
                  <View key={tag} style={[styles.tag, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <HealthBadge health={project.health} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.statsRow}>
            <StatItem label="Resume Score" value={`${project.resumeScore}/100`} colors={colors} accent={colors.primary} />
            <StatItem label="Confidence" value={`${project.recoveryConfidence}%`} colors={colors} accent={colors.scoreHealthy} />
            <StatItem label="Last Active" value={formatTimeAgo(project.lastActivity)} colors={colors} accent={colors.mutedForeground} />
          </View>
        </View>

        <View style={styles.tabBar}>
          {(['recovery', 'timeline', 'vault'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                { borderColor: activeTab === tab ? colors.primary : 'transparent',
                  backgroundColor: activeTab === tab ? colors.primary + '12' : 'transparent' }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabLabel,
                { color: activeTab === tab ? colors.primary : colors.mutedForeground }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'recovery' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="flash" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Next Action</Text>
              </View>
              <View style={[styles.nextAction, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
                <Text style={[styles.nextActionText, { color: colors.foreground }]}>
                  {workspace.suggestedNextAction}
                </Text>
                <Text style={[styles.nextActionTime, { color: colors.mutedForeground }]}>
                  Est. {workspace.estimatedTimeToResume} to resume
                </Text>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="book" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Project Summary</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.foreground }]}>{workspace.projectSummary}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeader}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>Recovery Checklist</Text>
                </View>
                <Text style={[styles.checkProgress, { color: colors.mutedForeground }]}>
                  {completedCount}/{checklist.length}
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View style={[
                  styles.progressFill,
                  { backgroundColor: colors.scoreHealthy, width: `${(completedCount / checklist.length) * 100}%` as any }
                ]} />
              </View>
              {checklist.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checkItem}
                  onPress={() => toggleCheck(item.id)}
                >
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={item.completed ? colors.scoreHealthy : colors.mutedForeground}
                  />
                  <View style={styles.checkContent}>
                    <Text style={[
                      styles.checkTitle,
                      { color: item.completed ? colors.mutedForeground : colors.foreground,
                        textDecorationLine: item.completed ? 'line-through' : 'none' }
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.checkDesc, { color: colors.mutedForeground }]}>
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="list" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Pending Work</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.foreground }]}>{workspace.pendingWork}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="warning" size={18} color={colors.scoreWarning} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Blockers</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.foreground }]}>{workspace.blockers}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="flash" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Decisions</Text>
              </View>
              {workspace.decisions.map(d => (
                <View key={d.id} style={[styles.decisionItem, { borderColor: colors.border, backgroundColor: colors.surface1 }]}>
                  <Text style={[styles.decisionTitle, { color: colors.foreground }]}>{d.title}</Text>
                  <Text style={[styles.decisionRationale, { color: colors.mutedForeground }]}>{d.rationale}</Text>
                  {d.alternatives.length > 0 && (
                    <View style={styles.altRow}>
                      <Text style={[styles.altLabel, { color: colors.mutedForeground }]}>Alternatives: </Text>
                      <Text style={[styles.altText, { color: colors.foreground }]}>{d.alternatives.join(', ')}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="flag" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Milestones</Text>
              </View>
              {workspace.milestones.map(m => (
                <MilestoneRow key={m.id} milestone={m} colors={colors} />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'timeline' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Project History</Text>
              </View>
              <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
                {timeline.length} events recorded
              </Text>
            </View>
            {[...timeline].reverse().map((event, index) => (
              <TimelineEventRow key={event.id} event={event} colors={colors} isLast={index === timeline.length - 1} />
            ))}
          </View>
        )}

        {activeTab === 'vault' && (
          <View style={styles.tabContent}>
            <View style={styles.vaultFilters}>
              {['All', 'Decision', 'Resource', 'Note', 'Code'].map(f => (
                <View key={f} style={[styles.vaultChip, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
                  <Text style={[styles.vaultChipText, { color: colors.mutedForeground }]}>{f}</Text>
                </View>
              ))}
            </View>
            {vault.map(entry => (
              <View key={entry.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.vaultEntryHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(entry.category) + '15' }]}>
                    <Ionicons
                      name={getCategoryIcon(entry.category)}
                      size={16}
                      color={getCategoryColor(entry.category)}
                    />
                  </View>
                  <View style={styles.vaultTitleBlock}>
                    <Text style={[styles.vaultTitle, { color: colors.foreground }]}>{entry.title}</Text>
                    <Text style={[styles.vaultDate, { color: colors.mutedForeground }]}>
                      {formatDate(entry.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.vaultContent, { color: colors.foreground }]}>{entry.content}</Text>
                <View style={styles.vaultTags}>
                  {entry.tags.map(tag => (
                    <View key={tag} style={[styles.tag, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatItem({ label, value, colors, accent }: any) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function MilestoneRow({ milestone, colors }: any) {
  const statusColor = milestone.status === 'completed' ? colors.scoreHealthy
    : milestone.status === 'in-progress' ? colors.primary : colors.mutedForeground;

  return (
    <View style={[styles.milestoneItem, { borderColor: colors.border }]}>
      <View style={[styles.milestoneIcon, { backgroundColor: statusColor + '15' }]}>
        <Ionicons
          name={milestone.status === 'completed' ? 'checkmark-circle' : milestone.status === 'in-progress' ? 'hourglass' : 'time-outline'}
          size={16}
          color={statusColor}
        />
      </View>
      <View style={styles.milestoneContent}>
        <Text style={[styles.milestoneTitle, { color: colors.foreground }]}>{milestone.title}</Text>
        <Text style={[styles.milestoneDesc, { color: colors.mutedForeground }]}>{milestone.description}</Text>
        {milestone.status !== 'planned' && (
          <View style={[styles.milestoneBar, { backgroundColor: colors.border }]}>
            <View style={[styles.milestoneFill, { backgroundColor: statusColor, width: `${milestone.percentComplete}%` as any }]} />
          </View>
        )}
      </View>
      <View style={[styles.milestonePct, { backgroundColor: statusColor + '15' }]}>
        <Text style={[styles.milestonePctText, { color: statusColor }]}>{milestone.percentComplete}%</Text>
      </View>
    </View>
  );
}

function TimelineEventRow({ event, colors, isLast }: any) {
  const iconMap: Record<TimelineEventType, string> = {
    created: 'add-circle',
    milestone: 'checkmark-circle',
    decision: 'flash',
    paused: 'pause-circle',
    resumed: 'play-circle',
    note: 'document-text',
  };
  const colorMap: Record<TimelineEventType, string> = {
    created: colors.primary,
    milestone: colors.scoreHealthy,
    decision: colors.scoreWarning,
    paused: colors.healthAtRisk,
    resumed: colors.scoreHealthy,
    note: colors.mutedForeground,
  };

  const iconColor = colorMap[event.type as TimelineEventType] ?? colors.mutedForeground;

  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: iconColor + '20', borderColor: iconColor }]}>
          <Ionicons name={iconMap[event.type as TimelineEventType] as any} size={14} color={iconColor} />
        </View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
      </View>
      <View style={[styles.timelineContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.timelineHeader}>
          <Text style={[styles.timelineTitle, { color: colors.foreground }]}>{event.title}</Text>
          <View style={[styles.timelineBadge, { backgroundColor: iconColor + '15', borderColor: iconColor + '40' }]}>
            <Text style={[styles.timelineBadgeText, { color: iconColor }]}>{event.type}</Text>
          </View>
        </View>
        <Text style={[styles.timelineDesc, { color: colors.mutedForeground }]}>{event.description}</Text>
        <Text style={[styles.timelineDate, { color: colors.mutedForeground }]}>{formatDate(event.timestamp)}</Text>
      </View>
    </View>
  );
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case 'decision': return '#f59e0b';
    case 'resource': return '#3b82f6';
    case 'code': return '#8b5cf6';
    default: return '#6b7280';
  }
}

function getCategoryIcon(cat: string): any {
  switch (cat) {
    case 'decision': return 'flash';
    case 'resource': return 'link';
    case 'code': return 'code-slash';
    default: return 'document-text';
  }
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 16, gap: 14 },
  heroCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 16 },
  heroHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  heroTitles: { flex: 1, gap: 6 },
  projectName: { fontSize: 22, fontFamily: 'Inter_700Bold', lineHeight: 28 },
  projectDesc: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  divider: { height: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  tabBar: { flexDirection: 'row', gap: 8 },
  tabBtn: {
    flex: 1, borderRadius: 10, borderWidth: 1.5,
    paddingVertical: 10, alignItems: 'center',
  },
  tabLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  tabContent: { gap: 14 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  cardSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  bodyText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  nextAction: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 6 },
  nextActionText: { fontSize: 15, fontFamily: 'Inter_500Medium', lineHeight: 22 },
  nextActionTime: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  checkProgress: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  checkItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 },
  checkContent: { flex: 1, gap: 2 },
  checkTitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  checkDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  decisionItem: { borderRadius: 10, borderWidth: 1, padding: 12, gap: 6 },
  decisionTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  decisionRationale: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  altRow: { flexDirection: 'row', flexWrap: 'wrap' },
  altLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  altText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  milestoneItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderBottomWidth: 1, paddingBottom: 12 },
  milestoneIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  milestoneContent: { flex: 1, gap: 6 },
  milestoneTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  milestoneDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  milestoneBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  milestoneFill: { height: 4, borderRadius: 2 },
  milestonePct: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  milestonePctText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineLeft: { alignItems: 'center', width: 32, paddingTop: 16 },
  timelineDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { flex: 1, width: 2, marginTop: 6 },
  timelineContent: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 14, gap: 6, marginBottom: 12 },
  timelineHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  timelineTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', flex: 1 },
  timelineBadge: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  timelineBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  timelineDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  timelineDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  vaultFilters: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  vaultChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  vaultChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  vaultEntryHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  categoryIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  vaultTitleBlock: { flex: 1, gap: 2 },
  vaultTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  vaultDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  vaultContent: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  vaultTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
});
