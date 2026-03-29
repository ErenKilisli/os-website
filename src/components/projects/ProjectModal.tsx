'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/types'

interface Props {
  project: Project
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const isCode  = project.category === 'code'
  const accent  = project.accentColor

  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* ── Backdrop ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(5,5,5,0.82)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* ── Expanding card shell (shared layoutId with ProjectCard) ── */}
      <motion.div
        layoutId={`project-${project.id}`}
        className="fixed z-50 overflow-hidden"
        style={{
          inset:        '3rem',
          borderRadius: 20,
          background:   `rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.025)`,
          border:       `1px solid rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.12)`,
          backdropFilter: 'blur(24px)',
        }}
        transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
      >
        {/* ── Modal content fades in AFTER the shape animation settles ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="h-full overflow-y-auto p-10 md:p-16"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   '12px',
              color:      'rgba(240,240,240,0.5)',
              background: 'rgba(255,255,255,0.05)',
              border:     '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLButtonElement
              t.style.color      = '#f0f0f0'
              t.style.background = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLButtonElement
              t.style.color      = 'rgba(240,240,240,0.5)'
              t.style.background = 'rgba(255,255,255,0.05)'
            }}
            aria-label="Close project"
          >
            ✕
          </button>

          {/* Category label */}
          <p
            className="mb-6"
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '9px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color:         accent,
              opacity:       0.7,
            }}
          >
            {isCode ? 'System & Code' : 'Lens & Motion'} &nbsp;·&nbsp; {project.year}
          </p>

          {/* Title */}
          <h2
            className="leading-none mb-3"
            style={{
              fontFamily:    isCode ? 'var(--font-mono)' : 'var(--font-serif)',
              fontStyle:     isCode ? 'normal' : 'italic',
              fontWeight:    900,
              fontSize:      'clamp(2.8rem, 7vw, 7rem)',
              color:         '#f0f0f0',
              letterSpacing: '-0.02em',
            }}
          >
            {project.title}
          </h2>

          {/* Subtitle */}
          <p
            className="mb-8"
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '13px',
              letterSpacing: '0.06em',
              color:         'rgba(240,240,240,0.45)',
            }}
          >
            {project.subtitle}
          </p>

          {/* Divider */}
          <div
            className="mb-8"
            style={{
              height:     1,
              background: `linear-gradient(90deg, ${accent}30, transparent)`,
            }}
          />

          {/* Description */}
          <p
            className="mb-10 max-w-2xl"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   '14px',
              lineHeight: 1.85,
              color:      'rgba(240,240,240,0.65)',
            }}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded"
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '10px',
                  letterSpacing: '0.1em',
                  background:    `rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.06)`,
                  color:         `rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.8)`,
                  border:        `1px solid rgba(${isCode ? '0,255,170' : '255,107,53'}, 0.15)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* External link */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:         accent,
                border:        `1px solid ${accent}30`,
                background:    `${accent}08`,
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget as HTMLAnchorElement
                t.style.background = `${accent}18`
                t.style.borderColor = `${accent}60`
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget as HTMLAnchorElement
                t.style.background = `${accent}08`
                t.style.borderColor = `${accent}30`
              }}
            >
              Visit Project
              <span className="text-base">↗</span>
            </a>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
