'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { Link2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface GitHubConnectorProps {
  projectId: string
  isConnected?: boolean
  repoUrl?: string
  lastSync?: Date
  onConnect?: () => void
  onDisconnect?: () => void
}

export function GitHubConnector({
  projectId,
  isConnected = false,
  repoUrl = '',
  lastSync,
  onConnect,
  onDisconnect,
}: GitHubConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [inputRepo, setInputRepo] = useState(repoUrl)
  const [settings, setSettings] = useState({
    autoTimelineFromCommits: true,
    autoMilestonesFromReleases: true,
    extractDecisionsFromPRs: true,
    parseReadmeForContext: true,
  })

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnecting(false)
      onConnect?.()
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-900">
                <div className="text-white text-xs font-bold">GH</div>
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  GitHub Integration
                  {isConnected && <Badge variant="outline" className="bg-green-500/10">Connected</Badge>}
                </CardTitle>
                <CardDescription>
                  Automatically sync commits, PRs, releases, and issues as project memory
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Repository URL</label>
                <Input
                  placeholder="https://github.com/owner/repo"
                  value={inputRepo}
                  onChange={(e) => setInputRepo(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Sync Options</p>
                <div className="space-y-2">
                  {Object.entries(settings).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={value} />
                      <span className="text-sm">
                        {key === 'autoTimelineFromCommits' && 'Auto-create timeline from commits'}
                        {key === 'autoMilestonesFromReleases' && 'Auto-create milestones from releases'}
                        {key === 'extractDecisionsFromPRs' && 'Extract decisions from PR discussions'}
                        {key === 'parseReadmeForContext' && 'Parse README for project context'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
                {isConnecting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect GitHub Repository'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="size-5" />
                  <span className="font-medium">Connected to {inputRepo}</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {lastSync ? (
                  <p>Last synced: {lastSync.toLocaleDateString()}</p>
                ) : (
                  <p>Ready to sync</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Active Syncs</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="size-4" />
                    Timeline from commits
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="size-4" />
                    Milestones from releases
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="size-4" />
                    Decisions from PRs
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={onDisconnect} className="w-full">
                Disconnect Repository
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
