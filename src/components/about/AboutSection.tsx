'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Left column keywords — tech/engineer ────────────── */
const LEFT_LABELS = [
  { text: 'Istanbul',   accent: 'green' },
  { text: '01.01.2000', accent: null },
  { text: 'Engineer',   accent: 'green' },
  { text: 'React',      accent: null },
  { text: 'TypeScript', accent: null },
  { text: 'Next.js',    accent: null },
  { text: 'Node.js',    accent: null },
  { text: 'UE5',        accent: 'green' },
  { text: 'C++',        accent: null },
  { text: 'Product',    accent: null },
  { text: 'System',     accent: null },
  { text: 'SaaS',       accent: null },
  { text: '2024',       accent: null },
  { text: 'Design',     accent: 'green' },
  { text: 'Figma',      accent: null },
  { text: 'Nanite',     accent: null },
  { text: 'Lumen',      accent: null },
  { text: 'Full-Stack', accent: null },
  { text: 'Istanbul',   accent: null },
  { text: 'himer',      accent: 'green' },
] as const

/* ── Right column keywords — film/visual ─────────────── */
const RIGHT_LABELS = [
  { text: 'RED Camera',       accent: 'orange' },
  { text: 'DaVinci Resolve',  accent: null },
  { text: 'Luminar Neo',      accent: null },
  { text: 'Istanbul',         accent: 'orange' },
  { text: 'Cinema',           accent: null },
  { text: 'Motion',           accent: null },
  { text: 'Frame',            accent: null },
  { text: 'Cinematography',   accent: null },
  { text: 'Sony FX9',         accent: 'orange' },
  { text: 'Color Grade',      accent: null },
  { text: 'Directing',        accent: null },
  { text: 'Documentary',      accent: null },
  { text: '24fps',            accent: 'orange' },
  { text: 'Darktable',        accent: null },
  { text: 'LUT',              accent: null },
  { text: 'Geeknasyon',       accent: 'orange' },
  { text: 'Showreel',         accent: null },
  { text: 'Portrait',         accent: null },
  { text: 'Street',           accent: null },
  { text: 'Anamorphic',       accent: 'orange' },
] as const

type LabelAccent = 'green' | 'orange' | null

function LabelStack({
  items,
  id,
}: {
  items: ReadonlyArray<{ text: string; accent: LabelAccent }>
  id: string
}) {
  return (
    <div id={id} className="about-label-stack" style={{ paddingTop: 80 }}>
      {items.map((item, i) => (
        <span
          key={i}
          className={
            item.accent === 'green'  ? 'accent-green'  :
            item.accent === 'orange' ? 'accent-orange' :
            ''
          }
        >
          {item.text}
        </span>
      ))}
    </div>
  )
}

/* ── Center column — bio ──────────────────────────────── */
function CenterColumn() {
  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           40,
        paddingTop:    60,
      }}
    >
      {/* Bold statement */}
      <p
        style={{
          fontFamily:    'var(--font-serif)',
          fontWeight:    700,
          fontStyle:     'italic',
          /* clamp(1.6rem | 3.2vw | 3.2rem) */
          fontSize:      'clamp(1.6rem, 3.2vw, 3.2rem)',
          lineHeight:    1.15,
          color:         '#f0f0f0',
          letterSpacing: '-0.01em',
          maxWidth:      480,
        }}
      >
        "Code is architecture.
        Film is time made visible."
      </p>

      {/* Divider */}
      <div
        style={{
          width:      48,
          height:     1,
          background: 'linear-gradient(90deg, rgba(240,240,240,0.25), transparent)',
        }}
      />

      {/* Bio paragraph */}
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           20,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   13,
            lineHeight: 1.85,
            color:      'rgba(240,240,240,0.58)',
            maxWidth:   460,
          }}
        >
          Based in Istanbul, I&apos;m a Software/Product Engineer and Filmmaker — two disciplines
          that share an obsession with precision, rhythm, and the experience of the person on the
          other side.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   13,
            lineHeight: 1.85,
            color:      'rgba(240,240,240,0.40)',
            maxWidth:   460,
          }}
        >
          I build products with React, Next.js, Node.js, and Unreal Engine 5, and shoot on RED
          and Sony cameras. I run Geeknasyon, Turkey&apos;s leading tech media platform, and
          direct documentary-style content with a cinematic visual language.
        </p>
      </div>

      {/* Portrait placeholder */}
      <div
        style={{
          width:        '100%',
          maxWidth:     360,
          aspectRatio:  '4 / 5',
          background:   'rgba(255,255,255,0.025)',
          border:       '1px solid rgba(255,255,255,0.06)',
          borderRadius: 4,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          overflow:     'hidden',
          marginTop:    8,
        }}
      >
        <span
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      9,
            letterSpacing: '0.3em',
            color:         'rgba(240,240,240,0.15)',
            textTransform: 'uppercase',
          }}
        >
          Portrait
        </span>
      </div>

      {/* Availability line */}
      <p
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      10,
          letterSpacing: '0.25em',
          color:         'rgba(0,255,170,0.55)',
          textTransform: 'uppercase',
          display:       'flex',
          alignItems:    'center',
          gap:           10,
        }}
      >
        <span
          style={{
            display:      'inline-block',
            width:        6,
            height:       6,
            borderRadius: '50%',
            background:   '#00ffaa',
            boxShadow:    '0 0 8px rgba(0,255,170,0.7)',
          }}
        />
        Available for new projects
      </p>
    </div>
  )
}

/* ── About section ────────────────────────────────────── */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    /*
      Left column scrolls UPWARD (negative y) — moves against scroll direction.
      Travels -180px over the section's full scroll distance.
    */
    gsap.to('#about-col-left', {
      y:    -180,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top bottom',
        end:     'bottom top',
        scrub:   1.6,
      },
    })

    /*
      Right column scrolls DOWNWARD (positive y) — moves with scroll direction.
      Travels +180px over the same distance. Creates the tectonic separation feel.
    */
    gsap.to('#about-col-right', {
      y:    180,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top bottom',
        end:     'bottom top',
        scrub:   1.6,
      },
    })

    /* Header lines stagger in */
    gsap.from('[data-about-reveal]', {
      opacity:  0,
      y:        36,
      duration: 0.85,
      stagger:  0.1,
      ease:     'power3.out',
      scrollTrigger: {
        trigger:       '#about-header',
        start:         'top 80%',
        toggleActions: 'play none none none',
      },
    })

    /* Center column fades up */
    gsap.from('#about-center', {
      opacity:  0,
      y:        50,
      duration: 1.0,
      ease:     'power3.out',
      scrollTrigger: {
        trigger:       '#about-center',
        start:         'top 78%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position:      'relative',
        width:         '100%',
        paddingTop:    160,
        paddingBottom: 200,
        paddingLeft:   'clamp(16px, 4vw, 80px)',
        paddingRight:  'clamp(16px, 4vw, 80px)',
        background:    '#050505',
        overflow:      'hidden',
      }}
    >
      {/* ── Section header ── */}
      <div
        id="about-header"
        style={{
          marginBottom: 80,
        }}
      >
        <p
          data-about-reveal
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      10,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color:         'rgba(240,240,240,0.25)',
            marginBottom:  14,
          }}
        >
          03 — About
        </p>
        <h2
          data-about-reveal
          style={{
            fontFamily:    'var(--font-mono)',
            fontWeight:    900,
            /* clamp(2.2rem | 5vw | 5rem) */
            fontSize:      'clamp(2.2rem, 5vw, 5rem)',
            letterSpacing: '-0.02em',
            color:         '#f0f0f0',
            lineHeight:    0.95,
          }}
        >
          The&nbsp;
          <span style={{ color: 'rgba(240,240,240,0.22)' }}>Person</span>
        </h2>
      </div>

      {/* ── Three-column grid ── */}
      <div
        style={{
          display:             'grid',
          /*
            Col 1: ~20%  — scrolls UP   (tech labels)
            Col 2: ~56%  — normal speed (bio content)
            Col 3: ~20%  — scrolls DOWN (film labels)
            The 4% is gutter absorbed by gap.
          */
          gridTemplateColumns: '18% 1fr 18%',
          gap:                 'clamp(20px, 3vw, 56px)',
          alignItems:          'start',
        }}
      >
        {/* Column 1 — Left, scrolls up */}
        <div style={{ overflow: 'hidden' }}>
          <LabelStack items={LEFT_LABELS} id="about-col-left" />
        </div>

        {/* Column 2 — Center, normal speed */}
        <div id="about-center">
          <CenterColumn />
        </div>

        {/* Column 3 — Right, scrolls down */}
        <div style={{ overflow: 'hidden' }}>
          <LabelStack items={RIGHT_LABELS} id="about-col-right" />
        </div>
      </div>
    </section>
  )
}
