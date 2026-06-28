import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { ScoreRing } from '@/components/ScoreRing';
import { HealthBadge } from '@/components/HealthBadge';
import {
  mockProjects, getRecoveryWorkspace, getVaultEntriesForProject,
  getTimelineForProject, mockRecoveryHub,
  formatTimeAgo, formatDate, formatShortDate, getScoreColor
} from '@/lib/data';

type Tab = 'recovery' | 'timeline' | 'vault' | 'hub';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<Tab>('recovery');

  const project = mockProjects.find(p => p.id === id) ?? mockProjects[0];
  const workspace = getRecoveryWorkspace(project.id);
  const vault = getVaultEntriesForProject(project.id);
  const timeline = getTimelineForProject(project.id);

  const [checklist, setChecklist] = useState(workspace.recoveryChecklist);
  const completedCount = checklist.filter(c => c.completed).length;
  const toggleCheck = (checkId: string) =>
    setChecklist(prev => prev.map(c => c.id === checkId ? { ...c, completed: !c.completed } : c));

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: 30 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroTitles}>
              <Text style={[styles.projectName, { color: '#ffffff' }]}>{project.name}</Text>
              <Text style={[styles.projectDesc, { color: colors.textSecondary }]}>{project.description}</Text>
              <View style={styles.heroMeta}>
                <HealthBadge health={project.health} />
                {project.priority && (
                  <View style={[styles.priorityBadge, { backgroundColor: colors.surface2 }]}>
                    <Text style={[styles.priorityText, { color: colors.mutedForeground }]}>
                      Priority {project.priority}
                    </Text>
                  </View>
                )}
                {project.owner && (
                  <View style={[styles.ownerBadge, { backgroundColor: colors.surface2 }]}>
                    <Text style={[styles.ownerText, { color: colors.mutedForeground }]}>
                      {project.owner}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <ScoreRing score={project.resumeScore} size={64} strokeWidth={4} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.statsRow}>
            <StatItem label="Resume Score" value={`${project.resumeScore}/100`} color={getScoreColor(project.resumeScore)} colors={colors} />
            <StatItem label="Confidence" value={`${project.recoveryConfidence}%`} color={colors.accent} colors={colors} />
            <StatItem label="Last Active" value={formatTimeAgo(project.lastActivity)} color={colors.mutedForeground} colors={colors} />
          </View>

          {project.currentPhase && (
            <View style={[styles.phaseRow, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
              <Ionicons name="code-slash-outline" size={14} color={colors.accent} />
              <Text style={[styles.phaseText, { color: colors.textSecondary }]}>
                Phase: <Text style={{ color: '#ffffff' }}>{project.currentPhase}</Text>
              </Text>
            </View>
          )}
        </View>

        <View style={styles.tabBar}>
          {(['recovery', 'timeline', 'vault', 'hub'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: activeTab === tab ? colors.accent : colors.card,
                  borderColor: activeTab === tab ? colors.accent : colors.border,
                }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabLabel,
                { color: activeTab === tab ? '#000000' : colors.mutedForeground }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'recovery' && (
          <View style={styles.tabContent}>
            {workspace.neuralWarmup && (
              <View style={[styles.warmupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.warmupLabel, { color: colors.mutedForeground }]}>NEURAL NETWORK WARM-UP</Text>
                <Text style={[styles.warmupText, { color: colors.textSecondary }]}>
                  {workspace.neuralWarmup}
                </Text>
              </View>
            )}

            {workspace.missionCriticalGoal && (
              <View style={[styles.missionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.missionHeader}>
                  <View style={[styles.missionIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons name="aperture" size={20} color={colors.accent} />
                  </View>
                  <View style={styles.missionContent}>
                    <Text style={[styles.missionLabel, { color: colors.mutedForeground }]}>THE WHY</Text>
                    <Text style={[styles.missionLabel2, { color: colors.mutedForeground }]}>Mission Critical Goal</Text>
                  </View>
                </View>
                <Text style={[styles.missionGoal, { color: '#ffffff' }]}>{workspace.missionCriticalGoal}</Text>
                <View style={styles.missionProgress}>
                  <Text style={[styles.missionProgressLabel, { color: colors.mutedForeground }]}>Objective Progress</Text>
                  <Text style={[styles.missionProgressValue, { color: colors.accent }]}>
                    {workspace.missionGoalProgress}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressFill, {
                    backgroundColor: colors.accent,
                    width: `${workspace.missionGoalProgress}%` as any,
                  }]} />
                </View>
              </View>
            )}

            {workspace.sessionSnapshot && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>WHERE YOU LEFT OFF</Text>
                  <View style={[styles.sessionBadge, { backgroundColor: colors.surface2 }]}>
                    <Text style={[styles.sessionBadgeText, { color: colors.mutedForeground }]}>
                      Dec 14 · Session Snapshot
                    </Text>
                  </View>
                </View>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {workspace.sessionSnapshot}
                </Text>
              </View>
            )}

            {workspace.mentalStackPercent && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>MENTAL STACK RECOVERY</Text>
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>
                  {workspace.mentalStackPercent}% context restored
                </Text>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressFill, {
                    backgroundColor: colors.accent,
                    width: `${workspace.mentalStackPercent}%` as any,
                  }]} />
                </View>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {workspace.mentalStackRecovery}
                </Text>
              </View>
            )}

            {workspace.terminalCommand && (
              <View style={[styles.terminalCard, { backgroundColor: '#0d0f10', borderColor: colors.border }]}>
                <View style={styles.terminalHeader}>
                  <Ionicons name="terminal" size={13} color={colors.accent} />
                  <Text style={[styles.terminalLabel, { color: colors.accent }]}>QUICK RESUME</Text>
                </View>
                <Text style={[styles.terminalCode, { color: '#c2ff00' }]}>
                  {workspace.terminalCommand}
                </Text>
                <Text style={[styles.terminalDesc, { color: colors.textSecondary }]}>
                  {workspace.terminalDescription}
                </Text>
              </View>
            )}

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardHeader}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                  <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Recovery Checklist</Text>
                </View>
                <Text style={[styles.checkProgress, { color: colors.mutedForeground }]}>
                  {completedCount}/{checklist.length}
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, {
                  backgroundColor: colors.accent,
                  width: `${(completedCount / checklist.length) * 100}%` as any,
                }]} />
              </View>
              {checklist.map(item => (
                <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggleCheck(item.id)}>
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={item.completed ? colors.accent : colors.mutedForeground}
                  />
                  <View style={styles.checkContent}>
                    <View style={styles.checkTitleRow}>
                      <Text style={[styles.checkTitle, {
                        color: item.completed ? colors.mutedForeground : '#ffffff',
                        textDecorationLine: item.completed ? 'line-through' : 'none',
                        flex: 1,
                      }]}>
                        {item.title}
                      </Text>
                      {item.fileRef && (
                        <Text style={[styles.fileRef, { color: colors.accent }]}>{item.fileRef}</Text>
                      )}
                      {item.estimatedTime && (
                        <Text style={[styles.estTime, { color: colors.mutedForeground }]}>{item.estimatedTime}</Text>
                      )}
                    </View>
                    <Text style={[styles.checkDesc, { color: colors.mutedForeground }]}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="book" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Project Summary</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{workspace.projectSummary}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="warning" size={16} color={colors.scoreMid} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Blockers</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{workspace.blockers}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="list" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Pending Work</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{workspace.pendingWork}</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="link" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Important Resources</Text>
              </View>
              {workspace.importantResources.map(r => (
                <View key={r.id} style={[styles.resourceItem, { borderColor: colors.border, backgroundColor: colors.surface2 }]}>
                  <View style={[styles.resourceIcon, { backgroundColor: colors.accent + '18' }]}>
                    <Ionicons
                      name={r.type === 'repo' ? 'logo-github' : r.type === 'doc' ? 'document-text' : 'link'}
                      size={14}
                      color={colors.accent}
                    />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={[styles.resourceTitle, { color: '#ffffff' }]}>{r.title}</Text>
                    {r.description && (
                      <Text style={[styles.resourceDesc, { color: colors.mutedForeground }]}>{r.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="flash" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Key Decisions</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{workspace.importantDecisions}</Text>
              {workspace.decisions.map(d => (
                <View key={d.id} style={[styles.decisionItem, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                  <View style={styles.decisionTop}>
                    <Text style={[styles.decisionTitle, { color: '#ffffff' }]}>{d.title}</Text>
                    {d.critical && (
                      <View style={[styles.critTag, { backgroundColor: colors.accent + '20', borderColor: colors.accent + '40' }]}>
                        <Text style={[styles.critText, { color: colors.accent }]}>CRITICAL</Text>
                      </View>
                    )}
                    {d.status && d.status !== 'active' && (
                      <View style={[styles.statusTag2, { backgroundColor: colors.surface2 }]}>
                        <Text style={[styles.statusText2, { color: colors.mutedForeground }]}>{d.status.toUpperCase()}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.decisionRationale, { color: colors.textSecondary }]}>{d.rationale}</Text>
                  {d.alternatives.length > 0 && (
                    <Text style={[styles.altText, { color: colors.mutedForeground }]}>
                      Alt: {d.alternatives.join(', ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="trending-up" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Score Breakdown</Text>
              </View>
              {Object.entries(project.scoreBreakdown).map(([key, val]) => (
                <View key={key} style={styles.scoreBreakItem}>
                  <Text style={[styles.scoreBreakLabel, { color: colors.textSecondary }]}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <View style={styles.scoreBreakRight}>
                    <View style={[styles.scoreBreakBar, { backgroundColor: colors.border }]}>
                      <View style={[styles.scoreBreakFill, {
                        backgroundColor: getScoreColor(val as number),
                        width: `${val}%` as any,
                      }]} />
                    </View>
                    <Text style={[styles.scoreBreakVal, { color: getScoreColor(val as number) }]}>{val}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="flag" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Milestones</Text>
              </View>
              {workspace.milestones.map(m => {
                const statusColor = m.status === 'completed' ? colors.accent
                  : m.status === 'in-progress' ? '#3b82f6' : colors.mutedForeground;
                return (
                  <View key={m.id} style={[styles.milestoneRow, { borderBottomColor: colors.border }]}>
                    <View style={[styles.milestoneIcon, { backgroundColor: statusColor + '18' }]}>
                      <Ionicons
                        name={m.status === 'completed' ? 'checkmark-circle' : m.status === 'in-progress' ? 'hourglass' : 'time-outline'}
                        size={15}
                        color={statusColor}
                      />
                    </View>
                    <View style={styles.milestoneContent}>
                      <Text style={[styles.milestoneTitle, { color: '#ffffff' }]}>{m.title}</Text>
                      <Text style={[styles.milestoneDesc, { color: colors.textSecondary }]}>{m.description}</Text>
                      {m.status !== 'planned' && (
                        <View style={[styles.milestoneBar, { backgroundColor: colors.border }]}>
                          <View style={[styles.milestoneFill, {
                            backgroundColor: statusColor,
                            width: `${m.percentComplete}%` as any,
                          }]} />
                        </View>
                      )}
                    </View>
                    <Text style={[styles.milestonePct, { color: statusColor }]}>{m.percentComplete}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'timeline' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="time" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Project Journey Timeline</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>
                A reconstructed history of technical growth and synthesized intelligence nodes.
              </Text>
            </View>
            {[...timeline].reverse().map((event, index) => {
              const isCompleted = event.status === 'completed';
              const isActive = event.status === 'active';
              const dotColor = isCompleted ? colors.accent : isActive ? '#3b82f6' : colors.mutedForeground;
              return (
                <View key={event.id} style={styles.tleRow}>
                  <View style={styles.tleLeft}>
                    <View style={[styles.tleDot, { borderColor: dotColor, backgroundColor: dotColor + '20' }]}>
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={10} color={dotColor} />
                      ) : isActive ? (
                        <View style={[styles.activeDot, { backgroundColor: dotColor }]} />
                      ) : null}
                    </View>
                    {index < timeline.length - 1 && (
                      <View style={[styles.tleLine, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                  <View style={[styles.tleContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.tleDate, { color: colors.mutedForeground }]}>
                      {formatDate(event.timestamp)}
                    </Text>
                    <Text style={[styles.tleTitle, { color: '#ffffff' }]}>{event.title}</Text>
                    <Text style={[styles.tleDesc, { color: colors.textSecondary }]}>{event.description}</Text>
                    {event.aiSynthesis && (
                      <View style={[styles.aiSynthTag, { backgroundColor: colors.accent + '18', borderColor: colors.accent + '40' }]}>
                        <Text style={[styles.aiSynthText, { color: colors.accent }]}>✦ {event.aiSynthesis}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'vault' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="server" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Knowledge Vault</Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>
                Semantic exploration of project decisions and architecture.
              </Text>
            </View>
            {vault.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="server-outline" size={36} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No vault entries yet</Text>
              </View>
            ) : vault.map(entry => (
              <View key={entry.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.vaultTop}>
                  <View style={[styles.vaultCatTag, {
                    backgroundColor: entry.critical ? colors.accent + '20' : colors.surface2,
                    borderColor: entry.critical ? colors.accent + '40' : colors.border,
                  }]}>
                    <Text style={[styles.vaultCatText, { color: entry.critical ? colors.accent : colors.mutedForeground }]}>
                      {entry.category.toUpperCase()}
                    </Text>
                  </View>
                  {entry.status && (
                    <View style={[styles.vaultStatusTag, {
                      backgroundColor: '#22c55e18', borderColor: '#22c55e40',
                    }]}>
                      <Text style={{ fontSize: 10, fontFamily: 'Inter_700Bold', color: '#22c55e' }}>
                        {entry.status.toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {entry.confidence && (
                    <Text style={[styles.vaultConf, { color: colors.accent }]}>{entry.confidence}% conf</Text>
                  )}
                </View>
                <Text style={[styles.vaultTitle, { color: '#ffffff' }]}>{entry.title}</Text>
                <Text style={[styles.vaultContent, { color: colors.textSecondary }]}>{entry.content}</Text>
                {entry.tags && entry.tags.length > 0 && (
                  <View style={styles.vaultTags}>
                    {entry.tags.map(tag => (
                      <View key={tag} style={[styles.tag, { backgroundColor: colors.surface2 }]}>
                        <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'hub' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>MOMENTUM SCORE</Text>
              <View style={styles.momentumRow}>
                <Text style={[styles.momentumScore, { color: colors.accent }]}>
                  {mockRecoveryHub.momentumScore}
                </Text>
                <Text style={[styles.momentumDelta, { color: colors.accent }]}>
                  +{mockRecoveryHub.momentumDelta}% vs LY
                </Text>
              </View>
              <View style={styles.weekChart}>
                {mockRecoveryHub.weeklyData.map((d, i) => (
                  <View key={d.week} style={styles.weekBarCol}>
                    <View style={[styles.weekBar, { backgroundColor: colors.border }]}>
                      <View style={[styles.weekBarFill, {
                        backgroundColor: i === mockRecoveryHub.weeklyData.length - 1
                          ? colors.accent : colors.accent + '50',
                        height: `${d.score}%` as any,
                      }]} />
                    </View>
                    <Text style={[styles.weekLabel, { color: colors.mutedForeground }]}>{d.week}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="camera" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Project Snapshots</Text>
              </View>
              {mockRecoveryHub.snapshots.map(snap => (
                <View key={snap.id} style={[styles.snapCard, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                  <View style={styles.snapHeader}>
                    <Text style={[styles.snapDate, { color: colors.accent }]}>{formatShortDate(snap.timestamp)}</Text>
                    <View style={[styles.snapTag, { backgroundColor: colors.accent + '18', borderColor: colors.accent + '40' }]}>
                      <Text style={[styles.snapTagText, { color: colors.accent }]}>{snap.reason.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={[styles.snapSummary, { color: colors.textSecondary }]}>{snap.snapshot.summary}</Text>
                  {snap.snapshot.completedMilestones.length > 0 && (
                    <Text style={[styles.snapMeta, { color: colors.mutedForeground }]}>
                      ✓ {snap.snapshot.completedMilestones.join(', ')}
                    </Text>
                  )}
                  {snap.snapshot.blockers.length > 0 && (
                    <Text style={[styles.snapMeta, { color: colors.error }]}>
                      ⚠ {snap.snapshot.blockers[0]}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={16} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>Daily Memory Summaries</Text>
              </View>
              {mockRecoveryHub.dailySummaries.map((summary, i) => (
                <View key={i} style={[styles.summaryItem, { borderBottomColor: colors.border, borderBottomWidth: i < mockRecoveryHub.dailySummaries.length - 1 ? 1 : 0 }]}>
                  <View style={styles.summaryHeader}>
                    <Text style={[styles.summaryDate, { color: colors.accent }]}>{formatShortDate(summary.date)}</Text>
                    <Text style={[styles.summaryHours, { color: colors.mutedForeground }]}>{summary.hoursWorked}h</Text>
                  </View>
                  <Text style={[styles.summaryText, { color: colors.textSecondary }]}>{summary.progressRecap}</Text>
                  {summary.decisions.length > 0 && (
                    <View style={styles.summaryTags}>
                      {summary.decisions.map(d => (
                        <View key={d} style={[styles.tag, { backgroundColor: colors.surface2 }]}>
                          <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{d}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatItem({ label, value, color, colors }: any) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  heroCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  heroTitles: { flex: 1, gap: 8 },
  projectName: { fontSize: 24, fontFamily: 'Inter_700Bold', lineHeight: 30 },
  projectDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  priorityBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  priorityText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  ownerBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  ownerText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  divider: { height: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 3 },
  statValue: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  phaseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 8, borderWidth: 1, padding: 10,
  },
  phaseText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  tabBar: { flexDirection: 'row', gap: 6 },
  tabBtn: {
    flex: 1, borderRadius: 8, borderWidth: 1,
    paddingVertical: 10, alignItems: 'center',
  },
  tabLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  tabContent: { gap: 12 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  bodyText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  warmupCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  warmupLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8 },
  warmupText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18, fontStyle: 'italic' },
  missionCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
  missionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  missionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  missionContent: { gap: 2 },
  missionLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8 },
  missionLabel2: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  missionGoal: { fontSize: 20, fontFamily: 'Inter_700Bold', lineHeight: 26 },
  missionProgress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  missionProgressLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  missionProgressValue: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  sessionBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  sessionBadgeText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  terminalCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', gap: 8, padding: 14 },
  terminalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  terminalLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  terminalCode: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  terminalDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  checkProgress: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  checkItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 },
  checkContent: { flex: 1, gap: 2 },
  checkTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkTitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  fileRef: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  estTime: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  checkDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  resourceItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderRadius: 10, borderWidth: 1, padding: 10,
  },
  resourceIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  resourceContent: { flex: 1, gap: 2 },
  resourceTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  resourceDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  decisionItem: { borderRadius: 10, borderWidth: 1, padding: 12, gap: 6 },
  decisionTop: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  decisionTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', flex: 1 },
  critTag: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  critText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  statusTag2: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  statusText2: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  decisionRationale: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  altText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  scoreBreakItem: { gap: 4 },
  scoreBreakLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', textTransform: 'capitalize' },
  scoreBreakRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreBreakBar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  scoreBreakFill: { height: '100%', borderRadius: 2 },
  scoreBreakVal: { fontSize: 13, fontFamily: 'Inter_700Bold', width: 28, textAlign: 'right' },
  milestoneRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1,
  },
  milestoneIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  milestoneContent: { flex: 1, gap: 4 },
  milestoneTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  milestoneDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  milestoneBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  milestoneFill: { height: '100%', borderRadius: 2 },
  milestonePct: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  tleRow: { flexDirection: 'row', gap: 12 },
  tleLeft: { alignItems: 'center', width: 28, paddingTop: 14 },
  tleDot: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  tleLine: { flex: 1, width: 2, marginTop: 4, marginBottom: 4 },
  tleContent: {
    flex: 1, borderRadius: 12, borderWidth: 1, padding: 14, gap: 6, marginBottom: 10,
  },
  tleDate: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  tleTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  tleDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  aiSynthTag: { borderRadius: 8, borderWidth: 1, padding: 8, alignSelf: 'flex-start' },
  aiSynthText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  vaultTop: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  vaultCatTag: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  vaultCatText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  vaultStatusTag: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  vaultConf: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginLeft: 'auto' },
  vaultTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', lineHeight: 22 },
  vaultContent: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  vaultTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  momentumRow: { flexDirection: 'row', alignItems: 'baseline', gap: 14 },
  momentumScore: { fontSize: 48, fontFamily: 'Inter_700Bold', lineHeight: 54 },
  momentumDelta: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  weekChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 80 },
  weekBarCol: { flex: 1, alignItems: 'center', gap: 4, height: 80 },
  weekBar: { flex: 1, width: '100%', borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  weekBarFill: { width: '100%', borderRadius: 4 },
  weekLabel: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  snapCard: { borderRadius: 10, borderWidth: 1, padding: 12, gap: 8 },
  snapHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  snapDate: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  snapTag: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  snapTagText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  snapSummary: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  snapMeta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  summaryItem: { paddingVertical: 12, gap: 6 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryDate: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  summaryHours: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  summaryText: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  summaryTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  emptyState: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
