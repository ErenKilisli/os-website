'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SPRING = { type: 'spring', stiffness: 380, damping: 28, mass: 0.9 } as const

const NAV_LINKS = [
  { label: 'Work',    href: '#projects', index: '01' },
  { label: 'About',   href: '#about',    index: '02' },
  { label: 'Contact', href: '#contact',  index: '03' },
]

const SOCIALS = [
  { label: 'GH',  href: 'https://github.com/erenkilisli' },
  { label: 'LI',  href: 'https://linkedin.com/in/erenkilisli' },
  { label: 'BE',  href: 'https://behance.net/erenkilisli' },
]

/* ── Collapsed pill content ───────────────────────────── */
function CollapsedContent() {
  return (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-between h-full px-5 gap-4 w-full"
    >
      {/* Initials */}
      <span
        className="text-[11px] tracking-[0.25em] uppercase"
        style={{ fontFamily: 'var(--font-mono)', color: '#f0f0f0' }}
      >
        EK
      </span>

      {/* Three dot indicator */}
      <div className="flex items-center gap-[5px]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block rounded-full"
            style={{ width: 5, height: 5, background: '#f0f0f0' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ── Expanded menu content ────────────────────────────── */
function ExpandedContent({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.08 }}
      className="flex flex-col h-full px-7 pt-5 pb-5 gap-1 w-full"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[9px] tracking-[0.4em] uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: '#666' }}
        >
          navigation
        </span>
        <button
          onClick={onClose}
          className="text-[11px] text-[#666] hover:text-[#f0f0f0] transition-colors duration-150"
          style={{ fontFamily: 'var(--font-mono)' }}
          aria-label="Close navigation"
        >
          ✕
        </button>
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-0.5 flex-1">
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            onClick={onClose}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.14 + i * 0.07, duration: 0.28 }}
            className="group flex items-center gap-3 py-1.5 rounded-lg px-2 -mx-2
                       hover:bg-white/5 transition-colors duration-150"
          >
            <span
              className="text-[9px] w-5 shrink-0"
              style={{ fontFamily: 'var(--font-mono)', color: '#00ffaa' }}
            >
              {link.index}
            </span>
            <span
              className="text-[13px] tracking-wide group-hover:text-[#00ffaa] transition-colors duration-150"
              style={{ fontFamily: 'var(--font-mono)', color: '#f0f0f0' }}
            >
              {link.label}
            </span>
          </motion.a>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/8 my-2" />

      {/* Social quick-links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42 }}
        className="flex gap-3"
      >
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#555] hover:text-[#00ffaa] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}
          >
            {s.label}
          </a>
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ── Main component ───────────────────────────────────── */
export function DynamicIsland() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
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

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed top-5 left-1/2 z-50 -translate-x-1/2"
      style={{ willChange: 'transform' }}
    >
      <motion.div
        /* Animate width/height with spring */
        animate={{
          width:  isOpen ? 320 : 164,
          height: isOpen ? 210 : 44,
        }}
        initial={{
          width:  164,
          height: 44,
        }}
        transition={SPRING}
        onClick={() => !isOpen && setIsOpen(true)}
        className="glass-pill overflow-hidden relative"
        style={{
          cursor: isOpen ? 'default' : 'pointer',
          /* Subtle inner highlight at the top */
          boxShadow: isOpen
            ? '0 0 0 1px rgba(0,255,170,0.15), inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)'
            : 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.4)',
        }}
        whileHover={!isOpen ? {
          boxShadow: '0 0 0 1px rgba(0,255,170,0.2), inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 30px rgba(0,0,0,0.5)',
          scale: 1.02,
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
