import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { ProjectCard } from '@/components/ProjectCard';
import { mockProjects } from '@/lib/data';

const recommendations = [
  { projectId: '1', label: 'Best to resume', color: '#22c55e', reason: '92% context complete — waitlist integration next' },
  { projectId: '5', label: 'Quickest win', color: '#3b82f6', reason: '85% done — could ship in 2-3 hours' },
  { projectId: '4', label: 'At risk', color: '#f59e0b', reason: 'No activity in 6 months — fading fast' },
];

export default function DashboardScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const totalProjects = mockProjects.length;
  const healthyCount = mockProjects.filter(p => p.health === 'healthy').length;
  const needAttentionCount = mockProjects.filter(p => p.health !== 'healthy').length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: Platform.OS === 'web' ? 34 : 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="aperture" size={18} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.foreground }]}>KeGo</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface1 }]}>
            <Feather name="search" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface1 }]}>
            <Ionicons name="notifications-outline" size={18} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={[styles.greetingTitle, { color: colors.foreground }]}>Good morning 👋</Text>
        <Text style={[styles.greetingSubtitle, { color: colors.mutedForeground }]}>
          You have {needAttentionCount} projects needing attention
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Total" value={totalProjects} color={colors.primary} colors={colors} />
        <StatCard label="Healthy" value={healthyCount} color={colors.scoreHealthy} colors={colors} />
        <StatCard label="At Risk" value={needAttentionCount} color={colors.scoreWarning} colors={colors} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recovery Recommendations</Text>
        <View style={styles.recommendations}>
          {recommendations.map(rec => {
            const project = mockProjects.find(p => p.id === rec.projectId);
            if (!project) return null;
            return (
              <TouchableOpacity
                key={rec.projectId}
                style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/project/${rec.projectId}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.recHeader}>
                  <Text style={[styles.recName, { color: colors.foreground }]} numberOfLines={1}>
                    {project.name}
                  </Text>
                  <View style={[styles.recLabel, { backgroundColor: rec.color + '20', borderColor: rec.color + '40' }]}>
                    <Text style={[styles.recLabelText, { color: rec.color }]}>{rec.label}</Text>
                  </View>
                </View>
                <Text style={[styles.recReason, { color: colors.mutedForeground }]}>{rec.reason}</Text>
                <View style={styles.recFooter}>
                  <Text style={[styles.resumeText, { color: colors.primary }]}>Resume →</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/projects' as any)}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.projectList}>
          {mockProjects.slice(0, 3).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, color, colors }: { label: string; value: number; color: string; colors: any }) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 24 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  topActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  greeting: { gap: 4 },
  greetingTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  greetingSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  section: { gap: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  viewAll: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  recommendations: { gap: 10 },
  recCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  recHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  recName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', flex: 1 },
  recLabel: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  recLabelText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  recReason: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  recFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  resumeText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  projectList: { gap: 10 },
});
