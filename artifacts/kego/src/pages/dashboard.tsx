import { mockProjects, mockRecommendations } from '@/lib/mock-data'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/projects/project-card'
import { Link } from 'wouter'
import { TrendingUp, FolderOpen, Zap, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const healthyProjects = mockProjects.filter(p => p.health === 'healthy' || p.health === 'active')
  const atRiskProjects = mockProjects.filter(p => p.health === 'at-risk' || p.health === 'stalled' || p.health === 'dormant')

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your project memory overview</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-3xl font-bold">{mockProjects.length}</p>
                </div>
                <FolderOpen className="size-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Healthy</p>
                  <p className="text-3xl font-bold text-green-600">{healthyProjects.length}</p>
                </div>
                <TrendingUp className="size-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                  <p className="text-3xl font-bold text-orange-500">{atRiskProjects.length}</p>
                </div>
                <Zap className="size-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recovery Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recovery Recommendations</h2>
          </div>
          <div className="space-y-3">
            {mockRecommendations.slice(0, 3).map((rec) => (
              <Card key={rec.projectId} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{rec.projectName}</h3>
                        <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {rec.reason.replace(/-/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{rec.explanation}</p>
                    </div>
                    <Link href={`/projects/${rec.projectId}/recovery`}>
                      <Button size="sm" variant="outline" className="gap-1 flex-shrink-0">
                        Resume <ArrowRight className="size-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {mockProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
