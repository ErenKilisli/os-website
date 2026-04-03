'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState, useWindowStore } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

// ── Fake filesystem ──────────────────────────────────────────────────
type FSNode = { type: 'file'; content: string } | { type: 'dir'; children: Record<string, FSNode> }

const FS: Record<string, FSNode> = {
  home: {
    type: 'dir', children: {
      eren: {
        type: 'dir', children: {
          'about.txt':    { type: 'file', content: 'Ibrahim Eren Kilisli\nSoftware Engineer & Filmmaker\nBuilding at the intersection of code and film.' },
          'README.md':   { type: 'file', content: '# OS.WEBSITE LIZARD VERSION\nA personal portfolio presented as a fictional OS.\nStack: Next.js · TypeScript · Framer Motion · Zustand' },
          '.bashrc':     { type: 'file', content: 'export PS1="eren@os-website:~$ "\nalias cls="clear"\nalias ls="ls --color"' },
          projects: {
            type: 'dir', children: {
              dev:  { type: 'dir', children: {
                'os-website':   { type: 'dir', children: { 'index.tsx': { type: 'file', content: '// OS.WEBSITE source\nexport default function Page() { return <Desktop /> }' } } },
              }},
              film: { type: 'dir', children: {
                'showreel.mp4': { type: 'file', content: '[binary video file]' },
              }},
              games: { type: 'dir', children: {
                'snake.ts':     { type: 'file', content: '// Snake game implementation' },
                'snowboard.ts': { type: 'file', content: '// Snowboard physics engine' },
              }},
            }
          },
        }
      }
    }
  },
  usr: { type: 'dir', children: { bin: { type: 'dir', children: {} } } },
  etc: { type: 'dir', children: {
    'os-release': { type: 'file', content: 'NAME="OS.WEBSITE"\nVERSION="LIZARD VERSION"\nBUILD="2026"' },
  }},
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

// ── NEOFETCH art ────────────────────────────────────────────────────
const NEOFETCH = [
  '        .\'-.        ',
  '      .\'     \'.     ',
  '    .\'  .---.  \'.   ',
  '   /  /       \\  \\  ',
  '  |  |  ( )    |  | ',
  '   \\  \\   ___  / /  ',
  '    \'.  \`-----\'  .\'  ',
  '      \'-._____.-\'   ',
]

// ── Output line types ───────────────────────────────────────────────
type Line =
  | { kind: 'input';  text: string; pwd: string }
  | { kind: 'output'; text: string; color?: string }
  | { kind: 'blank' }

export function TerminalWindow({ win, isMobile = false }: Props) {
  const openWindow = useWindowStore(s => s.openWindow)

  const [lines, setLines] = useState<Line[]>([
    { kind: 'output', text: 'OS.WEBSITE LIZARD VERSION — Terminal', color: '#00ffff' },
    { kind: 'output', text: 'Type "help" for available commands.', color: '#6a8a6a' },
    { kind: 'blank' },
  ])
  const [input, setInput]   = useState('')
  const [cwd, setCwd]       = useState('/home/eren')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef  = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const prompt = `eren@os-website:${cwd === '/home/eren' ? '~' : cwd}$`

  const push = (...newLines: Line[]) => setLines(l => [...l, ...newLines])

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim()
    const [cmd, ...args] = trimmed.split(/\s+/)

    push({ kind: 'input', text: trimmed, pwd: cwd })

    if (!trimmed) return

    switch (cmd) {

      case 'help':
        push(
          { kind: 'output', text: 'Available commands:', color: '#00ffff' },
          { kind: 'output', text: '  ls [path]      — list directory contents' },
          { kind: 'output', text: '  cd <path>      — change directory' },
          { kind: 'output', text: '  pwd            — print working directory' },
          { kind: 'output', text: '  cat <file>     — print file contents' },
          { kind: 'output', text: '  echo <text>    — print text' },
          { kind: 'output', text: '  clear           — clear terminal' },
          { kind: 'output', text: '  whoami         — current user' },
          { kind: 'output', text: '  date           — current date/time' },
          { kind: 'output', text: '  uname          — OS info' },
          { kind: 'output', text: '  neofetch       — system info' },
          { kind: 'output', text: '  open <app>     — open an app window' },
          { kind: 'output', text: '  history        — command history' },
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
        setLines([])
        return

      case 'ls': {
        const target = args[0] ? resolvePath(cwd, args[0]) : cwd
        const node = getNode(target)
        if (!node) { push({ kind: 'output', text: `ls: ${args[0]}: No such file or directory`, color: '#ff6060' }); break }
        if (node.type === 'file') { push({ kind: 'output', text: args[0] ?? target }); break }
        const entries = Object.entries(node.children)
        if (!entries.length) break
        const dirs  = entries.filter(([,v]) => v.type === 'dir').map(([k]) => k + '/')
        const files = entries.filter(([,v]) => v.type === 'file').map(([k]) => k)
        if (dirs.length)  push({ kind: 'output', text: dirs.join('  '), color: '#6ab0ff' })
        if (files.length) push({ kind: 'output', text: files.join('  ') })
        break
      }

      case 'cd': {
        const target = args[0] ? resolvePath(cwd, args[0]) : '/home/eren'
        const node = getNode(target)
        if (!node) { push({ kind: 'output', text: `cd: ${args[0]}: No such file or directory`, color: '#ff6060' }); break }
        if (node.type === 'file') { push({ kind: 'output', text: `cd: ${args[0]}: Not a directory`, color: '#ff6060' }); break }
        setCwd(target)
        break
      }

      case 'cat': {
        if (!args[0]) { push({ kind: 'output', text: 'cat: missing operand', color: '#ff6060' }); break }
        const target = resolvePath(cwd, args[0])
        const node = getNode(target)
        if (!node) { push({ kind: 'output', text: `cat: ${args[0]}: No such file or directory`, color: '#ff6060' }); break }
        if (node.type === 'dir') { push({ kind: 'output', text: `cat: ${args[0]}: Is a directory`, color: '#ff6060' }); break }
        node.content.split('\n').forEach(l => push({ kind: 'output', text: l }))
        break
      }

      case 'history':
        history.forEach((h, i) => push({ kind: 'output', text: `  ${String(i + 1).padStart(3)}  ${h}` }))
        break

      case 'neofetch': {
        const info = [
          `\x1b[1meren\x1b[0m@\x1b[1mos-website\x1b[0m`,
          '─────────────────────',
          `OS:      OS.WEBSITE LIZARD VERSION`,
          `Host:    os-website.vercel.app`,
          `Shell:   bash 5.2`,
          `Stack:   Next.js 16 · TypeScript · Framer Motion`,
          `Theme:   CYBERCORE`,
          `Font:    Press Start 2P + VT323`,
          `User:    Ibrahim Eren Kilisli`,
        ]
        const maxLen = Math.max(NEOFETCH.length, info.length)
        for (let i = 0; i < maxLen; i++) {
          const art  = NEOFETCH[i] ?? '                    '
          const inf  = info[i] ?? ''
          push({ kind: 'output', text: art + '  ' + inf, color: i === 0 ? '#00ffff' : undefined })
        }
        break
      }

      case 'open': {
        const appMap: Record<string, Parameters<typeof openWindow>[0]> = {
          snake: 'snake', snowboard: 'snowboard', paint: 'paint',
          music: 'music', notepad: 'notepad', calc: 'calc',
          browser: 'browser', settings: 'settings', about: 'about', mail: 'mail',
        }
        const app = args[0]?.toLowerCase()
        if (!app) { push({ kind: 'output', text: 'open: specify an app name', color: '#ff6060' }); break }
        if (!appMap[app]) { push({ kind: 'output', text: `open: ${app}: unknown application`, color: '#ff6060' }); break }
        openWindow(appMap[app])
        push({ kind: 'output', text: `Opening ${app}...`, color: '#6a8a6a' })
        break
      }

      default:
        push({ kind: 'output', text: `${cmd}: command not found. Type "help" for commands.`, color: '#ff6060' })
    }

    push({ kind: 'blank' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cwd, history, openWindow])

  const submit = () => {
    const val = input.trim()
    runCommand(input)
    if (val) setHistory(h => [...h, val])
    setHistIdx(-1)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { submit(); return }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(idx)
      setInput(history[idx] ?? '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const idx = histIdx + 1
      if (idx >= history.length) { setHistIdx(-1); setInput(''); return }
      setHistIdx(idx)
      setInput(history[idx])
    }
    if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      push({ kind: 'input', text: input + '^C', pwd: cwd }, { kind: 'blank' })
      setInput('')
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <Window
      win={win}
      menu={['Shell', 'Edit', 'View', 'Window', 'Help']}
      status={`Terminal — ${cwd}`}
      isMobile={isMobile}
    >
      <div
        style={{
          height: '100%', background: '#1a1b1e', display: 'flex', flexDirection: 'column',
          fontFamily: '"SF Mono", "Menlo", "Monaco", "Courier New", monospace',
          fontSize: 13, lineHeight: 1.6, color: '#d4d4d4',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Output area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px 4px' }}>
          {lines.map((line, i) => {
            if (line.kind === 'blank') return <div key={i} style={{ height: 8 }} />
            if (line.kind === 'input') return (
              <div key={i} style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
                <span style={{ color: '#5af78e', userSelect: 'none' }}>
                  {'eren@os-website:' + (line.pwd === '/home/eren' ? '~' : line.pwd) + '$ '}
                </span>
                <span style={{ color: '#d4d4d4' }}>{line.text}</span>
              </div>
            )
            return (
              <div key={i} style={{ color: line.color ?? '#d4d4d4', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {line.text}
              </div>
            )
          })}

          {/* Active prompt line */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#5af78e', flexShrink: 0, userSelect: 'none' }}>
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
                  color: '#d4d4d4', caretColor: '#d4d4d4', padding: 0,
                }}
              />
            </div>
          </div>

          <div ref={bottomRef} />
        </div>
      </div>
    </Window>
  )
}
