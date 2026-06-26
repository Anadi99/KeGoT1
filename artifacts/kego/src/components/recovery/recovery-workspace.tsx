import type { Project, RecoveryWorkspace } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResumeScore } from './resume-score'
import { ProjectHealthBadge } from './project-health'
import { ScoreBreakdown } from './score-breakdown'
import { DecisionIntelligence } from './decision-intelligence'
import { Milestones } from './milestones'
import { RecoveryChecklist } from './recovery-checklist'
import { ProjectReconstruction } from './project-reconstruction'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, AlertCircle, BookOpen, Lightbulb, Link2, ArrowRight, Clock } from 'lucide-react'

interface RecoveryWorkspaceProps {
  project: Project
  workspace: RecoveryWorkspace
}

export function RecoveryWorkspaceComponent({ project, workspace }: RecoveryWorkspaceProps) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-3xl">{project.name}</CardTitle>
              <CardDescription className="mt-2">{project.description}</CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <ProjectHealthBadge health={project.health} />
              <Badge variant="outline" className="w-fit text-xs">{project.tags.join(', ')}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Resume Score</p>
              <div className="flex items-center gap-3">
                <ResumeScore score={project.resumeScore} variant="lg" showLabel={false} />
                <div>
                  <p className="text-sm font-semibold">{project.resumeScore}/100</p>
                  <p className="text-xs text-muted-foreground">Context complete</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Recovery Confidence</p>
              <p className="text-2xl font-bold text-primary">{project.recoveryConfidence}%</p>
              <p className="text-xs text-muted-foreground">Ready to resume</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Time to Resume</p>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <p className="text-sm font-semibold">20-30 min</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {project.scoreBreakdown && <ScoreBreakdown breakdown={project.scoreBreakdown} totalScore={project.resumeScore} />}

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="size-5" />Project Summary</CardTitle></CardHeader>
        <CardContent><p className="text-sm leading-relaxed text-foreground">{workspace.projectSummary}</p></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="size-5 text-green-500" />Completed Work</CardTitle>
          <CardDescription>Recent accomplishments and milestones</CardDescription>
        </CardHeader>
        <CardContent><div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono bg-muted/50 p-4 rounded-lg">{workspace.completedWork}</div></CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><ArrowRight className="size-5 text-blue-500" />Pending Work</CardTitle>
            <CardDescription>Tasks waiting to be continued</CardDescription>
          </CardHeader>
          <CardContent><div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono bg-muted/50 p-4 rounded-lg">{workspace.pendingWork}</div></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><AlertCircle className="size-5 text-orange-500" />Blockers</CardTitle>
            <CardDescription>What&apos;s stuck or needs investigation</CardDescription>
          </CardHeader>
          <CardContent><div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono bg-muted/50 p-4 rounded-lg">{workspace.blockers}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="size-5 text-yellow-500" />Important Decisions</CardTitle>
          <CardDescription>Key architectural and strategic choices made</CardDescription>
        </CardHeader>
        <CardContent><div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono bg-muted/50 p-4 rounded-lg">{workspace.importantDecisions}</div></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Link2 className="size-5 text-purple-500" />Important Resources</CardTitle>
          <CardDescription>Links, references, and documentation</CardDescription>
        </CardHeader>
        <CardContent><div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono bg-muted/50 p-4 rounded-lg">{workspace.importantResources}</div></CardContent>
      </Card>

      {workspace.decisions && workspace.decisions.length > 0 && <DecisionIntelligence decisions={workspace.decisions} />}
      {workspace.milestones && workspace.milestones.length > 0 && <Milestones milestones={workspace.milestones} />}
      {workspace.recoveryChecklist && workspace.recoveryChecklist.length > 0 && <RecoveryChecklist items={workspace.recoveryChecklist} />}

      <ProjectReconstruction />

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><ArrowRight className="size-5 text-primary" />Suggested Next Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-medium text-foreground">{workspace.suggestedNextAction}</p>
          <div className="flex gap-2 flex-wrap">
            <Button className="gap-2"><CheckCircle2 className="size-4" />Start Now</Button>
            <Button variant="outline" className="gap-2">Review Context</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
