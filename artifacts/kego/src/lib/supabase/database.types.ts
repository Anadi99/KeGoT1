/**
 * Supabase Database TypeScript types — generated shape for all 10 tables.
 *
 * Tables: projects, decisions, milestones, vault_entries, timeline_events,
 *         checkins, recovery_workspaces, integrations, user_settings, tasks
 * Views:  project_memory
 */

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          health: string
          resume_score: number
          recovery_confidence: number
          context_completeness: number
          tags: string[]
          last_activity: string
          paused_at: string | null
          resumed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          health?: string
          resume_score?: number
          recovery_confidence?: number
          context_completeness?: number
          tags?: string[]
          last_activity?: string
          paused_at?: string | null
          resumed_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }

      decisions: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          rationale: string | null
          alternatives: string[]
          consequences: string | null
          confidence: number
          decided_at: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          rationale?: string | null
          alternatives?: string[]
          consequences?: string | null
          confidence?: number
          decided_at?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['decisions']['Insert']>
      }

      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: string
          percent_complete: number
          due_date: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: string
          percent_complete?: number
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['milestones']['Insert']>
      }

      vault_entries: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string | null
          category: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content?: string | null
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['vault_entries']['Insert']>
      }

      timeline_events: {
        Row: {
          id: string
          project_id: string
          type: string
          title: string
          description: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          title: string
          description?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['timeline_events']['Insert']>
      }

      checkins: {
        Row: {
          id: string
          project_id: string
          checkin_date: string
          ai_summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          checkin_date?: string
          ai_summary?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['checkins']['Insert']>
      }

      recovery_workspaces: {
        Row: {
          id: string
          project_id: string
          project_summary: string | null
          completed_work: string | null
          pending_work: string | null
          blockers: string | null
          important_decisions: string | null
          important_resources: string | null
          suggested_next_action: string | null
          estimated_time_to_resume: string | null
          last_updated: string
        }
        Insert: {
          id?: string
          project_id: string
          project_summary?: string | null
          completed_work?: string | null
          pending_work?: string | null
          blockers?: string | null
          important_decisions?: string | null
          important_resources?: string | null
          suggested_next_action?: string | null
          estimated_time_to_resume?: string | null
          last_updated?: string
        }
        Update: Partial<Database['public']['Tables']['recovery_workspaces']['Insert']>
      }

      integrations: {
        Row: {
          id: string
          project_id: string
          provider: string
          repo_url: string | null
          settings: Record<string, unknown>
          connected_at: string
          last_sync_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          provider: string
          repo_url?: string | null
          settings?: Record<string, unknown>
          connected_at?: string
          last_sync_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['integrations']['Insert']>
      }

      user_settings: {
        Row: {
          user_id: string
          display_name: string | null
          email: string | null
          appearance: string
          notifications: Record<string, unknown>
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          email?: string | null
          appearance?: string
          notifications?: Record<string, unknown>
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_settings']['Insert']>
      }

      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          status: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          status?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
    }

    Views: {
      project_memory: {
        Row: {
          id: string
          project_id: string
          memory_type: string
          content: string
          created_at: string
        }
      }
    }
  }
}

// ─── Convenience Row Type Aliases ────────────────────────────────────────────

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type DecisionRow = Database['public']['Tables']['decisions']['Row']
export type MilestoneRow = Database['public']['Tables']['milestones']['Row']
export type VaultEntryRow = Database['public']['Tables']['vault_entries']['Row']
export type TimelineEventRow = Database['public']['Tables']['timeline_events']['Row']
export type CheckinRow = Database['public']['Tables']['checkins']['Row']
export type RecoveryWorkspaceRow = Database['public']['Tables']['recovery_workspaces']['Row']
export type IntegrationRow = Database['public']['Tables']['integrations']['Row']
export type UserSettingsRow = Database['public']['Tables']['user_settings']['Row']
export type TaskRow = Database['public']['Tables']['tasks']['Row']
export type ProjectMemoryRow = Database['public']['Views']['project_memory']['Row']
