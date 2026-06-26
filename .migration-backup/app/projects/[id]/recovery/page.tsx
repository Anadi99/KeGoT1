import { AppLayout } from '@/components/layout/app-layout'
import { RecoveryWorkspaceComponent } from '@/components/recovery/recovery-workspace'
import { mockProjects, mockRecoveryWorkspace } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye } from 'lucide-react'

interface RecoveryPageProps {
  params: Promise<{ id: string }>
}

export default async function RecoveryPage({ params }: RecoveryPageProps) {
  const { id } = await params

  // Find the project
  const project = mockProjects.find((p) => p.id === id)

  if (!project) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Project not found</h1>
            <p className="text-muted-foreground mt-2">The project you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/projects" className="mt-4 inline-block">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link href="/projects" className="inline-flex">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>Last activity: 7 days ago</span>
          </div>
        </div>

        {/* Project Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
          <Link href={`/projects/${id}/recovery`}>
            <Button
              variant="ghost"
              className="rounded-b-none border-b-2 border-primary text-primary"
            >
              <Eye className="size-4 mr-2" />
              Recovery Workspace
            </Button>
          </Link>
          <Link href={`/projects/${id}/vault`}>
            <Button variant="ghost" className="rounded-b-none">
              Knowledge Vault
            </Button>
          </Link>
          <Link href={`/projects/${id}/timeline`}>
            <Button variant="ghost" className="rounded-b-none">
              Timeline
            </Button>
          </Link>
        </div>

        {/* Recovery Workspace Component */}
        <RecoveryWorkspaceComponent project={project} workspace={mockRecoveryWorkspace} />

        {/* Call to Action */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Ready to resume this project?
            </p>
            <Button className="gap-2">
              Start Working
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
