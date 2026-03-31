'use client'
import { useEffect, useRef, useState } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

const LINES = [
  { type: 'prompt', text: 'C:\\EREN> whoami' },
  { type: 'output', text: 'eren.kilisli // software engineer // filmmaker' },
  { type: 'blank',  text: '' },
  { type: 'prompt', text: 'C:\\EREN> dir /projects' },
  { type: 'output', text: 'GAME.PRJ    <DIR>    2024-03-30' },
  { type: 'output', text: 'FILM.PRJ    <DIR>    2024-03-30' },
  { type: 'output', text: 'SWR.PRJ     <DIR>    2025-01-15' },
  { type: 'blank',  text: '' },
  { type: 'prompt', text: 'C:\\EREN> echo "building at the intersection of code and film"' },
  { type: 'output', text: '"building at the intersection of code and film"' },
  { type: 'blank',  text: '' },
  { type: 'prompt', text: 'C:\\EREN> _' },
]

interface Props {
  win: WindowState
  isMobile?: boolean
}

export function TerminalWindow({ win, isMobile = false }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(0)
    let i = 0
    const delays = LINES.map((_, idx) => idx * 180)

    const timers = delays.map((delay, idx) =>
      setTimeout(() => {
        setVisibleCount(idx + 1)
      }, delay)
    )

    return () => {
      timers.forEach(t => clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.id])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [visibleCount])

  const isLastLine = visibleCount >= LINES.length

  return (
    <Window
      win={win}
      menu={['File', 'Edit', 'View']}
      status="TERMINAL.EXE | Ready"
      isMobile={isMobile}
      bodyClass="terminal-body"
    >
      <div ref={bodyRef} className="terminal-body">
        {LINES.slice(0, visibleCount).map((line, i) => {
          const isLastPromptLine = i === LINES.length - 1 && isLastLine
          if (line.type === 'blank') {
            return <div key={i} className="term-line">&nbsp;</div>
          }
          if (line.type === 'prompt') {
            if (isLastPromptLine) {
              return (
                <div key={i} className="term-line term-prompt">
                  {'C:\\EREN> '}
                  <span className="term-cursor" />
                </div>
              )
            }
            return (
              <div key={i} className="term-line term-prompt">{line.text}</div>
            )
          }
          return (
            <div key={i} className="term-line term-output">{line.text}</div>
          )
        })}
        {!isLastLine && visibleCount > 0 && (
          <span className="term-cursor" />
        )}
      </div>
    </Window>
  )
}
