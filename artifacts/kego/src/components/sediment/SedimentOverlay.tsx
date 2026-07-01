import { useState, useEffect, useCallback, useRef } from 'react'
import type { SedimentProps, FragmentConfig } from './sedimentTypes'
import { useSedimentData } from './useSedimentData'
import { useSedimentTrigger } from './useSedimentTrigger'
import { calculateFragmentConfigs } from './sedimentPhysics'
import { SedimentFragment } from './SedimentFragment'

type OverlayPhase = 'idle' | 'entering' | 'animating' | 'settled' | 'exiting'

export function SedimentOverlay({ projectId, projectName, onComplete }: SedimentProps) {
  const { memories, isLoading, error } = useSedimentData(projectId)
  const { isTriggered, trigger, dismiss } = useSedimentTrigger(300)
  const [phase, setPhase] = useState<OverlayPhase>('idle')
  const [fragmentConfigs, setFragmentConfigs] = useState<FragmentConfig[]>([])
  const [settledCount, setSettledCount] = useState(0)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  // Measure viewport
  useEffect(() => {
    function handleResize() {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate fragment configs when data is ready
  useEffect(() => {
    if (memories.length > 0 && viewportSize.width > 0 && viewportSize.height > 0) {
      const configs = calculateFragmentConfigs(memories, viewportSize.width, viewportSize.height)
      setFragmentConfigs(configs)
    }
  }, [memories, viewportSize])

  // Trigger the animation when data is loaded
  useEffect(() => {
    if (!isLoading && memories.length > 0 && phase === 'idle') {
      trigger()
    }
  }, [isLoading, memories, phase, trigger])

  // Phase transitions
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (isTriggered && phase === 'idle') {
      setPhase('entering')
      // Brief pause for the overlay to fade in before fragments start
      timer = setTimeout(() => {
        setPhase('animating')
      }, 400)
    }
    return () => {
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [isTriggered, phase])

  // Check if all fragments have settled
  useEffect(() => {
    if (phase === 'animating' && fragmentConfigs.length > 0 && settledCount >= fragmentConfigs.length) {
      setPhase('settled')
    }
  }, [settledCount, fragmentConfigs.length, phase])

  const handleFragmentSettled = useCallback(() => {
    setSettledCount(prev => prev + 1)
  }, [])

  const handleContinue = useCallback(() => {
    setPhase('exiting')
    // Wait for exit animation to complete
    setTimeout(() => {
      dismiss()
      setPhase('idle')
      setSettledCount(0)
      onComplete()
    }, 600)
  }, [dismiss, onComplete])

  const handleSkip = useCallback(() => {
    setPhase('exiting')
    setTimeout(() => {
      dismiss()
      setPhase('idle')
      setSettledCount(0)
      onComplete()
    }, 300)
  }, [dismiss, onComplete])

  // Don't render if idle or loading
  if (phase === 'idle' || isLoading) {
    return null
  }

  // Error state — skip the overlay
  if (error) {
    return null
  }

  // No memories — skip the overlay
  if (memories.length === 0) {
    return null
  }

  const overlayOpacity = phase === 'entering' ? 1 : phase === 'exiting' ? 0 : 1
  const contentOpacity = phase === 'exiting' ? 0 : 1

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'auto',
        opacity: overlayOpacity,
        transition: 'opacity 0.4s ease-in-out',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'hsl(var(--background, 0 0% 100%))',
          opacity: phase === 'exiting' ? 0 : 0.92,
          transition: 'opacity 0.4s ease-in-out',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '24px 32px',
          opacity: contentOpacity,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'hsl(var(--muted-foreground, 220 8.9% 46.1%))',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            Resuming
          </p>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'hsl(var(--foreground, 224 71.4% 4.1%))',
              margin: 0,
              marginTop: '4px',
              lineHeight: 1.2,
            }}
          >
            {projectName}
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'hsl(var(--muted-foreground, 220 8.9% 46.1%))',
              margin: 0,
              marginTop: '8px',
            }}
          >
            Your project context is settling into place…
          </p>
        </div>
      </div>

      {/* Fragment container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        {fragmentConfigs.map((config) => (
          <SedimentFragment
            key={config.memory.id}
            config={config}
            viewportHeight={viewportSize.height}
            onSettled={handleFragmentSettled}
          />
        ))}
      </div>

      {/* Continue button — appears after all fragments settle */}
      {phase === 'settled' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleContinue}
            style={{
              padding: '12px 32px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'hsl(var(--primary-foreground, 210 40% 98%))',
              backgroundColor: 'hsl(var(--primary, 221.2 83.2% 53.3%))',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Skip button — always visible during animation */}
      {phase === 'animating' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={handleSkip}
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'hsl(var(--muted-foreground, 220 8.9% 46.1%))',
              backgroundColor: 'transparent',
              border: '1px solid hsl(var(--border, 220 13% 91%))',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--muted, 220 14.3% 95.9%))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Skip
          </button>
        </div>
      )}
    </div>
  )
}