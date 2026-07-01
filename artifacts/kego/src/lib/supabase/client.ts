/**
 * Supabase client configuration.
 * 
 * Replace the placeholder URL and anon key with your actual
 * Supabase project credentials. The client will be created
 * lazily only when environment variables are present.
 * 
 * The client type uses a recursive interface pattern to support
 * Supabase's fluent query builder chain (select → eq → eq → order → limit).
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

interface SupabaseQueryResult {
  data: Record<string, unknown>[] | null
  error: { message: string } | null
}

interface SupabaseFilterChain {
  eq: (column: string, value: string) => SupabaseFilterChain
  order: (column: string, opts: { ascending: boolean }) => SupabaseFilterChain
  limit: (n: number) => Promise<SupabaseQueryResult>
}

interface SupabaseClient {
  from: (table: string) => {
    select: (columns: string) => SupabaseFilterChain
  }
}

let _client: SupabaseClient | null = null
let _clientPromise: Promise<SupabaseClient | null> | null = null

export async function createClient(): Promise<SupabaseClient | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null
  }

  if (_client) return _client
  if (_clientPromise) return _clientPromise

  _clientPromise = (async () => {
    try {
      // @ts-expect-error — optional dependency; may not be installed
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
      _client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      return _client
    } catch {
      // @supabase/supabase-js not installed — return null
      return null
    }
  })()

  return _clientPromise
}

export default createClient()
