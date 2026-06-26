import { TopNav } from './top-nav'
import { SideNav } from './side-nav'
import { BottomNav } from './bottom-nav'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <SideNav />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
