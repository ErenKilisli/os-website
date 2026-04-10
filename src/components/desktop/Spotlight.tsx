'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { spotlightApps } from '@/config/appRegistry'

interface Props {
  open: boolean
  onClose: () => void
}

// Material Symbol names are lowercase with underscores — everything else is emoji
const isMaterialIcon = (icon: string) => /^[a-z_]+$/.test(icon)

export function Spotlight({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const { openWindow, installedApps } = useWindowStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const allApps = spotlightApps(installedApps)
  const results = query.trim()
    ? allApps.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.spotlightDesc.toLowerCase().includes(query.toLowerCase())
      )
    : allApps

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  useEffect(() => { setSelected(0) }, [query])

  const launch = (type: import('@/config/appMeta').WindowType) => {
    openWindow(type)
    onClose()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter') { if (results[selected]) launch(results[selected].type) }
    else if (e.key === 'Escape') { onClose() }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 99990,
            }}
          />

          {/* Win95 Run-style dialog */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -8 }}
            transition={{ duration: 0.12, ease: [0, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(520px, 90vw)',
              zIndex: 99991,
              background: '#d4d0c8',
              border: '2px solid',
              borderTopColor: '#ffffff',
              borderLeftColor: '#ffffff',
              borderBottomColor: '#808080',
              borderRightColor: '#808080',
              boxShadow: '3px 3px 0 #000',
            }}
          >
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
              padding: '4px 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              userSelect: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>🦎</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#fff', fontWeight: 'bold' }}>
                  Run Program
                </span>
              </div>
              <button onClick={onClose} style={{
                width: 16, height: 14, background: '#d4d0c8',
                border: '2px solid', borderTopColor: '#fff', borderLeftColor: '#fff',
                borderBottomColor: '#808080', borderRightColor: '#808080',
                cursor: 'pointer', fontFamily: 'monospace', fontSize: 10,
                color: '#000', padding: 0, lineHeight: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: '10px 12px 12px' }}>
              {/* Search row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 6,
                  background: '#fff',
                  border: '2px solid',
                  borderTopColor: '#808080', borderLeftColor: '#808080',
                  borderBottomColor: '#fff', borderRightColor: '#fff',
                  padding: '3px 6px', height: 24,
                }}>
                  <span style={{ fontSize: 13, color: '#808080', flexShrink: 0 }}>🔍</span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a program name..."
                    spellCheck={false}
                    autoComplete="off"
                    style={{
                      flex: 1, background: 'none', border: 'none', outline: 'none',
                      fontFamily: 'monospace', fontSize: 12, color: '#000',
                    }}
                  />
                </div>
                <button onClick={onClose} style={{
                  fontFamily: 'monospace', fontSize: 11, padding: '3px 14px',
                  background: '#d4d0c8', cursor: 'pointer',
                  border: '2px solid', borderTopColor: '#fff', borderLeftColor: '#fff',
                  borderBottomColor: '#808080', borderRightColor: '#808080',
                }}>
                  Cancel
                </button>
              </div>

              {/* Results list */}
              <div style={{
                background: '#fff',
                border: '2px solid',
                borderTopColor: '#808080', borderLeftColor: '#808080',
                borderBottomColor: '#fff', borderRightColor: '#fff',
                maxHeight: 260, overflowY: 'auto',
              }}>
                {results.length === 0 ? (
                  <div style={{
                    padding: '16px', textAlign: 'center',
                    fontFamily: 'monospace', fontSize: 11, color: '#808080',
                  }}>
                    No programs found.
                  </div>
                ) : (
                  results.map((item, i) => (
                    <div
                      key={item.type}
                      onClick={() => launch(item.type)}
                      onMouseEnter={() => setSelected(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '5px 8px',
                        background: i === selected ? '#000080' : 'transparent',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e8e4e0',
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 24, height: 24, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isMaterialIcon(item.icon)
                          ? <span className="material-symbols-outlined" style={{ fontSize: 18, color: i === selected ? '#fff' : item.iconColor }}>
                              {item.icon}
                            </span>
                          : <span style={{ fontSize: 18 }}>{item.icon}</span>
                        }
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold',
                          color: i === selected ? '#fff' : '#000',
                          textTransform: 'uppercase',
                        }}>
                          {item.label}
                        </div>
                        <div style={{
                          fontFamily: 'monospace', fontSize: 10,
                          color: i === selected ? 'rgba(255,255,255,0.75)' : '#808080',
                        }}>
                          {item.spotlightDesc}
                        </div>
                      </div>
                      {i === selected && (
                        <span style={{
                          fontFamily: 'monospace', fontSize: 9,
                          color: 'rgba(255,255,255,0.6)', flexShrink: 0,
                        }}>↵</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 8, display: 'flex', gap: 12,
                fontFamily: 'monospace', fontSize: 9, color: '#808080',
              }}>
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>Esc Close</span>
                <span style={{ marginLeft: 'auto' }}>LIZARD.OS</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}