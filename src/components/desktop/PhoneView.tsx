'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSystemStore } from '@/store/systemStore'
import { useWindowStore, WindowType } from '@/store/windowStore'
import {
  DEVFILES_PROJECTS, FILM_PROJECTS, GAME_PROJECTS, Project,
} from '@/data/projects'

// ── App registry ──────────────────────────────────────────────────
interface PhoneAppDef {
  type: WindowType
  icon: string
  color: string
  label: string
  bg: string   // icon tile gradient background
}

const PHONE_APPS: PhoneAppDef[] = [
  { type: 'about',     icon: 'account_circle',  color: '#fff', label: 'PROFILE',  bg: 'linear-gradient(145deg,#3a42c4,#6a5acd)' },
  { type: 'mail',      icon: 'mail',            color: '#fff', label: 'MESSAGE',  bg: 'linear-gradient(145deg,#4a40d0,#8b78ee)' },
  { type: 'devfiles',  icon: 'folder_code',     color: '#fff', label: 'DEV',      bg: 'linear-gradient(145deg,#c05018,#e07030)' },
  { type: 'film',      icon: 'movie',           color: '#fff', label: 'FILMS',    bg: 'linear-gradient(145deg,#907800,#c8a800)' },
  { type: 'game',      icon: 'sports_esports',  color: '#fff', label: 'GAMES',    bg: 'linear-gradient(145deg,#186018,#28a028)' },
  { type: 'terminal',  icon: 'terminal',        color: '#fff', label: 'TERMINAL', bg: 'linear-gradient(145deg,#082808,#105010)' },
  { type: 'browser',   icon: 'public',          color: '#fff', label: 'BROWSER',  bg: 'linear-gradient(145deg,#006880,#00a8c0)' },
  { type: 'settings',  icon: 'settings',        color: '#fff', label: 'SETTINGS', bg: 'linear-gradient(145deg,#303848,#505868)' },
  { type: 'music',     icon: 'music_note',      color: '#fff', label: 'MUSIC',    bg: 'linear-gradient(145deg,#a03070,#d060a0)' },
  { type: 'notepad',   icon: 'edit_note',       color: '#fff', label: 'NOTES',    bg: 'linear-gradient(145deg,#604800,#988000)' },
  { type: 'calc',      icon: 'calculate',       color: '#fff', label: 'CALC',     bg: 'linear-gradient(145deg,#102060,#1840a0)' },
  { type: 'paint',     icon: 'brush',           color: '#fff', label: 'PAINT',    bg: 'linear-gradient(145deg,#701890,#a040c0)' },
  { type: 'snake',     icon: 'sports_esports',  color: '#fff', label: 'SNAKE',    bg: 'linear-gradient(145deg,#0a4020,#188040)' },
  { type: 'snowboard', icon: 'downhill_skiing', color: '#fff', label: 'SKI',      bg: 'linear-gradient(145deg,#083870,#1060b0)' },
  { type: 'sysinfo',   icon: 'memory',          color: '#fff', label: 'SYSINFO',  bg: 'linear-gradient(145deg,#141c28,#202c3e)' },
]

// Dock: Profile, Message, Browser, Settings
const DOCK_APPS: PhoneAppDef[] = [
  PHONE_APPS[0], // about / profile
  PHONE_APPS[1], // mail / message
  PHONE_APPS[6], // browser
  PHONE_APPS[7], // settings
]

// Apps that render inline in the phone (not desktop fallback)
const INLINE: Set<WindowType> = new Set([
  'about', 'mail', 'devfiles', 'film', 'game', 'terminal', 'settings',
])

// ── Status bar ────────────────────────────────────────────────────
function PhoneStatusBar() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const h = String(n.getHours()).padStart(2, '0')
      const m = String(n.getMinutes()).padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      height: 30, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', background: 'rgba(0,0,0,0.55)',
    }}>
      {/* left: signal + carrier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
          {[5, 8, 11, 14].map((h, i) => (
            <div key={i} style={{
              width: 3, height: h,
              background: '#00ffff',
              borderRadius: 1, opacity: i < 4 ? 1 : 0.25,
            }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00ffff', letterSpacing: '0.05em' }}>ERA</span>
        <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#00ffff' }}>wifi</span>
      </div>
      {/* center: clock */}
      <span style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#fff', letterSpacing: '0.06em' }}>{time}</span>
      {/* right: battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00fd00' }}>100%</span>
        <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#00fd00' }}>battery_full</span>
      </div>
    </div>
  )
}

// ── Home screen ───────────────────────────────────────────────────
function HomeScreen({ onOpen }: { onOpen: (app: PhoneAppDef) => void }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '16px 8px 8px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px 4px',
      }}>
        {PHONE_APPS.map(app => (
          <button
            key={app.type}
            onClick={() => onOpen(app)}
            style={{
              background: 'none', border: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 5, padding: '2px',
            }}
          >
            <div style={{
              width: 54, height: 54,
              background: app.bg,
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(0,0,0,0.45)',
            }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 26, color: '#fff' }}
              >{app.icon}</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-h)', fontSize: 6, color: '#ccd',
              letterSpacing: '0.02em', textAlign: 'center',
              maxWidth: 58, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── About screen ──────────────────────────────────────────────────
function AboutScreen() {
  const skills = ['NEXT.JS','TYPESCRIPT','REACT','RUST','GO','THREE.JS','UNITY','GSAP','UNREAL','C++','NODE.JS','FILM']
  return (
    <div style={{ overflow: 'auto', height: '100%', padding: '16px 14px' }}>
      {/* Avatar + name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          background: 'linear-gradient(135deg, #484fb9 0%, #00ffff 100%)',
          border: '2px solid #00ffff',
          boxShadow: '0 0 24px rgba(0,255,255,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 8,
        }}>
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 18, color: '#fff', fontWeight: 900 }}>IEK</span>
        </div>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#fff', letterSpacing: '0.1em', marginBottom: 3 }}>
          IBRAHIM EREN KILISLI
        </div>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#9097ff', letterSpacing: '0.06em' }}>
          SOFTWARE ENG + FILMMAKER
        </div>
      </div>

      {/* Bio */}
      <div style={{
        background: 'rgba(0,255,255,0.04)', border: '1px solid rgba(0,255,255,0.12)',
        padding: '10px 12px', marginBottom: 12,
      }}>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00ffff', marginBottom: 6, letterSpacing: '0.1em' }}>
          BIO.TXT
        </div>
        <p style={{ fontFamily: 'var(--font-b)', fontSize: 13, color: '#c8d8e8', lineHeight: 1.65, margin: 0 }}>
          Building at the intersection of code and film. Software engineer with deep roots in game development,
          real-time cinematics, and creative technology. Every project is a story worth telling.
        </p>
      </div>

      {/* Skills */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00ffff', marginBottom: 7, letterSpacing: '0.1em' }}>
          SKILLS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {skills.map(s => (
            <span key={s} style={{
              fontFamily: 'var(--font-h)', fontSize: 6, color: '#c8d8e8',
              background: 'rgba(72,79,185,0.28)', border: '1px solid #484fb9',
              padding: '3px 7px', letterSpacing: '0.04em',
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00ffff', marginBottom: 7, letterSpacing: '0.1em' }}>LINKS</div>
        {[
          { label: 'GitHub', icon: 'code' },
          { label: 'LinkedIn', icon: 'business_center' },
          { label: 'IMDb', icon: 'movie' },
        ].map(link => (
          <div key={link.label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0', borderBottom: '1px solid #0a1628',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#9097ff' }}>{link.icon}</span>
            <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#c8d8e8', letterSpacing: '0.05em' }}>{link.label}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#2a3040', marginLeft: 'auto' }}>arrow_forward</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Mail / Contact screen ─────────────────────────────────────────
function MailScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  const canSend = name.trim() && email.trim() && msg.trim()

  if (sent) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: 16 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 52, color: '#00fd00' }}>check_circle</span>
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#00fd00', letterSpacing: '0.12em' }}>MESSAGE SENT</div>
      <div style={{ fontFamily: 'var(--font-b)', fontSize: 14, color: '#5a7a5a', textAlign: 'center' }}>Will get back to you soon.</div>
      <button
        onClick={() => { setName(''); setEmail(''); setMsg(''); setSent(false) }}
        style={{ marginTop: 8, background: 'none', border: '1px solid #1a2030', color: '#6a8a6a', fontFamily: 'var(--font-h)', fontSize: 7, padding: '8px 16px', letterSpacing: '0.08em' }}
      >NEW MESSAGE</button>
    </div>
  )

  const fieldStyle: React.CSSProperties = {
    width: '100%', background: '#06090f', border: '1px solid #1a2030',
    color: '#c8d8e8', fontFamily: 'var(--font-b)', fontSize: 13, padding: '8px 10px',
    outline: 'none', boxSizing: 'border-box', marginTop: 4,
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-h)', fontSize: 6, color: '#4a6080', letterSpacing: '0.06em',
  }

  return (
    <div style={{ overflow: 'auto', height: '100%', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#00ffff', letterSpacing: '0.1em', marginBottom: 2 }}>
        COMPOSE MESSAGE
      </div>
      <div>
        <span style={labelStyle}>NAME</span>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={fieldStyle} />
      </div>
      <div>
        <span style={labelStyle}>EMAIL</span>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={fieldStyle} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={labelStyle}>MESSAGE</span>
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="What's on your mind..."
          style={{ ...fieldStyle, resize: 'none', flex: 1, minHeight: 80 }}
        />
      </div>
      <button
        onClick={() => canSend && setSent(true)}
        style={{
          background: canSend ? '#484fb9' : '#0a0e18',
          border: `1px solid ${canSend ? '#9097ff' : '#1a2030'}`,
          color: canSend ? '#fff' : '#303848',
          fontFamily: 'var(--font-h)', fontSize: 8, letterSpacing: '0.1em',
          padding: '10px', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>send</span>
        SEND
      </button>
    </div>
  )
}

// ── Projects screen ───────────────────────────────────────────────
function ProjectsScreen({ category }: { category: 'devfiles' | 'film' | 'game' }) {
  const projects: Project[] =
    category === 'devfiles' ? DEVFILES_PROJECTS :
    category === 'film'     ? FILM_PROJECTS     : GAME_PROJECTS
  const accent =
    category === 'devfiles' ? '#ff8c42' :
    category === 'film'     ? '#eaea00' : '#00fd00'

  const [selected, setSelected] = useState<Project | null>(null)

  if (selected) return (
    <div style={{ overflow: 'auto', height: '100%', padding: '12px 14px' }}>
      <button
        onClick={() => setSelected(null)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#9097ff', fontFamily: 'var(--font-h)', fontSize: 7, letterSpacing: '0.05em', marginBottom: 14 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
        BACK
      </button>
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 10, color: '#fff', letterSpacing: '0.08em', marginBottom: 4 }}>{selected.name}</div>
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: accent, marginBottom: 10 }}>{selected.year} · {selected.type}</div>
      <p style={{ fontFamily: 'var(--font-b)', fontSize: 13, color: '#c8d8e8', lineHeight: 1.7, marginBottom: 12 }}>{selected.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {selected.tags.map(t => (
          <span key={t} style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: accent, background: `${accent}18`, border: `1px solid ${accent}60`, padding: '2px 7px' }}>{t}</span>
        ))}
      </div>
      {selected.links.map(l => (
        <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-h)', fontSize: 7, color: '#00ffff', marginBottom: 8, textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>
          {l.label}
        </a>
      ))}
    </div>
  )

  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      {projects.map((p, i) => (
        <button
          key={p.id}
          onClick={() => setSelected(p)}
          style={{
            width: '100%', background: 'none', border: 'none',
            borderBottom: '1px solid #0a1628',
            padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#2a3848', minWidth: 18, textAlign: 'right' }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#fff', letterSpacing: '0.05em', marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#4a6080' }}>{p.year} · {p.type}</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: accent }}>chevron_right</span>
        </button>
      ))}
    </div>
  )
}

// ── Terminal screen ───────────────────────────────────────────────
type TermLine =
  | { kind: 'input'; text: string }
  | { kind: 'output'; text: string; color?: string }
  | { kind: 'blank' }

function PhoneTerminalScreen() {
  const openWindow = useWindowStore(s => s.openWindow)
  const { setViewMode } = useSystemStore()
  const [lines, setLines] = useState<TermLine[]>([
    { kind: 'output', text: 'OS.WEBSITE — PHONE TERMINAL', color: '#00ffff' },
    { kind: 'output', text: 'Type "help" for commands.', color: '#4a6a4a' },
    { kind: 'blank' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const push = (...nl: TermLine[]) => setLines(l => [...l, ...nl])

  const run = useCallback((raw: string) => {
    const trimmed = raw.trim()
    const [cmd, ...args] = trimmed.split(/\s+/)
    push({ kind: 'input', text: trimmed })
    if (!trimmed) return
    switch (cmd) {
      case 'help':
        push(
          { kind: 'output', text: 'Commands:', color: '#00ffff' },
          { kind: 'output', text: '  help  ls  cat  whoami  date  clear  neofetch  open  exit' },
        )
        break
      case 'ls':
        push({ kind: 'output', text: 'about.txt  projects/  README.md  .bashrc', color: '#6ab0ff' })
        break
      case 'pwd':
        push({ kind: 'output', text: '/home/eren' })
        break
      case 'whoami':
        push({ kind: 'output', text: 'eren  (uid=1000, groups=admin)' })
        break
      case 'date':
        push({ kind: 'output', text: new Date().toString() })
        break
      case 'clear':
        setLines([]); return
      case 'neofetch':
        push(
          { kind: 'output', text: 'eren@os-website', color: '#00ffff' },
          { kind: 'output', text: '─────────────────────' },
          { kind: 'output', text: 'OS:     OS.WEBSITE PHONE MODE' },
          { kind: 'output', text: 'User:   Ibrahim Eren Kilisli' },
          { kind: 'output', text: 'Shell:  bash 5.2' },
          { kind: 'output', text: 'Stack:  Next.js · TypeScript · Framer Motion' },
          { kind: 'output', text: 'Theme:  CYBERCORE' },
        )
        break
      case 'cat':
        if (args[0] === 'about.txt') {
          push(
            { kind: 'output', text: 'Ibrahim Eren Kilisli' },
            { kind: 'output', text: 'Software Engineer & Filmmaker' },
            { kind: 'output', text: 'Building at the intersection of code and film.' },
          )
        } else {
          push({ kind: 'output', text: `cat: ${args[0] ?? ''}: No such file or directory`, color: '#ff6060' })
        }
        break
      case 'open': {
        const appMap: Record<string, WindowType> = {
          about: 'about', mail: 'mail', snake: 'snake', snowboard: 'snowboard',
          paint: 'paint', music: 'music', calc: 'calc', browser: 'browser', settings: 'settings',
        }
        if (appMap[args[0]]) {
          openWindow(appMap[args[0]])
          setViewMode('desktop')
          push({ kind: 'output', text: `Opening ${args[0]}...`, color: '#4a6a4a' })
        } else {
          push({ kind: 'output', text: `open: ${args[0] ?? ''}: unknown app`, color: '#ff6060' })
        }
        break
      }
      case 'exit':
        setViewMode('desktop'); return
      default:
        push({ kind: 'output', text: `${cmd}: command not found`, color: '#ff6060' })
    }
    push({ kind: 'blank' })
  }, [openWindow, setViewMode])

  const submit = () => {
    const v = input.trim()
    run(input)
    if (v) setHistory(h => [...h, v])
    setHistIdx(-1)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { submit(); return }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(idx); setInput(history[idx] ?? '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = histIdx + 1
      if (idx >= history.length) { setHistIdx(-1); setInput(''); return }
      setHistIdx(idx); setInput(history[idx])
    }
    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); setLines([]) }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  return (
    <div
      style={{
        height: '100%', background: '#0c0f0a', display: 'flex', flexDirection: 'column',
        fontFamily: '"SF Mono","Menlo","Monaco","Courier New",monospace',
        fontSize: 12, lineHeight: 1.6, color: '#d4d4d4',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 10px 4px' }}>
        {lines.map((l, i) => {
          if (l.kind === 'blank') return <div key={i} style={{ height: 6 }} />
          if (l.kind === 'input') return (
            <div key={i} style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
              <span style={{ color: '#5af78e', userSelect: 'none' }}>eren@phone:~$ </span>
              <span style={{ color: '#d4d4d4' }}>{l.text}</span>
            </div>
          )
          return (
            <div key={i} style={{ color: l.color ?? '#d4d4d4', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {l.text}
            </div>
          )
        })}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#5af78e', flexShrink: 0, userSelect: 'none' }}>eren@phone:~$ </span>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <span style={{ visibility: 'hidden', whiteSpace: 'pre' }}>{input || ' '}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
              spellCheck={false}
              style={{
                position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit',
                color: '#d4d4d4', caretColor: '#5af78e', padding: 0,
              }}
            />
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// ── Settings screen ───────────────────────────────────────────────
function PhoneSettingsScreen() {
  const { viewMode, setViewMode, theme, setTheme, brightness, setBrightness } = useSystemStore()

  const modes: Array<{ v: 'desktop' | 'phone' | 'terminal'; label: string; icon: string }> = [
    { v: 'phone',    label: 'PHONE',    icon: 'smartphone' },
    { v: 'desktop',  label: 'DESKTOP',  icon: 'desktop_windows' },
    { v: 'terminal', label: 'TERMINAL', icon: 'terminal' },
  ]

  const themes = ['cybercore', 'vaporwave', 'matrix', 'amber'] as const

  return (
    <div style={{ overflow: 'auto', height: '100%', padding: '14px' }}>
      {/* View Mode */}
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00ffff', letterSpacing: '0.12em', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #0a1628' }}>
        VIEW MODE
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {modes.map(m => (
          <button
            key={m.v}
            onClick={() => setViewMode(m.v)}
            style={{
              flex: 1,
              background: viewMode === m.v ? '#484fb9' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${viewMode === m.v ? '#9097ff' : '#1a2030'}`,
              color: viewMode === m.v ? '#fff' : '#606880',
              fontFamily: 'var(--font-h)', fontSize: 6, letterSpacing: '0.06em',
              padding: '10px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              transition: 'all 0.18s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Brightness */}
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00ffff', letterSpacing: '0.12em', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #0a1628' }}>
        BRIGHTNESS
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#4a6080' }}>brightness_low</span>
        <input
          type="range" min={20} max={100} value={brightness}
          onChange={e => setBrightness(Number(e.target.value))}
          style={{ flex: 1 }}
          className="sslider"
        />
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff' }}>brightness_high</span>
        <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#00ffff', minWidth: 32 }}>{brightness}%</span>
      </div>

      {/* Theme */}
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#00ffff', letterSpacing: '0.12em', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #0a1628' }}>
        THEME
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {themes.map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              background: theme === t ? '#484fb9' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${theme === t ? '#9097ff' : '#1a2030'}`,
              color: theme === t ? '#fff' : '#606880',
              fontFamily: 'var(--font-h)', fontSize: 7, letterSpacing: '0.04em',
              padding: '9px 6px', textTransform: 'uppercase', transition: 'all 0.18s',
            }}
          >{t}</button>
        ))}
      </div>
    </div>
  )
}

// ── "Open on Desktop" fallback screen ────────────────────────────
function OpenOnDesktopScreen({ app, onOpen }: { app: PhoneAppDef; onOpen: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, padding: 16 }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${app.color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 28px ${app.color}20`,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 30, color: app.color }}>{app.icon}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#fff', letterSpacing: '0.1em' }}>{app.label}</div>
      <div style={{ fontFamily: 'var(--font-b)', fontSize: 13, color: '#4a6080', textAlign: 'center', lineHeight: 1.6 }}>
        This app runs on the desktop.
      </div>
      <button
        onClick={onOpen}
        style={{
          background: '#484fb9', border: 'none', color: '#fff',
          fontFamily: 'var(--font-h)', fontSize: 8, letterSpacing: '0.1em',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
        OPEN ON DESKTOP
      </button>
    </div>
  )
}

// ── App title bar ─────────────────────────────────────────────────
function PhoneAppBar({ title, icon, color, onBack }: {
  title: string; icon: string; color: string; onBack: () => void
}) {
  return (
    <div style={{
      height: 40, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px',
      background: 'rgba(0,0,0,0.4)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', color: '#9097ff',
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-h)', fontSize: 7, letterSpacing: '0.04em',
          padding: '4px 8px 4px 0',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back_ios</span>
        BACK
      </button>
      <div style={{ width: 1, height: 16, background: '#1a2030' }} />
      <span className="material-symbols-outlined" style={{ fontSize: 14, color }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#fff', letterSpacing: '0.08em', flex: 1 }}>
        {title}
      </span>
    </div>
  )
}

// ── Main PhoneView ────────────────────────────────────────────────
export function PhoneView() {
  const { setViewMode } = useSystemStore()
  const { openWindow } = useWindowStore()
  const [activeApp, setActiveApp] = useState<PhoneAppDef | null>(null)

  const handleOpenApp = (app: PhoneAppDef) => {
    if (INLINE.has(app.type)) {
      setActiveApp(app)
    } else {
      setActiveApp(app) // show "open on desktop" screen
    }
  }

  const handleOpenDesktop = (app: PhoneAppDef) => {
    openWindow(app.type)
    setViewMode('desktop')
  }

  const handleBack = () => setActiveApp(null)

  const renderAppContent = (app: PhoneAppDef) => {
    switch (app.type) {
      case 'about':    return <AboutScreen />
      case 'mail':     return <MailScreen />
      case 'devfiles': return <ProjectsScreen category="devfiles" />
      case 'film':     return <ProjectsScreen category="film" />
      case 'game':     return <ProjectsScreen category="game" />
      case 'terminal': return <PhoneTerminalScreen />
      case 'settings': return <PhoneSettingsScreen />
      default:         return <OpenOnDesktopScreen app={app} onOpen={() => handleOpenDesktop(app)} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99980,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setViewMode('desktop') }}
    >
      {/* Phone frame */}
      <motion.div
        initial={{ y: 60, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position: 'relative',
          width: 340,
          height: 'min(88vh, 720px)',
          background: '#06070f',
          border: '3px solid #00ffff',
          borderRadius: 38,
          boxShadow: '0 0 60px rgba(0,255,255,0.22), 0 0 120px rgba(0,255,255,0.08), inset 0 0 20px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Decorative side buttons */}
        <div style={{ position: 'absolute', left: -5, top: 90, width: 5, height: 28, background: '#1a2030', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', left: -5, top: 128, width: 5, height: 28, background: '#1a2030', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', right: -5, top: 110, width: 5, height: 44, background: '#1a2030', borderRadius: '0 2px 2px 0' }} />

        {/* Top bezel (notch area) */}
        <div style={{
          height: 22, flexShrink: 0, background: '#030408',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 3,
        }}>
          {/* Notch pill */}
          <div style={{ width: 100, height: 14, background: '#000', borderRadius: 7, border: '1px solid #1a2030' }} />
        </div>

        {/* Screen area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#020812' }}>
          <PhoneStatusBar />

          {/* Content area with transitions */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {!activeApp ? (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <HomeScreen onOpen={handleOpenApp} />
                </motion.div>
              ) : (
                <motion.div
                  key={activeApp.type}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.18 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
                >
                  <PhoneAppBar
                    title={activeApp.label}
                    icon={activeApp.icon}
                    color={activeApp.color}
                    onBack={handleBack}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    {renderAppContent(activeApp)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dock */}
          <div style={{
            flexShrink: 0,
            padding: '8px 16px 6px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-around',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 20,
              padding: '8px 12px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              {DOCK_APPS.map(app => (
                <button
                  key={app.type}
                  onClick={() => handleOpenApp(app)}
                  style={{
                    background: app.bg,
                    border: 'none',
                    borderRadius: 14,
                    width: 52, height: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#fff' }}>{app.icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bezel — home indicator only */}
        <div style={{
          height: 22, flexShrink: 0, background: '#030408',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            onClick={() => setActiveApp(null)}
            style={{
              width: 120, height: 5, background: '#fff',
              borderRadius: 3, opacity: 0.25,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
