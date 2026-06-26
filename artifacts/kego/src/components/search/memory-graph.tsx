import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, FileText, Link2, Archive, Zap, Network } from 'lucide-react'
import { useState } from 'react'

interface MemoryNode {
  id: string
  label: string
  type: 'decision' | 'note' | 'resource' | 'milestone' | 'project'
  connections: string[]
  relevance: number
}

const memoryNodes: MemoryNode[] = [
  { id: 'n1', label: 'Framework Choice', type: 'decision', connections: ['n2', 'n5'], relevance: 95 },
  { id: 'n2', label: 'Database Design', type: 'decision', connections: ['n3', 'n4'], relevance: 88 },
  { id: 'n3', label: 'API Architecture', type: 'note', connections: ['n1', 'n6'], relevance: 82 },
  { id: 'n4', label: 'Vercel Analytics', type: 'resource', connections: ['n1'], relevance: 75 },
  { id: 'n5', label: 'Recovery MVP', type: 'milestone', connections: ['n2', 'n6'], relevance: 90 },
  { id: 'n6', label: 'KeGo Platform', type: 'project', connections: ['n1', 'n3', 'n5'], relevance: 100 },
]

const getNodeIcon = (type: MemoryNode['type']) => {
  switch (type) {
    case 'decision': return <Lightbulb className="size-4" />
    case 'note': return <FileText className="size-4" />
    case 'resource': return <Link2 className="size-4" />
    case 'milestone': return <Archive className="size-4" />
    case 'project': return <Zap className="size-4" />
  }
}

const getNodeColor = (type: MemoryNode['type']) => {
  switch (type) {
    case 'decision': return 'from-yellow-400 to-yellow-600'
    case 'note': return 'from-blue-400 to-blue-600'
    case 'resource': return 'from-purple-400 to-purple-600'
    case 'milestone': return 'from-green-400 to-green-600'
    case 'project': return 'from-pink-400 to-pink-600'
  }
}

export function MemoryGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const connectedNodes = selectedNode
    ? new Set([selectedNode, ...memoryNodes.find(n => n.id === selectedNode)?.connections || []])
    : new Set<string>()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Network className="size-5" />Memory Graph</CardTitle>
          <CardDescription>Click a node to explore connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-muted/30 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 400">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                </marker>
                {(['decision', 'note', 'resource', 'milestone', 'project'] as const).map(type => (
                  <linearGradient key={type} id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    {type === 'decision' && <><stop offset="0%" stopColor="#eab308" /><stop offset="100%" stopColor="#ca8a04" /></>}
                    {type === 'note' && <><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></>}
                    {type === 'resource' && <><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7c3aed" /></>}
                    {type === 'milestone' && <><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#16a34a" /></>}
                    {type === 'project' && <><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#db2777" /></>}
                  </linearGradient>
                ))}
              </defs>

              {memoryNodes.map((node) =>
                node.connections.map((connId) => {
                  const toNode = memoryNodes.find(n => n.id === connId)
                  if (!toNode) return null
                  const fromIndex = memoryNodes.indexOf(node)
                  const toIndex = memoryNodes.indexOf(toNode)
                  const x1 = ((fromIndex % 3) * 160 + 80)
                  const y1 = (Math.floor(fromIndex / 3) * 180 + 80)
                  const x2 = ((toIndex % 3) * 160 + 80)
                  const y2 = (Math.floor(toIndex / 3) * 180 + 80)
                  const isSelected = selectedNode === node.id || selectedNode === connId || connectedNodes.has(node.id) || connectedNodes.has(connId)
                  return (
                    <line key={`${node.id}-${connId}`} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isSelected ? '#3b82f6' : '#666'} strokeWidth={isSelected ? 2 : 1}
                      markerEnd="url(#arrowhead)" opacity={selectedNode && !isSelected ? 0.2 : 0.5} />
                  )
                })
              )}

              {memoryNodes.map((node, i) => {
                const x = (i % 3) * 160 + 80
                const y = Math.floor(i / 3) * 180 + 80
                const isSelected = selectedNode === node.id
                const isConnected = connectedNodes.has(node.id)
                return (
                  <g key={node.id} onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    className="cursor-pointer" opacity={selectedNode && !isSelected && !isConnected ? 0.3 : 1}>
                    <circle cx={x} cy={y} r={isSelected ? 30 : isConnected ? 24 : 18}
                      fill={`url(#gradient-${node.type})`} opacity={isSelected || isConnected ? 1 : 0.8} />
                    {isSelected && <circle cx={x} cy={y} r={35} fill="none" stroke={`url(#gradient-${node.type})`} strokeWidth="2" opacity="0.3" />}
                    <text x={x} y={y + 4} textAnchor="middle" className="pointer-events-none" style={{ fontSize: '14px' }}>
                      {node.type === 'decision' ? '💡' : node.type === 'note' ? '📝' : node.type === 'resource' ? '🔗' : node.type === 'milestone' ? '🎯' : '⚡'}
                    </text>
                    <text x={x} y={y + 42} textAnchor="middle" className="pointer-events-none fill-foreground" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {node.label.substring(0, 14)}{node.label.length > 14 ? '...' : ''}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

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

      {selectedNode && (() => {
        const node = memoryNodes.find(n => n.id === selectedNode)
        if (!node) return null
        return (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader><CardTitle className="text-lg">Memory Node Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs text-muted-foreground mb-1">Node Label</p><p className="font-semibold">{node.label}</p></div>
              <div className="flex gap-2">
                <Badge className="gap-2">{getNodeIcon(node.type)}{node.type}</Badge>
                <Badge variant="outline">{node.relevance}% relevance</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Connected to</p>
                <div className="flex flex-wrap gap-2">
                  {node.connections.map((connId) => {
                    const connNode = memoryNodes.find(n => n.id === connId)
                    return connNode && <Badge key={connId} variant="secondary">{connNode.label}</Badge>
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })()}
    </div>
  )
}
