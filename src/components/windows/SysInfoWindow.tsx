'use client'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

const SPECS = [
  { label: 'OS',          value: 'OS.WEBSITE LIZARD VERSION (Build 2026)' },
  { label: 'PROCESSOR',   value: 'Creative Engine™ @ ∞ GHz' },
  { label: 'MEMORY',      value: '∞ MB RAM · 0 MB available' },
  { label: 'STORAGE',     value: '/projects/eren/  ·  47 GB free' },
  { label: 'DISPLAY',     value: '1920×1080 · 32-bit TrueColor' },
  { label: 'NETWORK',     value: 'LAN · 172.20.10.5 · CONNECTED' },
  { label: 'UPTIME',      value: '26 years, 0 months, 0 days' },
  { label: 'USER',        value: 'EREN_KILISLI  (Administrator)' },
]

const STACK = [
  { label: 'FRAMEWORK',   value: 'Next.js 16 (Turbopack)' },
  { label: 'LANGUAGE',    value: 'TypeScript 5' },
  { label: 'STYLING',     value: 'Tailwind CSS v4 + CSS Modules' },
  { label: 'ANIMATION',   value: 'Framer Motion 12' },
  { label: 'STATE',       value: 'Zustand (persist)' },
  { label: 'AUDIO',       value: 'Web Audio API' },
  { label: 'CANVAS',      value: 'HTML5 Canvas (wallpapers + games)' },
  { label: 'DEPLOY',      value: 'Vercel (Edge Runtime)' },
]

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '4px 0', borderBottom: '1px solid #0a1628' }}>
      <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080', minWidth: 80, paddingTop: 2, letterSpacing: '0.08em', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-b)', fontSize: 14, color: '#c8d8e8' }}>{value}</span>
    </div>
  )
}

function Section({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 8, color: '#00ffff',
        letterSpacing: '0.15em', marginBottom: 6, paddingBottom: 4,
        borderBottom: '1px solid #00ffff',
      }}>
        {title}
      </div>
      {rows.map(r => <Row key={r.label} {...r} />)}
    </div>
  )
}

export function SysInfoWindow({ win, isMobile = false }: Props) {
  return (
    <Window win={win} menu={['File', 'Help']} status="SYSINFO | System Properties" isMobile={isMobile}>
      <div style={{ height: '100%', overflow: 'auto', background: '#020812', padding: '14px 16px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #0a1628',
        }}>
          <div style={{
            width: 52, height: 52, background: '#000', border: '2px solid #00ffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0,255,255,0.2)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#00ffff' }}>memory</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: 12, color: '#fff', letterSpacing: '0.1em' }}>
              OS.WEBSITE
            </div>
            <div style={{ fontFamily: 'var(--font-b)', fontSize: 13, color: '#4a6080', marginTop: 2 }}>
              System Properties — Build 2026
            </div>
            <div style={{ fontFamily: 'var(--font-b)', fontSize: 12, color: '#4a6080' }}>
              Registered to: Ibrahim Eren Kilisli
            </div>
          </div>
        </div>

        <Section title="HARDWARE" rows={SPECS} />
        <Section title="TECH STACK" rows={STACK} />
      </div>
    </Window>
  )
}
