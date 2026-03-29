'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { codeProjects } from '@/data/projects'
import { ProjectModal } from './ProjectModal'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Terminal window bar ──────────────────────────────── */
function TerminalBar({ accent = '#00ffaa' }: { accent?: string }) {
  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            6,
        padding:        '10px 14px',
        borderBottom:   `1px solid rgba(0,255,170,0.08)`,
        background:     'rgba(0,255,170,0.02)',
      }}
    >
      {/* Traffic lights */}
      {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
        <span
          key={c}
          style={{
            display:      'inline-block',
            width:        8,
            height:       8,
            borderRadius: '50%',
            background:   c,
            opacity:      0.6,
          }}
        />
      ))}
      <span
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      9,
          letterSpacing: '0.25em',
          color:         'rgba(0,255,170,0.3)',
          marginLeft:    6,
        }}
      >
        {accent}
      </span>
    </div>
  )
}

/* ── Code card ────────────────────────────────────────── */
interface CodeCardProps {
  id:          string
  title:       string
  subtitle:    string
  description: string
  tags:        string[]
  year:        string
  accentColor: string
  size:        string
  isActive:    boolean
  offset:      number
  speed:       number
  onClick:     () => void
}

/*
  Grid layout: 2-col asymmetric.
    'deux'        → col-span-2 (full width)  → wide hero card
    'rezinn'      → col-span-1 (left)
    'streetshare' → col-span-1 (right)
    'damned-ape'  → col-span-2 (full width)  → wide card
*/
const CODE_GRID_SPAN: Record<string, string> = {
  'deux':        'col-span-2',
  'rezinn':      'col-span-1',
  'streetshare': 'col-span-1',
  'damned-ape':  'col-span-2',
}

const CODE_MIN_H: Record<string, number> = {
  'deux':        340,
  'rezinn':      280,
  'streetshare': 320,
  'damned-ape':  260,
}

const CODE_OFFSETS: Record<string, number> = {
  'deux':         0,
  'rezinn':       40,
  'streetshare': -20,
  'damned-ape':   0,
}

const CODE_SPEEDS: Record<string, number> = {
  'deux':        -0.06,
  'rezinn':       0.10,
  'streetshare': -0.12,
  'damned-ape':   0.05,
}

function CodeCard({
  id, title, subtitle, description, tags, year, accentColor,
  size, isActive, offset, speed, onClick,
}: CodeCardProps) {
  return (
    <motion.article
      layoutId={`project-${id}`}
      className={`${CODE_GRID_SPAN[id] ?? 'col-span-1'} terminal-border`}
      style={{
        marginTop:     offset,
        minHeight:     CODE_MIN_H[id] ?? 260,
        opacity:       isActive ? 0 : 1,
        background:    'rgba(0,255,170,0.018)',
        border:        '1px solid rgba(0,255,170,0.09)',
        borderRadius:  12,
        cursor:        'pointer',
        overflow:      'hidden',
        position:      'relative',
      }}
      data-speed={speed}
      onClick={onClick}
      whileHover={{
        y:          -6,
        borderColor:'rgba(0,255,170,0.22)',
        boxShadow:  '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,170,0.18), inset 0 1px 0 rgba(0,255,170,0.06)',
        transition: { type: 'spring', stiffness: 300, damping: 24 },
      }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      {/* Terminal title bar */}
      <TerminalBar accent={`// ${id}`} />

      {/* Card body */}
      <div style={{ padding: '18px 20px 20px' }}>
        {/* Top row: category + year */}
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   14,
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color:         'rgba(0,255,170,0.5)',
            }}
          >
            /* System &amp; Code */
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   9,
              color:      'rgba(240,240,240,0.25)',
              letterSpacing: '0.12em',
            }}
          >
            {year}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily:    'var(--font-mono)',
            fontWeight:    900,
            fontSize:      'clamp(1.5rem, 2.8vw, 2.4rem)',
            letterSpacing: '-0.025em',
            color:         '#f0f0f0',
            lineHeight:    1,
            marginBottom:  6,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      11,
            color:         'rgba(240,240,240,0.38)',
            letterSpacing: '0.04em',
            marginBottom:  12,
          }}
        >
          {subtitle}
        </p>

        {/* Description — hidden until hover (JS group hover) */}
        <p
          className="code-card-desc"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   11,
            lineHeight: 1.75,
            color:      'rgba(0,255,170,0)',
            transition: 'color 0.28s ease',
            maxWidth:   520,
          }}
          ref={(el) => {
            if (!el) return
            const card = el.closest('article')
            card?.addEventListener('mouseenter', () => { el.style.color = 'rgba(0,255,170,0.42)' })
            card?.addEventListener('mouseleave', () => { el.style.color = 'rgba(0,255,170,0)'    })
          }}
        >
          {description.slice(0, 120)}…
        </p>
      </div>

      {/* Bottom tags */}
      <div
        style={{
          position:  'absolute',
          bottom:    16,
          left:      20,
          right:     20,
          display:   'flex',
          alignItems:'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      9,
                letterSpacing: '0.1em',
                background:    'rgba(0,255,170,0.05)',
                color:         'rgba(0,255,170,0.55)',
                border:        '1px solid rgba(0,255,170,0.12)',
                borderRadius:  3,
                padding:       '2px 7px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   13,
            color:      'rgba(0,255,170,0)',
            transition: 'color 0.2s ease',
          }}
          ref={(el) => {
            if (!el) return
            const card = el.closest('article')
            card?.addEventListener('mouseenter', () => { el.style.color = '#00ffaa' })
            card?.addEventListener('mouseleave', () => { el.style.color = 'rgba(0,255,170,0)' })
          }}
        >
          →
        </span>
      </div>

      {/* Top accent line */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     1,
          background: 'linear-gradient(90deg, transparent, rgba(0,255,170,0.5), transparent)',
          opacity:    0,
          transition: 'opacity 0.3s ease',
        }}
        ref={(el) => {
          if (!el) return
          const card = el.closest('article')
          card?.addEventListener('mouseenter', () => { el.style.opacity = '1' })
          card?.addEventListener('mouseleave', () => { el.style.opacity = '0' })
        }}
      />
    </motion.article>
  )
}

/* ── Code projects section ────────────────────────────── */
export function CodeProjectsSection() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const activeProject = codeProjects.find((p) => p.id === activeId) ?? null

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-speed]', sectionRef.current)
    cards.forEach((card) => {
      const speed = parseFloat(card.dataset.speed ?? '0')
      if (speed === 0) return
      gsap.to(card, {
        y: `${speed * 180}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   1.4,
        },
      })
    })

    gsap.from('[data-code-reveal]', {
      opacity:  0,
      y:        36,
      duration: 0.9,
      stagger:  0.11,
      ease:     'power3.out',
      scrollTrigger: {
        trigger:       '#code-header',
        start:         'top 78%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="projects-code"
      ref={sectionRef}
      style={{
        position:      'relative',
        width:         '100%',
        background:    '#050505',
        paddingTop:    160,
        paddingBottom: 200,
        paddingLeft:   'clamp(16px, 4vw, 80px)',
        paddingRight:  'clamp(16px, 4vw, 80px)',
      }}
    >
      {/* Subtle top separator */}
      <div className="section-divider" style={{ marginBottom: 100 }} />

      {/* Section header */}
      <div
        id="code-header"
        style={{
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          marginBottom:   60,
          flexWrap:       'wrap',
          gap:            20,
        }}
      >
        <div>
          <p
            data-code-reveal
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      10,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color:         'rgba(0,255,170,0.4)',
              marginBottom:  14,
            }}
          >
            02 — System &amp; Code
          </p>
          <h2
            data-code-reveal
            style={{
              fontFamily:    'var(--font-mono)',
              fontWeight:    900,
              fontSize:      'clamp(2.2rem, 5vw, 5rem)',
              letterSpacing: '-0.025em',
              color:         '#f0f0f0',
              lineHeight:    0.95,
            }}
          >
            Built&nbsp;
            <span style={{ color: 'rgba(0,255,170,0.30)' }}>Systems</span>
          </h2>
        </div>
        <span
          data-code-reveal
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      9,
            letterSpacing: '0.25em',
            color:         'rgba(0,255,170,0.25)',
            textTransform: 'uppercase',
            alignSelf:     'flex-end',
            paddingBottom: 4,
          }}
        >
          React · TypeScript · UE5 · Node.js
        </span>
      </div>

      {/* Asymmetric 2-column grid */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:                 20,
        }}
      >
        {codeProjects.map((p) => (
          <CodeCard
            key={p.id}
            id={p.id}
            title={p.title}
            subtitle={p.subtitle}
            description={p.description}
            tags={p.tags}
            year={p.year}
            accentColor={p.accentColor}
            size={p.size}
            isActive={activeId === p.id}
            offset={CODE_OFFSETS[p.id] ?? 0}
            speed={CODE_SPEEDS[p.id] ?? 0}
            onClick={() => setActiveId(p.id)}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
