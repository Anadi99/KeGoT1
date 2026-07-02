import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSettings, upsertSettings } from '@/lib/services/settings'
import { useDemoMode } from '@/hooks/useDemoMode'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { User, Bell, Shield, Palette, Zap, Database } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

// Demo / fallback user id
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const isDemo = useDemoMode()

  const { data: dbSettings } = useQuery({
    queryKey: ['settings', DEMO_USER_ID],
    queryFn: () => fetchSettings(DEMO_USER_ID),
    enabled: !isDemo,
  })

  const [name, setName] = useState('Alex Founder')
  const [email, setEmail] = useState('alex@example.com')
  const [appearance, setAppearance] = useState<'system' | 'light' | 'dark'>('dark')
  const [notifications, setNotifications] = useState({
    projectAtRiskAlerts: true,
    weeklyContextDigest: true,
    resumeReminders: true,
  })

  // Populate from DB when loaded
  useEffect(() => {
    if (dbSettings) {
      if (dbSettings.display_name) setName(dbSettings.display_name)
      if (dbSettings.email) setEmail(dbSettings.email)
      if (dbSettings.appearance) setAppearance(dbSettings.appearance as typeof appearance)
      if (dbSettings.notifications && typeof dbSettings.notifications === 'object') {
        setNotifications((prev) => ({ ...prev, ...(dbSettings.notifications as typeof notifications) }))
      }
    }
  }, [dbSettings])

  const saveMutation = useMutation({
    mutationFn: (patch: Parameters<typeof upsertSettings>[0]) => upsertSettings(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', DEMO_USER_ID] })
      toast.success('Settings saved')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    saveMutation.mutate({ user_id: DEMO_USER_ID, display_name: name, email })
  }

  function handleNotificationToggle(key: keyof typeof notifications) {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    saveMutation.mutate({ user_id: DEMO_USER_ID, notifications: updated })
  }

  function handleAppearanceChange(theme: typeof appearance) {
    setAppearance(theme)
    saveMutation.mutate({ user_id: DEMO_USER_ID, appearance: theme })
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {isDemo && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
            <Database className="size-4 shrink-0" />
            <span>Settings will not persist — connect Supabase to save preferences across sessions.</span>
          </div>
        )}

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="size-5" />Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="settings-name">Name</Label>
                  <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
              </div>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving…' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="size-5" />Notifications</CardTitle>
            <CardDescription>When should we remind you to update your projects?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              { key: 'projectAtRiskAlerts' as const, label: 'Project at-risk alerts', description: 'Notify when projects need attention' },
              { key: 'weeklyContextDigest' as const, label: 'Weekly context digest', description: 'Summary of your project states' },
              { key: 'resumeReminders' as const, label: 'Resume reminders', description: 'Reminders to update context before pausing' },
            ]).map((item) => (
              <label key={item.key} className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationToggle(item.key)}
                  className="size-4"
                />
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="size-5" />Appearance</CardTitle>
            <CardDescription>Customize your interface</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(['system', 'light', 'dark'] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => handleAppearanceChange(theme)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    theme === appearance
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="size-5" />Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <p className="font-semibold">Free Plan</p>
                <p className="text-sm text-muted-foreground">5 projects, basic recovery</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <Button className="w-full gap-2"><Zap className="size-4" />Upgrade to Pro</Button>
          </CardContent>
        </Card>

        {/* Danger */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><Shield className="size-5" />Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
