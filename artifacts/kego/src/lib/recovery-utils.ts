import type { ProjectHealth } from './types'

export function getResumeScoreColor(score: number): string {
  if (score >= 61) return 'var(--score-healthy)'
  if (score >= 31) return 'var(--score-warning)'
  return 'var(--score-critical)'
}

export function getHealthColor(health: ProjectHealth): string {
  const colors: Record<string, string> = {
    healthy: 'var(--health-healthy)',
    active: 'var(--health-healthy)',
    'at-risk': 'var(--health-at-risk)',
    stalled: 'var(--health-stalled)',
    dormant: 'var(--health-dormant)',
    recovered: 'var(--health-healthy)',
    recovering: 'var(--health-at-risk)',
  }
  return colors[health] || 'var(--health-stalled)'
}

export function getHealthLabel(health: ProjectHealth): string {
  const labels: Record<string, string> = {
    healthy: 'Healthy',
    active: 'Active',
    'at-risk': 'At Risk',
    stalled: 'Stalled',
    dormant: 'Dormant',
    recovered: 'Recovered',
    recovering: 'Recovering',
  }
  return labels[health] || health
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
