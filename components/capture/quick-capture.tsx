'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Mic, Send, Image, Link2, Type } from 'lucide-react'

export function QuickCapture({ onCapture }: { onCapture?: (data: any) => void }) {
  const [captureType, setCaptureType] = useState<'text' | 'voice' | 'image' | 'link'>('text')
  const [isRecording, setIsRecording] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleCapture = () => {
    if (title.trim() || content.trim()) {
      onCapture?.({
        type: captureType,
        title,
        content,
        timestamp: new Date(),
      })
      setTitle('')
      setContent('')
    }
  }

  const handleVoiceCapture = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setContent('Voice recording captured... [Transcription: "Important decision about database migration..."]')
    }
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>Quick Capture</CardTitle>
        <CardDescription>Capture project context instantly with text, voice, or links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Capture Type Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'text' as const, label: 'Text', icon: Type },
            { id: 'voice' as const, label: 'Voice', icon: Mic },
            { id: 'image' as const, label: 'Image', icon: Image },
            { id: 'link' as const, label: 'Link', icon: Link2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCaptureType(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                captureType === id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Capture Input */}
        <div className="space-y-3">
          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="haptic-feedback"
          />

          {captureType === 'text' && (
            <Textarea
              placeholder="Capture your thoughts, decisions, or context..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 resize-none"
            />
          )}

          {captureType === 'voice' && (
            <div className="space-y-3">
              <Button
                onClick={handleVoiceCapture}
                variant={isRecording ? 'destructive' : 'outline'}
                className="w-full gap-2"
              >
                <Mic className="size-4" />
                {isRecording ? 'Stop Recording' : 'Start Voice Capture'}
              </Button>
              {isRecording && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="animate-pulse">Recording...</div>
                  <Badge variant="outline">00:42</Badge>
                </div>
              )}
              {content && !isRecording && (
                <p className="text-sm text-muted-foreground italic">{content}</p>
              )}
            </div>
          )}

          {captureType === 'image' && (
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
              <Image className="size-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">Tap to add project screenshot</p>
            </div>
          )}

          {captureType === 'link' && (
            <Input
              placeholder="https://example.com"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              type="url"
            />
          )}
        </div>

        {/* Submit Button */}
        <Button onClick={handleCapture} className="w-full gap-2" disabled={!title && !content}>
          <Send className="size-4" />
          Capture
        </Button>

        {/* Mobile-Friendly Note */}
        <p className="text-xs text-muted-foreground text-center">
          One-handed thumb zone optimized for quick capture
        </p>
      </CardContent>
    </Card>
  )
}
