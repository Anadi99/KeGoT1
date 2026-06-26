'use client'

import type { Project } from '@/lib/types'
import Link from 'next/link'
import { formatTimeSincePause } from '@/lib/recovery-utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ResumeScore } from '@/components/recovery/resume-score'
import { ProjectHealthBadge } from '@/components/recovery/project-health'
import { ChevronRight } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  variant?: 'compact' | 'full'
}

export function ProjectCard({ project, variant = 'full' }: ProjectCardProps) {
  const timeSincePause = formatTimeSincePause(project.pausedAt || new Date())

  if (variant === 'compact') {
    return (
      <Link href={`/projects/${project.id}/recovery`}>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-sm">{project.name}</h3>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {project.description}
                </p>
              </div>
              <ResumeScore score={project.resumeScore} variant="sm" showLabel={false} />
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/projects/${project.id}/recovery`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-base line-clamp-2">{project.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 py-3 border-t border-b border-border">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Resume Score</span>
              <ResumeScore
                score={project.resumeScore}
                variant="md"
                showLabel={false}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Health</span>
              <ProjectHealthBadge health={project.health} size="sm" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last activity: {timeSincePause}</span>
            <ChevronRight className="size-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
