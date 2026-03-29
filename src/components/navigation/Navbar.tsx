'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ── Spring preset — iOS 18 feel ─────────────────────── */
const SPRING = { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 } as const

/* ── Nav sections (must match section IDs in page) ───── */
const NAV_LINKS = [
  { label: 'Home',    href: '#home'     },
  { label: 'Work',    href: '#projects-code' },
  { label: 'About',   href: '#about'    },
  { label: 'Contact', href: '#contact'  },
] as const

type NavLabel = typeof NAV_LINKS[number]['label']

/* ── SVG social icons (20×20 viewport) ──────────────── */
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
    </svg>
  )
}

function GeeknasyonIcon() {
  /* Custom wordmark-style G — replace with actual SVG if available */
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <text
        x="12" y="17"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="700"
        fontSize="15"
        fill="currentColor"
      >
        GN
      </text>
    </svg>
  )
}

const SOCIALS = [
  { label: 'GitHub',     href: 'https://github.com/erenkilisli',      Icon: GitHubIcon    },
  { label: 'LinkedIn',   href: 'https://linkedin.com/in/erenkilisli', Icon: LinkedInIcon  },
  { label: 'Behance',    href: 'https://behance.net/erenkilisli',     Icon: BehanceIcon   },
  { label: 'Geeknasyon', href: 'https://geeknasyon.com',              Icon: GeeknasyonIcon },
] as const

/* ── Pill indicator — slides under active nav item ───── */
function ActivePill({ layoutId }: { layoutId: string }) {
  return (
    <motion.span
      layoutId={layoutId}
      className="absolute inset-0 glass-pill-active"
      style={{ borderRadius: 9999 }}
      transition={SPRING}
    />
  )
}

/* ── Main Navbar ──────────────────────────────────────── */
export function Navbar() {
  const [activeSection, setActiveSection] = useState<NavLabel>('Home')
  const [scrolled,      setScrolled]      = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  /* ── Scroll detection — boosts glass blur after 20px ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── IntersectionObserver — maps section → nav label ── */
  useEffect(() => {
    const sectionMap: Record<string, NavLabel> = {
      'home':          'Home',
      'projects-code': 'Work',
      'projects-film': 'Work',
      'about':         'About',
      'contact':       'Contact',
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        /* Pick the entry with the largest intersection ratio */
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          const id = visible[0].target.id
          const label = sectionMap[id]
          if (label) setActiveSection(label)
        }
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: '-64px 0px 0px 0px' }
    )

    Object.keys(sectionMap).forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  /* ── Smooth scroll (Lenis-compatible) ── */
  const scrollTo = (href: string) => {
    const id  = href.replace('#', '')
    const el  = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 glass-surface ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{ height: 64 }}
    >
      <nav
        className="h-full flex items-center justify-between"
        style={{ paddingLeft: 28, paddingRight: 28 }}
        aria-label="Primary navigation"
      >

        {/* ── LEFT: Name / Logo ───────────────────────── */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo('#home') }}
          className="flex items-center gap-2.5 shrink-0"
          style={{ textDecoration: 'none' }}
          aria-label="Ibrahim Erenkilisli — home"
        >
          {/* Monogram block */}
          <span
            style={{
              fontFamily:    'var(--font-mono)',
              fontWeight:    900,
              fontSize:      13,
              letterSpacing: '0.22em',
              color:         '#f0f0f0',
              textTransform: 'uppercase',
            }}
          >
            IE
          </span>
          {/* Separator pip */}
          <span
            aria-hidden
            style={{
              display:    'block',
              width:      1,
              height:     16,
              background: 'rgba(255,255,255,0.12)',
            }}
          />
          {/* Full name — hides on small screens */}
          <span
            className="hidden sm:block"
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      11,
              letterSpacing: '0.08em',
              color:         'rgba(240,240,240,0.45)',
              whiteSpace:    'nowrap',
            }}
          >
            Ibrahim Erenkilisli
          </span>
        </a>

        {/* ── CENTER: Nav items + floating pill ─────────────── */}
        <div
          className="flex items-center"
          style={{ gap: 4 }}
          role="list"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.label
            return (
              <div key={link.label} role="listitem" style={{ position: 'relative' }}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    position:      'relative',
                    display:       'flex',
                    alignItems:    'center',
                    padding:       '6px 14px',
                    borderRadius:  9999,
                    fontFamily:    'var(--font-mono)',
                    fontSize:      11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration:'none',
                    color: isActive
                      ? '#f0f0f0'
                      : 'rgba(240,240,240,0.42)',
                    transition: 'color 0.2s ease',
                    zIndex: 1,
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,240,240,0.8)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,240,240,0.42)'
                  }}
                >
                  {/* Floating pill background slides under the active label */}
                  {isActive && <ActivePill layoutId="nav-active-pill" />}
                  <span style={{ position: 'relative', zIndex: 1 }}>{link.label}</span>
                </a>
              </div>
            )
          })}
        </div>

        {/* ── RIGHT: Social icons ────────────────────── */}
        <div
          className="flex items-center shrink-0"
          style={{ gap: 4 }}
        >
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                width:           36,
                height:          36,
                borderRadius:    9999,
                color:           'rgba(240,240,240,0.32)',
                transition:      'color 0.18s ease, background 0.18s ease',
                textDecoration:  'none',
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget as HTMLAnchorElement
                t.style.color      = '#f0f0f0'
                t.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget as HTMLAnchorElement
                t.style.color      = 'rgba(240,240,240,0.32)'
                t.style.background = 'transparent'
              }}
            >
              <Icon />
            </a>
          ))}
        </div>

      </nav>
    </header>
  )
}
