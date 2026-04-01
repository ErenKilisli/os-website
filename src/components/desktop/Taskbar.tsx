'use client'
import { useWindowStore } from '@/store/windowStore'
import { useEffect, useState } from 'react'
import { SystemTray } from './SystemTray'

interface Props {
  onSpotlight: () => void
}

export function Taskbar({ onSpotlight }: Props) {
  const { windows, focusWindow, minimizeWindow, focusedId, openWindow } = useWindowStore()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const h = n.getHours()
      const m = String(n.getMinutes()).padStart(2, '0')
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      setTime(`${String(h12).padStart(2, '0')}:${m} ${ampm}`)
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div id="taskbar">
      <button id="start-btn" onClick={() => openWindow('devfiles')}>
        <span className="material-symbols-filled" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
        START
      </button>

      {/* Spotlight button */}
      <button className="tb-search-btn" onClick={onSpotlight} title="Search (Ctrl+K)">
        <span className="material-symbols-outlined">search</span>
        <span>SEARCH</span>
      </button>

      <div className="tb-sep" />

      <div id="tb-wins">
        {windows.map((win) => (
          <div
            key={win.id}
            className={`tbw${win.id === focusedId && !win.isMinimized ? ' on' : ''}`}
            onClick={() => {
              if (win.isMinimized) focusWindow(win.id)
              else if (win.id === focusedId) minimizeWindow(win.id)
              else focusWindow(win.id)
            }}
          >
            <span className="material-symbols-outlined">{win.icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{win.title}</span>
          </div>
        ))}
      </div>

      {/* Right side: SystemTray + clock */}
      <div id="tb-right">
        <SystemTray />
        <div className="tb-right-divider" />
        <span className="material-symbols-outlined">schedule</span>
        <div id="clock">{time}</div>
      </div>
    </div>
  )
}
