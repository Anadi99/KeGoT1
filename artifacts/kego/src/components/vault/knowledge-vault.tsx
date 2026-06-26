import type { VaultEntry } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Link2, Lightbulb, Archive, Search, Plus } from 'lucide-react'
import { useState } from 'react'

interface KnowledgeVaultProps {
  entries: VaultEntry[]
  projectId: string
}

export function KnowledgeVault({ entries, projectId: _projectId }: KnowledgeVaultProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | VaultEntry['category']>('all')

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: VaultEntry['category']) => {
    switch (category) {
      case 'decision': return <Lightbulb className="size-4" />
      case 'resource': return <Link2 className="size-4" />
      case 'link': return <Archive className="size-4" />
      case 'note': return <BookOpen className="size-4" />
    }
  }

  const getCategoryColor = (category: VaultEntry['category']) => {
    switch (category) {
      case 'decision': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'resource': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'link': return 'bg-purple-500/10 text-purple-700 border-purple-200'
      case 'note': return 'bg-green-500/10 text-green-700 border-green-200'
    }
  }

  const categoryStats = {
    decision: entries.filter((e) => e.category === 'decision').length,
    resource: entries.filter((e) => e.category === 'resource').length,
    link: entries.filter((e) => e.category === 'link').length,
    note: entries.filter((e) => e.category === 'note').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold">Knowledge Vault</h2>
          <p className="text-muted-foreground mt-1">Archive of project memories, decisions, and resources</p>
        </div>
        <Button className="gap-2"><Plus className="size-4" />Add Entry</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search vault..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" onValueChange={(val) => setSelectedCategory(val as 'all' | VaultEntry['category'])}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All <Badge variant="secondary" className="ml-2">{entries.length}</Badge></TabsTrigger>
          <TabsTrigger value="decision">Decisions <Badge variant="secondary" className="ml-2">{categoryStats.decision}</Badge></TabsTrigger>
          <TabsTrigger value="resource">Resources <Badge variant="secondary" className="ml-2">{categoryStats.resource}</Badge></TabsTrigger>
          <TabsTrigger value="link">Links <Badge variant="secondary" className="ml-2">{categoryStats.link}</Badge></TabsTrigger>
          <TabsTrigger value="note">Notes <Badge variant="secondary" className="ml-2">{categoryStats.note}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory === 'all' ? 'all' : selectedCategory} className="space-y-4 mt-6">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Archive className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-lg mb-1">No entries found</h3>
                <p className="text-sm text-muted-foreground">{searchQuery ? 'Try adjusting your search query' : 'Start building your knowledge vault'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={getCategoryColor(entry.category)} variant="outline">
                        <span className="mr-1">{getCategoryIcon(entry.category)}</span>
                        {entry.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">{entry.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-foreground/70 line-clamp-2">{entry.content}</p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag, i) => (<Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>))}
                        {entry.tags.length > 3 && <Badge variant="secondary" className="text-xs">+{entry.tags.length - 3}</Badge>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader><CardTitle className="text-lg">Vault Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><p className="text-xs text-muted-foreground mb-1">Total Entries</p><p className="text-2xl font-bold">{entries.length}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Decisions</p><p className="text-2xl font-bold text-yellow-600">{categoryStats.decision}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">Resources</p><p className="text-2xl font-bold text-blue-600">{categoryStats.resource}</p></div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm font-semibold">
                {entries.length > 0 ? new Date(Math.max(...entries.map((e) => new Date(e.updatedAt).getTime()))).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
