'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { KnowledgeVault } from '@/components/vault/knowledge-vault'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { mockVaultEntries, mockProjects } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowLeft, BookMarked, Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { VaultEntry } from '@/lib/types'

export default function VaultPage() {
  const params = useParams()
  const id = params.id as string
  const [entries, setEntries] = useState<VaultEntry[]>([])
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    const foundProject = mockProjects.find((p) => p.id === id)
    setProject(foundProject)

    const vaultEntries = mockVaultEntries.filter((e) => e.projectId === id)
    setEntries(vaultEntries)
  }, [id])

  if (!project) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold">Project not found</h1>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link href={`/projects/${id}/recovery`} className="inline-flex">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </Link>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Entry
          </Button>
        </div>

        {/* Project Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
          <Link href={`/projects/${id}/recovery`}>
            <Button variant="ghost" className="rounded-b-none">
              Recovery Workspace
            </Button>
          </Link>
          <Link href={`/projects/${id}/vault`}>
            <Button
              variant="ghost"
              className="rounded-b-none border-b-2 border-primary text-primary"
            >
              <BookMarked className="size-4 mr-2" />
              Knowledge Vault
            </Button>
          </Link>
          <Link href={`/projects/${id}/timeline`}>
            <Button variant="ghost" className="rounded-b-none">
              Timeline
            </Button>
          </Link>
        </div>

        {/* Enhanced Knowledge Vault Component */}
        <KnowledgeVault entries={entries} projectId={id} />
      </div>
    </AppLayout>
  )
}
