'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { RecoveryHub } from '@/components/recovery/recovery-hub'
import { Button } from '@/components/ui/button'
import { mockProjects } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function HubPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    const foundProject = mockProjects.find((p) => p.id === id)
    setProject(foundProject)
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
        </div>

        {/* Project Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
          <Link href={`/projects/${id}/recovery`}>
            <Button variant="ghost" className="rounded-b-none">
              Recovery Workspace
            </Button>
          </Link>
          <Link href={`/projects/${id}/vault`}>
            <Button variant="ghost" className="rounded-b-none">
              Knowledge Vault
            </Button>
          </Link>
          <Link href={`/projects/${id}/hub`}>
            <Button
              variant="ghost"
              className="rounded-b-none border-b-2 border-primary text-primary"
            >
              <BarChart3 className="size-4 mr-2" />
              Recovery Hub
            </Button>
          </Link>
          <Link href={`/projects/${id}/timeline`}>
            <Button variant="ghost" className="rounded-b-none">
              Timeline
            </Button>
          </Link>
        </div>

        {/* Recovery Hub Content */}
        <RecoveryHub />
      </div>
    </AppLayout>
  )
}
