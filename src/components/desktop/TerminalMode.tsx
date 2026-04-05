'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSystemStore } from '@/store/systemStore'
import { useWindowStore, WindowType } from '@/store/windowStore'

type Line =
  | { kind: 'input';  text: string; pwd: string }
  | { kind: 'output'; text: string; color?: string }
  | { kind: 'blank' }

type FSNode = { type: 'file'; content: string } | { type: 'dir'; children: Record<string, FSNode> }

const FS: Record<string, FSNode> = {
  home: {
    type: 'dir', children: {
      eren: {
        type: 'dir', children: {
          'about.txt':  { type: 'file', content: 'Ibrahim Eren Kilisli\nSoftware Engineer & Filmmaker\nBuilding at the intersection of code and film.' },
          'README.md':  { type: 'file', content: '# OS.WEBSITE LIZARD VERSION\nPersonal portfolio as a fictional OS.\nStack: Next.js · TypeScript · Framer Motion · Zustand' },
          '.bashrc':    { type: 'file', content: 'export PS1="eren@os-website:~$ "\nalias cls="clear"\nalias ll="ls -la"' },
          projects: {
            type: 'dir', children: {
              dev:   { type: 'dir', children: { 'os-website': { type: 'dir', children: { 'index.tsx': { type: 'file', content: 'export default function Page() { return <Desktop /> }' } } } } },
              film:  { type: 'dir', children: { 'showreel.mp4': { type: 'file', content: '[binary video file]' } } },
              games: { type: 'dir', children: { 'snake.ts': { type: 'file', content: '// Snake game' }, 'snowboard.ts': { type: 'file', content: '// Snowboard physics' } } },
            },
          },
        },
      },
    },
  },
  usr: { type: 'dir', children: { bin: { type: 'dir', children: {} } } },
  etc: { type: 'dir', children: { 'os-release': { type: 'file', content: 'NAME="OS.WEBSITE"\nVERSION="LIZARD VERSION"\nBUILD="2026"' } } },
}

function resolvePath(cwd: string, target: string): string {
  if (target.startsWith('/')) return target
  const parts = cwd === '/' ? [] : cwd.split('/').filter(Boolean)
  for (const seg of target.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return '/' + parts.join('/')
}

function getNode(path: string): FSNode | null {
  if (path === '/') return { type: 'dir', children: FS }
  const parts = path.split('/').filter(Boolean)
  let node: FSNode = { type: 'dir', children: FS }
  for (const p of parts) {
    if (node.type !== 'dir') return null
    const child: FSNode | undefined = node.children[p]
    if (!child) return null
    node = child
  }
  return node
}

const NEOFETCH_ART = [
  '        .\'-.',
  '      .\'     \'.',
  '    .\'  .---.  \'.',
  '   /  /       \\  \\',
  '  |  |  ( )    |  |',
  '   \\  \\   ___  / /',
  '    \'.  `-----\'  .\'',
  '      \'-._____.-\'',
]

export function TerminalMode() {
  const { setViewMode } = useSystemStore()
  const openWindow = useWindowStore(s => s.openWindow)

  const [lines, setLines] = useState<Line[]>([
    { kind: 'output', text: '╔══════════════════════════════════════════════╗', color: '#00fd00' },
    { kind: 'output', text: '║   OS.WEBSITE — FULL TERMINAL MODE             ║', color: '#00fd00' },
    { kind: 'output', text: '╚══════════════════════════════════════════════╝', color: '#00fd00' },
    { kind: 'output', text: 'Type "help" for commands.  Press Esc or type "exit" to return.', color: '#2a5a2a' },
    { kind: 'blank' },
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('/home/eren')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const prompt = `eren@os-website:${cwd === '/home/eren' ? '~' : cwd}$`

  const push = (...nl: Line[]) => setLines(l => [...l, ...nl])

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim()
    const [cmd, ...args] = trimmed.split(/\s+/)
    push({ kind: 'input', text: trimmed, pwd: cwd })
    if (!trimmed) return

    switch (cmd) {
      case 'help':
        push(
          { kind: 'output', text: 'Available commands:', color: '#00fd00' },
          { kind: 'output', text: '  ls [path]    — list directory' },
          { kind: 'output', text: '  cd <path>    — change directory' },
          { kind: 'output', text: '  pwd          — print working directory' },
          { kind: 'output', text: '  cat <file>   — print file' },
          { kind: 'output', text: '  echo <text>  — print text' },
          { kind: 'output', text: '  clear        — clear screen' },
          { kind: 'output', text: '  whoami       — current user' },
          { kind: 'output', text: '  date         — date/time' },
          { kind: 'output', text: '  uname        — OS info' },
          { kind: 'output', text: '  neofetch     — system info' },
          { kind: 'output', text: '  open <app>   — open desktop app' },
          { kind: 'output', text: '  history      — command history' },
          { kind: 'output', text: '  exit         — return to desktop' },
        )
        break

      case 'pwd':
        push({ kind: 'output', text: cwd })
        break

      case 'whoami':
        push({ kind: 'output', text: 'eren  (uid=1000, groups=admin,wheel)' })
        break

      case 'date':
        push({ kind: 'output', text: new Date().toString() })
        break

      case 'uname': {
        const flag = args[0] ?? '-s'
        if (flag === '-a') push({ kind: 'output', text: 'OS.WEBSITE LIZARD VERSION os-website 2026.04 x86_64 GNU/Linux' })
        else push({ kind: 'output', text: 'OS.WEBSITE' })
        break
      }

      case 'echo':
        push({ kind: 'output', text: args.join(' ').replace(/^["']|["']$/g, '') })
        break

      case 'clear':
        setLines([]); return

      case 'ls': {
        const target = args[0] ? resolvePath(cwd, args[0]) : cwd
        const node = getNode(target)
        if (!node) { push({ kind: 'output', text: `ls: ${args[0]}: No such file or directory`, color: '#ff4444' }); break }
        if (node.type === 'file') { push({ kind: 'output', text: args[0] ?? target }); break }
        const entries = Object.entries(node.children)
        if (!entries.length) break
        const dirs  = entries.filter(([,v]) => v.type === 'dir').map(([k]) => k + '/')
        const files = entries.filter(([,v]) => v.type === 'file').map(([k]) => k)
        if (dirs.length)  push({ kind: 'output', text: dirs.join('  '), color: '#00aaff' })
        if (files.length) push({ kind: 'output', text: files.join('  ') })
        break
      }

      case 'cd': {
        const target = args[0] ? resolvePath(cwd, args[0]) : '/home/eren'
        const node = getNode(target)
        if (!node) { push({ kind: 'output', text: `cd: ${args[0]}: No such file or directory`, color: '#ff4444' }); break }
        if (node.type === 'file') { push({ kind: 'output', text: `cd: ${args[0]}: Not a directory`, color: '#ff4444' }); break }
        setCwd(target)
        break
      }

      case 'cat': {
        if (!args[0]) { push({ kind: 'output', text: 'cat: missing operand', color: '#ff4444' }); break }
        const target = resolvePath(cwd, args[0])
        const node = getNode(target)
        if (!node) { push({ kind: 'output', text: `cat: ${args[0]}: No such file or directory`, color: '#ff4444' }); break }
        if (node.type === 'dir') { push({ kind: 'output', text: `cat: ${args[0]}: Is a directory`, color: '#ff4444' }); break }
        node.content.split('\n').forEach(l => push({ kind: 'output', text: l }))
        break
      }

      case 'history':
        history.forEach((h, i) => push({ kind: 'output', text: `  ${String(i + 1).padStart(3)}  ${h}` }))
        break

      case 'neofetch': {
        const info = [
          'eren@os-website',
          '─────────────────────',
          'OS:      OS.WEBSITE LIZARD VERSION',
          'Host:    os-website.vercel.app',
          'Shell:   bash 5.2',
          'Stack:   Next.js 16 · TypeScript · Framer Motion',
          'Theme:   CYBERCORE',
          'Font:    Press Start 2P + VT323',
          'User:    Ibrahim Eren Kilisli',
        ]
        const maxLen = Math.max(NEOFETCH_ART.length, info.length)
        for (let i = 0; i < maxLen; i++) {
          const art = NEOFETCH_ART[i] ?? '                  '
          const inf = info[i] ?? ''
          push({ kind: 'output', text: art + '  ' + inf, color: i === 0 ? '#00fd00' : undefined })
        }
        break
      }

      case 'open': {
        const appMap: Record<string, WindowType> = {
          snake: 'snake', snowboard: 'snowboard', paint: 'paint',
          music: 'music', notepad: 'notepad', calc: 'calc',
          browser: 'browser', settings: 'settings', about: 'about', mail: 'mail',
        }
        const app = args[0]?.toLowerCase()
        if (!app) { push({ kind: 'output', text: 'open: specify an app name', color: '#ff4444' }); break }
        if (!appMap[app]) { push({ kind: 'output', text: `open: ${app}: unknown app`, color: '#ff4444' }); break }
        openWindow(appMap[app])
        setViewMode('desktop')
        push({ kind: 'output', text: `Opening ${app} on desktop...`, color: '#2a5a2a' })
        break
      }

      case 'exit':
      case 'quit':
        setViewMode('desktop')
        return

      default:
        push({ kind: 'output', text: `${cmd}: command not found. Type "help" for commands.`, color: '#ff4444' })
    }
    push({ kind: 'blank' })
  }, [cwd, history, openWindow, setViewMode])

  const submit = () => {
    const v = input.trim()
    runCommand(input)
    if (v) setHistory(h => [...h, v])
    setHistIdx(-1)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { submit(); return }
    if (e.key === 'Escape') { setViewMode('desktop'); return }
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
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      push({ kind: 'input', text: input + '^C', pwd: cwd }, { kind: 'blank' })
      setInput('')
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  // Escape key global listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewMode('desktop')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setViewMode])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99970,
        background: '#050805',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"SF Mono","Menlo","Monaco","Courier New",monospace',
        fontSize: 13,
        lineHeight: 1.6,
        color: '#00cc00',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Top bar */}
      <div style={{
        height: 28, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px',
        background: '#030503',
        borderBottom: '1px solid #001a00',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#00fd00', letterSpacing: '0.1em' }}>
            TERMINAL — FULL SCREEN
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#2a5a2a' }}>
            {cwd === '/home/eren' ? '~' : cwd}
          </span>
        </div>
        <button
          onClick={() => setViewMode('desktop')}
          style={{
            background: 'none', border: '1px solid #1a3a1a',
            color: '#2a5a2a', fontFamily: 'var(--font-h)', fontSize: 7,
            letterSpacing: '0.08em', padding: '3px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
          title="Exit terminal mode (Esc)"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>desktop_windows</span>
          EXIT
        </button>
      </div>

      {/* Output */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 16px 4px' }}>
        {/* Scanlines effect */}
        <div style={{
          position: 'absolute', inset: 28,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.06) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {lines.map((line, i) => {
          if (line.kind === 'blank') return <div key={i} style={{ height: 8 }} />
          if (line.kind === 'input') return (
            <div key={i} style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
              <span style={{ color: '#00fd00', userSelect: 'none' }}>
                {'eren@os-website:' + (line.pwd === '/home/eren' ? '~' : line.pwd) + '$ '}
              </span>
              <span style={{ color: '#99cc99' }}>{line.text}</span>
            </div>
          )
          return (
            <div key={i} style={{ color: line.color ?? '#88bb88', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {line.text}
            </div>
          )
        })}

        {/* Active prompt */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#00fd00', flexShrink: 0, userSelect: 'none' }}>
            {prompt + ' '}
          </span>
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
                color: '#99cc99', caretColor: '#00fd00', padding: 0,
              }}
            />
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  )
}
