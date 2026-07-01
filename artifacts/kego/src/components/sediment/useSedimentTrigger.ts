import { useState, useCallback, useRef, useEffect } from 'react'

interface SedimentTriggerState {
  isTriggered: boolean
  trigger: () => void
  dismiss: () => void
}

/**
 * Manages the sediment overlay trigger state.
 * 
 * The overlay is triggered when:
 * 1. The user explicitly navigates to a project recovery page
 * 2. The user clicks a "Resume Project" or "View Context" button
 * 
 * The overlay auto-dismisses after the sediment animation completes
 * (~7 seconds) or when the user clicks the "Continue" button.
 */
export function useSedimentTrigger(autoTriggerDelay: number = 300): SedimentTriggerState {
  const [isTriggered, setIsTriggered] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trigger = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Small delay to allow the page to render before starting the animation
    timeoutRef.current = setTimeout(() => {
      setIsTriggered(true)
      timeoutRef.current = null
    }, autoTriggerDelay)
  }, [autoTriggerDelay])

  const dismiss = useCallback(() => {
    setIsTriggered(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { isTriggered, trigger, dismiss }
}