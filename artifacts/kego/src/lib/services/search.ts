import { getClient } from '../supabase/client'
import type { VaultEntryRow, DecisionRow, MilestoneRow } from '../supabase/database.types'

// ── Public types ─────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string
  title: string
  content: string
  type: 'decision' | 'note' | 'resource' | 'milestone' | 'project'
  project: string
  projectId: string
  date: string
  relevance: number
}

export interface GraphNode {
  id: string
  label: string
  type: 'decision' | 'note' | 'resource' | 'milestone' | 'project'
  projectId: string
  projectName: string
  tags: string[]
  relevance: number
}

export interface GraphEdge {
  source: string
  target: string
  reason: 'shared-tag'
}

// ── Static demo fallback data ─────────────────────────────────────────────────

const demoResults: SearchResult[] = [
  { id: '1', title: 'Next.js 16 Framework Decision', content: 'Chose Next.js 16 for edge functions, built-in optimizations, and Vercel integration...', type: 'decision', project: 'FounderOS Landing Page', projectId: '1', date: new Date(Date.now() - 10 * 86400000).toLocaleDateString(), relevance: 98 },
  { id: '2', title: 'Brand Colors', content: 'Primary: #3B82F6 (Blue), Secondary: #10B981 (Green), Neutral: #6B7280 (Gray)', type: 'note', project: 'FounderOS Landing Page', projectId: '1', date: new Date(Date.now() - 35 * 86400000).toLocaleDateString(), relevance: 85 },
  { id: '3', title: 'Marketing Documentation', content: 'https://docs.google.com/document/d/marketing-brief', type: 'resource', project: 'FounderOS Landing Page', projectId: '1', date: new Date(Date.now() - 20 * 86400000).toLocaleDateString(), relevance: 78 },
  { id: '4', title: 'Design System Complete', content: 'All components designed, documented, and approved', type: 'milestone', project: 'FounderOS Landing Page', projectId: '1', date: new Date(Date.now() - 45 * 86400000).toLocaleDateString(), relevance: 90 },
]

const demoNodes: GraphNode[] = [
  { id: 'd1', label: 'Framework Choice: Next.js 16', type: 'decision', projectId: '1', projectName: 'FounderOS Landing Page', tags: ['frontend', 'saas'], relevance: 95 },
  { id: 'v1', label: 'Brand Colors', type: 'note', projectId: '1', projectName: 'FounderOS Landing Page', tags: ['branding', 'design'], relevance: 80 },
  { id: 'v2', label: 'Logo Guidelines', type: 'note', projectId: '1', projectName: 'FounderOS Landing Page', tags: ['branding', 'guidelines'], relevance: 75 },
  { id: 'm1', label: 'Design System Complete', type: 'milestone', projectId: '1', projectName: 'FounderOS Landing Page', tags: ['design'], relevance: 88 },
]

// ── Pure helpers ──────────────────────────────────────────────────────────────

export function filterResults(results: SearchResult[], query: string): SearchResult[] {
  if (!query.trim()) return results
  const q = query.toLowerCase()
  return results.filter(
    (r) => r.title.toLowerCase().includes(q) || r.content.toLowerCase().includes(q),
  )
}

export function groupByType(
  results: SearchResult[],
): Record<string, SearchResult[]> {
  return results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {})
}

export function sortByDate(results: SearchResult[]): SearchResult[] {
  return [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function buildGraphNodes(
  decisions: Array<{ id: string; title: string; project_id: string; alternatives: string[] }>,
  vaultEntries: Array<{ id: string; title: string; project_id: string; category: string; tags: string[] }>,
  milestones: Array<{ id: string; title: string; project_id: string }>,
  projectMap: Map<string, string>,
): GraphNode[] {
  const nodes: GraphNode[] = []

  for (const d of decisions) {
    nodes.push({
      id: d.id,
      label: d.title,
      type: 'decision',
      projectId: d.project_id,
      projectName: projectMap.get(d.project_id) ?? 'Unknown Project',
      tags: d.alternatives,
      relevance: 80,
    })
  }

  for (const v of vaultEntries) {
    const type: GraphNode['type'] =
      v.category === 'resource' ? 'resource' : 'note'
    nodes.push({
      id: v.id,
      label: v.title,
      type,
      projectId: v.project_id,
      projectName: projectMap.get(v.project_id) ?? 'Unknown Project',
      tags: v.tags,
      relevance: 70,
    })
  }

  for (const m of milestones) {
    nodes.push({
      id: m.id,
      label: m.title,
      type: 'milestone',
      projectId: m.project_id,
      projectName: projectMap.get(m.project_id) ?? 'Unknown Project',
      tags: [],
      relevance: 75,
    })
  }

  return nodes
}

export function deriveEdges(nodes: GraphNode[]): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      const sharedTag = a.tags.some((t) => b.tags.includes(t))
      if (sharedTag) {
        edges.push({ source: a.id, target: b.id, reason: 'shared-tag' })
      }
    }
  }
  return edges
}

// ── Service ───────────────────────────────────────────────────────────────────

export async function universalSearch(query: string): Promise<SearchResult[]> {
  const client = getClient()

  if (!client) {
    const filtered = filterResults(demoResults, query)
    return query.trim() ? filtered : sortByDate(filtered)
  }

  // Fetch from multiple tables in parallel
  const q = query.trim()
  const ilike = q ? `%${q}%` : '%'

  const [vaultResult, decisionsResult, milestonesResult, projectsResult] = await Promise.all([
    client
      .from('vault_entries')
      .select('id, project_id, title, content, category, updated_at')
      .or(`title.ilike.${ilike},content.ilike.${ilike}`)
      .order('updated_at', { ascending: false })
      .limit(20),
    client
      .from('decisions')
      .select('id, project_id, title, description, decided_at')
      .ilike('title', ilike)
      .order('decided_at', { ascending: false })
      .limit(20),
    client
      .from('milestones')
      .select('id, project_id, title, description, created_at')
      .ilike('title', ilike)
      .order('created_at', { ascending: false })
      .limit(20),
    client.from('projects').select('id, name'),
  ])

  const projectMap = new Map<string, string>(
    ((projectsResult.data ?? []) as Array<{ id: string; name: string }>).map(
      (p) => [p.id, p.name],
    ),
  )

  const results: SearchResult[] = []

  for (const v of (vaultResult.data ?? []) as VaultEntryRow[]) {
    results.push({
      id: v.id,
      title: v.title,
      content: v.content ?? '',
      type: v.category === 'resource' ? 'resource' : 'note',
      project: projectMap.get(v.project_id) ?? 'Unknown',
      projectId: v.project_id,
      date: new Date(v.updated_at).toLocaleDateString(),
      relevance: 80,
    })
  }

  for (const d of (decisionsResult.data ?? []) as DecisionRow[]) {
    results.push({
      id: d.id,
      title: d.title,
      content: d.description ?? '',
      type: 'decision',
      project: projectMap.get(d.project_id) ?? 'Unknown',
      projectId: d.project_id,
      date: new Date(d.decided_at).toLocaleDateString(),
      relevance: 90,
    })
  }

  for (const m of (decisionsResult.data ?? []) as MilestoneRow[]) {
    results.push({
      id: m.id,
      title: m.title,
      content: (m as unknown as { description?: string }).description ?? '',
      type: 'milestone',
      project: projectMap.get(m.project_id) ?? 'Unknown',
      projectId: m.project_id,
      date: new Date(m.created_at).toLocaleDateString(),
      relevance: 75,
    })
  }

  const milestoneData = (milestonesResult.data ?? []) as Array<{
    id: string; project_id: string; title: string; description: string | null; created_at: string
  }>
  for (const m of milestoneData) {
    // avoid duplicate ids from the wrong cast above
    if (!results.find(r => r.id === m.id)) {
      results.push({
        id: m.id,
        title: m.title,
        content: m.description ?? '',
        type: 'milestone',
        project: projectMap.get(m.project_id) ?? 'Unknown',
        projectId: m.project_id,
        date: new Date(m.created_at).toLocaleDateString(),
        relevance: 75,
      })
    }
  }

  if (!q) return sortByDate(results)
  return filterResults(results, q).sort((a, b) => b.relevance - a.relevance)
}

export async function fetchGraphNodes(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const client = getClient()

  if (!client) {
    const edges = deriveEdges(demoNodes)
    return { nodes: demoNodes, edges }
  }

  const [decisionsResult, vaultResult, milestonesResult, projectsResult] = await Promise.all([
    client.from('decisions').select('id, project_id, title, alternatives').limit(50),
    client.from('vault_entries').select('id, project_id, title, category, tags').limit(50),
    client.from('milestones').select('id, project_id, title').limit(50),
    client.from('projects').select('id, name'),
  ])

  const projectMap = new Map<string, string>(
    ((projectsResult.data ?? []) as Array<{ id: string; name: string }>).map(
      (p) => [p.id, p.name],
    ),
  )

  const nodes = buildGraphNodes(
    (decisionsResult.data ?? []) as Array<{ id: string; title: string; project_id: string; alternatives: string[] }>,
    (vaultResult.data ?? []) as Array<{ id: string; title: string; project_id: string; category: string; tags: string[] }>,
    (milestonesResult.data ?? []) as Array<{ id: string; title: string; project_id: string }>,
    projectMap,
  )

  const edges = deriveEdges(nodes)
  return { nodes, edges }
}
