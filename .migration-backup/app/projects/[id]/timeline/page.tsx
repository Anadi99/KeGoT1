import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockTimelineEvents, mockProjects } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Database, Lightbulb, Play, Pause, Zap } from 'lucide-react'
import { formatDate as formatDateUtil } from '@/lib/utils'

interface TimelinePageProps {
  params: Promise<{ id: string }>
}

const eventIcons = {
  created: Database,
  milestone: CheckCircle2,
  decision: Lightbulb,
  paused: Pause,
  resumed: Play,
  'memory-reconstructed': Zap,
}

const eventColors = {
  created: 'bg-blue-500',
  milestone: 'bg-green-500',
  decision: 'bg-yellow-500',
  paused: 'bg-orange-500',
  resumed: 'bg-green-500',
  'memory-reconstructed': 'bg-purple-500',
}

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { id } = await params
  const project = mockProjects.find((p) => p.id === id)
  const events = mockTimelineEvents.filter((e) => e.projectId === id)

  if (!project) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Project not found</h1>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center gap-4">
          <Link href={`/projects/${id}/recovery`} className="inline-flex">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Project Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
          <Link href={`/projects/${id}/recovery`}>
            <Button variant="ghost" className="rounded-b-none">
              Recovery Workspace
            </Button>
          </Link>
          <Link href={`/projects/${id}/vault`}>
            <Button variant="ghost" className="rounded-b-none">
              Knowledge Vault
            </Button>
          </Link>
          <Link href={`/projects/${id}/timeline`}>
            <Button
              variant="ghost"
              className="rounded-b-none border-b-2 border-primary text-primary"
            >
              Timeline
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Memory Reconstruction Timeline</h1>
          <p className="text-muted-foreground mt-2">
            Project history showing how your memory evolved
          </p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-8 pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-1 bg-border" />

          {events.length === 0 ? (
            <p className="text-muted-foreground">No timeline events yet</p>
          ) : (
            events.map((event) => {
              const Icon = eventIcons[event.type]
              const color = eventColors[event.type]

              return (
                <div key={event.id} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-1 size-5 rounded-full border-4 border-background ${color} flex items-center justify-center`}
                  >
                    <Icon className="size-2.5 text-white" />
                  </div>

                  {/* Event card */}
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                          {formatDateUtil(event.timestamp)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AppLayout>
  )
}
