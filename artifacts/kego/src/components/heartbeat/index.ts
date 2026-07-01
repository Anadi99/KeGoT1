/**
 * Heartbeat — Project Life in 8 Seconds
 *
 * Barrel export for the Heartbeat feature.
 *
 * Usage:
 *   import { HeartbeatTriggerWrapper } from '@/components/heartbeat'
 *
 *   <HeartbeatTriggerWrapper projectId={id} projectName={name} onHeartbeatComplete={...}>
 *     <ProjectCard />
 *   </HeartbeatTriggerWrapper>
 */

export { HeartbeatTriggerWrapper } from './HeartbeatTriggerWrapper'
export { HeartbeatOverlay } from './HeartbeatOverlay'
export { HeartbeatRing } from './HeartbeatRing'
export { HeartbeatAudio } from './HeartbeatAudio'
export { generateHeartbeatSequence } from './heartbeatEngine'
export { useHeartbeatData } from './useHeartbeatData'
export { useHeartbeatTrigger } from './useHeartbeatTrigger'

export type {
  RingEventType,
  RingEvent,
  RingConfig,
  HeartbeatSequence,
  ProjectStats,
  HeartbeatOverlayProps,
  HeartbeatTriggerProps,
  HeartbeatRingProps,
  HeartbeatDataResult,
  TriggerState,
  TriggerResult,
  ScheduledTone,
} from './heartbeatTypes'