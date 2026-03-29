'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EMAIL = 'ibr@himerenkilisli.com'

/* ── Character wave email ────────────────────────────── */
function WaveEmail() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={`mailto:${EMAIL}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        display:        'inline-block',
      }}
      aria-label={`Email ${EMAIL}`}
    >
      <span
        style={{
          fontFamily:    'var(--font-mono)',
          fontWeight:    500,
          fontSize:      'clamp(1.1rem, 2.8vw, 2.6rem)',
          letterSpacing: '-0.015em',
          display:       'inline-flex',
          flexWrap:      'wrap',
          lineHeight:    1.1,
        }}
      >
        {EMAIL.split('').map((char, i) => (
          <motion.span
            key={i}
            animate={hovered ? {
              y:     [0, -8, 0],
              color: ['rgba(240,240,240,0.75)', '#00ffaa', 'rgba(240,240,240,0.75)'],
            } : {
              y:     0,
              color: 'rgba(240,240,240,0.75)',
            }}
            transition={hovered ? {
              delay:    i * 0.022,
              duration: 0.45,
              ease:     'easeInOut',
            } : { duration: 0.2 }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </a>
  )
}

/* ── Social row ──────────────────────────────────────── */
const SOCIALS = [
  { label: 'GitHub',     short: 'GH', href: 'https://github.com/erenkilisli'      },
  { label: 'LinkedIn',   short: 'LI', href: 'https://linkedin.com/in/erenkilisli' },
  { label: 'Behance',    short: 'BE', href: 'https://behance.net/erenkilisli'     },
  { label: 'Geeknasyon', short: 'GN', href: 'https://geeknasyon.com'             },
]

/* ── Contact section ─────────────────────────────────── */
export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('[data-contact-reveal]', {
      opacity:  0,
      y:        40,
      duration: 0.85,
      stagger:  0.1,
      ease:     'power3.out',
      scrollTrigger: {
        trigger:       '#contact-header',
        start:         'top 80%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position:      'relative',
        width:         '100%',
        background:    '#050505',
        paddingTop:    160,
        paddingBottom: 120,
        paddingLeft:   'clamp(16px, 4vw, 80px)',
        paddingRight:  'clamp(16px, 4vw, 80px)',
      }}
    >
      {/* Separator */}
      <div
        className="section-divider"
        style={{
          marginBottom: 100,
          background:   'linear-gradient(90deg, transparent 0%, rgba(0,255,170,0.06) 30%, rgba(255,107,53,0.06) 70%, transparent 100%)',
        }}
      />

      {/* Header */}
      <div
        id="contact-header"
        style={{ marginBottom: 80 }}
      >
        <p
          data-contact-reveal
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      10,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color:         'rgba(240,240,240,0.22)',
            marginBottom:  14,
          }}
        >
          05 — Contact
        </p>
        <h2
          data-contact-reveal
          style={{
            fontFamily:    'var(--font-mono)',
            fontWeight:    900,
            fontSize:      'clamp(2.2rem, 5vw, 5rem)',
            letterSpacing: '-0.025em',
            color:         '#f0f0f0',
            lineHeight:    0.95,
          }}
        >
          Let&apos;s&nbsp;
          <span style={{ color: 'rgba(240,240,240,0.18)' }}>talk.</span>
        </h2>
      </div>

      {/* Two-col layout */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 'clamp(40px, 6vw, 120px)',
          alignItems:          'start',
        }}
      >
        {/* Left — email + CTA copy */}
        <div data-contact-reveal style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <div>
            <p
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color:         'rgba(0,255,170,0.4)',
                marginBottom:  16,
              }}
            >
              Drop a line
            </p>
            <WaveEmail />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   13,
              lineHeight: 1.85,
              color:      'rgba(240,240,240,0.38)',
              maxWidth:   440,
            }}
          >
            Open to product engineering roles, creative collaborations, and
            documentary film projects. Based in Istanbul — available worldwide.
          </p>
        </div>

        {/* Right — social links + availability */}
        <div data-contact-reveal style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SOCIALS.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  paddingTop:     12,
                  paddingBottom:  12,
                  borderBottom:   '1px solid rgba(255,255,255,0.05)',
                  textDecoration: 'none',
                  color:          'rgba(240,240,240,0.45)',
                  transition:     'color 0.2s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#f0f0f0' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,240,240,0.45)' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em' }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', opacity: 0.5 }}>
                  {s.short} →
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom signature */}
      <div
        style={{
          marginTop:      120,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            20,
        }}
      >
        <p
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'rgba(240,240,240,0.12)',
          }}
        >
          © {new Date().getFullYear()} Ibrahim Erenkilisli
        </p>

        {/* ENGINEER ✦ FILMMAKER signature */}
        <p
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        12,
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-mono)',
              fontWeight:    900,
              fontSize:      10,
              letterSpacing: '0.18em',
              color:         'rgba(0,255,170,0.25)',
              textTransform: 'uppercase',
            }}
          >
            Engineer
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle:  'italic',
              fontSize:   12,
              color:      'rgba(240,240,240,0.12)',
            }}
          >
            ✦
          </span>
          <span
            style={{
              fontFamily:    'var(--font-serif)',
              fontWeight:    700,
              fontStyle:     'italic',
              fontSize:      10,
              letterSpacing: '0.08em',
              color:         'rgba(255,107,53,0.25)',
              textTransform: 'uppercase',
            }}
          >
            Filmmaker
          </span>
        </p>
      </div>
    </section>
  )
}
