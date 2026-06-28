import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Platform, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { mockProjects } from '@/lib/data';

type Category = 'decision' | 'note' | 'blocker' | 'milestone';

const categories: { key: Category; label: string; icon: any; description: string }[] = [
  { key: 'decision', label: 'Decision', icon: 'flash', description: 'An architectural or product choice' },
  { key: 'note', label: 'Note', icon: 'document-text', description: 'Context or information to remember' },
  { key: 'blocker', label: 'Blocker', icon: 'warning', description: 'Something blocking progress' },
  { key: 'milestone', label: 'Milestone', icon: 'flag', description: 'A completed or upcoming goal' },
];

export default function CaptureScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('note');
  const [projectId, setProjectId] = useState('1');

  const handleCapture = () => {
    if (!content.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Captured!', 'Your memory has been saved to the project vault.', [
      { text: 'OK', onPress: () => setContent('') }
    ]);
  };

  const selectedProject = mockProjects.find(p => p.id === projectId);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: Platform.OS === 'web' ? 34 : 100 }
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Quick Capture</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Save anything to your project memory
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.foreground }]}>Type</Text>
        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryBtn,
                {
                  backgroundColor: category === cat.key ? colors.primary + '15' : colors.surface1,
                  borderColor: category === cat.key ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setCategory(cat.key)}
            >
              <Ionicons
                name={cat.icon}
                size={18}
                color={category === cat.key ? colors.primary : colors.mutedForeground}
              />
              <Text style={[
                styles.categoryLabel,
                { color: category === cat.key ? colors.primary : colors.foreground }
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.foreground }]}>Project</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll}>
          <View style={styles.projectRow}>
            {mockProjects.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.projectChip,
                  {
                    backgroundColor: projectId === p.id ? colors.primary : colors.surface1,
                    borderColor: projectId === p.id ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => setProjectId(p.id)}
              >
                <Text style={[
                  styles.projectChipText,
                  { color: projectId === p.id ? '#fff' : colors.foreground }
                ]} numberOfLines={1}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.foreground }]}>Memory</Text>
        <TextInput
          style={[styles.textInput, { color: colors.foreground, borderColor: colors.border }]}
          placeholder={`Add a ${category} about ${selectedProject?.name ?? 'this project'}...`}
          placeholderTextColor={colors.mutedForeground}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          fontFamily="Inter_400Regular"
        />
        <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
          {content.length} characters
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.captureBtn,
          { backgroundColor: content.trim() ? colors.primary : colors.muted }
        ]}
        onPress={handleCapture}
        disabled={!content.trim()}
        activeOpacity={0.8}
      >
        <Ionicons name="save" size={18} color={content.trim() ? '#fff' : colors.mutedForeground} />
        <Text style={[
          styles.captureBtnText,
          { color: content.trim() ? '#fff' : colors.mutedForeground }
        ]}>
          Save to Memory
        </Text>
      </TouchableOpacity>

      <View style={[styles.tip, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
        <Ionicons name="bulb-outline" size={16} color={colors.primary} />
        <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
          Every capture becomes searchable and linked to your project's recovery workspace.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  header: { gap: 4, paddingBottom: 4 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  label: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10,
    minWidth: '46%', flex: 1,
  },
  categoryLabel: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  projectScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  projectRow: { flexDirection: 'row', gap: 8 },
  projectChip: {
    borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, maxWidth: 180,
  },
  projectChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  textInput: {
    borderRadius: 10, borderWidth: 1, padding: 14,
    minHeight: 120, fontSize: 15, lineHeight: 22,
  },
  charCount: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'right' },
  captureBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderRadius: 14, paddingVertical: 16,
  },
  captureBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  tip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderRadius: 12, borderWidth: 1, padding: 14,
  },
  tipText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18, flex: 1 },
});
