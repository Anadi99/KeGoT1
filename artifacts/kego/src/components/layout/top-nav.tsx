import { Link } from 'wouter'

export function TopNav() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo-primary.png"
            alt="Kego"
            className="h-8 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}
