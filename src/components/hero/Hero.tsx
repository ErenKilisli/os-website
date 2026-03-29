'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MatrixCanvas } from './MatrixCanvas'
import { FloatingIcons } from './FloatingIcons'

/* ── Animation helpers ────────────────────────────────── */
const fadeIn = (delay = 0) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { delay, duration: 0.6 },
})

const slideUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 60 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
})

/* ── ENGINEER — bottom-left, monospace, matrix hover ─── */
function EngineerText({ onHover }: { onHover: (v: boolean) => void }) {
  const [active, setActive] = useState(false)

  const enter = useCallback(() => { setActive(true);  onHover(true)  }, [onHover])
  const leave = useCallback(() => { setActive(false); onHover(false) }, [onHover])

  return (
    <motion.div
      {...slideUp(0.5)}
      style={{
        /* Anchor to bottom-left via parent absolute layout */
        lineHeight:    0.88,
        cursor:        'default',
        userSelect:    'none',
        letterSpacing: '-0.03em',
        fontFamily:    'var(--font-mono)',
        fontWeight:    900,
        /* clamp(4.5rem | 13.5vw | 15rem) */
        fontSize:      'clamp(4.5rem, 13.5vw, 15rem)',
        color:         active ? '#00ffaa' : '#f0f0f0',
        transition:    'color 0.25s ease',
        whiteSpace:    'nowrap',
        position:      'relative',
        display:       'inline-block',
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      whileHover={{ scale: 1.008, transition: { type: 'spring', stiffness: 320, damping: 26 } }}
    >
      {/* Scanline overlay — clips to text shape */}
      {active && (
        <span
          aria-hidden
          style={{
            position:    'absolute',
            inset:       0,
            display:     'block',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,170,0.13) 0px, rgba(0,255,170,0.13) 1px, transparent 1px, transparent 4px)',
            backgroundClip:         'text',
            WebkitBackgroundClip:   'text',
            color:                  'transparent',
            animationName:          'scanlines-drift',
            animationDuration:      '0.15s',
            animationTimingFunction:'linear',
            animationIterationCount:'infinite',
            pointerEvents:          'none',
          }}
        >
          ENGINEER
        </span>
      )}
      {/* Glow layer */}
      {active && (
        <span
          aria-hidden
          style={{
            position:   'absolute',
            inset:      0,
            display:    'block',
            color:      '#00ffaa',
            filter:     'blur(18px)',
            opacity:    0.25,
            pointerEvents: 'none',
          }}
        >
          ENGINEER
        </span>
      )}
      ENGINEER
    </motion.div>
  )
}

/* ── FILMMAKER — bottom-right, serif italic, film hover ─ */
function FilmmakerText({ onHover }: { onHover: (v: boolean) => void }) {
  const [active, setActive] = useState(false)

  const enter = useCallback(() => { setActive(true);  onHover(true)  }, [onHover])
  const leave = useCallback(() => { setActive(false); onHover(false) }, [onHover])

  return (
    <motion.div
      {...slideUp(0.65)}
      style={{
        lineHeight:    0.88,
        cursor:        'default',
        userSelect:    'none',
        letterSpacing: '-0.02em',
        fontFamily:    'var(--font-serif)',
        fontWeight:    900,
        fontStyle:     'italic',
        /* clamp(4rem | 12vw | 13.5rem) */
        fontSize:      'clamp(4rem, 12vw, 13.5rem)',
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
          ? '0 0 12px rgba(255,107,53,0.45), 0 0 40px rgba(255,107,53,0.18)'
          : 'none',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      whileHover={{ scale: 1.006, transition: { type: 'spring', stiffness: 320, damping: 26 } }}
    >
      FILMMAKER
    </motion.div>
  )
}

/* ── Upper center — name + subtitle + glyph ──────────── */
function UpperContent({
  engineerHover, filmHover,
}: {
  engineerHover: boolean
  filmHover: boolean
}) {
  return (
    <div
      className="absolute"
      style={{
        /* Sits in the upper-center band, below navbar */
        top:       '50%',
        left:      '50%',
        transform: 'translate(-50%, -50%)',
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign:  'center',
        gap:        0,
        pointerEvents: 'none',
        zIndex:     10,
      }}
    >
      {/* Site marker */}
      <motion.p
        {...fadeIn(0.35)}
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      9,
          letterSpacing: '0.45em',
          color:         '#444',
          textTransform: 'uppercase',
          marginBottom:  '1.8rem',
        }}
      >
        himerenkilisli.com &nbsp;·&nbsp; Istanbul
      </motion.p>

      {/* Name */}
      <motion.h1
        {...slideUp(0.45)}
        style={{
          fontFamily:    'var(--font-serif)',
          fontWeight:    400,
          fontStyle:     'italic',
          /* clamp(1.4rem | 3vw | 3rem) */
          fontSize:      'clamp(1.4rem, 3vw, 3rem)',
          letterSpacing: '0.01em',
          color:         'rgba(240,240,240,0.80)',
          lineHeight:    1.1,
          marginBottom:  '0.5rem',
        }}
      >
        Ibrahim Erenkilisli
      </motion.h1>

      {/* Glyph — reacts to hover state */}
      <motion.div
        {...fadeIn(0.7)}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize:   'clamp(1.1rem, 2.2vw, 2rem)',
          color:      engineerHover ? '#00ffaa' : filmHover ? '#ff6b35' : 'rgba(240,240,240,0.18)',
          transition: 'color 0.35s ease',
          lineHeight: 1,
          margin:     '0.5rem 0',
        }}
        aria-hidden
      >
        ✦
      </motion.div>

      {/* Subtitle */}
      <motion.p
        {...fadeIn(0.85)}
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      10,
          letterSpacing: '0.32em',
          color:         '#3a3a3a',
          textTransform: 'uppercase',
          marginTop:     '0.6rem',
        }}
      >
        Product &nbsp;·&nbsp; Code &nbsp;·&nbsp; Film &nbsp;·&nbsp; Frame
      </motion.p>

      {/* CTA row */}
      <motion.div
        {...fadeIn(1.1)}
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        24,
          marginTop:  '2.5rem',
        }}
      >
        <CTALink href="#projects" accent="#00ffaa">View Work</CTALink>
        <span style={{ color: '#2a2a2a', fontSize: 10 }}>—</span>
        <CTALink href="#contact" accent="#ff6b35">Say Hello</CTALink>
      </motion.div>
    </div>
  )
}

function CTALink({
  href, accent, children,
}: {
  href: string; accent: string; children: React.ReactNode
}) {
  return (
    <a
      href={href}
      style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color:         'rgba(240,240,240,0.45)',
        textDecoration:'none',
        paddingBottom: '2px',
        borderBottom:  '1px solid rgba(240,240,240,0.15)',
        transition:    'color 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const t = e.currentTarget as HTMLAnchorElement
        t.style.color        = accent
        t.style.borderColor  = accent
      }}
      onMouseLeave={(e) => {
        const t = e.currentTarget as HTMLAnchorElement
        t.style.color        = 'rgba(240,240,240,0.45)'
        t.style.borderColor  = 'rgba(240,240,240,0.15)'
      }}
    >
      {children}
    </a>
  )
}

/* ── Scroll indicator ─────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      {...fadeIn(1.8)}
      className="absolute"
      style={{
        bottom: 32,
        left:   '50%',
        transform: 'translateX(-50%)',
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      8,
          letterSpacing: '0.38em',
          color:         '#3a3a3a',
          textTransform: 'uppercase',
        }}
      >
        scroll
      </span>
      <div style={{ width: 1, height: 36, overflow: 'hidden' }}>
        <div
          className="scroll-line"
          style={{
            width:      1,
            height:     '100%',
            background: 'linear-gradient(to bottom, #3a3a3a, transparent)',
          }}
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
      style={{
        position:   'relative',
        height:     '100svh',    /* small viewport units — handles iOS chrome */
        width:      '100%',
        overflow:   'hidden',
        /* Offset for fixed navbar */
        paddingTop: 64,
      }}
    >
      {/* ── Matrix canvas — intensifies on ENGINEER hover ── */}
      <MatrixCanvas intensity={engineerHover ? 0.55 : 0.11} />

      {/* ── Film grain — activates on FILMMAKER hover ── */}
      {filmHover && (
        <div
          className="film-grain"
          style={{
            position:      'absolute',
            inset:         0,
            pointerEvents: 'none',
            zIndex:        1,
          }}
          aria-hidden
        />
      )}

      {/* ── Floating magnetic icons ── */}
      <FloatingIcons />

      {/* ── Radial vignette ── */}
      <div
        aria-hidden
        style={{
          position:      'absolute',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        2,
          background:
            'radial-gradient(ellipse 72% 65% at 50% 50%, transparent 28%, rgba(5,5,5,0.65) 100%)',
        }}
      />

      {/* ── Bottom vignette — ensures bottom text reads against dark ── */}
      <div
        aria-hidden
        style={{
          position:      'absolute',
          bottom:        0,
          left:          0,
          right:         0,
          height:        '38%',
          pointerEvents: 'none',
          zIndex:        3,
          background:    'linear-gradient(to top, rgba(5,5,5,0.82) 0%, transparent 100%)',
        }}
      />

      {/* ── Upper center: name + subtitle ── */}
      <UpperContent engineerHover={engineerHover} filmHover={filmHover} />

      {/* ── Bottom typography — the Wodniack foundation ── */}
      <div
        style={{
          position:  'absolute',
          bottom:    0,
          left:      0,
          right:     0,
          zIndex:    10,
          display:   'flex',
          alignItems:'flex-end',
          justifyContent: 'space-between',
          /*
            Horizontal padding: gives a small visual margin from viewport edges.
            The text overflows intentionally on very small screens — it's a design choice.
          */
          paddingLeft:   'clamp(12px, 2vw, 32px)',
          paddingRight:  'clamp(12px, 2vw, 32px)',
          paddingBottom: 0,
          /* Prevent line-wrap eating into the opposing word */
          gap:           'clamp(8px, 2vw, 32px)',
          /* Words sit flush to bottom edge of viewport */
          lineHeight:    0.82,
        }}
      >
        {/* LEFT: ENGINEER */}
        <div style={{ flexShrink: 0 }}>
          <EngineerText onHover={setEngineerHover} />
        </div>

        {/* RIGHT: FILMMAKER */}
        <div style={{ flexShrink: 0 }}>
          <FilmmakerText onHover={setFilmHover} />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <ScrollIndicator />
    </section>
  )
}
