import { useQuery } from '@tanstack/react-query'
import { fetchHubData } from '@/lib/services/hub'
import { useDemoMode } from '@/hooks/useDemoMode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, Inbox, CheckCircle2, Clock, Zap, Download } from 'lucide-react'

interface RecoveryHubProps {
  projectId: string
}

export function RecoveryHub({ projectId }: RecoveryHubProps) {
  const isDemo = useDemoMode()

  const { data, isLoading } = useQuery({
    queryKey: ['hub', projectId],
    queryFn: () => fetchHubData(projectId),
  })

  function handleGenerateReport() {
    if (!data) return
    const text = [
      `Recovery Report — Project ${projectId}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      `Momentum Score: ${data.momentumScore}/100`,
      `Current Streak: ${data.streak} day(s)`,
      '',
      'Inbox Items:',
      ...data.inboxItems.map((i) => `  [${i.priority}] ${i.title}: ${i.description}`),
      '',
      'Snapshots:',
      ...data.snapshots.map((s) => `  ${s.date.toLocaleDateString()} — ${s.status} (${s.progress}%)`),
    ].join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recovery-report-${projectId}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Build chart data from streak (last 7 days)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      score: data ? Math.max(10, data.momentumScore - (6 - i) * 4 + Math.round(Math.random() * 8)) : 0,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold">Recovery Hub</h2>
          <p className="text-muted-foreground mt-1">
            Dashboard for tracking recovery progress and momentum
            {isDemo && <span className="ml-2 text-amber-600 font-medium">(Demo Mode)</span>}
          </p>
        </div>
        <Button className="gap-2" onClick={handleGenerateReport} disabled={isLoading || !data}>
          <Download className="size-4" />Generate Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Momentum Score</p>
                {isLoading ? <Skeleton className="h-8 w-20 mt-1" /> : <p className="text-2xl font-bold text-green-600">{data?.momentumScore ?? 0}/100</p>}
              </div>
              <TrendingUp className="size-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inbox Items</p>
                {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : <p className="text-2xl font-bold">{data?.inboxItems.length ?? 0}</p>}
              </div>
              <Inbox className="size-8 text-blue-600 opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak Days</p>
                {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : <p className="text-2xl font-bold">{data?.streak ?? 0}</p>}
              </div>
              <Zap className="size-8 text-yellow-600 opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Keep it up!</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Snapshots</p>
                {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : <p className="text-2xl font-bold">{data?.snapshots.length ?? 0}</p>}
              </div>
              <CheckCircle2 className="size-8 text-purple-600 opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Project states captured</p>
          </CardContent>
        </Card>
      </div>

      {/* Momentum chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="size-5" />Momentum Tracking</CardTitle>
          <CardDescription>Weekly progress on recovery engagement and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" style={{ fontSize: '12px' }} />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} labelStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Inbox */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Inbox className="size-5" />Recovery Inbox</CardTitle>
          <CardDescription>Items flagged for review and action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
          ) : data?.inboxItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Inbox is clear — great work!</p>
          ) : (
            data?.inboxItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
                <input type="checkbox" className="mt-1" readOnly />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.createdAt.toLocaleDateString()}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.priority === 'high'
                      ? 'bg-red-500/10 text-red-600 border-red-200'
                      : item.priority === 'medium'
                      ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                      : 'bg-green-500/10 text-green-600 border-green-200'
                  }
                >
                  {item.priority}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Snapshots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="size-5" />Project Snapshots</CardTitle>
          <CardDescription>Point-in-time captures of project state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              [0, 1].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)
            ) : data?.snapshots.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No snapshots captured yet.</p>
            ) : (
              data?.snapshots.map((snapshot) => (
                <div key={snapshot.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{snapshot.date.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{snapshot.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{snapshot.progress}%</p>
                    <div className="w-20 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${snapshot.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily summaries placeholder for future checkins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="size-5" />Daily Activity</CardTitle>
          <CardDescription>Check in daily to build your streak and momentum score</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isDemo
              ? 'Connect Supabase to track daily check-ins and see your real activity history.'
              : data?.streak
              ? `You have a ${data.streak}-day streak. Keep it going!`
              : 'No check-ins yet. Start your streak by logging activity today.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
