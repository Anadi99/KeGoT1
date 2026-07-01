/**
 * Heartbeat Ring — Animated Expanding Circle
 *
 * A single ring that expands from the center. Rendered as an SVG circle.
 * Timing is driven by CSS animation keyframes, not JS.
 * Handles three visual modes: expanding, collapsing (abandonment), and gap (invisible).
 */

import React, { useRef, useEffect, useMemo, useState } from 'react'
import type { HeartbeatRingProps } from './heartbeatTypes'

// ─── Styles ─────────────────────────────────────────────────

const ringBaseStyle: React.CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  willChange: 'transform, opacity',
}

// ─── Component ──────────────────────────────────────────────

export function HeartbeatRing({
  config,
  centerX,
  centerY,
  onAnimationComplete,
}: HeartbeatRingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [currentRadius, setCurrentRadius] = useState(0)
  const [currentOpacity, setCurrentOpacity] = useState(config.opacity)

  // Gap rings are invisible
  const shouldRender = useMemo(() => {
    if (config.isGap) return false
    return true
  }, [config.isGap])

  // Animation using requestAnimationFrame for smooth motion
  useEffect(() => {
    if (!shouldRender) return

    const startTime = performance.now()
    const expandDuration = config.expandDurationMs
    const maxRadius = config.maxRadius
    const opacity = config.opacity
    let rafId: number

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / expandDuration, 1.0)

      // Ease-out cubic for a natural feel
      const eased = 1 - Math.pow(1 - progress, 3)

      setCurrentRadius(maxRadius * eased)

      // Opacity: peak at ~60% of animation, then fade slightly
      if (progress < 0.6) {
        setCurrentOpacity(opacity * (progress / 0.6))
      } else {
        setCurrentOpacity(opacity * (1 - (progress - 0.6) / 0.4 * 0.3))
      }

      if (progress < 1.0) {
        rafId = requestAnimationFrame(animate)
      } else {
        // Fade out entirely after expansion completes
        const fadeStart = performance.now()
        const fadeDuration = 500

        const fadeOut = (now2: number) => {
          const fadeElapsed = now2 - fadeStart
          const fadeProgress = Math.min(fadeElapsed / fadeDuration, 1.0)

          setCurrentOpacity(opacity * (1 - fadeProgress))

          if (fadeProgress < 1.0) {
            requestAnimationFrame(fadeOut)
          } else {
            setIsVisible(false)
            onAnimationComplete?.()
          }
        }

        requestAnimationFrame(fadeOut)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [shouldRender, config.expandDurationMs, config.maxRadius, config.opacity, onAnimationComplete])

  // Collapsing ring for abandonment
  const isCollapsing = useMemo(() => config.hasCollapsingRing ?? false, [config.hasCollapsingRing])

  useEffect(() => {
    if (!isCollapsing || !shouldRender) return

    // Wait for expand animation to finish, then collapse
    const collapseDelay = config.expandDurationMs + 300
    const collapseStartTimeout = setTimeout(() => {
      const collapseDuration = 800
      const startRadius = config.maxRadius
      const startTime = performance.now()

      const collapse = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / collapseDuration, 1.0)
        const eased = Math.pow(progress, 2) // ease-in quadratic

        setCurrentRadius(startRadius * (1 - eased))
        setCurrentOpacity(config.opacity * 0.3 * (1 - eased))

        if (progress < 1.0) {
          requestAnimationFrame(collapse)
        } else {
          setIsVisible(false)
        }
      }

      requestAnimationFrame(collapse)
    }, collapseDelay)

    return () => {
      clearTimeout(collapseStartTimeout)
    }
  }, [isCollapsing, shouldRender, config.expandDurationMs, config.maxRadius, config.opacity])

  if (!shouldRender || !isVisible || currentOpacity <= 0.01) return null

  // Calculate position — ring is centered, so the div covers the ring's bounding box
  const diameter = currentRadius * 2
  const left = centerX - currentRadius
  const top = centerY - currentRadius

  return (
    <div
      ref={containerRef}
      style={{
        ...ringBaseStyle,
        left,
        top,
        width: diameter,
        height: diameter,
        opacity: currentOpacity,
      }}
    >
      <svg
        width={diameter}
        height={diameter}
        style={{ display: 'block' }}
      >
        <circle
          cx={currentRadius}
          cy={currentRadius}
          r={Math.max(currentRadius - config.strokeWidth / 2, 0)}
          fill="none"
          stroke={config.color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}