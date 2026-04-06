'use client'
import { motion, useMotionValue } from 'framer-motion'
import { useWindowStore, IconState } from '@/store/windowStore'
import { useRef } from 'react'
import { FolderFilmIcon, FolderGameIcon, FolderEmptyIcon, SnowboarderPixelIcon } from './FolderIcons'

/* ── Rainbow Paint Brush icon ─────────────────────────────── */
function PaintRainbowIcon() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <defs>
        <linearGradient id="brush-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff0040" />
          <stop offset="16%"  stopColor="#ff6600" />
          <stop offset="33%"  stopColor="#ffee00" />
          <stop offset="50%"  stopColor="#00dd44" />
          <stop offset="66%"  stopColor="#00aaff" />
          <stop offset="83%"  stopColor="#7744ff" />
          <stop offset="100%" stopColor="#ff00cc" />
        </linearGradient>
        <linearGradient id="handle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8a060" />
          <stop offset="100%" stopColor="#8b6020" />
        </linearGradient>
      </defs>
      {/* Brush handle */}
      <rect x="10" y="30" width="6"  height="14" rx="2" fill="url(#handle-grad)" />
      <rect x="11" y="30" width="2"  height="14" fill="rgba(255,255,255,0.3)" />
      {/* Ferrule (metal band) */}
      <rect x="9"  y="26" width="8"  height="5"  fill="#c0c0c0" />
      <rect x="9"  y="26" width="8"  height="1"  fill="#e8e8e8" />
      <rect x="9"  y="30" width="8"  height="1"  fill="#909090" />
      {/* Bristles — rainbow gradient */}
      <ellipse cx="13" cy="20" rx="7" ry="8" fill="url(#brush-rainbow)" />
      <ellipse cx="13" cy="14" rx="5" ry="5" fill="url(#brush-rainbow)" opacity="0.9" />
      {/* Brush tip */}
      <ellipse cx="13" cy="10" rx="3" ry="4" fill="url(#brush-rainbow)" opacity="0.8" />
      <ellipse cx="13" cy="7"  rx="1.5" ry="3" fill="#ff00cc" opacity="0.7" />
      {/* Paint dabs on canvas */}
      <circle cx="30" cy="10" r="4" fill="#ff0040" opacity="0.9" />
      <circle cx="38" cy="16" r="3" fill="#ff6600" opacity="0.85" />
      <circle cx="34" cy="26" r="4" fill="#00dd44" opacity="0.9" />
      <circle cx="40" cy="34" r="3" fill="#00aaff" opacity="0.85" />
      <circle cx="28" cy="36" r="3.5" fill="#7744ff" opacity="0.9" />
      <circle cx="36" cy="42" r="2.5" fill="#ff00cc" opacity="0.85" />
      <circle cx="26" cy="24" r="2.5" fill="#ffee00" opacity="0.85" />
    </svg>
  )
}

function IconGraphic({ icon }: { icon: IconState }) {
  if (icon.windowType === 'cinema')   return <FolderFilmIcon color={icon.iconColor} size={48} />
  if (icon.windowType === 'arcade')   return <FolderGameIcon color={icon.iconColor} size={48} />
  if (icon.windowType === 'snowboard') return (
    <div style={{
      width: 52, height: 52,
      background: 'linear-gradient(145deg,#0a5020,#1a8040)',
      borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 10px rgba(26,128,64,0.4)',
    }}>
      <SnowboarderPixelIcon size={38} />
    </div>
  )
  if (icon.windowType === 'paint') return <PaintRainbowIcon />
  if (icon.id === 'ico-devfiles2' || icon.id === 'ico-devfiles3') return <FolderEmptyIcon color={icon.iconColor} size={48} />
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
  const { openWindow, updateIconPos, selectedIconId, selectIcon } = useWindowStore()
  const x = useMotionValue(icon.x)
  const y = useMotionValue(icon.y)
  const dragging = useRef(false)

  const selected = selectedIconId === icon.id

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, position: 'absolute', zIndex: 10, touchAction: 'none' }}
      onDragStart={() => { dragging.current = true }}
      onDragEnd={() => { updateIconPos(icon.id, x.get(), y.get()); setTimeout(() => { dragging.current = false }, 50) }}
      onClick={(e) => {
        e.stopPropagation()
        if (dragging.current) return
        selectIcon(icon.id)
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        if (dragging.current) return
        openWindow(icon.windowType)
      }}
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
