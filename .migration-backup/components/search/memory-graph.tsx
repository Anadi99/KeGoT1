'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  {
    id: 'kego-platform',
    label: 'KeGo Platform',
    type: 'project',
    connections: ['next-js-decision', 'db-architecture', 'design-system'],
    relevance: 100,
  },
  {
    id: 'next-js-decision',
    label: 'Next.js 16 Choice',
    type: 'decision',
    connections: ['kego-platform', 'db-architecture', 'performance-notes'],
    relevance: 95,
  },
  {
    id: 'db-architecture',
    label: 'PostgreSQL + Drizzle',
    type: 'decision',
    connections: ['next-js-decision', 'performance-notes', 'kego-platform'],
    relevance: 88,
  },
  {
    id: 'design-system',
    label: 'Apple Design System',
    type: 'note',
    connections: ['kego-platform', 'ui-resources'],
    relevance: 82,
  },
  {
    id: 'ui-resources',
    label: 'Shadcn UI Components',
    type: 'resource',
    connections: ['design-system', 'component-notes'],
    relevance: 75,
  },
  {
    id: 'component-notes',
    label: 'Component Architecture',
    type: 'note',
    connections: ['ui-resources', 'design-system'],
    relevance: 70,
  },
  {
    id: 'performance-notes',
    label: 'Performance Optimization',
    type: 'note',
    connections: ['next-js-decision', 'db-architecture'],
    relevance: 80,
  },
  {
    id: 'recovery-workspace',
    label: 'Recovery Workspace MVP',
    type: 'milestone',
    connections: ['kego-platform', 'design-system'],
    relevance: 85,
  },
]

export function MemoryGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [focusMode, setFocusMode] = useState(false)

  const getNodeIcon = (type: MemoryNode['type']) => {
    switch (type) {
      case 'decision':
        return <Lightbulb className="size-3" />
      case 'note':
        return <FileText className="size-3" />
      case 'resource':
        return <Link2 className="size-3" />
      case 'milestone':
        return <Archive className="size-3" />
      case 'project':
        return <Zap className="size-3" />
    }
  }

  const getNodeColor = (type: MemoryNode['type']) => {
    switch (type) {
      case 'decision':
        return 'from-yellow-500 to-yellow-600'
      case 'note':
        return 'from-blue-500 to-blue-600'
      case 'resource':
        return 'from-purple-500 to-purple-600'
      case 'milestone':
        return 'from-green-500 to-green-600'
      case 'project':
        return 'from-pink-500 to-pink-600'
    }
  }

  const connectedNodes = selectedNode
    ? new Set(
        memoryNodes
          .find((n) => n.id === selectedNode)
          ?.connections.flatMap((id) => [id, ...memoryNodes.find((n) => n.id === id)?.connections || []])
      )
    : new Set()

  const visibleNodes = focusMode && selectedNode ? Array.from(connectedNodes).concat(selectedNode) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold">Memory Graph</h2>
          <p className="text-muted-foreground mt-1">Visualize connections between project memories</p>
        </div>
        {selectedNode && (
          <Button
            variant={focusMode ? 'default' : 'outline'}
            onClick={() => setFocusMode(!focusMode)}
            className="gap-2"
          >
            <Network className="size-4" />
            {focusMode ? 'Show All' : 'Focus View'}
          </Button>
        )}
      </div>

      {/* Graph Visualization */}
      <Card className="relative">
        <CardContent className="pt-6">
          {/* SVG Graph Canvas */}
          <div className="w-full bg-muted/30 rounded-lg p-6" style={{ minHeight: '500px' }}>
            <svg width="100%" height="500" className="w-full">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#666" />
                </marker>
              </defs>

              {/* Connection Lines */}
              {memoryNodes.map((node) =>
                node.connections.map((connId) => {
                  const fromNode = memoryNodes.find((n) => n.id === node.id)
                  const toNode = memoryNodes.find((n) => n.id === connId)
                  if (!fromNode || !toNode) return null

                  const fromIndex = memoryNodes.indexOf(fromNode)
                  const toIndex = memoryNodes.indexOf(toNode)
                  const x1 = ((fromIndex % 4) * 120 + 80) % 400 + 50
                  const y1 = ((Math.floor(fromIndex / 4) * 150) % 450) + 50
                  const x2 = ((toIndex % 4) * 120 + 80) % 400 + 50
                  const y2 = ((Math.floor(toIndex / 4) * 150) % 450) + 50

                  const isSelected =
                    selectedNode === node.id ||
                    selectedNode === connId ||
                    connectedNodes.has(node.id) ||
                    connectedNodes.has(connId)

                  return (
                    <line
                      key={`${node.id}-${connId}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isSelected ? '#3b82f6' : '#666'}
                      strokeWidth={isSelected ? 2 : 1}
                      markerEnd="url(#arrowhead)"
                      opacity={selectedNode && !isSelected ? 0.2 : 0.5}
                      className="transition-all"
                    />
                  )
                })
              )}

              {/* Nodes */}
              {(visibleNodes
                ? memoryNodes.filter((n) => visibleNodes.includes(n.id))
                : memoryNodes
              ).map((node, i) => {
                const x = ((i % 4) * 120 + 80) % 400 + 50
                const y = ((Math.floor(i / 4) * 150) % 450) + 50
                const isSelected = selectedNode === node.id
                const isConnected = connectedNodes.has(node.id)
                const shouldShow = !focusMode || !selectedNode || visibleNodes?.includes(node.id)

                return (
                  shouldShow && (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(isSelected ? null : node.id)}
                      className="cursor-pointer transition-all"
                      opacity={selectedNode && !isSelected && !isConnected ? 0.3 : 1}
                    >
                      {/* Node circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 30 : isConnected ? 24 : 18}
                        fill={`url(#gradient-${node.type})`}
                        opacity={isSelected || isConnected ? 1 : 0.8}
                        className="hover:opacity-100 transition-opacity"
                      />

                      {/* Glow effect for selected */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r={35}
                          fill="none"
                          stroke={`url(#gradient-${node.type})`}
                          strokeWidth="2"
                          opacity="0.3"
                          className="animate-pulse"
                        />
                      )}

                      {/* Icon */}
                      <text x={x} y={y + 1} textAnchor="middle" className="pointer-events-none">
                        {node.type === 'decision' && '💡'}
                        {node.type === 'note' && '📝'}
                        {node.type === 'resource' && '🔗'}
                        {node.type === 'milestone' && '🎯'}
                        {node.type === 'project' && '⚡'}
                      </text>

                      {/* Label */}
                      <text
                        x={x}
                        y={y + 35}
                        textAnchor="middle"
                        className="text-xs fill-foreground font-semibold pointer-events-none"
                        style={{ fontSize: '11px' }}
                      >
                        {node.label.substring(0, 12)}
                        {node.label.length > 12 ? '...' : ''}
                      </text>
                    </g>
                  )
                )
              })}

              {/* Gradients */}
              <defs>
                <linearGradient id="gradient-decision" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
                <linearGradient id="gradient-note" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="gradient-resource" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="gradient-milestone" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="gradient-project" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-4 border-t border-muted">
            {(['decision', 'note', 'resource', 'milestone', 'project'] as const).map((type) => (
              <div key={type} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getNodeColor(type)}`} />
                <span className="text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Node Details */}
      {selectedNode && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Memory Node Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const node = memoryNodes.find((n) => n.id === selectedNode)
              if (!node) return null

              return (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Node Label</p>
                    <p className="font-semibold">{node.label}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="gap-2">
                      {getNodeIcon(node.type)}
                      {node.type}
                    </Badge>
                    <Badge variant="outline">{node.relevance}% relevance</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Connected to</p>
                    <div className="flex flex-wrap gap-2">
                      {node.connections.map((connId) => {
                        const connNode = memoryNodes.find((n) => n.id === connId)
                        return (
                          connNode && (
                            <Badge key={connId} variant="secondary">
                              {connNode.label}
                            </Badge>
                          )
                        )
                      })}
                    </div>
                  </div>
                </>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
