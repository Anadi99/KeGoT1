import type {
  Project, Decision, Milestone, RecoveryChecklistItem,
  VaultEntry, TimelineEvent, RecoveryWorkspace, RecoveryHub,
  RecoveryInboxItem, AIInsight, SemanticSearchResult,
  MomentumData, DailyMemorySummary, ProjectSnapshot
} from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'FounderOS',
    description: 'Core architecture for founder-grade decision intelligence platform.',
    resumeScore: 92,
    scoreBreakdown: {
      documentationQuality: 95,
      resourceCompleteness: 90,
      taskClarity: 95,
      decisionHistory: 88,
      milestoneCoverage: 92,
      contextRichness: 90,
      recoverability: 92,
    },
    recoveryConfidence: 95,
    health: 'recovering',
    contextCompleteness: 98,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    tags: ['architecture', 'ai', 'saas'],
    currentPhase: 'Deep Strategic Alignment',
    owner: 'N. Moir',
    priority: 'critical',
    level: 0,
    contextSizeGB: 1.2,
    aiCoherence: 98.2,
    momentumScore: 82,
    momentumDelta: 12,
  },
  {
    id: '2',
    name: 'Tourist AI',
    description: 'Autonomous exploration engine for high-density metropolitan navigation.',
    resumeScore: 87,
    scoreBreakdown: {
      documentationQuality: 88,
      resourceCompleteness: 85,
      taskClarity: 90,
      decisionHistory: 82,
      milestoneCoverage: 88,
      contextRichness: 86,
      recoverability: 87,
    },
    recoveryConfidence: 89,
    health: 'active',
    contextCompleteness: 87,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ['mobile', 'ai', 'navigation'],
    currentPhase: 'v.2.4.0-stable',
    priority: 'high',
    momentumScore: 74,
    momentumDelta: 5,
  },
  {
    id: '3',
    name: 'Parking System',
    description: 'Smart parking allocation system with real-time availability tracking.',
    resumeScore: 45,
    scoreBreakdown: {
      documentationQuality: 40,
      resourceCompleteness: 50,
      taskClarity: 42,
      decisionHistory: 38,
      milestoneCoverage: 45,
      contextRichness: 50,
      recoverability: 50,
    },
    recoveryConfidence: 48,
    health: 'stalled',
    contextCompleteness: 45,
    lastActivity: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    tags: ['iot', 'backend'],
    currentPhase: 'Integration Testing',
    priority: 'medium',
    momentumScore: 30,
    momentumDelta: -8,
  },
  {
    id: '4',
    name: 'Data Visualizer',
    description: 'Real-time analytics dashboard for complex multi-dimensional datasets.',
    resumeScore: 23,
    scoreBreakdown: {
      documentationQuality: 18,
      resourceCompleteness: 25,
      taskClarity: 20,
      decisionHistory: 22,
      milestoneCoverage: 28,
      contextRichness: 25,
      recoverability: 25,
    },
    recoveryConfidence: 28,
    health: 'dormant',
    contextCompleteness: 22,
    lastActivity: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    tags: ['analytics', 'frontend'],
    priority: 'low',
    momentumScore: 5,
    momentumDelta: -2,
  },
  {
    id: '5',
    name: 'KeGo Mobile Core',
    description: 'Native mobile app for Project Memory Operating System.',
    resumeScore: 78,
    scoreBreakdown: {
      documentationQuality: 80,
      resourceCompleteness: 75,
      taskClarity: 82,
      decisionHistory: 78,
      milestoneCoverage: 75,
      contextRichness: 78,
      recoverability: 78,
    },
    recoveryConfidence: 82,
    health: 'recovered',
    contextCompleteness: 80,
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['mobile', 'react-native', 'expo'],
    priority: 'high',
    momentumScore: 68,
    momentumDelta: 15,
  },
  {
    id: '6',
    name: 'Quantum-Flux Core',
    description: 'Deep integration of sub-atomic state management for high-concurrency kernels. Focus: 0.1ms latency targets.',
    resumeScore: 65,
    scoreBreakdown: {
      documentationQuality: 70,
      resourceCompleteness: 60,
      taskClarity: 68,
      decisionHistory: 65,
      milestoneCoverage: 62,
      contextRichness: 65,
      recoverability: 65,
    },
    recoveryConfidence: 70,
    health: 'at-risk',
    contextCompleteness: 65,
    lastActivity: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    tags: ['systems', 'performance', 'kernel'],
    currentPhase: 'Core Architecture',
    owner: 'B. Noir',
    priority: 'high',
    level: 0,
    momentumScore: 42,
    momentumDelta: -3,
  },
];

export const mockDecisions: Decision[] = [
  {
    id: 'd1', projectId: '1',
    title: 'JWT to Edge Session Tokens',
    description: 'Transition from legacy JWT to Edge-native session tokens was documented in Sprint 14',
    rationale: 'Key stakeholders: Security & Platform teams required edge-compatible auth',
    alternatives: ['Keep JWT', 'Cookie sessions', 'PASETO'],
    consequences: 'Better edge performance, requires middleware update',
    relatedResources: [],
    linkedMilestones: ['m2'],
    madeAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    status: 'active',
    critical: true,
  },
  {
    id: 'd2', projectId: '1',
    title: 'Governance Decisions — Jan 2024',
    description: '4 critical decisions identified: Cloud vendor lock-in mitigation, UI component library standardization, and 2 hiring freeze waivers.',
    rationale: 'Reviewed by Alex & Sarah',
    alternatives: [],
    consequences: 'Standardized component delivery',
    relatedResources: [],
    linkedMilestones: [],
    madeAt: new Date('2024-01-18'),
    status: 'active',
  },
  {
    id: 'd3', projectId: '6',
    title: 'Rust vs C++ Core',
    description: 'Choosing Rust over C++ for safety-critical kernel components.',
    rationale: 'Memory safety without garbage collection',
    alternatives: ['C++', 'Zig', 'Go'],
    consequences: 'Safer memory model, steeper learning curve',
    relatedResources: [],
    linkedMilestones: [],
    madeAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    status: 'active',
    critical: true,
  },
  {
    id: 'd4', projectId: '6',
    title: 'Vector DB Choice',
    description: 'Selecting Qdrant over Pinecone for knowledge indexing subsystem.',
    rationale: 'Open source, better performance at scale',
    alternatives: ['Pinecone', 'Weaviate', 'Chroma'],
    consequences: 'Self-hosted complexity, no vendor lock-in',
    relatedResources: [],
    linkedMilestones: [],
    madeAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'd5', projectId: '6',
    title: 'UI Design Tokens',
    description: 'Khaki-fair theme as global standard across all UI components.',
    rationale: 'Brand consistency across platforms',
    alternatives: ['Custom per-component', 'Material Design'],
    consequences: 'Consistent visual language',
    relatedResources: [],
    linkedMilestones: [],
    madeAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: 'm1', projectId: '1',
    title: 'Schema Initialization',
    description: 'PostgreSQL migrations finalized for User Profile extension.',
    status: 'completed',
    percentComplete: 100,
    completedAt: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000),
    linkedDecisions: ['d1'],
  },
  {
    id: 'm2', projectId: '1',
    title: 'Supabase Auth Integration',
    description: 'Paused mid-implementation of OAuth callback handlers.',
    status: 'in-progress',
    percentComplete: 60,
    linkedDecisions: ['d1'],
  },
  {
    id: 'm3', projectId: '1',
    title: 'Middleware Verification',
    description: 'Waiting for Auth flow resolution.',
    status: 'planned',
    percentComplete: 0,
  },
  {
    id: 'm4', projectId: '6',
    title: 'Logic Freeze',
    description: 'Core kernel logic finalized and locked.',
    status: 'completed',
    percentComplete: 100,
    completedAt: new Date('2024-12-22'),
  },
  {
    id: 'm5', projectId: '6',
    title: 'Stress Test S1',
    description: 'First round stress testing under simulated production load.',
    status: 'in-progress',
    percentComplete: 35,
  },
];

export const mockChecklist: RecoveryChecklistItem[] = [
  { id: 'c1', title: 'Review auth/engine.ts', description: 'Check the JWT rotation changes', completed: false, order: 1, fileRef: 'auth/engine.ts +42', estimatedTime: '5m' },
  { id: 'c2', title: 'Flush Redis cache', description: 'Clear stale session data', completed: false, order: 2, fileRef: '+3', estimatedTime: '2m' },
  { id: 'c3', title: 'Re-sync Postman collection for Auth V2', description: 'Update API collection', completed: false, order: 3, fileRef: '+6', estimatedTime: '4m' },
  { id: 'c4', title: 'Review project summary', description: 'Read through last known state', completed: true, order: 4, estimatedTime: '3m' },
  { id: 'c5', title: 'Check pending work & blockers', description: 'Identify what needs attention', completed: true, order: 5, estimatedTime: '5m' },
  { id: 'c6', title: 'Start with next action', description: 'Begin with highest-priority task', completed: false, order: 6, estimatedTime: '20m' },
];

export const mockVaultEntries: VaultEntry[] = [
  {
    id: 'v1', projectId: '6',
    title: 'Decoupled Mesh Topology v4',
    content: 'Moving away from monolithic event buses to a localized mesh distribution system reduces global lock contention by 42%.',
    category: 'architecture',
    tags: ['10 tags', '2 Export'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    confidence: 94,
    critical: false,
  },
  {
    id: 'v2', projectId: '1',
    title: 'Auth Migration Strategy — #HighConfidence',
    content: 'The transition from legacy JWT to Edge-native session tokens was documented in Sprint 14. Key stakeholders: Security & Platform teams.',
    category: 'architecture',
    tags: ['Security', 'Architecture'],
    createdAt: new Date('2024-01-25'),
    confidence: 95,
    critical: true,
  },
  {
    id: 'v3', projectId: '1',
    title: 'Governance Decisions — Jan 12-18',
    content: '4 critical decisions identified: Cloud vendor lock-in mitigation, UI component library standardization, and 2 hiring freeze waivers. Reviewed by Alex & Sarah.',
    category: 'decision',
    tags: ['governance', 'planning'],
    createdAt: new Date('2024-01-18'),
    confidence: 90,
  },
  {
    id: 'v4', projectId: '1',
    title: 'Foundational Research Papers',
    content: '"Attention is All You Need" — Core logic for memory recall vectors. Core logic for standardization, and more.',
    category: 'resource',
    tags: ['research', 'neural-networks'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    confidence: 88,
  },
  {
    id: 'v5', projectId: '1',
    title: 'Data Structures',
    content: 'B+ Trees optimized for high-frequency writes across the distributed state engine.',
    category: 'architecture',
    tags: ['data-structures', 'optimization'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    confidence: 92,
  },
  {
    id: 'v6', projectId: '6',
    title: 'Semantic Map',
    content: 'Visualize semantic relationships between 1.2k decision nodes across the project knowledge graph.',
    category: 'architecture',
    tags: ['visualization', 'knowledge-graph'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'v7', projectId: '6',
    title: 'AI Correlation Detection',
    content: 'The "Mesh Bottleneck" change correlates with "Latest Bottleneck" identified in Q1. Recommended reading.',
    category: 'note',
    tags: ['ai', 'correlation'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'exploring',
  },
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: 'e1', projectId: '1', type: 'milestone',
    title: 'Schema Initialization',
    description: 'PostgreSQL migrations finalized for User Profile extension.',
    timestamp: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: 'e2', projectId: '1', type: 'active-point',
    title: 'Supabase Auth Integration',
    description: 'Paused mid-implementation of OAuth callback handlers.',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    id: 'e3', projectId: '1', type: 'milestone',
    title: 'Middleware Verification',
    description: 'Waiting for Auth flow resolution.',
    timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'upcoming',
  },
  {
    id: 'e4', projectId: '1', type: 'ai-synthesis',
    title: 'Kinetic Core Stabilization',
    description: 'System performance increased by 40% following the integration of the Kinetic Noir rendering engine.',
    timestamp: new Date('2024-03-01'),
    status: 'completed',
    aiSynthesis: 'Intelligence logs indicate a shift from reactive to proactive data fetching.',
  },
  {
    id: 'e5', projectId: '1', type: 'decision',
    title: 'The Architecture Pivot',
    description: 'The decision to abandon traditional relational databases in favor of a hybrid memory graph model was finalized.',
    timestamp: new Date('2024-02-01'),
    status: 'completed',
  },
  {
    id: 'e6', projectId: '1', type: 'created',
    title: 'Genesis of Project Memory',
    description: 'Initial project context. Vision defined as a "Project command center for engineering data."',
    timestamp: new Date('2024-01-01'),
    status: 'completed',
  },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    title: 'Clustered Knowledge',
    description: '34 files share common logic paths in /utils/render. Consider refactoring to shared module.',
    type: 'optimization',
    action: 'EXECUTE AUTO-REFACTOR',
    confidence: 94,
  },
  {
    id: 'ai2',
    title: 'Recovery Velocity Spike',
    description: 'FounderOS has shown +12% recovery velocity over last 7 days. Optimal window to resume.',
    type: 'recommendation',
    action: 'RESUME NOW',
    confidence: 89,
  },
  {
    id: 'ai3',
    title: 'Context Decay Detected',
    description: 'Parking System context is degrading rapidly. 14 days idle with no snapshot taken.',
    type: 'risk',
    action: 'TAKE SNAPSHOT',
    confidence: 96,
  },
];

export const mockRecoveryHub: RecoveryHub = {
  projectId: '1',
  momentumScore: 82,
  momentumDelta: 12,
  weeklyData: [
    { week: 'W1', score: 45 },
    { week: 'W2', score: 52 },
    { week: 'W3', score: 61 },
    { week: 'W4', score: 70 },
    { week: 'W5', score: 75 },
    { week: 'W6', score: 82 },
  ],
  inbox: [
    {
      id: 'ri1', projectId: '5', projectName: 'KeGo Mobile Core',
      title: '3 projects ready for reconstruction', description: 'AI analysis complete',
      priority: 'high', type: 'recovery', lastSynced: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'ri2', projectId: '4', projectName: 'Data Visualizer',
      title: 'Context fading — 180 days idle', description: 'Take a snapshot to preserve memory',
      priority: 'high', type: 'sync', lastSynced: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 'ri3', projectId: '3', projectName: 'Parking System',
      title: 'Idle for 14 days', description: 'AI recommends resumption',
      priority: 'medium', type: 'insight', lastSynced: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ],
  dailySummaries: [
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      projectId: '1',
      progressRecap: 'Modified auth/engine.ts to implement JWT rotation logic. The middleware layer was left in a transient state during the refactor.',
      decisions: ['JWT rotation approach finalized'],
      completedMilestones: [],
      hoursWorked: 4.2,
    },
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      projectId: '1',
      progressRecap: 'Observed latency spikes in the staging DB (approx 450ms) while testing the new identity provider bridge.',
      decisions: [],
      completedMilestones: [],
      hoursWorked: 3.1,
    },
  ],
  snapshots: [
    {
      id: 'sn1', projectId: '1',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      reason: 'pause',
      snapshot: {
        summary: 'Auth engine mid-refactor. JWT rotation implemented, OAuth callbacks incomplete.',
        completedMilestones: ['Schema Initialization'],
        pendingWork: ['OAuth callback handlers', 'Middleware verification'],
        keyDecisions: ['JWT to Edge Sessions'],
        blockers: ['handleCallback() failure in staging CORS env'],
      },
    },
  ],
};

export const mockSemanticResults: SemanticSearchResult[] = [
  {
    id: 'sr1',
    title: 'Auth Migration Strategy',
    description: 'The transition from legacy JWT to Edge-native session tokens was documented in Sprint 14. Key stakeholders: Security & Platform teams.',
    category: '#HighConfidence',
    confidence: 95,
    tags: ['#Security', '#ArchMixture'],
    projectId: '1',
    date: new Date('2024-01-25'),
    critical: true,
  },
  {
    id: 'sr2',
    title: 'Governance Decisions — Jan 12-18',
    description: '4 critical decisions identified: Cloud vendor lock-in mitigation, UI component library standardization, and 2 hiring freeze waivers.',
    category: 'Decision',
    confidence: 90,
    tags: ['governance'],
    projectId: '1',
    date: new Date('2024-01-18'),
    reviewers: ['Alex & Sarah'],
  },
  {
    id: 'sr3',
    title: 'Foundational Research Papers',
    description: '"Attention is All You Need" — Core logic for memory recall vectors.',
    category: 'Neural Networks',
    confidence: 88,
    tags: ['research'],
    projectId: '1',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'sr4',
    title: 'Data Structures',
    description: 'B+ Trees optimized for high-frequency writes.',
    category: 'Data Structure',
    confidence: 92,
    tags: ['optimization'],
    projectId: '1',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export const mockProjectJourneyTimeline: TimelineEvent[] = [
  {
    id: 'pt1', projectId: '1', type: 'ai-synthesis',
    title: 'Kinetic Core Stabilization',
    description: 'System performance increased by 40% following the integration of the Kinetic Noir rendering engine. Intelligence logs indicate a shift from reactive to proactive data fetching.',
    timestamp: new Date('2024-03-01'),
    status: 'completed',
    aiSynthesis: 'AI SYNTHESIS',
  },
  {
    id: 'pt2', projectId: '1', type: 'decision',
    title: 'The Architecture Pivot',
    description: 'The decision to abandon traditional relational databases in favor of a hybrid memory graph model was finalized. This used real-time semantic search capabilities.',
    timestamp: new Date('2024-02-01'),
    status: 'completed',
  },
  {
    id: 'pt3', projectId: '1', type: 'created',
    title: 'Genesis of Project Memory',
    description: 'Initial project context. Vision defined as a "Project command center for engineering data."',
    timestamp: new Date('2024-01-01'),
    status: 'completed',
  },
];

export const mockRecoveryWorkspace: RecoveryWorkspace = {
  projectId: '1',
  projectSummary: 'FounderOS is the core architecture decision intelligence platform for founders. You were building the auth engine when you paused — specifically the JWT rotation logic and OAuth callback handlers for Supabase.',
  completedWork: '• Schema initialization complete (PostgreSQL migrations finalized)\n• Identity provider bridge built\n• JWT rotation logic in auth/engine.ts committed\n• Staging environment configured',
  pendingWork: '• OAuth callback handlers (mid-implementation)\n• Middleware verification layer\n• handleCallback() failure in staging CORS environment\n• Re-sync Postman collection for Auth V2',
  blockers: '• handleCallback() failure — mismatched CORS policy in the development environment\n• Latency spikes observed in staging DB (~450ms)\n• JWT middleware left in transient state',
  importantDecisions: '• JWT → Edge session tokens (Sprint 14, Security team aligned)\n• Hybrid memory graph over relational DB\n• Qdrant for vector search over Pinecone',
  importantResources: [
    { id: 'r1', title: 'Kernel Docs', url: 'https://docs.example.com/kernel', type: 'doc', description: 'Semantic Data Distribution v2.6' },
    { id: 'r2', title: 'S Repository', url: 'https://github.com/example/s-repo', type: 'repo', description: 'Knowledge Embedding Index' },
  ],
  suggestedNextAction: 'Run npm run dev to restore the local server state, then inspect auth/engine.ts and fix the handleCallback() CORS failure in staging.',
  estimatedTimeToResume: '20-30 minutes',
  recentChanges: 'Modified auth/engine.ts — JWT rotation logic. Middleware layer left in transient state during refactor.',
  lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  decisions: mockDecisions.filter(d => d.projectId === '1'),
  milestones: mockMilestones.filter(m => m.projectId === '1'),
  recoveryChecklist: mockChecklist,
  terminalCommand: 'run `npm run dev`',
  terminalDescription: 'This will restore local environment variables and spin up the identity provider bridge.',
  missionCriticalGoal: 'Scaling the Auth engine for 10k users.',
  missionGoalProgress: 65,
  sessionSnapshot: 'Modified auth/engine.ts to implement JWT rotation logic. The middleware layer was left in a transient state during the refactor. Observed latency spikes in the staging DB (approx 450ms) while testing the new identity provider bridge.\n\nWe were halfway through managing the handleCallback() failure. The middleware layer is in a mismatched CORS environment.',
  mentalStackRecovery: 'Mental Stack: 82% recovered — Auth engine context, JWT rotation pattern, OAuth flow architecture',
  mentalStackPercent: 82,
  neuralWarmup: '"The secret of getting ahead is getting started."',
  contextRestoredGB: 1.2,
};

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id);
}

export function getRecoveryWorkspace(projectId: string): RecoveryWorkspace {
  return { ...mockRecoveryWorkspace, projectId };
}

export function getDecisionsForProject(projectId: string): Decision[] {
  return mockDecisions.filter(d => d.projectId === projectId);
}

export function getMilestonesForProject(projectId: string): Milestone[] {
  return mockMilestones.filter(m => m.projectId === projectId);
}

export function getVaultEntriesForProject(projectId: string): VaultEntry[] {
  return mockVaultEntries.filter(v => v.projectId === projectId);
}

export function getTimelineForProject(projectId: string): TimelineEvent[] {
  return mockTimeline.filter(e => e.projectId === projectId);
}

export function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getScoreColor(score: number): string {
  if (score >= 70) return '#c2ff00';
  if (score >= 45) return '#f59e0b';
  return '#ff4444';
}

export function getHealthColor(health: string): string {
  const map: Record<string, string> = {
    healthy: '#c2ff00',
    active: '#60a5fa',
    'at-risk': '#f59e0b',
    stalled: '#ff4444',
    dormant: '#4b5563',
    recovering: '#c2ff00',
    recovered: '#22c55e',
  };
  return map[health] ?? '#6b7280';
}

export function getHealthLabel(health: string): string {
  const map: Record<string, string> = {
    healthy: 'Healthy',
    active: 'Active',
    'at-risk': 'At Risk',
    stalled: 'Stalled',
    dormant: 'Dormant',
    recovering: 'Recovering',
    recovered: 'Recovered',
  };
  return map[health] ?? health;
}
