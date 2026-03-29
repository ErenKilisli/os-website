'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MatrixCanvas } from './MatrixCanvas'
import { FloatingIcons } from './FloatingIcons'

/* ── Animation variants ───────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.6 },
})

/* ── ENGINEER word ────────────────────────────────────── */
function EngineerText({ onHover }: { onHover: (v: boolean) => void }) {
  const [active, setActive] = useState(false)

  const enter = useCallback(() => { setActive(true);  onHover(true)  }, [onHover])
  const leave = useCallback(() => { setActive(false); onHover(false) }, [onHover])

  return (
    <motion.span
      className="block leading-none cursor-default select-none transition-all duration-300"
      style={{
        fontFamily:    'var(--font-mono)',
        fontWeight:    900,
        fontSize:      'clamp(3.2rem, 11.5vw, 13rem)',
        letterSpacing: '-0.02em',
        color:          active ? '#00ffaa' : '#f0f0f0',
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      /* Subtle scale on hover */
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {/* Normal white text — always rendered for layout */}
      <span
        style={{
          position:   'relative',
          display:    'inline-block',
        }}
      >
        {/* Background scanline mask layer — clips to text shape */}
        <span
          aria-hidden
          style={{
            position:     'absolute',
            inset:        0,
            display:      'block',
            backgroundImage: active
              ? 'repeating-linear-gradient(0deg, rgba(0,255,170,0.14) 0px, rgba(0,255,170,0.14) 1px, transparent 1px, transparent 4px)'
              : 'none',
            backgroundClip:         'text',
            WebkitBackgroundClip:   'text',
            color:                  'transparent',
            animationName:          active ? 'scanlines-drift' : 'none',
            animationDuration:      '0.15s',
            animationTimingFunction:'linear',
            animationIterationCount:'infinite',
            pointerEvents:          'none',
          }}
        >
          ENGINEER
        </span>
        ENGINEER
      </span>
    </motion.span>
  )
}

/* ── FILMMAKER word ───────────────────────────────────── */
function FilmmakerText({ onHover }: { onHover: (v: boolean) => void }) {
  const [active, setActive] = useState(false)

  const enter = useCallback(() => { setActive(true);  onHover(true)  }, [onHover])
  const leave = useCallback(() => { setActive(false); onHover(false) }, [onHover])

  return (
    <motion.span
      className="block leading-none cursor-default select-none transition-all duration-300"
      style={{
        fontFamily:    'var(--font-serif)',
        fontWeight:    900,
        fontStyle:     'italic',
        fontSize:      'clamp(2.8rem, 10vw, 11.5rem)',
        letterSpacing: '-0.01em',
        backgroundImage: active
          ? 'linear-gradient(135deg, #ff6b35 0%, #ffcc02 42%, #ff9a6c 80%, #ff6b35 100%)'
          : 'none',
        backgroundClip:       active ? 'text' : undefined,
        WebkitBackgroundClip: active ? 'text' : undefined,
        color:                 active ? 'transparent' : '#f0f0f0',
        backgroundSize:        '200% 200%',
        animationName:         active ? 'gradient-shift' : 'none',
        animationDuration:     '3s',
        animationTimingFunction: 'ease',
        animationIterationCount: 'infinite',
        textShadow: active
          ? '0 0 10px rgba(255,107,53,0.5), 0 0 30px rgba(255,107,53,0.25)'
          : 'none',
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      FILMMAKER
    </motion.span>
  )
}

/* ── Scroll indicator ─────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      {...fadeIn(1.8)}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
    >
      <span
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '9px',
          letterSpacing: '0.35em',
          color:         '#555',
          textTransform: 'uppercase',
        }}
      >
        scroll
      </span>
      <div className="w-px h-10 overflow-hidden">
        <motion.div
          className="w-px h-full scroll-line"
          style={{ background: 'linear-gradient(to bottom, #555, transparent)' }}
        />
      </div>
    </motion.div>
  )
}

/* ── Hero section ─────────────────────────────────────── */
export function Hero() {
  const [engineerHover, setEngineerHover] = useState(false)
  const [filmHover,     setFilmHover]     = useState(false)

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* 1 — Matrix rain canvas: low-opacity base, intensifies on ENGINEER hover */}
      <MatrixCanvas intensity={engineerHover ? 0.55 : 0.11} />

      {/* 2 — Film grain overlay: activates on FILMMAKER hover */}
      {filmHover && (
        <div className="film-grain absolute inset-0 pointer-events-none z-[1]" aria-hidden />
      )}

      {/* 3 — Floating magnetic icons */}
      <FloatingIcons />

      {/* 4 — Radial vignette to keep text readable */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(5,5,5,0.7) 100%)',
        }}
      />

      {/* 5 — Main typography */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">

        {/* Overline — site identity */}
        <motion.p
          {...fadeIn(0.4)}
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            letterSpacing: '0.45em',
            color:         '#555',
            textTransform: 'uppercase',
            marginBottom:  '2.5rem',
          }}
        >
          himerenkilisli.com &nbsp;·&nbsp; Istanbul
        </motion.p>

        {/* ENGINEER */}
        <motion.div {...fadeUp(0.55)}>
          <EngineerText onHover={setEngineerHover} />
        </motion.div>

        {/* Divider glyph */}
        <motion.div
          {...fadeIn(0.85)}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize:   'clamp(1.5rem, 3vw, 3.5rem)',
            color:      engineerHover ? '#00ffaa' : filmHover ? '#ff6b35' : '#333',
            margin:     '0.2em 0',
            lineHeight: 1,
            transition: 'color 0.4s ease',
          }}
        >
          ✦
        </motion.div>

        {/* FILMMAKER */}
        <motion.div {...fadeUp(0.65)}>
          <FilmmakerText onHover={setFilmHover} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          {...fadeIn(1.15)}
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            letterSpacing: '0.3em',
            color:         '#555',
            textTransform: 'uppercase',
            marginTop:     '2.5rem',
          }}
        >
          Product &nbsp;/&nbsp; Code &nbsp;/&nbsp; Film &nbsp;/&nbsp; Frame
        </motion.p>

        {/* CTA */}
        <motion.div
          {...fadeIn(1.4)}
          className="mt-10 flex items-center gap-6"
        >
          <a
            href="#projects"
            data-cursor
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         '#f0f0f0',
              textDecoration:'none',
              paddingBottom: '2px',
              borderBottom:  '1px solid rgba(240,240,240,0.3)',
              transition:    'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLAnchorElement
              t.style.color       = '#00ffaa'
              t.style.borderColor = '#00ffaa'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLAnchorElement
              t.style.color       = '#f0f0f0'
              t.style.borderColor = 'rgba(240,240,240,0.3)'
            }}
          >
            View Work
          </a>

          <span style={{ color: '#333', fontSize: '10px' }}>—</span>

          <a
            href="#contact"
            data-cursor
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         '#555',
              textDecoration:'none',
              transition:    'color 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ff6b35' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#555' }}
          >
            Say Hello
          </a>
        </motion.div>
      </div>

      {/* 6 — Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
