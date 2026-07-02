import { useState } from 'react'
import { X, Database } from 'lucide-react'
import { useDemoMode } from '@/hooks/useDemoMode'

export function DemoModeBanner() {
  const isDemo = useDemoMode()
  const [dismissed, setDismissed] = useState(false)

  if (!isDemo || dismissed) return null

  return (
    <div className="relative z-50 flex items-center justify-between gap-3 bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
      <div className="flex items-center gap-2">
        <Database className="size-4 shrink-0" />
        <span>
          <strong>Demo Mode</strong> — data is not persisted. Add{' '}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">VITE_SUPABASE_URL</code>{' '}
          and{' '}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">VITE_SUPABASE_ANON_KEY</code>{' '}
          to enable full persistence.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss demo mode banner"
        className="shrink-0 rounded p-1 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
