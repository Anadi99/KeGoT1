import type {
  Project, Decision, Milestone, RecoveryChecklistItem,
  VaultEntry, TimelineEvent, RecoveryWorkspace, CaptureItem
} from './types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'FounderOS Landing Page',
    description: 'Marketing website for founder productivity tool',
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
    health: 'healthy',
    contextCompleteness: 98,
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ['marketing', 'saas', 'frontend'],
  },
  {
    id: '2',
    name: 'API Rate Limiter Service',
    description: 'Redis-backed rate limiting microservice',
    resumeScore: 65,
    recoveryConfidence: 72,
    health: 'at-risk',
    contextCompleteness: 68,
    lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    tags: ['backend', 'infrastructure'],
  },
  {
    id: '3',
    name: 'Mobile App Redesign',
    description: 'Complete UI/UX overhaul for iOS app',
    resumeScore: 38,
    recoveryConfidence: 45,
    health: 'stalled',
    contextCompleteness: 42,
    lastActivity: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    tags: ['mobile', 'design', 'ios'],
  },
  {
    id: '4',
    name: 'Database Migration Script',
    description: 'Migrate from MongoDB to PostgreSQL',
    resumeScore: 15,
    recoveryConfidence: 20,
    health: 'dormant',
    contextCompleteness: 18,
    lastActivity: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    tags: ['database', 'infrastructure'],
  },
  {
    id: '5',
    name: 'Documentation Site',
    description: 'Comprehensive docs for all products',
    resumeScore: 78,
    recoveryConfidence: 85,
    health: 'healthy',
    contextCompleteness: 82,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    pausedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['documentation', 'frontend'],
  },
];

export const mockDecisions: Decision[] = [
  {
    id: 'd1',
    projectId: '1',
    title: 'Framework: Next.js 16',
    description: 'Evaluated multiple frameworks for the landing page',
    rationale: 'Next.js 16 provides edge functions, built-in optimizations, and Vercel integration for seamless deployments',
    alternatives: ['Astro', 'Remix', 'Svelte'],
    consequences: 'Strong performance, easier deployments, access to latest React features',
    madeAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'd2',
    projectId: '1',
    title: 'Analytics: Vercel Analytics',
    description: 'Switched from Google Analytics to Vercel Analytics',
    rationale: 'Better real-time insights, privacy-focused, native integration with Vercel deployment',
    alternatives: ['Google Analytics', 'Mixpanel', 'Plausible'],
    consequences: 'Simpler setup, real-time data, reduced third-party dependencies',
    madeAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: 'm1',
    projectId: '1',
    title: 'Design System Complete',
    description: 'All components designed, documented, and approved',
    status: 'completed',
    percentComplete: 100,
    completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm2',
    projectId: '1',
    title: 'Homepage Implementation',
    description: 'Build homepage with animations and CMS integration',
    status: 'completed',
    percentComplete: 100,
    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm3',
    projectId: '1',
    title: 'Performance Optimization',
    description: 'Optimize Core Web Vitals to meet targets',
    status: 'in-progress',
    percentComplete: 60,
  },
  {
    id: 'm4',
    projectId: '1',
    title: 'Waitlist Integration',
    description: 'Implement email capture and welcome sequence',
    status: 'planned',
    percentComplete: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

export const mockChecklist: RecoveryChecklistItem[] = [
  { id: 'c1', title: 'Review project summary', description: 'Read through last known state', completed: true, order: 1 },
  { id: 'c2', title: 'Check pending work & blockers', description: 'Identify what needs attention', completed: true, order: 2 },
  { id: 'c3', title: 'Review recent decisions', description: 'Understand architectural choices', completed: false, order: 3 },
  { id: 'c4', title: 'Check milestone progress', description: 'What has been completed', completed: false, order: 4 },
  { id: 'c5', title: 'Pull latest code', description: 'Get the most recent version from Git', completed: false, order: 5 },
  { id: 'c6', title: 'Start with next action', description: 'Begin with highest-priority task', completed: false, order: 6 },
];

export const mockVaultEntries: VaultEntry[] = [
  {
    id: 'v1', projectId: '1',
    title: 'Brand Colors',
    content: 'Primary: #3B82F6 (Blue), Secondary: #10B981 (Green), Neutral: #6B7280',
    category: 'decision',
    tags: ['branding', 'design'],
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'v2', projectId: '1',
    title: 'Logo Guidelines',
    content: 'Logo should maintain 1:1 aspect ratio, minimum size 40x40px, always use with clear space',
    category: 'decision',
    tags: ['branding', 'guidelines'],
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'v3', projectId: '1',
    title: 'Marketing Documentation',
    content: 'https://docs.google.com/document/d/marketing-brief',
    category: 'resource',
    tags: ['marketing', 'strategy'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'v4', projectId: '1',
    title: 'Environment Setup',
    content: 'Run: pnpm install, copy .env.example to .env, set VERCEL_PROJECT_ID from dashboard',
    category: 'code',
    tags: ['setup', 'devops'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export const mockTimeline: TimelineEvent[] = [
  { id: 'e1', projectId: '1', type: 'created', title: 'Project created', description: 'Memory start point', timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
  { id: 'e2', projectId: '1', type: 'milestone', title: 'Design system finalized', description: 'All components documented and approved', timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
  { id: 'e3', projectId: '1', type: 'milestone', title: 'Homepage launched', description: 'Deployed to production', timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
  { id: 'e4', projectId: '1', type: 'decision', title: 'Switched to Vercel Analytics', description: 'Better real-time insights than Google Analytics', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: 'e5', projectId: '1', type: 'paused', title: 'Project paused', description: 'Context preserved for future resumption', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
];

export const mockRecoveryWorkspace: RecoveryWorkspace = {
  projectId: '1',
  projectSummary: 'FounderOS is a productivity tool for founders. This is the marketing website built with Next.js and Vercel, featuring pricing, testimonials, and CMS integration.',
  completedWork: '• Designed and built homepage with animations (7 days ago)\n• Integrated Vercel Analytics and CMS (10 days ago)\n• Set up deployment pipeline and domain (15 days ago)\n• Implemented testimonials section (20 days ago)',
  pendingWork: '• Implement email capture for waitlist\n• Add blog section with RSS feed\n• Optimize Core Web Vitals score\n• Set up A/B testing for pricing',
  blockers: '• Waiting for customer testimonials in video format\n• Need high-resolution product screenshots\n• LCP currently 3.2s, target is 2.5s',
  suggestedNextAction: 'Review waitlist email template and implement the email capture form on homepage.',
  estimatedTimeToResume: '20-30 minutes',
  decisions: mockDecisions,
  milestones: mockMilestones,
  recoveryChecklist: mockChecklist,
};

export const mockCaptures: CaptureItem[] = [];

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
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
