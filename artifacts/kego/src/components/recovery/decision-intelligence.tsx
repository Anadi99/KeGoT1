import type { Decision } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Link2 } from 'lucide-react'

interface DecisionIntelligenceProps {
  decisions: Decision[]
}

export function DecisionIntelligence({ decisions }: DecisionIntelligenceProps) {
  if (!decisions || decisions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-5 text-yellow-500" />
            Decision Intelligence
          </CardTitle>
          <CardDescription>Key decisions and their rationale</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No decisions recorded yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-5 text-yellow-500" />
          Decision Intelligence
        </CardTitle>
        <CardDescription>{decisions.length} key decision{decisions.length !== 1 ? 's' : ''} recorded</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {decisions.map((decision, index) => (
            <div key={decision.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{decision.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(decision.madeAt).toLocaleDateString()}</p>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">Decision {index + 1}</Badge>
              </div>
              <div className="space-y-3 mt-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Why?</p>
                  <p className="text-sm leading-relaxed">{decision.rationale}</p>
                </div>
                {decision.description && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Context</p>
                    <p className="text-sm leading-relaxed">{decision.description}</p>
                  </div>
                )}
                {decision.alternatives && decision.alternatives.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Alternatives Considered</p>
                    <div className="flex flex-wrap gap-2">
                      {decision.alternatives.map((alt, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{alt}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {decision.consequences && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Impact</p>
                    <p className="text-sm leading-relaxed text-foreground/80">{decision.consequences}</p>
                  </div>
                )}
                {decision.relatedResources && decision.relatedResources.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Link2 className="size-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{decision.relatedResources.length} linked resource{decision.relatedResources.length !== 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
