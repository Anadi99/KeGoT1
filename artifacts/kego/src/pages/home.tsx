import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo-primary.png" alt="Kego" className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="gap-2 font-semibold"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#F97316)', border: 'none' }}
              >
                Get Started <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-4 sm:px-6 text-center max-w-4xl mx-auto">
        {/* Logo hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-10"
        >
          <img
            src="/Shinylogo.jpg"
            alt="Kego"
            className="h-40 w-auto object-contain rounded-2xl"
            style={{ filter: 'drop-shadow(0 0 40px rgba(124,58,237,0.4))' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <Badge variant="secondary" className="mb-6 tracking-widest text-xs uppercase">
            AI Productivity Platform
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Never Lose Your{' '}
            <span
              className="font-black"
              style={{ background: 'linear-gradient(90deg,#7C3AED,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Project Context
            </span>{' '}
            Again
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Kego preserves your project's complete context — decisions, progress, and next steps — so you can resume any project in minutes, not hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="gap-2 w-full sm:w-auto font-semibold"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F97316)', border: 'none' }}
            >
              Start Free <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Projects
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to resume faster</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, title: 'Decision Intelligence', description: 'Capture why you made key decisions so future-you understands the context.' },
            { icon: Zap, title: 'Resume Score', description: 'Know exactly how ready you are to resume any project with a context score.' },
            { icon: Shield, title: 'Knowledge Vault', description: 'Archive decisions, resources, and notes in one searchable place.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border p-6 space-y-3 hover:border-purple-500/30 transition-colors"
            >
              <div
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(249,115,22,0.1))' }}
              >
                <feature.icon className="size-5 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Stop losing context when you pause</h2>
          <div className="space-y-3 text-left max-w-md mx-auto">
            {[
              'Resume any project in 20 minutes instead of days',
              'Never wonder "where was I?" again',
              'Make better decisions with full context',
              'Share project state with your team instantly',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="mt-8 gap-2 font-semibold"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#F97316)', border: 'none' }}
            >
              Try Kego Free <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4 text-center">
        <img src="/logo-primary.png" alt="Kego" className="h-7 w-auto mx-auto mb-3 opacity-60 object-contain" />
        <p className="text-sm text-muted-foreground">© 2026 Kego. Simplify • Organize • Grow.</p>
      </footer>
    </div>
  )
}
