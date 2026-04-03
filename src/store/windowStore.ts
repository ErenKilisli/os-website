import { create } from 'zustand'
import { Project } from '@/data/projects'

export type WindowType = 'game' | 'film' | 'swr' | 'about' | 'mail' | 'terminal' | 'settings' | 'devfiles' | 'cinema' | 'arcade' | 'projectdetail' | 'snake' | 'snowboard' | 'paint' | 'music' | 'notepad' | 'calc' | 'sysinfo' | 'browser'

export interface WindowState {
  id: string
  type: WindowType
  title: string
  icon: string        // Material symbol name
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  prevGeometry?: { x: number; y: number; width: number; height: number }
}

export interface IconState {
  id: string
  label: string
  iconName: string    // Material symbol name
  iconColor: string   // hex color
  badgeIcon?: string  // optional smaller icon overlaid on top
  x: number
  y: number
  windowType: WindowType
}

interface Store {
  windows: WindowState[]
  icons: IconState[]
  maxZ: number
  focusedId: string | null
  selectedIconId: string | null
  currentProject: Project | null
  openWindow: (type: WindowType) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  updateWindowPos: (id: string, x: number, y: number) => void
  updateIconPos: (id: string, x: number, y: number) => void
  openProjectDetail: (project: Project) => void
  resetIconPositions: () => void
  selectIcon: (id: string | null) => void
}

const WINDOW_CONFIGS: Record<WindowType, { title: string; icon: string; width: number; height: number }> = {
  game:     { title: 'GAMES.EXE',      icon: 'sports_esports', width: 500, height: 340 },
  film:     { title: 'FILMS.EXE',      icon: 'movie',          width: 600, height: 440 },
  swr:      { title: 'SOFTWARE.EXE',   icon: 'folder',         width: 520, height: 360 },
  about:    { title: 'ABOUTME.DOC',    icon: 'description',    width: 820, height: 640 },
  mail:     { title: 'MAIL.EXE',       icon: 'mail',           width: 640, height: 460 },
  terminal: { title: 'TERMINAL.EXE',   icon: 'terminal',       width: 560, height: 380 },
  settings: { title: 'SETTINGS.EXE',   icon: 'settings',       width: 440, height: 360 },
  devfiles:      { title: 'DEV_PROJECTS.EXE',  icon: 'folder',      width: 520, height: 360 },
  cinema:        { title: 'FILM_PROJECTS.EXE', icon: 'folder',      width: 600, height: 440 },
  arcade:        { title: 'GAME_PROJECTS.EXE', icon: 'folder',      width: 500, height: 340 },
  projectdetail: { title: 'PROJECT.EXE',       icon: 'description', width: 580, height: 460 },
  snake:         { title: 'SNAKE.EXE',          icon: 'sports_esports', width: 444, height: 450 },
  snowboard:     { title: 'SNOWBOARD.EXE',      icon: 'downhill_skiing', width: 510, height: 510 },
  paint:         { title: 'PAINT',              icon: 'brush',           width: 620, height: 520 },
  music:         { title: 'MUSIC',              icon: 'music_note',      width: 380, height: 440 },
  notepad:       { title: 'NOTEPAD',            icon: 'edit_note',       width: 520, height: 420 },
  calc:          { title: 'CALC',               icon: 'calculate',       width: 280, height: 420 },
  sysinfo:       { title: 'SYSINFO',            icon: 'memory',          width: 500, height: 440 },
  browser:       { title: 'BROWSER',            icon: 'public',          width: 860, height: 580 },
}

function makeIcons(): IconState[] {
  const sw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const r1 = sw - 100   // rightmost column (projects)
  const r2 = sw - 220   // second-from-right (games)
  const L1 = 16        // left col
  const L2 = 110       // second col
  const Y  = (n: number) => 16 + n * 100
  return [
    // Left col: about, contact, notepad, music, calc, terminal
    { id: 'ico-about',    label: 'ABOUTME.DOC',   iconName: 'account_circle', iconColor: '#ffffff', x: L1, y: Y(0), windowType: 'about'    },
    { id: 'ico-mail',     label: 'CONTACT',       iconName: 'mail',           iconColor: '#9097ff', x: L1, y: Y(1), windowType: 'mail'     },
    { id: 'ico-notepad',  label: 'NOTEPAD',       iconName: 'edit_note',      iconColor: '#ffffff', x: L1, y: Y(2), windowType: 'notepad'  },
    { id: 'ico-music',    label: 'MUSIC',         iconName: 'music_note',     iconColor: '#ff71ce', x: L1, y: Y(3), windowType: 'music'    },
    { id: 'ico-calc',     label: 'CALC',          iconName: 'calculate',      iconColor: '#00ffff', x: L1, y: Y(4), windowType: 'calc'     },
    { id: 'ico-terminal', label: 'TERMINAL',      iconName: 'terminal',       iconColor: '#00fd00', x: L1, y: Y(5), windowType: 'terminal' },
    // Second col: settings, browser, paint
    { id: 'ico-settings', label: 'SETTINGS',      iconName: 'settings',       iconColor: '#d3d4d5', x: L2, y: Y(0), windowType: 'settings' },
    { id: 'ico-browser',  label: 'BROWSER',       iconName: 'public',         iconColor: '#00ffff', x: L2, y: Y(1), windowType: 'browser'  },
    { id: 'ico-paint',    label: 'PAINT',         iconName: 'brush',          iconColor: '#ff71ce', x: L2, y: Y(2), windowType: 'paint'    },
    // Right col: dev, film, game, snowboard, snake (trash is decoration below)
    { id: 'ico-devfiles',  label: 'DEV PROJECTS',  iconName: 'folder_code',    iconColor: '#ff8c42', x: r1, y: Y(0), windowType: 'devfiles'  },
    { id: 'ico-film',      label: 'FILM PROJECTS', iconName: 'movie',          iconColor: '#eaea00', x: r1, y: Y(1), windowType: 'film'      },
    { id: 'ico-game',      label: 'GAME PROJECTS', iconName: 'sports_esports', iconColor: '#00fd00', x: r1, y: Y(2), windowType: 'game'      },
    { id: 'ico-snowboard', label: 'SNOWBOARD.EXE', iconName: 'downhill_skiing',iconColor: '#00ffff', x: r1, y: Y(3), windowType: 'snowboard' },
    { id: 'ico-snake',     label: 'SNAKE.EXE',     iconName: 'sports_esports', iconColor: '#00fd00', x: r1, y: Y(4), windowType: 'snake'     },
  ]
}

const INITIAL_ICONS = makeIcons()

let zCounter = 100

export const useWindowStore = create<Store>((set, get) => ({
  windows: [],
  icons: INITIAL_ICONS,
  maxZ: 100,
  focusedId: null,
  selectedIconId: null,
  currentProject: null,
  selectIcon: (id) => set({ selectedIconId: id }),

  openProjectDetail: (project) => {
    const existing = get().windows.find(w => w.type === 'projectdetail')
    if (existing) {
      zCounter++
      set(s => ({
        maxZ: zCounter,
        focusedId: existing.id,
        currentProject: project,
        windows: s.windows.map(w => w.id === existing.id ? { ...w, zIndex: zCounter, title: project.name + '.EXE', isMinimized: false } : w),
      }))
      return
    }
    const cfg = WINDOW_CONFIGS['projectdetail']
    const offset = get().windows.length
    const id = `win-projectdetail-${Date.now()}`
    zCounter++
    set(s => ({
      maxZ: zCounter,
      focusedId: id,
      currentProject: project,
      windows: [...s.windows, {
        id, type: 'projectdetail', title: project.name + '.EXE', icon: cfg.icon,
        x: 160 + offset * 30, y: 80 + offset * 30,
        width: cfg.width, height: cfg.height,
        zIndex: zCounter, isMinimized: false, isMaximized: false,
      }],
    }))
  },

  openWindow: (type) => {
    const existing = get().windows.find(w => w.type === type)
    if (existing) { get().focusWindow(existing.id); return }
    const cfg = WINDOW_CONFIGS[type]
    const offset = get().windows.length
    const id = `win-${type}-${Date.now()}`
    zCounter++
    set(s => ({
      maxZ: zCounter,
      focusedId: id,
      windows: [...s.windows, {
        id, type, title: cfg.title, icon: cfg.icon,
        x: 130 + offset * 30, y: 50 + offset * 30,
        width: cfg.width, height: cfg.height,
        zIndex: zCounter, isMinimized: false, isMaximized: false,
      }],
    }))
  },

  closeWindow: (id) => set(s => ({
    windows: s.windows.filter(w => w.id !== id),
    focusedId: s.focusedId === id ? null : s.focusedId,
  })),

  focusWindow: (id) => {
    zCounter++
    set(s => ({
      maxZ: zCounter,
      focusedId: id,
      windows: s.windows.map(w => ({
        ...w,
        zIndex: w.id === id ? zCounter : w.zIndex,
        isMinimized: w.id === id ? false : w.isMinimized,
      })),
    }))
  },

  minimizeWindow: (id) => set(s => ({
    windows: s.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    focusedId: s.focusedId === id ? null : s.focusedId,
  })),

  maximizeWindow: (id) => {
    const iw = typeof window !== 'undefined' ? window.innerWidth : 1280
    const ih = typeof window !== 'undefined' ? window.innerHeight : 720
    set(s => ({
      windows: s.windows.map(w => {
        if (w.id !== id) return w
        if (w.isMaximized) {
          return { ...w, isMaximized: false, ...(w.prevGeometry ?? {}) }
        }
        return {
          ...w, isMaximized: true,
          prevGeometry: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0, y: 0, width: iw, height: ih - 40,
        }
      }),
    }))
  },

  updateWindowPos: (id, x, y) => set(s => ({
    windows: s.windows.map(w => w.id === id ? { ...w, x, y } : w),
  })),

  updateIconPos: (id, x, y) => set(s => ({
    icons: s.icons.map(ico => ico.id === id ? { ...ico, x, y } : ico),
  })),

  resetIconPositions: () => set({ icons: makeIcons() }),
}))
