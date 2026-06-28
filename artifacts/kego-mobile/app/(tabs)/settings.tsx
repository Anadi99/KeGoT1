import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch,
  TouchableOpacity, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 16 : insets.top + 8;
  const [notifications, setNotifications] = useState(true);
  const [graveyard, setGraveyard] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [autoSnapshot, setAutoSnapshot] = useState(true);
  const [neuralWarmup, setNeuralWarmup] = useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: Platform.OS === 'web' ? 80 : 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: '#ffffff' }]}>Settings</Text>

      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={styles.avatarText}>F</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: '#ffffff' }]}>Founder</Text>
          <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>founder@kego.app</Text>
        </View>
        <View style={[styles.freeBadge, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
          <Text style={[styles.freeBadgeText, { color: colors.mutedForeground }]}>FREE</Text>
        </View>
      </View>

      <SettingSection title="Intelligence" colors={colors}>
        <ToggleRow icon="flash" label="Smart Alerts" description="Recovery nudges and momentum analysis" value={notifications} onToggle={setNotifications} colors={colors} />
        <ToggleRow icon="warning" label="Graveyard Detection" description="Alert when a project goes 12 days idle" value={graveyard} onToggle={setGraveyard} colors={colors} />
        <ToggleRow icon="camera" label="Auto Snapshot" description="Capture context automatically on pause" value={autoSnapshot} onToggle={setAutoSnapshot} colors={colors} last />
      </SettingSection>

      <SettingSection title="Recovery" colors={colors}>
        <ToggleRow icon="sunny" label="Daily Reminder" description="Morning check-in prompt" value={dailyReminder} onToggle={setDailyReminder} colors={colors} />
        <ToggleRow icon="fitness" label="Neural Warm-Up" description="AI-generated contextual re-entry quotes" value={neuralWarmup} onToggle={setNeuralWarmup} colors={colors} last />
      </SettingSection>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>UPGRADE</Text>
        <View style={[styles.proCard, { borderColor: colors.accent + '40', backgroundColor: colors.card }]}>
          <View style={[styles.proGlow, { backgroundColor: colors.accent + '08' }]} />
          <View style={styles.proHeader}>
            <Text style={{ fontSize: 16, color: colors.accent }}>✦</Text>
            <Text style={[styles.proTitle, { color: '#ffffff' }]}>KeGo Pro</Text>
          </View>
          <View style={styles.proFeatures}>
            {[
              'Unlimited projects & vault entries',
              'AI Recovery Cards & reconstruction',
              'Cross-project memory intelligence',
              'Semantic search & memory graph',
              'Real-time GitHub & email sync',
              'GDPR export + account management',
            ].map(f => (
              <View key={f} style={styles.proFeatureRow}>
                <View style={[styles.featureDot, { backgroundColor: colors.accent }]} />
                <Text style={[styles.proFeatureText, { color: colors.textSecondary }]}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={[styles.upgradeBtn, { backgroundColor: colors.accent }]}>
            <Text style={styles.upgradeBtnText}>Upgrade — $29/mo</Text>
          </TouchableOpacity>
          <Text style={[styles.proNote, { color: colors.mutedForeground }]}>Cancel anytime. Billed monthly.</Text>
        </View>
      </View>

      <SettingSection title="Data & Export" colors={colors}>
        <NavRow icon="download-outline" label="Export All Data" description="JSON format — all projects, vault, timeline" colors={colors} />
        <NavRow icon="cloud-upload-outline" label="Backup to Cloud" colors={colors} />
        <NavRow icon="logo-github" label="GitHub Integration" description="Sync commits as timeline events" colors={colors} />
        <NavRow icon="mail-outline" label="Email Ingestion" description="Send emails to project inboxes" colors={colors} last />
      </SettingSection>

      <SettingSection title="Privacy & Security" colors={colors}>
        <NavRow icon="shield-checkmark-outline" label="Encryption at Rest" description="AES-256-GCM" colors={colors} value="On" />
        <NavRow icon="document-text-outline" label="Audit Log" description="All mutations tracked" colors={colors} />
        <NavRow icon="person-remove-outline" label="Right to be Forgotten" description="GDPR — delete all data" colors={colors} last />
      </SettingSection>

      <SettingSection title="About" colors={colors}>
        <InfoRow icon="information-circle-outline" label="Version" value="1.0.0" colors={colors} />
        <NavRow icon="shield-outline" label="Privacy Policy" colors={colors} />
        <NavRow icon="document-outline" label="Terms of Service" colors={colors} last />
      </SettingSection>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DANGER ZONE</Text>
        <TouchableOpacity style={[styles.dangerBtn, { borderColor: colors.error + '40', backgroundColor: colors.error + '0a' }]}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={[styles.dangerText, { color: colors.error }]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SettingSection({ title, children, colors }: any) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{title.toUpperCase()}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

function ToggleRow({ icon, label, description, value, onToggle, colors, last }: any) {
  return (
    <View style={[styles.row, { borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.accent + '18' }]}>
        <Ionicons name={icon} size={17} color={colors.accent} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: '#ffffff' }]}>{label}</Text>
        {description && <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.accent + '60' }}
        thumbColor={value ? colors.accent : '#5a5d63'}
      />
    </View>
  );
}

function NavRow({ icon, label, description, colors, value, last }: any) {
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.surface2 }]}>
        <Ionicons name={icon} size={17} color={colors.mutedForeground} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: '#ffffff' }]}>{label}</Text>
        {description && <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{description}</Text>}
      </View>
      {value ? (
        <Text style={[styles.navValue, { color: colors.accent }]}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={15} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

function InfoRow({ icon, label, value, colors }: any) {
  return (
    <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.surface2 }]}>
        <Ionicons name={icon} size={17} color={colors.mutedForeground} />
      </View>
      <Text style={[styles.rowLabel, { color: '#ffffff', flex: 1 }]}>{label}</Text>
      <Text style={[styles.navValue, { color: colors.mutedForeground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', paddingHorizontal: 20, marginBottom: 20 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, marginBottom: 28,
    borderRadius: 16, borderWidth: 1, padding: 16,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#000000' },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  freeBadge: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  freeBadgeText: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  section: { paddingHorizontal: 20, marginBottom: 24, gap: 10 },
  sectionLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 1 },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  rowDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  navValue: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  proCard: {
    borderRadius: 16, borderWidth: 1, padding: 20, gap: 16, overflow: 'hidden',
  },
  proGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  proHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  proTitle: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  proFeatures: { gap: 10 },
  proFeatureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  featureDot: { width: 5, height: 5, borderRadius: 3, marginTop: 5 },
  proFeatureText: { fontSize: 14, fontFamily: 'Inter_400Regular', flex: 1, lineHeight: 20 },
  upgradeBtn: { borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  upgradeBtnText: { color: '#000000', fontSize: 15, fontFamily: 'Inter_700Bold' },
  proNote: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderRadius: 14, borderWidth: 1, paddingVertical: 16,
  },
  dangerText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
