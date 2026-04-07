'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { spotlightApps } from '@/config/appRegistry'

interface Props {
  open: boolean
  onClose: () => void
}

const SPOTLIGHT_APPS = spotlightApps()

export function Spotlight({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const { openWindow } = useWindowStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim()
    ? SPOTLIGHT_APPS.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.spotlightDesc.toLowerCase().includes(query.toLowerCase())
      )
    : SPOTLIGHT_APPS

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

  const launch = (type: import('@/config/appMeta').WindowType) => {
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
                placeholder="SEARCH OS.WEBSITE..."
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
                      <span className="spotlight-item-label">{item.title}</span>
                      <span className="spotlight-item-desc">{item.spotlightDesc}</span>
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
              <span style={{ marginLeft: 'auto' }}>OS.WEBSITE SEARCH</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
