import type { ProjectHealth } from '@/lib/types'
import { getHealthColor, getHealthLabel } from '@/lib/recovery-utils'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertCircle, CheckCircle2, Pause, XCircle } from 'lucide-react'

interface ProjectHealthBadgeProps {
  health: ProjectHealth
  showIcon?: boolean
  size?: 'sm' | 'md'
}

const healthIcons: Record<string, React.ReactNode> = {
  healthy: <CheckCircle2 className="size-4" />,
  active: <CheckCircle2 className="size-4" />,
  'at-risk': <AlertCircle className="size-4" />,
  stalled: <Pause className="size-4" />,
  dormant: <XCircle className="size-4" />,
  recovered: <CheckCircle2 className="size-4" />,
  recovering: <AlertCircle className="size-4" />,
}

const healthDescriptions: Record<string, string> = {
  healthy: 'Project is active and has good context for resuming',
  active: 'Project is actively being worked on',
  'at-risk': 'Project paused >60 days. Context may fade if not resumed soon',
  stalled: 'Project paused >90 days with low context. Recovery needed',
  dormant: 'Project paused >180 days. At high risk of being forgotten',
  recovered: 'Project has been successfully resumed',
  recovering: 'Project is in the process of being recovered',
}

export function ProjectHealthBadge({ health, showIcon = true, size = 'md' }: ProjectHealthBadgeProps) {
  const label = getHealthLabel(health)
  const description = healthDescriptions[health] || label
  const bgColor = getHealthColor(health)
  const textClasses = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 border-0 font-medium ${textClasses}`}
            style={{ backgroundColor: `${bgColor}15`, color: bgColor }}
          >
            {showIcon && healthIcons[health]}
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{label}</p>
          <p className="text-sm mt-1 max-w-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
