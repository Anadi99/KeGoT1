import { useQuery } from '@tanstack/react-query'
import { universalSearch, groupByType } from '@/lib/services/search'
import type { SearchResult } from '@/lib/services/search'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Lightbulb, FileText, Link2, Archive, Zap, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'

function getTypeIcon(type: SearchResult['type']) {
  switch (type) {
    case 'decision': return <Lightbulb className="size-4" />
    case 'note': return <FileText className="size-4" />
    case 'resource': return <Link2 className="size-4" />
    case 'milestone': return <Archive className="size-4" />
    case 'project': return <Zap className="size-4" />
  }
}

function getTypeColor(type: SearchResult['type']) {
  switch (type) {
    case 'decision': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
    case 'note': return 'bg-blue-500/10 text-blue-700 border-blue-200'
    case 'resource': return 'bg-purple-500/10 text-purple-700 border-purple-200'
    case 'milestone': return 'bg-green-500/10 text-green-700 border-green-200'
    case 'project': return 'bg-pink-500/10 text-pink-700 border-pink-200'
  }
}

export function UniversalSearch() {
  const [, navigate] = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | SearchResult['type']>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Debounce: re-run query when searchQuery settles (React Query refetches on key change)
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => universalSearch(searchQuery),
    staleTime: 30_000,
  })

  const filteredResults = useMemo(() => {
    if (selectedType === 'all') return results
    return results.filter((r) => r.type === selectedType)
  }, [results, selectedType])

  const groups = groupByType(results)

  const typeCounts = {
    all: results.length,
    decision: groups['decision']?.length ?? 0,
    note: groups['note']?.length ?? 0,
    resource: groups['resource']?.length ?? 0,
    milestone: groups['milestone']?.length ?? 0,
    project: groups['project']?.length ?? 0,
  }

  function handleResultClick(result: SearchResult) {
    if (result.projectId) {
      // Navigate to relevant page based on type
      if (result.type === 'milestone') {
        navigate(`/projects/${result.projectId}/recovery`)
      } else if (result.type === 'resource' || result.type === 'note' || result.type === 'decision') {
        navigate(`/projects/${result.projectId}/vault`)
      } else {
        navigate(`/projects/${result.projectId}/recovery`)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search decisions, notes, resources, milestones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="size-4" />Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['all', 'decision', 'note', 'resource', 'milestone', 'project'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {type !== 'all' && getTypeIcon(type)}
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)} ({typeCounts[type]})</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : filteredResults.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-1">No results found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms' : 'Search across all your project memories'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((result) => (
            <Card
              key={result.id}
              className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-muted hover:border-l-primary"
              onClick={() => handleResultClick(result)}
            >
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
