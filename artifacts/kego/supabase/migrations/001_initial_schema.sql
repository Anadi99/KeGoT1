-- KeGo Full Persistence — Initial Schema Migration
-- Migration: 001_initial_schema.sql
-- Idempotent: uses CREATE TABLE IF NOT EXISTS and CREATE INDEX IF NOT EXISTS

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid,                                    -- nullable for demo mode
  name                  text        NOT NULL,
  description           text,
  health                text        DEFAULT 'active',
  resume_score          integer     DEFAULT 0,
  recovery_confidence   integer     DEFAULT 0,
  context_completeness  integer     DEFAULT 0,
  tags                  text[]      DEFAULT '{}',
  last_activity         timestamptz DEFAULT now(),
  paused_at             timestamptz,
  resumed_at            timestamptz,
  created_at            timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- decisions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS decisions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title         text        NOT NULL,
  description   text,
  rationale     text,
  alternatives  text[]      DEFAULT '{}',
  consequences  text,
  confidence    integer     DEFAULT 50,
  decided_at    timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS decisions_project_id_idx ON decisions(project_id);

-- ---------------------------------------------------------------------------
-- milestones
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS milestones (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title            text        NOT NULL,
  description      text,
  status           text        DEFAULT 'planned',
  percent_complete integer     DEFAULT 0,
  due_date         timestamptz,
  completed_at     timestamptz,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS milestones_project_id_idx ON milestones(project_id);

-- ---------------------------------------------------------------------------
-- vault_entries
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vault_entries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  content     text,
  category    text        DEFAULT 'note',
  tags        text[]      DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS vault_entries_project_id_idx ON vault_entries(project_id);

-- ---------------------------------------------------------------------------
-- timeline_events
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timeline_events (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        text        NOT NULL,
  title       text        NOT NULL,
  description text,
  timestamp   timestamptz DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS timeline_events_project_id_idx ON timeline_events(project_id);

-- ---------------------------------------------------------------------------
-- checkins
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS checkins (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  checkin_date date NOT NULL DEFAULT current_date,
  ai_summary   text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS checkins_project_id_idx ON checkins(project_id);

-- ---------------------------------------------------------------------------
-- recovery_workspaces
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recovery_workspaces (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id               uuid        NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  project_summary          text,
  completed_work           text,
  pending_work             text,
  blockers                 text,
  important_decisions      text,
  important_resources      text,
  suggested_next_action    text,
  estimated_time_to_resume text,
  last_updated             timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recovery_workspaces_project_id_idx ON recovery_workspaces(project_id);

-- ---------------------------------------------------------------------------
-- integrations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integrations (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  provider     text        NOT NULL,
  repo_url     text,
  settings     jsonb       DEFAULT '{}',
  connected_at timestamptz DEFAULT now(),
  last_sync_at timestamptz
);

CREATE INDEX IF NOT EXISTS integrations_project_id_idx ON integrations(project_id);

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_settings (
  user_id       uuid PRIMARY KEY,
  display_name  text,
  email         text,
  appearance    text  DEFAULT 'system',
  notifications jsonb DEFAULT '{}',
  updated_at    timestamptz DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- tasks  (referenced by useHeartbeatData)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  status       text        DEFAULT 'pending',
  completed_at timestamptz,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);

-- ---------------------------------------------------------------------------
-- project_memory  (convenience view)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW project_memory AS
  SELECT id, project_id, 'decision'  AS memory_type, title   AS content, created_at FROM decisions
  UNION ALL
  SELECT id, project_id, 'milestone' AS memory_type, title   AS content, created_at FROM milestones
  UNION ALL
  SELECT id, project_id, category    AS memory_type, content             , created_at FROM vault_entries;
