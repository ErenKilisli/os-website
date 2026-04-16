/**
 * App Registry — pure data, no React imports.
 * This is the single source of truth for every app's metadata.
 * windowStore, Window.tsx, Desktop, PhoneView, Spotlight, ContextMenu all read from here.
 *
 * To add a new app:
 *  1. Add its type to WindowType below
 *  2. Add an AppMeta entry to APP_META
 *  3. Add its Component (and optional custom icons) to appRegistry.tsx
 *  That's it — everything else (desktop icon, phone tile, spotlight, context menu) is automatic.
 */

export type WindowType =
  | 'about' | 'mail' | 'terminal' | 'settings' | 'browser'
  | 'notepad' | 'music' | 'calc' | 'paint' | 'sysinfo'
  | 'devfiles' | 'film' | 'game'
  | 'snake' | 'snowboard'
  | 'appmarket' | 'readme'
  | 'projectdetail'
  // Legacy folder variants (kept for backward-compat with persisted state)
  | 'cinema' | 'arcade' | 'swr'

export interface AppMeta {
  type: WindowType

  /** Window titlebar text — shown in Window chrome and Taskbar */
  title: string
  /** Short display name — desktop icon label, phone label, spotlight header */
  label: string
  /** Shorter override for the phone grid (optional — falls back to label) */
  phoneLabel?: string

  /** Material Symbols name, or an emoji (e.g. '🐍') */
  icon: string
  /** Desktop icon text tint */
  iconColor: string

  /** Default window size */
  width: number
  height: number

  /** Phone tile CSS gradient ('' = not on phone) */
  phoneBg: string

  /** One-line description shown in Spotlight results */
  spotlightDesc: string
  /** Longer description shown in App Market listing */
  appDescription?: string

  // ── Install state ──────────────────────────────────────────────────────────
  /** true = ships with OS and cannot be removed; false = user installs from market */
  preInstalled: boolean

  // ── Visibility flags ───────────────────────────────────────────────────────
  showOnDesktop: boolean
  showOnPhone: boolean
  /** Phone inline screen (true) vs "open on desktop" fallback (false) */
  phoneInline: boolean
  showInSpotlight: boolean
  showInContextMenu: boolean

  // ── Desktop icon grid position ─────────────────────────────────────────────
  /** Column: L1 = leftmost, L2 = second, R = rightmost */
  desktopCol?: 'L1' | 'L2' | 'R'
  desktopRow?: number
}

/**
 * Master list — order here defines phone home-screen grid order.
 * Desktop position is determined by desktopCol + desktopRow.
 */
export const APP_META: AppMeta[] = [
  // ── Left col (L1) ──────────────────────────────────────────────────────────
  {
    type: 'about',
    title: 'ABOUTME.DOC', label: 'ABOUT ME', phoneLabel: 'ABOUT ME',
    icon: 'account_circle', iconColor: '#ffffff',
    width: 820, height: 640,
    phoneBg: 'linear-gradient(145deg,#8b0000,#c0392b)',
    spotlightDesc: 'Bio, skills & info',
    appDescription: 'Personal profile — bio, skills, technologies and background.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: false, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L1', desktopRow: 0,
  },
  {
    type: 'mail',
    title: 'CONTACT.MSG', label: 'CONTACT', phoneLabel: 'CONTACT',
    icon: 'mail', iconColor: '#9097ff',
    width: 640, height: 460,
    phoneBg: 'linear-gradient(145deg,#4a40d0,#8b78ee)',
    spotlightDesc: 'Send a message',
    appDescription: 'Send a direct message — email form with subject & body.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: false, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L1', desktopRow: 1,
  },
  {
    type: 'notepad',
    title: 'NOTEPAD.EXE', label: 'NOTEPAD', phoneLabel: 'NOTES',
    icon: 'edit_note', iconColor: '#ffffff',
    width: 520, height: 420,
    phoneBg: 'linear-gradient(145deg,#604800,#988000)',
    spotlightDesc: 'Text editor',
    appDescription: 'Simple plain-text editor. Type, copy, clear.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L1', desktopRow: 2,
  },
  {
    type: 'music',
    title: 'MUSIC.EXE', label: 'MUSIC',
    icon: 'music_note', iconColor: '#ff71ce',
    width: 380, height: 440,
    phoneBg: 'linear-gradient(145deg,#a03070,#d060a0)',
    spotlightDesc: 'Music player',
    appDescription: 'Built-in music player with visualiser and playlist.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L1', desktopRow: 3,
  },
  {
    type: 'terminal',
    title: 'TERMINAL.EXE', label: 'TERMINAL',
    icon: 'terminal', iconColor: '#00fd00',
    width: 560, height: 380,
    phoneBg: 'linear-gradient(145deg,#082808,#105010)',
    spotlightDesc: 'Command line interface',
    appDescription: 'Interactive terminal — run commands, open apps, explore the OS.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L1', desktopRow: 4,
  },
  // ── Left col 2 (L2) ────────────────────────────────────────────────────────
  {
    type: 'settings',
    title: 'SETTINGS.EXE', label: 'SETTINGS',
    icon: 'settings', iconColor: '#d3d4d5',
    width: 440, height: 360,
    phoneBg: 'linear-gradient(145deg,#303848,#505868)',
    spotlightDesc: 'System configuration',
    appDescription: 'Wallpaper, theme, display brightness and system controls.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: false, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L2', desktopRow: 0,
  },
  {
    type: 'browser',
    title: 'BROWSER.EXE', label: 'BROWSER',
    icon: 'public', iconColor: '#00ffff',
    width: 860, height: 580,
    phoneBg: 'linear-gradient(145deg,#006880,#00a8c0)',
    spotlightDesc: 'Web browser',
    appDescription: 'Embedded web browser — navigate to any URL.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L2', desktopRow: 1,
  },
  {
    type: 'paint',
    title: 'PAINT.EXE', label: 'PAINT',
    icon: 'brush', iconColor: '#ff0000',
    width: 620, height: 520,
    phoneBg: 'linear-gradient(145deg,#701890,#a040c0)',
    spotlightDesc: 'Pixel art drawing app',
    appDescription: 'Pixel art canvas with colour palette, brush sizes and eraser.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L2', desktopRow: 2,
  },
  {
    type: 'appmarket',
    title: 'APP MARKET.EXE', label: 'APP MARKET', phoneLabel: 'MARKET',
    icon: 'storefront', iconColor: '#0055ff',
    width: 540, height: 500,
    phoneBg: 'linear-gradient(145deg,#701060,#b03090)',
    spotlightDesc: 'Install and manage apps',
    appDescription: 'Browse and install optional apps for LIZARD.OS.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L2', desktopRow: 3,
  },
  {
    type: 'readme',
    title: 'README.TXT', label: 'README',
    icon: 'text_snippet', iconColor: '#aabbcc',
    width: 560, height: 480,
    phoneBg: '',
    spotlightDesc: 'About LIZARD.OS',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: false, phoneInline: false,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L2', desktopRow: 4,
  },
  // ── Right col (R) ──────────────────────────────────────────────────────────
  {
    type: 'devfiles',
    title: 'DEV_PROJECTS.EXE', label: 'DEV PROJECTS', phoneLabel: 'DEV',
    icon: 'folder_code', iconColor: '#ff8c42',
    width: 520, height: 360,
    phoneBg: 'linear-gradient(145deg,#c05018,#e07030)',
    spotlightDesc: 'Software projects',
    appDescription: 'Browse software and web development projects.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'R', desktopRow: 0,
  },
  {
    type: 'film',
    title: 'FILM_PROJECTS.EXE', label: 'FILM PROJECTS', phoneLabel: 'FILMS',
    icon: 'movie', iconColor: '#eaea00',
    width: 600, height: 440,
    phoneBg: 'linear-gradient(145deg,#907800,#c8a800)',
    spotlightDesc: 'Film & video work',
    appDescription: 'Film, video and cinematography project archive.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'R', desktopRow: 1,
  },
  {
    type: 'game',
    title: 'GAME_PROJECTS.EXE', label: 'GAME PROJECTS', phoneLabel: 'GAMES',
    icon: 'sports_esports', iconColor: '#00fd00',
    width: 500, height: 340,
    phoneBg: 'linear-gradient(145deg,#186018,#28a028)',
    spotlightDesc: 'Game development work',
    appDescription: 'Game development projects — engines, jams and prototypes.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'R', desktopRow: 2,
  },
  {
    type: 'snowboard',
    title: 'SNOWBOARD.EXE', label: 'SNOWBOARD', phoneLabel: 'SKI',
    icon: 'downhill_skiing', iconColor: '#00ffff',
    width: 510, height: 510,
    phoneBg: 'linear-gradient(145deg,#0a5020,#1a8040)',
    spotlightDesc: 'Endless downhill run',
    appDescription: 'Pixel-art endless snowboard runner — dodge rocks and hit speed.',
    preInstalled: false,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'R', desktopRow: 4,
  },
  {
    type: 'snake',
    title: 'SNAKE.EXE', label: 'SNAKE',
    icon: '🐍', iconColor: '#00fd00',
    width: 444, height: 450,
    phoneBg: 'linear-gradient(145deg,#0a4020,#188040)',
    spotlightDesc: 'Classic snake game',
    appDescription: 'Classic Snake — eat dots, grow longer, walls wrap around.',
    preInstalled: true,
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'R', desktopRow: 3,
  },
  // ── Optional apps (installed via App Market) ───────────────────────────────
  {
    type: 'calc',
    title: 'CALC.EXE', label: 'CALC',
    icon: 'calculate', iconColor: '#00ffff',
    width: 280, height: 420,
    phoneBg: 'linear-gradient(145deg,#102060,#1840a0)',
    spotlightDesc: 'Calculator',
    appDescription: 'Standard calculator — arithmetic, keyboard input supported.',
    preInstalled: false,
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L1', desktopRow: 5,
  },
  // ── System — no desktop icon ────────────────────────────────────────────────
  {
    type: 'sysinfo',
    title: 'SYSINFO.EXE', label: 'SYSINFO',
    icon: 'memory', iconColor: '#4a6080',
    width: 500, height: 440,
    phoneBg: '',
    spotlightDesc: 'System information',
    appDescription: 'Hardware specs, OS version and runtime information.',
    preInstalled: true,
    showOnDesktop: false, showOnPhone: false, phoneInline: false,
    showInSpotlight: false, showInContextMenu: false,
  },
  // ── Internal — never shown in UI lists ─────────────────────────────────────
  {
    type: 'projectdetail',
    title: 'PROJECT.EXE', label: 'PROJECT',
    icon: 'description', iconColor: '#ffffff',
    width: 580, height: 460,
    phoneBg: '',
    spotlightDesc: '',
    preInstalled: true,
    showOnDesktop: false, showOnPhone: false, phoneInline: false,
    showInSpotlight: false, showInContextMenu: false,
  },
  // ── Legacy folder variants (kept for localStorage compat) ──────────────────
  {
    type: 'cinema',
    title: 'FILM_PROJECTS.EXE', label: 'FILM PROJECTS',
    icon: 'movie', iconColor: '#eaea00',
    width: 600, height: 440,
    phoneBg: '',
    spotlightDesc: '',
    preInstalled: true,
    showOnDesktop: false, showOnPhone: false, phoneInline: false,
    showInSpotlight: false, showInContextMenu: false,
  },
  {
    type: 'arcade',
    title: 'GAME_PROJECTS.EXE', label: 'GAME PROJECTS',
    icon: 'sports_esports', iconColor: '#00fd00',
    width: 500, height: 340,
    phoneBg: '',
    spotlightDesc: '',
    preInstalled: true,
    showOnDesktop: false, showOnPhone: false, phoneInline: false,
    showInSpotlight: false, showInContextMenu: false,
  },
  {
    type: 'swr',
    title: 'SOFTWARE.EXE', label: 'SOFTWARE',
    icon: 'folder', iconColor: '#808080',
    width: 520, height: 360,
    phoneBg: '',
    spotlightDesc: '',
    preInstalled: true,
    showOnDesktop: false, showOnPhone: false, phoneInline: false,
    showInSpotlight: false, showInContextMenu: false,
  },
]

/** Lookup by type — returns undefined for unknown types */
export function getAppMeta(type: WindowType): AppMeta | undefined {
  return APP_META.find(a => a.type === type)
}
