import { useParams, Link } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '@/lib/services/projects'
import { AppLayout } from '@/components/layout/app-layout'
import { RecoveryHub } from '@/components/recovery/recovery-hub'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'

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

export default function ProjectHubPage() {
  const params = useParams<{ id: string }>()
  const id = params.id!

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const project = projects?.find((p) => p.id === id)

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-5xl mx-auto space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
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
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={`/projects/${id}/recovery`}><ArrowLeft className="size-4" />Recovery</Link>
          </Button>
          <ProjectSectionNav projectId={id} active="hub" />
        </div>
        <RecoveryHub projectId={id} />
      </div>
    </AppLayout>
  )
}
