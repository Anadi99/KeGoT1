import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Bell, Shield, Palette, Zap } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [appearance, setAppearance] = useState<'System' | 'Light' | 'Dark'>('Dark')
  const [notificationSettings, setNotificationSettings] = useState({
    projectAtRiskAlerts: true,
    weeklyContextDigest: true,
    resumeReminders: true,
  })

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="size-5" />Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input defaultValue="Alex Founder" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="alex@example.com" type="email" />
              </div>
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="size-5" />Notifications</CardTitle>
            <CardDescription>When should we remind you to update your projects?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'projectAtRiskAlerts' as const, label: 'Project at-risk alerts', description: 'Notify when projects need attention' },
              { key: 'weeklyContextDigest' as const, label: 'Weekly context digest', description: 'Summary of your project states' },
              { key: 'resumeReminders' as const, label: 'Resume reminders', description: 'Reminders to update context before pausing' },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key]}
                  onChange={() => setNotificationSettings((current) => ({ ...current, [item.key]: !current[item.key] }))}
                  className="size-4"
                />
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="size-5" />Appearance</CardTitle>
            <CardDescription>Customize your interface</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {['System', 'Light', 'Dark'].map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setAppearance(theme as 'System' | 'Light' | 'Dark')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${theme === appearance ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
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
