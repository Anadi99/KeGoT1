-- KeGo Full Persistence — Seed Data
-- Idempotent: all inserts use ON CONFLICT DO NOTHING
-- UUIDs are fixed strings so re-running produces no duplicates.
-- Timestamps are expressed relative to now() so data stays "recent" over time.

-- ---------------------------------------------------------------------------
-- projects  (5 rows matching mockProjects)
-- ---------------------------------------------------------------------------
INSERT INTO projects (id, name, description, health, resume_score, recovery_confidence, context_completeness, tags, last_activity, created_at, paused_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'FounderOS Landing Page',
    'Marketing website for founder productivity tool',
    'healthy',
    92,
    95,
    98,
    '{marketing,saas,frontend}',
    now() - interval '7 days',
    now() - interval '60 days',
    now() - interval '7 days'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'API Rate Limiter Service',
    'Redis-backed rate limiting microservice',
    'at-risk',
    65,
    72,
    68,
    '{backend,infrastructure,devtools}',
    now() - interval '30 days',
    now() - interval '120 days',
    now() - interval '30 days'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Mobile App Redesign',
    'Complete UI/UX overhaul for iOS app',
    'stalled',
    38,
    45,
    42,
    '{mobile,design,ios}',
    now() - interval '90 days',
    now() - interval '180 days',
    now() - interval '90 days'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Database Migration Script',
    'Migrate from MongoDB to PostgreSQL',
    'dormant',
    15,
    20,
    18,
    '{database,infrastructure,sql}',
    now() - interval '180 days',
    now() - interval '365 days',
    now() - interval '180 days'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'Documentation Site',
    'Comprehensive docs for all products',
    'healthy',
    78,
    85,
    82,
    '{documentation,frontend,devx}',
    now() - interval '3 days',
    now() - interval '90 days',
    now() - interval '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- decisions  (2 rows matching mockDecisions — all for project 0001)
-- ---------------------------------------------------------------------------
INSERT INTO decisions (id, project_id, title, description, rationale, alternatives, consequences, confidence, decided_at, created_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'Framework Choice: Next.js 16',
    'Evaluated multiple frameworks for the landing page',
    'Next.js 16 provides edge functions, built-in optimizations, and Vercel integration for seamless deployments',
    '{Astro,Remix,Svelte}',
    'Strong performance, easier deployments, access to latest React features',
    90,
    now() - interval '55 days',
    now() - interval '55 days'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    'Analytics Platform: Vercel Analytics',
    'Switched from Google Analytics to Vercel Analytics',
    'Better real-time insights, privacy-focused, native integration with Vercel deployment',
    '{"Google Analytics","Mixpanel","Plausible"}',
    'Simpler setup, real-time data, reduced third-party dependencies',
    85,
    now() - interval '10 days',
    now() - interval '10 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- milestones  (4 rows matching mockMilestones — all for project 0001)
-- ---------------------------------------------------------------------------
INSERT INTO milestones (id, project_id, title, description, status, percent_complete, completed_at, due_date, created_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    'Design System Complete',
    'All components designed, documented, and approved',
    'completed',
    100,
    now() - interval '45 days',
    NULL,
    now() - interval '60 days'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    'Homepage Implementation',
    'Build homepage with animations and CMS integration',
    'completed',
    100,
    now() - interval '20 days',
    NULL,
    now() - interval '55 days'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000001',
    'Performance Optimization',
    'Optimize Core Web Vitals to meet targets',
    'in-progress',
    60,
    NULL,
    NULL,
    now() - interval '30 days'
  ),
  (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000001',
    'Waitlist Integration',
    'Implement email capture and welcome sequence',
    'planned',
    0,
    NULL,
    now() + interval '7 days',
    now() - interval '7 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- vault_entries  (3 rows matching mockVaultEntries — all for project 0001)
-- ---------------------------------------------------------------------------
INSERT INTO vault_entries (id, project_id, title, content, category, tags, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000001',
    'Brand Colors',
    'Primary: #3B82F6 (Blue), Secondary: #10B981 (Green), Neutral: #6B7280 (Gray)',
    'decision',
    '{branding,design}',
    now() - interval '40 days',
    now() - interval '35 days'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000001',
    'Logo Guidelines',
    'Logo should maintain 1:1 aspect ratio, minimum size 40x40px, always use with clear space',
    'decision',
    '{branding,guidelines}',
    now() - interval '50 days',
    now() - interval '50 days'
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    '00000000-0000-0000-0000-000000000001',
    'Marketing Documentation',
    'https://docs.google.com/document/d/marketing-brief',
    'resource',
    '{marketing,strategy}',
    now() - interval '20 days',
    now() - interval '20 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- timeline_events  (5 rows matching mockTimelineEvents — all for project 0001)
-- ---------------------------------------------------------------------------
INSERT INTO timeline_events (id, project_id, type, title, description, timestamp, created_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000001',
    'created',
    'Project created',
    'Memory start point',
    now() - interval '60 days',
    now() - interval '60 days'
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000001',
    'milestone',
    'Design system finalized',
    'All components documented and approved',
    now() - interval '45 days',
    now() - interval '45 days'
  ),
  (
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000001',
    'milestone',
    'Homepage launched',
    'Deployed to production',
    now() - interval '20 days',
    now() - interval '20 days'
  ),
  (
    '00000000-0000-0000-0000-000000000404',
    '00000000-0000-0000-0000-000000000001',
    'decision',
    'Switched to Vercel Analytics',
    'Better real-time insights than Google Analytics',
    now() - interval '10 days',
    now() - interval '10 days'
  ),
  (
    '00000000-0000-0000-0000-000000000405',
    '00000000-0000-0000-0000-000000000001',
    'paused',
    'Project paused',
    'Context preserved for future resumption',
    now() - interval '7 days',
    now() - interval '7 days'
  )
ON CONFLICT (id) DO NOTHING;
