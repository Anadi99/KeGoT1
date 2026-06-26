'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { UniversalSearch } from '@/components/search/universal-search'
import { MemoryGraph } from '@/components/search/memory-graph'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Network, Search } from 'lucide-react'

export default function SearchPage() {
  return (
    <AppLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Project Memory Search</h1>
          <p className="text-muted-foreground mt-2">
            Find anything across your project memories with semantic search and memory graph visualization
          </p>
        </div>

        {/* Tabs for Search and Memory Graph */}
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="search" className="gap-2">
              <Search className="size-4" />
              Semantic Search
            </TabsTrigger>
            <TabsTrigger value="graph" className="gap-2">
              <Network className="size-4" />
              Memory Graph
            </TabsTrigger>
          </TabsList>

          {/* Universal Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Across Projects</CardTitle>
                <CardDescription>
                  Search decisions, milestones, resources, and project memories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UniversalSearch />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memory Graph Tab */}
          <TabsContent value="graph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Memory Graph</CardTitle>
                <CardDescription>
                  Visualize relationships between projects, decisions, milestones, and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <MemoryGraph />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
