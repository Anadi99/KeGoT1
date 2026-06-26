import { AppLayout } from '@/components/layout/app-layout'
import { ProjectCard } from '@/components/projects/project-card'
import { mockProjects, mockRecommendations } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Sort projects by Resume Score (descending)
  const recoveryOpportunities = [...mockProjects].sort((a, b) => b.resumeScore - a.resumeScore)

  // Find projects at risk of being forgotten
  const momentumWarnings = mockProjects.filter(
    (p) => p.health === 'stalled' || p.health === 'dormant'
  )

  const hasProjects = mockProjects.length > 0

  return (
    <AppLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-balance">
            {hasProjects ? 'What project should you recover?' : "You haven't lost a project yet."}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {hasProjects
              ? 'Pick up where you left off with intelligent context recovery.'
              : 'Create your first project to start building.'}
          </p>
        </div>

        {!hasProjects && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No projects yet. Start by creating one.</p>
              <Link href="/projects">
                <Button>Create Project</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {hasProjects && (
          <>
            {/* Recovery Opportunities */}
            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">Recovery Opportunities</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Projects ranked by context completeness
                </p>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {recoveryOpportunities.slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} variant="full" />
                ))}
              </div>
              {recoveryOpportunities.length > 6 && (
                <div className="mt-4 text-center">
                  <Link href="/projects">
                    <Button variant="outline">View all projects</Button>
                  </Link>
                </div>
              )}
            </section>

            {/* Momentum Warnings */}
            {momentumWarnings.length > 0 && (
              <section className="space-y-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-5 text-[var(--score-warning)]" />
                    <h2 className="text-2xl font-semibold">Momentum at Risk</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Projects that are at risk of being forgotten
                  </p>
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {momentumWarnings.map((project) => (
                    <Card key={project.id} className="border-[var(--score-warning)]/30 bg-[var(--score-warning)]/5">
                      <CardHeader>
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">
                          {project.health === 'dormant'
                            ? 'No activity for 6+ months. This project is at critical risk.'
                            : 'Paused 3+ months. Recovery needed soon.'}
                        </p>
                        <Link href={`/projects/${project.id}/recovery`}>
                          <Button className="w-full">Open & Review</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Recommendations */}
            <section className="space-y-4">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Smart Recommendations</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Personalized suggestions for your next session
                </p>
              </div>
              <div className="space-y-3">
                {mockRecommendations.slice(0, 3).map((rec) => (
                  <Card key={rec.projectId}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.projectName}</p>
                          <p className="text-xs text-muted-foreground mt-1">{rec.explanation}</p>
                        </div>
                        <Link href={`/projects/${rec.projectId}/recovery`}>
                          <Button size="sm" variant="ghost">
                            Resume
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppLayout>
  )
}
