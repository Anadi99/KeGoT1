import { getRecoveryConfidenceInterpretation } from '@/lib/recovery-utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Zap } from 'lucide-react'

interface RecoveryConfidenceProps {
  confidence: number
  interpretation?: boolean
}

export function RecoveryConfidence({ confidence, interpretation = true }: RecoveryConfidenceProps) {
  const confidenceLabel = getRecoveryConfidenceInterpretation(confidence)

  const getColor = (conf: number) => {
    if (conf >= 81) return 'bg-[var(--score-healthy)]'
    if (conf >= 61) return 'bg-[var(--score-warning)]'
    return 'bg-[var(--score-critical)]'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                <span className="text-sm font-medium">Recovery Confidence</span>
              </div>
              <span className="text-lg font-bold text-primary">{confidence}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-300 ${getColor(confidence)}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
            {interpretation && (
              <p className="text-xs text-muted-foreground">{confidenceLabel}</p>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">What is Recovery Confidence?</p>
          <p className="text-sm mt-1 max-w-xs">
            Measures how ready you are to resume this project immediately based on available context completeness.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
