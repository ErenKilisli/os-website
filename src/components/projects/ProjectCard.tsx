'use client'

import { motion } from 'framer-motion'
import type { Project } from '@/types'

/* Size → grid column span */
const COL_SPAN: Record<string, string> = {
  sm:   'col-span-1',
  md:   'col-span-1',
  lg:   'col-span-2',
  wide: 'col-span-3',
}

/* Size → min-height */
const CARD_HEIGHT: Record<string, number> = {
  sm:   220,
  md:   280,
  lg:   300,
  wide: 260,
}

/* Per-project vertical offset (creates the Wodniack floating asymmetry) */
const OFFSETS: Record<string, number> = {
  'deux':        0,
  'rezinn':      48,
  'streetshare': 80,
  'damned-ape':  16,
  'showreel':    0,
  'geeknasyon':  36,
  'photography': 64,
}

/* Per-project parallax speed (fed to GSAP via data-speed attribute) */
const SPEEDS: Record<string, number> = {
  'deux':        -0.08,
  'rezinn':       0.12,
  'streetshare': -0.14,
  'damned-ape':   0.06,
  'showreel':    -0.10,
  'geeknasyon':   0.08,
  'photography': -0.12,
}

interface Props {
  project: Project
  /** When true the card becomes invisible (modal is showing its layoutId) */
  isActive: boolean
  onClick: () => void
}

export function ProjectCard({ project, isActive, onClick }: Props) {
  const isCode = project.category === 'code'
  const accent = project.accentColor

  return (
    <motion.article
      /* ── Shared-element source ── */
      layoutId={`project-${project.id}`}

      className={`${COL_SPAN[project.size]} glass-card relative cursor-pointer overflow-hidden group`}
      style={{
        marginTop:  OFFSETS[project.id] ?? 0,
        minHeight:  CARD_HEIGHT[project.size],
        opacity:    isActive ? 0 : 1,
        /* Category-tinted glass bg */
        background: `rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.025)`,
        border:     `1px solid rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.08)`,
        /* GSAP reads this */
      }}
      data-speed={SPEEDS[project.id] ?? 0}
      onClick={onClick}

      whileHover={{
        y: -8,
        borderColor: `${accent}30`,
        boxShadow:   `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${accent}25`,
        transition:  { type: 'spring', stiffness: 280, damping: 22 },
      }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between p-5 pb-0">
        <span
          className="text-[9px] tracking-[0.35em] uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            color:      accent,
            opacity:    0.7,
          }}
        >
          {isCode ? 'System & Code' : 'Lens & Motion'}
        </span>
        <span
          className="text-[9px] tracking-widest"
          style={{ fontFamily: 'var(--font-mono)', color: 'rgba(240,240,240,0.3)' }}
        >
          {project.year}
        </span>
      </div>

      {/* ── Title ── */}
      <div className="px-5 pt-4 pb-0">
        <h3
          className="leading-tight"
          style={{
            fontFamily:    isCode ? 'var(--font-mono)' : 'var(--font-serif)',
            fontStyle:     isCode ? 'normal' : 'italic',
            fontWeight:    900,
            fontSize:      'clamp(1.6rem, 3vw, 2.4rem)',
            color:         '#f0f0f0',
            letterSpacing: isCode ? '-0.02em' : '-0.01em',
          }}
        >
          {project.title}
        </h3>
        <p
          className="mt-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   '11px',
            color:      'rgba(240,240,240,0.45)',
            letterSpacing: '0.05em',
          }}
        >
          {project.subtitle}
        </p>
      </div>

      {/* ── Description — reveals on hover ── */}
      <div
        className="px-5 pt-3 pb-0"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   '11px',
          lineHeight: 1.7,
          color:      'rgba(240,240,240,0)',
          transition: 'color 0.3s ease',
        }}
        ref={(el) => {
          // Group hover via JS (CSS group-hover doesn't work with inline styles)
          if (el) {
            const card = el.closest('article')
            card?.addEventListener('mouseenter', () => { el.style.color = 'rgba(240,240,240,0.5)' })
            card?.addEventListener('mouseleave', () => { el.style.color = 'rgba(240,240,240,0)' })
          }
        }}
      >
        {project.description.slice(0, 110)}…
      </div>

      {/* ── Bottom tags ── */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded"
              style={{
                fontFamily:  'var(--font-mono)',
                fontSize:    '9px',
                letterSpacing:'0.1em',
                background:  `rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.06)`,
                color:       `rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.6)`,
                border:      `1px solid rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.12)`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Arrow CTA */}
        <motion.span
          className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: accent }}
        >
          →
        </motion.span>
      </div>

      {/* ── Hover accent line at top ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}
      />
    </motion.article>
  )
}
