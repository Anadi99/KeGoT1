// Sediment Layer — Barrel Export
// A geological sediment metaphor for project context recovery.
// Memories rise from below and settle into place like sediment in water.

export { SedimentOverlay } from './SedimentOverlay'
export { SedimentFragment } from './SedimentFragment'
export { useSedimentData } from './useSedimentData'
export { useSedimentTrigger } from './useSedimentTrigger'
export { calculateFragmentConfigs, getFragmentSpring } from './sedimentPhysics'

export type {
  MemoryType,
  FragmentWeight,
  SedimentMemory,
  FragmentPosition,
  FragmentConfig,
  SedimentProps,
} from './sedimentTypes'