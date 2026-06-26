import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, Inbox, CheckCircle2, Clock, Zap, Download } from 'lucide-react'

const momentumData = [
  { date: 'Jun 19', score: 65, activities: 2 },
  { date: 'Jun 20', score: 72, activities: 3 },
  { date: 'Jun 21', score: 58, activities: 1 },
  { date: 'Jun 22', score: 78, activities: 4 },
  { date: 'Jun 23', score: 85, activities: 5 },
  { date: 'Jun 24', score: 88, activities: 5 },
  { date: 'Jun 25', score: 92, activities: 6 },
]

const dailySummaries = [
  { date: 'Today (Jun 26)', itemsReviewed: 12, decisionsLogged: 2, timeSpent: 45, focusArea: 'Architecture Design' },
  { date: 'Jun 25', itemsReviewed: 10, decisionsLogged: 3, timeSpent: 52, focusArea: 'Feature Planning' },
  { date: 'Jun 24', itemsReviewed: 15, decisionsLogged: 2, timeSpent: 38, focusArea: 'Documentation' },
]

export function RecoveryHub() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold">Recovery Hub</h2>
          <p className="text-muted-foreground mt-1">Dashboard for tracking recovery progress and momentum</p>
        </div>
        <Button className="gap-2"><Download className="size-4" />Generate Report</Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Momentum Score</p><p className="text-2xl font-bold text-green-600">92/100</p></div><TrendingUp className="size-8 text-green-600 opacity-20" /></div><p className="text-xs text-muted-foreground mt-2">↑ 7 points from yesterday</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Inbox Items</p><p className="text-2xl font-bold">3</p></div><Inbox className="size-8 text-blue-600 opacity-20" /></div><p className="text-xs text-muted-foreground mt-2">Awaiting review</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Streak Days</p><p className="text-2xl font-bold">7</p></div><Zap className="size-8 text-yellow-600 opacity-20" /></div><p className="text-xs text-muted-foreground mt-2">Keep it up!</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Snapshots</p><p className="text-2xl font-bold">12</p></div><CheckCircle2 className="size-8 text-purple-600 opacity-20" /></div><p className="text-xs text-muted-foreground mt-2">Project states captured</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="size-5" />Momentum Tracking</CardTitle>
          <CardDescription>Weekly progress on recovery engagement and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={momentumData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" style={{ fontSize: '12px' }} />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} labelStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="size-5" />Daily Summaries</CardTitle>
          <CardDescription>Auto-generated summaries of your daily recovery work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailySummaries.map((summary, i) => (
            <div key={i} className="border border-muted rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-sm">{summary.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">{summary.focusArea}</p>
                </div>
                <Badge variant="outline">{summary.timeSpent} min</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-muted/50"><p className="text-xs text-muted-foreground">Items Reviewed</p><p className="text-sm font-semibold">{summary.itemsReviewed}</p></div>
                <div className="p-2 rounded bg-muted/50"><p className="text-xs text-muted-foreground">Decisions Logged</p><p className="text-sm font-semibold">{summary.decisionsLogged}</p></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Inbox className="size-5" />Recovery Inbox</CardTitle>
          <CardDescription>Items flagged for review and action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: 'Architecture Decision Review', description: 'Review the decision about Next.js migration from docs', priority: 'high', date: '2 hours ago' },
            { title: 'Update Project Timeline', description: 'Milestone progress needs documentation', priority: 'medium', date: '5 hours ago' },
            { title: 'Resource Link Validation', description: 'Check if all archived documentation links are still valid', priority: 'low', date: '1 day ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-muted hover:bg-muted/50 transition-colors">
              <input type="checkbox" className="mt-1" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
              </div>
              <Badge variant="outline" className={item.priority === 'high' ? 'bg-red-500/10 text-red-600 border-red-200' : item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200' : 'bg-green-500/10 text-green-600 border-green-200'}>{item.priority}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="size-5" />Project Snapshots</CardTitle>
          <CardDescription>Point-in-time captures of project state and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Jun 26, 2026 - 14:30', status: 'Architecture finalized', progress: 85 },
              { date: 'Jun 25, 2026 - 11:15', status: 'Feature planning complete', progress: 75 },
              { date: 'Jun 24, 2026 - 09:45', status: 'Initial design phase', progress: 65 },
            ].map((snapshot, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{snapshot.date}</p>
                  <p className="text-xs text-muted-foreground">{snapshot.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{snapshot.progress}%</p>
                  <div className="w-20 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${snapshot.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
