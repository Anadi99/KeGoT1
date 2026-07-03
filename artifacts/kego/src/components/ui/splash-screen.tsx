import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  visible: boolean
}

/**
 * Full-screen splash shown on first load.
 * Uses the branded Splash Screen Background.png asset.
 */
export function SplashScreen({ visible }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundImage: 'url(/Splash Screen Background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.img
              src="/Shinylogo.jpg"
              alt="Kego"
              className="h-28 w-auto object-contain rounded-2xl"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: 'drop-shadow(0 0 40px rgba(124,58,237,0.6))' }}
            />

            {/* Wordmark */}
            <motion.img
              src="/logo-primary.png"
              alt="Kego"
              className="h-8 w-auto object-contain"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />

            {/* Tagline */}
            <motion.p
              className="text-xs font-semibold tracking-[0.35em] text-white/50 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Simplify • Organize • Grow
            </motion.p>

            {/* Loading dots */}
            <motion.div
              className="flex gap-1.5 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/40"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
