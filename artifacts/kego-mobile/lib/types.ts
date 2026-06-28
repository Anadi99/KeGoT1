export type ProjectHealth =
  | 'healthy'
  | 'active'
  | 'at-risk'
  | 'stalled'
  | 'dormant'
  | 'recovering'
  | 'recovered';

export interface ScoreBreakdown {
  documentationQuality: number;
  resourceCompleteness: number;
  taskClarity: number;
  decisionHistory: number;
  milestoneCoverage: number;
  contextRichness: number;
  recoverability: number;
}

export interface ImportantResource {
  id: string;
  title: string;
  url: string;
  type: 'doc' | 'repo' | 'link' | 'figma' | 'notion';
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  resumeScore: number;
  scoreBreakdown: ScoreBreakdown;
  recoveryConfidence: number;
  health: ProjectHealth;
  contextCompleteness: number;
  lastActivity: Date;
  createdAt: Date;
  pausedAt: Date;
  tags: string[];
  currentPhase?: string;
  owner?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  level?: number;
  contextSizeGB?: number;
  aiCoherence?: number;
  momentumScore?: number;
  momentumDelta?: number;
}

export interface Decision {
  id: string;
  projectId: string;
  title: string;
  description: string;
  rationale: string;
  alternatives: string[];
  consequences: string;
  relatedResources: string[];
  linkedMilestones: string[];
  madeAt: Date;
  status?: 'active' | 'superseded' | 'reconsidering';
  critical?: boolean;
}

export type MilestoneStatus = 'completed' | 'in-progress' | 'planned' | 'paused';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  percentComplete: number;
  completedAt?: Date;
  dueDate?: Date;
  linkedDecisions?: string[];
}

export interface RecoveryChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
  fileRef?: string;
  estimatedTime?: string;
}

export interface VaultEntry {
  id: string;
  projectId: string;
  title: string;
  content: string;
  category: 'decision' | 'resource' | 'note' | 'code' | 'architecture';
  tags: string[];
  createdAt: Date;
  confidence?: number;
  critical?: boolean;
  status?: 'active' | 'solved' | 'exploring';
}

export type TimelineEventType =
  | 'created'
  | 'milestone'
  | 'decision'
  | 'paused'
  | 'resumed'
  | 'note'
  | 'commit'
  | 'ai-synthesis'
  | 'active-point';

export interface TimelineEvent {
  id: string;
  projectId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: Date;
  status?: 'completed' | 'active' | 'upcoming';
  aiSynthesis?: string;
}

export interface RecoveryWorkspace {
  projectId: string;
  projectSummary: string;
  completedWork: string;
  pendingWork: string;
  blockers: string;
  importantDecisions: string;
  importantResources: ImportantResource[];
  suggestedNextAction: string;
  estimatedTimeToResume: string;
  recentChanges: string;
  lastUpdated: Date;
  decisions: Decision[];
  milestones: Milestone[];
  recoveryChecklist: RecoveryChecklistItem[];
  terminalCommand?: string;
  terminalDescription?: string;
  missionCriticalGoal?: string;
  missionGoalProgress?: number;
  sessionSnapshot?: string;
  mentalStackRecovery?: string;
  mentalStackPercent?: number;
  neuralWarmup?: string;
  contextRestoredGB?: number;
}

export interface RecoveryInboxItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'recovery' | 'sync' | 'insight';
  lastSynced: Date;
}

export interface ProjectSnapshot {
  id: string;
  projectId: string;
  timestamp: Date;
  reason: 'milestone' | 'decision' | 'pause' | 'resume' | 'manual';
  snapshot: {
    summary: string;
    completedMilestones: string[];
    pendingWork: string[];
    keyDecisions: string[];
    blockers: string[];
  };
}

export interface DailyMemorySummary {
  date: Date;
  projectId: string;
  progressRecap: string;
  decisions: string[];
  completedMilestones: string[];
  hoursWorked: number;
}

export interface MomentumData {
  week: string;
  score: number;
}

export interface RecoveryHub {
  projectId: string;
  momentumScore: number;
  momentumDelta: number;
  weeklyData: MomentumData[];
  inbox: RecoveryInboxItem[];
  dailySummaries: DailyMemorySummary[];
  snapshots: ProjectSnapshot[];
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'optimization' | 'pattern' | 'risk' | 'recommendation';
  action?: string;
  confidence?: number;
}

export interface SemanticSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  tags: string[];
  projectId: string;
  date: Date;
  reviewers?: string[];
  critical?: boolean;
}

export interface CaptureItem {
  id: string;
  projectId: string;
  content: string;
  category: 'decision' | 'note' | 'blocker' | 'milestone';
  captureType: 'text' | 'voice' | 'image' | 'link';
  createdAt: Date;
}
