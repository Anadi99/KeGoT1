import { useParams } from 'wouter'
import { mockProjects, mockRecoveryWorkspace } from '@/lib/mock-data'
import { AppLayout } from '@/components/layout/app-layout'
import { RecoveryWorkspaceComponent } from '@/components/recovery/recovery-workspace'
import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ProjectRecoveryPage() {
  const params = useParams<{ id: string }>()
  const project = mockProjects.find(p => p.id === params.id) || mockProjects[0]
  const workspace = { ...mockRecoveryWorkspace, projectId: project.id }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Projects
            </Button>
          </Link>
        </div>
        <RecoveryWorkspaceComponent project={project} workspace={workspace} />
      </div>
    </AppLayout>
  )
}
