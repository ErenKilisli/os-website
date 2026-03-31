'use client'
import React from 'react'
import { WindowType } from '@/store/windowStore'

/* ═══════════════════════════════════════════════════════════
   PIXEL ART ICONS — CYBERCORE WIN95
   Folders: 82×66 viewBox → 130×104 rendered
   Standalone icons: various viewBoxes, transparent bg
═══════════════════════════════════════════════════════════ */

const PIX: React.CSSProperties = { imageRendering: 'pixelated', display: 'block' }

/* ── Folder palette ──────────────────────────────────────── */
const TAN = '#d4b87a'
const HI  = '#ece4a4'
const SH  = '#9a7828'
const DEP = '#6a4810'

/* ── Base folder (82×66 viewBox → 130×104 rendered) ──────── */
function Folder({ ch }: { ch?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 82 66" width="130" height="104" style={PIX}>
      {/* TAB */}
      <rect x="2"  y="2"  width="23" height="11" fill={TAN}/>
      <rect x="2"  y="2"  width="23" height="2"  fill={HI}/>
      <rect x="2"  y="2"  width="2"  height="11" fill={HI}/>
      <rect x="23" y="2"  width="2"  height="11" fill={SH}/>
      {/* BODY */}
      <rect x="2"  y="12" width="74" height="46" fill={TAN}/>
      <rect x="2"  y="12" width="74" height="2"  fill={HI}/>
      <rect x="2"  y="12" width="2"  height="46" fill={HI}/>
      <rect x="72" y="13" width="2"  height="44" fill={SH}/>
      <rect x="4"  y="56" width="70" height="2"  fill={SH}/>
      {/* 3-D DEPTH */}
      <rect x="4"  y="58" width="74" height="5"  fill={DEP}/>
      <rect x="74" y="12" width="5"  height="46" fill={DEP}/>
      <rect x="74" y="58" width="5"  height="5"  fill={DEP}/>
      {ch}
    </svg>
  )
}

/* ── SNES Controller badge — small, bottom-right, red (matches Dev style) ── */
function GameBadge() {
  const R = '#cc2222'
  const RH = '#ee4444'
  // Tiny joystick in bottom-right corner only (x:54-72, y:42-56)
  return (
    <g>
      {/* Joystick base */}
      <rect x="56" y="52" width="14" height="3"  fill={R}/>
      <rect x="57" y="51" width="12" height="2"  fill={RH}/>
      {/* Shaft */}
      <rect x="61" y="44" width="4"  height="9"  fill={R}/>
      <rect x="61" y="44" width="2"  height="9"  fill={RH}/>
      {/* Top ball */}
      <rect x="58" y="40" width="9"  height="5"  fill={R}/>
      <rect x="58" y="40" width="7"  height="2"  fill={RH}/>
      <rect x="58" y="40" width="2"  height="5"  fill={RH}/>
      {/* Center dot */}
      <rect x="61" y="42" width="3"  height="2"  fill="#881111"/>
    </g>
  )
}

/* ── Clapperboard badge — small, bottom-right, red (matches Dev style) ── */
function FilmBadge() {
  const R = '#cc2222'
  const RH = '#ee4444'
  // Tiny clapperboard in bottom-right corner only (x:54-72, y:40-56)
  return (
    <g>
      {/* Hinge arm on top */}
      <rect x="56" y="40" width="14" height="3"  fill={R}/>
      <rect x="56" y="40" width="12" height="2"  fill={RH}/>
      {/* Diagonal stripes on hinge */}
      <rect x="58" y="40" width="2"  height="3"  fill="#881111"/>
      <rect x="62" y="40" width="2"  height="3"  fill="#881111"/>
      <rect x="66" y="40" width="2"  height="3"  fill="#881111"/>
      {/* Clapper body */}
      <rect x="54" y="43" width="18" height="12" fill={R}/>
      <rect x="54" y="43" width="16" height="2"  fill={RH}/>
      <rect x="54" y="43" width="2"  height="12" fill={RH}/>
      {/* Lines on body */}
      <rect x="56" y="47" width="14" height="2"  fill="#881111"/>
      <rect x="56" y="51" width="14" height="2"  fill="#881111"/>
    </g>
  )
}

/* ── `</>` code brackets badge ───────────────────────────── */
function SWRBadge() {
  const D = '#2a2a2a'
  return (
    <g>
      <rect x="24" y="19" width="4" height="5" fill={D}/>
      <rect x="20" y="24" width="4" height="5" fill={D}/>
      <rect x="16" y="29" width="4" height="5" fill={D}/>
      <rect x="12" y="31" width="4" height="4" fill={D}/>
      <rect x="16" y="34" width="4" height="5" fill={D}/>
      <rect x="20" y="39" width="4" height="5" fill={D}/>
      <rect x="24" y="44" width="4" height="5" fill={D}/>
      <rect x="32" y="44" width="4" height="5" fill={D}/>
      <rect x="35" y="39" width="4" height="5" fill={D}/>
      <rect x="38" y="34" width="4" height="5" fill={D}/>
      <rect x="41" y="29" width="4" height="5" fill={D}/>
      <rect x="44" y="24" width="4" height="5" fill={D}/>
      <rect x="47" y="19" width="4" height="5" fill={D}/>
      <rect x="54" y="19" width="4" height="5" fill={D}/>
      <rect x="58" y="24" width="4" height="5" fill={D}/>
      <rect x="62" y="29" width="4" height="5" fill={D}/>
      <rect x="66" y="31" width="4" height="4" fill={D}/>
      <rect x="62" y="34" width="4" height="5" fill={D}/>
      <rect x="58" y="39" width="4" height="5" fill={D}/>
      <rect x="54" y="44" width="4" height="5" fill={D}/>
    </g>
  )
}

/* ── About: standalone pixel art person (48×48 → 96×96) ──── */
function AboutIcon() {
  return (
    <svg viewBox="0 0 48 48" width="96" height="96" style={PIX}>
      {/* Hair */}
      <rect x="16" y="6"  width="16" height="3"  fill="#2a1a0a"/>
      <rect x="14" y="8"  width="3"  height="3"  fill="#2a1a0a"/>
      <rect x="31" y="8"  width="3"  height="3"  fill="#2a1a0a"/>
      {/* Head */}
      <rect x="15" y="9"  width="18" height="14" fill="#f5c9a0"/>
      <rect x="14" y="10" width="2"  height="12" fill="#f5c9a0"/>
      <rect x="32" y="10" width="2"  height="12" fill="#f5c9a0"/>
      {/* Eyes */}
      <rect x="18" y="14" width="3"  height="3"  fill="#2a1a0a"/>
      <rect x="27" y="14" width="3"  height="3"  fill="#2a1a0a"/>
      {/* Mouth */}
      <rect x="20" y="20" width="8"  height="2"  fill="#c07050"/>
      {/* Neck */}
      <rect x="21" y="23" width="6"  height="3"  fill="#f5c9a0"/>
      {/* Body / blue shirt */}
      <rect x="14" y="26" width="20" height="14" fill="#2255cc"/>
      <rect x="14" y="26" width="20" height="2"  fill="#3366dd"/>
      <rect x="14" y="26" width="2"  height="14" fill="#3366dd"/>
      {/* Arms */}
      <rect x="10" y="26" width="4"  height="10" fill="#2255cc"/>
      <rect x="34" y="26" width="4"  height="10" fill="#2255cc"/>
      {/* Hands */}
      <rect x="10" y="36" width="4"  height="3"  fill="#f5c9a0"/>
      <rect x="34" y="36" width="4"  height="3"  fill="#f5c9a0"/>
      {/* Legs */}
      <rect x="16" y="40" width="6"  height="6"  fill="#334466"/>
      <rect x="26" y="40" width="6"  height="6"  fill="#334466"/>
      {/* Shoes */}
      <rect x="15" y="45" width="8"  height="2"  fill="#1a1a1a"/>
      <rect x="25" y="45" width="8"  height="2"  fill="#1a1a1a"/>
    </svg>
  )
}

/* ── Mail: standalone pixel art envelope (56×42 → 112×84) ── */
function MailIcon() {
  return (
    <svg viewBox="0 0 56 42" width="112" height="84" style={PIX}>
      {/* Shadow */}
      <rect x="3"  y="5"  width="50" height="36" fill="#aaaaaa" opacity="0.4"/>
      {/* Body */}
      <rect x="2"  y="4"  width="50" height="34" fill="#f0f0e8"/>
      <rect x="2"  y="4"  width="50" height="2"  fill="#ffffff"/>
      <rect x="2"  y="4"  width="2"  height="34" fill="#ffffff"/>
      <rect x="50" y="5"  width="2"  height="32" fill="#888888"/>
      <rect x="3"  y="37" width="49" height="2"  fill="#888888"/>
      {/* V-flap diagonal lines (blue tinted) */}
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={`fl${i}`} x={3  + i} y={4 + i} width="2" height="2" fill="#6688cc" opacity="0.8"/>
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={`fr${i}`} x={49 - i} y={4 + i} width="2" height="2" fill="#6688cc" opacity="0.8"/>
      ))}
      {/* Horizontal fold line */}
      <rect x="2" y="20" width="50" height="1" fill="#cccccc"/>
    </svg>
  )
}

/* ── Terminal: mini Win95 terminal window (56×44 → 112×88) ── */
function TerminalIcon() {
  return (
    <svg viewBox="0 0 56 44" width="112" height="88" style={PIX}>
      {/* Window frame */}
      <rect x="2"  y="2"  width="50" height="40" fill="#d4d0c8"/>
      <rect x="2"  y="2"  width="50" height="2"  fill="#ffffff"/>
      <rect x="2"  y="2"  width="2"  height="40" fill="#ffffff"/>
      <rect x="50" y="3"  width="2"  height="38" fill="#404040"/>
      <rect x="3"  y="40" width="49" height="2"  fill="#404040"/>
      {/* Titlebar */}
      <rect x="2"  y="2"  width="50" height="10" fill="#000080"/>
      <rect x="2"  y="2"  width="50" height="1"  fill="#4466cc"/>
      {/* Title dots */}
      <rect x="5"  y="5"  width="2"  height="2"  fill="#ffffff"/>
      <rect x="9"  y="5"  width="2"  height="2"  fill="#ffffff"/>
      <rect x="13" y="5"  width="2"  height="2"  fill="#ffffff"/>
      {/* Close button */}
      <rect x="44" y="3"  width="7"  height="8"  fill="#d4d0c8"/>
      <rect x="44" y="3"  width="7"  height="1"  fill="#ffffff"/>
      <rect x="44" y="3"  width="1"  height="8"  fill="#ffffff"/>
      <rect x="50" y="4"  width="1"  height="7"  fill="#404040"/>
      <rect x="45" y="10" width="6"  height="1"  fill="#404040"/>
      <rect x="45" y="4"  width="5"  height="6"  fill="#cc0000"/>
      {/* Black content area */}
      <rect x="4"  y="13" width="46" height="26" fill="#000000"/>
      {/* Green text: C:\>_ */}
      <rect x="6"  y="16" width="2"  height="2"  fill="#00ff44"/>
      <rect x="9"  y="16" width="2"  height="2"  fill="#00ff44"/>
      <rect x="9"  y="18" width="2"  height="2"  fill="#00ff44"/>
      <rect x="9"  y="20" width="2"  height="2"  fill="#00ff44"/>
      <rect x="6"  y="20" width="2"  height="2"  fill="#00ff44"/>
      <rect x="6"  y="18" width="2"  height="1"  fill="#00ff44"/>
      <rect x="13" y="16" width="1"  height="6"  fill="#00ff44"/>
      <rect x="17" y="16" width="2"  height="6"  fill="#00ff44"/>
      <rect x="14" y="21" width="3"  height="1"  fill="#00ff44"/>
      <rect x="21" y="16" width="3"  height="6"  fill="#00ff44"/>
      <rect x="24" y="19" width="2"  height="3"  fill="#00ff44"/>
      <rect x="27" y="21" width="2"  height="1"  fill="#00ff44"/>
      <rect x="29" y="16" width="2"  height="6"  fill="#00ff44"/>
      <rect x="31" y="16" width="3"  height="2"  fill="#00ff44"/>
      <rect x="31" y="19" width="3"  height="1"  fill="#00ff44"/>
      <rect x="31" y="21" width="3"  height="1"  fill="#00ff44"/>
      {/* Blinking cursor block */}
      <rect x="36" y="16" width="4"  height="6"  fill="#00ff44" opacity="0.9"/>
      {/* Second line hint */}
      <rect x="6"  y="26" width="20" height="2"  fill="#00ff44" opacity="0.4"/>
    </svg>
  )
}

/* ── Settings: pixel art gear (48×48 → 96×96) ───────────── */
function GearIcon() {
  const G  = '#a0a0a0'
  const GH = '#c8c8c8'
  const GD = '#606060'
  return (
    <svg viewBox="0 0 48 48" width="96" height="96" style={PIX}>
      {/* Gear teeth — 8 teeth evenly spaced */}
      {/* Top */}
      <rect x="19" y="2"  width="10" height="7"  fill={G}/>
      <rect x="19" y="2"  width="10" height="2"  fill={GH}/>
      {/* Bottom */}
      <rect x="19" y="39" width="10" height="7"  fill={G}/>
      <rect x="19" y="44" width="10" height="2"  fill={GD}/>
      {/* Left */}
      <rect x="2"  y="19" width="7"  height="10" fill={G}/>
      <rect x="2"  y="19" width="2"  height="10" fill={GH}/>
      {/* Right */}
      <rect x="39" y="19" width="7"  height="10" fill={G}/>
      <rect x="44" y="20" width="2"  height="8"  fill={GD}/>
      {/* Top-left diagonal tooth */}
      <rect x="7"  y="7"  width="7"  height="7"  fill={G}/>
      <rect x="7"  y="7"  width="3"  height="2"  fill={GH}/>
      {/* Top-right diagonal tooth */}
      <rect x="34" y="7"  width="7"  height="7"  fill={G}/>
      <rect x="34" y="7"  width="3"  height="2"  fill={GH}/>
      {/* Bottom-left diagonal tooth */}
      <rect x="7"  y="34" width="7"  height="7"  fill={G}/>
      <rect x="38" y="35" width="2"  height="5"  fill={GD}/>
      {/* Bottom-right diagonal tooth */}
      <rect x="34" y="34" width="7"  height="7"  fill={G}/>
      <rect x="39" y="35" width="2"  height="5"  fill={GD}/>
      {/* Gear body (octagonal) */}
      <rect x="9"  y="9"  width="30" height="30" fill={G}/>
      <rect x="9"  y="9"  width="15" height="2"  fill={GH}/>
      <rect x="9"  y="9"  width="2"  height="15" fill={GH}/>
      <rect x="37" y="10" width="2"  height="28" fill={GD}/>
      <rect x="10" y="37" width="27" height="2"  fill={GD}/>
      {/* Center hole */}
      <rect x="18" y="18" width="12" height="12" fill="#333333"/>
      <rect x="20" y="20" width="8"  height="8"  fill="#1a1a1a"/>
      <rect x="18" y="18" width="5"  height="2"  fill="#555555"/>
      <rect x="18" y="18" width="2"  height="5"  fill="#555555"/>
    </svg>
  )
}

/* ── Trash bin (decorative, 40×52 → 60×78) ─────────────── */
export function TrashIcon() {
  return (
    <svg viewBox="0 0 40 52" width="60" height="78" style={PIX}>
      {/* Lid (slightly ajar) */}
      <rect x="4"  y="4"  width="32" height="5"  fill="#d4d0c8"/>
      <rect x="4"  y="4"  width="32" height="1"  fill="#ffffff"/>
      <rect x="4"  y="4"  width="1"  height="5"  fill="#ffffff"/>
      <rect x="35" y="5"  width="1"  height="4"  fill="#404040"/>
      <rect x="5"  y="8"  width="30" height="1"  fill="#404040"/>
      {/* Handle */}
      <rect x="15" y="1"  width="10" height="4"  fill="#d4d0c8"/>
      <rect x="15" y="1"  width="10" height="1"  fill="#ffffff"/>
      <rect x="15" y="1"  width="1"  height="4"  fill="#ffffff"/>
      <rect x="24" y="2"  width="1"  height="3"  fill="#808080"/>
      {/* Bin body */}
      <rect x="5"  y="9"  width="30" height="34" fill="#e8e4dc"/>
      <rect x="5"  y="9"  width="30" height="2"  fill="#ffffff"/>
      <rect x="5"  y="9"  width="2"  height="34" fill="#ffffff"/>
      <rect x="33" y="10" width="2"  height="32" fill="#808080"/>
      <rect x="6"  y="42" width="28" height="2"  fill="#808080"/>
      {/* Vertical lines on bin */}
      <rect x="13" y="11" width="1"  height="29" fill="#c8c4bc"/>
      <rect x="19" y="11" width="1"  height="29" fill="#c8c4bc"/>
      <rect x="26" y="11" width="1"  height="29" fill="#c8c4bc"/>
      {/* Crumpled paper sticking out */}
      <rect x="8"  y="5"  width="8"  height="5"  fill="#fffef0"/>
      <rect x="8"  y="5"  width="8"  height="1"  fill="#ffffff"/>
      <rect x="9"  y="6"  width="6"  height="1"  fill="#e0ddc0"/>
      <rect x="8"  y="7"  width="4"  height="1"  fill="#e0ddc0"/>
      <rect x="22" y="4"  width="7"  height="6"  fill="#fffef0" transform="rotate(12 25 7)"/>
      <rect x="22" y="4"  width="7"  height="1"  fill="#ffffff" transform="rotate(12 25 7)"/>
      {/* Base */}
      <rect x="6"  y="44" width="28" height="4"  fill="#d4d0c8"/>
      <rect x="5"  y="48" width="30" height="2"  fill="#808080"/>
      <rect x="6"  y="44" width="28" height="1"  fill="#f0f0f0"/>
    </svg>
  )
}

/* ── Cursor cluster (decorative) ────────────────────────── */
const CURSOR_POSITIONS: Array<{ x: number; y: number; rot: number; opacity: number }> = [
  { x: 0,  y: 0,  rot: 0,   opacity: 0.9 },
  { x: 18, y: 6,  rot: 15,  opacity: 0.7 },
  { x: 36, y: 2,  rot: -10, opacity: 0.8 },
  { x: 8,  y: 22, rot: 25,  opacity: 0.6 },
  { x: 28, y: 18, rot: -20, opacity: 0.75 },
  { x: 50, y: 10, rot: 8,   opacity: 0.65 },
  { x: 42, y: 28, rot: -35, opacity: 0.55 },
]

export function CursorCluster() {
  return (
    <div className="cursor-cluster">
      {CURSOR_POSITIONS.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            transform: `rotate(${p.rot}deg)`,
            opacity: p.opacity,
          }}
        >
          <svg viewBox="0 0 14 20" width="14" height="20" style={PIX}>
            {/* Arrow cursor shape */}
            <polygon points="0,0 0,18 4,14 7,19 9,18 6,13 11,13" fill="#ffffff"/>
            <polygon points="1,1 1,16 4,13 7,18 8,17.5 5,12 10,12 1,1" fill="#000000" opacity="0.3"/>
          </svg>
        </div>
      ))}
    </div>
  )
}

/* ── Public export ─────────────────────────────────────────── */
export function DesktopPixelIcon({ type }: { type: WindowType }) {
  switch (type) {
    case 'game':     return <Folder ch={<GameBadge />} />
    case 'film':     return <Folder ch={<FilmBadge />} />
    case 'swr':      return <Folder ch={<SWRBadge />} />
    case 'about':    return <AboutIcon />
    case 'mail':     return <MailIcon />
    case 'terminal': return <TerminalIcon />
    case 'settings': return <GearIcon />
    default:         return null
  }
}
