import type { SedimentMemory, FragmentConfig, FragmentPosition, FragmentWeight } from './sedimentTypes'

// Deterministic pseudo-random based on seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function getWeightForType(type: SedimentMemory['type']): FragmentWeight {
  switch (type) {
    case 'decision':
    case 'milestone':
      return 'heavy'
    case 'blocker':
    case 'note':
    case 'checkin':
      return 'medium'
    case 'voice':
    case 'screenshot':
    case 'commit':
    case 'file':
      return 'light'
  }
}

function getFragmentWidth(content: string, isMobile: boolean, isTablet: boolean): number {
  const len = content.length
  let width: number

  if (len < 30) {
    width = 120 + seededRandom(len) * 40 // 120-160
  } else if (len <= 80) {
    width = 180 + seededRandom(len) * 60 // 180-240
  } else {
    width = 260 + seededRandom(len) * 60 // 260-320
  }

  if (isMobile) {
    width = Math.min(width, 260)
  } else if (isTablet) {
    width = Math.min(width, 380)
  } else {
    width = Math.min(width, 320)
  }

  return Math.max(100, Math.round(width))
}

function getHorizontalRange(weight: FragmentWeight, isMobile: boolean, isTablet: boolean): { min: number; max: number } {
  if (isMobile) {
    return { min: 15, max: 85 }
  }

  switch (weight) {
    case 'heavy':
      return { min: 35, max: 65 }
    case 'medium':
      return { min: 20, max: 80 }
    case 'light':
      return { min: 10, max: 90 }
  }
}

function getDurationRange(weight: FragmentWeight): { min: number; max: number } {
  switch (weight) {
    case 'heavy':
      return { min: 1.8, max: 2.4 }
    case 'medium':
      return { min: 1.2, max: 1.6 }
    case 'light':
      return { min: 0.7, max: 1.0 }
  }
}

function getDriftRange(weight: FragmentWeight): { min: number; max: number } {
  switch (weight) {
    case 'heavy':
      return { min: -8, max: 8 }
    case 'medium':
      return { min: -18, max: 18 }
    case 'light':
      return { min: -28, max: 28 }
  }
}

function getOvershootAndBounces(weight: FragmentWeight): { overshoot: number; bounces: number } {
  switch (weight) {
    case 'heavy':
      return { overshoot: 12, bounces: 1 }
    case 'medium':
      return { overshoot: 0.5, bounces: 0 }
    case 'light':
      return { overshoot: 0, bounces: 0 }
  }
}

function getVerticalRestPosition(index: number, total: number): number {
  // Most recent (index 0) → highest (15-30%)
  // Middle → center (35-55%)
  // Oldest → lower (58-72%)
  if (total <= 1) return 40

  const ratio = index / (total - 1) // 0 = most recent, 1 = oldest

  if (ratio <= 0.33) {
    // Most recent: 15-30%
    return 15 + (ratio / 0.33) * 15
  } else if (ratio <= 0.66) {
    // Middle: 35-55%
    return 35 + ((ratio - 0.33) / 0.33) * 20
  } else {
    // Oldest: 58-72%
    return 58 + ((ratio - 0.66) / 0.34) * 14
  }
}

function getTypeHorizontalBias(type: SedimentMemory['type']): { center: number; spread: number } {
  switch (type) {
    case 'decision':
      return { center: 42, spread: 8 }
    case 'milestone':
      return { center: 50, spread: 5 }
    case 'voice':
      return { center: 65, spread: 10 }
    case 'note':
      return { center: 50, spread: 15 }
    case 'blocker':
      return { center: 50, spread: 12 }
    case 'checkin':
      return { center: 50, spread: 12 }
    case 'commit':
      return { center: 50, spread: 15 }
    case 'file':
      return { center: 50, spread: 15 }
    case 'screenshot':
      return { center: 50, spread: 15 }
  }
}

export function getFragmentSpring(weight: FragmentWeight) {
  switch (weight) {
    case 'heavy':
      return { stiffness: 180, damping: 22, mass: 1.4 }
    case 'medium':
      return { stiffness: 240, damping: 18, mass: 0.9 }
    case 'light':
      return { stiffness: 320, damping: 12, mass: 0.5 }
  }
}

export function calculateFragmentConfigs(
  memories: SedimentMemory[],
  screenWidth: number,
  screenHeight: number
): FragmentConfig[] {
  const isMobile = screenWidth < 390
  const isTablet = screenWidth >= 768
  const isDesktop = screenWidth >= 1024

  // Cap fragment count based on screen size
  const maxFragments = isMobile ? 8 : 12
  const cappedMemories = memories.slice(0, maxFragments)

  if (cappedMemories.length === 0) return []

  const positions: FragmentPosition[] = []
  const configs: FragmentConfig[] = []

  // Sort memories by createdAt descending (most recent first)
  const sortedMemories = [...cappedMemories].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )

  let cumulativeDelay = 0.2 // First fragment starts at 0.2s

  for (let i = 0; i < sortedMemories.length; i++) {
    const memory = sortedMemories[i]
    const weight = getWeightForType(memory.type)
    const width = getFragmentWidth(memory.content, isMobile, isTablet)

    // Calculate vertical rest position based on recency
    const baseY = getVerticalRestPosition(i, sortedMemories.length)
    // Add slight variation so same-row fragments don't align perfectly
    const yOffset = (seededRandom(i * 7 + memory.id.length) - 0.5) * 6
    const y = Math.max(12, Math.min(72, baseY + yOffset))

    // Calculate horizontal position with type-based clustering
    const typeBias = getTypeHorizontalBias(memory.type)
    const hRange = getHorizontalRange(weight, isMobile, isTablet)

    // Blend type bias with weight range
    let x: number
    const clusterSeed = seededRandom(i * 13 + memory.id.charCodeAt(0))
    x = typeBias.center + (clusterSeed - 0.5) * 2 * typeBias.spread

    // Clamp to weight range
    x = Math.max(hRange.min, Math.min(hRange.max, x))

    // On desktop, constrain to center 600px column
    if (isDesktop) {
      const centerPx = screenWidth / 2
      const columnLeft = ((centerPx - 300) / screenWidth) * 100
      const columnRight = ((centerPx + 300) / screenWidth) * 100
      // Map x from 0-100 to within the center column
      const columnCenter = (columnLeft + columnRight) / 2
      const columnSpread = (columnRight - columnLeft) / 2 * 0.4
      x = columnCenter + (x - 50) / 50 * columnSpread
    }

    // Rotation: slight, between -4 and +4
    const rotation = (seededRandom(i * 17 + memory.id.length * 3) - 0.5) * 8

    // Check overlap with existing positions and shift if needed
    const fragmentHeight = memory.type === 'milestone' ? 52 : 44
    let adjustedX = x
    for (let j = 0; j < positions.length; j++) {
      const existing = positions[j]
      const xOverlap = Math.abs(adjustedX - existing.x)
      const yOverlap = Math.abs(y - existing.y)

      // If fragments are in similar vertical zone
      if (yOverlap < 8) {
        // Check if horizontal overlap would exceed 40%
        const minSeparation = (width / screenWidth) * 100 * 0.6
        if (xOverlap < minSeparation) {
          // Shift away from the earlier fragment
          const direction = adjustedX > existing.x ? 1 : -1
          adjustedX = existing.x + direction * (minSeparation + 1.2)
        }
      }
    }

    // Clamp again after overlap adjustment
    adjustedX = Math.max(hRange.min, Math.min(hRange.max, adjustedX))

    const position: FragmentPosition = {
      x: adjustedX,
      y,
      rotation,
      width,
      zIndex: i + 1,
    }

    positions.push(position)

    // Duration based on weight
    const durationRange = getDurationRange(weight)
    const duration = durationRange.min + seededRandom(i * 23 + memory.id.length * 5) * (durationRange.max - durationRange.min)

    // Drift based on weight
    const driftRange = getDriftRange(weight)
    const driftX = driftRange.min + seededRandom(i * 31 + memory.id.length * 7) * (driftRange.max - driftRange.min)

    // Overshoot and bounces
    const { overshoot, bounces } = getOvershootAndBounces(weight)

    // Stagger delay: heavy fragments have longer gaps
    const weightDelayFactor = weight === 'heavy' ? 0.45 : weight === 'medium' ? 0.3 : 0.15
    const staggerGap = 0.15 + weightDelayFactor

    const delay = cumulativeDelay
    cumulativeDelay += staggerGap

    configs.push({
      memory,
      position,
      delay,
      duration,
      driftX: Math.round(driftX),
      overshoot,
      bounces,
    })
  }

  // Ensure all fragments start rising within 3.5 seconds
  if (configs.length > 0 && configs[configs.length - 1].delay > 3.5) {
    const scaleFactor = 3.3 / configs[configs.length - 1].delay
    for (const config of configs) {
      config.delay = Math.round(config.delay * scaleFactor * 100) / 100
    }
  }

  // Ensure all fragments settle by 6.5 seconds
  for (const config of configs) {
    const settleTime = config.delay + config.duration + (config.bounces > 0 ? 0.5 : 0.2)
    if (settleTime > 6.5) {
      const needed = 6.4 - config.delay
      if (needed > 0.7) {
        config.duration = Math.max(0.7, needed - (config.bounces > 0 ? 0.5 : 0.2))
      }
    }
  }

  return configs
}