# Requirements: KeGo Premium UI

## Overview

Transform the KeGo app's visual layer into a premium Deep Space glassmorphism aesthetic while preserving all existing functionality. The redesign targets the React + TypeScript + Vite + Tailwind v4 stack, is entirely additive (no data model changes), and leverages the already-installed framer-motion library for animation.

---

## Requirement 1: Global Design Token System

**User Story**: As a developer, I want a single source of truth for all Deep Space color, glass, glow, and typography tokens in `index.css`, so that every component references shared variables and the palette is easily tunable.

### Acceptance Criteria

1.1 `index.css` defines the following CSS custom property groups under `:root` and/or `.dark`:
   - Deep Space base palette: `--ds-base-0` through `--ds-base-3` (near-black navy/indigo range #050810 → #111d35)
   - Glow spectrum: `--ds-glow-blue` (#3b82f6), `--ds-glow-indigo` (#6366f1), `--ds-glow-violet` (#8b5cf6), `--ds-glow-cyan` (#06b6d4)
   - Text hierarchy: `--ds-text-primary`, `--ds-text-secondary`, `--ds-text-muted`, `--ds-text-glow`
   - Glass surface tokens: `--glass-bg`, `--glass-bg-hover`, `--glass-border`, `--glass-border-hover`, `--glass-blur`, `--glass-blur-heavy`, `--glass-blur-nav`
   - Glass shadow/glow tokens: `--glass-glow-blue`, `--glass-glow-indigo`, `--glass-glow-hover`
   - Nav glass: `--glass-nav-bg`, `--glass-nav-border`
   - Nebula orb definitions: `--orb-1` through `--orb-4` as radial-gradient values
   - Typography tokens: `--font-weight-display` (800), `--font-weight-heading` (700), `--tracking-display` (-0.04em), `--tracking-heading` (-0.02em), `--tracking-label` (0.06em), `--leading-display` (1.0), `--leading-body` (1.65)
   - Spacing: `--section-gap`, `--content-gap`, `--card-pad`, `--card-pad-sm`

1.2 The global `body` background is overridden to `--ds-base-1` (`#0a0f1e`) in dark mode, eliminating the default near-black HSL background.

1.3 A `@supports not (backdrop-filter: blur(1px))` fallback block is present, setting glass elements to `background: rgba(13, 21, 38, 0.88)` with opaque border.

1.4 No component file hardcodes hex color values — all colors reference `--ds-*` or `--glass-*` tokens.

---

## Requirement 2: NebulaBackground Component

**User Story**: As a user, I want a slow-drifting animated nebula behind all app content, so the interface feels alive and premium without distracting from the content.

### Acceptance Criteria

2.1 A `NebulaBackground` component exists at `src/components/ui/nebula-background.tsx` and renders exactly 4 orbs by default (configurable via `orbs` prop accepting 1–6 `OrbConfig` entries).

2.2 Each orb is a `motion.div` with `position: fixed`, `z-index: 0`, `pointer-events: none`. No orb element can receive pointer events.

2.3 Orb animations use only `x` and `y` (CSS transform) — never `top`, `left`, `width`, or `height`. Each orb has `will-change: transform`.

2.4 The four default orbs have independent animation cycle durations: 18s, 22s, 26s, and 31s. No two orbs share the same duration.

2.5 Each orb animation uses `repeat: Infinity, repeatType: "reverse"` and `ease: "easeInOut"`.

2.6 When `useReducedMotion()` returns `true`, orb animations are disabled (no motion properties applied). Orbs render as static positioned elements.

2.7 `NebulaBackground` is mounted inside `AppLayout` as a fixed full-screen layer behind all content, and also inside `HomePage` behind the landing content.

2.8 The component is wrapped in `React.memo` to prevent unnecessary re-renders.

---

## Requirement 3: GlassCard Component

**User Story**: As a user, I want all major content cards to have a frosted-glass appearance with subtle glow, so the app feels visually cohesive and premium.

### Acceptance Criteria

3.1 A `GlassCard` component exists at `src/components/ui/glass-card.tsx` accepting props: `variant` (`'default' | 'elevated' | 'nav' | 'hero'`), `glow` (`'blue' | 'indigo' | 'none'`), `hover` (boolean, default `true`), `className`, `children`, `onClick`.

3.2 All variants apply `backdrop-filter: blur(Npx)` — default: 20px, elevated: 28px, nav: 24px, hero: 40px.

3.3 All variants apply a white semi-transparent border (`rgba(255,255,255, 0.08)` at rest).

3.4 All variants apply the `--glass-glow-blue` or `--glass-glow-indigo` box-shadow (based on `glow` prop) at rest.

3.5 When `hover={true}` and the user hovers the card:
   - `translateY` animates to -4px
   - `scale` animates to 1.008
   - Box-shadow transitions to `--glass-glow-hover`
   - Border opacity increases to 16%
   - All via framer-motion spring (stiffness: 300, damping: 20)

3.6 The card wrapper has `position: relative` and a defined `border-radius` (default: `--radius-lg`).

3.7 A CSS `@supports not (backdrop-filter: blur(1px))` fallback renders the card as a fully opaque dark navy surface.

3.8 `GlassCard` passes all child content through without introducing any margin or padding (padding is the consumer's responsibility via `className` or inner wrapper).

---

## Requirement 4: Navigation Redesign

**User Story**: As a user, I want the top navigation and side navigation to have a glass/frosted appearance consistent with the overall theme, so navigation never visually competes with content.

### Acceptance Criteria

4.1 `TopNav` applies `background: var(--glass-nav-bg)` and `backdrop-filter: var(--glass-blur-nav)` instead of the previous `bg-background/95` class.

4.2 `TopNav` border bottom uses `var(--glass-nav-border)` color.

4.3 The logo mark (`Orbit` icon) has a premium treatment: a container with a blue-to-indigo gradient background and a subtle animated pulse ring on initial page load (single pulse, not looping).

4.4 `SideNav` applies glass nav surface tokens to its container (`background: var(--glass-nav-bg)`, `backdrop-filter: var(--glass-blur-nav)`).

4.5 Active nav items in `SideNav` display: a thin left border bar (2px, gradient indigo→blue), glass elevated background, and label in `--ds-text-primary` color. The previous `bg-primary text-primary-foreground` treatment is removed.

4.6 Nav item hover state uses framer-motion whileHover with background opacity transition (0 → glass-bg at 40%) over 150ms.

4.7 `BottomNav` (mobile) applies a glass surface: `background: var(--glass-nav-bg)`, `backdrop-filter: var(--glass-blur-nav)`, top border `var(--glass-nav-border)`.

4.8 Active item in `BottomNav` shows `--ds-glow-blue` color for icon and label.

---

## Requirement 5: Home/Landing Page Redesign

**User Story**: As a visitor, I want the home page to feel like a premium SaaS product landing — with animated headline, floating glass feature cards, and a gradient CTA — so I immediately understand KeGo's quality.

### Acceptance Criteria

5.1 `HomePage` renders `NebulaBackground` as its background layer.

5.2 The page nav bar uses glass tokens (same as 4.1, 4.2) instead of `bg-background/95`.

5.3 The hero section contains an `AnimatedHeadline` component that word-by-word fades+slides up on mount (stagger 0.06s, spring stiffness 300 damping 24). The words "Project Context" (or similar key phrase) render with a blue-to-indigo gradient treatment.

5.4 The hero subheading fades in after headline (delay 0.5s, duration 0.6s, ease out).

5.5 The CTA buttons entrance: fade+slide up after subheading (delay 0.7s). Primary CTA has electric blue glow (`box-shadow: 0 0 24px rgba(59,130,246,0.4)`) that intensifies on hover.

5.6 Feature cards use `GlassCard` with `variant="default"` and `glow="indigo"`. Each card has entrance animation with stagger (0.1s apart) triggered when scrolled into view via `whileInView`.

5.7 Feature card icons have a small glowing circle background (blue-indigo gradient at 15% opacity) consistent with the premium palette.

5.8 The "social proof" / benefits section uses `GlassCard` with `variant="elevated"` as its container.

5.9 Footer uses `--ds-base-2` background and `--ds-text-muted` text color.

---

## Requirement 6: Dashboard Redesign

**User Story**: As a user, I want the dashboard to display glass stat cards with animated counters and premium project cards, so I get key project health information in an engaging, readable format.

### Acceptance Criteria

6.1 Dashboard stat cards are replaced with `GlassStatCard` components using `GlassCard variant="elevated"`.

6.2 Each `GlassStatCard` has an `AnimatedCounter` that counts up from 0 to the actual value on mount over 1.2 seconds.

6.3 Stat card icons have a colored glow treatment (e.g., FolderOpen: blue, TrendingUp: green, Zap: orange) using a `filter: drop-shadow()` or background ring.

6.4 Stat cards have staggered entrance animations (0.1s, 0.2s, 0.3s delay respectively) using framer-motion.

6.5 Dashboard "Recovery Recommendations" items use `GlassCard variant="default"` with hover interaction (3.5).

6.6 "Recent Projects" section uses `GlassProjectCard` components.

6.7 Skeleton loading states are replaced with a shimmer animation consistent with the dark palette (shimmer travels across a `--ds-base-2` base).

6.8 Section headings use `--ds-text-primary`, `--font-weight-heading`, and `--tracking-heading`.

---

## Requirement 7: Project Card Redesign

**User Story**: As a user, I want project cards to show health status through an animated ring/pulse visual, have a glass surface, and respond to hover with a lift effect, so I can quickly assess project state at a glance.

### Acceptance Criteria

7.1 `GlassProjectCard` component exists at `src/components/projects/glass-project-card.tsx`, accepting the same props as the existing `ProjectCard` (`project`, `variant`, `onMark`, `onResume`).

7.2 The card uses `GlassCard variant="default" glow="indigo"` as its surface.

7.3 A `HealthRing` sub-component renders an SVG ring (40×40px default) with stroke color matching health:
   - `healthy`: solid green (`#22c55e`)
   - `at-risk`: amber (`#f59e0b`) with an animated pulse outer ring (scale 1→1.4, opacity 1→0, 1.5s loop)
   - `stalled`: red (`#ef4444`)
   - `dormant`: gray (`#6b7280`)

7.4 `HealthRing` stroke uses `stroke-dashoffset` animation on mount (ring "draws in" over 0.8s).

7.5 The resume score displays as a horizontal bar with a gradient fill (blue→indigo) rather than the existing component's default treatment (the existing `ResumeScore` component is still usable for logic but the visual treatment is overridden via className props if supported, otherwise a new slim bar is rendered inline).

7.6 Card hover matches `GlassCard` spec (req 3.5): translateY -4px, scale 1.008, glow intensification.

7.7 "Mark" and "Resume" buttons inside the card use a glass-style outline button: transparent fill, `--glass-border` border, text in `--ds-text-primary`, hover shows glass-bg fill.

7.8 Compact variant renders a minimal glass surface with project name, health dot (8px colored circle), and resume score as text.

---

## Requirement 8: Typography System

**User Story**: As a user, I want the typography to feel editorial and intentional — heavy display weights for headlines, generous tracking for labels, and consistent hierarchy throughout — so the app reads as premium.

### Acceptance Criteria

8.1 Inter variable font is loaded with `font-display: swap` and the `wght` axis covering 100–900. The existing `@font-face` or Google Fonts import is updated if needed.

8.2 Display headings (hero h1) use `font-weight: var(--font-weight-display)` (800) and `letter-spacing: var(--tracking-display)` (-0.04em).

8.3 Section headings (h2, dashboard section titles) use `font-weight: var(--font-weight-heading)` (700) and `letter-spacing: var(--tracking-heading)` (-0.02em).

8.4 Card titles use `font-weight: var(--font-weight-subheading)` (600).

8.5 All-caps badge/label text (if present) uses `letter-spacing: var(--tracking-caps)` (0.12em) and `text-transform: uppercase`.

8.6 Body text uses `line-height: var(--leading-body)` (1.65) for readability against dark glass surfaces.

8.7 The existing `--app-font-sans: 'Inter', sans-serif` token remains the primary font; no additional font families are introduced.

---

## Requirement 9: Micro-Interaction Patterns

**User Story**: As a user, I want every interactive element to respond with a small, satisfying animation — buttons press down, inputs glow on focus, loading states shimmer — so the app feels crafted and responsive.

### Acceptance Criteria

9.1 All primary `Button` instances add `whileTap={{ scale: 0.97 }}` and `whileHover={{ scale: 1.02 }}` via framer-motion (applied by wrapping with `motion.div` or by extending the Button component).

9.2 Primary (filled) buttons have a glow ring on hover: `box-shadow: 0 0 20px rgba(59,130,246,0.35)` with 200ms transition.

9.3 Input fields on focus show `box-shadow: 0 0 0 2px rgba(99,102,241,0.4)` glow ring (replaces the default ring utility).

9.4 Loading/skeleton states use a shimmer animation: a `linear-gradient` sweep from left to right over `--ds-base-3` base, looping at 1.8s. Defined as a CSS animation in `index.css`.

9.5 `GlassCard` instances with `onClick` show `whileTap={{ scale: 0.985 }}`.

9.6 Nav item links use framer-motion `whileHover` with a 150ms background fade-in.

9.7 When `useReducedMotion()` is `true`, all micro-interactions reduce to instant style changes (no spring/tween durations).

---

## Requirement 10: Page Transition System

**User Story**: As a user, I want smooth animated transitions between pages, so navigation feels fluid and intentional rather than jarring hard cuts.

### Acceptance Criteria

10.1 A `PageTransition` component exists at `src/components/ui/page-transition.tsx` wrapping children in a `motion.div` with `pageVariants`:
   - `initial`: `{ opacity: 0, y: 12 }`
   - `animate` (enter): `{ opacity: 1, y: 0 }` with `duration: 0.38, ease: [0.22, 1, 0.36, 1]`
   - `exit`: `{ opacity: 0, y: -8 }` with `duration: 0.22, ease: [0.4, 0, 1, 1]`

10.2 `AnimatePresence` with `mode="wait"` wraps the route `Switch` in `App.tsx`. The `key` prop passed to `AnimatePresence` children is the current route path, ensuring transitions fire on every route change.

10.3 Each page component (`HomePage`, `DashboardPage`, `ProjectsPage`, and all sub-pages) wraps its return in `<PageTransition>`.

10.4 When `useReducedMotion()` is `true`, `PageTransition` renders children without any motion wrapper (plain `div` or direct passthrough).

10.5 Page transitions do not cause layout shift — the `motion.div` wrapper has `width: 100%` and does not affect flex/grid parent layout.

10.6 Transition duration is imperceptible for power users (total in+out < 600ms) but visible enough to feel smooth.
