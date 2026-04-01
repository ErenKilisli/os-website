'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore, WindowType } from '@/store/windowStore'

interface SearchItem {
  label: string
  type: WindowType
  icon: string
  desc: string
}

const ITEMS: SearchItem[] = [
  { label: 'ABOUTME.DOC',      type: 'about',     icon: 'account_circle',   desc: 'Bio, skills & info'      },
  { label: 'CONTACT.MSG',      type: 'mail',      icon: 'mail',             desc: 'Send a message'          },
  { label: 'TERMINAL.EXE',     type: 'terminal',  icon: 'terminal',         desc: 'Command line interface'  },
  { label: 'SETTINGS.EXE',     type: 'settings',  icon: 'settings',         desc: 'System configuration'   },
  { label: 'DEV PROJECTS',     type: 'devfiles',  icon: 'folder_code',      desc: 'Software projects'       },
  { label: 'FILM PROJECTS',    type: 'film',      icon: 'movie',            desc: 'Film & video work'       },
  { label: 'GAME PROJECTS',    type: 'game',      icon: 'sports_esports',   desc: 'Game development work'   },
  { label: 'SNAKE.EXE',        type: 'snake',     icon: 'sports_esports',   desc: 'Classic snake game'      },
  { label: 'SNOWBOARD.EXE',    type: 'snowboard', icon: 'downhill_skiing',  desc: 'Endless downhill run'    },
  { label: 'PAINT.EXE',        type: 'paint',     icon: 'brush',            desc: 'MS Paint drawing app'    },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function Spotlight({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const { openWindow } = useWindowStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim()
    ? ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      )
    : ITEMS

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  const launch = (type: WindowType) => {
    openWindow(type)
    onClose()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[selected]) launch(results[selected].type)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="spotlight-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
          />
          <motion.div
            className="spotlight"
            initial={{ scale: 0.94, opacity: 0, y: -16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: -16 }}
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
          >
            {/* Search input */}
            <div className="spotlight-input-row">
              <span className="material-symbols-outlined spotlight-search-ico">search</span>
              <input
                ref={inputRef}
                className="spotlight-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="SEARCH EREN.OS..."
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="spotlight-esc">ESC</kbd>
            </div>

            {/* Results */}
            <div className="spotlight-results">
              {results.length === 0 ? (
                <div className="spotlight-empty">NO RESULTS</div>
              ) : (
                results.map((item, i) => (
                  <div
                    key={item.type}
                    className={`spotlight-item${i === selected ? ' selected' : ''}`}
                    onClick={() => launch(item.type)}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <span className="material-symbols-outlined spotlight-item-ico">{item.icon}</span>
                    <div className="spotlight-item-text">
                      <span className="spotlight-item-label">{item.label}</span>
                      <span className="spotlight-item-desc">{item.desc}</span>
                    </div>
                    {i === selected && <span className="spotlight-enter">↵ OPEN</span>}
                  </div>
                ))
              )}
            </div>

            <div className="spotlight-footer">
              <span>↑↓ NAVIGATE</span>
              <span>↵ OPEN</span>
              <span>ESC CLOSE</span>
              <span style={{ marginLeft: 'auto' }}>EREN.OS SEARCH</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
