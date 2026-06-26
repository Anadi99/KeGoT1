import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Lightbulb, FileText, Link2, Archive, Zap, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'

interface SearchResult {
  id: string
  title: string
  content: string
  type: 'decision' | 'note' | 'resource' | 'milestone' | 'project'
  project: string
  date: string
  relevance: number
}

const allResults: SearchResult[] = [
  { id: '1', title: 'Next.js 16 Framework Decision', content: 'Chose Next.js 16 for edge functions, built-in optimizations, and Vercel integration...', type: 'decision', project: 'KeGo Platform', date: '5/11/2026', relevance: 98 },
  { id: '2', title: 'Database Architecture Planning', content: 'PostgreSQL with Drizzle ORM provides type-safe queries and excellent performance...', type: 'decision', project: 'KeGo Platform', date: '5/10/2026', relevance: 92 },
  { id: '3', title: 'Apple Design System Implementation', content: 'Premium component library with gesture support and native transitions...', type: 'note', project: 'KeGo Platform', date: '5/15/2026', relevance: 85 },
  { id: '4', title: 'Vercel Analytics Integration', content: 'Real-time insights on project performance and user engagement metrics...', type: 'resource', project: 'KeGo Platform', date: '5/20/2026', relevance: 78 },
  { id: '5', title: 'Recovery Workspace MVP', content: 'Flagship feature combining decision intelligence with recovery metrics...', type: 'milestone', project: 'KeGo Platform', date: '5/25/2026', relevance: 88 },
  { id: '6', title: 'Cross-Project Search Foundation', content: 'Semantic search capability enabling discovery across all project memories...', type: 'note', project: 'KeGo Platform', date: '6/20/2026', relevance: 95 },
]

export function UniversalSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | SearchResult['type']>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredResults = useMemo(() => {
    return allResults
      .filter((result) => {
        const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) || result.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = selectedType === 'all' || result.type === selectedType
        return matchesQuery && matchesType
      })
      .sort((a, b) => b.relevance - a.relevance)
  }, [searchQuery, selectedType])

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'decision': return <Lightbulb className="size-4" />
      case 'note': return <FileText className="size-4" />
      case 'resource': return <Link2 className="size-4" />
      case 'milestone': return <Archive className="size-4" />
      case 'project': return <Zap className="size-4" />
    }
  }

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'decision': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'note': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'resource': return 'bg-purple-500/10 text-purple-700 border-purple-200'
      case 'milestone': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'project': return 'bg-pink-500/10 text-pink-700 border-pink-200'
    }
  }

  const typeCounts = {
    all: allResults.length,
    decision: allResults.filter((r) => r.type === 'decision').length,
    note: allResults.filter((r) => r.type === 'note').length,
    resource: allResults.filter((r) => r.type === 'resource').length,
    milestone: allResults.filter((r) => r.type === 'milestone').length,
    project: allResults.filter((r) => r.type === 'project').length,
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search decisions, notes, resources, milestones..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 text-base" />
      </div>

      <div className="flex gap-2">
        <Button variant={showFilters ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="size-4" />Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['all', 'decision', 'note', 'resource', 'milestone', 'project'] as const).map((type) => (
                <button key={type} onClick={() => setSelectedType(type)} className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                  {type !== 'all' && getTypeIcon(type)}
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)} ({typeCounts[type]})</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredResults.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-1">No results found</h3>
            <p className="text-sm text-muted-foreground">{searchQuery ? 'Try adjusting your search terms' : 'Search across all your project memories'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-muted hover:border-l-primary">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(result.type)} variant="outline">
                        <span className="mr-1">{getTypeIcon(result.type)}</span>
                        {result.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{result.project}</span>
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">{result.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.content}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant="secondary" className="text-xs">{result.relevance}%</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{result.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
