import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Moon, FileJson, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your KeGo preferences</p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="size-5" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                disabled
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                disabled
              />
            </div>
            <Button variant="outline" disabled>
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Theme Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="size-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how KeGo looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Theme</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled
                >
                  Light
                </Button>
                <Button
                  className="flex-1"
                  disabled
                >
                  Dark (Active)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Preferences</CardTitle>
            <CardDescription>Customize recovery behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Response Tone</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm" disabled>
                <option>Concise</option>
                <option>Detailed</option>
              </select>
              <p className="text-xs text-muted-foreground">How detailed AI summaries should be</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Auto-populate workspace</p>
                <p className="text-xs text-muted-foreground">Generate context automatically</p>
              </div>
              <input
                type="checkbox"
                className="rounded"
                disabled
                defaultChecked
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="size-5" />
              Data
            </CardTitle>
            <CardDescription>Manage your project data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Export your projects and memory vaults as JSON
            </p>
            <Button variant="outline" disabled>
              Export All Data
            </Button>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About KeGo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <Badge variant="secondary">0.1.0</Badge>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              KeGo is a project memory platform that helps you resume abandoned projects with intelligent context recovery.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
