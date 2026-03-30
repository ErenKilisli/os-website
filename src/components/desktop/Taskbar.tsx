'use client'
import { useWindowStore } from '@/store/windowStore'
import { useEffect, useState } from 'react'

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
        <span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Start</span>
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
        <div className="tb-dot" />
        <div id="clock">{time}</div>
      </div>
    </div>
  )
}
