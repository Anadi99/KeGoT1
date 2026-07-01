import { useState, useEffect, useRef } from 'react'
import type { FragmentConfig, MemoryType } from './sedimentTypes'
import { getFragmentSpring } from './sedimentPhysics'

// Icon mapping for memory types
const TYPE_ICONS: Record<MemoryType, string> = {
  decision: '◆',
  blocker: '⊘',
  note: '📝',
  voice: '🎙',
  screenshot: '📷',
  milestone: '★',
  checkin: '✓',
  commit: '⟐',
  file: '📄',
}

// Color mapping for memory types
const TYPE_COLORS: Record<MemoryType, { bg: string; border: string; text: string }> = {
  decision: {
    bg: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.35)',
    text: '#8b5cf6',
  },
  blocker: {
    bg: 'rgba(239, 68, 68, 0.10)',
    border: 'rgba(239, 68, 68, 0.30)',
    text: '#ef4444',
  },
  note: {
    bg: 'rgba(59, 130, 246, 0.10)',
    border: 'rgba(59, 130, 246, 0.25)',
    text: '#3b82f6',
  },
  voice: {
    bg: 'rgba(234, 179, 8, 0.10)',
    border: 'rgba(234, 179, 8, 0.30)',
    text: '#eab308',
  },
  screenshot: {
    bg: 'rgba(236, 72, 153, 0.10)',
    border: 'rgba(236, 72, 153, 0.25)',
    text: '#ec4899',
  },
  milestone: {
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.35)',
    text: '#22c55e',
  },
  checkin: {
    bg: 'rgba(107, 114, 128, 0.10)',
    border: 'rgba(107, 114, 128, 0.25)',
    text: '#6b7280',
  },
  commit: {
    bg: 'rgba(99, 102, 241, 0.10)',
    border: 'rgba(99, 102, 241, 0.25)',
    text: '#6366f1',
  },
  file: {
    bg: 'rgba(156, 163, 175, 0.10)',
    border: 'rgba(156, 163, 175, 0.25)',
    text: '#9ca3af',
  },
}

interface SedimentFragmentProps {
  config: FragmentConfig
  viewportHeight: number
  onSettled: () => void
}

export function SedimentFragment({ config, viewportHeight, onSettled }: SedimentFragmentProps) {
  const [state, setState] = useState<'waiting' | 'rising' | 'settled'>('waiting')
  const [currentY, setCurrentY] = useState(viewportHeight + 60) // Start below viewport
  const [currentX, setCurrentX] = useState(0)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [currentOpacity, setCurrentOpacity] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const { memory, position, delay, duration, driftX, overshoot, bounces } = config
  const spring = getFragmentSpring(memory.weight)
  const colors = TYPE_COLORS[memory.type]
  const icon = TYPE_ICONS[memory.type]

  // Target position in pixels
  const targetYPx = (position.y / 100) * viewportHeight
  const targetXPct = position.x

  useEffect(() => {
    if (state !== 'waiting') return

    const delayTimer = setTimeout(() => {
      setState('rising')
    }, delay * 1000)

    return () => clearTimeout(delayTimer)
  }, [delay, state])

  // Spring physics animation
  useEffect(() => {
    if (state !== 'rising') return

    startTimeRef.current = null
    let velocity = 0
    let displacement = currentY - targetYPx // Start: large positive displacement (below target)

    const stiffness = spring.stiffness
    const damping = spring.damping
    const mass = spring.mass

    // Time step for physics simulation (60fps equivalent)
    const dt = 1 / 60

    function animate(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      // Spring force: F = -kx - cv
      const springForce = -stiffness * displacement
      const dampingForce = -damping * velocity
      const acceleration = (springForce + dampingForce) / mass

      // Euler integration
      velocity += acceleration * dt
      displacement += velocity * dt

      const newY = targetYPx + displacement

      // Calculate progress for opacity and drift
      const elapsed = (timestamp - startTimeRef.current!) / 1000
      const progress = Math.min(elapsed / duration, 1)

      // Opacity: fade in during first 30% of animation
      const opacity = Math.min(progress / 0.3, 1)

      // Drift: apply horizontal drift proportional to progress
      const drift = driftX * progress

      // Rotation: slight wobble that dampens
      const wobble = displacement * 0.15

      setCurrentY(newY)
      setCurrentX(drift)
      setCurrentRotation(position.rotation + wobble)
      setCurrentOpacity(opacity)

      // Check if settled (displacement and velocity are very small)
      const isSettled = Math.abs(displacement) < 0.5 && Math.abs(velocity) < 0.5

      if (isSettled && progress > 0.5) {
        setCurrentY(targetYPx)
        setCurrentX(driftX)
        setCurrentRotation(position.rotation)
        setCurrentOpacity(1)
        setState('settled')
        onSettled()
        return
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  // Don't render while waiting (before delay)
  if (state === 'waiting') {
    return null
  }

  const isMilestone = memory.type === 'milestone'

  return (
    <div
      style={{
        position: 'absolute',
        left: `${targetXPct + (currentX / viewportHeight) * 100 * 0.3}%`,
        top: `${(currentY / viewportHeight) * 100}%`,
        width: `${position.width}px`,
        transform: `translateX(-50%) rotate(${currentRotation}deg)`,
        zIndex: position.zIndex,
        opacity: currentOpacity,
        transition: state === 'settled' ? 'transform 0.3s ease, opacity 0.3s ease' : 'none',
        pointerEvents: state === 'settled' ? 'auto' : 'none',
      }}
      className="sediment-fragment"
    >
      <div
        style={{
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: isMilestone ? '12px' : '8px',
          padding: isMilestone ? '10px 14px' : '8px 12px',
          boxShadow: state === 'settled'
            ? '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'default',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span
            style={{
              fontSize: isMilestone ? '16px' : '13px',
              lineHeight: 1,
              flexShrink: 0,
              marginTop: '2px',
              color: colors.text,
            }}
          >
            {icon}
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: isMilestone ? '13px' : '12px',
                fontWeight: isMilestone ? 600 : 500,
                lineHeight: 1.4,
                color: 'var(--foreground, #1e293b)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {memory.content}
            </p>
            <p
              style={{
                fontSize: '10px',
                color: 'var(--muted-foreground, #64748b)',
                margin: 0,
                marginTop: '2px',
                lineHeight: 1,
              }}
            >
              {memory.type}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}