import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'cybercore' | 'vaporwave' | 'matrix' | 'amber'
export type Wallpaper = 'synthwave' | 'grid' | 'stars' | 'scanlines'
export type CursorStyle = 'cyberwave' | 'pixel' | 'box'
export type ViewMode = 'desktop' | 'phone' | 'terminal'

export const CURSOR_LABELS: Record<CursorStyle, string> = {
  cyberwave: 'CYBERWAVE',
  pixel: 'PIXEL BLACK',
  box: 'BOX',
}

export const THEME_LABELS: Record<Theme, string> = {
  cybercore: 'CYBERCORE',
  vaporwave: 'VAPORWAVE',
  matrix: 'MATRIX',
  amber: 'AMBER',
}

export const WALLPAPER_LABELS: Record<Wallpaper, string> = {
  synthwave: 'SYNTHWAVE',
  grid: 'GRID',
  stars: 'STARS',
  scanlines: 'SCANLINES',
}

interface SystemStore {
  volume: number       // 0–100
  brightness: number   // 20–100
  theme: Theme
  wallpaper: Wallpaper
  cursorStyle: CursorStyle
  viewMode: ViewMode
  setVolume: (v: number) => void
  setBrightness: (v: number) => void
  setTheme: (t: Theme) => void
  setWallpaper: (w: Wallpaper) => void
  setCursorStyle: (c: CursorStyle) => void
  setViewMode: (v: ViewMode) => void
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      volume: 70,
      brightness: 100,
      theme: 'cybercore',
      wallpaper: 'synthwave',
      cursorStyle: 'cyberwave',
      viewMode: 'desktop',
      setVolume: (volume) => set({ volume }),
      setBrightness: (brightness) => set({ brightness }),
      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: 'eren-os-system',
      // Migrate old 'bliss' value to 'synthwave'
      onRehydrateStorage: () => (state) => {
        if (state && (state.wallpaper as string) === 'bliss') {
          state.wallpaper = 'synthwave'
        }
        if (state && state.brightness < 20) {
          state.brightness = 20
        }
      },
    }
  )
)
