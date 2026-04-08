import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'cybercore' | 'vaporwave' | 'matrix' | 'amber'
export type AnimatedWallpaper = 'synthwave' | 'grid' | 'stars' | 'scanlines'
export type Wallpaper = AnimatedWallpaper | 'solid' | 'photo'
  | 'preset-aurora' | 'preset-sunset' | 'preset-ocean'
  | 'preset-rice' | 'preset-dawn' | 'preset-istanbul'
  | 'preset-lizard' | 'preset-highland' | 'preset-jaguar'
export type CursorStyle = 'cyberwave' | 'pixel' | 'box'
export type ViewMode = 'desktop' | 'phone' | 'terminal'
export type UiMode = 'dark' | 'light' | 'darker'

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
  solid: 'SOLID COLOR',
  photo: 'CUSTOM PHOTO',
  'preset-aurora':    'AURORA',
  'preset-sunset':    'SUNSET',
  'preset-ocean':     'OCEAN DEEP',
  'preset-rice':      'RICE FIELD',
  'preset-dawn':      'DAWN PEAKS',
  'preset-istanbul':  'ISTANBUL',
  'preset-lizard':    'LIZARD',
  'preset-highland':  'HIGHLAND',
  'preset-jaguar':    'JAGUAR',
}

export const ANIMATED_WALLPAPERS: AnimatedWallpaper[] = ['synthwave', 'grid', 'stars', 'scanlines']

export const SOLID_COLORS: { name: string; hex: string }[] = [
  { name: 'ABYSS',    hex: '#020812' },
  { name: 'CHARCOAL', hex: '#1a1a1a' },
  { name: 'NAVY',     hex: '#0d1b2a' },
  { name: 'COBALT',   hex: '#0a0a2e' },
  { name: 'VOID',     hex: '#000000' },
  { name: 'SLATE',    hex: '#1e2a3a' },
  { name: 'WHITE',    hex: '#f5f5f5' },
  { name: 'BONE',     hex: '#e8e0d4' },
]

interface SystemStore {
  volume: number
  brightness: number
  theme: Theme
  wallpaper: Wallpaper
  wallpaperColor: string
  wallpaperPhoto: string     // base64 data URL for custom upload
  cursorStyle: CursorStyle
  viewMode: ViewMode
  uiMode: UiMode
  settingsInitTab: string    // non-empty string → navigate settings to that tab on next open
  setVolume: (v: number) => void
  setBrightness: (v: number) => void
  setTheme: (t: Theme) => void
  setWallpaper: (w: Wallpaper) => void
  setWallpaperColor: (c: string) => void
  setWallpaperPhoto: (url: string) => void
  setCursorStyle: (c: CursorStyle) => void
  setViewMode: (v: ViewMode) => void
  setUiMode: (m: UiMode) => void
  setSettingsInitTab: (tab: string) => void
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      volume: 70,
      brightness: 100,
      theme: 'cybercore',
      wallpaper: 'grid',
      wallpaperColor: '#020812',
      wallpaperPhoto: '',
      cursorStyle: 'cyberwave',
      viewMode: 'desktop',
      uiMode: 'dark',
      settingsInitTab: '',
      setVolume: (volume) => set({ volume }),
      setBrightness: (brightness) => set({ brightness }),
      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setWallpaperColor: (wallpaperColor) => set({ wallpaperColor }),
      setWallpaperPhoto: (wallpaperPhoto) => set({ wallpaperPhoto }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setViewMode: (viewMode) => set({ viewMode }),
      setUiMode: (uiMode) => set({ uiMode }),
      setSettingsInitTab: (settingsInitTab) => set({ settingsInitTab }),
    }),
    {
      name: 'lizard-os-system',
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
