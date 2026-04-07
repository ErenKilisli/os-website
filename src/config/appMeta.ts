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
    title: 'ABOUTME.DOC', label: 'ABOUT ME', phoneLabel: 'PROFILE',
    icon: 'account_circle', iconColor: '#ffffff',
    width: 820, height: 640,
    phoneBg: 'linear-gradient(145deg,#3a42c4,#6a5acd)',
    spotlightDesc: 'Bio, skills & info',
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L1', desktopRow: 0,
  },
  {
    type: 'mail',
    title: 'CONTACT.MSG', label: 'CONTACT', phoneLabel: 'MAIL',
    icon: 'mail', iconColor: '#9097ff',
    width: 640, height: 460,
    phoneBg: 'linear-gradient(145deg,#4a40d0,#8b78ee)',
    spotlightDesc: 'Send a message',
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
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
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
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
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L1', desktopRow: 3,
  },
  {
    type: 'calc',
    title: 'CALC.EXE', label: 'CALC',
    icon: 'calculate', iconColor: '#00ffff',
    width: 280, height: 420,
    phoneBg: 'linear-gradient(145deg,#102060,#1840a0)',
    spotlightDesc: 'Calculator',
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L1', desktopRow: 4,
  },
  {
    type: 'terminal',
    title: 'TERMINAL.EXE', label: 'TERMINAL',
    icon: 'terminal', iconColor: '#00fd00',
    width: 560, height: 380,
    phoneBg: 'linear-gradient(145deg,#082808,#105010)',
    spotlightDesc: 'Command line interface',
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L1', desktopRow: 5,
  },
  // ── Left col 2 (L2) ────────────────────────────────────────────────────────
  {
    type: 'settings',
    title: 'SETTINGS.EXE', label: 'SETTINGS',
    icon: 'settings', iconColor: '#d3d4d5',
    width: 440, height: 360,
    phoneBg: 'linear-gradient(145deg,#303848,#505868)',
    spotlightDesc: 'System configuration',
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
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
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'L2', desktopRow: 1,
  },
  {
    type: 'paint',
    title: 'PAINT.EXE', label: 'PAINT',
    icon: 'brush', iconColor: '#ff71ce',
    width: 620, height: 520,
    phoneBg: 'linear-gradient(145deg,#701890,#a040c0)',
    spotlightDesc: 'Pixel art drawing app',
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'L2', desktopRow: 2,
  },
  // ── Right col (R) ──────────────────────────────────────────────────────────
  {
    type: 'devfiles',
    title: 'DEV_PROJECTS.EXE', label: 'DEV PROJECTS', phoneLabel: 'DEV',
    icon: 'folder_code', iconColor: '#ff8c42',
    width: 520, height: 360,
    phoneBg: 'linear-gradient(145deg,#c05018,#e07030)',
    spotlightDesc: 'Software projects',
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
    showOnDesktop: true, showOnPhone: true, phoneInline: true,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'R', desktopRow: 2,
  },
  {
    type: 'snowboard',
    title: 'PIXEL SNOWBOARD', label: 'SNOWBOARD', phoneLabel: 'SKI',
    icon: 'downhill_skiing', iconColor: '#00ffff',
    width: 510, height: 510,
    phoneBg: 'linear-gradient(145deg,#0a5020,#1a8040)',
    spotlightDesc: 'Endless downhill run',
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: false,
    desktopCol: 'R', desktopRow: 3,
  },
  {
    type: 'snake',
    title: 'SNAKE.EXE', label: 'SNAKE',
    icon: '🐍', iconColor: '#00fd00',
    width: 444, height: 450,
    phoneBg: 'linear-gradient(145deg,#0a4020,#188040)',
    spotlightDesc: 'Classic snake game',
    showOnDesktop: true, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: true,
    desktopCol: 'R', desktopRow: 4,
  },
  // ── System — no desktop icon ────────────────────────────────────────────────
  {
    type: 'sysinfo',
    title: 'SYSINFO.EXE', label: 'SYSINFO',
    icon: 'memory', iconColor: '#4a6080',
    width: 500, height: 440,
    phoneBg: 'linear-gradient(145deg,#141c28,#202c3e)',
    spotlightDesc: 'System information',
    showOnDesktop: false, showOnPhone: true, phoneInline: false,
    showInSpotlight: true, showInContextMenu: false,
  },
  // ── Internal — never shown in UI lists ─────────────────────────────────────
  {
    type: 'projectdetail',
    title: 'PROJECT.EXE', label: 'PROJECT',
    icon: 'description', iconColor: '#ffffff',
    width: 580, height: 460,
    phoneBg: '',
    spotlightDesc: '',
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
    showOnDesktop: false, showOnPhone: false, phoneInline: false,
    showInSpotlight: false, showInContextMenu: false,
  },
]

/** Lookup by type — returns undefined for unknown types */
export function getAppMeta(type: WindowType): AppMeta | undefined {
  return APP_META.find(a => a.type === type)
}
