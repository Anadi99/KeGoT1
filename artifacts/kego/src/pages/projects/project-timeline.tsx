import { useParams, Link } from 'wouter'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProjects } from '@/lib/services/projects'
import { fetchTimelineEvents, createTimelineEvent } from '@/lib/services/memory'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, CheckCircle2, Zap, Pause, Plus, Calendar } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function ProjectSectionNav({ projectId, active }: { projectId: string; active: 'recovery' | 'hub' | 'vault' | 'timeline' }) {
  const sections = [
    { id: 'hub', label: 'Hub', href: `/projects/${projectId}/hub` },
    { id: 'recovery', label: 'Recovery', href: `/projects/${projectId}/recovery` },
    { id: 'vault', label: 'Vault', href: `/projects/${projectId}/vault` },
    { id: 'timeline', label: 'Timeline', href: `/projects/${projectId}/timeline` },
  ] as const
  return (
    <div className="flex flex-wrap gap-2">
      {sections.map((s) => (
        <Button key={s.id} asChild variant={s.id === active ? 'default' : 'outline'} size="sm">
          <Link href={s.href}>{s.label}</Link>
        </Button>
      ))}
    </div>
  )
}

const typeIcons: Record<string, React.ReactNode> = {
  created: <Zap className="size-4 text-blue-500" />,
  milestone: <CheckCircle2 className="size-4 text-green-500" />,
  decision: <Zap className="size-4 text-yellow-500" />,
  paused: <Pause className="size-4 text-orange-500" />,
  resumed: <Zap className="size-4 text-purple-500" />,
  'memory-reconstructed': <Zap className="size-4 text-primary" />,
  'github:commit': <Zap className="size-4 text-gray-500" />,
}

const typeColors: Record<string, string> = {
  created: 'bg-blue-500/10 text-blue-700',
  milestone: 'bg-green-500/10 text-green-700',
  decision: 'bg-yellow-500/10 text-yellow-700',
  paused: 'bg-orange-500/10 text-orange-700',
  resumed: 'bg-purple-500/10 text-purple-700',
}

const EVENT_TYPES = ['milestone', 'decision', 'note', 'paused', 'resumed', 'created'] as const

export default function ProjectTimelinePage() {
  const params = useParams<{ id: string }>()
  const id = params.id!
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newType, setNewType] = useState<string>('note')

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['timeline', id],
    queryFn: () => fetchTimelineEvents(id),
  })

  const createMutation = useMutation({
    mutationFn: (e: { title: string; description: string; type: string }) =>
      createTimelineEvent({ projectId: id, ...e }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline', id] })
      toast.success('Event added')
      setDialogOpen(false)
      setNewTitle('')
      setNewDescription('')
      setNewType('note')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const isLoading = projectsLoading || eventsLoading
  const project = projects?.find((p) => p.id === id)

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto space-y-4">
          {[0, 1, 2].map((i) => (
            <Card key={i}><CardContent className="p-4 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-full" /></CardContent></Card>
          ))}
        </div>
      </AppLayout>
    )
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <h1 className="text-2xl font-bold">Project not found</h1>
              <Button asChild><Link href="/projects">Back to Projects</Link></Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={`/projects/${id}/recovery`}><ArrowLeft className="size-4" />Recovery</Link>
          </Button>
          <ProjectSectionNav projectId={id} active="timeline" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Timeline</h1>
            <p className="text-muted-foreground mt-1">{project.name}</p>
          </div>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />Add Event
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="size-5" />Project History</CardTitle>
            <CardDescription>{sorted.length} events recorded</CardDescription>
          </CardHeader>
          <CardContent>
            {sorted.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No events yet. Add the first one.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6 pl-10">
                  {sorted.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full bg-background border-2 border-border">
                        {typeIcons[event.type] ?? <Zap className="size-3" />}
                      </div>
                      <div className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-sm">{event.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="secondary" className={`text-xs ${typeColors[event.type] ?? ''}`}>
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
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Timeline Event</DialogTitle></DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!newTitle.trim()) return
              createMutation.mutate({ title: newTitle.trim(), description: newDescription.trim(), type: newType })
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="event-title">Title *</Label>
              <Input id="event-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Event title" required />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="event-desc">Description</Label>
              <Textarea id="event-desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={2} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || !newTitle.trim()}>
                {createMutation.isPending ? 'Adding…' : 'Add Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
