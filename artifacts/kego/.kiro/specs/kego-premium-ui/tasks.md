# Tasks: KeGo Premium UI

## Implementation Tasks

- [ ] 1. Design Token System
  - [ ] 1.1 Add Deep Space base palette tokens (`--ds-base-0` through `--ds-base-3`) to `index.css` under `.dark`
  - [ ] 1.2 Add glow spectrum tokens (`--ds-glow-blue`, `--ds-glow-indigo`, `--ds-glow-violet`, `--ds-glow-cyan`) to `index.css`
  - [ ] 1.3 Add text hierarchy tokens (`--ds-text-primary`, `--ds-text-secondary`, `--ds-text-muted`, `--ds-text-glow`) to `index.css`
  - [ ] 1.4 Add glassmorphism surface tokens (`--glass-bg`, `--glass-bg-hover`, `--glass-border`, `--glass-border-hover`, `--glass-blur`, `--glass-blur-heavy`, `--glass-blur-nav`) to `index.css`
  - [ ] 1.5 Add glass glow/shadow tokens (`--glass-glow-blue`, `--glass-glow-indigo`, `--glass-glow-hover`, `--glass-nav-bg`, `--glass-nav-border`) to `index.css`
  - [ ] 1.6 Add nebula orb gradient tokens (`--orb-1` through `--orb-4`) to `index.css`
  - [ ] 1.7 Add typography tokens (`--font-weight-display`, `--font-weight-heading`, `--font-weight-subheading`, `--tracking-display`, `--tracking-heading`, `--tracking-label`, `--tracking-caps`, `--leading-display`, `--leading-body`) to `index.css`
  - [ ] 1.8 Add premium spacing tokens (`--section-gap`, `--content-gap`, `--card-pad`, `--card-pad-sm`) to `index.css`
  - [ ] 1.9 Override `body` background to `--ds-base-1` in dark mode
  - [ ] 1.10 Add `@supports not (backdrop-filter: blur(1px))` fallback block for glass elements
  - [ ] 1.11 Add dark-palette shimmer keyframe animation (`@keyframes shimmer`) for loading states

- [ ] 2. NebulaBackground Component
  - [ ] 2.1 Create `src/components/ui/nebula-background.tsx` with `OrbConfig` interface and `NebulaBackgroundProps`
  - [ ] 2.2 Implement 4 default orb configs with independent durations (18s, 22s, 26s, 31s) and distinct colors using `--orb-1` through `--orb-4`
  - [ ] 2.3 Render each orb as `motion.div` with `position: fixed`, `z-index: 0`, `pointer-events: none`, `will-change: transform`
  - [ ] 2.4 Animate orbs using `x`/`y` keyframes with `repeat: Infinity, repeatType: "reverse", ease: "easeInOut"`
  - [ ] 2.5 Implement `useReducedMotion()` guard — when true, render static orbs with no animation props
  - [ ] 2.6 Wrap component in `React.memo`
  - [ ] 2.7 Mount `NebulaBackground` inside `AppLayout` as fixed full-screen background (z-0, behind all content)
  - [ ] 2.8 Mount `NebulaBackground` inside `HomePage` behind landing content

- [ ] 3. GlassCard Component
  - [ ] 3.1 Create `src/components/ui/glass-card.tsx` with `GlassVariant` type and `GlassCardProps` interface
  - [ ] 3.2 Implement `default` variant: `--glass-bg` background, 20px blur, 8% white border, `--glass-glow-blue` shadow
  - [ ] 3.3 Implement `elevated` variant: `rgba(17,29,53,0.65)` background, 28px blur, 12% white border
  - [ ] 3.4 Implement `nav` variant: `--glass-nav-bg` background, 24px blur, 6% white border
  - [ ] 3.5 Implement `hero` variant: `rgba(10,15,30,0.40)` background, 40px blur, 10% white border
  - [ ] 3.6 Implement `glow` prop — `'blue'` applies `--glass-glow-blue`, `'indigo'` applies `--glass-glow-indigo`, `'none'` applies no glow
  - [ ] 3.7 Implement hover animation when `hover={true}`: framer-motion `whileHover={{ y: -4, scale: 1.008 }}` with spring (stiffness: 300, damping: 20), shadow transition to `--glass-glow-hover`, border opacity to 16%
  - [ ] 3.8 Implement `whileTap={{ scale: 0.985 }}` when `onClick` is provided
  - [ ] 3.9 Ensure `position: relative` and `border-radius: var(--radius-lg)` on card wrapper
  - [ ] 3.10 Respect `useReducedMotion()` — disable framer-motion props when true

- [ ] 4. Navigation Redesign
  - [ ] 4.1 Update `TopNav` to use `--glass-nav-bg` background and `--glass-blur-nav` backdrop-filter
  - [ ] 4.2 Update `TopNav` border-bottom to `--glass-nav-border`
  - [ ] 4.3 Upgrade `LogoMark` in `TopNav`: gradient background container (blue→indigo), single-fire pulse ring animation on mount using framer-motion
  - [ ] 4.4 Update `SideNav` container to use glass nav surface tokens
  - [ ] 4.5 Restyle active nav items in `SideNav`: left border bar (2px gradient indigo→blue), glass elevated background, `--ds-text-primary` label; remove `bg-primary text-primary-foreground`
  - [ ] 4.6 Add framer-motion `whileHover` background fade to nav items in `SideNav` (150ms)
  - [ ] 4.7 Update `BottomNav` to use glass surface tokens (`--glass-nav-bg`, `--glass-blur-nav`, `--glass-nav-border` top border)
  - [ ] 4.8 Style active items in `BottomNav` with `--ds-glow-blue` color for icon and label

- [ ] 5. AnimatedHeadline Component
  - [ ] 5.1 Create `src/components/ui/animated-headline.tsx` with `AnimatedHeadlineProps` interface
  - [ ] 5.2 Implement word splitting and wrapping each word in `motion.span` with stagger container variant
  - [ ] 5.3 Word variant: `hidden: { opacity: 0, y: 20 }`, `visible: { opacity: 1, y: 0 }`, spring stiffness 300 damping 24
  - [ ] 5.4 Implement `highlightWords` prop — matching words render with blue-to-indigo gradient text treatment (`background-clip: text`)
  - [ ] 5.5 Implement `delay` prop for initial stagger start offset
  - [ ] 5.6 Respect `useReducedMotion()` — render all words visible instantly when true

- [ ] 6. Home/Landing Page Redesign
  - [ ] 6.1 Add `NebulaBackground` to `HomePage` as fixed background layer
  - [ ] 6.2 Update `HomePage` nav bar to use glass tokens (consistent with `TopNav` updates in task 4)
  - [ ] 6.3 Replace hero `h1` with `AnimatedHeadline` — highlight "Project Context" words with gradient treatment
  - [ ] 6.4 Add fade-in animation to hero subheading (delay 0.5s, 0.6s duration, ease out)
  - [ ] 6.5 Add entrance animation to CTA buttons (fade+slide up, delay 0.7s); add electric blue glow to primary CTA on hover
  - [ ] 6.6 Replace feature section `Card` instances with `GlassCard variant="default" glow="indigo"` and `whileInView` entrance stagger
  - [ ] 6.7 Update feature card icons: glowing circle container (blue-indigo gradient at 15% opacity)
  - [ ] 6.8 Replace social proof / benefits section container with `GlassCard variant="elevated"`
  - [ ] 6.9 Update footer background to `--ds-base-2`, text to `--ds-text-muted`

- [ ] 7. AnimatedCounter Component
  - [ ] 7.1 Create `AnimatedCounter` sub-component (exported from `src/components/ui/glass-stat-card.tsx` or its own file) using `useMotionValue`, `useSpring`, `useTransform`
  - [ ] 7.2 Implement count-up from 0 to `value` on mount over `duration` (default 1.2s), spring stiffness 100 damping 30
  - [ ] 7.3 Apply `Math.round()` via `useTransform` so display is always integer
  - [ ] 7.4 Handle `value` prop changes: animate from current to new value
  - [ ] 7.5 Respect `useReducedMotion()` — display final value immediately when true

- [ ] 8. GlassStatCard Component
  - [ ] 8.1 Create `src/components/ui/glass-stat-card.tsx` with `GlassStatCardProps` interface
  - [ ] 8.2 Use `GlassCard variant="elevated"` as surface
  - [ ] 8.3 Embed `AnimatedCounter` for the value display
  - [ ] 8.4 Apply icon color glow treatment (`filter: drop-shadow(0 0 8px currentColor)` at reduced opacity)
  - [ ] 8.5 Implement staggered entrance animation via `delay` prop (framer-motion `initial/animate` with delay)
  - [ ] 8.6 Render loading state with dark-palette shimmer (using shimmer CSS animation from token task 1.11)

- [ ] 9. Dashboard Page Redesign
  - [ ] 9.1 Replace 3 stat `Card` instances in `DashboardPage` with `GlassStatCard` (delays: 0.1s, 0.2s, 0.3s)
  - [ ] 9.2 Replace recovery recommendation `Card` instances with `GlassCard variant="default"` + hover interaction
  - [ ] 9.3 Replace "Recent Projects" `ProjectCard` instances with `GlassProjectCard`
  - [ ] 9.4 Replace skeleton `Skeleton` instances with dark-palette shimmer blocks (using shimmer class from task 1.11)
  - [ ] 9.5 Update section heading styles: `--font-weight-heading`, `--tracking-heading`, `--ds-text-primary`

- [ ] 10. HealthRing Component
  - [ ] 10.1 Create `HealthRing` component (exported from `src/components/projects/glass-project-card.tsx` or its own file) with `HealthRingProps` interface
  - [ ] 10.2 Render SVG circle (40×40px default) with `stroke-dasharray` / `stroke-dashoffset` for ring fill
  - [ ] 10.3 Implement `stroke-dashoffset` mount animation: ring "draws in" over 0.8s
  - [ ] 10.4 Apply health-status stroke colors: healthy `#22c55e`, at-risk `#f59e0b`, stalled `#ef4444`, dormant `#6b7280`
  - [ ] 10.5 Implement pulsing outer ring for `at-risk` health: `motion.circle` with `scale: 1→1.4, opacity: 1→0` repeating at 1.5s loop
  - [ ] 10.6 Respect `useReducedMotion()` — skip stroke draw animation and pulse when true

- [ ] 11. GlassProjectCard Component
  - [ ] 11.1 Create `src/components/projects/glass-project-card.tsx` with `GlassProjectCardProps` (same props as existing `ProjectCard`)
  - [ ] 11.2 Use `GlassCard variant="default" glow="indigo"` as surface
  - [ ] 11.3 Embed `HealthRing` component for health status display
  - [ ] 11.4 Render resume score as gradient bar (blue→indigo fill) with percentage width driven by `project.resumeScore`
  - [ ] 11.5 Apply glass-style outline treatment to "Mark" and "Resume" buttons (transparent fill, `--glass-border` border, hover: `--glass-bg` fill)
  - [ ] 11.6 Implement `compact` variant: minimal glass surface with project name, health 8px dot, resume score as text
  - [ ] 11.7 Ensure `onClick` handlers for `onMark` and `onResume` still call `e.preventDefault()` and `e.stopPropagation()`

- [ ] 12. Projects Page Updates
  - [ ] 12.1 Replace all `ProjectCard` usages in `ProjectsPage` with `GlassProjectCard`
  - [ ] 12.2 Replace search bar `Card` wrapper with `GlassCard variant="default"`
  - [ ] 12.3 Replace empty state / error state `Card` instances with `GlassCard variant="default"`
  - [ ] 12.4 Replace skeleton loading `Card` instances with dark-palette shimmer blocks
  - [ ] 12.5 Update "New Project" button with micro-interaction (task 9.1 pattern: whileTap scale 0.97, whileHover scale 1.02, glow on hover)

- [ ] 13. Page Transition System
  - [ ] 13.1 Create `src/components/ui/page-transition.tsx` with `PageTransitionProps` and `pageVariants` object
  - [ ] 13.2 Implement `initial`, `animate`, `exit` variants as specified: enter (opacity 0→1, y 12→0, 0.38s), exit (opacity 1→0, y 0→-8, 0.22s)
  - [ ] 13.3 When `useReducedMotion()` is true, render children directly without motion wrapper
  - [ ] 13.4 Wrap route `Switch` in `App.tsx` with `AnimatePresence mode="wait"`, passing current location as key
  - [ ] 13.5 Wrap return of `HomePage` in `<PageTransition>`
  - [ ] 13.6 Wrap return of `DashboardPage` in `<PageTransition>`
  - [ ] 13.7 Wrap return of `ProjectsPage` in `<PageTransition>`
  - [ ] 13.8 Wrap return of all project sub-pages (`ProjectRecoveryPage`, `ProjectVaultPage`, `ProjectTimelinePage`, `ProjectHubPage`) in `<PageTransition>`
  - [ ] 13.9 Ensure `PageTransition` `motion.div` wrapper has `width: 100%` to prevent layout shift

- [ ] 14. Micro-Interaction Patterns
  - [ ] 14.1 Create a `useReducedMotionVariants` utility hook in `src/lib/motion-utils.ts` that returns either the full variant object or instant/no-motion version based on `useReducedMotion()`
  - [ ] 14.2 Update primary `Button` component (or create a `GlassButton` wrapper) with `whileTap={{ scale: 0.97 }}` and `whileHover={{ scale: 1.02 }}`
  - [ ] 14.3 Add glow hover style to primary filled buttons: `hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]` via Tailwind or inline style
  - [ ] 14.4 Update `Input` focus styles: replace default ring with `focus:shadow-[0_0_0_2px_rgba(99,102,241,0.4)]` blue-indigo glow
  - [ ] 14.5 Apply `whileTap={{ scale: 0.985 }}` to all `GlassCard` instances that have `onClick`

- [ ] 15. Typography Polish
  - [ ] 15.1 Verify Inter variable font import supports `wght` 100–900 axis; update font import in `index.html` or CSS if needed to include `font-display: swap`
  - [ ] 15.2 Apply `--font-weight-display` and `--tracking-display` to hero h1 in `HomePage`
  - [ ] 15.3 Apply `--font-weight-heading` and `--tracking-heading` to all section h2 headings (Dashboard, Projects page headers)
  - [ ] 15.4 Apply `--font-weight-subheading` to card title elements in `GlassProjectCard` and `GlassStatCard`
  - [ ] 15.5 Apply `--leading-body` line-height to all body/description text paragraphs
