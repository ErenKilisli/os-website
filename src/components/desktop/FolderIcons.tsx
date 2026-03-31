'use client'

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
