import { AppLayout } from '@/components/layout/app-layout'
import { UniversalSearch } from '@/components/search/universal-search'
import { MemoryGraph } from '@/components/search/memory-graph'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Network } from 'lucide-react'

export default function SearchPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground mt-1">Search across all your project memories</p>
        </div>

        <Tabs defaultValue="search">
          <TabsList>
            <TabsTrigger value="search" className="gap-2">
              <Search className="size-4" />
              Memory Search
            </TabsTrigger>
            <TabsTrigger value="graph" className="gap-2">
              <Network className="size-4" />
              Memory Graph
            </TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="mt-6">
            <UniversalSearch />
          </TabsContent>
          <TabsContent value="graph" className="mt-6">
            <MemoryGraph />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
