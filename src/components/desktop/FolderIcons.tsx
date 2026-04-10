'use client'
import React from 'react'
import rezinnImg from '@/img/icons/rezinn.jpg'
import deuxImg from '@/img/icons/deux.png'

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

/* ─── REZINN LOGO ─── actual brand image ────────────────────────────────── */
export function RezinnLogoIcon({ size = 48 }: { size?: number }) {
  return (
    <img
      src={typeof rezinnImg === 'string' ? rezinnImg : rezinnImg.src}
      alt="Rezinn"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'cover', width: size, height: size }}
    />
  )
}

/* ─── DEUX LOGO ─── actual brand image ──────────────────────────────────── */
export function DeuxLogoIcon({ size = 48 }: { size?: number }) {
  return (
    <img
      src={typeof deuxImg === 'string' ? deuxImg : deuxImg.src}
      alt="Deux"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'cover', width: size, height: size }}
    />
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
