import type { Milestone } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Pause } from 'lucide-react'

interface MilestonesProps {
  milestones: Milestone[]
}

export function Milestones({ milestones }: MilestonesProps) {
  if (!milestones || milestones.length === 0) return null

  const completed = milestones.filter(m => m.status === 'completed').length
  const totalProgress = Math.round(milestones.reduce((sum, m) => sum + m.percentComplete, 0) / Math.max(milestones.length, 1))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-green-500" />
          Project Milestones
        </CardTitle>
        <CardDescription>{completed} of {milestones.length} completed · {totalProgress}% overall progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {milestone.status === 'completed' && <CheckCircle2 className="size-5 text-green-500" />}
                  {milestone.status === 'paused' && <Pause className="size-5 text-yellow-500" />}
                  {(milestone.status === 'planned' || milestone.status === 'in-progress') && <Circle className="size-5 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{milestone.title}</h4>
                    <Badge variant="secondary" className="flex-shrink-0 text-xs">
                      {milestone.status === 'completed' ? 'Completed' : milestone.status === 'in-progress' ? 'In Progress' : milestone.status === 'paused' ? 'Paused' : 'Planned'}
                    </Badge>
                  </div>
                  {milestone.description && <p className="text-sm text-foreground/70 mb-2">{milestone.description}</p>}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${milestone.percentComplete}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium whitespace-nowrap">{milestone.percentComplete}%</p>
                  </div>
                  {milestone.dueDate && <p className="text-xs text-muted-foreground mt-2">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
