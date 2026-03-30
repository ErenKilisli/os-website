'use client'
import { WindowType } from '@/store/windowStore'

/* ── Win95 Classic Pixel Art Icons ─────────────────────────
   All SVGs drawn on pixel grid, imageRendering: pixelated
────────────────────────────────────────────────────────── */

const S = { imageRendering: 'pixelated' as const }

// ── Classic Win95 Folder (cream/tan color) ───────────────
function FolderBase({ badge }: { badge?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 40 34" width="80" height="68" style={S}>
      {/* Tab (top-left flap) */}
      <rect x="0" y="0" width="14" height="5" fill="#d4a843"/>
      <rect x="0" y="0" width="14" height="1" fill="#ffe07a"/>
      <rect x="0" y="0" width="1"  height="5" fill="#ffe07a"/>
      <rect x="13" y="0" width="1" height="5" fill="#9a7220"/>
      <rect x="0" y="4" width="14" height="1" fill="#9a7220"/>
      {/* Body */}
      <rect x="0" y="4"  width="40" height="30" fill="#d4a843"/>
      {/* Highlight top + left */}
      <rect x="0" y="4"  width="40" height="1" fill="#ffe07a"/>
      <rect x="0" y="4"  width="1"  height="29" fill="#ffe07a"/>
      {/* Shadow bottom + right */}
      <rect x="0"  y="33" width="40" height="1" fill="#6b4e10"/>
      <rect x="39" y="4"  width="1"  height="30" fill="#6b4e10"/>
      <rect x="1"  y="32" width="38" height="1" fill="#9a7220"/>
      <rect x="38" y="5"  width="1"  height="27" fill="#9a7220"/>
      {/* Inner content badge */}
      {badge}
    </svg>
  )
}

// ── Gamepad badge ────────────────────────────────────────
const GameBadge = () => (
  <g transform="translate(8, 11)">
    {/* controller body */}
    <rect x="2" y="4"  width="20" height="12" fill="#2a2a2a"/>
    <rect x="0" y="6"  width="4"  height="8"  fill="#2a2a2a"/>
    <rect x="20" y="6" width="4"  height="8"  fill="#2a2a2a"/>
    {/* d-pad */}
    <rect x="4" y="8"  width="2"  height="6"  fill="#888"/>
    <rect x="2" y="10" width="6"  height="2"  fill="#888"/>
    {/* buttons */}
    <rect x="16" y="8"  width="2" height="2" fill="#cc4444"/>
    <rect x="19" y="10" width="2" height="2" fill="#cccc44"/>
    <rect x="16" y="12" width="2" height="2" fill="#44cc44"/>
    <rect x="13" y="10" width="2" height="2" fill="#4444cc"/>
    {/* Highlight */}
    <rect x="2" y="4"  width="20" height="1" fill="#444"/>
    <rect x="2" y="4"  width="1"  height="12" fill="#444"/>
  </g>
)

// ── Film clapper badge ───────────────────────────────────
const FilmBadge = () => (
  <g transform="translate(7, 10)">
    {/* clapper board */}
    <rect x="0"  y="5"  width="26" height="16" fill="#111"/>
    <rect x="0"  y="5"  width="26" height="1"  fill="#444"/>
    <rect x="0"  y="5"  width="1"  height="16" fill="#444"/>
    {/* top bar */}
    <rect x="0"  y="2"  width="26" height="5"  fill="#fff"/>
    <rect x="0"  y="2"  width="1"  height="5"  fill="#ccc"/>
    {/* stripes on top bar */}
    <rect x="3"  y="2"  width="3"  height="5" fill="#111"/>
    <rect x="9"  y="2"  width="3"  height="5" fill="#111"/>
    <rect x="15" y="2"  width="3"  height="5" fill="#111"/>
    <rect x="21" y="2"  width="3"  height="5" fill="#111"/>
    {/* inner content */}
    <rect x="3"  y="9"  width="8"  height="8" fill="#333"/>
    <rect x="14" y="9"  width="8"  height="8" fill="#222"/>
    {/* Lines on inner */}
    <rect x="3"  y="11" width="8"  height="1" fill="#555"/>
    <rect x="14" y="13" width="8"  height="1" fill="#444"/>
  </g>
)

// ── Floppy disk badge ────────────────────────────────────
const SWRBadge = () => (
  <g transform="translate(10, 10)">
    {/* disk body */}
    <rect x="0"  y="0"  width="20" height="20" fill="#1a1a3a"/>
    {/* highlight */}
    <rect x="0"  y="0"  width="1"  height="20" fill="#404080"/>
    <rect x="0"  y="0"  width="20" height="1"  fill="#404080"/>
    {/* shadow */}
    <rect x="19" y="0"  width="1"  height="20" fill="#000"/>
    <rect x="0"  y="19" width="20" height="1"  fill="#000"/>
    {/* label area */}
    <rect x="2"  y="8"  width="16" height="9"  fill="#d0d8f0"/>
    <rect x="2"  y="8"  width="16" height="1"  fill="#e8ecf8"/>
    {/* lines on label */}
    <rect x="4"  y="10" width="10" height="1"  fill="#6688cc"/>
    <rect x="4"  y="12" width="8"  height="1"  fill="#6688cc"/>
    {/* shutter */}
    <rect x="6"  y="1"  width="8"  height="6"  fill="#2a2a4a"/>
    <rect x="8"  y="1"  width="2"  height="6"  fill="#5566aa"/>
    {/* write-protect notch */}
    <rect x="16" y="15" width="2"  height="3"  fill="#1a1a3a"/>
  </g>
)

// ── Person/About EXE icon ────────────────────────────────
function AboutIcon() {
  return (
    <svg viewBox="0 0 40 40" width="68" height="68" style={S}>
      {/* Window frame */}
      <rect x="0"  y="0"  width="40" height="40" fill="#c0c0c0"/>
      {/* Border */}
      <rect x="0"  y="0"  width="40" height="1"  fill="#fff"/>
      <rect x="0"  y="0"  width="1"  height="40" fill="#fff"/>
      <rect x="39" y="0"  width="1"  height="40" fill="#404040"/>
      <rect x="0"  y="39" width="40" height="1"  fill="#404040"/>
      {/* Titlebar */}
      <rect x="1"  y="1"  width="38" height="8"  fill="#000080"/>
      <rect x="1"  y="1"  width="38" height="1"  fill="#4488ff"/>
      {/* White dots for text in titlebar */}
      <rect x="3"  y="3"  width="1" height="4"  fill="#fff"/>
      <rect x="5"  y="3"  width="1" height="4"  fill="#fff"/>
      <rect x="4"  y="5"  width="1" height="1"  fill="#fff"/>
      {/* Head */}
      <rect x="15" y="12" width="10" height="9"  fill="#ffdec4"/>
      <rect x="15" y="12" width="10" height="1"  fill="#ffe8d8"/>
      {/* Eyes */}
      <rect x="17" y="15" width="2"  height="2"  fill="#2a1a00"/>
      <rect x="21" y="15" width="2"  height="2"  fill="#2a1a00"/>
      {/* Mouth */}
      <rect x="17" y="19" width="6"  height="1"  fill="#c87a60"/>
      {/* Body / shirt */}
      <rect x="12" y="22" width="16" height="14" fill="#0000c0"/>
      <rect x="12" y="22" width="16" height="1"  fill="#4444ff"/>
      <rect x="12" y="22" width="1"  height="14" fill="#4444ff"/>
      {/* Collar */}
      <rect x="16" y="22" width="8"  height="3"  fill="#ffdec4"/>
    </svg>
  )
}

// ── Envelope (MAIL.EXE) icon ─────────────────────────────
function MailIcon() {
  return (
    <svg viewBox="0 0 40 34" width="80" height="68" style={S}>
      {/* Envelope body */}
      <rect x="0"  y="4"  width="40" height="30" fill="#f0f0f8"/>
      <rect x="0"  y="4"  width="40" height="1"  fill="#fff"/>
      <rect x="0"  y="4"  width="1"  height="29" fill="#fff"/>
      <rect x="39" y="4"  width="1"  height="30" fill="#808080"/>
      <rect x="0"  y="33" width="40" height="1"  fill="#808080"/>
      {/* Flap (diagonal lines forming V) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={`l${i}`} x={i} y={5 + i} width="1" height="1" fill="#000080" opacity="0.6"/>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={`r${i}`} x={39 - i} y={5 + i} width="1" height="1" fill="#000080" opacity="0.6"/>
      ))}
      {/* Paper inside */}
      <rect x="5"  y="18" width="30" height="12" fill="#fff"/>
      <rect x="5"  y="18" width="30" height="1"  fill="#e0e0e0"/>
      {/* Lines on paper */}
      <rect x="8"  y="21" width="18" height="1"  fill="#c0c0e0"/>
      <rect x="8"  y="23" width="22" height="1"  fill="#c0c0e0"/>
      <rect x="8"  y="25" width="14" height="1"  fill="#c0c0e0"/>
    </svg>
  )
}

export function DesktopPixelIcon({ type }: { type: WindowType }) {
  switch (type) {
    case 'game':  return <FolderBase badge={<GameBadge />} />
    case 'film':  return <FolderBase badge={<FilmBadge />} />
    case 'swr':   return <FolderBase badge={<SWRBadge />} />
    case 'about': return <AboutIcon />
    case 'mail':  return <MailIcon />
  }
}
