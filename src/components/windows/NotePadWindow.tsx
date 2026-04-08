'use client'
import { useState, useEffect } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

const STORAGE_KEY = 'lizard-os-notepad'

export function NotePadWindow({ win, isMobile = false }: Props) {
  const [text, setText]       = useState('')
  const [saved, setSaved]     = useState(true)
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) { setText(stored); setWordCount(stored.trim() ? stored.trim().split(/\s+/).length : 0) }
  }, [])

  const handleChange = (val: string) => {
    setText(val)
    setSaved(false)
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0)
  }

  const save = () => {
    localStorage.setItem(STORAGE_KEY, text)
    setSaved(true)
  }

  const clear = () => {
    if (confirm('Clear all text?')) { setText(''); setSaved(true); localStorage.removeItem(STORAGE_KEY) }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  return (
    <Window
      win={win}
      menu={['File', 'Edit', 'Format', 'Help']}
      status={`${saved ? '' : '● '}UNTITLED.TXT  |  ${wordCount} words  |  ${text.length} chars`}
      isMobile={isMobile}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', gap: 4, padding: '4px 8px',
          background: 'var(--surface-dim)', borderBottom: '1px solid #0a1628',
        }}>
          {[
            { label: 'SAVE', action: save, accent: !saved },
            { label: 'CLEAR', action: clear, accent: false },
          ].map(({ label, action, accent }) => (
            <button
              key={label}
              onClick={action}
              style={{
                fontFamily: 'var(--font-h)', fontSize: 8, padding: '3px 10px',
                background: accent ? '#00ffff' : 'var(--surface-dim)',
                color: accent ? '#000' : 'var(--on-surface)',
                border: '1px solid', cursor: 'pointer',
                borderTopColor: '#ffffff', borderLeftColor: '#ffffff',
                borderBottomColor: '#808080', borderRightColor: '#808080',
                letterSpacing: '0.08em',
              }}
            >
              {label}
            </button>
          ))}
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080', marginLeft: 4, alignSelf: 'center' }}>
            Ctrl+S to save
          </span>
        </div>

        {/* Text area */}
        <textarea
          value={text}
          onChange={e => handleChange(e.target.value)}
          spellCheck={false}
          placeholder="Start typing..."
          style={{
            flex: 1, width: '100%', resize: 'none', border: 'none', outline: 'none',
            background: '#000810', color: '#c8d8e8',
            fontFamily: 'var(--font-b)', fontSize: 16, lineHeight: 1.7,
            padding: '12px 16px', boxSizing: 'border-box',
            caretColor: '#00ffff',
          }}
        />
      </div>
    </Window>
  )
}
