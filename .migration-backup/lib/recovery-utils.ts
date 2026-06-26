import type { ProjectHealth } from './types'

/**
 * KeGo Recovery Intelligence Utils
 * Calculates metrics that determine project recoverability
 */

export function getResumeScoreColor(score: number): string {
  if (score >= 61) return 'var(--score-healthy)' // Green: 61-100
  if (score >= 31) return 'var(--score-warning)' // Yellow: 31-60
  return 'var(--score-critical)' // Red: 0-30
}

export function getHealthColor(health: ProjectHealth): string {
  const colors: Record<ProjectHealth, string> = {
    healthy: 'var(--health-healthy)',
    'at-risk': 'var(--health-at-risk)',
    stalled: 'var(--health-stalled)',
    dormant: 'var(--health-dormant)',
    recovered: 'var(--health-healthy)',
  }
  return colors[health]
}

export function getHealthLabel(health: ProjectHealth): string {
  const labels: Record<ProjectHealth, string> = {
    healthy: 'Healthy',
    'at-risk': 'At Risk',
    stalled: 'Stalled',
    dormant: 'Dormant',
    recovered: 'Recovered',
  }
  return labels[health]
}

export function getResumeScoreLabel(score: number): string {
  if (score >= 61) return 'Strong context'
  if (score >= 31) return 'Moderate context'
  return 'Limited context'
}

export function getRecoveryConfidenceInterpretation(confidence: number): string {
  if (confidence >= 81) return 'We have sufficient context to resume immediately'
  if (confidence >= 61) return 'Good context available, minor gaps'
  if (confidence >= 41) return 'Moderate context with some gaps'
  return 'Limited context, may need to review documentation'
}

export function formatTimeSincePause(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffWeeks === 1) return '1 week ago'
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`
  if (diffMonths === 1) return '1 month ago'
  if (diffMonths < 12) return `${diffMonths} months ago`
  return `${Math.floor(diffMonths / 12)} years ago`
}

export function calculateProjectHealth(
  resumeScore: number,
  daysSincePause: number,
  lastActivityRecent: boolean
): ProjectHealth {
  // If paused more than 180 days, likely dormant
  if (daysSincePause > 180) return 'dormant'

  // If paused more than 90 days and score is low, it's stalled
  if (daysSincePause > 90 && resumeScore < 40) return 'stalled'

  // If paused more than 60 days and score is moderate, at risk
  if (daysSincePause > 60 && resumeScore < 60) return 'at-risk'

  // Recent activity and good score = healthy
  return 'healthy'
}

export function estimateTimeToResume(contextCompleteness: number): string {
  if (contextCompleteness >= 80) return '10-15 minutes'
  if (contextCompleteness >= 60) return '20-30 minutes'
  if (contextCompleteness >= 40) return '30-45 minutes'
  return '1-2 hours'
}
