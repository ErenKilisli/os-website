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

/* ─── FILM PROJECTS ─── same folder, clapperboard in bottom-right badge area */
export function FolderFilmIcon({ color, size = 48 }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <path d={FOLDER} fill={color} />

      {/* Clapperboard — positioned in same bottom-right zone as </> in folder_code */}
      {/* Body */}
      <rect x="7" y="14.5" width="10" height="4.5" fill="white" />
      {/* Top bar */}
      <rect x="7" y="12"   width="10" height="2.8" fill="white" />
      {/* Diagonal hatch stripes on top bar (in folder color) */}
      <line x1="9"    y1="12"   x2="11"   y2="14.8" stroke={color} strokeWidth="0.85" />
      <line x1="12"   y1="12"   x2="14"   y2="14.8" stroke={color} strokeWidth="0.85" />
      <line x1="15"   y1="12"   x2="16.2" y2="14.8" strokeWidth="0.85" stroke={color} />
      {/* Hinge knobs */}
      <circle cx="8.5" cy="11.8" r="0.7" fill="rgba(0,0,0,0.35)" />
      <circle cx="14"  cy="11.8" r="0.7" fill="rgba(0,0,0,0.35)" />
      {/* Divider line between bar and body */}
      <line x1="7" y1="14.5" x2="17" y2="14.5" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
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

/* ─── GAME PROJECTS ─── same folder, joystick in bottom-right badge area */
export function FolderGameIcon({ color, size = 48 }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <path d={FOLDER} fill={color} />

      {/* Joystick — positioned in same bottom-right zone as </> in folder_code */}
      {/* Oval base */}
      <ellipse cx="12" cy="18.2" rx="5" ry="1.8" fill="white" />
      {/* Stick shaft */}
      <rect x="11.1" y="13.5" width="1.8" height="5" rx="0.9" fill="white" />
      {/* Top ball */}
      <circle cx="12" cy="12.8" r="2" fill="white" />
      {/* Center dot on ball (in folder color) */}
      <circle cx="12" cy="12.8" r="0.85" fill={color} opacity="0.75" />
    </svg>
  )
}
