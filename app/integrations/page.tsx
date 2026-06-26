'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitHubConnector } from '@/components/integrations/github-connector'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Calendar, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'

export default function IntegrationsPage() {
  return (
    <AppLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect external tools to enrich your project memory with automatic syncing
          </p>
        </div>

        {/* Integrations Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gray-900">
                  <div className="text-white">Gh</div>
                </div>
                <div>
                  <CardTitle className="text-base">GitHub</CardTitle>
                  <CardDescription>Sync commits, PRs, releases</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Connected</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600">
                  <Mail className="size-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Email</CardTitle>
                  <CardDescription>Forward emails to project inbox</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Not Connected</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Calendar className="size-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Calendar</CardTitle>
                  <CardDescription>Sync meetings and deadlines</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Not Connected</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-600">
                  <ExternalLink className="size-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Browser Extension</CardTitle>
                  <CardDescription>Save web resources instantly</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Not Installed</Badge>
            </CardContent>
          </Card>
        </div>

        {/* GitHub Integration Details */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Integrations</CardTitle>
            <CardDescription>Manage your active integration connections</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="github" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>

              <TabsContent value="github" className="mt-4 space-y-4">
                <GitHubConnector
                  projectId="1"
                  isConnected={true}
                  repoUrl="https://github.com/example/project"
                  lastSync={new Date(Date.now() - 2 * 60 * 60 * 1000)}
                  onDisconnect={() => console.log('Disconnected from GitHub')}
                />

                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">Add another GitHub repository</p>
                      <Button variant="outline" className="gap-2">
                        <Plus className="size-4" />
                        Add Repository
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="mt-4">
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-sm font-medium">Get your project email address</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Forward project-related emails to automatically save them to your vault
                        </p>
                      </div>
                      <Button className="gap-2">
                        <Mail className="size-4" />
                        Enable Email Forwarding
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="mt-4">
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-sm font-medium">Connect your calendar</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sync meetings and deadlines to your project timeline
                        </p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" className="gap-2">
                          <Calendar className="size-4" />
                          Google Calendar
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Calendar className="size-4" />
                          Outlook
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>Import projects from other platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Notion', 'Trello', 'Asana', 'ClickUp', 'GitHub', 'Markdown'].map((platform) => (
                <Button key={platform} variant="outline" className="h-24 flex-col gap-2">
                  <div className="text-2xl">📄</div>
                  <span className="text-sm">{platform}</span>
                </Button>
              ))}
            </div>
            <Link href="/import" className="inline-block mt-4">
              <Button className="gap-2">
                <Plus className="size-4" />
                Start Import
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Auto-sync enabled</p>
                <p className="text-sm text-muted-foreground">Automatically sync integrations hourly</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium text-sm">Include in search</p>
                <p className="text-sm text-muted-foreground">Include integration data in semantic search</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
