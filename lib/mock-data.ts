import type { Project, RecoveryWorkspace, VaultEntry, TimelineEvent, RecoveryRecommendation, Decision, Milestone, RecoveryChecklistItem } from './types'

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
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
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
    lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
    pausedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    tags: ['backend', 'infrastructure', 'devtools'],
  },
  {
    id: '3',
    name: 'Mobile App Redesign',
    description: 'Complete UI/UX overhaul for iOS app',
    resumeScore: 38,
    recoveryConfidence: 45,
    health: 'stalled',
    contextCompleteness: 42,
    lastActivity: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
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
    lastActivity: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    pausedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    tags: ['database', 'infrastructure', 'sql'],
  },
  {
    id: '5',
    name: 'Documentation Site',
    description: 'Comprehensive docs for all products',
    resumeScore: 78,
    recoveryConfidence: 85,
    health: 'healthy',
    contextCompleteness: 82,
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    pausedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['documentation', 'frontend', 'devx'],
  },
]

export const mockDecisions: Decision[] = [
  {
    id: 'd1',
    projectId: '1',
    title: 'Framework Choice: Next.js 16',
    description: 'Evaluated multiple frameworks for the landing page',
    rationale: 'Next.js 16 provides edge functions, built-in optimizations, and Vercel integration for seamless deployments',
    alternatives: ['Astro', 'Remix', 'Svelte'],
    consequences: 'Strong performance, easier deployments, access to latest React features',
    relatedResources: ['https://nextjs.org', 'https://vercel.com/docs'],
    linkedMilestones: ['m1', 'm2'],
    madeAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'd2',
    projectId: '1',
    title: 'Analytics Platform: Vercel Analytics',
    description: 'Switched from Google Analytics to Vercel Analytics',
    rationale: 'Better real-time insights, privacy-focused, native integration with Vercel deployment',
    alternatives: ['Google Analytics', 'Mixpanel', 'Plausible'],
    consequences: 'Simpler setup, real-time data, reduced third-party dependencies',
    relatedResources: ['https://vercel.com/analytics'],
    linkedMilestones: ['m3'],
    madeAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
]

export const mockMilestones: Milestone[] = [
  {
    id: 'm1',
    projectId: '1',
    title: 'Design System Complete',
    description: 'All components designed, documented, and approved',
    status: 'completed',
    percentComplete: 100,
    completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    linkedDecisions: ['d1'],
  },
  {
    id: 'm2',
    projectId: '1',
    title: 'Homepage Implementation',
    description: 'Build homepage with animations and CMS integration',
    status: 'completed',
    percentComplete: 100,
    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    linkedDecisions: ['d1'],
  },
  {
    id: 'm3',
    projectId: '1',
    title: 'Performance Optimization',
    description: 'Optimize Core Web Vitals to meet targets',
    status: 'in-progress',
    percentComplete: 60,
    linkedDecisions: ['d2'],
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
]

export const mockRecoveryChecklist: RecoveryChecklistItem[] = [
  {
    id: 'c1',
    title: 'Review project summary and context',
    description: 'Read through the last known state of the project',
    completed: true,
    order: 1,
  },
  {
    id: 'c2',
    title: 'Check pending work and blockers',
    description: 'Identify what was being worked on and what needs attention',
    completed: true,
    order: 2,
  },
  {
    id: 'c3',
    title: 'Review recent decisions',
    description: 'Understand why recent architectural choices were made',
    completed: false,
    order: 3,
  },
  {
    id: 'c4',
    title: 'Check milestone progress',
    description: 'Understand what has been completed and what remains',
    completed: false,
    order: 4,
  },
  {
    id: 'c5',
    title: 'Pull latest code and dependencies',
    description: 'Get the most recent version from Git',
    completed: false,
    order: 5,
  },
  {
    id: 'c6',
    title: 'Start with suggested next action',
    description: 'Begin with the highest-priority recommended task',
    completed: false,
    order: 6,
  },
]

export const mockRecoveryWorkspace: RecoveryWorkspace = {
  projectId: '1',
  projectSummary:
    'FounderOS is a productivity tool for founders combining habit tracking, goal management, and community. This is the marketing website built with Next.js and Vercel, featuring pricing, testimonials, and CMS integration.',
  completedWork: `• Designed and built homepage with Framer Motion animations (completed 7 days ago)
• Integrated Vercel Analytics and CMS (completed 10 days ago)
• Set up deployment pipeline and domain (completed 15 days ago)
• Implemented testimonials section with customer quotes (completed 20 days ago)`,
  pendingWork: `• Implement email capture for waitlist (in progress)
• Add blog section with RSS feed
• Optimize Core Web Vitals score
• Set up A/B testing for pricing section
• Create mobile app landing page`,
  blockers: `• Waiting for customer testimonials in video format
• Need high-resolution product screenshots
• Performance: LCP is currently 3.2s, target is 2.5s`,
  importantDecisions: `• Chose Next.js 16 over other frameworks for edge capabilities
• Decided to use Vercel for hosting for automatic deployments
• Selected Supabase for customer data (not yet implemented)`,
  importantResources: `• Design system: https://figma.com/file/...
• Competitor analysis: https://docs.google.com/...
• Content calendar: https://airtable.com/...
• Vercel deployment guide: https://vercel.com/docs`,
  suggestedNextAction: 'Review waitlist email template and implement the email capture form on homepage.',
  estimatedTimeToResume: '20-30 minutes to rebuild context',
  decisions: mockDecisions,
  milestones: mockMilestones,
  recoveryChecklist: mockRecoveryChecklist,
  recentChanges: 'Vercel Analytics integration, performance optimizations started',
  lastUpdated: new Date(),
}

export const mockVaultEntries: VaultEntry[] = [
  {
    id: 'v1',
    projectId: '1',
    title: 'Brand Colors',
    content: 'Primary: #3B82F6 (Blue), Secondary: #10B981 (Green), Neutral: #6B7280 (Gray)',
    category: 'decision',
    tags: ['branding', 'design'],
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'v2',
    projectId: '1',
    title: 'Logo Guidelines',
    content: 'Logo should maintain 1:1 aspect ratio, minimum size 40x40px, always use with clear space',
    category: 'decision',
    tags: ['branding', 'guidelines'],
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'v3',
    projectId: '1',
    title: 'Marketing Documentation',
    content: 'https://docs.google.com/document/d/marketing-brief',
    category: 'resource',
    tags: ['marketing', 'strategy'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
]

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'e1',
    projectId: '1',
    type: 'created',
    title: 'Project created',
    description: 'Memory start point',
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'e2',
    projectId: '1',
    type: 'milestone',
    title: 'Design system finalized',
    description: 'All components documented and approved',
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'e3',
    projectId: '1',
    type: 'milestone',
    title: 'Homepage launched',
    description: 'Deployed to production',
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'e4',
    projectId: '1',
    type: 'decision',
    title: 'Switched to Vercel Analytics',
    description: 'Better real-time insights than Google Analytics',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'e5',
    projectId: '1',
    type: 'paused',
    title: 'Project paused',
    description: 'Context preserved for future resumption',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

export const mockRecommendations: RecoveryRecommendation[] = [
  {
    projectId: '1',
    projectName: 'FounderOS Landing Page',
    reason: 'best-to-resume',
    explanation: 'Has 92% context completion. Just need to complete waitlist email capture and deploy.',
    priority: 'high',
  },
  {
    projectId: '5',
    projectName: 'Documentation Site',
    reason: 'quickest-win',
    explanation: '85% complete. Good momentum with recent activity. Could ship in 2-3 hours.',
    priority: 'high',
  },
  {
    projectId: '4',
    projectName: 'Database Migration Script',
    reason: 'at-risk',
    explanation: 'No activity in 6 months. This project is at risk of being forgotten completely.',
    priority: 'medium',
  },
  {
    projectId: '2',
    projectName: 'API Rate Limiter Service',
    reason: 'momentum-opportunity',
    explanation: 'Related to current focus. Recent updates mean good context recall.',
    priority: 'medium',
  },
]
