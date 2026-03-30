'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/windowStore'
import { DesktopIcon } from './DesktopIcon'
import { Taskbar } from './Taskbar'
import { BootScreen } from './BootScreen'
import { FileBrowserWindow } from '../windows/FileBrowserWindow'
import { AboutWindow } from '../windows/AboutWindow'
import { MailWindow } from '../windows/MailWindow'

/* Win95-style pixel cursor arrow - SVG as inline data URI */
const CURSOR_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='20' viewBox='0 0 14 20'>
  <polygon points='0,0 0,16 4,12 7,19 9,18 6,11 11,11' fill='white' stroke='black' stroke-width='1'/>
</svg>`

const CURSOR_POSITIONS = [
  { top: '6%',  left: '62%',  rotate: -10, scale: 1.0 },
  { top: '5%',  left: '67%',  rotate: -5,  scale: 0.9 },
  { top: '4%',  left: '72%',  rotate: 0,   scale: 1.1 },
  { top: '6%',  left: '77%',  rotate: 5,   scale: 0.85 },
  { top: '3%',  left: '82%',  rotate: 10,  scale: 1.0 },
  { top: '9%',  left: '65%',  rotate: -8,  scale: 0.9 },
  { top: '10%', left: '70%',  rotate: 2,   scale: 1.05 },
  { top: '8%',  left: '75%',  rotate: -2,  scale: 0.95 },
  { top: '11%', left: '80%',  rotate: 8,   scale: 1.0 },
  { top: '7%',  left: '85%',  rotate: 12,  scale: 0.9 },
  { top: '14%', left: '68%',  rotate: -5,  scale: 0.8 },
  { top: '13%', left: '74%',  rotate: 4,   scale: 1.0 },
  { top: '15%', left: '79%',  rotate: -12, scale: 0.9 },
  { top: '12%', left: '84%',  rotate: 6,   scale: 1.1 },
  { top: '16%', left: '88%',  rotate: -3,  scale: 0.85 },
  // Left cluster
  { top: '5%',  left: '5%',   rotate: 18,  scale: 1.0 },
  { top: '4%',  left: '10%',  rotate: 22,  scale: 0.9 },
  { top: '7%',  left: '3%',   rotate: 15,  scale: 1.1 },
  { top: '9%',  left: '8%',   rotate: 20,  scale: 0.85 },
  { top: '12%', left: '5%',   rotate: 25,  scale: 1.0 },
  { top: '6%',  left: '14%',  rotate: 10,  scale: 0.9 },
  { top: '14%', left: '2%',   rotate: 30,  scale: 1.05 },
  { top: '11%', left: '12%',  rotate: 18,  scale: 0.95 },
]

export function Desktop() {
  const [booted, setBooted] = useState(false)
  const { windows, icons } = useWindowStore()

  const cursorDataUrl = `data:image/svg+xml,${encodeURIComponent(CURSOR_SVG)}`

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      <div id="desktop">
        {/* Scattered pixel cursors */}
        {CURSOR_POSITIONS.map((pos, i) => (
          <img
            key={i}
            src={cursorDataUrl}
            alt=""
            className="cursor-scatter"
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
              width: `${Math.round(14 * pos.scale)}px`,
              height: `${Math.round(20 * pos.scale)}px`,
            }}
          />
        ))}

        {/* Background text */}
        <div id="desktop-bg-text">
          <span className="bg-line1">ENGINEER + FILMMAKER</span>
          <span className="bg-line2">SYSTEM</span>
        </div>

        {icons.map(icon => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}
        <AnimatePresence>
          {windows.map(win => {
            if (win.type === 'about') return <AboutWindow key={win.id} win={win} />
            if (win.type === 'mail')  return <MailWindow  key={win.id} win={win} />
            return <FileBrowserWindow key={win.id} win={win} category={win.type} />
          })}
        </AnimatePresence>
      </div>
      <Taskbar />
    </>
  )
}
