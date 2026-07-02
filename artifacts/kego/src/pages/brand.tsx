import { useState, useRef, useCallback } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Link } from 'wouter'
import { toast } from 'sonner'
import {
  ArrowLeft, Download, Copy, Check, ChevronRight,
  Palette, Type, Grid3X3, Sparkles, Eye, EyeOff,
  Smartphone, Monitor, Watch, Globe, Bell, Package,
} from 'lucide-react'

// ─── Fade-in variant ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── K Lettermark SVG ─────────────────────────────────────────────────────────
function KegoMark({ size = 80, mono = false, inverted = false }: {
  size?: number; mono?: boolean; inverted?: boolean
}) {
  const id = `grad-${size}-${mono ? 'm' : 'c'}-${inverted ? 'i' : 'n'}`
  const s = size
  const fill = mono
    ? (inverted ? '#ffffff' : '#1a1a1a')
    : undefined

  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-stem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mono ? fill : '#7C3AED'} />
          <stop offset="100%" stopColor={mono ? fill : '#6366F1'} />
        </linearGradient>
        <linearGradient id={`${id}-upper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? fill : '#8B5CF6'} />
          <stop offset="100%" stopColor={mono ? fill : '#F97316'} />
        </linearGradient>
        <linearGradient id={`${id}-lower`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? fill : '#F97316'} />
          <stop offset="100%" stopColor={mono ? fill : '#FBBF24'} />
        </linearGradient>
        <linearGradient id={`${id}-dot`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? fill : '#FB923C'} />
          <stop offset="100%" stopColor={mono ? fill : '#F97316'} />
        </linearGradient>
      </defs>
      {/* Stem */}
      <rect x="22" y="12" width="16" height="58" rx="8" fill={`url(#${id}-stem)`} />
      {/* Upper arm — diagonal from center going upper-right */}
      <rect
        x="36" y="26" width="38" height="14" rx="7"
        fill={`url(#${id}-upper)`}
        transform="rotate(-35 55 33)"
      />
      {/* Lower arm — diagonal from center going lower-right */}
      <rect
        x="36" y="52" width="40" height="14" rx="7"
        fill={`url(#${id}-lower)`}
        transform="rotate(35 56 59)"
      />
      {/* Dot */}
      <circle cx="73" cy="18" r="9" fill={`url(#${id}-dot)`} />
    </svg>
  )
}

// ─── App Icon (with rounded background) ──────────────────────────────────────
function AppIcon({ size = 80, bg = '#161622', radius }: {
  size?: number; bg?: string; radius?: number
}) {
  const r = radius !== undefined ? radius : size * 0.22
  return (
    <div
      style={{ width: size, height: size, borderRadius: r, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
      className="overflow-hidden shadow-2xl"
    >
      <KegoMark size={size * 0.72} />
    </div>
  )
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const shouldReduce = useReducedMotion()

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={shouldReduce ? {} : { scale: 0.95 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white/70 hover:text-white transition-all"
    >
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="size-3 text-green-400" /></motion.span>
          : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy className="size-3" /></motion.span>
        }
      </AnimatePresence>
      {label}
    </motion.button>
  )
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-24 px-6 max-w-6xl mx-auto ${className}`}>
      {children}
    </section>
  )
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
      className="flex items-center gap-3 mb-4"
    >
      <span className="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase">{number}</span>
      <div className="h-px flex-1 max-w-8 bg-white/10" />
      <span className="text-xs font-semibold tracking-[0.15em] text-white/40 uppercase">{label}</span>
    </motion.div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
      className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4"
    >
      {children}
    </motion.h2>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Animated background orbs */}
      {!shouldReduce && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(124,58,237,0.25) 0%, transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 50% 40% at 70% 60%, rgba(249,115,22,0.18) 0%, transparent 70%)' }}
            animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Floating particles */}
      {!shouldReduce && Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: i % 2 === 0 ? 'rgba(124,58,237,0.6)' : 'rgba(249,115,22,0.6)',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3, ease: 'easeInOut' }}
        />
      ))}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 relative z-10"
      >
        <KegoMark size={160} />
      </motion.div>

      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-3"
      >
        <h1 className="text-7xl sm:text-8xl font-black tracking-widest text-white">KEGO</h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-sm font-semibold tracking-[0.4em] text-white/40 uppercase mb-12 relative z-10"
      >
        Simplify&nbsp;•&nbsp;Organize&nbsp;•&nbsp;Grow
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-wrap gap-3 justify-center relative z-10"
      >
        <motion.button
          whileHover={shouldReduce ? {} : { scale: 1.03, boxShadow: '0 0 32px rgba(124,58,237,0.5)' }}
          whileTap={shouldReduce ? {} : { scale: 0.97 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #F97316)' }}
        >
          <Download className="size-4" />Download Assets
        </motion.button>
        <motion.button
          whileHover={shouldReduce ? {} : { scale: 1.03 }}
          whileTap={shouldReduce ? {} : { scale: 0.97 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/[0.15] bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
          onClick={() => { navigator.clipboard.writeText('<!-- KeGo SVG Logo -->'); toast.success('SVG copied!') }}
        >
          <Copy className="size-4" />Copy SVG
        </motion.button>
        <motion.button
          whileHover={shouldReduce ? {} : { scale: 1.03 }}
          whileTap={shouldReduce ? {} : { scale: 0.97 }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white/60 hover:text-white transition-colors"
        >
          View Guidelines<ChevronRight className="size-4" />
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="text-xs tracking-widest uppercase font-medium">Scroll</div>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </div>
  )
}

// ─── LOGO SHOWCASE ────────────────────────────────────────────────────────────
const logoVariants = [
  { label: 'Primary', bg: '#0F0F11', border: 'border-white/[0.08]', mono: false, inverted: false, dark: true },
  { label: 'Light Background', bg: '#F8FAFC', border: 'border-black/[0.06]', mono: false, inverted: false, dark: false },
  { label: 'Dark Monochrome', bg: '#0F0F11', border: 'border-white/[0.08]', mono: true, inverted: true, dark: true },
  { label: 'White on Black', bg: '#000000', border: 'border-white/[0.06]', mono: true, inverted: true, dark: true },
]

function LogoShowcase() {
  const shouldReduce = useReducedMotion()
  return (
    <Section>
      <SectionLabel number="02" label="Logo System" />
      <SectionTitle>Logo Showcase</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        The Kego wordmark and symbol system — designed for every context, background, and scale.
      </motion.p>

      <motion.div
        variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {logoVariants.map((v) => (
          <motion.div
            key={v.label}
            variants={fadeUp}
            whileHover={shouldReduce ? {} : { y: -6, scale: 1.01 }}
            className="group relative rounded-2xl border overflow-hidden cursor-pointer"
            style={{ background: v.bg, borderColor: v.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
          >
            <div className="flex flex-col items-center justify-center py-14 px-8 gap-4">
              <KegoMark size={72} mono={v.mono} inverted={v.inverted} />
              <div className={`flex flex-col items-center gap-1 ${v.dark ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-2xl font-black tracking-widest">KEGO</span>
                <span className={`text-xs tracking-[0.25em] font-medium ${v.dark ? 'text-white/40' : 'text-gray-400'}`}>
                  SIMPLIFY • ORGANIZE • GROW
                </span>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
              <CopyBtn text="<svg><!-- KeGo Logo --></svg>" label="Copy SVG" />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-black transition-all"
              >
                <Download className="size-3" />Download PNG
              </motion.button>
            </div>

            <div className={`absolute bottom-3 left-4 text-xs font-medium tracking-wide ${v.dark ? 'text-white/30' : 'text-gray-400'}`}>
              {v.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// ─── APP ICON ─────────────────────────────────────────────────────────────────
const iconSizes = [1024, 512, 180, 120, 87, 60, 40, 29, 20]
const cornerModes = [
  { label: 'iOS', factor: 0.22 },
  { label: 'Android', factor: 0.18 },
  { label: 'Square', factor: 0 },
]

function AppIconSection() {
  const [previewSize, setPreviewSize] = useState(120)
  const [selectedSize, setSelectedSize] = useState(1024)
  const [cornerMode, setCornerMode] = useState(0)
  const shouldReduce = useReducedMotion()

  const radius = previewSize * cornerModes[cornerMode].factor

  return (
    <Section>
      <SectionLabel number="03" label="App Icon" />
      <SectionTitle>App Icon</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        Instantly recognizable at any size. Built for iOS, Android, and the web.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Live Preview */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-col items-center gap-6 p-10 rounded-2xl border border-white/[0.06] bg-white/[0.03]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${previewSize}-${cornerMode}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <AppIcon size={previewSize} radius={radius} />
            </motion.div>
          </AnimatePresence>

          <div className="text-center">
            <p className="text-white/80 font-semibold">{previewSize}×{previewSize}</p>
            <p className="text-white/30 text-sm">px</p>
          </div>

          {/* Size slider */}
          <div className="w-full space-y-2">
            <label className="text-xs text-white/30 tracking-widest uppercase">Preview Size</label>
            <input
              type="range" min={20} max={200} step={1} value={previewSize}
              onChange={(e) => setPreviewSize(+e.target.value)}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-white/20">
              <span>20px</span><span>200px</span>
            </div>
          </div>

          {/* Corner mode */}
          <div className="flex gap-2">
            {cornerModes.map((m, i) => (
              <button
                key={m.label}
                onClick={() => setCornerMode(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cornerMode === i ? 'bg-purple-600 text-white' : 'bg-white/[0.05] text-white/40 hover:text-white/70'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Size grid */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-sm font-semibold tracking-widest uppercase text-white/30">All Sizes — iOS Guide</h3>
          <div className="flex flex-wrap gap-4">
            {iconSizes.map((s) => (
              <motion.button
                key={s}
                onClick={() => { setSelectedSize(s); setPreviewSize(Math.min(s, 200)) }}
                whileHover={shouldReduce ? {} : { scale: 1.06 }}
                whileTap={shouldReduce ? {} : { scale: 0.95 }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedSize === s ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'}`}
              >
                <AppIcon size={Math.max(Math.min(s * 0.12, 48), 16)} radius={Math.max(Math.min(s * 0.12, 48) * 0.22, 3)} />
                <div className="text-center">
                  <p className="text-xs font-medium text-white/70">{s}×{s}</p>
                  {s === 1024 && <p className="text-[10px] text-white/30">App Store</p>}
                  {s === 60 && <p className="text-[10px] text-white/30">Home</p>}
                  {s === 29 && <p className="text-[10px] text-white/30">Settings</p>}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

// ─── ADAPTIVE BACKGROUNDS ────────────────────────────────────────────────────
const bgOptions = [
  { label: 'Black', color: '#000000', text: 'dark' },
  { label: 'White', color: '#FFFFFF', text: 'light' },
  { label: 'Purple', color: '#7C3AED', text: 'dark' },
  { label: 'Orange', color: '#F97316', text: 'dark' },
  { label: 'Gradient', color: 'linear-gradient(135deg, #7C3AED, #F97316)', text: 'dark' },
  { label: 'Dark', color: '#161622', text: 'dark' },
  { label: 'Navy', color: '#0F172A', text: 'dark' },
  { label: 'Light', color: '#F8FAFC', text: 'light' },
]

function AdaptiveSection() {
  const [active, setActive] = useState(0)

  return (
    <Section>
      <SectionLabel number="04" label="Adaptability" />
      <SectionTitle>Adaptive Backgrounds</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        The Kego icon performs confidently on any surface.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Main preview */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-col items-center justify-center p-16 rounded-2xl border border-white/[0.06] overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
              style={{ background: bgOptions[active].color }}
            />
          </AnimatePresence>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <AppIcon size={120} bg="transparent" radius={0} />
            <p className={`text-sm font-semibold tracking-widest uppercase ${bgOptions[active].text === 'dark' ? 'text-white/50' : 'text-black/40'}`}>
              {bgOptions[active].label}
            </p>
          </div>
        </motion.div>

        {/* Swatch grid */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-4 gap-3"
        >
          {bgOptions.map((bg, i) => (
            <motion.button
              key={bg.label}
              variants={fadeUp}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all overflow-hidden ${active === i ? 'border-purple-500' : 'border-transparent hover:border-white/20'}`}
              style={{ background: bg.color }}
            >
              <AppIcon size={28} bg="transparent" radius={0} />
            </motion.button>
          ))}
          {bgOptions.map((bg) => (
            <p key={`label-${bg.label}`} className="text-center text-xs text-white/30">{bg.label}</p>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

// ─── BRAND MEANING ────────────────────────────────────────────────────────────
const meanings = [
  { icon: '◼', stroke: 'from-purple-600 to-indigo-500', title: 'K Shape', desc: 'Represents Kego, clarity, and structure. The strong vertical stem anchors the identity.', color: '#7C3AED' },
  { icon: '◥', stroke: 'from-purple-500 to-orange-500', title: 'Flowing Strokes', desc: 'Symbolize motion, productivity, and progress. The diagonal arms represent forward momentum.', color: '#8B5CF6' },
  { icon: '●', stroke: 'from-orange-500 to-amber-400', title: 'Dot / Connection', desc: 'Represents the user, focus, and human + AI connection. A node of intelligence.', color: '#F97316' },
  { icon: '▓', stroke: 'from-orange-500 to-yellow-400', title: 'Gradient Colors', desc: 'Balance of innovation (purple) and energy (orange). Two forces in harmony.', color: '#FBBF24' },
]

function BrandMeaning() {
  return (
    <Section>
      <SectionLabel number="05" label="Identity" />
      <SectionTitle>Logo Meaning</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-16 max-w-xl">
        Every curve, stroke, and gradient carries intent. Nothing is arbitrary.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {meanings.map((m, i) => (
          <motion.div
            key={m.title}
            variants={fadeUp}
            custom={i * 0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex gap-5 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group"
          >
            <div className="flex-shrink-0">
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${m.color}30, ${m.color}10)`, border: `1px solid ${m.color}30` }}
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <div className={`bg-gradient-to-br ${m.stroke} rounded`} style={{ width: 24, height: 24 }} />
              </motion.div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1.5">{m.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Equation */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="mt-12 flex flex-wrap items-center justify-center gap-4 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
      >
        {[
          { el: <div className="w-8 h-16 rounded-full" style={{ background: 'linear-gradient(180deg,#7C3AED,#6366F1)' }} />, label: 'Stem' },
          { el: <span className="text-2xl text-white/20 font-light">+</span>, label: '' },
          { el: <div className="w-14 h-6 rounded-full" style={{ background: 'linear-gradient(135deg,#8B5CF6,#F97316)', transform: 'rotate(-35deg)' }} />, label: 'Upper Arm' },
          { el: <span className="text-2xl text-white/20 font-light">+</span>, label: '' },
          { el: <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg,#FB923C,#F97316)' }} />, label: 'Dot' },
          { el: <span className="text-2xl text-white/20 font-light">=</span>, label: '' },
          { el: <KegoMark size={48} />, label: 'Kego' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center h-16 w-16">{item.el}</div>
            {item.label && <span className="text-xs text-white/30 tracking-widest uppercase">{item.label}</span>}
          </div>
        ))}
      </motion.div>
    </Section>
  )
}

// ─── COLOR SYSTEM ─────────────────────────────────────────────────────────────
const colors = [
  { name: 'Purple 600', hex: '#7C3AED', rgb: 'rgb(124, 58, 237)', hsl: 'hsl(262, 83%, 58%)', css: '--color-purple-600', tw: 'purple-600' },
  { name: 'Indigo 500', hex: '#6366F1', rgb: 'rgb(99, 102, 241)', hsl: 'hsl(239, 84%, 67%)', css: '--color-indigo-500', tw: 'indigo-500' },
  { name: 'Orange 500', hex: '#F97316', rgb: 'rgb(249, 115, 22)', hsl: 'hsl(25, 95%, 53%)', css: '--color-orange-500', tw: 'orange-500' },
  { name: 'Amber 400', hex: '#FBBF24', rgb: 'rgb(251, 191, 36)', hsl: 'hsl(45, 93%, 58%)', css: '--color-amber-400', tw: 'amber-400' },
  { name: 'Dark 950', hex: '#0F0F11', rgb: 'rgb(15, 15, 17)', hsl: 'hsl(240, 6%, 6%)', css: '--color-dark-950', tw: 'slate-950' },
  { name: 'Surface 900', hex: '#1A1A2E', rgb: 'rgb(26, 26, 46)', hsl: 'hsl(240, 28%, 14%)', css: '--color-surface-900', tw: 'slate-900' },
]

function ColorSystem() {
  return (
    <Section>
      <SectionLabel number="06" label="Colors" />
      <SectionTitle>Color System</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        A minimal but expressive palette. Purple for innovation, orange for energy, dark for focus.
      </motion.p>

      {/* Gradient hero swatch */}
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="h-24 rounded-2xl mb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #7C3AED, #8B5CF6, #F97316, #FBBF24)' }}
      >
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <span className="text-white font-semibold text-sm tracking-widest">Brand Gradient</span>
          <CopyBtn text="linear-gradient(90deg, #7C3AED, #8B5CF6, #F97316, #FBBF24)" label="Copy CSS" />
        </div>
      </motion.div>

      {/* Color tokens */}
      <motion.div
        variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {colors.map((c) => (
          <motion.div
            key={c.name}
            variants={fadeUp}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] transition-all"
          >
            {/* Swatch */}
            <div className="h-20 w-full" style={{ background: c.hex }} />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{c.name}</p>
                <CopyBtn text={c.hex} label={c.hex} />
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'RGB', value: c.rgb },
                  { label: 'HSL', value: c.hsl },
                  { label: 'CSS', value: c.css },
                  { label: 'Tailwind', value: `text-${c.tw}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-white/30 font-medium w-16">{label}</span>
                    <span className="text-xs text-white/50 font-mono flex-1">{value}</span>
                    <CopyBtn text={value} label="" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────────
const typeScale = [
  { name: 'Display', size: '72px', weight: '800', tracking: '-0.04em', lh: '1.0', sample: 'The future of work' },
  { name: 'H1', size: '48px', weight: '700', tracking: '-0.02em', lh: '1.15', sample: 'Simplify your workflow' },
  { name: 'H2', size: '36px', weight: '700', tracking: '-0.01em', lh: '1.2', sample: 'Organize everything' },
  { name: 'H3', size: '24px', weight: '600', tracking: '0em', lh: '1.35', sample: 'Grow without limits' },
  { name: 'Body', size: '16px', weight: '400', tracking: '0em', lh: '1.65', sample: 'Kego helps modern teams simplify complex workflows and grow with clarity and speed.' },
  { name: 'Caption', size: '12px', weight: '500', tracking: '0.12em', lh: '1.5', sample: 'AI-POWERED PRODUCTIVITY PLATFORM' },
]

function TypographySection() {
  return (
    <Section>
      <SectionLabel number="07" label="Typography" />
      <SectionTitle>Type Scale</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        Inter — modern, legible, and expressive at every size and weight.
      </motion.p>

      <div className="space-y-0 rounded-2xl border border-white/[0.06] overflow-hidden">
        {typeScale.map((t, i) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            custom={i * 0.05}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-6 px-6 py-5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group"
          >
            <div className="w-20 flex-shrink-0">
              <p className="text-xs text-white/30 font-medium">{t.name}</p>
              <p className="text-xs text-white/20 font-mono">{t.size}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-white truncate"
                style={{ fontSize: Math.min(parseInt(t.size), 48), fontWeight: t.weight, letterSpacing: t.tracking, lineHeight: t.lh }}
              >
                {t.sample}
              </p>
            </div>
            <div className="hidden sm:flex gap-4 flex-shrink-0 text-xs text-white/20 font-mono">
              <span>W{t.weight}</span>
              <span>{t.tracking}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// ─── CONSTRUCTION GRID ────────────────────────────────────────────────────────
function ConstructionGrid() {
  const [showGrid, setShowGrid] = useState(true)

  return (
    <Section>
      <SectionLabel number="08" label="Construction" />
      <SectionTitle>Construction & Grid</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        Geometric precision. Every proportion is intentional.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grid canvas */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden p-8 flex items-center justify-center"
          style={{ minHeight: 320 }}
        >
          {/* Grid lines */}
          <AnimatePresence>
            {showGrid && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(99,102,241,0.12) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(99,102,241,0.12) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />
            )}
          </AnimatePresence>

          {/* Guide circles */}
          {showGrid && (
            <>
              <div className="absolute rounded-full border border-orange-500/20" style={{ width: 160, height: 160 }} />
              <div className="absolute rounded-full border border-purple-500/20" style={{ width: 240, height: 240 }} />
              {/* Safe area box */}
              <div className="absolute border border-blue-500/20" style={{ width: 180, height: 180 }} />
            </>
          )}

          <div className="relative z-10">
            <KegoMark size={120} />
          </div>

          {/* Annotations */}
          {showGrid && (
            <div className="absolute bottom-3 left-3 text-xs text-blue-400/60 font-mono">safe area</div>
          )}
        </motion.div>

        {/* Specs */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-col justify-between gap-6"
        >
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center gap-2 self-start px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/60 hover:text-white transition-colors"
          >
            {showGrid ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>

          <div className="space-y-3">
            {[
              { label: 'Minimum Size', value: '24×24px' },
              { label: 'Clear Space', value: '1× the dot diameter' },
              { label: 'Corner Radius (iOS)', value: '22% of width' },
              { label: 'Stroke Width', value: '16% of bounding box' },
              { label: 'Grid Unit', value: '8px base grid' },
              { label: 'Proportions', value: 'Golden ratio aligned' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                <span className="text-sm text-white/40">{label}</span>
                <span className="text-sm font-medium text-white/80 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

// ─── USAGE MOCKUPS ────────────────────────────────────────────────────────────
function MockupCard({ title, icon: Icon, children }: { title: string; icon: typeof Smartphone; children: React.ReactNode }) {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      variants={fadeUp}
      whileHover={shouldReduce ? {} : { y: -8, scale: 1.02 }}
      className="flex flex-col gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] transition-all cursor-pointer"
    >
      <div className="flex items-center gap-2 text-white/30">
        <Icon className="size-4" />
        <span className="text-xs font-semibold tracking-widest uppercase">{title}</span>
      </div>
      <div className="flex items-center justify-center py-6">{children}</div>
    </motion.div>
  )
}

function UsageMockups() {
  return (
    <Section>
      <SectionLabel number="09" label="Usage" />
      <SectionTitle>In the Wild</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        How Kego looks across platforms, devices, and contexts.
      </motion.p>

      <motion.div
        variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {/* iPhone */}
        <MockupCard title="iPhone Home Screen" icon={Smartphone}>
          <div className="relative w-28 bg-[#1C1C1E] rounded-[20px] border border-white/10 p-2 overflow-hidden">
            <div className="text-[8px] text-white/40 text-center mb-2">9:41</div>
            <div className="grid grid-cols-4 gap-1.5">
              <AppIcon size={22} radius={5} /><AppIcon size={22} bg="#E53935" radius={5} /><AppIcon size={22} bg="#1976D2" radius={5} /><AppIcon size={22} bg="#2E7D32" radius={5} />
              <AppIcon size={22} bg="#F9A825" radius={5} /><AppIcon size={22} bg="#6A1B9A" radius={5} /><AppIcon size={22} bg="#00838F" radius={5} /><AppIcon size={22} bg="#37474F" radius={5} />
            </div>
          </div>
        </MockupCard>

        {/* App Store */}
        <MockupCard title="App Store" icon={Package}>
          <div className="w-32 bg-[#1C1C1E] rounded-xl border border-white/10 p-3 space-y-2">
            <AppIcon size={40} radius={10} />
            <p className="text-white text-xs font-semibold">Kego</p>
            <p className="text-white/30 text-[9px]">Productivity</p>
            <div className="bg-blue-500 rounded-full text-white text-[9px] font-bold px-3 py-0.5 text-center">GET</div>
          </div>
        </MockupCard>

        {/* Watch */}
        <MockupCard title="Apple Watch" icon={Watch}>
          <div className="relative">
            <div className="w-16 h-20 bg-black rounded-2xl border-2 border-[#3A3A3C] flex items-center justify-center">
              <AppIcon size={28} radius={6} />
            </div>
          </div>
        </MockupCard>

        {/* Browser Tab */}
        <MockupCard title="Browser Tab" icon={Globe}>
          <div className="w-48 bg-[#2C2C2E] rounded-t-lg border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1C1C1E]">
              <AppIcon size={12} radius={2} />
              <span className="text-white/60 text-[10px] truncate">Kego — Simplify</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-white/20" />
            </div>
            <div className="h-8 bg-[#161618]" />
          </div>
        </MockupCard>

        {/* Notification */}
        <MockupCard title="Notification" icon={Bell}>
          <div className="w-52 bg-[#1C1C1E]/90 backdrop-blur-lg rounded-2xl border border-white/10 p-3 flex items-start gap-3">
            <AppIcon size={28} radius={6} />
            <div>
              <p className="text-white text-xs font-semibold">Kego</p>
              <p className="text-white/50 text-[10px]">Your project context is saved ✓</p>
            </div>
          </div>
        </MockupCard>

        {/* Dock */}
        <MockupCard title="macOS Dock" icon={Monitor}>
          <div className="flex items-end gap-1.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 px-3 py-1.5">
            {[20, 22, 20, 18].map((s, i) => (
              <div key={i} style={{ transform: i === 1 ? 'scale(1.4) translateY(-4px)' : '' }}>
                <AppIcon size={s} radius={s * 0.22} />
              </div>
            ))}
          </div>
        </MockupCard>
      </motion.div>
    </Section>
  )
}

// ─── DOWNLOADS ────────────────────────────────────────────────────────────────
const downloadItems = [
  { title: 'SVG Logo Pack', desc: 'Primary + all variations', size: '12 KB', type: 'SVG' },
  { title: 'PNG Pack', desc: 'All sizes, transparent BG', size: '2.4 MB', type: 'PNG' },
  { title: 'App Icon Set', desc: 'iOS + Android all sizes', size: '890 KB', type: 'ZIP' },
  { title: 'Brand Guide', desc: 'Complete guidelines PDF', size: '4.2 MB', type: 'PDF' },
  { title: 'Social Kit', desc: 'Covers, banners, avatars', size: '18 MB', type: 'ZIP' },
  { title: 'Press Kit', desc: 'Media & PR assets', size: '24 MB', type: 'ZIP' },
]

function Downloads() {
  const shouldReduce = useReducedMotion()

  return (
    <Section>
      <SectionLabel number="10" label="Assets" />
      <SectionTitle>Download Assets</SectionTitle>
      <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-white/50 text-lg mb-12 max-w-xl">
        Everything you need to use the Kego brand correctly and consistently.
      </motion.p>

      <motion.div
        variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {downloadItems.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            whileHover={shouldReduce ? {} : { y: -4 }}
            className="group flex flex-col p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(249,115,22,0.2))' }}>
                <Download className="size-5 text-purple-400" />
              </div>
              <span className="text-xs font-bold tracking-widest px-2 py-1 rounded-md bg-white/[0.06] text-white/40">{item.type}</span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-white/40 mb-1">{item.desc}</p>
            <p className="text-xs text-white/20 font-mono mb-6">{item.size}</p>
            <motion.button
              whileHover={shouldReduce ? {} : { scale: 1.02 }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white border border-white/[0.1] hover:border-purple-500/40 hover:bg-purple-500/10 transition-all"
              onClick={() => toast.success(`${item.title} download started`)}
            >
              <Download className="size-4" />Download
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function BrandFooter() {
  return (
    <footer className="relative py-24 px-6 text-center overflow-hidden border-t border-white/[0.04]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[18vw] font-black tracking-widest text-white/[0.025]">KEGO</span>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3">
        <KegoMark size={48} />
        <p className="text-sm font-semibold tracking-widest text-white/20 uppercase">Kego Brand Center</p>
        <p className="text-xs text-white/15">© 2026 Kego Inc. All brand assets reserved.</p>
        <p className="text-xs text-white/10">brand.kego.ai</p>
      </div>
    </footer>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function BrandPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Sticky Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 border-b border-white/[0.05]" style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)' }}>
        <Link href="/dashboard">
          <a className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />Back to App
          </a>
        </Link>
        <div className="flex items-center gap-2">
          <KegoMark size={20} />
          <span className="text-sm font-semibold tracking-widest text-white/60">BRAND CENTER</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #F97316)' }}
          onClick={() => toast.success('Preparing download…')}
        >
          <Download className="size-3.5" />Download All
        </motion.button>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14" />

      {/* Page sections */}
      <Hero />

      <div className="border-t border-white/[0.04]" />
      <LogoShowcase />

      <div className="border-t border-white/[0.04]" />
      <AppIconSection />

      <div className="border-t border-white/[0.04]" />
      <AdaptiveSection />

      <div className="border-t border-white/[0.04]" />
      <BrandMeaning />

      <div className="border-t border-white/[0.04]" />
      <ColorSystem />

      <div className="border-t border-white/[0.04]" />
      <TypographySection />

      <div className="border-t border-white/[0.04]" />
      <ConstructionGrid />

      <div className="border-t border-white/[0.04]" />
      <UsageMockups />

      <div className="border-t border-white/[0.04]" />
      <Downloads />

      <BrandFooter />
    </div>
  )
}
