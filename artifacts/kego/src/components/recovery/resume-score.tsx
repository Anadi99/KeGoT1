import { getResumeScoreColor, getResumeScoreLabel } from '@/lib/recovery-utils'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ResumeScoreProps {
  score: number
  variant?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ResumeScore({ score, variant = 'md', showLabel = true }: ResumeScoreProps) {
  const color = getResumeScoreColor(score)
  const label = getResumeScoreLabel(score)

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center justify-center rounded-full font-semibold text-white ${sizeClasses[variant]}`}
              style={{ backgroundColor: color }}
            >
              {score}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-semibold">Resume Score</p>
            <p className="text-sm mt-1">Measures project context completeness (0-100)</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>61-100: Strong context</p>
              <p>31-60: Moderate context</p>
              <p>0-30: Limited context</p>
            </div>
          </TooltipContent>
        </Tooltip>

        {showLabel && (
          <Badge variant="secondary" className="text-xs">
            {label}
          </Badge>
        )}
      </div>
    </TooltipProvider>
  )
}
