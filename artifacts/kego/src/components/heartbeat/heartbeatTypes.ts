/**
 * Heartbeat Feature — TypeScript Types
 *
 * The Project Heartbeat compresses an entire project history
 * into 8 seconds of expanding rings, silence, and sound.
 * These types define the shape of that experience.
 */

// ─── Ring Event Types ───────────────────────────────────────

export type RingEventType =
  | 'checkin'       // a day the user worked
  | 'decision'      // an important decision made
  | 'milestone'     // a phase or major task completed
  | 'blocker'       // a blocker recorded
  | 'commit'        // a GitHub commit (if connected)
  | 'gap'           // a period of inactivity
  | 'abandonment'   // the longest gap in the project

// ─── Ring Event ─────────────────────────────────────────────

export interface RingEvent {
  type: RingEventType
  date: Date
  /** For gap and abandonment only — how many days the gap lasted */
  durationDays?: number
  /** Brief description used for the completion sentence */
  content?: string
  /** 0.0 to 1.0 — how significant this event was */
  intensity: number
}

// ─── Ring Configuration ─────────────────────────────────────

export interface RingConfig {
  event: RingEvent
  /** When in the 8000ms sequence this ring begins expanding */
  startTimeMs: number
  /** How long the ring takes to expand */
  expandDurationMs: number
  /** Final radius in px */
  maxRadius: number
  /** Ring border thickness in px */
  strokeWidth: number
  /** Ring color */
  color: string
  /** Peak opacity during expansion */
  opacity: number
  /** Gaps render differently — no expanding ring */
  isGap: boolean
  /** For abandonment — a ghost ring that collapses inward */
  hasCollapsingRing?: boolean
  /** Duration of a gap period in sequence time (ms) */
  gapDurationMs?: number
}

// ─── Heartbeat Sequence ─────────────────────────────────────

export interface HeartbeatSequence {
  rings: RingConfig[]
  /** Always 8000 */
  totalDurationMs: number
  completionSentence: string
  projectStats: ProjectStats
}

export interface ProjectStats {
  totalDays: number
  activeDays: number
  longestStreak: number
  longestGapDays: number
  lastEventDescription: string
  completionPercentage: number
}

// ─── Component Props ────────────────────────────────────────

export interface HeartbeatOverlayProps {
  projectId: string
  projectName: string
  /** Called after sentence fades, project opens */
  onComplete: () => void
}

export interface HeartbeatTriggerProps {
  projectId: string
  projectName: string
  /** Wraps whatever element should be press-and-holdable */
  children: React.ReactNode
  /** Called after the heartbeat completes */
  onHeartbeatComplete: () => void
}

export interface HeartbeatRingProps {
  config: RingConfig
  /** Screen center x */
  centerX: number
  /** Screen center y */
  centerY: number
  /** For abandonment ghost ring */
  isCollapsing?: boolean
  /** Called when ring animation completes */
  onAnimationComplete?: () => void
}

// ─── Data Hook Return ───────────────────────────────────────

export interface HeartbeatDataResult {
  events: RingEvent[]
  isLoading: boolean
  error: Error | null
  projectStats: ProjectStats | null
}

// ─── Trigger State Machine ──────────────────────────────────

export type TriggerState =
  | 'idle'       // nothing happening
  | 'loading'    // fetching/processing data
  | 'ready'      // sequence generated, waiting for rAF
  | 'playing'    // rings expanding, audio playing
  | 'fading'     // sentence fading out, rings dissolving

export interface TriggerResult {
  state: TriggerState
  trigger: () => Promise<void>
  dismiss: () => void
  sequence: HeartbeatSequence | null
  startTimestamp: number
}

// ─── Audio types ─────────────────────────────────────────────

export interface ScheduledTone {
  type: RingEventType
  timeOffsetMs: number
  intensity: number
  gapDurationMs?: number
  isAbandonment?: boolean
}
