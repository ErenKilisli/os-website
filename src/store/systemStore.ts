import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'cybercore' | 'vaporwave' | 'matrix' | 'amber'
export type Wallpaper = 'bliss' | 'grid' | 'stars' | 'scanlines'

export const THEME_LABELS: Record<Theme, string> = {
  cybercore: 'CYBERCORE',
  vaporwave: 'VAPORWAVE',
  matrix: 'MATRIX',
  amber: 'AMBER',
}

export const WALLPAPER_LABELS: Record<Wallpaper, string> = {
  bliss: 'PIXEL BLISS',
  grid: 'GRID',
  stars: 'STARS',
  scanlines: 'SCANLINES',
}

interface SystemStore {
  volume: number       // 0–100
  brightness: number   // 20–100
  theme: Theme
  wallpaper: Wallpaper
  setVolume: (v: number) => void
  setBrightness: (v: number) => void
  setTheme: (t: Theme) => void
  setWallpaper: (w: Wallpaper) => void
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      volume: 70,
      brightness: 100,
      theme: 'cybercore',
      wallpaper: 'bliss',
      setVolume: (volume) => set({ volume }),
      setBrightness: (brightness) => set({ brightness }),
      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
    }),
    { name: 'eren-os-system' }
  )
)
