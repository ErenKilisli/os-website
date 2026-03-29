'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

const SPRING = { type: 'spring', stiffness: 360, damping: 28, mass: 0.85 } as const

const SOCIALS = [
  { label: 'LinkedIn',    href: 'https://linkedin.com/in/erenkilisli',  short: 'LI' },
  { label: 'GitHub',      href: 'https://github.com/erenkilisli',       short: 'GH' },
  { label: 'Behance',     href: 'https://behance.net/erenkilisli',      short: 'BE' },
  { label: 'Geeknasyon',  href: 'https://geeknasyon.com',              short: 'GN' },
]

/* ── Collapsed button content ─────────────────────────── */
function ClosedContent() {
  return (
    <motion.div
      key="closed"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none"
    >
      <span
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '9px',
          letterSpacing: '0.1em',
          color:         '#f0f0f0',
          lineHeight:    1,
        }}
      >
        Let&apos;s
      </span>
      <span
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '9px',
          letterSpacing: '0.1em',
          color:         '#00ffaa',
          lineHeight:    1,
        }}
      >
        talk.
      </span>
    </motion.div>
  )
}

/* ── Expanded panel content ───────────────────────────── */
function OpenContent({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="open"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.12 }}
      className="absolute inset-0 flex flex-col justify-between px-7 pt-6 pb-6"
    >
      {/* Close */}
      <div className="flex justify-between items-center">
        <span
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '9px',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color:         'rgba(240,240,240,0.35)',
          }}
        >
          Contact
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   '11px',
            color:      'rgba(240,240,240,0.35)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f0f0f0' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,240,240,0.35)' }}
          aria-label="Close contact panel"
        >
          ✕
        </button>
      </div>

      {/* Email CTA */}
      <motion.a
        href="mailto:ibr@himerenkilisli.com"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="block group"
        style={{ textDecoration: 'none' }}
      >
        <p
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '9px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'rgba(240,240,240,0.3)',
            marginBottom:  '6px',
          }}
        >
          Email
        </p>
        <p
          className="transition-colors duration-200 group-hover:text-[#00ffaa]"
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'clamp(0.75rem, 1.3vw, 1rem)',
            color:         '#f0f0f0',
            letterSpacing: '-0.01em',
            lineHeight:    1.2,
          }}
        >
          ibr@himerenkilisli.com
        </p>
      </motion.a>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.28, duration: 0.4, ease: 'easeOut' }}
        style={{
          height:          1,
          background:      'rgba(255,255,255,0.07)',
          transformOrigin: 'left',
        }}
      />

      {/* Social links */}
      <div className="flex items-center gap-4">
        {SOCIALS.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 + i * 0.055, duration: 0.25 }}
            className="flex flex-col items-center gap-1 group"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="transition-colors duration-150 group-hover:text-[#00ffaa]"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.12em',
                color:         'rgba(240,240,240,0.5)',
              }}
            >
              {s.short}
            </span>
            <span
              className="transition-colors duration-150 group-hover:text-[#f0f0f0]"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '8px',
                letterSpacing: '0.08em',
                color:         'rgba(240,240,240,0.2)',
              }}
            >
              {s.label}
            </span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Main FAB ─────────────────────────────────────────── */
export function ContactFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)

  /* Magnetic effect (only when closed) */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 200, damping: 20 })
  const sy = useSpring(my, { stiffness: 200, damping: 20 })

  const onMouseMove = (e: React.MouseEvent) => {
    if (isOpen) return
    const rect = fabRef.current!.getBoundingClientRect()
    mx.set((e.clientX - (rect.left + rect.width  / 2)) * 0.32)
    my.set((e.clientY - (rect.top  + rect.height / 2)) * 0.32)
  }
  const onMouseLeave = () => { mx.set(0); my.set(0) }

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <motion.div
      ref={fabRef}
      /* Magnetic translation (only effective when closed) */
      style={{
        x:        isOpen ? 0 : sx,
        y:        isOpen ? 0 : sy,
        position: 'fixed',
        bottom:   '2.5rem',
        left:     '50%',
        translateX: '-50%',
        zIndex:   40,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Pulse ring (only when closed) ── */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(0,255,170,0.25)' }}
          animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeOut' }}
        />
      )}

      {/* ── FAB shell ── */}
      <motion.div
        animate={{
          width:        isOpen ? 400 : 80,
          height:       isOpen ? 190 : 80,
          borderRadius: isOpen ? 20  : 40,
        }}
        initial={{ width: 80, height: 80, borderRadius: 40 }}
        transition={SPRING}
        onClick={() => !isOpen && setIsOpen(true)}
        className="glass relative overflow-hidden"
        style={{
          cursor:     isOpen ? 'default' : 'pointer',
          boxShadow:  isOpen
            ? '0 0 0 1px rgba(0,255,170,0.15), 0 24px 64px rgba(0,0,0,0.6)'
            : '0 0 0 1px rgba(0,255,170,0.12), 0 8px 32px rgba(0,0,0,0.5)',
        }}
        whileHover={!isOpen ? {
          scale:     1.06,
          boxShadow: '0 0 0 1px rgba(0,255,170,0.3), 0 12px 40px rgba(0,0,0,0.55)',
        } : {}}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen
            ? <OpenContent onClose={() => setIsOpen(false)} />
            : <ClosedContent />
          }
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
