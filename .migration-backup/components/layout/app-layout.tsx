import { TopNav } from './top-nav'
import { SideNav } from './side-nav'
import { BottomNav } from './bottom-nav'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background safe-area-inset-top">
      {/* Top navigation with safe area support */}
      <div className="safe-area-inset-left safe-area-inset-right">
        <TopNav />
      </div>

      {/* Main content layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block safe-area-inset-left">
          <SideNav />
        </div>

        {/* Main content with safe area padding and thumb zone */}
        <main className="flex-1 overflow-y-auto thumb-zone safe-area-inset-right">
          <div className="pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation with safe area support */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 safe-area-inset-left safe-area-inset-right safe-area-inset-bottom">
        <BottomNav />
      </div>
    </div>
  )
}
