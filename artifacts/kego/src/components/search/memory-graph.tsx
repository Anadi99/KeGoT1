import { useQuery } from '@tanstack/react-query'
import { fetchGraphNodes } from '@/lib/services/search'
import type { GraphNode } from '@/lib/services/search'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Lightbulb, FileText, Link2, Archive, Zap, Network } from 'lucide-react'
import { useState } from 'react'

function getNodeIcon(type: GraphNode['type']) {
  switch (type) {
    case 'decision': return <Lightbulb className="size-4" />
    case 'note': return <FileText className="size-4" />
    case 'resource': return <Link2 className="size-4" />
    case 'milestone': return <Archive className="size-4" />
    case 'project': return <Zap className="size-4" />
  }
}

function getNodeColor(type: GraphNode['type']) {
  switch (type) {
    case 'decision': return 'from-yellow-400 to-yellow-600'
    case 'note': return 'from-blue-400 to-blue-600'
    case 'resource': return 'from-purple-400 to-purple-600'
    case 'milestone': return 'from-green-400 to-green-600'
    case 'project': return 'from-pink-400 to-pink-600'
  }
}

function getNodeEmoji(type: GraphNode['type']) {
  switch (type) {
    case 'decision': return '💡'
    case 'note': return '📝'
    case 'resource': return '🔗'
    case 'milestone': return '🎯'
    case 'project': return '⚡'
  }
}

export function MemoryGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['graph'],
    queryFn: fetchGraphNodes,
    staleTime: 60_000,
  })

  const nodes = data?.nodes ?? []
  const edges = data?.edges ?? []

  // Paginate: show up to 50 nodes
  const visibleNodes = nodes.slice(0, 50)

  const connectedNodeIds = selectedNodeId
    ? new Set([
        selectedNodeId,
        ...edges
          .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
          .flatMap((e) => [e.source, e.target]),
      ])
    : new Set<string>()

  const selectedNode = selectedNodeId ? visibleNodes.find((n) => n.id === selectedNodeId) : null
  const connectedNodes = selectedNode
    ? edges
        .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
        .map((e) => (e.source === selectedNodeId ? e.target : e.source))
        .map((id) => visibleNodes.find((n) => n.id === id))
        .filter(Boolean) as GraphNode[]
    : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="size-5" />Memory Graph
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Loading…' : `${visibleNodes.length} nodes, ${edges.length} connections — click a node to explore`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[400px] w-full rounded-lg" />
          ) : visibleNodes.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
              No memory nodes yet. Add decisions, vault entries, or milestones to your projects.
            </div>
          ) : (
            <div className="relative bg-muted/30 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <svg width="100%" height="100%" viewBox="0 0 500 400">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                  </marker>
                  {(['decision', 'note', 'resource', 'milestone', 'project'] as const).map((type) => (
                    <linearGradient key={type} id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      {type === 'decision' && <><stop offset="0%" stopColor="#eab308" /><stop offset="100%" stopColor="#ca8a04" /></>}
                      {type === 'note' && <><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></>}
                      {type === 'resource' && <><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7c3aed" /></>}
                      {type === 'milestone' && <><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#16a34a" /></>}
                      {type === 'project' && <><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#db2777" /></>}
                    </linearGradient>
                  ))}
                </defs>

                {/* Edges */}
                {edges.map((edge) => {
                  const fromIdx = visibleNodes.findIndex((n) => n.id === edge.source)
                  const toIdx = visibleNodes.findIndex((n) => n.id === edge.target)
                  if (fromIdx < 0 || toIdx < 0) return null
                  const cols = Math.min(visibleNodes.length, 5)
                  const x1 = (fromIdx % cols) * (500 / cols) + 50
                  const y1 = Math.floor(fromIdx / cols) * 120 + 60
                  const x2 = (toIdx % cols) * (500 / cols) + 50
                  const y2 = Math.floor(toIdx / cols) * 120 + 60
                  const isHighlighted =
                    !selectedNodeId ||
                    connectedNodeIds.has(edge.source) || connectedNodeIds.has(edge.target)
                  return (
                    <line
                      key={`${edge.source}-${edge.target}`}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isHighlighted ? '#3b82f6' : '#555'}
                      strokeWidth={isHighlighted ? 1.5 : 0.8}
                      markerEnd="url(#arrowhead)"
                      opacity={selectedNodeId && !isHighlighted ? 0.15 : 0.5}
                    />
                  )
                })}

                {/* Nodes */}
                {visibleNodes.map((node, i) => {
                  const cols = Math.min(visibleNodes.length, 5)
                  const x = (i % cols) * (500 / cols) + 50
                  const y = Math.floor(i / cols) * 120 + 60
                  const isSelected = selectedNodeId === node.id
                  const isConnected = connectedNodeIds.has(node.id)
                  const r = isSelected ? 28 : isConnected ? 22 : 16
                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                      className="cursor-pointer"
                      opacity={selectedNodeId && !isSelected && !isConnected ? 0.3 : 1}
                    >
                      <circle cx={x} cy={y} r={r} fill={`url(#gradient-${node.type})`} />
                      {isSelected && (
                        <circle cx={x} cy={y} r={r + 6} fill="none" stroke={`url(#gradient-${node.type})`} strokeWidth="2" opacity="0.3" />
                      )}
                      <text x={x} y={y + 4} textAnchor="middle" className="pointer-events-none" style={{ fontSize: '13px' }}>
                        {getNodeEmoji(node.type)}
                      </text>
                      <text x={x} y={y + r + 14} textAnchor="middle" className="pointer-events-none fill-foreground" style={{ fontSize: '10px', fontWeight: 600 }}>
                        {node.label.substring(0, 12)}{node.label.length > 12 ? '…' : ''}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          )}

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-muted">
            {(['decision', 'note', 'resource', 'milestone', 'project'] as const).map((type) => (
              <div key={type} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getNodeColor(type)}`} />
                <span className="text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Node detail panel */}
      {selectedNode && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Memory Node Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Label</p>
              <p className="font-semibold">{selectedNode.label}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Project</p>
              <p className="text-sm">{selectedNode.projectName}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className="gap-2">{getNodeIcon(selectedNode.type)}{selectedNode.type}</Badge>
              <Badge variant="outline">{selectedNode.relevance}% relevance</Badge>
            </div>
            {selectedNode.tags.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            {connectedNodes.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Connected to</p>
                <div className="flex flex-wrap gap-2">
                  {connectedNodes.map((n) => (
                    <Badge key={n.id} variant="secondary">{n.label}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
