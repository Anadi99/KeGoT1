/**
 * Heartbeat Overlay — Full-Screen Orchestrator
 *
 * Renders the expanding rings in sequence, handles the sentence
 * fade-in/fade-out, and transitions out after completion.
 * Uses useHeartbeatData for fetching and useHeartbeatTrigger for state.
 *
 * Visual layering:
 *   1. Dark background (#0D0D12) with slight blur
 *   2. Expanding/collapsing SVG rings from center
 *   3. Completion sentence (bottom third)
 */

import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { useHeartbeatData } from './useHeartbeatData'
import { useHeartbeatTrigger } from './useHeartbeatTrigger'
import { HeartbeatRing } from './HeartbeatRing'
import type { HeartbeatOverlayProps } from './heartbeatTypes'

// ─── Timing Constants ───────────────────────────────────────

const SENTENCE_APPEAR_MS = 3000   // sentence fades in at 3s
const SENTENCE_FADE_MS = 7000     // sentence starts fading at 7s

// ─── Styles ─────────────────────────────────────────────────

const overlayBaseStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}

const backdropStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: '#0D0D12',
  // Backdrop blur via CSS — supported in all modern browsers
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}

const ringsContainerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
}

const sentenceContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '12%',
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center',
  maxWidth: '80vw',
  transition: 'opacity 1.2s ease',
  pointerEvents: 'none',
  userSelect: 'none',
}

const sentenceTextStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: 'clamp(1.25rem, 3vw, 2rem)',
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: '0.02em',
  whiteSpace: 'pre-line',
  margin: 0,
}

const loadingStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'rgba(255, 255, 255, 0.3)',
  fontSize: '0.875rem',
}

// ─── Component ──────────────────────────────────────────────

export function HeartbeatOverlay({
  projectId,
  projectName,
  onComplete,
}: HeartbeatOverlayProps) {
  const { events, isLoading, error } = useHeartbeatData(projectId)
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const screenRadius = useMemo(
    () => Math.sqrt(
      Math.pow(screenDimensions.width / 2, 2) +
      Math.pow(screenDimensions.height / 2, 2)
    ),
    [screenDimensions]
  )

  const {
    state,
    trigger,
    sequence,
    startTimestamp,
  } = useHeartbeatTrigger(events, screenRadius, projectName)

  // Auto-trigger once data is loaded
  useEffect(() => {
    if (!isLoading && events.length > 0 && state === 'idle') {
      // Small delay so the overlay mounts before triggering
      const timeout = setTimeout(() => {
        trigger()
      }, 100)
      return () => clearTimeout(timeout)
    }

    return undefined
  }, [isLoading, events, state, trigger])

  // Handle completion
  const handleComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  // Track sentence opacity
  const [sentenceOpacity, setSentenceOpacity] = useState(0)
  const sentenceStartTimeRef = React.useRef<number>(0)

  useEffect(() => {
    if (state === 'playing' && startTimestamp > 0) {
      sentenceStartTimeRef.current = startTimestamp

      let rafId: number
      const trackSentence = () => {
        const elapsed = performance.now() - sentenceStartTimeRef.current

        if (elapsed < SENTENCE_APPEAR_MS) {
          setSentenceOpacity(0)
        } else if (elapsed < SENTENCE_FADE_MS) {
          // Fade in between 3s-7s
          const fadeProgress = (elapsed - SENTENCE_APPEAR_MS) / (SENTENCE_FADE_MS - SENTENCE_APPEAR_MS)
          setSentenceOpacity(Math.min(fadeProgress * 1.2, 1.0))
        } else {
          // Fade out after 7s
          const fadeOutProgress = (elapsed - SENTENCE_FADE_MS) / 800
          setSentenceOpacity(Math.max(1.0 - fadeOutProgress, 0))
        }

        if (elapsed < 8200) {
          rafId = requestAnimationFrame(trackSentence)
        }
      }

      rafId = requestAnimationFrame(trackSentence)
      return () => cancelAnimationFrame(rafId)
    }

    return undefined
  }, [state, startTimestamp])

  // Auto-complete after sequence ends
  useEffect(() => {
    if (state === 'idle' && sequence !== null) {
      // Just transitioned back to idle — close
      // Slight delay so fade completes
      const timeout = setTimeout(handleComplete, 400)
      return () => clearTimeout(timeout)
    }

    return undefined
  }, [state, sequence, handleComplete])

  // Loading state
  if (isLoading) {
    return (
      <div style={overlayBaseStyle}>
        <div style={backdropStyle} />
        <div style={loadingStyle}>listening...</div>
      </div>
    )
  }

  // Error state — briefly show, then proceed
  if (error && state === 'idle') {
    return (
      <div style={overlayBaseStyle}>
        <div style={backdropStyle} />
        <div style={loadingStyle}>unable to listen. continuing...</div>
        {/* Will auto-trigger when demo data renders */}
      </div>
    )
  }

  const centerX = screenDimensions.width / 2
  const centerY = screenDimensions.height / 2

  return (
    <div style={overlayBaseStyle}>
      {/* Backdrop */}
      <div
        style={{
          ...backdropStyle,
          opacity: state === 'fading' || state === 'idle' ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Rings */}
      <div style={ringsContainerStyle}>
        {sequence?.rings.map((ring, index) => (
          <HeartbeatRing
            key={`${ring.event.type}-${index}-${ring.startTimeMs}`}
            config={ring}
            centerX={centerX}
            centerY={centerY}
          />
        ))}
      </div>

      {/* Completion Sentence */}
      {sequence && (
        <div
          style={{
            ...sentenceContainerStyle,
            opacity: sentenceOpacity,
          }}
        >
          <p style={sentenceTextStyle}>
            {sequence.completionSentence}
          </p>
        </div>
      )}
    </div>
  )
}