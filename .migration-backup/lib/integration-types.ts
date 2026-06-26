// KeGo Integration Types & Schemas
// All integrations extend the core KeGo types without removing existing functionality

export type IntegrationSource =
  | 'github'
  | 'notion'
  | 'trello'
  | 'asana'
  | 'clickup'
  | 'email'
  | 'calendar'
  | 'extension'
  | 'manual'
  | 'reconstruction'

export type IntegrationStatus = 'active' | 'error' | 'paused' | 'pending'

// Integration account representing OAuth connections
export interface IntegrationAccount {
  id: string
  userId: string
  provider: IntegrationSource
  displayName: string
  oauthToken?: string
  refreshToken?: string
  expiresAt?: Date
  settings: Record<string, any>
  connectedAt: Date
  lastSyncAt?: Date
  status: IntegrationStatus
  errorMessage?: string
}

// Track import jobs from external sources
export interface ImportJob {
  id: string
  userId: string
  projectId: string
  source: 'notion' | 'trello' | 'asana' | 'clickup' | 'github' | 'markdown' | 'pdf' | 'json'
  status: 'queued' | 'processing' | 'complete' | 'error'
  progress: number // 0-100
  startedAt: Date
  completedAt?: Date
  itemsImported: number
  itemsProcessing: number
  itemsTotal: number
  errors: Array<{
    item: string
    error: string
  }>
  summary?: {
    decisionsImported: number
    milestonesImported: number
    resourcesImported: number
    tasksImported: number
  }
}

// Memory source metadata attached to any memory item
export interface MemorySourceMetadata {
  source: IntegrationSource
  sourceId?: string // GitHub commit hash, Notion page ID, etc.
  sourceUrl?: string // Link back to original source
  integrationAccountId?: string // Which integration account synced this
  syncedAt: Date
  originalId?: string // Original ID from source system
  importJobId?: string // Which import job created this
}

// GitHub-specific integration
export interface GitHubIntegration {
  accountId: string
  repoUrl: string
  repoOwner: string
  repoName: string
  repoId: number
  lastSyncAt: Date
  lastSyncedCommit: string
  includeReleases: boolean
  includePRs: boolean
  includeIssues: boolean
  syncBranch?: string
  settings: {
    autoTimelineFromCommits: boolean
    autoMilestonesFromReleases: boolean
    extractDecisionsFromPRs: boolean
    parseReadmeForContext: boolean
  }
}

// Notion-specific integration
export interface NotionIntegration {
  accountId: string
  notionUserId: string
  databaseId: string
  databaseTitle: string
  lastSyncAt: Date
  propertyMapping: {
    nameProperty: string
    descriptionProperty: string
    statusProperty?: string
    dateProperty?: string
  }
  settings: {
    syncDatabase: boolean
    syncPages: boolean
    autoTagContent: boolean
  }
}

// Email ingestion settings
export interface EmailIntegration {
  projectEmail: string // project-id@kego.ai format
  projectId: string
  forwardingEnabled: boolean
  autoClassifyEmails: boolean
  lastEmailReceivedAt?: Date
  settings: {
    createVaultEntries: boolean
    extractDecisions: boolean
    trackFromDomain?: string
    archiveAfterProcessing: boolean
  }
}

// Calendar integration
export interface CalendarIntegration {
  accountId: string
  provider: 'google' | 'outlook' | 'slack'
  calendarId: string
  lastSyncAt: Date
  settings: {
    syncMeetings: boolean
    syncDeadlines: boolean
    autoTimelineFromEvents: boolean
    includeCalendars: string[]
    excludeEventTypes: string[]
  }
}

// Browser extension connection
export interface BrowserExtensionSettings {
  extensionId: string
  installDate: Date
  lastActivityAt: Date
  settings: {
    autoClassifyContent: boolean
    defaultProjectId?: string
    autoTaggingEnabled: boolean
    syncFrequency: 'realtime' | 'hourly' | 'daily'
  }
}

// Timeline event extended with integration info
export interface IntegratedTimelineEvent {
  // Base fields inherited
  id: string
  projectId: string
  timestamp: Date
  eventType:
    | 'project_created'
    | 'project_paused'
    | 'project_resumed'
    | 'memory_reconstructed'
    | 'github:commit'
    | 'github:pr_created'
    | 'github:pr_merged'
    | 'github:release'
    | 'github:issue'
    | 'email:received'
    | 'calendar:event'
    | 'vault:entry_added'
    | 'milestone:completed'
    | 'decision:made'

  // Integration-specific
  source: MemorySourceMetadata
  externalData?: Record<string, any> // GitHub commit hash, email message ID, etc.
}

// Memory import schema validator
export interface ImportSchema {
  source: IntegrationSource
  version: string
  fields: {
    name: string
    description?: string
    decisions?: string[]
    milestones?: string[]
    resources?: string[]
    tags?: string[]
    startDate?: Date
    endDate?: Date
  }
}

// Semantic memory indexing
export interface SemanticMemoryIndex {
  id: string
  projectId: string
  itemId: string
  itemType: 'decision' | 'milestone' | 'resource' | 'note' | 'event'
  embedding?: number[] // Vector embedding (populated by semantic search service)
  textContent: string
  summary: string
  keywords: string[]
  source: MemorySourceMetadata
  indexedAt: Date
  version: number // For updating indices
}

// Integration sync job tracking
export interface SyncJob {
  id: string
  integrationAccountId: string
  projectId: string
  status: 'pending' | 'in-progress' | 'complete' | 'error'
  startedAt: Date
  completedAt?: Date
  itemsProcessed: number
  itemsTotal: number
  newItems: number
  updatedItems: number
  errors: string[]
  nextSyncScheduledFor?: Date
}

// Backup & export formats
export type ExportFormat = 'json' | 'markdown' | 'pdf' | 'csv' | 'html'

export interface ExportJob {
  id: string
  projectId: string
  userId: string
  format: ExportFormat
  status: 'pending' | 'processing' | 'ready' | 'error'
  createdAt: Date
  completedAt?: Date
  downloadUrl?: string
  expiresAt?: Date
  includeHistory: boolean
  includeAuditLog: boolean
  encryption?: {
    enabled: boolean
    algorithm: 'AES-256-GCM'
  }
}

// Version history tracking
export interface VersionHistory {
  id: string
  projectId?: string
  itemId: string
  itemType: 'project' | 'decision' | 'milestone' | 'vault_entry'
  userId: string
  action: 'created' | 'updated' | 'deleted' | 'restored'
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  timestamp: Date
  source: 'manual' | 'integration' | 'import' | 'recovery'
  metadata: Record<string, any>
}

// Audit log for compliance
export interface AuditLog {
  id: string
  projectId?: string
  userId: string
  action: string
  entityType: string
  entityId: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  severity: 'info' | 'warning' | 'error'
}

// Founder intelligence aggregation
export interface FounderIntelligence {
  userId: string
  totalProjects: number
  totalIdeas: number
  totalPivots: number
  totalExperiments: number
  topTechnologies: string[]
  topPatterns: string[]
  averageProjectPause: number // days
  successRate: number // 0-100: % of projects resumed successfully
  learnings: string[]
  lastUpdatedAt: Date
}

// Project graph node for knowledge graph
export interface ProjectGraphNode {
  id: string
  projectId: string
  nodeType: 'project' | 'decision' | 'milestone' | 'resource' | 'person' | 'technology' | 'idea'
  label: string
  data: Record<string, any>
  connections: Array<{
    targetId: string
    relationType: 'related_to' | 'depends_on' | 'blocked_by' | 'implements' | 'references' | 'mentions'
    weight?: number
  }>
  metadata: MemorySourceMetadata
}

// Global knowledge graph across all projects
export interface GlobalKnowledgeGraph {
  userId: string
  nodes: ProjectGraphNode[]
  crossProjectConnections: Array<{
    sourceProjectId: string
    targetProjectId: string
    connectionType: 'related' | 'previous_iteration' | 'pivot_from' | 'uses_learnings'
    strength: number // 0-1
  }>
  lastUpdatedAt: Date
}
