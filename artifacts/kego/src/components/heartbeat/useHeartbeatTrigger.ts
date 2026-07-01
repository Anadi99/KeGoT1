/**
 * Heartbeat Trigger Hook — Controls Activation State Machine
 *
 * Manages: idle → loading → ready → playing → fading → idle
 * Coordinates audio context initialization (must happen on user gesture).
 * Returns trigger function and state for the wrapper component.
 */

import { useState, useCallback, useRef } from 'react'
import { HeartbeatAudio } from './HeartbeatAudio'
import { generateHeartbeatSequence } from './heartbeatEngine'
import type { RingEvent, HeartbeatSequence, TriggerState, TriggerResult } from './heartbeatTypes'

// Animation/sequence timing constants
const FADE_OUT_START_MS = 7000   // when sentence fade begins
const TOTAL_DURATION_MS = 8000

export function useHeartbeatTrigger(
  events: RingEvent[],
  screenRadius: number,
  projectName: string
): TriggerResult {
  const [state, setState] = useState<TriggerState>('idle')
  const [sequence, setSequence] = useState<HeartbeatSequence | null>(null)
  const [startTimestamp, setStartTimestamp] = useState<number>(0)

  const audioRef = useRef<HeartbeatAudio | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
    audioRef.current?.stop()
  }, [])

  const trigger = useCallback(async () => {
    // Prevent double-trigger
    if (state !== 'idle') return

    setState('loading')

    try {
      // Initialize audio context (must happen after user gesture)
      if (!audioRef.current) {
        audioRef.current = new HeartbeatAudio()
      }
      await audioRef.current.initialize()

      // Generate the ring sequence from events
      const seq = generateHeartbeatSequence(events, screenRadius, projectName)

      setSequence(seq)
      setStartTimestamp(performance.now())
      setState('ready')

      // Small delay to let React render the rings, then start playing
      requestAnimationFrame(() => {
        setState('playing')

        // Schedule audio for the full sequence
        audioRef.current?.scheduleFullSequence(seq.rings, 0)

        // After TOTAL_DURATION_MS, return to idle
        timeoutRef.current = setTimeout(() => {
          setState('idle')
          setSequence(null)
          cleanup()
        }, TOTAL_DURATION_MS + 200)  // +200ms buffer for fade animation

        // Start fade-out of sentence at FADE_OUT_START_MS
        fadeTimeoutRef.current = setTimeout(() => {
          setState('fading')
        }, FADE_OUT_START_MS)
      })
    } catch (err) {
      console.error('Heartbeat trigger failed:', err)
      setState('idle')
      setSequence(null)
    }
  }, [state, events, screenRadius, projectName, cleanup])

  const dismiss = useCallback(() => {
    cleanup()
    setState('idle')
    setSequence(null)
  }, [cleanup])

  return {
    state,
    trigger,
    dismiss,
    sequence,
    startTimestamp,
  }
}