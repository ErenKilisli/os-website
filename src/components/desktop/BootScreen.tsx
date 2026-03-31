'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINES = [
  { html: '<span class="hi">EREN.OS version 1.0</span>' },
  { html: '<span class="dim">Copyright (C) 2026 Eren Kılışlı. All rights reserved.</span>' },
  { html: '' },
  { html: 'Initializing hardware...' },
  { html: 'CPU: Creative Mind 3.6GHz &nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'RAM: 26 Years Experience &nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'GPU: Visual Cortex RX280 &nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'HDD: /projects/eren/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'NET: Connection established &nbsp;<span class="ok">[OK]</span>' },
  { html: '' },
  { html: 'Loading PORTFOLIO.EXE...' },
]

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let lineIdx = 0
    const addLine = () => {
      if (lineIdx < LINES.length) {
        const idx = lineIdx
        lineIdx++
        setLines(prev => [...prev, LINES[idx].html])
        setTimeout(addLine, lineIdx < 4 ? 130 : 100)
      } else {
        let p = 0
        const fill = setInterval(() => {
          p += 2
          setProgress(p)
          if (p >= 100) {
            clearInterval(fill)
            setTimeout(() => {
              setVisible(false)
              setTimeout(onComplete, 400)
            }, 400)
          }
        }, 16)
      }
    }
    const t = setTimeout(addLine, 300)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="boot"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            padding: '48px 56px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            id="boot-out"
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              lineHeight: 2,
              color: '#c0c0c0',
            }}
          >
            {lines.map((line, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />
            ))}
          </div>
          <div id="boot-progress" style={{ marginTop: 28 }}>
            <div
              id="boot-plbl"
              style={{
                fontFamily: 'var(--font-h)',
                fontSize: 8,
                color: '#808080',
                marginBottom: 8,
                letterSpacing: 1,
              }}
            >
              LOADING PORTFOLIO.EXE... {progress}%
            </div>
            {/* Win95-style progress bar */}
            <div
              id="boot-pbar"
              style={{
                width: 360,
                height: 22,
                background: '#000',
                border: '2px solid #808080',
                borderTopColor: '#404040',
                borderLeftColor: '#404040',
                borderBottomColor: '#c0c0c0',
                borderRightColor: '#c0c0c0',
                padding: 2,
                display: 'flex',
                gap: 2,
              }}
            >
              {Array.from({ length: Math.floor(progress / 4) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: '100%',
                    background: '#000080',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
