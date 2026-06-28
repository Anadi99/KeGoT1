import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { ScoreRing } from '@/components/ScoreRing';
import { HealthBadge } from '@/components/HealthBadge';
import { mockProjects, formatTimeAgo, getHealthLabel } from '@/lib/data';
import type { ProjectHealth } from '@/lib/types';

type Filter = 'all' | ProjectHealth;

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'recovering', label: 'Recovering' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'active', label: 'Active' },
  { key: 'at-risk', label: 'At Risk' },
  { key: 'stalled', label: 'Stalled' },
  { key: 'dormant', label: 'Dormant' },
  { key: 'recovered', label: 'Recovered' },
];

export default function ProjectsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === 'web' ? 16 : insets.top + 8;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = mockProjects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.health === filter;
    return matchSearch && matchFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: '#ffffff' }]}>Projects</Text>
          <Text style={[styles.count, { color: colors.mutedForeground }]}>{mockProjects.length} tracked</Text>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: '#ffffff', fontFamily: 'Inter_400Regular' }]}
            placeholder="Search projects..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === item.key ? colors.accent : colors.card,
                  borderColor: filter === item.key ? colors.accent : colors.border,
                }
              ]}
              onPress={() => setFilter(item.key)}
            >
              <Text style={[
                styles.filterText,
                { color: filter === item.key ? '#000000' : colors.mutedForeground }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === 'web' ? 80 : 100 }
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No projects found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push(`/project/${item.id}` as any)}
            activeOpacity={0.7}
          >
            <ScoreRing score={item.resumeScore} size={52} strokeWidth={3} />
            <View style={styles.rowContent}>
              <View style={styles.rowTop}>
                <Text style={[styles.rowName, { color: '#ffffff' }]} numberOfLines={1}>{item.name}</Text>
                <HealthBadge health={item.health} size="sm" />
              </View>
              <Text style={[styles.rowDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.description}
              </Text>
              <View style={styles.rowMeta}>
                {item.currentPhase && (
                  <Text style={[styles.rowPhase, { color: colors.mutedForeground }]}>
                    {item.currentPhase}
                  </Text>
                )}
                <Text style={[styles.rowTime, { color: colors.mutedForeground }]}>
                  {formatTimeAgo(item.lastActivity)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, gap: 14, paddingBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  count: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 44,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { gap: 8 },
  filterChip: {
    borderRadius: 8, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8,
  },
  filterText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  empty: { alignItems: 'center', gap: 12, paddingTop: 60 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 14, borderWidth: 1, padding: 14,
  },
  rowContent: { flex: 1, gap: 4 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rowName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', flex: 1 },
  rowDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  rowMeta: { flexDirection: 'row', gap: 8 },
  rowPhase: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  rowTime: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
