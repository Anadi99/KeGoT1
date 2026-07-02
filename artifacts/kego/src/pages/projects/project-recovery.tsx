import { useParams, Link } from 'wouter'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProjects } from '@/lib/services/projects'
import { fetchDecisions, fetchMilestones, updateMilestone } from '@/lib/services/memory'
import { fetchRecoveryWorkspace, upsertRecoveryWorkspace } from '@/lib/services/recovery'
import { AppLayout } from '@/components/layout/app-layout'
import { RecoveryWorkspaceComponent } from '@/components/recovery/recovery-workspace'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
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

export default function ProjectRecoveryPage() {
  const params = useParams<{ id: string }>()
  const id = params.id!
  const queryClient = useQueryClient()

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const { data: workspace, isLoading: workspaceLoading } = useQuery({
    queryKey: ['recovery', id],
    queryFn: () => fetchRecoveryWorkspace(id),
    enabled: !!id,
  })

  const { data: decisions = [] } = useQuery({
    queryKey: ['decisions', id],
    queryFn: () => fetchDecisions(id),
    enabled: !!id,
  })

  const { data: milestones = [] } = useQuery({
    queryKey: ['milestones', id],
    queryFn: () => fetchMilestones(id),
    enabled: !!id,
  })

  const upsertMutation = useMutation({
    mutationFn: upsertRecoveryWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery', id] })
      toast.success('Recovery workspace saved')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const milestoneMutation = useMutation({
    mutationFn: ({ milestoneId, patch }: { milestoneId: string; patch: { status?: string; percentComplete?: number } }) =>
      updateMilestone(milestoneId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', id] })
      toast.success('Milestone updated')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const isLoading = projectsLoading || workspaceLoading
  const project = projects?.find((p) => p.id === id)

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
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
              <p className="text-sm text-muted-foreground">This project does not exist.</p>
              <Button asChild><Link href="/projects">Back to Projects</Link></Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // Merge live decisions/milestones into workspace for display
  const fullWorkspace = workspace
    ? {
        ...workspace,
        decisions,
        milestones,
      }
    : undefined

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/projects"><ArrowLeft className="size-4" />Projects</Link>
          </Button>
          <ProjectSectionNav projectId={id} active="recovery" />
        </div>

        {fullWorkspace && (
          <RecoveryWorkspaceComponent
            project={project}
            workspace={fullWorkspace}
            onSave={(patch) => upsertMutation.mutate({ projectId: id, ...patch })}
            onMilestoneUpdate={(milestoneId, patch) =>
              milestoneMutation.mutate({ milestoneId, patch })
            }
          />
        )}
      </div>
    </AppLayout>
  )
}
