'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSystemStore } from '@/store/systemStore'
import { useWindowStore } from '@/store/windowStore'
import type { WindowType } from '@/config/appMeta'
import { DEVFILES_PROJECTS, FILM_PROJECTS, GAME_PROJECTS, Project } from '@/data/projects'
import { APP_REGISTRY, phoneApps, type AppDef } from '@/config/appRegistry'
import { APP_META } from '@/config/appMeta'
import { SnakeAppCore } from '../windows/SnakeWindow'
import { PaintAppCore } from '../windows/PaintWindow'
import { SnowboardAppCore } from '../windows/SnowboardWindow'


// ── Phone wallpaper options ───────────────────────────────────────
export const PHONE_WALLPAPERS = [
  { name: 'TEAL',   hex: '#008080' },
  { name: 'NAVY',   hex: '#000050' },
  { name: 'FOREST', hex: '#1a4a1a' },
  { name: 'WINE',   hex: '#5a0a1a' },
  { name: 'SLATE',  hex: '#1e2a3a' },
  { name: 'PURPLE', hex: '#2e0a5a' },
  { name: 'OLIVE',  hex: '#3a3a0a' },
  { name: 'VOID',   hex: '#000000' },
]

// ── Win95 tokens — light ──────────────────────────────────────────
const C_LIGHT = {
  bg:     '#c0c0c0',
  navy:   '#000080',
  white:  '#ffffff',
  black:  '#000000',
  gray:   '#808080',
  raised: 'inset 1.5px 1.5px 0 #ffffff, inset -1.5px -1.5px 0 #808080',
  outer:  'inset 1.5px 1.5px 0 #ffffff, inset -1.5px -1.5px 0 #808080, 1.5px 1.5px 0 #000000',
  sunken: 'inset 2px 2px 0 #808080, inset -1px -1px 0 #ffffff',
  font:   'var(--font-h)',
  fontB:  'var(--font-b)',
}
// ── Win95 tokens — dark ───────────────────────────────────────────
const C_DARK = {
  bg:     '#2e2e2e',
  navy:   '#000080',
  white:  '#ffffff',
  black:  '#cccccc',
  gray:   '#555555',
  raised: 'inset 1.5px 1.5px 0 #555555, inset -1.5px -1.5px 0 #111111',
  outer:  'inset 1.5px 1.5px 0 #555555, inset -1.5px -1.5px 0 #111111, 1.5px 1.5px 0 #000000',
  sunken: 'inset 2px 2px 0 #111111, inset -1px -1px 0 #555555',
  font:   'var(--font-h)',
  fontB:  'var(--font-b)',
}
// Legacy alias (used where hooks aren't available)
const C = C_LIGHT

const DOCK_APPS: AppDef[] = (['about', 'mail', 'browser', 'settings'] as const)
  .map(t => APP_REGISTRY.find(a => a.type === t)!)
  .filter(Boolean)

// ── Helpers ───────────────────────────────────────────────────────
function W95Header({ title }: { title: string }) {
  return (
    <div style={{
      fontFamily: C.font, fontSize: 8, fontWeight: 700, color: C.black,
      letterSpacing: '0.08em', marginBottom: 6, paddingBottom: 4,
      borderBottom: `2px solid ${C.gray}`,
      boxShadow: `0 1px 0 ${C.white}`,
    }}>
      {title}
    </div>
  )
}

function W95Btn({ children, onClick, primary, style }: {
  children: React.ReactNode; onClick?: () => void; primary?: boolean; style?: React.CSSProperties
}) {
  const [p, setP] = useState(false)
  return (
    <button
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)} onMouseLeave={() => setP(false)}
      onClick={onClick}
      style={{
        background: primary ? C.navy : C.bg, color: primary ? C.white : C.black,
        fontFamily: C.font, fontSize: 8, letterSpacing: '0.06em',
        padding: '5px 14px', border: 'none', textTransform: 'uppercase' as const,
        boxShadow: p ? C.sunken : C.raised,
        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
        ...style,
      }}
    >{children}</button>
  )
}

function PhoneIconContent({ app, size = 22 }: { app: AppDef; size?: number }) {
  if (app.phoneIconNode) return <>{app.phoneIconNode}</>
  return <span className="material-symbols-outlined" style={{ fontSize: size, color: C.black }}>{app.icon}</span>
}

// ── Status bar ────────────────────────────────────────────────────
function PhoneStatusBar() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setTime(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 10000); return () => clearInterval(id)
  }, [])
  return (
    <div style={{
      height: 28, flexShrink: 0, background: C.navy,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 6px', borderBottom: `1px solid ${C.black}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 16, height: 16, background: C.bg, boxShadow: C.raised, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 8, fontFamily: C.font, color: C.navy, fontWeight: 900 }}>L</span>
        </div>
        <span style={{ fontFamily: C.font, fontSize: 8, color: C.white, letterSpacing: '0.08em', fontWeight: 700 }}>LIZARD.OS MOBILE</span>
      </div>
      <div style={{ background: C.bg, boxShadow: C.sunken, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 10, color: C.black }}>schedule</span>
        <span style={{ fontFamily: C.font, fontSize: 8, color: C.black }}>{time}</span>
      </div>
    </div>
  )
}

// ── Home screen ───────────────────────────────────────────────────
function HomeScreen({ apps, onOpen, wallpaper, T }: { apps: AppDef[]; onOpen: (app: AppDef) => void; wallpaper: string; T: typeof C_LIGHT }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '10px 6px 4px', background: wallpaper }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 2px' }}>
        {apps.map(app => (
          <button key={app.type} onClick={() => onOpen(app)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '3px' }}>
            <div style={{ width: 48, height: 48, background: T.bg, boxShadow: T.outer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneIconContent app={app} size={24} />
            </div>
            <span style={{ fontFamily: T.font, fontSize: 7, color: '#ffffff', textShadow: `1px 1px 0 #000000`, textTransform: 'uppercase', textAlign: 'center', maxWidth: 58, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {app.phoneLabel ?? app.label}
            </span>
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
    <div style={{ overflow: 'auto', height: '100%', background: C.bg, padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Name card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.white, boxShadow: C.sunken, padding: '8px 10px' }}>
        <div style={{ width: 48, height: 48, flexShrink: 0, background: C.navy, boxShadow: C.outer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: C.font, fontSize: 13, color: C.white, fontWeight: 900 }}>IEK</span>
        </div>
        <div>
          <div style={{ fontFamily: C.font, fontSize: 9, color: C.black, fontWeight: 900, letterSpacing: '0.04em', marginBottom: 2 }}>IBRAHIM EREN KILISLI</div>
          <div style={{ fontFamily: C.font, fontSize: 7, color: '#444', letterSpacing: '0.03em' }}>SOFTWARE ENG + FILMMAKER</div>
        </div>
      </div>
      {/* Bio */}
      <div>
        <W95Header title="ABOUT.TXT" />
        <div style={{ background: C.white, boxShadow: C.sunken, padding: '8px 10px' }}>
          <p style={{ fontFamily: C.fontB, fontSize: 12, color: C.black, lineHeight: 1.6, margin: 0 }}>
            Building at the intersection of code and film. Software engineer with deep roots in game development, real-time cinematics, and creative technology.
          </p>
        </div>
      </div>
      {/* Skills */}
      <div>
        <W95Header title="SKILLS" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {skills.map(s => (
            <span key={s} style={{ fontFamily: C.font, fontSize: 7, color: C.black, background: C.bg, boxShadow: C.raised, padding: '2px 6px', textTransform: 'uppercase' }}>{s}</span>
          ))}
        </div>
      </div>
      {/* Links */}
      <div>
        <W95Header title="LINKS" />
        <div style={{ background: C.white, boxShadow: C.sunken }}>
          {[{ label: 'GitHub', icon: 'code' }, { label: 'LinkedIn', icon: 'business_center' }, { label: 'IMDb', icon: 'movie' }].map((link, i) => (
            <div key={link.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderBottom: i < 2 ? `1px solid ${C.bg}` : 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.navy }}>{link.icon}</span>
              <span style={{ fontFamily: C.font, fontSize: 8, color: C.black, flex: 1, letterSpacing: '0.03em' }}>{link.label}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 12, color: C.gray }}>arrow_forward</span>
            </div>
          ))}
        </div>
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

  const field: React.CSSProperties = { width: '100%', background: C.white, boxShadow: C.sunken, color: C.black, fontFamily: C.fontB, fontSize: 12, padding: '5px 7px', outline: 'none', border: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontFamily: C.font, fontSize: 7, color: C.black, letterSpacing: '0.05em', display: 'block', marginBottom: 3 }

  if (sent) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: C.bg, gap: 12 }}>
      <div style={{ boxShadow: C.outer, background: C.bg, padding: '20px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 32, color: C.navy }}>check_circle</span>
        <div style={{ fontFamily: C.font, fontSize: 9, color: C.black, letterSpacing: '0.08em' }}>MESSAGE SENT</div>
        <W95Btn onClick={() => { setName(''); setEmail(''); setMsg(''); setSent(false) }}>NEW MESSAGE</W95Btn>
      </div>
    </div>
  )

  return (
    <div style={{ overflow: 'auto', height: '100%', padding: 10, background: C.bg, display: 'flex', flexDirection: 'column', gap: 7 }}>
      <W95Header title="COMPOSE MESSAGE" />
      <div><span style={lbl}>NAME</span><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={field} /></div>
      <div><span style={lbl}>EMAIL</span><input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={field} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={lbl}>MESSAGE</span>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Your message..." style={{ ...field, resize: 'none', flex: 1, minHeight: 70 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <W95Btn onClick={() => canSend && setSent(true)} primary={!!canSend} style={{ opacity: canSend ? 1 : 0.5 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>send</span>
          SEND
        </W95Btn>
      </div>
    </div>
  )
}

// ── Projects screen ───────────────────────────────────────────────
function ProjectsScreen({ category }: { category: 'devfiles' | 'film' | 'game' }) {
  const projects: Project[] = category === 'devfiles' ? DEVFILES_PROJECTS : category === 'film' ? FILM_PROJECTS : GAME_PROJECTS
  const [selected, setSelected] = useState<Project | null>(null)

  if (selected) return (
    <div style={{ overflow: 'auto', height: '100%', padding: 10, background: C.bg, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <W95Btn onClick={() => setSelected(null)}>
        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_back</span>BACK
      </W95Btn>
      <div style={{ background: C.white, boxShadow: C.sunken, padding: '10px 12px' }}>
        <div style={{ fontFamily: C.font, fontSize: 10, color: C.black, fontWeight: 900, marginBottom: 2 }}>{selected.name}</div>
        <div style={{ fontFamily: C.font, fontSize: 7, color: C.navy, marginBottom: 8 }}>{selected.year} · {selected.type}</div>
        <p style={{ fontFamily: C.fontB, fontSize: 12, color: C.black, lineHeight: 1.65, marginBottom: 8 }}>{selected.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {selected.tags.map(t => <span key={t} style={{ fontFamily: C.font, fontSize: 6, color: C.black, background: C.bg, boxShadow: C.raised, padding: '2px 6px' }}>{t}</span>)}
        </div>
      </div>
      {selected.links.map(l => (
        <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: C.font, fontSize: 7, color: C.navy, textDecoration: 'none', background: C.bg, boxShadow: C.raised, padding: '5px 10px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>open_in_new</span>{l.label}
        </a>
      ))}
    </div>
  )

  return (
    <div style={{ height: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 44px 60px', background: C.bg, padding: '3px 6px', borderBottom: `1px solid ${C.gray}`, flexShrink: 0, gap: 2 }}>
        {['NAME','YEAR','TYPE'].map(h => <span key={h} style={{ fontFamily: C.font, fontSize: 7, color: C.black, boxShadow: C.raised, padding: '2px 4px', background: C.bg }}>{h}</span>)}
      </div>
      <div style={{ flex: 1, margin: 4, boxShadow: C.sunken, background: C.white, overflow: 'auto' }}>
        {projects.map((p, i) => (
          <button key={p.id} onClick={() => setSelected(p)} style={{ width: '100%', background: i % 2 === 0 ? C.white : '#f0f0f0', border: 'none', borderBottom: `1px solid ${C.bg}`, padding: '6px 8px', display: 'grid', gridTemplateColumns: '1fr 44px 60px', alignItems: 'center', textAlign: 'left', gap: 2 }}>
            <span style={{ fontFamily: C.font, fontSize: 8, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
            <span style={{ fontFamily: C.font, fontSize: 7, color: C.gray }}>{p.year}</span>
            <span style={{ fontFamily: C.font, fontSize: 6, color: C.gray, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.type}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Terminal screen ───────────────────────────────────────────────
type TermLine = { kind: 'input'; text: string } | { kind: 'output'; text: string; color?: string } | { kind: 'blank' }

function PhoneTerminalScreen() {
  const openWindow = useWindowStore(s => s.openWindow)
  const { setViewMode } = useSystemStore()
  const [lines, setLines] = useState<TermLine[]>([
    { kind: 'output', text: 'LIZARD.OS MOBILE COMMAND PROMPT', color: '#c0c0c0' },
    { kind: 'output', text: 'Type "help" for commands.', color: '#808080' },
    { kind: 'blank' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const push = (...nl: TermLine[]) => setLines(l => [...l, ...nl])

  const run = useCallback((raw: string) => {
    const trimmed = raw.trim(); const [cmd, ...args] = trimmed.split(/\s+/)
    push({ kind: 'input', text: trimmed }); if (!trimmed) return
    switch (cmd) {
      case 'help': push({ kind: 'output', text: 'help  ls  cat  whoami  date  clear  neofetch  open  exit', color: '#c0c0c0' }); break
      case 'ls': push({ kind: 'output', text: 'about.txt  projects/  README.md', color: '#8080ff' }); break
      case 'whoami': push({ kind: 'output', text: 'eren (uid=1000)' }); break
      case 'date': push({ kind: 'output', text: new Date().toString() }); break
      case 'clear': setLines([]); return
      case 'neofetch': push({ kind: 'output', text: 'OS: LIZARD.OS PHONE' }, { kind: 'output', text: 'User: Ibrahim Eren Kilisli' }, { kind: 'output', text: 'Theme: WIN95' }); break
      case 'cat': args[0] === 'about.txt' ? push({ kind: 'output', text: 'Ibrahim Eren Kilisli — Software Engineer & Filmmaker' }) : push({ kind: 'output', text: `cat: ${args[0] ?? ''}: No such file`, color: '#ff6060' }); break
      case 'open': {
        const m: Record<string, WindowType> = { about: 'about', mail: 'mail', snake: 'snake', snowboard: 'snowboard', paint: 'paint', music: 'music', calc: 'calc', browser: 'browser', settings: 'settings' }
        if (m[args[0]]) { openWindow(m[args[0]]); setViewMode('desktop'); push({ kind: 'output', text: `Opening ${args[0]}...`, color: '#808080' }) }
        else push({ kind: 'output', text: `open: ${args[0] ?? ''}: unknown app`, color: '#ff6060' })
        break
      }
      case 'exit': setViewMode('desktop'); return
      default: push({ kind: 'output', text: `${cmd}: command not found`, color: '#ff6060' })
    }
    push({ kind: 'blank' })
  }, [openWindow, setViewMode])

  const submit = () => { const v = input.trim(); run(input); if (v) setHistory(h => [...h, v]); setHistIdx(-1); setInput('') }
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { submit(); return }
    if (e.key === 'ArrowUp') { e.preventDefault(); const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1); setHistIdx(idx); setInput(history[idx] ?? '') }
    if (e.key === 'ArrowDown') { e.preventDefault(); const idx = histIdx + 1; if (idx >= history.length) { setHistIdx(-1); setInput(''); return }; setHistIdx(idx); setInput(history[idx]) }
  }
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  return (
    <div style={{ height: '100%', background: '#000', display: 'flex', flexDirection: 'column', fontFamily: '"Courier New",monospace', fontSize: 12, lineHeight: 1.5, color: '#c0c0c0' }} onClick={() => inputRef.current?.focus()}>
      <div style={{ background: '#404040', padding: '2px 8px', fontFamily: C.font, fontSize: 7, color: C.white }}>C:\LIZARD.OS&gt;</div>
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 8px 4px' }}>
        {lines.map((l, i) => {
          if (l.kind === 'blank') return <div key={i} style={{ height: 5 }} />
          if (l.kind === 'input') return <div key={i}><span style={{ color: '#c0c0c0', userSelect: 'none' }}>C:\&gt; </span><span style={{ color: '#fff' }}>{l.text}</span></div>
          return <div key={i} style={{ color: l.color ?? '#c0c0c0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{l.text}</div>
        })}
        <div style={{ display: 'flex' }}>
          <span style={{ color: '#c0c0c0', userSelect: 'none' }}>C:\&gt; </span>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ visibility: 'hidden', whiteSpace: 'pre' }}>{input || ' '}</span>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} autoFocus spellCheck={false} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 'inherit', color: '#fff', caretColor: '#c0c0c0', padding: 0 }} />
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// ── Settings screen ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
function PhoneSettingsScreen() {
  const { viewMode, setViewMode, phoneUiMode, setPhoneUiMode, brightness, setBrightness, phoneWallpaper, setPhoneWallpaper } = useSystemStore()
  const T = phoneUiMode === 'dark' ? C_DARK : C_LIGHT
  const modes: Array<{ v: 'desktop' | 'phone' | 'terminal'; label: string; icon: string }> = [
    { v: 'phone',    label: 'PHONE',   icon: 'smartphone' },
    { v: 'desktop',  label: 'DESKTOP', icon: 'desktop_windows' },
    { v: 'terminal', label: 'TERMINAL',icon: 'terminal' },
  ]
  return (
    <div style={{ overflow: 'auto', height: '100%', padding: 10, background: T.bg }}>
      <W95Header title="VIEW MODE" />
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {modes.map(m => (
          <button key={m.v} onClick={() => setViewMode(m.v)} style={{ flex: 1, background: viewMode === m.v ? T.navy : T.bg, color: viewMode === m.v ? T.white : T.black, fontFamily: T.font, fontSize: 6, letterSpacing: '0.04em', padding: '8px 2px', border: 'none', boxShadow: viewMode === m.v ? T.sunken : T.raised, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{m.icon}</span>{m.label}
          </button>
        ))}
      </div>
      <W95Header title="WINDOW CHROME" />
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {([{ v: 'light' as const, label: 'LIGHT', preview: '#c8c8c8' }, { v: 'dark' as const, label: 'DARK', preview: '#2e2e2e' }]).map(m => (
          <button key={m.v} onClick={() => setPhoneUiMode(m.v)} style={{ flex: 1, height: 48, background: m.preview, border: phoneUiMode === m.v ? `3px solid ${T.navy}` : `2px solid ${T.gray}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, boxShadow: phoneUiMode === m.v ? T.sunken : T.raised }}>
            <span style={{ fontFamily: T.font, fontSize: 7, color: m.v === 'dark' ? '#ddd' : '#000', letterSpacing: '0.06em' }}>{m.label}</span>
            {phoneUiMode === m.v && <span style={{ fontFamily: T.font, fontSize: 5, color: m.v === 'dark' ? '#bbb' : T.navy }}>✓ ACTIVE</span>}
          </button>
        ))}
      </div>
      <W95Header title="BRIGHTNESS" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: T.gray }}>brightness_low</span>
        <div style={{ flex: 1, boxShadow: T.sunken, background: T.white, padding: '4px 2px' }}>
          <input type="range" min={20} max={100} value={brightness} onChange={e => setBrightness(Number(e.target.value))} style={{ width: '100%', display: 'block' }} className="sslider" />
        </div>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: T.black }}>brightness_high</span>
        <span style={{ fontFamily: T.font, fontSize: 7, color: T.black, minWidth: 28 }}>{brightness}%</span>
      </div>
      <W95Header title="WALLPAPER" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, marginBottom: 8 }}>
        {PHONE_WALLPAPERS.map(wp => (
          <button key={wp.hex} onClick={() => setPhoneWallpaper(wp.hex)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 2 }}>
            <div style={{ width: 46, height: 30, background: wp.hex, boxShadow: phoneWallpaper === wp.hex ? `0 0 0 3px ${T.navy}` : T.raised, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {phoneWallpaper === wp.hex && <span style={{ fontSize: 14, color: '#fff', textShadow: '0 1px 2px #000' }}>✓</span>}
            </div>
            <span style={{ fontFamily: T.font, fontSize: 5, color: T.black, letterSpacing: '0.02em' }}>{wp.name}</span>
          </button>
        ))}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: T.bg, boxShadow: T.raised, padding: '5px 10px', width: 'fit-content' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: T.black }}>colorize</span>
        <span style={{ fontFamily: T.font, fontSize: 7, color: T.black }}>CUSTOM</span>
        <input type="color" value={phoneWallpaper} onChange={e => setPhoneWallpaper(e.target.value)} style={{ width: 24, height: 16, border: 'none', padding: 0, cursor: 'pointer' }} />
      </label>
    </div>
  )
}

// ── Boot screen ───────────────────────────────────────────────────
const BOOT_LINES = ['Starting LIZARD.OS...', 'Loading device drivers...', 'Initializing display...', 'Launching shell...']

function PhoneBootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState<string[]>([])
  useEffect(() => {
    let p = 0
    const interval = setInterval(() => { p = Math.min(p + 2, 100); setProgress(p); if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 350) } }, 36)
    const timeouts = BOOT_LINES.map((line, i) => setTimeout(() => setLines(prev => [...prev, line]), 200 + i * 380))
    return () => { clearInterval(interval); timeouts.forEach(clearTimeout) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.navy, padding: '20px 18px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <div style={{ width: 56, height: 56, background: C.bg, boxShadow: C.outer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: C.font, fontSize: 14, color: C.navy, fontWeight: 900 }}>L</span>
        </div>
        <span style={{ fontFamily: C.font, fontSize: 11, color: C.white, letterSpacing: '0.25em', fontWeight: 900 }}>LIZARD.OS</span>
        <span style={{ fontFamily: C.font, fontSize: 7, color: '#8080c0', letterSpacing: '0.12em' }}>MOBILE EDITION</span>
      </div>
      <div>
        <div style={{ height: 14, boxShadow: C.sunken, background: C.black, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: C.white, transition: 'width 0.04s' }} />
        </div>
        <div style={{ fontFamily: C.font, fontSize: 6, color: '#8080c0', letterSpacing: '0.06em', marginTop: 4, textAlign: 'center' }}>{progress}%</div>
      </div>
      <div style={{ flex: 1 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ fontFamily: '"Courier New",monospace', fontSize: 9, color: C.white, letterSpacing: '0.03em', marginBottom: 3 }}>&gt; {line}</div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Open on Desktop fallback ──────────────────────────────────────
function OpenOnDesktopScreen({ app, onOpen }: { app: AppDef; onOpen: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, padding: 20, background: C.bg }}>
      <div style={{ width: 56, height: 56, background: C.bg, boxShadow: C.outer, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PhoneIconContent app={app} size={28} />
      </div>
      <div style={{ fontFamily: C.font, fontSize: 9, color: C.black, letterSpacing: '0.06em', textAlign: 'center' }}>{app.phoneLabel ?? app.label}</div>
      <div style={{ fontFamily: C.fontB, fontSize: 12, color: C.gray, textAlign: 'center', lineHeight: 1.5, background: C.white, boxShadow: C.sunken, padding: '8px 12px' }}>
        This app runs on the desktop.
      </div>
      <W95Btn onClick={onOpen} primary>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>OPEN ON DESKTOP
      </W95Btn>
    </div>
  )
}

// ── App title bar ─────────────────────────────────────────────────
function PhoneAppBar({ title, icon, onBack }: { title: string; icon: string; onBack: () => void }) {
  return (
    <div style={{ height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', background: C.navy }}>
      <button onClick={onBack} style={{ background: C.bg, border: 'none', boxShadow: C.raised, display: 'flex', alignItems: 'center', gap: 3, fontFamily: C.font, fontSize: 7, color: C.black, padding: '3px 7px', margin: '3px 6px 3px 4px', height: 20 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>arrow_back_ios</span>BACK
      </button>
      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)', marginRight: 8 }} />
      <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.white, marginRight: 5 }}>{icon}</span>
      <span style={{ fontFamily: C.font, fontSize: 9, color: C.white, letterSpacing: '0.06em', fontWeight: 700 }}>{title}</span>
    </div>
  )
}

// ── App Market screen ─────────────────────────────────────────────
const MARKET_APPS = APP_META.filter(a =>
  a.type !== 'projectdetail' &&
  a.type !== 'cinema' &&
  a.type !== 'arcade' &&
  a.type !== 'swr' &&
  a.type !== 'appmarket' &&
  a.type !== 'sysinfo'
)
const SYSTEM_APPS = MARKET_APPS.filter(a => a.preInstalled)
const OPTIONAL_APPS = MARKET_APPS.filter(a => !a.preInstalled)

function PhoneAppMarketScreen({ T }: { T: typeof C_LIGHT }) {
  const { installedApps, installApp, uninstallApp } = useWindowStore()
  const [tab, setTab] = useState<'install' | 'system'>('install')
  const [installing, setInstalling] = useState<Partial<Record<string, boolean>>>({})

  const handleInstall = (type: WindowType) => {
    setInstalling(p => ({ ...p, [type]: true }))
    setTimeout(() => {
      installApp(type)
      setInstalling(p => ({ ...p, [type]: false }))
    }, 1400)
  }

  const appsToList = tab === 'system' ? SYSTEM_APPS : OPTIONAL_APPS

  return (
    <div style={{ overflow: 'auto', height: '100%', padding: 10, background: T.bg, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => setTab('install')} style={{ flex: 1, background: tab === 'install' ? T.navy : T.bg, color: tab === 'install' ? T.white : T.black, border: 'none', boxShadow: tab === 'install' ? T.sunken : T.raised, padding: '8px 0', fontFamily: T.font, fontSize: 8 }}>INSTALL APPS</button>
        <button onClick={() => setTab('system')} style={{ flex: 1, background: tab === 'system' ? T.navy : T.bg, color: tab === 'system' ? T.white : T.black, border: 'none', boxShadow: tab === 'system' ? T.sunken : T.raised, padding: '8px 0', fontFamily: T.font, fontSize: 8 }}>SYSTEM APPS</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 10 }}>
        {appsToList.map(app => {
          const isInstalled = app.preInstalled || installedApps.includes(app.type)
          const isInstalling = !!installing[app.type]

          return (
            <div key={app.type} style={{ background: T.white, boxShadow: T.sunken, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: T.bg, boxShadow: T.raised, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                 <span className="material-symbols-outlined" style={{ fontSize: 20, color: app.iconColor || T.black }}>{app.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.font, fontSize: 9, color: T.black, marginBottom: 2 }}>{app.label}</div>
                <div style={{ fontFamily: T.font, fontSize: 6, color: T.gray }}>{app.spotlightDesc}</div>
              </div>
              <div>
                {app.preInstalled ? (
                   <div style={{ fontFamily: T.font, fontSize: 6, color: T.gray, border: `1px solid ${T.gray}`, padding: '4px 6px' }}>SYSTEM</div>
                ) : isInstalling ? (
                   <div style={{ fontFamily: T.font, fontSize: 6, color: '#9097ff', border: `1px solid #9097ff`, background: '#2a3050', padding: '4px 6px' }}>LOADING</div>
                ) : isInstalled ? (
                   <W95Btn onClick={() => uninstallApp(app.type)} style={{ color: '#cc5555' }}>REMOVE</W95Btn>
                ) : (
                   <W95Btn onClick={() => handleInstall(app.type)} primary>INSTALL</W95Btn>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main PhoneView ────────────────────────────────────────────────
export function PhoneView({ fullscreen = false }: { fullscreen?: boolean }) {
  const { setViewMode, phoneUiMode, phoneWallpaper } = useSystemStore()
  const { openWindow, installedApps } = useWindowStore()
  const [activeApp, setActiveApp] = useState<AppDef | null>(null)
  const [booted, setBooted] = useState(false)
  const T = phoneUiMode === 'dark' ? C_DARK : C_LIGHT

  const handleOpenDesktop = (app: AppDef) => { openWindow(app.type); setViewMode('desktop') }

  const renderAppContent = (app: AppDef) => {
    if (!app.phoneInline) return <OpenOnDesktopScreen app={app} onOpen={() => handleOpenDesktop(app)} />
    switch (app.type) {
      case 'about':     return <AboutScreen />
      case 'mail':      return <MailScreen />
      case 'devfiles':  return <ProjectsScreen category="devfiles" />
      case 'film':      return <ProjectsScreen category="film" />
      case 'game':      return <ProjectsScreen category="game" />
      case 'terminal':  return <PhoneTerminalScreen />
      case 'settings':  return <PhoneSettingsScreen />
      case 'appmarket': return <PhoneAppMarketScreen T={T} />
      case 'paint':     return <PaintAppCore isMobile />
      case 'snake':     return <SnakeAppCore isMobile />
      case 'snowboard': return <SnowboardAppCore isMobile />
      default:          return null
    }
  }

  const screenContent = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: phoneWallpaper }}>
      <AnimatePresence mode="wait">
        {!booted ? (
          <PhoneBootScreen key="boot" onComplete={() => setBooted(true)} />
        ) : (
          <motion.div key="ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <PhoneStatusBar />
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                {!activeApp ? (
                  <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
                    <HomeScreen apps={phoneApps(installedApps)} onOpen={app => setActiveApp(app)} wallpaper={phoneWallpaper} T={T} />
                  </motion.div>
                ) : (
                  <motion.div key={activeApp.type} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.18 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
                    <PhoneAppBar title={activeApp.phoneLabel ?? activeApp.label} icon={activeApp.icon} onBack={() => setActiveApp(null)} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>{renderAppContent(activeApp)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Win95 Taskbar Dock */}
            <div style={{ flexShrink: 0, height: 60, background: T.bg, borderTop: `2px solid ${T.white}`, boxShadow: `inset 0 1px 0 ${T.white}`, display: 'flex', alignItems: 'center', padding: '0 4px', gap: 3 }}>
              {DOCK_APPS.map(app => (
                <button key={app.type} onClick={() => setActiveApp(app)} style={{ flex: 1, background: T.bg, border: 'none', boxShadow: T.raised, height: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: T.black }}>{app.icon}</span>
                  <span style={{ fontFamily: T.font, fontSize: 9, color: T.black, textTransform: 'uppercase', letterSpacing: '0.01em' }}>{app.phoneLabel ?? app.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  if (fullscreen) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ position: 'fixed', inset: 0, zIndex: 99980, display: 'flex', flexDirection: 'column' }}>
      {screenContent}
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      style={{ position: 'fixed', inset: 0, zIndex: 99980, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) setViewMode('desktop') }}
    >
      <motion.div
        initial={{ y: 60, scale: 0.92, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 60, scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{ position: 'relative', width: 340, height: 'min(88vh, 720px)', background: C.bg, boxShadow: 'inset 3px 3px 0 #ffffff, inset -3px -3px 0 #808080, 3px 3px 0 #000000', borderRadius: 6, border: `2px solid ${C.gray}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Side buttons */}
        <div style={{ position: 'absolute', left: -4, top: 90, width: 4, height: 24, background: C.gray }} />
        <div style={{ position: 'absolute', left: -4, top: 124, width: 4, height: 24, background: C.gray }} />
        <div style={{ position: 'absolute', right: -4, top: 106, width: 4, height: 36, background: C.gray }} />
        {/* Top bezel */}
        <div style={{ height: 22, flexShrink: 0, background: C.bg, boxShadow: `inset 0 -1px 0 ${C.gray}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[...Array(7)].map((_, i) => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: C.gray }} />)}
          </div>
        </div>
        {screenContent}
        {/* Bottom bezel — home button */}
        <div style={{ height: 24, flexShrink: 0, background: C.bg, boxShadow: `inset 0 1px 0 ${C.gray}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setActiveApp(null)} style={{ width: 22, height: 22, borderRadius: '50%', background: C.bg, boxShadow: C.raised, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <div style={{ width: 10, height: 10, boxShadow: C.sunken }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
