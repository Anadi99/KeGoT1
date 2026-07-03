/**
 * KegoMark — programmatic SVG recreation of the Kego K lettermark.
 *
 * Built from:
 *  - Vertical stem: rounded rect, purple→indigo gradient
 *  - Upper arm: diagonal rounded rect, purple→orange gradient
 *  - Lower arm: diagonal rounded rect, orange→amber gradient
 *  - Dot: circle, orange→amber gradient
 */

interface KegoMarkProps {
  size?: number
  /** Render in monochrome (grayscale) */
  mono?: boolean
  /** When mono=true, use white instead of dark */
  invertMono?: boolean
  className?: string
}

let _uid = 0

export function KegoMark({ size = 32, mono = false, invertMono = false, className }: KegoMarkProps) {
  // Use a stable but unique id per component instance to avoid SVG gradient ID collisions
  const uid = `km${size}${mono ? 'm' : 'c'}${invertMono ? 'i' : 'n'}`

  const monoColor = invertMono ? '#ffffff' : '#1a1a1a'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kego logo mark"
      role="img"
      className={className}
    >
      <defs>
        {/* Stem: purple → indigo */}
        <linearGradient id={`${uid}-stem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mono ? monoColor : '#7C3AED'} />
          <stop offset="100%" stopColor={mono ? monoColor : '#6366F1'} />
        </linearGradient>

        {/* Upper arm: purple → orange */}
        <linearGradient id={`${uid}-upper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? monoColor : '#8B5CF6'} />
          <stop offset="100%" stopColor={mono ? monoColor : '#F97316'} />
        </linearGradient>

        {/* Lower arm: orange → amber */}
        <linearGradient id={`${uid}-lower`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? monoColor : '#F97316'} />
          <stop offset="100%" stopColor={mono ? monoColor : '#FBBF24'} />
        </linearGradient>

        {/* Dot: amber orange */}
        <linearGradient id={`${uid}-dot`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? monoColor : '#FB923C'} />
          <stop offset="100%" stopColor={mono ? monoColor : '#F97316'} />
        </linearGradient>
      </defs>

      {/* Vertical stem */}
      <rect x="22" y="12" width="16" height="58" rx="8" fill={`url(#${uid}-stem)`} />

      {/* Upper diagonal arm */}
      <rect
        x="36" y="26" width="38" height="14" rx="7"
        fill={`url(#${uid}-upper)`}
        transform="rotate(-35 55 33)"
      />

      {/* Lower diagonal arm */}
      <rect
        x="36" y="52" width="40" height="14" rx="7"
        fill={`url(#${uid}-lower)`}
        transform="rotate(35 56 59)"
      />

      {/* Dot */}
      <circle cx="73" cy="18" r="9" fill={`url(#${uid}-dot)`} />
    </svg>
  )
}

/**
 * KegoWordmark — the full "KEGO" text lockup with the mark above.
 */
export function KegoWordmark({ size = 32, showTagline = false }: { size?: number; showTagline?: boolean }) {
  const fontSize = size * 0.6
  return (
    <div className="flex flex-col items-center gap-1">
      <KegoMark size={size} />
      <span
        style={{ fontSize: fontSize, fontWeight: 900, letterSpacing: '0.2em' }}
        className="text-white leading-none"
      >
        KEGO
      </span>
      {showTagline && (
        <span style={{ fontSize: fontSize * 0.35, letterSpacing: '0.2em' }} className="text-white/40 uppercase font-medium">
          Simplify • Organize • Grow
        </span>
      )}
    </div>
  )
}

/**
 * KegoAppIcon — the K mark inside the dark rounded-square app icon container.
 */
export function KegoAppIcon({ size = 40, className }: { size?: number; className?: string }) {
  const radius = Math.round(size * 0.22)
  return (
    <div
      className={`flex items-center justify-center overflow-hidden flex-shrink-0 ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'linear-gradient(160deg, #1a0a2e 0%, #0f0f14 60%, #0a0812 100%)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
      }}
    >
      <KegoMark size={Math.round(size * 0.7)} />
    </div>
  )
}
