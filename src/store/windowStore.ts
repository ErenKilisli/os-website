import { create } from 'zustand'
import { Project } from '@/data/projects'
import { APP_META, type AppMeta } from '@/config/appMeta'

// Re-export WindowType so existing imports from this file still work
export type { WindowType } from '@/config/appMeta'

export interface WindowState {
  id: string
  type: import('@/config/appMeta').WindowType
  title: string
  icon: string        // Material symbol name (or emoji)
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
  iconName: string    // Material symbol name (or emoji)
  iconColor: string
  x: number
  y: number
  windowType: import('@/config/appMeta').WindowType
}

interface Store {
  windows: WindowState[]
  icons: IconState[]
  maxZ: number
  focusedId: string | null
  selectedIconId: string | null
  currentProject: Project | null
  openWindow: (type: import('@/config/appMeta').WindowType) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  updateWindowPos: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  updateIconPos: (id: string, x: number, y: number) => void
  openProjectDetail: (project: Project) => void
  resetIconPositions: () => void
  selectIcon: (id: string | null) => void
}

// Derived from APP_META — single source of truth
const WINDOW_CONFIGS = Object.fromEntries(
  APP_META.map((a: AppMeta) => [a.type, { title: a.title, icon: a.icon, width: a.width, height: a.height }])
) as Record<string, { title: string; icon: string; width: number; height: number }>

function makeIcons(): IconState[] {
  const sw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const COL = { L1: 16, L2: 110, R: sw - 100 }
  const Y   = (row: number) => 16 + row * 100

  return APP_META
    .filter((a: AppMeta) => a.showOnDesktop && a.desktopCol != null)
    .map((a: AppMeta) => ({
      id: `ico-${a.type}`,
      label: a.label,
      iconName: a.icon,
      iconColor: a.iconColor,
      x: COL[a.desktopCol!],
      y: Y(a.desktopRow ?? 0),
      windowType: a.type,
    }))
}

let zCounter = 100

export const useWindowStore = create<Store>((set, get) => ({
  windows: [],
  icons: makeIcons(),
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
        windows: s.windows.map(w =>
          w.id === existing.id
            ? { ...w, zIndex: zCounter, title: project.name + '.EXE', isMinimized: false }
            : w
        ),
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
    if (!cfg) return
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

  updateWindowSize: (id, width, height) => set(s => ({
    windows: s.windows.map(w => w.id === id ? { ...w, width, height } : w),
  })),

  updateIconPos: (id, x, y) => set(s => ({
    icons: s.icons.map(ico => ico.id === id ? { ...ico, x, y } : ico),
  })),

  resetIconPositions: () => set({ icons: makeIcons() }),
}))
