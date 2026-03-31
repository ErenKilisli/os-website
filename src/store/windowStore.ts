import { create } from 'zustand'
import { Project } from '@/data/projects'

export type WindowType = 'game' | 'film' | 'swr' | 'about' | 'mail' | 'terminal' | 'settings' | 'devfiles' | 'cinema' | 'arcade' | 'projectdetail'

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
  currentProject: Project | null
  openWindow: (type: WindowType) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  updateWindowPos: (id: string, x: number, y: number) => void
  updateIconPos: (id: string, x: number, y: number) => void
  openProjectDetail: (project: Project) => void
}

const WINDOW_CONFIGS: Record<WindowType, { title: string; icon: string; width: number; height: number }> = {
  game:     { title: 'GAMES.EXE',      icon: 'sports_esports', width: 500, height: 340 },
  film:     { title: 'FILMS.EXE',      icon: 'movie',          width: 600, height: 440 },
  swr:      { title: 'SOFTWARE.EXE',   icon: 'folder',         width: 520, height: 360 },
  about:    { title: 'ABOUT.EXE',      icon: 'account_circle', width: 460, height: 400 },
  mail:     { title: 'MAIL.EXE',       icon: 'mail',           width: 640, height: 460 },
  terminal: { title: 'TERMINAL.EXE',   icon: 'terminal',       width: 560, height: 380 },
  settings: { title: 'SETTINGS.EXE',   icon: 'settings',       width: 440, height: 360 },
  devfiles:      { title: 'DEV_PROJECTS.EXE',  icon: 'folder',      width: 520, height: 360 },
  cinema:        { title: 'FILM_PROJECTS.EXE', icon: 'folder',      width: 600, height: 440 },
  arcade:        { title: 'GAME_PROJECTS.EXE', icon: 'folder',      width: 500, height: 340 },
  projectdetail: { title: 'PROJECT.EXE',       icon: 'description', width: 580, height: 460 },
}

const INITIAL_ICONS: IconState[] = [
  // Left column 1
  { id: 'ico-swr',      label: 'SOFTWARE/CODE', iconName: 'folder',         iconColor: '#9097ff', x: 16,  y: 16,  windowType: 'swr'      },
  { id: 'ico-film',     label: 'FILM PROJECTS', iconName: 'movie',          iconColor: '#eaea00', x: 16,  y: 132, windowType: 'film'     },
  { id: 'ico-terminal', label: 'TERMINAL',      iconName: 'terminal',       iconColor: '#00fd00', x: 16,  y: 248, windowType: 'terminal' },
  { id: 'ico-about',    label: 'ABOUT ME',      iconName: 'account_circle', iconColor: '#ffffff', x: 16,  y: 364, windowType: 'about'    },
  { id: 'ico-mail',     label: 'CONTACT',       iconName: 'mail',           iconColor: '#9097ff', x: 16,  y: 480, windowType: 'mail'     },
  { id: 'ico-settings', label: 'SETTINGS',      iconName: 'settings',       iconColor: '#d3d4d5', x: 16,  y: 596, windowType: 'settings' },
  // Left column 2
  { id: 'ico-game',     label: 'GAME PROJECTS', iconName: 'sports_esports', iconColor: '#00fd00', x: 144, y: 16,  windowType: 'game'     },
  // Right side
  { id: 'ico-devfiles', label: 'DEV PROJECTS',  iconName: 'folder_code',    iconColor: '#ff8c42', x: 900, y: 16,  windowType: 'devfiles' },
  { id: 'ico-cinema',   label: 'FILM PROJECTS', iconName: 'folder',         iconColor: '#ff4d6d', x: 900, y: 132, windowType: 'cinema'   },
  { id: 'ico-arcade',   label: 'GAME PROJECTS', iconName: 'folder',         iconColor: '#cc44ff', x: 900, y: 248, windowType: 'arcade'   },
]

let zCounter = 100

export const useWindowStore = create<Store>((set, get) => ({
  windows: [],
  icons: INITIAL_ICONS,
  maxZ: 100,
  focusedId: null,
  currentProject: null,

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
}))
