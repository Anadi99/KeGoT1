/**
 * Heartbeat Trigger Wrapper — Press-and-Hold Activation
 *
 * Wraps a child element and activates the heartbeat overlay
 * on a 1-second press-and-hold. Shows a subtle progress ring
 * around the child during the hold.
 *
 * This is the entry point — embed around any project card/list item.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { HeartbeatOverlay } from './HeartbeatOverlay'
import type { HeartbeatTriggerProps } from './heartbeatTypes'

// ─── Constants ──────────────────────────────────────────────

const HOLD_DURATION_MS = 1000        // press required to activate
const PROGRESS_RING_SIZE = 16        // ring thickness
const PROGRESS_RING_PADDING = 12     // padding around child

type HoldPhase = 'idle' | 'holding' | 'activated'

// ─── Component ──────────────────────────────────────────────

export function HeartbeatTriggerWrapper({
  projectId,
  projectName,
  children,
  onHeartbeatComplete,
}: HeartbeatTriggerProps) {
  const [phase, setPhase] = useState<HoldPhase>('idle')
  const [showOverlay, setShowOverlay] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)

  const holdStartRef = useRef<number>(0)
  const rafRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isHoldingRef = useRef(false)

  // ─── Press-and-Hold Logic ─────────────────────────────────

  const startHold = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Don't capture if event target is interactive (links, buttons inside)
    const target = e.target as HTMLElement
    if (target.closest('a, button, input, textarea, [role="button"]')) return

    e.preventDefault()
    isHoldingRef.current = true
    setPhase('holding')
    holdStartRef.current = performance.now()
    setHoldProgress(0)

    const animate = (now: number) => {
      if (!isHoldingRef.current) return

      const elapsed = now - holdStartRef.current
      const progress = Math.min(elapsed / HOLD_DURATION_MS, 1.0)

      setHoldProgress(progress)

      if (progress >= 1.0) {
        // Activation threshold reached
        isHoldingRef.current = false
        setPhase('activated')
        setShowOverlay(true)
        setHoldProgress(0)
        return
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  const cancelHold = useCallback(() => {
    isHoldingRef.current = false
    cancelAnimationFrame(rafRef.current)

    if (phase === 'holding') {
      setPhase('idle')
      setHoldProgress(0)
    }
  }, [phase])

  // Global cleanup on mouse up / touch end anywhere
  useEffect(() => {
    const handleUp = () => cancelHold()
    const handleLeave = () => cancelHold()

    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchend', handleUp)
    window.addEventListener('touchcancel', handleUp)
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchend', handleUp)
      window.removeEventListener('touchcancel', handleUp)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [cancelHold])

  // ─── Heartbeat Complete ───────────────────────────────────

  const handleHeartbeatComplete = useCallback(() => {
    setShowOverlay(false)
    setPhase('idle')
    onHeartbeatComplete()
  }, [onHeartbeatComplete])

  // ─── Progress Ring SVG ────────────────────────────────────

  const containerSize = containerRef.current
    ? Math.max(containerRef.current.offsetWidth, containerRef.current.offsetHeight)
    : 100

  const ringSize = containerSize + PROGRESS_RING_PADDING * 2 + PROGRESS_RING_SIZE
  const ringCenter = ringSize / 2
  const ringRadius = containerSize / 2 + PROGRESS_RING_PADDING + PROGRESS_RING_SIZE / 2
  const circumference = 2 * Math.PI * ringRadius
  const strokeDashoffset = circumference * (1 - holdProgress)

  // ─── Styles ───────────────────────────────────────────────

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',  // prevent scroll during hold
  }

  const progressRingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: ringSize,
    height: ringSize,
    pointerEvents: 'none',
    opacity: phase === 'holding' ? 1 : 0,
    transition: 'opacity 0.2s ease',
    zIndex: 1,
  }

  return (
    <>
      <div
        ref={containerRef}
        style={wrapperStyle}
        onMouseDown={startHold}
        onTouchStart={startHold}
      >
        {/* Progress ring */}
        {phase === 'holding' && (
          <div style={progressRingStyle}>
            <svg
              width={ringSize}
              height={ringSize}
              style={{
                transform: 'rotate(-90deg)',
              }}
            >
              {/* Track */}
              <circle
                cx={ringCenter}
                cy={ringCenter}
                r={ringRadius}
                fill="none"
                stroke="rgba(91, 71, 224, 0.1)"
                strokeWidth={PROGRESS_RING_SIZE}
              />
              {/* Progress */}
              <circle
                cx={ringCenter}
                cy={ringCenter}
                r={ringRadius}
                fill="none"
                stroke="#5B47E0"
                strokeWidth={PROGRESS_RING_SIZE}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.05s linear',
                }}
              />
            </svg>
          </div>
        )}

        {/* Child content */}
        {children}
      </div>

      {/* Heartbeat Overlay — rendered as portal sibling */}
      {showOverlay && (
        <HeartbeatOverlay
          projectId={projectId}
          projectName={projectName}
          onComplete={handleHeartbeatComplete}
        />
      )}
    </>
  )
}