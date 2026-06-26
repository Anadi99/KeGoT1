import { AppLayout } from '@/components/layout/app-layout'
import { ProjectCard } from '@/components/projects/project-card'
import { mockProjects } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  // Sort by Resume Score
  const projects = [...mockProjects].sort((a, b) => b.resumeScore - a.resumeScore)

  return (
    <AppLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">All Projects</h1>
            <p className="text-muted-foreground mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''} in your memory vault
            </p>
          </div>
          <Link href="/projects/new">
            <Button>
              <Plus className="size-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Link href="/projects/new">
              <Button>Create your first project</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
