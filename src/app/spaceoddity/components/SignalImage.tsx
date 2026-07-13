'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from '../spaceoddity.module.css'

const BAND_COUNT = 10
// Scattered, not top-to-bottom.
const REVEAL_ORDER = [0, 5, 2, 7, 1, 8, 4, 9, 3, 6]
const BAND_STAGGER_MS = 130
const BAND_DURATION_MS = 300
const FLASH_TO_REVEAL_MS = 150

type Phase = 'armed' | 'flash' | 'reveal' | 'done'

interface SignalImageProps {
  src: string
  alt: string
  caption?: string
}

export default function SignalImage({ src, alt, caption }: SignalImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showEffect, setShowEffect] = useState(false)
  const [phase, setPhase] = useState<Phase>('armed')

  // useLayoutEffect (not useEffect): arms the covering bands before the
  // browser paints, so JS users never see a flash of the bare image
  // before the reveal mechanic takes over.
  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reducedMotion) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads a browser-only API (matchMedia) once on mount
    setShowEffect(true)

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPhase('flash')
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (phase !== 'flash') return
    const t = setTimeout(() => setPhase('reveal'), FLASH_TO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'reveal') return
    const totalMs =
      (BAND_COUNT - 1) * BAND_STAGGER_MS + BAND_DURATION_MS + 100
    const t = setTimeout(() => setPhase('done'), totalMs)
    return () => clearTimeout(t)
  }, [phase])

  const effectActive = showEffect && phase !== 'done'

  return (
    <figure className={styles.signalFigure}>
      <div ref={containerRef} className={styles.signalContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={styles.signalImg} loading="lazy" />

        {effectActive && (
          <>
            <div
              className={styles.signalFlash}
              aria-hidden="true"
              data-on={phase === 'flash' ? 'true' : undefined}
              data-fade={phase === 'reveal' ? 'true' : undefined}
            />
            {Array.from({ length: BAND_COUNT }).map((_, i) => (
              <div
                key={i}
                className={styles.signalBand}
                aria-hidden="true"
                data-fade={phase === 'reveal' ? 'true' : undefined}
                style={{
                  top: `${(i / BAND_COUNT) * 100}%`,
                  height: `${100 / BAND_COUNT}%`,
                  transitionDelay:
                    phase === 'reveal'
                      ? `${REVEAL_ORDER.indexOf(i) * BAND_STAGGER_MS}ms`
                      : '0ms',
                }}
              />
            ))}
          </>
        )}
      </div>
      {caption && <figcaption className={styles.signalCaption}>{caption}</figcaption>}
    </figure>
  )
}
