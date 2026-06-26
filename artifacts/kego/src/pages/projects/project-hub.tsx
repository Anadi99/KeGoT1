import { useParams } from 'wouter'
import { mockProjects } from '@/lib/mock-data'
import { AppLayout } from '@/components/layout/app-layout'
import { RecoveryHub } from '@/components/recovery/recovery-hub'
import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ProjectHubPage() {
  const params = useParams<{ id: string }>()
  const project = mockProjects.find(p => p.id === params.id) || mockProjects[0]

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/projects/${project.id}/recovery`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Recovery
            </Button>
          </Link>
        </div>
        <RecoveryHub />
      </div>
    </AppLayout>
  )
}
