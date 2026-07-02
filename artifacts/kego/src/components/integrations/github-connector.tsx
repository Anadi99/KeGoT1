import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchIntegration,
  connectIntegration,
  disconnectIntegration,
  syncGitHub,
  validateGitHubUrl,
} from '@/lib/services/integrations'
import { useDemoMode } from '@/hooks/useDemoMode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { CheckCircle2, Loader2, RefreshCw, Database } from 'lucide-react'
import { toast } from 'sonner'

interface GitHubConnectorProps {
  projectId: string
}

export function GitHubConnector({ projectId }: GitHubConnectorProps) {
  const queryClient = useQueryClient()
  const isDemo = useDemoMode()
  const [inputRepo, setInputRepo] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)
  const [settings] = useState({
    autoTimelineFromCommits: true,
    autoMilestonesFromReleases: true,
    extractDecisionsFromPRs: true,
    parseReadmeForContext: true,
  })

  const { data: integration, isLoading } = useQuery({
    queryKey: ['integration', projectId, 'github'],
    queryFn: () => fetchIntegration(projectId, 'github'),
    enabled: !isDemo,
  })

  const connectMutation = useMutation({
    mutationFn: () => connectIntegration(projectId, 'github', inputRepo, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration', projectId, 'github'] })
      toast.success('GitHub repository connected')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const disconnectMutation = useMutation({
    mutationFn: () => disconnectIntegration(integration!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration', projectId, 'github'] })
      toast.success('GitHub repository disconnected')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const syncMutation = useMutation({
    mutationFn: () => syncGitHub(integration!),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['timeline', projectId] })
      toast.success(`Synced ${count} commit(s) to timeline`)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function handleConnect() {
    const error = validateGitHubUrl(inputRepo)
    if (error) { setUrlError(error); return }
    setUrlError(null)
    connectMutation.mutate()
  }

  const isConnected = !!integration

  if (isDemo) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-900"><div className="text-white text-xs font-bold">GH</div></div>
            <div>
              <CardTitle className="flex items-center gap-2">GitHub Integration</CardTitle>
              <CardDescription>Connect GitHub to sync commits as project memory</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
            <Database className="size-4 shrink-0" />
            <span>Database unavailable — connect Supabase to enable GitHub integration.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-900"><div className="text-white text-xs font-bold">GH</div></div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  GitHub Integration
                  {isConnected && <Badge variant="outline" className="bg-green-500/10">Connected</Badge>}
                </CardTitle>
                <CardDescription>Automatically sync commits, PRs, and releases as project memory</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />Loading connection status…
            </div>
          ) : !isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Repository URL</label>
                <Input
                  placeholder="https://github.com/owner/repo"
                  value={inputRepo}
                  onChange={(e) => { setInputRepo(e.target.value); setUrlError(null) }}
                  className="mt-2"
                />
                {urlError && <p className="text-xs text-destructive mt-1">{urlError}</p>}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Sync Options</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={settings.autoTimelineFromCommits} readOnly />
                    <span className="text-sm">Auto-create timeline from commits</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={settings.autoMilestonesFromReleases} readOnly />
                    <span className="text-sm">Auto-create milestones from releases</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={settings.extractDecisionsFromPRs} readOnly />
                    <span className="text-sm">Extract decisions from PR discussions</span>
                  </label>
                </div>
              </div>
              <Button
                onClick={handleConnect}
                disabled={connectMutation.isPending || !inputRepo.trim()}
                className="w-full"
              >
                {connectMutation.isPending
                  ? <><Loader2 className="size-4 mr-2 animate-spin" />Connecting…</>
                  : 'Connect GitHub Repository'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="size-5" />
                  <span className="font-medium text-sm">Connected to {integration.repo_url}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {integration.last_sync_at
                  ? <p>Last synced: {new Date(integration.last_sync_at).toLocaleString()}</p>
                  : <p>Ready to sync — click Sync Now to import commits.</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => syncMutation.mutate()}
                  disabled={syncMutation.isPending}
                >
                  {syncMutation.isPending
                    ? <><Loader2 className="size-4 animate-spin" />Syncing…</>
                    : <><RefreshCw className="size-4" />Sync Now</>}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => disconnectMutation.mutate()}
                  disabled={disconnectMutation.isPending}
                >
                  Disconnect
                </Button>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400"><CheckCircle2 className="size-4" />Timeline from commits</div>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400"><CheckCircle2 className="size-4" />Milestones from releases</div>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400"><CheckCircle2 className="size-4" />Decisions from PRs</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
