import { getClient } from '../supabase/client'
import type { IntegrationRow, TimelineEventRow } from '../supabase/database.types'

// ── Service ───────────────────────────────────────────────────────────────────

export async function fetchIntegration(
  projectId: string,
  provider: string,
): Promise<IntegrationRow | null> {
  const client = getClient()
  if (!client) return null

  const { data, error } = await client
    .from('integrations')
    .select('*')
    .eq('project_id', projectId)
    .eq('provider', provider)
    .single()

  if (error) {
    // PGRST116 = no rows — not an error, just not connected
    if ((error as { code?: string }).code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data as IntegrationRow
}

export async function connectIntegration(
  projectId: string,
  provider: string,
  repoUrl: string,
  settings: Record<string, unknown> = {},
): Promise<IntegrationRow> {
  const client = getClient()
  if (!client) throw new Error('Database unavailable')

  // Upsert: replace any existing connection for this project+provider
  const { data, error } = await client
    .from('integrations')
    .upsert(
      {
        project_id: projectId,
        provider,
        repo_url: repoUrl,
        settings,
        connected_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as IntegrationRow
}

export async function disconnectIntegration(id: string): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client.from('integrations').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Calls the GitHub REST API to fetch recent commits and inserts them as
 * timeline_events rows with type = 'github:commit'.
 */
export async function syncGitHub(integration: IntegrationRow): Promise<number> {
  const client = getClient()
  if (!client) throw new Error('Database unavailable')

  const repoUrl = integration.repo_url
  if (!repoUrl) throw new Error('No repository URL configured')

  // Parse owner/repo from URL
  // Supports: https://github.com/owner/repo and owner/repo
  const match = repoUrl.match(/(?:github\.com\/)([^/]+\/[^/]+)/) ??
    repoUrl.match(/^([^/]+\/[^/]+)$/)
  if (!match) throw new Error('Invalid GitHub repository URL')

  const repoPath = match[1].replace(/\.git$/, '')

  const response = await fetch(
    `https://api.github.com/repos/${repoPath}/commits?per_page=20`,
    { headers: { Accept: 'application/vnd.github.v3+json' } },
  )

  if (!response.ok) {
    if (response.status === 404) throw new Error('Repository not found or is private')
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const commits = (await response.json()) as Array<{
    sha: string
    commit: {
      message: string
      author: { date: string; name: string }
    }
    html_url: string
  }>

  if (commits.length === 0) return 0

  const events = commits.map((c) => ({
    project_id: integration.project_id,
    type: 'github:commit',
    title: c.commit.message.split('\n')[0].slice(0, 100),
    description: `${c.commit.author.name} — ${c.sha.slice(0, 7)}`,
    timestamp: c.commit.author.date,
  }))

  const { error } = await client.from('timeline_events').insert(events)
  if (error) throw new Error(error.message)

  // Update last_sync_at
  await client
    .from('integrations')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', integration.id)

  return commits.length
}

/** Validate a GitHub repo URL before attempting to connect */
export function validateGitHubUrl(url: string): string | null {
  if (!url.trim()) return 'Repository URL is required'
  const match =
    url.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+/) ??
    url.match(/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/)
  if (!match) return 'Enter a valid GitHub URL (e.g. https://github.com/owner/repo)'
  return null
}
