# Requirements Document

## Introduction

KeGo is a project memory and recovery tool built in React + TypeScript + Vite. Currently all data (projects, decisions, milestones, vault entries, timeline events, recovery workspaces) is served from in-memory mock data (`src/lib/mock-data.ts`). Several UI features (Mark, Sediment, Heartbeat, GitHub connector, Universal Search, Memory Graph, Settings persistence, Recovery Hub) are frontend shells with no real backend interaction.

This spec defines requirements to make the entire KeGo app fully functional end-to-end using Supabase as the persistent backend, replacing all mock data with real database reads/writes, and completing every shell feature to production quality.

## Glossary

- **App**: The KeGo React + TypeScript + Vite application located at `src/`.
- **Supabase_Client**: The async Supabase client created by `src/lib/supabase/client.ts`.
- **Project**: A user-owned entity with name, description, health, resume score, and metadata, stored in the `projects` database table.
- **Memory_Entry**: Any persisted unit of project context: decisions, milestones, vault entries, timeline events, or check-ins, stored in their respective database tables.
- **Recovery_Workspace**: A computed or persisted summary of a project's current state stored in the `recovery_workspaces` table.
- **Mark_Feature**: The user action to "mark" a project at a point in time, capturing a context snapshot.
- **Sediment_Component**: The visual memory sediment overlay (`src/components/sediment/`) that renders floating fragments of past project memories.
- **Heartbeat_Component**: The animated project history visualizer (`src/components/heartbeat/`) that converts database events into ring animations.
- **Recovery_Hub**: The dashboard component (`src/components/recovery/recovery-hub.tsx`) showing momentum scores, inbox, streaks, and snapshots.
- **Knowledge_Vault**: The per-project archive of decisions, resources, links, and notes (`src/components/vault/knowledge-vault.tsx`).
- **Universal_Search**: The cross-project memory search component (`src/components/search/universal-search.tsx`).
- **Memory_Graph**: The visual node graph of memory connections (`src/components/search/memory-graph.tsx`).
- **GitHub_Connector**: The integration component (`src/components/integrations/github-connector.tsx`) that syncs GitHub activity into project memory.
- **Timeline**: Per-project ordered log of events stored in the `timeline_events` table.
- **Project_Hub**: The per-project hub page (`/projects/:id/hub`) aggregating recovery, vault, and timeline data.
- **DB_Schema**: The Supabase PostgreSQL schema that backs all persistence.
- **User**: An authenticated or anonymous Supabase user session.
- **Checkin**: A daily project progress note stored in the `checkins` table.
- **Fallback_Mode**: The behavior when Supabase is unavailable; the App falls back to static mock data rather than crashing.

---

## Requirements

### Requirement 1: Database Schema

**User Story:** As a developer, I want a well-defined Supabase database schema, so that all app features have stable tables and columns to read from and write to.

#### Acceptance Criteria

1. THE DB_Schema SHALL define a `projects` table with columns: `id` (uuid PK), `user_id` (uuid FK → auth.users), `name` (text, not null), `description` (text), `health` (text), `resume_score` (integer), `recovery_confidence` (integer), `context_completeness` (integer), `tags` (text[]), `last_activity` (timestamptz), `paused_at` (timestamptz), `resumed_at` (timestamptz), `created_at` (timestamptz default now()).
2. THE DB_Schema SHALL define a `decisions` table with columns: `id` (uuid PK), `project_id` (uuid FK → projects), `title` (text), `description` (text), `rationale` (text), `alternatives` (text[]), `consequences` (text), `decided_at` (timestamptz), `created_at` (timestamptz default now()).
3. THE DB_Schema SHALL define a `milestones` table with columns: `id` (uuid PK), `project_id` (uuid FK → projects), `title` (text), `description` (text), `status` (text), `percent_complete` (integer), `due_date` (timestamptz), `completed_at` (timestamptz), `created_at` (timestamptz default now()).
4. THE DB_Schema SHALL define a `vault_entries` table with columns: `id` (uuid PK), `project_id` (uuid FK → projects), `title` (text), `content` (text), `category` (text), `tags` (text[]), `created_at` (timestamptz default now()), `updated_at` (timestamptz default now()).
5. THE DB_Schema SHALL define a `timeline_events` table with columns: `id` (uuid PK), `project_id` (uuid FK → projects), `type` (text), `title` (text), `description` (text), `timestamp` (timestamptz), `created_at` (timestamptz default now()).
6. THE DB_Schema SHALL define a `checkins` table with columns: `id` (uuid PK), `project_id` (uuid FK → projects), `checkin_date` (date), `ai_summary` (text), `created_at` (timestamptz default now()).
7. THE DB_Schema SHALL define a `recovery_workspaces` table with columns: `id` (uuid PK), `project_id` (uuid FK → projects, unique), `project_summary` (text), `completed_work` (text), `pending_work` (text), `blockers` (text), `important_decisions` (text), `important_resources` (text), `suggested_next_action` (text), `estimated_time_to_resume` (text), `last_updated` (timestamptz default now()).
8. THE DB_Schema SHALL define a `integrations` table with columns: `id` (uuid PK), `project_id` (uuid FK → projects), `provider` (text), `repo_url` (text), `settings` (jsonb), `connected_at` (timestamptz), `last_sync_at` (timestamptz).
9. THE DB_Schema SHALL define a `user_settings` table with columns: `user_id` (uuid PK FK → auth.users), `display_name` (text), `email` (text), `appearance` (text default 'system'), `notifications` (jsonb), `updated_at` (timestamptz default now()).
10. THE DB_Schema SHALL produce a migration SQL file at `supabase/migrations/001_initial_schema.sql` containing all CREATE TABLE statements with proper foreign keys and indexes.

---

### Requirement 2: Supabase Client Upgrade

**User Story:** As a developer, I want a fully-typed Supabase client available throughout the app, so that every feature can safely query and mutate the database.

#### Acceptance Criteria

1. THE Supabase_Client SHALL export a typed `getClient()` function that returns a `SupabaseClient` instance when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables are set.
2. WHEN the environment variables are absent, THE Supabase_Client SHALL return `null` and the App SHALL operate in Fallback_Mode.
3. THE Supabase_Client SHALL be a singleton — multiple calls to `getClient()` SHALL return the same instance.
4. THE Supabase_Client module SHALL export TypeScript types matching each DB_Schema table row shape (`ProjectRow`, `DecisionRow`, `MilestoneRow`, `VaultEntryRow`, `TimelineEventRow`, `CheckinRow`, `RecoveryWorkspaceRow`, `IntegrationRow`, `UserSettingsRow`).

---

### Requirement 3: Projects Full Persistence

**User Story:** As a user, I want to create, read, update, and delete projects that persist across sessions, so that my project list is always current.

#### Acceptance Criteria

1. WHEN the Projects page loads, THE App SHALL fetch all projects for the current user from the `projects` table ordered by `last_activity` descending.
2. WHEN a user clicks "New Project" and submits a valid project name, THE App SHALL insert a new row into `projects` and display it immediately.
3. WHEN a user edits a project's name, description, tags, or health, THE App SHALL update the corresponding row in `projects`.
4. WHEN a user deletes a project, THE App SHALL soft-delete or hard-delete the row and remove it from the project list.
5. WHEN the Supabase_Client is null, THE App SHALL display projects from mock data (Fallback_Mode).
6. THE Projects page SHALL display a count of real projects from the database, not from mock-data.ts.
7. WHEN the projects fetch fails, THE App SHALL display an error state with a retry option rather than crashing.

---

### Requirement 4: Memory Entries Full Persistence

**User Story:** As a user, I want decisions, milestones, vault entries, timeline events, and check-ins to persist in the database, so that my project context is never lost.

#### Acceptance Criteria

1. WHEN a vault entry is created via the Knowledge_Vault "Add Entry" button, THE App SHALL insert a row into `vault_entries` and display the new entry without a page reload.
2. WHEN a vault entry is deleted, THE App SHALL remove the row from `vault_entries` and remove it from the displayed list.
3. WHEN a decision is logged, THE App SHALL insert a row into `decisions` linked to the correct `project_id`.
4. WHEN a milestone status is updated, THE App SHALL update the `status` and `percent_complete` columns in `milestones`.
5. WHEN a timeline event is added via "Add Event", THE App SHALL insert a row into `timeline_events` and display it in chronological order.
6. WHEN the project vault page loads for a given project, THE App SHALL fetch vault entries filtered by `project_id` from `vault_entries`.
7. WHEN the project timeline page loads, THE App SHALL fetch timeline events filtered by `project_id` from `timeline_events` ordered by `timestamp` descending.
8. IF a database insert or update fails, THEN THE App SHALL display a toast notification with a descriptive error message.

---

### Requirement 5: Recovery Workspace Persistence

**User Story:** As a user, I want my recovery workspace notes to persist, so that I can return to a project and immediately see where I left off.

#### Acceptance Criteria

1. WHEN the project recovery page loads, THE App SHALL fetch the `recovery_workspaces` row for the given `project_id`.
2. WHEN a recovery workspace row exists, THE App SHALL display the persisted `project_summary`, `completed_work`, `pending_work`, `blockers`, `important_decisions`, `important_resources`, and `suggested_next_action` fields.
3. WHEN a recovery workspace row does not exist, THE App SHALL generate a default workspace from available project data and insert it into `recovery_workspaces`.
4. WHEN a user edits any recovery workspace field and saves, THE App SHALL upsert the row in `recovery_workspaces` and update `last_updated`.
5. WHEN the Supabase_Client is null, THE App SHALL fall back to `mockRecoveryWorkspace` from mock-data.ts.

---

### Requirement 6: Mark Feature

**User Story:** As a user, I want to "mark" a project at any moment to capture the current context snapshot, so that I can resume later with full clarity.

#### Acceptance Criteria

1. WHEN a user triggers the Mark action for a project, THE App SHALL create a `timeline_events` row with `type = 'paused'` and the current timestamp.
2. WHEN a user triggers the Mark action, THE App SHALL update `projects.paused_at` to the current timestamp and `projects.health` to `'at-risk'` if health was previously `'healthy'` or `'active'`.
3. WHEN a Mark action is triggered, THE App SHALL display a confirmation message acknowledging the context capture.
4. WHEN a user resumes a marked project, THE App SHALL create a `timeline_events` row with `type = 'resumed'` and update `projects.resumed_at` and `projects.health` to `'recovering'`.
5. THE Mark Feature SHALL be accessible from the project card on the Projects page and from the project recovery page.

---

### Requirement 7: Sediment Feature Full Functionality

**User Story:** As a user, I want the Sediment overlay to display real memory fragments from my actual project history, so that the visualization reflects genuine context.

#### Acceptance Criteria

1. WHEN the Sediment_Component renders for a project, THE App SHALL fetch memory data from the `project_memory` view or from `decisions`, `milestones`, `vault_entries`, and `timeline_events` tables for the given `project_id`.
2. WHEN real data is available, THE Sediment_Component SHALL render fragments derived from actual database rows rather than mock data.
3. WHEN fewer than 3 memory entries exist for a project, THE Sediment_Component SHALL supplement with completed tasks from the `checkins` table.
4. WHEN the Supabase_Client is null, THE Sediment_Component SHALL fall back to `buildMockMemories` using mock-data.ts.
5. THE Sediment_Component SHALL not throw an error or render a broken state if all Supabase queries return empty results.

---

### Requirement 8: Heartbeat Feature Full Functionality

**User Story:** As a user, I want the Heartbeat visualization to animate rings based on real project activity, so that the visual accurately represents the project's history.

#### Acceptance Criteria

1. WHEN the Heartbeat_Component renders for a project, THE `useHeartbeatData` hook SHALL query `checkins`, `decisions`, `milestones`, `project_memory`, `projects`, and `tasks` tables in parallel from Supabase.
2. WHEN data is returned, THE `useHeartbeatData` hook SHALL transform rows into `RingEvent[]` and pass them to `generateHeartbeatSequence`.
3. WHEN a project has gaps between active events exceeding 5 days, THE Heartbeat_Component SHALL render gap rings representing the silence period.
4. WHEN the Supabase_Client is null or data fetch fails, THE Heartbeat_Component SHALL render the demo data sequence from `generateDemoData`.
5. THE `useHeartbeatData` hook SHALL cache fetched events in `sessionStorage` for 5 minutes to avoid redundant fetches.

---

### Requirement 9: Recovery Hub Full Functionality

**User Story:** As a user, I want the Recovery Hub to show real momentum scores, streaks, and daily summaries computed from my actual activity, so that I get an accurate picture of my recovery progress.

#### Acceptance Criteria

1. WHEN the Recovery_Hub loads for a project, THE App SHALL compute the momentum score from the `checkins` table for the last 7 days weighted by recency.
2. WHEN the Recovery_Hub loads, THE App SHALL compute the current streak as the number of consecutive days with at least one checkin row ending at today.
3. WHEN the Recovery_Hub loads, THE App SHALL fetch inbox items from `vault_entries` or `timeline_events` rows where action is required, filtered by `project_id`.
4. WHEN the Recovery_Hub loads, THE App SHALL fetch project snapshots from `recovery_workspaces` ordered by `last_updated` descending.
5. WHEN the Supabase_Client is null, THE Recovery_Hub SHALL render static example data in place of live data, clearly labelled as demo mode.
6. THE Recovery_Hub "Generate Report" button SHALL produce a text summary of the project's recovery data and offer it as a downloadable file.

---

### Requirement 10: Knowledge Vault Full Functionality

**User Story:** As a user, I want the Knowledge Vault "Add Entry" button and delete actions to persist changes to the database, so that my vault grows over time.

#### Acceptance Criteria

1. WHEN a user clicks "Add Entry" in the Knowledge_Vault, THE App SHALL open a form modal with fields for title, content, category, and tags.
2. WHEN the form is submitted with valid data, THE App SHALL insert a row into `vault_entries` and close the modal.
3. WHEN a vault entry card is opened, THE App SHALL allow the user to edit and save changes back to `vault_entries`.
4. WHEN a vault entry is deleted, THE App SHALL remove the row from `vault_entries` and update the displayed list without a full page reload.
5. WHEN the project vault page loads, THE App SHALL display the correct entry count from the database.

---

### Requirement 11: Universal Search Full Functionality

**User Story:** As a user, I want Universal Search to query real data from the database, so that I can find decisions, notes, resources, and milestones from all my projects.

#### Acceptance Criteria

1. WHEN a user types a query in Universal_Search, THE App SHALL execute a full-text or ILIKE search against `vault_entries.title`, `vault_entries.content`, `decisions.title`, `milestones.title`, and `timeline_events.title` in Supabase.
2. WHEN results are returned, THE Universal_Search component SHALL display them grouped by type with the project name, entry date, and a content excerpt.
3. WHEN the search query is empty, THE Universal_Search SHALL display the most recently updated entries across all tables.
4. WHEN a search result is clicked, THE App SHALL navigate to the relevant project's vault, recovery, or timeline page.
5. WHEN the Supabase_Client is null, THE Universal_Search SHALL fall back to searching the static `allResults` array.
6. WHEN a query returns zero results, THE Universal_Search SHALL display a "No results" empty state.

---

### Requirement 12: Memory Graph Full Functionality

**User Story:** As a user, I want the Memory Graph to show real nodes and connections derived from my actual project data, so that I can visually navigate relationships between memories.

#### Acceptance Criteria

1. WHEN the Memory_Graph renders, THE App SHALL fetch nodes from `decisions`, `vault_entries`, and `milestones` tables across all projects.
2. WHEN nodes are loaded, THE Memory_Graph SHALL derive edges (connections) from shared tags or explicit `linkedMilestones` / `linkedDecisions` fields.
3. WHEN a node is clicked, THE Memory_Graph SHALL display the node's title, type, project name, and linked nodes in the detail panel.
4. WHEN the Supabase_Client is null, THE Memory_Graph SHALL render the static `memoryNodes` demo data.
5. WHEN nodes exceed 50, THE Memory_Graph SHALL paginate or filter by project to maintain rendering performance.

---

### Requirement 13: GitHub Connector Full Functionality

**User Story:** As a user, I want the GitHub Connector to actually persist my connection and sync real GitHub activity into my project memory, so that commits and releases are captured automatically.

#### Acceptance Criteria

1. WHEN a user connects a GitHub repository by entering a URL and clicking "Connect", THE App SHALL insert a row into `integrations` with `provider = 'github'` and the repo URL.
2. WHEN the connection is saved, THE App SHALL display the connected state sourced from the `integrations` table rather than from local React state.
3. WHEN a user disconnects, THE App SHALL delete the row from `integrations` and revert the UI to the disconnected state.
4. WHEN the GitHub Connector is connected and "Sync Now" is triggered, THE App SHALL call the GitHub REST API to fetch recent commits and insert them as `timeline_events` rows with `type = 'github:commit'`.
5. WHEN the GitHub repo URL is malformed or the repository is not found, THE App SHALL display a validation error before attempting to connect.
6. WHEN the Supabase_Client is null, THE GitHub_Connector SHALL operate in local-only mode showing a "Database unavailable" notice.

---

### Requirement 14: Settings Persistence

**User Story:** As a user, I want my profile, notification preferences, and appearance setting to persist across sessions, so that I don't have to reconfigure the app every time.

#### Acceptance Criteria

1. WHEN the Settings page loads, THE App SHALL fetch the `user_settings` row for the current user from Supabase.
2. WHEN a user saves their profile (name, email), THE App SHALL upsert the row in `user_settings` and display a success toast.
3. WHEN a user changes notification toggles, THE App SHALL update the `notifications` JSONB column in `user_settings`.
4. WHEN a user selects an appearance theme, THE App SHALL update `user_settings.appearance` in Supabase and apply the theme to the app immediately.
5. WHEN the Supabase_Client is null, THE Settings page SHALL operate in local-state-only mode and display a notice that settings will not persist.

---

### Requirement 15: Dashboard Real Data

**User Story:** As a user, I want the Dashboard to display real stats and recommendations from the database, so that the overview reflects my actual project portfolio.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE App SHALL fetch all projects from the `projects` table and compute total, healthy, and at-risk counts in real time.
2. WHEN the Dashboard loads, THE App SHALL derive Recovery Recommendations from projects with `health` of `'at-risk'`, `'stalled'`, or `'dormant'`, ordered by `last_activity` ascending.
3. WHEN the Dashboard loads, THE App SHALL display the three most recently active projects from the `projects` table.
4. WHEN the Supabase_Client is null, THE Dashboard SHALL render using `mockProjects` and `mockRecommendations` from mock-data.ts.

---

### Requirement 16: Error Handling and Loading States

**User Story:** As a user, I want clear loading indicators and error messages throughout the app, so that I always know what is happening and can take action when something fails.

#### Acceptance Criteria

1. WHEN any Supabase query is in flight, THE App SHALL display a skeleton or spinner in the relevant component.
2. WHEN a Supabase query returns an error, THE App SHALL display a toast with the error message and log it to the console.
3. WHEN a required project is not found in the database (404 equivalent), THE App SHALL render the "Project not found" card and provide a link back to `/projects`.
4. IF the Supabase environment variables are missing, THEN THE App SHALL display a "Demo Mode" banner indicating data is not persisted.
5. THE App SHALL never show a blank white screen or an unhandled React error boundary crash due to a failed Supabase query.

---

### Requirement 17: Data Seeding

**User Story:** As a developer, I want a database seed script, so that new environments start with representative data matching the current mock data.

#### Acceptance Criteria

1. THE App SHALL provide a seed file at `supabase/seed.sql` containing INSERT statements for all mock projects, decisions, milestones, vault entries, and timeline events from `src/lib/mock-data.ts`.
2. THE seed file SHALL be idempotent — running it multiple times SHALL NOT create duplicate rows (use `INSERT ... ON CONFLICT DO NOTHING`).
3. THE seed data SHALL reference valid foreign keys consistent with the `001_initial_schema.sql` migration.
