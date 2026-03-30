import { create } from 'zustand'

export type WindowType = 'game' | 'film' | 'swr' | 'about' | 'mail'

export interface WindowState {
  id: string
  type: WindowType
  title: string
  icon: string
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
  emoji: string
  x: number
  y: number
  windowType: WindowType
}

interface Store {
  windows: WindowState[]
  icons: IconState[]
  maxZ: number
  focusedId: string | null
  openWindow: (type: WindowType) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  updateWindowPos: (id: string, x: number, y: number) => void
  updateIconPos: (id: string, x: number, y: number) => void
}

const WINDOW_CONFIGS: Record<WindowType, { title: string; icon: string; width: number; height: number }> = {
  game:  { title: 'Games',     icon: '🎮', width: 500, height: 340 },
  film:  { title: 'Film',      icon: '🎬', width: 500, height: 320 },
  swr:   { title: 'Code',      icon: '💾', width: 520, height: 360 },
  about: { title: 'Profile',   icon: '👤', width: 460, height: 400 },
  mail:  { title: 'Mail',      icon: '📧', width: 640, height: 460 },
}

const INITIAL_ICONS: IconState[] = [
  { id: 'ico-about', label: 'Profile\nuser.prf',  emoji: '👤', x: 20, y: 20,  windowType: 'about' },
  { id: 'ico-mail',  label: 'Mail\ninbox.msg',    emoji: '📧', x: 20, y: 114, windowType: 'mail'  },
  { id: 'ico-game',  label: 'Games\ngames.fld',   emoji: '🎮', x: 20, y: 208, windowType: 'game'  },
  { id: 'ico-film',  label: 'Film\nfilm.fld',     emoji: '🎬', x: 20, y: 302, windowType: 'film'  },
  { id: 'ico-swr',   label: 'Code\ncode.fld',     emoji: '💾', x: 20, y: 396, windowType: 'swr'   },
]

let zCounter = 100

export const useWindowStore = create<Store>((set, get) => ({
  windows: [],
  icons: INITIAL_ICONS,
  maxZ: 100,
  focusedId: null,

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
        x: 130 + offset * 28, y: 60 + offset * 28,
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
          x: 0, y: 0, width: iw, height: ih - 44,
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
