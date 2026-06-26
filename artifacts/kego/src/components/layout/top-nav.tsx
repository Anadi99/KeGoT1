import { Link } from 'wouter'
import { Orbit } from 'lucide-react'

export function TopNav() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Orbit className="size-5" />
          </div>
          <span className="hidden sm:inline">KeGo</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}
