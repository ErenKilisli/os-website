'use client'
import { useWindowStore } from '@/store/windowStore'
import { useEffect, useState } from 'react'

/* Tiny Windows logo for Start button (4 colored squares) */
function WinLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', flexShrink: 0 }}>
      <rect x="0" y="0" width="7" height="7" fill="#ff0000"/>
      <rect x="9" y="0" width="7" height="7" fill="#00cc00"/>
      <rect x="0" y="9" width="7" height="7" fill="#0000ff"/>
      <rect x="9" y="9" width="7" height="7" fill="#ffcc00"/>
    </svg>
  )
}

export function Taskbar() {
  const { windows, focusWindow, minimizeWindow, focusedId } = useWindowStore()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const h = String(n.getHours()).padStart(2, '0')
      const m = String(n.getMinutes()).padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div id="taskbar">
      <button id="start-btn">
        <WinLogo />
        <span>Start</span>
      </button>
      <div className="tb-sep" />
      <div id="tb-wins">
        {windows.map(win => (
          <div
            key={win.id}
            className={`tbw${win.id === focusedId && !win.isMinimized ? ' on' : ''}`}
            onClick={() => {
              if (win.isMinimized) focusWindow(win.id)
              else if (win.id === focusedId) minimizeWindow(win.id)
              else focusWindow(win.id)
            }}
          >
            <span>{win.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{win.title}</span>
          </div>
        ))}
      </div>
      <div id="tb-right">
        <div className="tb-dot" title="Online" />
        <div id="clock">{time}</div>
      </div>
    </div>
  )
}
