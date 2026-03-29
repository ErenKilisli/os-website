'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Constants ────────────────────────────────────────── */
const SPRING = { type: 'spring', stiffness: 420, damping: 32, mass: 0.75 } as const

const PILL_H        = 44   // px — never changes
const PILL_W_CLOSED = 164
const PILL_W_OPEN   = 420  // stretches sideways, iOS Dynamic Island style

const NAV_LINKS = [
  { label: 'Work',    href: '#projects' },
  { label: 'About',   href: '#about'    },
  { label: 'Contact', href: '#contact'  },
]

const SOCIALS = [
  { label: 'GH', href: 'https://github.com/erenkilisli'      },
  { label: 'LI', href: 'https://linkedin.com/in/erenkilisli' },
  { label: 'BE', href: 'https://behance.net/erenkilisli'      },
]

/* ── Collapsed state ──────────────────────────────────── */
function CollapsedContent() {
  return (
    <motion.div
      key="closed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      /* absolute so it doesn't affect pill size */
      className="absolute inset-0 flex items-center justify-between px-5 pointer-events-none"
    >
      <span
        className="text-[11px] tracking-[0.28em] uppercase"
        style={{ fontFamily: 'var(--font-mono)', color: '#f0f0f0' }}
      >
        EK
      </span>

      <div className="flex items-center gap-[5px]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block rounded-full"
            style={{ width: 5, height: 5, background: '#f0f0f0' }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.22, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ── Expanded state (horizontal row) ─────────────────── */
function ExpandedContent({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="open"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, delay: 0.08 }}
      className="absolute inset-0 flex items-center px-5 gap-0 whitespace-nowrap overflow-hidden"
    >
      {/* Brand mark */}
      <span
        className="text-[11px] tracking-[0.28em] uppercase shrink-0"
        style={{ fontFamily: 'var(--font-mono)', color: '#f0f0f0' }}
      >
        EK
      </span>

      {/* Separator */}
      <div className="w-px h-[18px] mx-4 shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }} />

      {/* Nav links */}
      <div className="flex items-center gap-0.5">
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            onClick={(e) => { e.stopPropagation(); onClose() }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.24 }}
            className="px-3 py-1 rounded-full transition-all duration-150"
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              letterSpacing: '0.06em',
              color:         'rgba(240,240,240,0.65)',
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLAnchorElement
              t.style.color      = '#00ffaa'
              t.style.background = 'rgba(0,255,170,0.06)'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLAnchorElement
              t.style.color      = 'rgba(240,240,240,0.65)'
              t.style.background = 'transparent'
            }}
          >
            {link.label}
          </motion.a>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-[18px] mx-4 shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }} />

      {/* Social links */}
      <div className="flex items-center gap-3">
        {SOCIALS.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.26 + i * 0.055 }}
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '10px',
              letterSpacing: '0.18em',
              color:         'rgba(240,240,240,0.35)',
              transition:    'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#00ffaa' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,240,240,0.35)' }}
          >
            {s.label}
          </motion.a>
        ))}
      </div>

      {/* Close */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42 }}
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="ml-5 shrink-0 transition-colors duration-150"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   '10px',
          color:      'rgba(240,240,240,0.3)',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f0f0f0' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(240,240,240,0.3)' }}
        aria-label="Close navigation"
      >
        ✕
      </motion.button>
    </motion.div>
  )
}

/* ── Main component ───────────────────────────────────── */
export function DynamicIsland() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
    <div
      ref={containerRef}
      className="fixed top-5 left-1/2 z-50"
      style={{ transform: 'translateX(-50%)', willChange: 'transform' }}
    >
      <motion.div
        /* Only width animates — height stays fixed = pill stays a pill */
        animate={{ width: isOpen ? PILL_W_OPEN : PILL_W_CLOSED }}
        initial={{ width: PILL_W_CLOSED }}
        transition={SPRING}
        onClick={() => !isOpen && setIsOpen(true)}
        className="glass-pill relative overflow-hidden"
        style={{
          height: PILL_H,
          cursor: isOpen ? 'default' : 'pointer',
          boxShadow: isOpen
            ? '0 0 0 1px rgba(0,255,170,0.18), inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 48px rgba(0,0,0,0.55)'
            : 'inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 24px rgba(0,0,0,0.45)',
        }}
        whileHover={!isOpen ? {
          scale: 1.025,
          boxShadow: '0 0 0 1px rgba(0,255,170,0.14), inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.5)',
        } : {}}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen
            ? <ExpandedContent onClose={() => setIsOpen(false)} />
            : <CollapsedContent />
          }
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
