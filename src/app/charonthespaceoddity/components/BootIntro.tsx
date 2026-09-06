'use client'

import { useEffect, useState } from 'react'
import styles from '../spaceoddity.module.css'

const SESSION_KEY = 'spaceoddity-boot-seen'
const AUTO_DISMISS_MS = 2000
const FADE_MS = 400

const BOOT_TEXT = `SIGNAL ACQUIRED
HSTR-155 // STANDBY
LOADING...`

// Renders nothing until an effect confirms this is a first visit this
// session — so crawlers and no-JS users never see it, and it is always
// an overlay on top of the already-mounted page, never a gate.
export default function BootIntro() {
  const [visible, setVisible] = useState(false)
  const [dismissing, setDismissing] = useState(false)

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reads a browser-only API (sessionStorage) once on mount
        setVisible(true)
      }
    } catch {
      // sessionStorage unavailable (private mode, etc.) — skip the intro.
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    const dismiss = () => {
      setDismissing(true)
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // ignore
      }
      window.setTimeout(() => setVisible(false), FADE_MS)
    }

    const timer = window.setTimeout(dismiss, AUTO_DISMISS_MS)
    window.addEventListener('keydown', dismiss)
    window.addEventListener('click', dismiss)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', dismiss)
      window.removeEventListener('click', dismiss)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`${styles.bootIntro} ${dismissing ? styles.bootIntroOut : ''}`}
      role="presentation"
    >
      <pre className={styles.bootReadout}>{BOOT_TEXT}</pre>
    </div>
  )
}
