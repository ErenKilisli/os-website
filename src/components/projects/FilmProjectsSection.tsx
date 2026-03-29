'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { filmProjects } from '@/data/projects'
import { ProjectModal } from './ProjectModal'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
  Film grid layout:
    'showreel'    → col-span-3 (full width, 2.35:1 cinematic ratio)
    'geeknasyon'  → col-span-2 (left, 16:9)
    'photography' → col-span-1 (right, 4:3 portrait feel)
*/
const FILM_GRID_SPAN: Record<string, string> = {
  'showreel':    'col-span-3',
  'geeknasyon':  'col-span-2',
  'photography': 'col-span-1',
}

/* Aspect ratios per card — cinematic intent */
const FILM_ASPECT: Record<string, string> = {
  'showreel':    '2.35 / 1',
  'geeknasyon':  '16 / 9',
  'photography': '4 / 5',
}

const FILM_OFFSETS: Record<string, number> = {
  'showreel':     0,
  'geeknasyon':   0,
  'photography': 48,
}

const FILM_SPEEDS: Record<string, number> = {
  'showreel':    -0.06,
  'geeknasyon':   0.09,
  'photography': -0.11,
}

/* ── Film card ────────────────────────────────────────── */
interface FilmCardProps {
  id:          string
  title:       string
  subtitle:    string
  description: string
  tags:        string[]
  year:        string
  accentColor: string
  isActive:    boolean
  offset:      number
  speed:       number
  onClick:     () => void
}

function FilmCard({
  id, title, subtitle, description, tags, year, accentColor,
  isActive, offset, speed, onClick,
}: FilmCardProps) {
  return (
    <motion.article
      layoutId={`project-${id}`}
      className={`${FILM_GRID_SPAN[id] ?? 'col-span-1'} film-perforations`}
      style={{
        /* Cinematic aspect ratio */
        aspectRatio:  FILM_ASPECT[id] ?? '16/9',
        marginTop:    offset,
        opacity:      isActive ? 0 : 1,
        background:   'rgba(255,107,53,0.018)',
        border:       '1px solid rgba(255,107,53,0.09)',
        borderRadius: 6,
        cursor:       'pointer',
        overflow:     'hidden',
        position:     'relative',
        /*
          Wider inset to clear the perforation strips (18px each side).
          Content padding below accounts for this.
        */
      }}
      data-speed={speed}
      onClick={onClick}
      whileHover={{
        y:          -5,
        borderColor:'rgba(255,107,53,0.28)',
        boxShadow:  '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,107,53,0.20)',
        transition: { type: 'spring', stiffness: 300, damping: 26 },
      }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      {/* Placeholder image area — replace with actual <Image /> */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(135deg, rgba(255,107,53,0.04) 0%, rgba(8,5,6,0.9) 100%)`,
        }}
        aria-hidden
      />

      {/* Cinematic letterbox bars — top & bottom 4% each */}
      <div
        aria-hidden
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     '4%',
          background: 'rgba(0,0,0,0.65)',
          zIndex:     2,
        }}
      />
      <div
        aria-hidden
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '4%',
          background: 'rgba(0,0,0,0.65)',
          zIndex:     2,
        }}
      />

      {/* Content — sits over the bg, inside the perf strips */}
      <div
        style={{
          position:  'absolute',
          inset:     0,
          /* 18px perforation padding on sides */
          paddingLeft:   22,
          paddingRight:  22,
          paddingTop:    18,
          paddingBottom: 18,
          zIndex:        4,
          display:       'flex',
          flexDirection: 'column',
          justifyContent:'flex-end',
        }}
      >
        {/* Top row: category + year */}
        <div
          style={{
            position:       'absolute',
            top:            18,
            left:           22,
            right:          22,
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
          }}
        >
          <span
            style={{
              fontFamily:    'var(--font-serif)',
              fontStyle:     'italic',
              fontSize:      10,
              letterSpacing: '0.04em',
              color:         'rgba(255,107,53,0.55)',
            }}
          >
            Lens &amp; Motion
          </span>
          <span
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      9,
              letterSpacing: '0.18em',
              color:         'rgba(240,240,240,0.25)',
            }}
          >
            {year}
          </span>
        </div>

        {/* Bottom content */}
        <div>
          {/* Title */}
          <h3
            style={{
              fontFamily:    'var(--font-serif)',
              fontWeight:    700,
              fontStyle:     'italic',
              fontSize:      'clamp(1.4rem, 2.6vw, 2.4rem)',
              letterSpacing: '-0.01em',
              color:         '#f0f0f0',
              lineHeight:    1.05,
              marginBottom:  4,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      10,
              color:         'rgba(240,240,240,0.4)',
              letterSpacing: '0.05em',
              marginBottom:  10,
            }}
          >
            {subtitle}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      8,
                  letterSpacing: '0.1em',
                  background:    'rgba(255,107,53,0.06)',
                  color:         'rgba(255,107,53,0.60)',
                  border:        '1px solid rgba(255,107,53,0.14)',
                  borderRadius:  2,
                  padding:       '2px 7px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover: warm gradient veil */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to top, rgba(255,107,53,0.12) 0%, transparent 55%)',
          opacity:    0,
          transition: 'opacity 0.35s ease',
          zIndex:     3,
          pointerEvents: 'none',
        }}
        ref={(el) => {
          if (!el) return
          const card = el.closest('article')
          card?.addEventListener('mouseenter', () => { el.style.opacity = '1' })
          card?.addEventListener('mouseleave', () => { el.style.opacity = '0' })
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     1,
          background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.55), transparent)',
          opacity:    0,
          transition: 'opacity 0.3s ease',
          zIndex:     5,
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

/* ── Film projects section ────────────────────────────── */
export function FilmProjectsSection() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const activeProject = filmProjects.find((p) => p.id === activeId) ?? null

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-speed]', sectionRef.current)
    cards.forEach((card) => {
      const speed = parseFloat(card.dataset.speed ?? '0')
      if (speed === 0) return
      gsap.to(card, {
        y: `${speed * 200}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   1.6,
        },
      })
    })

    gsap.from('[data-film-reveal]', {
      opacity:  0,
      y:        36,
      duration: 0.9,
      stagger:  0.11,
      ease:     'power3.out',
      scrollTrigger: {
        trigger:       '#film-header',
        start:         'top 80%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="projects-film"
      ref={sectionRef}
      style={{
        position:      'relative',
        width:         '100%',
        /* Warmer, slightly different dark bg — distinct from code section */
        background:    '#080506',
        paddingTop:    160,
        paddingBottom: 200,
        paddingLeft:   'clamp(16px, 4vw, 80px)',
        paddingRight:  'clamp(16px, 4vw, 80px)',
      }}
    >
      {/* Separator */}
      <div
        className="section-divider"
        style={{
          marginBottom: 100,
          background:   'linear-gradient(90deg, transparent 0%, rgba(255,107,53,0.08) 30%, rgba(255,107,53,0.08) 70%, transparent 100%)',
        }}
      />

      {/* Section header */}
      <div
        id="film-header"
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
            data-film-reveal
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      10,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color:         'rgba(255,107,53,0.45)',
              marginBottom:  14,
            }}
          >
            04 — Lens &amp; Motion
          </p>
          <h2
            data-film-reveal
            style={{
              fontFamily:    'var(--font-serif)',
              fontWeight:    700,
              fontStyle:     'italic',
              fontSize:      'clamp(2.2rem, 5vw, 5rem)',
              letterSpacing: '-0.015em',
              color:         '#f0f0f0',
              lineHeight:    0.95,
            }}
          >
            Moving&nbsp;
            <span style={{ color: 'rgba(255,107,53,0.30)' }}>Images</span>
          </h2>
        </div>
        <span
          data-film-reveal
          style={{
            fontFamily:    'var(--font-serif)',
            fontStyle:     'italic',
            fontSize:      12,
            letterSpacing: '0.04em',
            color:         'rgba(255,107,53,0.28)',
            alignSelf:     'flex-end',
            paddingBottom: 4,
          }}
        >
          RED · Sony FX9 · DaVinci Resolve
        </span>
      </div>

      {/* Cinematic 3-column grid */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 16,
        }}
      >
        {filmProjects.map((p) => (
          <FilmCard
            key={p.id}
            id={p.id}
            title={p.title}
            subtitle={p.subtitle}
            description={p.description}
            tags={p.tags}
            year={p.year}
            accentColor={p.accentColor}
            isActive={activeId === p.id}
            offset={FILM_OFFSETS[p.id] ?? 0}
            speed={FILM_SPEEDS[p.id] ?? 0}
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
