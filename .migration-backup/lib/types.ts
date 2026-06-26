/**
 * KeGo Project Memory Platform - Type Definitions
 */

export type ProjectHealth = 'healthy' | 'active' | 'at-risk' | 'stalled' | 'dormant' | 'recovering' | 'recovered'

export interface ResumeScoreBreakdown {
  documentationQuality: number // 0-100
  resourceCompleteness: number // 0-100
  taskClarity: number // 0-100
  decisionHistory: number // 0-100
  milestoneCoverage: number // 0-100
  contextRichness: number // 0-100
  recoverability: number // 0-100
}

export interface Project {
  id: string
  name: string
  description: string
  resumeScore: number // 0-100: measures context completeness
  scoreBreakdown?: ResumeScoreBreakdown // Sub-scores for transparency
  recoveryConfidence: number // 0-100: readiness to resume
  health: ProjectHealth
  contextCompleteness: number // 0-100
  lastActivity: Date
  createdAt: Date
  pausedAt?: Date
  resumedAt?: Date
  tags: string[]
  daysSincePause?: number // Calculated field for dashboard sorting
  
  // Integration support (additive, optional)
  integrations?: {
    github?: { repoUrl: string; lastSyncAt: Date; lastSyncedCommit?: string }
    notion?: { databaseId: string; lastSyncAt: Date }
    email?: { projectEmail: string; enabled: boolean }
    calendar?: { provider?: 'google' | 'outlook' | 'slack'; lastSyncAt?: Date }
  }
  linkedProjects?: string[] // Related projects in knowledge graph
  founderContext?: {
    ideas: string[]
    pivots: string[]
    experiments: string[]
    learnings: string[]
  }
}

export interface Decision {
  id: string
  projectId: string
  title: string
  description: string
  rationale: string // Why this decision was made
  alternatives?: string[] // Other options considered
  consequences?: string // Impact and outcomes
  relatedResources?: string[] // Linked resources
  linkedMilestones?: string[] // Related milestones
  madeAt: Date
  updatedAt: Date
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  description: string
  status: 'planned' | 'in-progress' | 'completed' | 'paused'
  percentComplete: number // 0-100
  completedAt?: Date
  dueDate?: Date
  linkedDecisions?: string[] // Related decisions
}

export interface RecoveryChecklistItem {
  id: string
  title: string
  description?: string
  completed: boolean
  order: number // Display order
}

export interface RecoveryWorkspace {
  projectId: string
  projectSummary: string // AI-generated overview
  completedWork: string // Recent accomplishments
  pendingWork: string // Tasks waiting
  blockers: string // What's stuck
  importantDecisions: string // Key choices made
  importantResources: string // Links, references, docs
  suggestedNextAction: string // Clear action to resume
  estimatedTimeToResume: string // e.g., "15 minutes"
  decisions?: Decision[] // Decision intelligence
  milestones?: Milestone[] // Project milestones
  recoveryChecklist?: RecoveryChecklistItem[] // Step-by-step recovery guide
  recentChanges?: string // Recently modified sections
  lastUpdated: Date
}

export interface VaultEntry {
  id: string
  projectId: string
  title: string
  content: string
  category: 'decision' | 'resource' | 'link' | 'note'
  tags: string[]
  createdAt: Date
  updatedAt: Date
  
  // Integration metadata (optional)
  source?: 'manual' | 'github' | 'email' | 'extension' | 'calendar' | 'import'
  sourceId?: string
  sourceUrl?: string
  integrationAccountId?: string
}

export interface TimelineEvent {
  id: string
  projectId: string
  type: 'created' | 'milestone' | 'decision' | 'paused' | 'resumed' | 'memory-reconstructed' | 'github:commit' | 'github:pr' | 'github:release' | 'email:received' | 'calendar:event' | 'vault:entry'
  title: string
  description: string
  timestamp: Date
  
  // Integration metadata (optional)
  source?: 'manual' | 'github' | 'email' | 'calendar' | 'reconstruction'
  sourceId?: string
  sourceUrl?: string
  externalData?: Record<string, any> // Integration-specific data
}

export interface RecoveryRecommendation {
  projectId: string
  projectName: string
  reason: 'best-to-resume' | 'quickest-win' | 'at-risk' | 'momentum-opportunity'
  explanation: string
  priority: 'high' | 'medium' | 'low'
}

export interface ProjectSnapshot {
  id: string
  projectId: string
  timestamp: Date
  reason: 'milestone' | 'decision' | 'pause' | 'resume' | 'manual'
  snapshot: {
    summary: string
    completedMilestones: string[]
    pendingWork: string[]
    keyDecisions: string[]
    blockers: string[]
  }
}

export interface RecoveryReport {
  id: string
  projectId: string
  generatedAt: Date
  daysSincePause: number
  completionPercentage: number
  recoveryConfidence: number
  resumeScore: number
  completedMilestones: Milestone[]
  unfinishedWork: string[]
  blockers: string[]
  recommendedActions: string[]
  projectedCompletionPath: string // Estimated steps to completion
}

export interface DailyMemorySummary {
  date: Date
  projectId: string
  progressRecap: string
  recentDecisions: Decision[]
  completedMilestones: Milestone[]
  unfinishedTasks: string[]
  suggestedNextSteps: string[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  theme: 'dark' | 'light'
  recoveryPreferences: {
    aiTone: 'concise' | 'detailed'
    autoPopulate: boolean
    voiceCaptureEnabled: boolean
    offlineSyncEnabled: boolean
  }
}
