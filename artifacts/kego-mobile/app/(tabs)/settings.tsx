import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch,
  TouchableOpacity, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface SettingRow {
  id: string;
  icon: any;
  iconLib?: 'ionicons' | 'feather';
  label: string;
  description?: string;
  type: 'toggle' | 'nav' | 'info';
  danger?: boolean;
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [notifications, setNotifications] = useState(true);
  const [graveyard, setGraveyard] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: Platform.OS === 'web' ? 34 : 100 }
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>

      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>AJ</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.foreground }]}>Arjun Joshi</Text>
          <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>arjun@example.com</Text>
        </View>
        <View style={[styles.proBadge, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
          <Text style={[styles.proBadgeText, { color: colors.primary }]}>Free</Text>
        </View>
      </View>

      <SettingSection title="Notifications" colors={colors}>
        <ToggleRow
          icon="notifications"
          label="Smart Alerts"
          description="Graveyard detection and recovery nudges"
          value={notifications}
          onToggle={setNotifications}
          colors={colors}
        />
        <ToggleRow
          icon="hourglass"
          label="Graveyard Detection"
          description="Alert when a project goes 12 days idle"
          value={graveyard}
          onToggle={setGraveyard}
          colors={colors}
        />
        <ToggleRow
          icon="sunny"
          label="Daily Reminder"
          description="Morning check-in prompt"
          value={dailyReminder}
          onToggle={setDailyReminder}
          colors={colors}
        />
      </SettingSection>

      <SettingSection title="Upgrade" colors={colors}>
        <View style={[styles.proCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <View style={styles.proCardHeader}>
            <Ionicons name="flash" size={20} color={colors.primary} />
            <Text style={[styles.proTitle, { color: colors.foreground }]}>KeGo Pro</Text>
          </View>
          <View style={styles.proFeatures}>
            {['Unlimited projects', 'AI Recovery Cards', 'Cross-project intelligence', 'Priority support'].map(f => (
              <View key={f} style={styles.proFeatureRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.scoreHealthy} />
                <Text style={[styles.proFeatureText, { color: colors.foreground }]}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.upgradeBtnText}>Upgrade — $9/mo</Text>
          </TouchableOpacity>
        </View>
      </SettingSection>

      <SettingSection title="Data" colors={colors}>
        <NavRow icon="download-outline" label="Export All Data" colors={colors} />
        <NavRow icon="cloud-upload-outline" label="Backup to Cloud" colors={colors} />
        <NavRow icon="git-branch-outline" label="GitHub Integration" colors={colors} />
      </SettingSection>

      <SettingSection title="About" colors={colors}>
        <InfoRow icon="information-circle-outline" label="Version" value="1.0.0" colors={colors} />
        <NavRow icon="shield-checkmark-outline" label="Privacy Policy" colors={colors} />
        <NavRow icon="document-text-outline" label="Terms of Service" colors={colors} />
      </SettingSection>

      <SettingSection title="Danger Zone" colors={colors}>
        <TouchableOpacity style={[styles.dangerBtn, { borderColor: colors.destructive + '40', backgroundColor: colors.destructive + '08' }]}>
          <Ionicons name="trash-outline" size={16} color={colors.destructive} />
          <Text style={[styles.dangerText, { color: colors.destructive }]}>Delete Account</Text>
        </TouchableOpacity>
      </SettingSection>
    </ScrollView>
  );
}

function SettingSection({ title, children, colors }: any) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{title.toUpperCase()}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

function ToggleRow({ icon, label, description, value, onToggle, colors }: any) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        {description && (
          <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary + '60' }}
        thumbColor={value ? colors.primary : colors.mutedForeground}
      />
    </View>
  );
}

function NavRow({ icon, label, colors, danger }: any) {
  return (
    <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
      <View style={[styles.rowIcon, { backgroundColor: danger ? colors.destructive + '15' : colors.surface1 }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.destructive : colors.mutedForeground} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? colors.destructive : colors.foreground, flex: 1 }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

function InfoRow({ icon, label, value, colors }: any) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surface1 }]}>
        <Ionicons name={icon} size={18} color={colors.mutedForeground} />
      </View>
      <Text style={[styles.rowLabel, { color: colors.foreground, flex: 1 }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 24 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  profileCard: {
    borderRadius: 16, borderWidth: 1, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontFamily: 'Inter_700Bold' },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  proBadge: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  proBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  section: { gap: 8 },
  sectionTitle: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8, marginLeft: 4 },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  rowDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  rowValue: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  proCard: { borderRadius: 12, borderWidth: 1, padding: 16, margin: 12, gap: 14 },
  proCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  proTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  proFeatures: { gap: 8 },
  proFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  proFeatureText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  upgradeBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  upgradeBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 12, borderWidth: 1, margin: 12, paddingVertical: 14,
  },
  dangerText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
