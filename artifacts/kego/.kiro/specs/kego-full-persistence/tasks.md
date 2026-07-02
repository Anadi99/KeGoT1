# Implementation Plan: KeGo Full Persistence

## Overview

Replace all mock-data usage with real Supabase reads/writes across every feature in the app. The implementation follows the service module pattern defined in the design: each feature area gets a `src/lib/services/` module that encapsulates all Supabase calls. Pages import from services only; they never call `supabase.from()` directly. Every service falls back to mock data when `getClient()` returns null.

## Tasks

- [x] 1. Database schema and seed file
  - Create `supabase/migrations/001_initial_schema.sql` with all CREATE TABLE statements for: `projects`, `decisions`, `milestones`, `vault_entries`, `timeline_events`, `checkins`, `recovery_workspaces`, `integrations`, `user_settings`, `tasks`, and the `project_memory` view
  - Add proper uuid PKs using `gen_random_uuid()`, FK constraints to `auth.users` and `projects`, and indexes on `project_id` columns
  - Create `supabase/seed.sql` with idempotent INSERT statements (ON CONFLICT DO NOTHING) for all rows in `src/lib/mock-data.ts` — projects, decisions, milestones, vault entries, and timeline events
  - _Requirements: 1.1–1.10, 17.1–17.3_

- [x] 2. Supabase client upgrade and typed row types
  - [x] 2.1 Upgrade `src/lib/supabase/client.ts` to export a synchronous `getClient()` that returns the already-initialised singleton (initialised on first import using env vars), keeping the existing `createClient` async export for backward compatibility with `useHeartbeatData` and `useSedimentData`
    - `getClient()` returns `SupabaseClient<Database> | null`
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 2.2 Create `src/lib/supabase/database.types.ts` defining the `Database` interface with `public.Tables` entries for all 9 tables, plus convenience row-type re-exports (`ProjectRow`, `DecisionRow`, `MilestoneRow`, `VaultEntryRow`, `TimelineEventRow`, `CheckinRow`, `RecoveryWorkspaceRow`, `IntegrationRow`, `UserSettingsRow`)
    - _Requirements: 2.4_
  - [ ]* 2.3 Write unit test: `getClient()` called multiple times returns the same object reference (or all null), verifying singleton identity (Property 1)
    - **Property 1: Client Singleton Identity**
    - **Validates: Requirements 2.3**

- [x] 3. Service modules — foundation
  - [x] 3.1 Create `src/lib/services/projects.ts` implementing `fetchProjects`, `createProject`, `updateProject`, `deleteProject`, `markProject`, `resumeProject`, `rowToProject` mapper, `sortByLastActivity`, and `computeDashboardStats`/`deriveRecommendations` pure helpers
    - Each function checks `getClient()` first; returns mock data on null
    - _Requirements: 3.1–3.7, 6.1–6.5, 15.1–15.3_
  - [x] 3.2 Create `src/lib/services/memory.ts` implementing `fetchVaultEntries`, `createVaultEntry`, `updateVaultEntry`, `deleteVaultEntry`, `fetchDecisions`, `createDecision`, `fetchMilestones`, `updateMilestone`, `fetchTimelineEvents`, `createTimelineEvent`, plus `rowToVaultEntry`, `rowToDecision`, `rowToMilestone`, `rowToTimelineEvent` mappers and `buildSedimentMemories`
    - _Requirements: 4.1–4.8, 7.1–7.5_
  - [x] 3.3 Create `src/lib/services/recovery.ts` implementing `fetchRecoveryWorkspace` and `upsertRecoveryWorkspace`
    - On workspace missing, generate a default from project data and insert it
    - _Requirements: 5.1–5.5_
  - [x] 3.4 Create `src/lib/services/hub.ts` implementing `fetchHubData`, `computeMomentumScore`, and `computeStreak`
    - `computeMomentumScore`: recency-weighted sum of checkins over last 7 days, result in [0, 100]
    - `computeStreak`: count consecutive calendar days with ≥1 checkin ending at today
    - _Requirements: 9.1–9.6_
  - [x] 3.5 Create `src/lib/services/search.ts` implementing `universalSearch`, `filterResults`, `groupByType`, `sortByDate`, `fetchGraphNodes`, `buildGraphNodes`, and `deriveEdges`
    - `universalSearch("")` returns entries sorted by date descending
    - _Requirements: 11.1–11.6, 12.1–12.5_
  - [x] 3.6 Create `src/lib/services/integrations.ts` implementing `fetchIntegration`, `connectIntegration`, `disconnectIntegration`, and `syncGitHub`
    - `syncGitHub` calls GitHub REST API and inserts `timeline_events` rows with `type = 'github:commit'`
    - _Requirements: 13.1–13.6_
  - [x] 3.7 Create `src/lib/services/settings.ts` implementing `fetchSettings` and `upsertSettings`
    - _Requirements: 14.1–14.5_

- [x] 4. Checkpoint — service layer complete
  - Ensure all services compile without TypeScript errors (`npx tsc --noEmit`), ask the user if questions arise.

- [x] 5. Demo mode hook and banner
  - [x] 5.1 Create `src/hooks/useDemoMode.ts` — returns `true` when `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing
    - _Requirements: 16.4_
  - [x] 5.2 Create `src/components/layout/DemoModeBanner.tsx` — dismissible sticky banner rendered at the top of `AppLayout` when `useDemoMode()` is true, informing the user data will not persist
    - Wire the banner into `src/components/layout/app-layout.tsx`
    - _Requirements: 16.4_

- [x] 6. ErrorBoundary in main.tsx
  - Add a class-based `ErrorBoundary` component in `src/components/ErrorBoundary.tsx` that catches unhandled render errors and shows a "Something went wrong" screen with a page reload button
  - Wrap `<App />` in `src/main.tsx` with `<ErrorBoundary>`
  - _Requirements: 16.5_

- [ ] 7. Projects page wired to real data
  - [x] 7.1 Rewrite `src/pages/projects.tsx` to use `useQuery(['projects'], fetchProjects)` from `src/lib/services/projects.ts`; replace all `mockProjects` references with query data; display skeleton while loading and error card with retry on failure; wire the "New Project" button to a `useMutation` calling `createProject`; update displayed project count from live data
    - _Requirements: 3.1, 3.2, 3.5, 3.6, 3.7_
  - [x] 7.2 Wire `markProject` / `resumeProject` mutations to the project card (add Mark/Resume buttons) — on success invalidate `['projects']` query and show toast; on failure show error toast
    - _Requirements: 6.1–6.5_
  - [ ]* 7.3 Write property test for `sortByLastActivity` — for any array of projects with arbitrary timestamps, result must be ordered descending (Property 2)
    - **Property 2: Projects Sorted by Last Activity Descending**
    - **Validates: Requirements 3.1**
  - [ ]* 7.4 Write property test for `markProject` / `resumeProject` state machine round-trip using the pure state-transition helpers (Property 3)
    - **Property 3: Mark/Resume State Machine Round-Trip**
    - **Validates: Requirements 6.2, 6.4**

- [x] 8. Memory entries persistence
  - [x] 8.1 Rewrite `src/pages/projects/project-vault.tsx` to use `useQuery(['vault', id], () => fetchVaultEntries(id))` instead of `mockVaultEntries`; add Add Entry modal form with fields for title, content, category, and tags wired to `createVaultEntry` mutation; add delete button per card wired to `deleteVaultEntry`; display real entry count
    - _Requirements: 4.1, 4.2, 4.6, 10.1–10.5_
  - [x] 8.2 Rewrite `src/pages/projects/project-timeline.tsx` to use `useQuery(['timeline', id], () => fetchTimelineEvents(id))` instead of `mockTimelineEvents`; wire "Add Event" button to `createTimelineEvent` mutation
    - _Requirements: 4.5, 4.7_
  - [x] 8.3 Wire decisions and milestones in the recovery workspace: replace `mockDecisions` / `mockMilestones` with `useQuery` calls to `fetchDecisions` and `fetchMilestones`; wire milestone status update to `updateMilestone`
    - _Requirements: 4.3, 4.4_
  - [ ]* 8.4 Write property test for `buildSedimentMemories` — for any non-empty input set, every item appears in output unless total exceeds 12, in which case only the 12 most recent appear (Property 4)
    - **Property 4: Sediment Memories Cover Input Data**
    - **Validates: Requirements 7.1, 7.2**

- [x] 9. Recovery workspace persistence
  - Rewrite `src/pages/projects/project-recovery.tsx` to call `useQuery(['recovery', id], () => fetchRecoveryWorkspace(id))` instead of `mockRecoveryWorkspace`; wire save actions to `upsertRecoveryWorkspace` mutation; show skeleton while loading
  - _Requirements: 5.1–5.5_

- [x] 10. Heartbeat feature wired to real data
  - [x] 10.1 Verify `useHeartbeatData` (already queries Supabase) still works after the client upgrade — ensure it uses `createClient()` and falls back to demo data when client is null; no changes needed if it already compiles
    - _Requirements: 8.1–8.5_
  - [ ]* 10.2 Write property test for heartbeat row-to-RingEvent mapping — for any checkin row the output has `type = 'checkin'` and matching date; for any decision row `type = 'decision'` and matching date; ordering is preserved (Property 5)
    - **Property 5: Heartbeat Row-to-RingEvent Type Mapping**
    - **Validates: Requirements 8.1, 8.2**

- [x] 11. Recovery Hub wired to real data
  - Rewrite `src/components/recovery/recovery-hub.tsx` to call `useQuery(['hub', projectId], () => fetchHubData(projectId))`; replace all hardcoded `momentumData`, `dailySummaries`, and inbox/snapshot arrays with data from the service; add "Generate Report" button that formats hub data as text and triggers a browser download; show skeleton while loading; show demo-mode label when client is null
  - _Requirements: 9.1–9.6_
  - [ ]* 11.1 Write property test for `computeMomentumScore` — for any checkin array spanning last 7 days, result is in [0, 100] and more-recent set scores ≥ less-recent set (Property 6)
    - **Property 6: Momentum Score Is Bounded and Recency-Weighted**
    - **Validates: Requirements 9.1**
  - [ ]* 11.2 Write property test for `computeStreak` — for any checkin array with N consecutive days ending today, result equals N (Property 7)
    - **Property 7: Streak Equals Maximum Consecutive Checkin Days**
    - **Validates: Requirements 9.2**

- [x] 12. Checkpoint — core persistence complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Universal Search wired to real data
  - Rewrite `src/components/search/universal-search.tsx` to call `useQuery(['search', query], () => universalSearch(query))` with 300ms debounce; fall back to static `allResults` when client is null; wire search result clicks to navigate to the relevant project page; show empty state when zero results
  - _Requirements: 11.1–11.6_
  - [ ]* 13.1 Write property test for `universalSearch` filter — every result contains the query string (case-insensitive) in title or content (Property 8)
    - **Property 8: Universal Search Returns Only Matching Results**
    - **Validates: Requirements 11.1**
  - [ ]* 13.2 Write property test for `groupByType` — each group contains only results of that type, one group per distinct type (Property 9)
    - **Property 9: Search Results Are Grouped by Type**
    - **Validates: Requirements 11.2**
  - [ ]* 13.3 Write property test for empty-query sort — results returned sorted by date descending (Property 10)
    - **Property 10: Empty Search Returns Entries Sorted by Date Descending**
    - **Validates: Requirements 11.3**

- [x] 14. Memory Graph wired to real data
  - Rewrite `src/components/search/memory-graph.tsx` to call `useQuery(['graph'], fetchGraphNodes)`; replace the hardcoded `memoryNodes` array with live nodes and derived edges; show node title, type, project name, and connections in the detail panel when a node is clicked; fall back to static demo nodes when client is null; filter by project when node count exceeds 50
  - _Requirements: 12.1–12.5_
  - [ ]* 14.1 Write property test for `buildGraphNodes` — one node per source row, node id matches row id (Property 11)
    - **Property 11: Graph Nodes Have 1:1 Mapping to Source Rows**
    - **Validates: Requirements 12.1**
  - [ ]* 14.2 Write property test for `deriveEdges` — edge exists iff two nodes share at least one tag (Property 12)
    - **Property 12: Graph Edges Exist Exactly Where Tags Are Shared**
    - **Validates: Requirements 12.2**

- [x] 15. GitHub Connector wired to real data
  - Rewrite `src/components/integrations/github-connector.tsx` to fetch initial state from `useQuery(['integration', projectId, 'github'], () => fetchIntegration(projectId, 'github'))` on mount; wire "Connect" to `connectIntegration` mutation; wire "Disconnect" to `disconnectIntegration` mutation (deletes DB row); add URL validation before connecting; add "Sync Now" button wired to `syncGitHub` that fetches recent commits from GitHub REST API and inserts `timeline_events`; show "Database unavailable" notice when client is null
  - _Requirements: 13.1–13.6_

- [x] 16. Settings page persistence
  - Rewrite `src/pages/settings.tsx` to load initial values from `useQuery(['settings', userId], () => fetchSettings(userId))`; wire "Save Profile" to `upsertSettings` mutation with success/error toasts; wire notification toggles to debounced `upsertSettings`; wire appearance selection to `upsertSettings` and apply theme via `next-themes`; show non-persist notice when client is null
  - _Requirements: 14.1–14.5_

- [x] 17. Dashboard wired to real data
  - Rewrite `src/pages/dashboard.tsx` to use `useQuery(['projects'], fetchProjects)` and derive stats and recommendations via `computeDashboardStats` and `deriveRecommendations` from `src/lib/services/projects.ts`; replace `mockProjects` and `mockRecommendations` imports; show skeletons while loading
  - _Requirements: 15.1–15.4_
  - [ ]* 17.1 Write property test for `computeDashboardStats` — total equals array length; healthy count matches; atRisk count matches; recommendations contain only at-risk/stalled/dormant projects ordered by last_activity ascending (Property 13)
    - **Property 13: Dashboard Stats Accurately Reflect Project Health Distribution**
    - **Validates: Requirements 15.1, 15.2, 15.3**

- [x] 18. Sediment feature wired to real data
  - Verify `useSedimentData` (already queries Supabase) still compiles and works after the client upgrade; update the import from `createClient` to also support `getClient` if needed; ensure mock fallback via `buildMockMemories` still works
  - _Requirements: 7.1–7.5_

- [x] 19. Final checkpoint — end-to-end wiring complete
  - Ensure all tests pass (`npx vitest --run`), run TypeScript check (`npx tsc --noEmit`), ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use `fast-check` (add `"fast-check": "^3.22.0"` and `"vitest": "^2.0.0"` to devDependencies)
- Each property test file must include the comment `// Feature: kego-full-persistence, Property N: <title>`
- All service functions follow the null-check pattern: `const client = getClient(); if (!client) return mockData`
- Mutations use `queryClient.invalidateQueries` on success; `toast.error` on failure
- Integration tests (optional) live in `src/__tests__/integration/` and require `supabase start`
