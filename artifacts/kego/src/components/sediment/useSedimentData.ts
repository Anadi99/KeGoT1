import { useState, useEffect } from 'react'
import type { SedimentMemory, MemoryType, FragmentWeight } from './sedimentTypes'
import { mockProjects, mockDecisions, mockMilestones, mockVaultEntries, mockTimelineEvents } from '@/lib/mock-data'

function truncateContent(content: string, maxLen: number = 80): string {
  if (content.length <= maxLen) return content
  return content.slice(0, maxLen).trimEnd() + '…'
}

function getWeightForType(type: MemoryType): FragmentWeight {
  switch (type) {
    case 'decision':
    case 'milestone':
      return 'heavy'
    case 'blocker':
    case 'note':
    case 'checkin':
      return 'medium'
    case 'voice':
    case 'screenshot':
    case 'commit':
    case 'file':
      return 'light'
  }
}

function transformVaultCategory(category: string): MemoryType {
  switch (category) {
    case 'decision':
      return 'decision'
    case 'resource':
      return 'note'
    case 'link':
      return 'file'
    case 'note':
      return 'note'
    default:
      return 'note'
  }
}

function transformTimelineType(type: string): MemoryType | null {
  switch (type) {
    case 'decision':
      return 'decision'
    case 'milestone':
      return 'milestone'
    case 'github:commit':
      return 'commit'
    case 'vault:entry':
      return 'note'
    case 'paused':
      return 'checkin'
    case 'resumed':
      return 'checkin'
    default:
      return null
  }
}

interface SupabaseRow {
  id: string
  memory_type: string
  content: string
  created_at: string
}

interface SupabaseTaskRow {
  title: string
  status: string
  completed_at: string
}

export function useSedimentData(projectId: string): {
  memories: SedimentMemory[]
  isLoading: boolean
  error: Error | null
} {
  const [memories, setMemories] = useState<SedimentMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        let fetchedMemories: SedimentMemory[] = []

        // Attempt Supabase fetch
        try {
          const supabaseModule = await import('@/lib/supabase/client')
          const supabase = await supabaseModule.createClient()

          if (supabase) {
            const { data, error: dbError } = await supabase
              .from('project_memory')
              .select('id, memory_type, content, created_at')
              .eq('project_id', projectId)
              .order('created_at', { ascending: false })
              .limit(12) as { data: SupabaseRow[] | null; error: { message: string } | null }

            if (!dbError && data && data.length > 0) {
              fetchedMemories = data.map((row) => ({
                id: row.id,
                type: row.memory_type as MemoryType,
                content: truncateContent(row.content),
                createdAt: new Date(row.created_at),
                weight: getWeightForType(row.memory_type as MemoryType),
              }))
            }

            // Supplement with completed tasks if fewer than 3 memories
            if (fetchedMemories.length < 3) {
              const { data: tasks } = await supabase
                .from('tasks')
                .select('title, status, completed_at')
                .eq('project_id', projectId)
                .eq('status', 'done')
                .order('completed_at', { ascending: false })
                .limit(4) as { data: SupabaseTaskRow[] | null; error: { message: string } | null }

              if (tasks && tasks.length > 0) {
                const taskMemories: SedimentMemory[] = tasks.map((task, idx) => ({
                  id: `task-${idx}`,
                  type: 'checkin' as MemoryType,
                  content: truncateContent(task.title),
                  createdAt: new Date(task.completed_at),
                  weight: 'medium' as FragmentWeight,
                }))
                fetchedMemories = [...fetchedMemories, ...taskMemories]
              }
            }
          }
        } catch {
          // Supabase not available — fall through to mock data
        }

        // Fallback to mock data if Supabase didn't yield results
        if (fetchedMemories.length === 0) {
          fetchedMemories = buildMockMemories(projectId)
        }

        if (!cancelled) {
          setMemories(fetchedMemories)
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch sediment data'))
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [projectId])

  return { memories, isLoading, error }
}

function buildMockMemories(projectId: string): SedimentMemory[] {
  const memories: SedimentMemory[] = []

  // From decisions
  const projectDecisions = mockDecisions.filter(d => d.projectId === projectId)
  for (const d of projectDecisions) {
    memories.push({
      id: d.id,
      type: 'decision',
      content: truncateContent(d.title),
      createdAt: d.madeAt,
      weight: 'heavy',
    })
  }

  // From milestones
  const projectMilestones = mockMilestones.filter(m => m.projectId === projectId)
  for (const m of projectMilestones) {
    memories.push({
      id: m.id,
      type: 'milestone',
      content: truncateContent(m.title),
      createdAt: m.completedAt || m.dueDate || new Date(),
      weight: 'heavy',
    })
  }

  // From vault entries
  const projectVault = mockVaultEntries.filter(v => v.projectId === projectId)
  for (const v of projectVault) {
    memories.push({
      id: v.id,
      type: transformVaultCategory(v.category),
      content: truncateContent(v.content),
      createdAt: v.createdAt,
      weight: getWeightForType(transformVaultCategory(v.category)),
    })
  }

  // From timeline events
  const projectTimeline = mockTimelineEvents.filter(e => e.projectId === projectId)
  for (const e of projectTimeline) {
    const memType = transformTimelineType(e.type)
    if (memType) {
      memories.push({
        id: e.id,
        type: memType,
        content: truncateContent(e.title),
        createdAt: e.timestamp,
        weight: getWeightForType(memType),
      })
    }
  }

  // Sort by date descending and limit to 12
  memories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return memories.slice(0, 12)
}