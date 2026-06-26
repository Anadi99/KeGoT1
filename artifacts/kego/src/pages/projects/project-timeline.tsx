import { useParams } from 'wouter'
import { mockProjects, mockTimelineEvents } from '@/lib/mock-data'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Zap, Pause, Plus, Calendar } from 'lucide-react'

const typeIcons: Record<string, React.ReactNode> = {
  created: <Zap className="size-4 text-blue-500" />,
  milestone: <CheckCircle2 className="size-4 text-green-500" />,
  decision: <Zap className="size-4 text-yellow-500" />,
  paused: <Pause className="size-4 text-orange-500" />,
  resumed: <Zap className="size-4 text-purple-500" />,
  'memory-reconstructed': <Zap className="size-4 text-primary" />,
}

const typeColors: Record<string, string> = {
  created: 'bg-blue-500/10 text-blue-700',
  milestone: 'bg-green-500/10 text-green-700',
  decision: 'bg-yellow-500/10 text-yellow-700',
  paused: 'bg-orange-500/10 text-orange-700',
  resumed: 'bg-purple-500/10 text-purple-700',
}

export default function ProjectTimelinePage() {
  const params = useParams<{ id: string }>()
  const project = mockProjects.find(p => p.id === params.id) || mockProjects[0]
  const events = mockTimelineEvents
    .filter(e => e.projectId === project.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/projects/${project.id}/recovery`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Recovery
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Timeline</h1>
            <p className="text-muted-foreground mt-1">{project.name}</p>
          </div>
          <Button className="gap-2"><Plus className="size-4" />Add Event</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="size-5" />Project History</CardTitle>
            <CardDescription>{events.length} events recorded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6 pl-10">
                {events.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full bg-background border-2 border-border">
                      {typeIcons[event.type] || <Zap className="size-3" />}
                    </div>
                    <div className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-sm">{event.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="secondary" className={`text-xs ${typeColors[event.type] || ''}`}>
                            {event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
