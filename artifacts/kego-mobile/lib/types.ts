export type ProjectHealth = 'healthy' | 'at-risk' | 'stalled' | 'dormant';

export interface ScoreBreakdown {
  documentationQuality: number;
  resourceCompleteness: number;
  taskClarity: number;
  decisionHistory: number;
  milestoneCoverage: number;
  contextRichness: number;
  recoverability: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  resumeScore: number;
  scoreBreakdown?: ScoreBreakdown;
  recoveryConfidence: number;
  health: ProjectHealth;
  contextCompleteness: number;
  lastActivity: Date;
  createdAt: Date;
  pausedAt: Date;
  tags: string[];
}

export interface Decision {
  id: string;
  projectId: string;
  title: string;
  description: string;
  rationale: string;
  alternatives: string[];
  consequences: string;
  madeAt: Date;
}

export type MilestoneStatus = 'completed' | 'in-progress' | 'planned';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  percentComplete: number;
  completedAt?: Date;
  dueDate?: Date;
}

export interface RecoveryChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface VaultEntry {
  id: string;
  projectId: string;
  title: string;
  content: string;
  category: 'decision' | 'resource' | 'note' | 'code';
  tags: string[];
  createdAt: Date;
}

export type TimelineEventType = 'created' | 'milestone' | 'decision' | 'paused' | 'resumed' | 'note';

export interface TimelineEvent {
  id: string;
  projectId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: Date;
}

export interface RecoveryWorkspace {
  projectId: string;
  projectSummary: string;
  completedWork: string;
  pendingWork: string;
  blockers: string;
  suggestedNextAction: string;
  estimatedTimeToResume: string;
  decisions: Decision[];
  milestones: Milestone[];
  recoveryChecklist: RecoveryChecklistItem[];
}

export interface CaptureItem {
  id: string;
  projectId: string;
  content: string;
  category: 'decision' | 'note' | 'blocker' | 'milestone';
  createdAt: Date;
}
