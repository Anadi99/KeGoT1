# CRITICAL PATH TO LAUNCH
## The Only Work That Matters (Next 12 Weeks)

---

## PHASE 1: BACKEND INFRASTRUCTURE (Week 1-2)
### Make The App Actually Functional

**Week 1: Authentication + Database Setup**

Day 1-2: Neon PostgreSQL Setup
```
- Create Neon account
- Set DATABASE_URL env var
- Create initial schema (users, projects, vault_entries, timeline_events, integrations, audit_logs)
- Create Drizzle ORM schema files
- Generate migrations
```

Day 3-4: Better Auth Implementation
```
- Install better-auth package
- Configure Neon database for Better Auth
- Create login/signup pages
- Create logout functionality
- Add session middleware to app layout
- Protect all routes requiring auth
- Create protected layout wrapper
```

Day 5: Session Management
```
- Verify authentication works end-to-end
- Test session persistence across page reload
- Create user context for React components
- Verify logout clears session
```

**Week 2: Core API Routes + CRUD Operations**

Day 1-2: User Context + Middleware
```
- Create app/api/auth/* routes (login, signup, logout, session)
- Create middleware/auth.ts for route protection
- Export useAuth() hook for components
- Test: try to access protected route, redirects to login
```

Day 3-4: Project API Routes
```
- POST /api/projects (create)
- GET /api/projects (list)
- GET /api/projects/[id] (single)
- PUT /api/projects/[id] (update)
- DELETE /api/projects/[id] (delete)
- Test: CRUD operations work with real database
```

Day 5: Vault + Timeline API Routes
```
- POST /api/projects/[id]/vault (create entry)
- GET /api/projects/[id]/vault (list entries)
- POST /api/projects/[id]/timeline (create event)
- GET /api/projects/[id]/timeline (list events)
- Test: entries persist after page reload
```

**End of Week 2: Reality Check**
- ✅ Users can sign up
- ✅ Projects persist in database
- ✅ Page refresh shows saved projects
- ✅ Logout and login shows different user context
- ✅ Users cannot access other users' data

---

## PHASE 2: CORE ALGORITHMS (Week 3-4)
### Make Scoring Real (Stop Hardcoding Values)

**Week 3: Resume Score + Recovery Confidence**

Day 1-2: Implement Resume Score Calculation
```typescript
// Move from hardcoded to calculated
function calculateResumeScore(project: Project): number {
  const docs = vault.filter(v => v.category === 'decision').length;
  const resources = vault.filter(v => v.category === 'resource').length;
  const tasks = project.pendingWork.split('\n').length;
  const decisions = decisions.length;
  
  const docScore = Math.min(docs * 10, 100);
  const resourceScore = Math.min(resources * 15, 100);
  const taskScore = Math.min(tasks * 5, 100);
  const decisionScore = Math.min(decisions * 20, 100);
  
  return Math.round((docScore + resourceScore + taskScore + decisionScore) / 4);
}
```

Day 3-4: Implement Recovery Confidence + Project Health
```typescript
function calculateRecoveryConfidence(project: Project): number {
  const daysSincePause = (Date.now() - project.pausedAt) / (1000 * 60 * 60 * 24);
  const recencePenalty = daysSincePause > 30 ? 30 - (daysSincePause - 30) : 0;
  
  return Math.max(project.resumeScore - recencePenalty, 0);
}

function calculateProjectHealth(project: Project): ProjectHealth {
  const daysSincePause = (Date.now() - project.pausedAt) / (1000 * 60 * 60 * 24);
  
  if (daysSincePause < 7) return 'active';
  if (daysSincePause < 30 && project.resumeScore > 80) return 'healthy';
  if (daysSincePause < 90) return 'at-risk';
  if (daysSincePause < 180) return 'stalled';
  return 'dormant';
}
```

Day 5: Integrate Calculations Into API + UI
```
- Update GET /api/projects to calculate scores
- Verify scores change based on vault entries
- Update dashboard UI to show calculated values
- Test: add vault entry → score increases
```

**Week 4: Score Breakdown Calculations + Project Snapshots**

Day 1-2: Score Breakdown (7 sub-scores)
```typescript
function calculateScoreBreakdown(project): ResumeScoreBreakdown {
  return {
    documentationQuality: calculateDocumentationScore(),
    resourceCompleteness: calculateResourceScore(),
    taskClarity: calculateTaskScore(),
    decisionHistory: calculateDecisionScore(),
    milestoneCoverage: calculateMilestoneScore(),
    contextRichness: calculateContextScore(),
    recoverability: calculateRecoverabilityScore(),
  };
}
```

Day 3-4: Project Snapshots
```typescript
function createProjectSnapshot(project: Project): ProjectSnapshot {
  return {
    projectId: project.id,
    timestamp: new Date(),
    reason: 'milestone' | 'decision' | 'pause' | 'manual',
    snapshot: {
      summary: project.description,
      completedMilestones: getCompletedMilestones(),
      pendingWork: project.pendingWork,
      keyDecisions: getKeyDecisions(),
      blockers: getBlockers(),
    }
  };
}

// Auto-create snapshot on: milestone completion, decision creation, pause
```

Day 5: End-to-End Testing
```
- Create project with 5 vault entries
- Verify Resume Score is between 0-100
- Complete a milestone
- Verify snapshot created
- Verify score increased
- Verify health status correct
```

**End of Week 4: Reality Check**
- ✅ Resume Score calculated from data (not hardcoded)
- ✅ Recovery Confidence reflects time since pause
- ✅ Project Health correct status
- ✅ Score Breakdown shows 7 metrics
- ✅ Snapshots created automatically

---

## PHASE 3: MONETIZATION (Week 5)
### Enable Revenue

**Week 5: Stripe Integration + Tier Limits**

Day 1: Stripe Setup
```
- Create Stripe account
- Add Stripe API key to env
- Create pricing tiers in Stripe:
  - Free: $0 (5 projects, 50 vault entries)
  - Pro: $29/mo (unlimited projects, unlimited vault entries, integrations)
  - Enterprise: custom pricing
```

Day 2-3: Payment Processing
```typescript
// Create /api/checkout endpoint
export async function POST(req: Request) {
  const session = await auth();
  const priceId = req.json().priceId; // stripe price ID
  
  const stripeSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: 'https://kego.app/dashboard?success=true',
    cancel_url: 'https://kego.app/pricing',
  });
  
  return Response.json({ url: stripeSession.url });
}

// Create /api/billing/webhook for subscription events
export async function POST(req: Request) {
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  
  if (event.type === 'customer.subscription.created') {
    // Update user tier in database
  }
  if (event.type === 'customer.subscription.deleted') {
    // Downgrade user to free
  }
}
```

Day 4: Usage Tracking + Tier Limits
```typescript
// Track usage in database
async function trackUsage(userId: string, feature: string) {
  await db.usage.create({
    userId,
    feature,
    timestamp: new Date(),
  });
}

// Check limits before allowing action
async function checkLimit(userId: string, feature: string): Promise<boolean> {
  const user = await db.users.findOne({ id: userId });
  const tier = user.tier; // 'free' | 'pro' | 'enterprise'
  
  const limits = {
    free: { projects: 5, vault_entries: 50, searches: 100 },
    pro: { projects: Infinity, vault_entries: Infinity, searches: Infinity },
  };
  
  const usage = await db.usage.countDocuments({
    userId,
    feature,
    timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days
  });
  
  return usage < limits[tier][feature];
}

// Call before creating project, vault entry, etc.
if (!(await checkLimit(userId, 'projects'))) {
  return Response.json({ error: 'Upgrade to Pro for unlimited projects' }, { status: 402 });
}
```

Day 5: Pricing Page + Checkout Flow
```
- Create /pricing page with tier comparison
- Add "Upgrade" buttons throughout app
- Create /checkout page
- Test: sign up free → click upgrade → Stripe modal → can subscribe
- Test: free user cannot create >5 projects
- Test: pro user has unlimited
```

**End of Week 5: Reality Check**
- ✅ Users can sign up free
- ✅ Free tier limits work (cannot exceed 5 projects)
- ✅ Users can upgrade to Pro
- ✅ Pro users have unlimited everything
- ✅ Pricing page clear and converts

---

## PHASE 4: SECURITY + COMPLIANCE (Week 6-7)
### Prevent Getting Hacked or Sued

**Week 6: Input Validation + Encryption**

Day 1-2: Input Validation (Zod)
```typescript
// Create lib/schemas.ts
import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000),
  tags: z.array(z.string()).max(10),
});

export const CreateVaultEntrySchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().max(10000),
  category: z.enum(['decision', 'resource', 'link', 'note']),
  tags: z.array(z.string()).max(20),
});

// In API routes:
const data = CreateProjectSchema.parse(await req.json());
// ^ Throws if validation fails
```

Day 3-4: Encryption at Rest
```typescript
import { createCipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${authTag.toString('hex')}`;
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex, authTagHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted) + decipher.final('utf8');
}

// Encrypt before storing API keys in database
const encryptedGithubToken = encrypt(githubOAuthToken);
await db.integrations.create({
  userId,
  type: 'github',
  token: encryptedGithubToken,
});
```

Day 5: Test Security
```
- Attempt SQL injection: ' OR '1'='1
- Attempt XSS: <script>alert('xss')</script>
- Both should fail validation
- Verify API keys stored encrypted in database
```

**Week 7: Audit Logging + GDPR Compliance**

Day 1-2: Audit Logging
```typescript
async function auditLog(
  userId: string,
  action: string,
  resource: string,
  resourceId: string,
  oldValue?: any,
  newValue?: any
) {
  await db.audit_logs.create({
    userId,
    action,
    resource,
    resourceId,
    oldValue: oldValue ? JSON.stringify(oldValue) : null,
    newValue: newValue ? JSON.stringify(newValue) : null,
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });
}

// Call after every mutating operation:
await db.projects.update({ id, ...update });
await auditLog(userId, 'update', 'project', id, oldProject, newProject);
```

Day 3-4: GDPR Compliance
```typescript
// DELETE /api/user (Right to be forgotten)
export async function DELETE(req: Request) {
  const session = await auth();
  
  // Delete all user data (cascade)
  await db.projects.deleteMany({ userId: session.user.id });
  await db.vault_entries.deleteMany({ userId: session.user.id });
  await db.timeline_events.deleteMany({ userId: session.user.id });
  await db.users.deleteOne({ id: session.user.id });
  
  // Log deletion
  await auditLog(session.user.id, 'delete', 'user', session.user.id);
  
  return Response.json({ success: true });
}

// GET /api/user/export (Right to data portability)
export async function GET(req: Request) {
  const session = await auth();
  
  const userData = {
    user: await db.users.findOne({ id: session.user.id }),
    projects: await db.projects.find({ userId: session.user.id }),
    vaultEntries: await db.vault_entries.find({ userId: session.user.id }),
    timelineEvents: await db.timeline_events.find({ userId: session.user.id }),
  };
  
  return Response.json(userData);
}
```

Day 5: Sentry Integration (Error Logging)
```
- npm install @sentry/nextjs
- Set SENTRY_AUTH_TOKEN in env
- Add to next.config.mjs:
  withSentryConfig(nextConfig, { ... })
- Errors now automatically logged to Sentry dashboard
```

**End of Week 7: Reality Check**
- ✅ Cannot inject SQL
- ✅ Cannot XSS inject
- ✅ API keys encrypted in database
- ✅ Audit log tracks all changes
- ✅ User can delete account (GDPR)
- ✅ User can export data (GDPR)
- ✅ Errors logged to Sentry

---

## PHASE 5: CRITICAL FEATURES (Week 8-10)
### Make the Product Actually Useful

**Week 8: Error Handling + Loading States**

Day 1-2: Error Boundaries
```typescript
'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-4">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })} className="btn">
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Day 3-4: Loading States on All Async Operations
```typescript
const [projects, setProjects] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProjects();
}, []);

return (
  <div>
    {isLoading && <Skeleton className="h-12 w-full" />}
    {error && <ErrorMessage error={error} />}
    {projects.length === 0 && !isLoading && <EmptyState />}
    {projects.map(p => <ProjectCard key={p.id} project={p} />)}
  </div>
);
```

Day 5: Empty States + Error UI
```
- Create EmptyState component used when no data
- Create ErrorMessage component showing errors
- Update all pages to handle: loading, error, empty, populated states
- Test: slow internet - see skeletons
- Test: API error - see error message
- Test: new project with no data - see empty state
```

**Week 9-10: Integration Engines (Choose 2-3 to Start)**

**Option A: GitHub Syncing** (High priority - 3 days)
```typescript
// POST /api/integrations/github/sync
export async function POST(req: Request) {
  const session = await auth();
  const { projectId } = await req.json();
  
  const integration = await db.integrations.findOne({
    userId: session.user.id,
    type: 'github',
    projectId,
  });
  
  if (!integration) return Response.json({ error: 'Not connected' }, { status: 400 });
  
  const token = decrypt(integration.token);
  const { repoUrl } = integration.config;
  const [owner, repo] = repoUrl.split('/').slice(-2);
  
  // Fetch commits from GitHub
  const commits = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits`,
    { headers: { Authorization: `token ${token}` } }
  ).then(r => r.json());
  
  // Create timeline events from commits
  for (const commit of commits.slice(0, 50)) {
    await db.timeline_events.create({
      projectId,
      type: 'github:commit',
      title: commit.commit.message.split('\n')[0],
      description: commit.commit.message,
      timestamp: new Date(commit.commit.author.date),
      source: 'github',
      sourceId: commit.sha,
      sourceUrl: commit.html_url,
    });
  }
  
  // Update sync timestamp
  await db.integrations.update(
    { id: integration.id },
    { lastSyncAt: new Date() }
  );
  
  return Response.json({ success: true, count: commits.length });
}
```

**Option B: Email Ingestion** (High priority - 3 days)
```typescript
// Sendgrid webhook: POST /api/integrations/email/receive
export async function POST(req: Request) {
  const body = await req.text();
  const event = JSON.parse(body);
  
  if (event.event !== 'inbound') return Response.json({ ok: true });
  
  const { to, from, subject, text, attachments } = event;
  const [projectEmail] = to;
  const [, projectId] = projectEmail.split('-'); // 'project-123@kego.app'
  
  // Find project
  const project = await db.projects.findOne({ id: projectId });
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 });
  
  // Create vault entry from email
  await db.vault_entries.create({
    projectId,
    title: subject,
    content: text,
    category: 'note',
    source: 'email',
    sourceId: event.email_id,
    tags: [],
  });
  
  // Handle attachments
  for (const attachment of attachments || []) {
    // Store in S3
  }
  
  return Response.json({ success: true });
}
```

**Option C: Semantic Search** (Medium priority - 4 days)
```typescript
// Install pgvector + OpenAI
// npm install pgvector pg-vector openai

// POST /api/search
export async function POST(req: Request) {
  const { query } = await req.json();
  
  // Generate embedding from query
  const embedding = await openai.embeddings.create({
    input: query,
    model: 'text-embedding-3-small',
  });
  
  // Find similar vault entries (semantic search)
  const results = await db.vault_entries.query(
    `SELECT * FROM vault_entries 
     WHERE project_id = $1 
     ORDER BY embedding <-> $2::vector 
     LIMIT 10`,
    [projectId, embedding.data[0].embedding]
  );
  
  return Response.json(results);
}
```

---

## PHASE 6: APP STORE READINESS (Week 11-12)
### Polish for Launch

**Week 11: Accessibility + Performance**

Day 1-2: Accessibility Audit
```
- Run axe DevTools: fix all violations
- Test with VoiceOver on Mac (Cmd+F5)
- Add aria-labels to all buttons
- Verify keyboard navigation works
- Test on real iPhone with VoiceOver
- Fix: minimum contrast 4.5:1 for text
```

Day 3-4: Performance Optimization
```
- Use Lighthouse: target 90+ on all metrics
- Implement lazy loading for images
- Code split components by route
- Implement virtualization for long lists
- Optimize bundle size
- Test on slow 3G network
```

Day 5: Mobile Refinement
```
- Test on real iPhone 15 Pro (Dynamic Island)
- Test on iPhone SE (no notch)
- Test on iPad (landscape)
- Test on iPad Pro (large screen)
- Adjust safe areas
- Test on real devices, not just browser
```

**Week 12: Final Polish + Load Testing**

Day 1-2: Load Testing
```
- Use Apache JMeter or LoadImpact
- Simulate 100 concurrent users
- Verify app responds < 500ms
- Check database handles load
- Monitor Neon metrics
- Fix bottlenecks
```

Day 3-4: Final Design Audit
```
- Compare to Linear, Stripe, Notion
- Check: colors, spacing, typography
- Run through all flows: signup → create → integrate → upgrade
- Test error scenarios: network offline, API down, etc.
```

Day 5: Launch Preparation
```
- Create privacy policy + ToS
- Create help documentation
- Set up support email
- Create onboarding tutorial
- Test signup flow 10 times
- Ready for beta launch
```

---

## CRITICAL SUCCESS METRICS (Track Weekly)

After each phase:
- Phase 1: Auth working? Projects persist?
- Phase 2: Scores calculating correctly?
- Phase 3: Can users actually pay?
- Phase 4: Errors logged to Sentry?
- Phase 5: GitHub sync working?
- Phase 6: 90+ Lighthouse score?

---

## THE ONLY THING THAT MATTERS

**Do not:**
- Add more UI features
- Refactor existing code
- Optimize too early
- Add analytics
- Create admin dashboard
- Build API documentation yet

**Only do:**
- Phase 1 (auth + database) - Week 1-2
- Phase 2 (real scoring) - Week 3-4
- Phase 3 (Stripe) - Week 5
- Phase 4 (security) - Week 6-7
- Phase 5 (integrations) - Week 8-10
- Phase 6 (polish) - Week 11-12

**This roadmap = the difference between a product that works and launching to crickets.**

Follow it religiously.

