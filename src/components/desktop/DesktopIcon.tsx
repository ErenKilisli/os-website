'use client'
import { motion, useMotionValue } from 'framer-motion'
import { useWindowStore, IconState } from '@/store/windowStore'
import { useRef, useState } from 'react'
import { FolderFilmIcon, FolderGameIcon, FolderEmptyIcon } from './FolderIcons'

function IconGraphic({ icon }: { icon: IconState }) {
  if (icon.windowType === 'cinema') {
    return <FolderFilmIcon color={icon.iconColor} size={48} />
  }
  if (icon.windowType === 'arcade') {
    return <FolderGameIcon color={icon.iconColor} size={48} />
  }
  if (icon.id === 'ico-devfiles2' || icon.id === 'ico-devfiles3') {
    return <FolderEmptyIcon color={icon.iconColor} size={48} />
  }
  return (
    <span
      className="material-symbols-filled"
      style={{ color: icon.iconColor, fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
    >
      {icon.iconName}
    </span>
  )
}

export function DesktopIcon({ icon }: { icon: IconState }) {
  const { openWindow, updateIconPos } = useWindowStore()
  const x = useMotionValue(icon.x)
  const y = useMotionValue(icon.y)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCount = useRef(0)
  const [selected, setSelected] = useState(false)

  const handleClick = () => {
    setSelected(true)
    clickCount.current += 1
    if (clickCount.current === 2) {
      if (clickTimer.current) clearTimeout(clickTimer.current)
      clickCount.current = 0
      openWindow(icon.windowType)
      return
    }
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 400)
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, position: 'absolute', zIndex: 10, touchAction: 'none' }}
      onDragEnd={() => updateIconPos(icon.id, x.get(), y.get())}
      onClick={handleClick}
      onBlur={() => setSelected(false)}
      className={`dic${selected ? ' selected' : ''}`}
      whileDrag={{ zIndex: 9990, scale: 1.05 }}
    >
      <div className="dic-frame">
        <IconGraphic icon={icon} />
      </div>
      <div className="dic-lbl">
        {icon.label.split('\n').map((line, i) => (
          <span key={i} style={{ display: 'block', opacity: i === 1 ? 0.75 : 1 }}>{line}</span>
        ))}
      </div>
    </motion.div>
  )
}
