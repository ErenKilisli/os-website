'use client'
import { motion, useMotionValue } from 'framer-motion'
import { useWindowStore, IconState } from '@/store/windowStore'
import { useRef } from 'react'

export function DesktopIcon({ icon }: { icon: IconState }) {
  const { openWindow, updateIconPos } = useWindowStore()
  const x = useMotionValue(icon.x)
  const y = useMotionValue(icon.y)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCount = useRef(0)

  const handleClick = () => {
    clickCount.current += 1
    if (clickCount.current === 2) {
      if (clickTimer.current) clearTimeout(clickTimer.current)
      clickCount.current = 0
      openWindow(icon.windowType)
      return
    }
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 300)
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, position: 'absolute', zIndex: 10, touchAction: 'none' }}
      onDragEnd={() => updateIconPos(icon.id, x.get(), y.get())}
      onClick={handleClick}
      className="dic"
      whileDrag={{ zIndex: 9990, scale: 1.05 }}
    >
      <div className="dic-frame">{icon.emoji}</div>
      <div className="dic-lbl">{icon.label}</div>
    </motion.div>
  )
}
