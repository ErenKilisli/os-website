'use client'
import React from 'react'

/* Exact copies of folder_code style.
   Same folder path, same badge area (bottom-right), only the badge symbol changes.
   folder_code  → </> (Material Symbol, kept as-is)
   FolderFilm   → clapperboard in same spot
   FolderGame   → joystick in same spot
*/

interface Props { color: string; size?: number }

/* The folder body path — identical to Material Symbols "folder" filled */
const FOLDER = "M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"

/* ─── FILM PROJECTS ─── same folder, clapperboard in bottom-right corner only */
export function FolderFilmIcon({ color, size = 48 }: Props) {
  const R = '#cc2222'
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <path d={FOLDER} fill={color} />

      {/* Clapperboard — small, bottom-right corner only, left/center empty */}
      {/* Top hinge bar */}
      <rect x="14.5" y="14.5" width="5.5" height="1.5" fill={R} />
      {/* Diagonal stripes on hinge (in darker red) */}
      <line x1="15.5" y1="14.5" x2="16.5" y2="16" stroke="#881111" strokeWidth="0.6" />
      <line x1="17.2" y1="14.5" x2="18.2" y2="16" stroke="#881111" strokeWidth="0.6" />
      {/* Clapper body */}
      <rect x="14" y="16" width="6" height="3.5" fill={R} />
      {/* Line on body */}
      <line x1="14" y1="17.5" x2="20" y2="17.5" stroke="#881111" strokeWidth="0.5" />
    </svg>
  )
}

/* ─── EMPTY FOLDER ─── same folder, badge area visible but no symbol inside */
export function FolderEmptyIcon({ color, size = 48 }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <path d={FOLDER} fill={color} />
      {/* White badge area — same position/size as the </> zone in folder_code */}
      <rect x="7" y="12" width="10" height="7" rx="0.5" fill="white" opacity="0.9" />
    </svg>
  )
}

/* ─── SNOWBOARDER pixel-art icon ─────────────────────────────────────────
   12×12 grid, viewBox="0 0 12 12", imageRendering:pixelated
   0=transparent  1=#00ffff(body)  2=#eaea00(goggle)  3=#ffffff(board)
*/
export function SnowboarderPixelIcon({ size = 48 }: { size?: number }) {
  const G: number[][] = [
    [0,0,0,1,1,1,0,0,0,0,0,0], // 0  helmet
    [0,0,0,1,1,1,1,0,0,0,0,0], // 1  head
    [0,0,0,1,2,1,1,0,0,0,0,0], // 2  face + goggle
    [0,0,0,0,1,1,0,0,0,0,0,0], // 3  neck
    [0,1,1,1,1,1,1,1,1,0,0,0], // 4  arms spread + torso
    [0,0,0,1,1,1,1,1,0,0,0,0], // 5  body / jacket
    [0,0,0,0,1,1,1,1,0,0,0,0], // 6  waist (leaning forward)
    [0,0,0,1,1,0,1,1,0,0,0,0], // 7  bent knees
    [0,3,1,1,0,0,0,1,1,3,0,0], // 8  lower legs + board tips lifted
    [0,3,3,3,3,3,3,3,3,3,3,0], // 9  snowboard
    [0,0,0,0,0,0,0,0,0,0,0,0], // 10 padding
    [0,0,0,0,0,0,0,0,0,0,0,0], // 11 padding
  ]
  const C: Record<number,string> = { 1:'#00ffff', 2:'#eaea00', 3:'#ffffff' }
  return (
    <svg viewBox="0 0 12 12" width={size} height={size}
      style={{ imageRendering: 'pixelated', display: 'block' }}>
      {G.flatMap((row, ry) =>
        row.map((v, cx) =>
          v ? <rect key={`${ry}-${cx}`} x={cx} y={ry} width={1} height={1} fill={C[v]} /> : null
        )
      )}
    </svg>
  )
}

/* ─── PAINT BRUSH ─── classic diagonal brush, rainbow bristles ─── */
export function PaintBrushIcon({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ imageRendering: 'pixelated', display: 'block' }}>
      <defs>
        <linearGradient id="pbi-wood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f0c878" />
          <stop offset="40%"  stopColor="#c88840" />
          <stop offset="100%" stopColor="#9a6020" />
        </linearGradient>
        <linearGradient id="pbi-rbow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"    stopColor="#ff0040" />
          <stop offset="16.7%" stopColor="#ff8800" />
          <stop offset="33.3%" stopColor="#ffee00" />
          <stop offset="50%"   stopColor="#44dd00" />
          <stop offset="66.7%" stopColor="#00aaff" />
          <stop offset="83.3%" stopColor="#8844ff" />
          <stop offset="100%"  stopColor="#ff00cc" />
        </linearGradient>
      </defs>
      {/* Brush rotated -45°: handle → top-right, bristle tip → bottom-left */}
      <g transform="rotate(-45, 24, 24)">
        {/* Wooden handle */}
        <rect x="21" y="1" width="6" height="24" rx="3" fill="url(#pbi-wood)" />
        {/* Handle highlight */}
        <rect x="22" y="2" width="1.5" height="21" rx="0.75" fill="rgba(255,255,255,0.32)" />
        {/* Ferrule — silver band */}
        <rect x="19.5" y="24.5" width="9" height="4.5" fill="#b8b8c8" />
        <rect x="19.5" y="24.5" width="9" height="1.5"  fill="#e8e8f0" />
        <rect x="19.5" y="27.5" width="9" height="1.5"  fill="#808090" />
        {/* Bristles — tapered, rainbow gradient */}
        <path d="M19.5,29 L28.5,29 L26,43 L22,43 Z" fill="url(#pbi-rbow)" />
        {/* Tip — pointed */}
        <path d="M22,43 L26,43 L24,47 Z" fill="#ff00cc" />
        {/* Subtle bristle lines */}
        <line x1="22.5" y1="29.5" x2="21.5" y2="43" stroke="rgba(0,0,0,0.10)" strokeWidth="0.6" />
        <line x1="24"   y1="29"   x2="24"   y2="43" stroke="rgba(0,0,0,0.10)" strokeWidth="0.6" />
        <line x1="25.5" y1="29.5" x2="26.5" y2="43" stroke="rgba(0,0,0,0.10)" strokeWidth="0.6" />
      </g>
    </svg>
  )
}

/* ─── REZINN LOGO ─── location pin with R, coral/purple gradient ────────── */
export function RezinnLogoIcon({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: 'block', imageRendering: 'pixelated' }}>
      <defs>
        <linearGradient id="rez-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      {/* Pin body */}
      <path d="M24 4 C15.16 4 8 11.16 8 20 C8 30.4 24 46 24 46 C24 46 40 30.4 40 20 C40 11.16 32.84 4 24 4 Z"
        fill="url(#rez-bg)" />
      {/* Inner circle */}
      <circle cx="24" cy="20" r="8" fill="rgba(0,0,0,0.28)" />
      {/* R letter */}
      <text x="24" y="25" textAnchor="middle" fill="#fff"
        fontFamily="'Press Start 2P', monospace" fontSize="9" fontWeight="bold">R</text>
    </svg>
  )
}

/* ─── DEUX LOGO ─── two overlapping D shapes, electric blue ─────────────── */
export function DeuxLogoIcon({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: 'block', imageRendering: 'pixelated' }}>
      <defs>
        <linearGradient id="deux-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Background square */}
      <rect x="4" y="4" width="40" height="40" fill="url(#deux-bg)" />
      {/* D shape — left */}
      <rect x="11" y="13" width="4" height="22" fill="rgba(255,255,255,0.9)" />
      <path d="M15 13 Q24 13 24 24 Q24 35 15 35 Z" fill="rgba(255,255,255,0.9)" />
      {/* D shape — right, offset + semi-transparent */}
      <rect x="18" y="13" width="4" height="22" fill="rgba(255,255,255,0.45)" />
      <path d="M22 13 Q31 13 31 24 Q31 35 22 35 Z" fill="rgba(255,255,255,0.45)" />
      {/* DEUX text */}
      <text x="24" y="45" textAnchor="middle" fill="rgba(255,255,255,0.6)"
        fontFamily="monospace" fontSize="5" letterSpacing="2">DEUX</text>
    </svg>
  )
}

/* ─── Project logo map — keyed by project id ──────────────────────────────── */
export const PROJECT_LOGOS: Record<string, React.ComponentType<{ size?: number }>> = {
  rezinn: RezinnLogoIcon,
  deux:   DeuxLogoIcon,
}

/* ─── GAME PROJECTS ─── same folder, joystick in bottom-right corner only */
export function FolderGameIcon({ color, size = 48 }: Props) {
  const R = '#cc2222'
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <path d={FOLDER} fill={color} />

      {/* Joystick — small, bottom-right corner only, left/center empty */}
      {/* Base oval */}
      <ellipse cx="17" cy="19.2" rx="3" ry="1" fill={R} />
      {/* Stick shaft */}
      <rect x="16.3" y="15.5" width="1.4" height="4" rx="0.7" fill={R} />
      {/* Top ball */}
      <circle cx="17" cy="14.8" r="1.4" fill={R} />
      {/* Center dot on ball */}
      <circle cx="17" cy="14.8" r="0.55" fill="#881111" />
    </svg>
  )
}
