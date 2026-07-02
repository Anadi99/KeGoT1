import { useParams, Link } from 'wouter'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProjects } from '@/lib/services/projects'
import { fetchVaultEntries, createVaultEntry, deleteVaultEntry } from '@/lib/services/memory'
import { AppLayout } from '@/components/layout/app-layout'
import { KnowledgeVault } from '@/components/vault/knowledge-vault'
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

export default function ProjectVaultPage() {
  const params = useParams<{ id: string }>()
  const id = params.id!
  const queryClient = useQueryClient()

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['vault', id],
    queryFn: () => fetchVaultEntries(id),
  })

  const createMutation = useMutation({
    mutationFn: (entry: { title: string; content: string; category: string; tags: string[] }) =>
      createVaultEntry({ projectId: id, ...entry }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', id] })
      toast.success('Entry saved')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVaultEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', id] })
      toast.success('Entry deleted')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const isLoading = projectsLoading || entriesLoading
  const project = projects?.find((p) => p.id === id)

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Card key={i}><CardContent className="p-6 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
            ))}
          </div>
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

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={`/projects/${id}/recovery`}><ArrowLeft className="size-4" />Recovery</Link>
          </Button>
          <ProjectSectionNav projectId={id} active="vault" />
        </div>
        <KnowledgeVault
          entries={entries}
          projectId={id}
          onAddEntry={(entry) => createMutation.mutate(entry)}
          onDeleteEntry={(entryId) => deleteMutation.mutate(entryId)}
          isAdding={createMutation.isPending}
        />
      </div>
    </AppLayout>
  )
}
