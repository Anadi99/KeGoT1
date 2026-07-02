/**
 * Returns true when Supabase env vars are missing — the app is running in
 * demo/fallback mode and data will not persist across sessions.
 */
export function useDemoMode(): boolean {
  return (
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}
