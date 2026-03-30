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

export function Desktop() {
  const [booted, setBooted] = useState(false)
  const { windows, icons } = useWindowStore()

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      <div id="desktop">
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
