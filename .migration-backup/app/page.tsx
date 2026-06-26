import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Orbit, ArrowRight, Zap, Target, BookOpen } from 'lucide-react'

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="max-w-3xl text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Orbit className="size-8" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-balance">
            Resume your projects instantly
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            KeGo is a project memory platform that helps you recover abandoned work with intelligent context restoration.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8">
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="size-5 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold">Recovery Workspace</h3>
            <p className="text-sm text-muted-foreground">See exactly where you left off</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="size-5 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold">Smart Scoring</h3>
            <p className="text-sm text-muted-foreground">Know your readiness to resume</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="size-5 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold">Memory Vault</h3>
            <p className="text-sm text-muted-foreground">Preserve project knowledge</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Go to Dashboard
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline">
              Browse Projects
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
