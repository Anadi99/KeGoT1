export type MemoryType =
  | 'decision'
  | 'blocker'
  | 'note'
  | 'voice'
  | 'screenshot'
  | 'milestone'
  | 'checkin'
  | 'commit'
  | 'file'

export type FragmentWeight = 'heavy' | 'medium' | 'light'

export interface SedimentMemory {
  id: string
  type: MemoryType
  content: string
  createdAt: Date
  weight: FragmentWeight
}

export interface FragmentPosition {
  x: number        // percentage from left (0-100)
  y: number        // final resting y position from top
  rotation: number // degrees, between -4 and +4
  width: number    // px
  zIndex: number
}

export interface FragmentConfig {
  memory: SedimentMemory
  position: FragmentPosition
  delay: number      // seconds before this fragment starts rising
  duration: number   // seconds for the rise animation
  driftX: number     // horizontal drift in px during rise
  overshoot: number  // how many px past final position before settling
  bounces: number    // 0, 1, or 2 — number of bounces on settle
}

export interface SedimentProps {
  projectId: string
  projectName: string
  onComplete: () => void
}