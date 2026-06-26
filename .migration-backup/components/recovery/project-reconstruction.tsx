'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Zap, CheckCircle2, Clock } from 'lucide-react'
import { useState } from 'react'

interface ReconstructedContext {
  goal: string
  architecture: string
  timeline: string
  keyDecisions: string[]
  suggestedNextSteps: string[]
}

export function ProjectReconstruction() {
  const [uploading, setUploading] = useState(false)
  const [reconstructed, setReconstructed] = useState<ReconstructedContext | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setUploading(true)

    // Simulate AI reconstruction
    setTimeout(() => {
      setReconstructed({
        goal: 'Build a premium project memory platform that helps founders and teams remember project context during pause periods.',
        architecture: 'Next.js 16 with TypeScript, Vercel deployment, PostgreSQL database with Drizzle ORM, React Server Components for optimal performance.',
        timeline: 'MVP completed 7 days ago, current focus on advanced features. Performance optimization in progress (60% complete).',
        keyDecisions: [
          'Chose Next.js 16 for edge capabilities and automatic optimizations',
          'Vercel hosting for seamless deployments',
          'Decision intelligence system to track architectural choices',
        ],
        suggestedNextSteps: [
          'Complete performance optimization (currently at 60%)',
          'Implement AI reconstruction features',
          'Add universal search with semantic indexing',
          'Build recovery reports system',
        ],
      })
      setUploading(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          AI Project Reconstruction
        </CardTitle>
        <CardDescription>Upload project files to automatically reconstruct context and architecture</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!reconstructed ? (
          <div className="space-y-4">
            {/* Upload area */}
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 hover:border-primary/50 transition-colors">
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="size-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-semibold text-sm">
                    {uploading ? 'Analyzing project files...' : 'Upload project documentation'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, Markdown, JSON, or project files
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.md,.json,.txt,.zip"
                />
              </label>
            </div>

            {/* Features */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs font-semibold mb-1">Automatic Detection</p>
                <p className="text-xs text-muted-foreground">Goals, architecture, and timeline from documents</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs font-semibold mb-1">Decision Extraction</p>
                <p className="text-xs text-muted-foreground">Key architectural and strategic decisions</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs font-semibold mb-1">Timeline Reconstruction</p>
                <p className="text-xs text-muted-foreground">Project phases and milestone detection</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs font-semibold mb-1">Next Steps</p>
                <p className="text-xs text-muted-foreground">AI-suggested actions to resume work</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reconstructed content */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-600">Reconstruction Complete</p>
                <p className="text-xs text-green-600/70">{fileName} analyzed successfully</p>
              </div>
            </div>

            {/* Project Goal */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Project Goal</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{reconstructed.goal}</p>
            </div>

            {/* Architecture */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Architecture</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{reconstructed.architecture}</p>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Clock className="size-4" />
                Timeline
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{reconstructed.timeline}</p>
            </div>

            {/* Key Decisions */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Decisions</h4>
              <ul className="space-y-2">
                {reconstructed.keyDecisions.map((decision, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <Badge variant="secondary" className="flex-shrink-0 mt-0.5">
                      {i + 1}
                    </Badge>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Next Steps */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Suggested Next Steps</h4>
              <div className="space-y-2">
                {reconstructed.suggestedNextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                    <div className="text-xs font-semibold bg-primary text-primary-foreground rounded px-2 py-1 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setReconstructed(null)}>
                Upload Another File
              </Button>
              <Button className="gap-2">
                <CheckCircle2 className="size-4" />
                Apply to Project
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
