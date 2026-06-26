import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitHubConnector } from '@/components/integrations/github-connector'
import { useState } from 'react'

const integrations = [
  { id: 'github', name: 'GitHub', description: 'Sync commits, PRs, and releases', category: 'code', status: 'available' },
  { id: 'notion', name: 'Notion', description: 'Import notes and docs', category: 'docs', status: 'coming-soon' },
  { id: 'linear', name: 'Linear', description: 'Sync issues and milestones', category: 'pm', status: 'coming-soon' },
  { id: 'figma', name: 'Figma', description: 'Link design files to context', category: 'design', status: 'coming-soon' },
  { id: 'slack', name: 'Slack', description: 'Capture decisions from conversations', category: 'comms', status: 'coming-soon' },
  { id: 'jira', name: 'Jira', description: 'Sync tickets and sprints', category: 'pm', status: 'coming-soon' },
]

export default function IntegrationsPage() {
  const [githubConnected, setGithubConnected] = useState(false)

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
          <GitHubConnector
            projectId="global"
            isConnected={githubConnected}
            onConnect={() => setGithubConnected(true)}
            onDisconnect={() => setGithubConnected(false)}
          />
        </div>

        {/* Coming soon */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Integrations</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {integrations.filter(i => i.id !== 'github').map((integration) => (
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
