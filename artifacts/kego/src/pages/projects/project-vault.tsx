import { useParams } from 'wouter'
import { mockProjects, mockVaultEntries } from '@/lib/mock-data'
import { AppLayout } from '@/components/layout/app-layout'
import { KnowledgeVault } from '@/components/vault/knowledge-vault'
import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

function ProjectSectionNav({ projectId, active }: { projectId: string, active: 'recovery' | 'hub' | 'vault' | 'timeline' }) {
  const sections = [
    { id: 'hub', label: 'Hub', href: `/projects/${projectId}/hub` },
    { id: 'recovery', label: 'Recovery', href: `/projects/${projectId}/recovery` },
    { id: 'vault', label: 'Vault', href: `/projects/${projectId}/vault` },
    { id: 'timeline', label: 'Timeline', href: `/projects/${projectId}/timeline` },
  ] as const

  return (
    <div className="flex flex-wrap gap-2">
      {sections.map((section) => (
        <Button key={section.id} asChild variant={section.id === active ? 'default' : 'outline'} size="sm">
          <Link href={section.href}>{section.label}</Link>
        </Button>
      ))}
    </div>
  )
}

export default function ProjectVaultPage() {
  const params = useParams<{ id: string }>()
  const project = mockProjects.find(p => p.id === params.id)

  if (!project) {
    return (
      <AppLayout>
        <div className="p-6 max-w-3xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <h1 className="text-2xl font-bold">Project not found</h1>
              <p className="text-sm text-muted-foreground">This project ID does not exist in the current workspace.</p>
              <Button asChild>
                <Link href="/projects">Back to Projects</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }
  const entries = mockVaultEntries.filter(e => e.projectId === project.id)

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={`/projects/${project.id}/recovery`}>
              <ArrowLeft className="size-4" />
              Recovery
            </Link>
          </Button>
          <ProjectSectionNav projectId={project.id} active="vault" />
        </div>
        <KnowledgeVault entries={entries} projectId={project.id} />
      </div>
    </AppLayout>
  )
}
