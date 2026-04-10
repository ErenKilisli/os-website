'use client'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

const GITHUB_URL = 'https://github.com/ErenKilisli/os-website'

function Section({ children }: { children: string }) {
  return (
    <div style={{
      background: 'rgba(0,255,255,0.06)',
      borderLeft: '3px solid #00ffff',
      border: '1px solid rgba(0,255,255,0.22)',
      borderLeftWidth: 3,
      padding: '7px 14px',
      marginBottom: 14,
      fontFamily: 'var(--font-h)',
      fontSize: 10,
      color: '#00ffff',
      letterSpacing: '0.12em',
    }}>
      {children}
    </div>
  )
}

export function ReadmeWindow({ win, isMobile = false }: Props) {
  return (
    <Window
      win={win}
      menu={['File', 'Help']}
      status="README.TXT  |  read-only"
      isMobile={isMobile}
    >
      <div style={{
        height: '100%', overflowY: 'auto', padding: '20px 24px',
        background: '#000810', color: '#c8d8e8',
        fontFamily: 'var(--font-b)', fontSize: 16, lineHeight: 1.8,
        boxSizing: 'border-box',
      }}>

        {/* File header */}
        <div style={{
          fontFamily: 'var(--font-h)', fontSize: 8, color: '#2a5070',
          letterSpacing: '0.15em', marginBottom: 22,
          borderBottom: '1px solid rgba(0,255,255,0.15)', paddingBottom: 12,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>📄</span>
          README.TXT — LIZARD.OS v1.0
        </div>

        {/* ── Why an OS? ────────────────────────────────────────── */}
        <Section>WHY DOES THIS PORTFOLIO LOOK LIKE AN OS?</Section>

        <p style={{ margin: '0 0 16px' }}>
          That&apos;s a fair question.
        </p>

        <p style={{ margin: '0 0 16px' }}>
          A few years ago, I threw together a quick portfolio — and if I&apos;m being
          honest, it was boring. When I finally rolled up my sleeves to build something
          new, every standard layout felt uninspired. Grid of cards? Boring.
          Scroll-through timeline? Still boring.
        </p>

        <p style={{ margin: '0 0 28px' }}>
          I also had a different problem: I live in three very separate worlds —{' '}
          <span style={{ color: '#00ffff' }}>software engineering</span>,{' '}
          <span style={{ color: '#ff71ce' }}>filmmaking</span>, and{' '}
          <span style={{ color: '#00fd00' }}>game development</span>.
          A traditional portfolio couldn&apos;t hold all of that without feeling scattered.
        </p>

        {/* ── The Solution ─────────────────────────────────────── */}
        <Section>SO I BUILT LIZARD.OS.</Section>

        <p style={{ margin: '0 0 16px' }}>
          An open-source, OS-themed portfolio that runs entirely in the browser.
          Each &quot;window&quot; is a world of its own — you can drag them, resize them,
          minimize them, and maybe even find a few hidden games along the way.
        </p>

        <p style={{ margin: '0 0 28px' }}>
          The OS metaphor gave me something a flat page never could: a place where
          software, film, and game work can coexist without competing for space.
        </p>

        {/* ── Open Source ──────────────────────────────────────── */}
        <Section>IT&apos;S OPEN SOURCE — AND IT&apos;S YOURS TOO.</Section>

        <p style={{ margin: '0 0 16px' }}>
          Fork it, customize it, make it yours. Add your own apps, swap in your
          own projects, build new features. The whole system is designed to be extended.
        </p>

        <p style={{ margin: '0 0 28px' }}>
          And if you ship something cool with it — don&apos;t forget to leave a ⭐ on GitHub.
        </p>

        {/* GitHub link */}
        <div style={{
          borderTop: '1px solid rgba(0,255,255,0.12)', paddingTop: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-h)', fontSize: 7,
            color: '#2a5070', letterSpacing: '0.08em',
          }}>
            SOURCE CODE:
          </span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-h)', fontSize: 7, color: '#00ffff',
              textDecoration: 'none', letterSpacing: '0.05em',
            }}
          >
            {GITHUB_URL}
          </a>
        </div>

      </div>
    </Window>
  )
}