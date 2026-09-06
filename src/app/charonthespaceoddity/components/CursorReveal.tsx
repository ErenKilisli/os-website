'use client'
import { useEffect, useState } from 'react'
import styles from '../spaceoddity.module.css'

// Hides the system cursor on load and reveals it on the visitor's first
// mouse move, so the page opens like a still frame rather than a normal
// document. Wraps the whole page rather than tracking a synthetic cursor.
export default function CursorReveal({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const reveal = () => setRevealed(true)
    window.addEventListener('mousemove', reveal, { once: true })
    return () => window.removeEventListener('mousemove', reveal)
  }, [])

  return (
    <div className={revealed ? undefined : styles.cursorHidden}>
      {children}
    </div>
  )
}
