'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/projects'
import type { ProjectCategory } from '@/types'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Category toggle button ───────────────────────────── */
function CategoryTab({
  label, active, accent, onClick,
}: {
  label: string; active: boolean; accent: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative px-5 py-2 rounded-full transition-all duration-200"
      style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '10px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color:          active ? accent : 'rgba(240,240,240,0.4)',
        background:     active ? `rgba(${accent === '#00ffaa' ? '0,255,170' : '255,107,53'}, 0.07)` : 'transparent',
        border:         `1px solid ${active ? accent + '30' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      {active && (
        <motion.span
          layoutId="tab-indicator"
          className="absolute inset-0 rounded-full"
          style={{ background: `rgba(${accent === '#00ffaa' ? '0,255,170' : '255,107,53'}, 0.04)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  )
}

/* ── Main section ─────────────────────────────────────── */
export function ProjectsSection() {
  const [activeId,   setActiveId]   = useState<string | null>(null)
  const [activeTab,  setActiveTab]  = useState<ProjectCategory | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const activeProject = projects.find((p) => p.id === activeId) ?? null

  /* ── GSAP parallax ── */
  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-speed]', sectionRef.current)

    cards.forEach((card) => {
      const speed = parseFloat(card.dataset.speed ?? '0')
      if (speed === 0) return

      gsap.to(card, {
        y: `${speed * 160}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   1.4,
        },
      })
    })

    /* Section header reveal */
    gsap.from('[data-reveal-header]', {
      opacity:   0,
      y:         40,
      duration:  0.9,
      stagger:   0.12,
      ease:      'power3.out',
      scrollTrigger: {
        trigger:       sectionRef.current,
        start:         'top 78%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: sectionRef })

  /* Filter opacity: active tab dims the other category */
  const cardOpacity = (category: string) => {
    if (!activeTab) return 1
    return category === activeTab ? 1 : 0.18
  }
  const cardPointer = (category: string) => {
    if (!activeTab) return 'auto'
    return category === activeTab ? 'auto' : 'none'
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full px-6 md:px-12 lg:px-20"
      style={{ paddingTop: '140px', paddingBottom: '200px' }}
    >
      {/* ── Section header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
          <p
            data-reveal-header
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '10px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color:         'rgba(240,240,240,0.3)',
              marginBottom:  '12px',
            }}
          >
            02 — Work
          </p>
          <h2
            data-reveal-header
            style={{
              fontFamily:    'var(--font-mono)',
              fontWeight:    900,
              fontSize:      'clamp(2.2rem, 5vw, 5rem)',
              letterSpacing: '-0.02em',
              color:         '#f0f0f0',
              lineHeight:    1,
            }}
          >
            Selected<br />
            <span style={{ color: 'rgba(240,240,240,0.25)' }}>Work</span>
          </h2>
        </div>

        {/* Category toggle */}
        <div data-reveal-header className="flex items-center gap-2 glass-pill p-1.5">
          <CategoryTab
            label="System & Code"
            active={activeTab === 'code'}
            accent="#00ffaa"
            onClick={() => setActiveTab(activeTab === 'code' ? null : 'code')}
          />
          <CategoryTab
            label="Lens & Motion"
            active={activeTab === 'film'}
            accent="#ff6b35"
            onClick={() => setActiveTab(activeTab === 'film' ? null : 'film')}
          />
        </div>
      </div>

      {/* ── Grid ── */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              opacity:        cardOpacity(project.category),
              pointerEvents:  cardPointer(project.category),
              transition:     'opacity 0.4s ease',
            }}
          >
            <ProjectCard
              project={project}
              isActive={activeId === project.id}
              onClick={() => setActiveId(project.id)}
            />
          </div>
        ))}
      </div>

      {/* ── Project modal (shared-element expand) ── */}
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
