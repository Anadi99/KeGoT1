import { Link, useLocation } from 'wouter'
import { LayoutGrid, FolderOpen, Settings, Palette, Search, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/integrations', label: 'Integrations', icon: Puzzle },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/brand', label: 'Brand', icon: Palette },
]

export function SideNav() {
  const [location] = useLocation()

  return (
    <nav className="hidden w-64 flex-col border-r border-border bg-card/50 p-4 md:flex h-full">
      {/* Logo in sidebar */}
      <Link href="/" className="flex items-center gap-2.5 px-2 pb-6 pt-1 mb-2 border-b border-border">
        <img
          src="/AiLogoN.png"
          alt="Kego"
          className="h-7 w-7 object-contain rounded-lg"
        />
        <img
          src="/logo-primary.png"
          alt="Kego"
          className="h-5 w-auto object-contain"
        />
      </Link>

      <div className="flex flex-col gap-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
