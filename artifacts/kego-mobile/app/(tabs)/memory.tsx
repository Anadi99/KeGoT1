import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, TextInput, type DimensionValue
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import {
  mockProjects, mockAIInsights, mockVaultEntries,
  getVaultEntriesForProject
} from '@/lib/data';

const allVaultEntries = mockVaultEntries;
const totalMilestones = 124;
const aiCoherence = 98.2;

const NODES: { x: DimensionValue; y: DimensionValue; size: number; color: string }[] = [
  { x: '15%', y: '20%', size: 18, color: '#c2ff00' },
  { x: '55%', y: '12%', size: 12, color: '#3b82f6' },
  { x: '75%', y: '35%', size: 20, color: '#c2ff00' },
  { x: '30%', y: '45%', size: 14, color: '#f59e0b' },
  { x: '60%', y: '55%', size: 16, color: '#3b82f6' },
  { x: '20%', y: '68%', size: 10, color: '#c2ff00' },
  { x: '80%', y: '70%', size: 18, color: '#c2ff00' },
  { x: '45%', y: '80%', size: 12, color: '#8b5cf6' },
];

const LINES: { x1: DimensionValue; y1: DimensionValue; x2: DimensionValue; y2: DimensionValue }[] = [
  { x1: '15%', y1: '20%', x2: '55%', y2: '12%' },
  { x1: '55%', y1: '12%', x2: '75%', y2: '35%' },
  { x1: '15%', y1: '20%', x2: '30%', y2: '45%' },
  { x1: '75%', y1: '35%', x2: '60%', y2: '55%' },
  { x1: '30%', y1: '45%', x2: '60%', y2: '55%' },
  { x1: '20%', y1: '68%', x2: '45%', y2: '80%' },
  { x1: '80%', y1: '70%', x2: '45%', y2: '80%' },
];

export default function MemoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 16 : insets.top + 8;
  const [search, setSearch] = useState('');
  const [activeInsight, setActiveInsight] = useState(0);

  const insight = mockAIInsights[activeInsight];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: Platform.OS === 'web' ? 80 : 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>F</Text>
          </View>
          <Text style={[styles.title, { color: '#ffffff' }]}>Project Memory</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface2 }]}>
            <Feather name="search" size={16} color="#8a8d93" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statCardLabel, { color: colors.mutedForeground }]}>TOTAL{'\n'}MILESTONES</Text>
          <Text style={[styles.statCardValue, { color: '#ffffff' }]}>{totalMilestones}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statCardLabel, { color: colors.mutedForeground }]}>AI{'\n'}COHERENCE</Text>
          <View style={styles.coherenceRow}>
            <View style={[styles.coherenceDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.statCardValue, { color: colors.accent }]}>{aiCoherence}%</Text>
          </View>
        </View>
      </View>

      <View style={[styles.graphContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.graphInner}>
          {LINES.map((line, i) => (
            <View
              key={i}
              style={[
                styles.graphLine,
                {
                  left: line.x1,
                  top: line.y1,
                  width: 60,
                  backgroundColor: '#c2ff0020',
                }
              ]}
            />
          ))}
          {NODES.map((node, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.graphNode,
                {
                  left: node.x,
                  top: node.y,
                  width: node.size,
                  height: node.size,
                  borderRadius: node.size / 2,
                  backgroundColor: node.color + '30',
                  borderColor: node.color,
                  borderWidth: 1.5,
                }
              ]}
            />
          ))}

          <View style={[styles.aiInsightCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
            <View style={styles.aiInsightHeader}>
              <Text style={[styles.aiInsightTag, { color: colors.accent }]}>AI INSIGHT</Text>
              <TouchableOpacity onPress={() => setActiveInsight((activeInsight + 1) % mockAIInsights.length)}>
                <Ionicons name="ellipsis-horizontal" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.aiInsightTitle, { color: '#ffffff' }]}>{insight.title}</Text>
            <Text style={[styles.aiInsightDesc, { color: colors.textSecondary }]}>
              {insight.description}
            </Text>
            <TouchableOpacity style={[styles.executeBtn, { backgroundColor: colors.accent }]}>
              <Text style={styles.executeBtnText}>{insight.action ?? 'EXECUTE'}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.nodeIndicator, { borderColor: '#3b82f6', backgroundColor: '#3b82f640' }]}>
            <Ionicons name="git-commit-outline" size={14} color="#3b82f6" />
          </View>
        </View>
      </View>

      <View style={styles.filterBar}>
        {[
          { icon: 'options-outline', label: '' },
          { icon: 'search-outline', label: '' },
          { icon: 'expand-outline', label: '' },
          { icon: 'settings-outline', label: '' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.filterBtn, {
              backgroundColor: i === 2 ? colors.surface2 : 'transparent',
              borderColor: colors.border,
            }]}
          >
            <Ionicons name={item.icon as any} size={18} color={i === 2 ? '#ffffff' : colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>Knowledge Vault</Text>
        <View style={styles.vaultList}>
          {allVaultEntries.slice(0, 5).map(entry => (
            <TouchableOpacity
              key={entry.id}
              style={[styles.vaultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.75}
            >
              <View style={styles.vaultHeader}>
                <View style={[styles.vaultCategoryTag, {
                  backgroundColor: entry.critical ? colors.accent + '20' : colors.surface2,
                  borderColor: entry.critical ? colors.accent + '50' : colors.border,
                }]}>
                  <Text style={[styles.vaultCategoryText, {
                    color: entry.critical ? colors.accent : colors.mutedForeground,
                  }]}>
                    {entry.category.toUpperCase()}
                  </Text>
                </View>
                {entry.status && (
                  <View style={[styles.statusTag, {
                    backgroundColor: '#22c55e20',
                    borderColor: '#22c55e40',
                  }]}>
                    <Text style={[styles.statusText, { color: '#22c55e' }]}>
                      {entry.status.toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={[styles.vaultDate, { color: colors.mutedForeground }]}>
                  {entry.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <Text style={[styles.vaultTitle, { color: '#ffffff' }]}>{entry.title}</Text>
              <Text style={[styles.vaultContent, { color: colors.textSecondary }]} numberOfLines={2}>
                {entry.content}
              </Text>
              {entry.tags && entry.tags.length > 0 && (
                <View style={styles.vaultTags}>
                  {entry.tags.slice(0, 3).map(tag => (
                    <View key={tag} style={[styles.tag, { backgroundColor: colors.surface2 }]}>
                      <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { flexDirection: 'row', gap: 8 },
  avatarSmall: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#c2ff00', alignItems: 'center', justifyContent: 'center',
  },
  avatarSmallText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#000000' },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  iconBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 16 },
  statCard: {
    flex: 1, borderRadius: 14, borderWidth: 1,
    padding: 14, gap: 8,
  },
  statCardLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8 },
  statCardValue: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  coherenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coherenceDot: { width: 7, height: 7, borderRadius: 4 },
  graphContainer: {
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 16, borderWidth: 1, overflow: 'hidden',
    height: 300,
  },
  graphInner: {
    flex: 1, position: 'relative',
    backgroundColor: '#0d0f10',
  },
  graphLine: { position: 'absolute', height: 1 },
  graphNode: { position: 'absolute', transform: [{ translateX: -8 }, { translateY: -8 }] },
  aiInsightCard: {
    position: 'absolute', left: 16, right: 16, bottom: 16,
    borderRadius: 14, borderWidth: 1, padding: 16, gap: 10,
  },
  aiInsightHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiInsightTag: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  aiInsightTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  aiInsightDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  executeBtn: { borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  executeBtnText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#000000', letterSpacing: 1 },
  nodeIndicator: {
    position: 'absolute', right: 20, top: '50%',
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  filterBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 24,
    backgroundColor: '#141618', borderRadius: 50,
    borderWidth: 1, borderColor: '#252729',
    padding: 6, gap: 4,
    alignSelf: 'center',
  },
  filterBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  section: { paddingHorizontal: 20, gap: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  vaultList: { gap: 10 },
  vaultCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  vaultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vaultCategoryTag: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  vaultCategoryText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  statusTag: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  vaultDate: { fontSize: 11, fontFamily: 'Inter_400Regular', marginLeft: 'auto' },
  vaultTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', lineHeight: 22 },
  vaultContent: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  vaultTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
