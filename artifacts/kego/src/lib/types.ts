export type ProjectHealth = 'healthy' | 'active' | 'at-risk' | 'stalled' | 'dormant' | 'recovering' | 'recovered'

export interface ResumeScoreBreakdown {
  documentationQuality: number
  resourceCompleteness: number
  taskClarity: number
  decisionHistory: number
  milestoneCoverage: number
  contextRichness: number
  recoverability: number
}

export interface Project {
  id: string
  name: string
  description: string
  resumeScore: number
  scoreBreakdown?: ResumeScoreBreakdown
  recoveryConfidence: number
  health: ProjectHealth
  contextCompleteness: number
  lastActivity: Date
  createdAt: Date
  pausedAt?: Date
  resumedAt?: Date
  tags: string[]
  daysSincePause?: number
}

export interface Decision {
  id: string
  projectId: string
  title: string
  description: string
  rationale: string
  alternatives?: string[]
  consequences?: string
  relatedResources?: string[]
  linkedMilestones?: string[]
  madeAt: Date
  updatedAt: Date
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  description: string
  status: 'planned' | 'in-progress' | 'completed' | 'paused'
  percentComplete: number
  completedAt?: Date
  dueDate?: Date
  linkedDecisions?: string[]
}

export interface RecoveryChecklistItem {
  id: string
  title: string
  description?: string
  completed: boolean
  order: number
}

export interface RecoveryWorkspace {
  projectId: string
  projectSummary: string
  completedWork: string
  pendingWork: string
  blockers: string
  importantDecisions: string
  importantResources: string
  suggestedNextAction: string
  estimatedTimeToResume: string
  decisions?: Decision[]
  milestones?: Milestone[]
  recoveryChecklist?: RecoveryChecklistItem[]
  recentChanges?: string
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
}

export interface TimelineEvent {
  id: string
  projectId: string
  type: 'created' | 'milestone' | 'decision' | 'paused' | 'resumed' | 'memory-reconstructed' | 'github:commit' | 'github:pr' | 'github:release' | 'email:received' | 'calendar:event' | 'vault:entry'
  title: string
  description: string
  timestamp: Date
}

export interface RecoveryRecommendation {
  projectId: string
  projectName: string
  reason: 'best-to-resume' | 'quickest-win' | 'at-risk' | 'momentum-opportunity'
  explanation: string
  priority: 'high' | 'medium' | 'low'
}
