import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitHubConnector } from '@/components/integrations/github-connector'

const comingSoon = [
  { id: 'notion', name: 'Notion', description: 'Import notes and docs' },
  { id: 'linear', name: 'Linear', description: 'Sync issues and milestones' },
  { id: 'figma', name: 'Figma', description: 'Link design files to context' },
  { id: 'slack', name: 'Slack', description: 'Capture decisions from conversations' },
  { id: 'jira', name: 'Jira', description: 'Sync tickets and sprints' },
]

export default function IntegrationsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect your tools to automatically build project memory</p>
        </div>

        {/* GitHub (active) */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Connected Integrations</h2>
          <GitHubConnector projectId="global" />
        </div>

        {/* Coming soon */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Integrations</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {comingSoon.map((integration) => (
              <Card key={integration.id} className="opacity-70">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {integration.name}
                        <Badge variant="secondary" className="text-xs">Coming soon</Badge>
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" disabled className="w-full">
                    Connect {integration.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
