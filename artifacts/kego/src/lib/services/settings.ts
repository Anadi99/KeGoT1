import { getClient } from '../supabase/client'
import type { UserSettingsRow } from '../supabase/database.types'

// ── Service ───────────────────────────────────────────────────────────────────

export async function fetchSettings(userId: string): Promise<UserSettingsRow | null> {
  const client = getClient()
  if (!client) return null

  const { data, error } = await client
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if ((error as { code?: string }).code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data as UserSettingsRow
}

export async function upsertSettings(
  patch: Partial<UserSettingsRow> & { user_id: string },
): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client
    .from('user_settings')
    .upsert(
      {
        ...patch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )

  if (error) throw new Error(error.message)
}
