import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Orbit, Brain, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Orbit className="size-5" />
            </div>
            <span>KeGo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-6">Project Memory Platform</Badge>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          Never Lose Your{' '}
          <span className="text-primary">Project Context</span>{' '}
          Again
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          KeGo preserves your project's complete context — decisions, progress, and next steps — so you can resume any project in minutes, not hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Start Free <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Projects
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to resume faster</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, title: 'Decision Intelligence', description: 'Capture why you made key decisions so future-you understands the context.' },
            { icon: Zap, title: 'Resume Score', description: 'Know exactly how ready you are to resume any project with a context score.' },
            { icon: Shield, title: 'Knowledge Vault', description: 'Archive decisions, resources, and notes in one searchable place.' },
          ].map((feature) => (
            <Card key={feature.title} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 space-y-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Stop losing context when you pause</h2>
          <div className="space-y-3 text-left max-w-md mx-auto">
            {['Resume any project in 20 minutes instead of days', 'Never wonder "where was I?" again', 'Make better decisions with full context', 'Share project state with your team instantly'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard">
            <Button size="lg" className="mt-8 gap-2">
              Try KeGo Free <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 KeGo. Project Memory Platform.</p>
      </footer>
    </div>
  )
}
