'use client'
import { useEffect, useRef, useState } from 'react'
import styles from '../spaceoddity.module.css'

// Fades/slides its children into place the first time they scroll into
// view, then leaves them alone — a one-shot reveal, not a scroll-linked one.
export default function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealVisible : ''}`}>
      {children}
    </div>
  )
}
