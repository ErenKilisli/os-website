'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINES = [
  { html: '<span class="hi">EREN.OS BIOS v2.4.1</span>' },
  { html: '<span class="dim">Copyright (C) 2026 Eren Kılışlı. All rights reserved.</span>' },
  { html: '' },
  { html: 'Initializing hardware scan...' },
  { html: 'CPU: Creative Mind 3.6GHz &nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'RAM: 26 Years Experience &nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'GPU: Visual Cortex RX280 &nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'HDD: /projects/eren/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: 'NET: Connection established &nbsp;&nbsp;<span class="ok">[OK]</span>' },
  { html: '' },
  { html: 'Starting EREN.OS kernel...' },
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
        setTimeout(addLine, lineIdx < 4 ? 120 : 110)
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
            }, 300)
          }
        }, 14)
      }
    }
    const t = setTimeout(addLine, 200)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="boot"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            padding: '40px 48px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            id="boot-out"
            style={{ fontFamily: 'var(--font-vt)', fontSize: 18, lineHeight: 1.9, color: '#aaa' }}
          >
            {lines.map((line, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />
            ))}
          </div>
          <div id="boot-progress" style={{ marginTop: 24 }}>
            <div
              id="boot-plbl"
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 8,
                color: '#4466aa',
                marginBottom: 8,
                letterSpacing: 1,
              }}
            >
              LOADING PORTFOLIO.EXE... {progress}%
            </div>
            <div
              id="boot-pbar"
              style={{
                width: 380,
                height: 18,
                background: '#0a0d1a',
                borderTop: '1px solid #000418',
                borderLeft: '1px solid #000418',
                borderBottom: '1px solid #2277ff',
                borderRight: '1px solid #2277ff',
                padding: 2,
              }}
            >
              <div
                id="boot-fill"
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'repeating-linear-gradient(90deg, #000 0, #000 10px, #222 10px, #222 12px)',
                  boxShadow: '0 0 10px #00ffff',
                  transition: 'width 0.05s linear',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
