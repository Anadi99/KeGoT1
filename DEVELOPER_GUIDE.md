# KeGo Developer Guide

## Quick Start

### Installation
```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` - Landing page
Visit `http://localhost:3000/dashboard` - Main app

### Project Structure
```
/app                    - Next.js routes
/components
  /layout              - Navigation & app layout
  /recovery            - Recovery features (Score, Health, Confidence, Workspace)
  /projects            - Project components
  /ui                  - shadcn/ui components
/lib
  - types.ts           - TypeScript interfaces
  - mock-data.ts       - Sample project data
  - recovery-utils.ts  - Scoring & calculations
  - utils.ts           - General utilities
```

---

## Key Concepts

### Resume Score (0-100)
Measures project context completeness. Determines recoverability.
- **Formula**: Context quality + task clarity + recency + structure
- **Display**: ResumeScore component with color coding
- **Color coding**: 0-30 (red), 31-60 (yellow), 61-100 (green)
- **Where**: Dashboard, projects list, recovery workspace

### Recovery Confidence (0-100%)
Measures readiness to resume a project immediately.
- **Shows**: How confident we are that you can resume right now
- **Based on**: Resume Score + context completeness
- **Display**: RecoveryConfidence component with progress bar
- **Ranges**:
  - 81-100%: Ready to resume now
  - 61-80%: Good readiness
  - 41-60%: Moderate readiness
  - 0-40%: Will need documentation review

### Project Health (5 States)
Visual indicator of project condition:
- **Healthy**: Active, good context (green)
- **At Risk**: Paused 60+ days, moderate context (yellow)
- **Stalled**: Paused 90+ days, low context (orange)
- **Dormant**: Paused 180+ days, critical (red)
- **Recovered**: Successfully resumed (green)

### Recovery Workspace
The flagship feature showing complete project context in 8 sections:
1. Project Summary
2. Completed Work
3. Pending Work
4. Blockers
5. Important Decisions
6. Important Resources
7. Suggested Next Action
8. Time to Resume

---

## Component Guide

### Recovery Components

#### ResumeScore
```tsx
import { ResumeScore } from '@/components/recovery/resume-score'

<ResumeScore 
  score={92}           // 0-100
  variant="md"         // sm | md | lg
  showLabel={true}     // Shows "Strong context" text
  showExplanation={true} // Shows help icon
/>
```

#### ProjectHealthBadge
```tsx
import { ProjectHealthBadge } from '@/components/recovery/project-health'

<ProjectHealthBadge 
  health="at-risk"     // healthy | at-risk | stalled | dormant | recovered
  showIcon={true}      // Show status icon
  size="md"            // sm | md
/>
```

#### RecoveryConfidence
```tsx
import { RecoveryConfidence } from '@/components/recovery/recovery-confidence'

<RecoveryConfidence 
  confidence={95}      // 0-100%
  interpretation={true} // Show interpretation text
/>
```

#### ProjectCard
```tsx
import { ProjectCard } from '@/components/projects/project-card'

<ProjectCard 
  project={project}     // Project object
  variant="full"        // compact | full
/>
```

### Layout Components

#### AppLayout
Wraps all app pages. Handles navigation.
```tsx
import { AppLayout } from '@/components/layout/app-layout'

<AppLayout>
  <div>Page content</div>
</AppLayout>
```

---

## Data Types

### Project
```tsx
interface Project {
  id: string
  name: string
  description: string
  resumeScore: number         // 0-100
  recoveryConfidence: number  // 0-100
  health: ProjectHealth       // 5 states
  contextCompleteness: number // 0-100
  lastActivity: Date
  createdAt: Date
  pausedAt?: Date
  resumedAt?: Date
  tags: string[]
}
```

### RecoveryWorkspace
```tsx
interface RecoveryWorkspace {
  projectId: string
  projectSummary: string
  completedWork: string
  pendingWork: string
  blockers: string
  importantDecisions: string
  importantResources: string
  suggestedNextAction: string
  estimatedTimeToResume: string
  lastUpdated: Date
}
```

### VaultEntry
```tsx
interface VaultEntry {
  id: string
  projectId: string
  title: string
  content: string
  category: 'decision' | 'resource' | 'link' | 'note'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

### TimelineEvent
```tsx
interface TimelineEvent {
  id: string
  projectId: string
  type: 'created' | 'milestone' | 'decision' | 'paused' | 'resumed' | 'memory-reconstructed'
  title: string
  description: string
  timestamp: Date
}
```

---

## Utility Functions

### recovery-utils.ts

```tsx
// Get color for Resume Score
getResumeScoreColor(score: number): string
// Returns: CSS color variable

// Get label for Resume Score
getResumeScoreLabel(score: number): string
// Returns: "Strong context" | "Moderate context" | "Limited context"

// Get health badge color
getHealthColor(health: ProjectHealth): string
// Returns: CSS color variable

// Get health label
getHealthLabel(health: ProjectHealth): string
// Returns: "Healthy" | "At Risk" | "Stalled" | "Dormant" | "Recovered"

// Get confidence interpretation
getRecoveryConfidenceInterpretation(confidence: number): string
// Returns: Human-readable confidence description

// Format time since pause
formatTimeSincePause(date: Date): string
// Returns: "3 days ago" | "1 week ago" | etc.

// Calculate project health
calculateProjectHealth(
  resumeScore: number, 
  daysSincePause: number, 
  lastActivityRecent: boolean
): ProjectHealth

// Estimate time to resume
estimateTimeToResume(contextCompleteness: number): string
// Returns: "10-15 minutes" | "20-30 minutes" | etc.
```

---

## Routing

### Page Hierarchy

```
/ (landing)
  └─ /dashboard (recovery dashboard)
  └─ /projects (all projects)
     └─ /projects/[id]/recovery (recovery workspace)
     └─ /projects/[id]/vault (knowledge vault)
     └─ /projects/[id]/timeline (memory timeline)
  └─ /settings (settings)
```

### Dynamic Routes
- `[id]` - Project ID from mock data or database
- Example: `/projects/1/recovery` - Project 1's recovery workspace

---

## Styling

### Theme Variables
Dark mode colors defined in `app/globals.css`:
```css
--background: oklch(0.145 0 0)          /* Near black */
--foreground: oklch(0.985 0 0)          /* Near white */
--primary: oklch(0.922 0 0)             /* Light gray */
--card: oklch(0.205 0 0)                /* Slightly lighter than bg */

/* KeGo Custom Colors */
--score-critical: oklch(0.624 0.213 29.234)   /* Red */
--score-warning: oklch(0.788 0.189 95.682)    /* Yellow */
--score-healthy: oklch(0.577 0.208 142.495)   /* Green */
```

### Spacing
- Use Tailwind spacing: `p-4`, `gap-2`, `my-6`
- Never use `space-y-*`, use `flex flex-col gap-*` instead
- Base: 4px unit (p-1 = 4px, p-2 = 8px, etc.)

### Component Variants
shadcn/ui components support variants:
```tsx
<Button variant="outline" size="sm">Click me</Button>
<Badge variant="secondary">Tag</Badge>
<Card className="hover:bg-muted/50">Content</Card>
```

---

## Adding New Features

### Add a New Page
1. Create route file: `/app/new-feature/page.tsx`
2. Wrap with `<AppLayout>`
3. Import components as needed

### Add a New Component
1. Create file: `/components/feature/component-name.tsx`
2. Mark as `'use client'` if interactive
3. Use TypeScript with proper types
4. Export component

### Modify Styling
1. Edit `app/globals.css` for theme variables
2. Use Tailwind classes in components
3. No inline styles - always use classes

### Add Mock Data
1. Update `lib/mock-data.ts`
2. Add new data objects
3. Export for use in components

---

## Production Checklist

Before deploying:

- [ ] Add authentication (Better Auth recommended)
- [ ] Replace mock data with real database (Neon/Supabase)
- [ ] Add AI integration (AI SDK for summaries)
- [ ] Implement search functionality
- [ ] Add project creation/editing flows
- [ ] Set up error logging (Sentry)
- [ ] Add analytics (Vercel Analytics)
- [ ] Test on mobile devices
- [ ] Performance audit (Lighthouse)
- [ ] SEO optimization
- [ ] Security audit
- [ ] Set up CI/CD pipeline

---

## Common Tasks

### Update Resume Score Calculation
Edit `lib/recovery-utils.ts` → `getResumeScoreColor()` and `getResumeScoreLabel()`

### Change Health Status Logic
Edit `lib/recovery-utils.ts` → `calculateProjectHealth()`

### Modify Recovery Workspace Layout
Edit `components/recovery/recovery-workspace.tsx`

### Add New Project Category
Update `VaultEntry` type in `lib/types.ts`, add category, update vault component

### Customize Colors
Edit `app/globals.css` theme variables

### Adjust Breakpoints
Edit Tailwind responsive classes: `md:`, `lg:`, `xl:`

---

## Performance Notes

- Next.js Server Components used where possible
- Client Components only for interactive elements
- Icons from lucide-react (tree-shakeable)
- CSS-in-JS minimized (all Tailwind)
- Images optimized with next/image (when needed)
- No unnecessary re-renders via proper React patterns

---

## Testing

### Unit Tests (Future)
Setup Jest for component testing
```bash
pnpm add -D jest @testing-library/react
```

### E2E Tests (Future)
Setup Playwright for full-page testing
```bash
pnpm add -D @playwright/test
```

### Browser Testing
Current testing done with manual browser verification
Use `agent-browser` for automated testing

---

## Deployment

### Vercel
```bash
git push origin main  # Auto-deploys
```

### Environment Variables
Required for production:
- `DATABASE_URL` - When adding database
- `AI_SDK_KEY` - When adding AI
- `AUTH_SECRET` - When adding auth

See `.env.example` for required vars

---

## Troubleshooting

### Build Errors
```bash
# Clean rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Type Errors
```bash
# Check TypeScript
pnpm tsc --noEmit
```

### Missing Components
```bash
# Add shadcn component
npx shadcn-ui@latest add component-name
```

### Dev Server Issues
```bash
# Kill existing process
kill $(lsof -t -i:3000)
# Restart
pnpm dev
```

---

## Resources

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TailwindCSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev
- **TypeScript**: https://www.typescriptlang.org/docs

---

## Support

For questions about KeGo architecture or implementation:
1. Check this guide
2. Review IMPLEMENTATION_SUMMARY.md
3. Check REQUIREMENTS_VALIDATION.md
4. Read the component source code (well-commented)
