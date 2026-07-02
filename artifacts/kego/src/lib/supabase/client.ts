/**
 * Supabase client — typed singleton with sync and async access.
 *
 * Exports:
 *   getClient()      — synchronous, returns the already-initialised singleton
 *                      or null (safe to call anywhere, no await needed)
 *   createClient()   — async, kept for backward compatibility with
 *                      useHeartbeatData and useSedimentData
 *
 * The singleton is initialised eagerly on module load when env vars are
 * present. Both exports share the same underlying _client reference, so
 * multiple calls always return the same object (Property 1: singleton identity).
 */

import type { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js'
import type { Database } from './database.types'

// ─── Re-exports for consumer convenience ─────────────────────────────────────

export type { Database } from './database.types'
export type {
  ProjectRow,
  DecisionRow,
  MilestoneRow,
  VaultEntryRow,
  TimelineEventRow,
  CheckinRow,
  RecoveryWorkspaceRow,
  IntegrationRow,
  UserSettingsRow,
  TaskRow,
  ProjectMemoryRow,
} from './database.types'

// ─── Environment vars ─────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// ─── Singleton state ──────────────────────────────────────────────────────────

let _client: SupabaseClientType<Database> | null = null
let _initPromise: Promise<SupabaseClientType<Database> | null> | null = null

// ─── Synchronous getter ───────────────────────────────────────────────────────

/**
 * Returns the already-initialised Supabase singleton, or null if env vars
 * are absent or the async init hasn't resolved yet.
 *
 * Safe to call synchronously from service modules — no await required.
 */
export function getClient(): SupabaseClientType<Database> | null {
  return _client
}

// ─── Async initialiser (backward-compatible) ─────────────────────────────────

/**
 * Async factory kept for backward compatibility with useHeartbeatData and
 * useSedimentData, which do `await createClient()`.
 *
 * Subsequent calls resolve to the same singleton (_client), satisfying the
 * singleton identity property even when called concurrently.
 */
export async function createClient(): Promise<SupabaseClientType<Database> | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  if (_client) return _client
  if (_initPromise) return _initPromise

  _initPromise = (async () => {
    try {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
      _client = createSupabaseClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!)
      return _client
    } catch {
      // @supabase/supabase-js not installed — graceful fallback
      return null
    }
  })()

  return _initPromise
}

// ─── Eager init on module load ────────────────────────────────────────────────
// Kicks off async init immediately so that getClient() returns the singleton
// as soon as possible for service modules that call it synchronously.
createClient().catch(() => {})

export default createClient()
