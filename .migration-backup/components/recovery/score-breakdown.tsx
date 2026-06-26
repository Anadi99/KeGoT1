'use client'

import type { ResumeScoreBreakdown } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

interface ScoreBreakdownProps {
  breakdown?: ResumeScoreBreakdown
  totalScore: number
}

export function ScoreBreakdown({ breakdown, totalScore }: ScoreBreakdownProps) {
  if (!breakdown) {
    return null
  }

  const categories = [
    {
      label: 'Documentation Quality',
      score: breakdown.documentationQuality,
      description: 'Quality and completeness of project documentation',
    },
    {
      label: 'Resource Completeness',
      score: breakdown.resourceCompleteness,
      description: 'Links, references, and external resources available',
    },
    {
      label: 'Task Clarity',
      score: breakdown.taskClarity,
      description: 'How clear the pending work and objectives are',
    },
    {
      label: 'Decision History',
      score: breakdown.decisionHistory,
      description: 'Recorded decisions and their rationale',
    },
    {
      label: 'Milestone Coverage',
      score: breakdown.milestoneCoverage,
      description: 'Completion tracking and milestone documentation',
    },
    {
      label: 'Context Richness',
      score: breakdown.contextRichness,
      description: 'Depth and breadth of project context',
    },
    {
      label: 'Recoverability',
      score: breakdown.recoverability,
      description: 'How quickly can the project be resumed',
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-600'
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-600'
    if (score >= 40) return 'bg-orange-500/20 text-orange-600'
    return 'bg-red-500/20 text-red-600'
  }

  const getScoreBar = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          Resume Score Breakdown
        </CardTitle>
        <CardDescription>
          Detailed analysis of context completeness (Average: {totalScore}/100)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{category.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {category.description}
                  </p>
                </div>
                <Badge className={`ml-2 flex-shrink-0 ${getScoreColor(category.score)}`}>
                  {category.score}
                </Badge>
              </div>

              {/* Score bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getScoreBar(category.score)}`}
                  style={{ width: `${category.score}%` }}
                />
              </div>
            </div>
          ))}

          {/* Improvement suggestions */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Ways to improve your Resume Score:</p>
            <ul className="space-y-2 text-xs text-foreground/70">
              {breakdown.documentationQuality < 70 && (
                <li>• Add or enhance project documentation and setup guides</li>
              )}
              {breakdown.resourceCompleteness < 70 && (
                <li>• Link important resources (design files, documentation, references)</li>
              )}
              {breakdown.taskClarity < 70 && (
                <li>• Clarify pending work and break down complex tasks into steps</li>
              )}
              {breakdown.decisionHistory < 70 && (
                <li>• Record important decisions and explain your rationale</li>
              )}
              {breakdown.milestoneCoverage < 70 && (
                <li>• Define and track project milestones with progress</li>
              )}
              {breakdown.contextRichness < 70 && (
                <li>• Add notes, screenshots, and context to key sections</li>
              )}
              {breakdown.recoverability < 70 && (
                <li>• Create a recovery checklist for quick project resumption</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
