# EREN.OS — Ibrahim Eren Kilisli's Portfolio

> A personal portfolio built as a fictional operating system — **CYBERCORE WIN95 PIXEL ART DESKTOP**

---

## Concept

The site is presented as **LIZARD.OS**: a draggable-window desktop environment inspired by Windows 95 aesthetics fused with cyberpunk/cybercore design. Users interact with desktop icons, open windows, play mini-games, and browse projects — all within an animated OS shell.

---

## Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Framework  | **Next.js 15** (App Router)     |
| Language   | **TypeScript**                  |
| Styling    | **Tailwind CSS v4**             |
| Animation  | **Framer Motion**               |
| State      | **Zustand** (with persist)      |
| Canvas     | **HTML5 Canvas API** (games, wallpapers) |
| Fonts      | **Press Start 2P** + **VT323** (pixel font duo) |
| Deploy     | **Vercel**                      |

---

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Entry → renders <Desktop />
│   └── globals.css         # Full design system (CSS vars, win95, uiMode, paint, games)
│
├── store/
│   ├── windowStore.ts      # Zustand: window positions, z-index, open/close/minimize/maximize
│   └── systemStore.ts      # Zustand: theme, wallpaper, brightness, volume, uiMode, cursor
│
├── components/
│   ├── desktop/
│   │   ├── Desktop.tsx           # Main desktop shell (phases: boot → login → desktop)
│   │   ├── DesktopWallpaper.tsx  # Canvas animated wallpapers (synthwave/grid/stars/scanlines/solid/photo/presets)
│   │   ├── DesktopIcon.tsx       # Draggable icons (rainbow Paint icon included)
│   │   ├── DesktopContextMenu.tsx # Right-click menu (wallpaper quick-switch + open apps)
│   │   ├── Taskbar.tsx           # Bottom taskbar, start menu, clock, system tray
│   │   ├── PixelIcons.tsx        # Pixel-art SVG icons (gear, folder, mail, terminal…)
│   │   ├── FolderIcons.tsx       # Folder/snowboard pixel icons
│   │   ├── BootScreen.tsx        # Animated boot sequence
│   │   ├── LoginScreen.tsx       # Login screen
│   │   ├── ShutdownScreen.tsx    # Shutdown/restart animation
│   │   ├── Spotlight.tsx         # Cmd+K search overlay
│   │   ├── CustomCursor.tsx      # Custom cursor (cyberwave / pixel / box)
│   │   ├── SoundManager.tsx      # Audio management
│   │   ├── PhoneView.tsx         # Phone viewport overlay
│   │   └── TerminalMode.tsx      # Full-screen terminal overlay
│   │
│   └── windows/
│       ├── Window.tsx            # Reusable window wrapper (drag, resize, min/max)
│       ├── PaintWindow.tsx       # PAINT.EXE — pixel art paint app with 6 tools + palette
│       ├── SnakeWindow.tsx       # SNAKE.EXE — classic snake game (responsive canvas)
│       ├── SnowboardWindow.tsx   # PIXEL SNOWBOARD — avoid trees/bears/rocks, white snow bg
│       ├── SettingsWindow.tsx    # SETTINGS.EXE — Display/Wallpaper/Appearance/Sound/Network tabs
│       ├── AboutWindow.tsx       # Bio, skills, tags
│       ├── MailWindow.tsx        # Contact form
│       ├── TerminalWindow.tsx    # Terminal emulator
│       ├── FileBrowserWindow.tsx # File browser for projects
│       ├── ProjectDetailWindow.tsx
│       ├── MusicWindow.tsx
│       ├── NotePadWindow.tsx
│       ├── CalcWindow.tsx
│       ├── SysInfoWindow.tsx
│       └── BrowserWindow.tsx
```

---

## Features

### Desktop OS Shell
- **Boot → Login → Desktop** phase system with animations
- **Draggable windows** with titlebar drag, resize handles, minimize/maximize/close
- **Draggable desktop icons** — double-click to open
- **Right-click context menu** — quick wallpaper switch + "Change Wallpaper..." opens Settings
- **Taskbar** with Start menu, window previews on hover, clock, system tray
- **Spotlight search** (Ctrl+K / Cmd+K)

### Wallpaper System
| Type | Options |
|------|---------|
| Animated | Synthwave (retro grid), Grid (dot wave), Stars (shooting stars), Scanlines (CRT) |
| Preset photos | Aurora Borealis, Sunset City, Ocean Deep |
| Solid colors | 8 presets + custom color picker |
| Custom upload | Upload any image from your device |

Right-click desktop → **CHANGE WALLPAPER...** → opens Settings > Wallpaper tab.

### Settings Window
- **Display**: view mode, brightness, theme (4 themes), cursor style
- **Wallpaper**: animated / solid color / preset photos / custom upload
- **Appearance**: Light mode (white panels) / Dark mode (dark gray panels)
- **Sound**: master volume
- **Network**: connection info (decorative)
- **SysInfo**: hardware + tech stack info
- **About**: version info

### Themes (4)
`CYBERCORE` (cyan) · `VAPORWAVE` (pink) · `MATRIX` (green) · `AMBER` (orange)

### UI Modes
- **Dark mode**: classic Win95 gray (#d3d4d5) window chrome
- **Light mode**: white window chrome — applies to all panels, menus, titlebars

### Games

#### PIXEL SNOWBOARD
- **Full white snow background** with animated mountain silhouettes at top
- Obstacles: pixel-art trees 🌲, redesigned bears 🐻 (2-frame roar animation), rocks
- **Lean animations**: hold ←/→ to lean, release → snaps back to straight
- **Visible dark blue ski trail** on white snow
- Increasing speed over distance
- **Responsive canvas** — scales to fill the window when resized

#### SNAKE.EXE
- Classic snake on a dark grid, green pixel snake, pulsing red food
- **Responsive canvas** — scales to fill the window when resized
- WASD or arrow keys

### Paint App (PAINT.EXE)
- Tools: pencil, eraser, flood fill, line, rectangle, ellipse
- 20-color palette + custom color picker
- **Rainbow gradient brush icon** on desktop
- Save as PNG

---

## Design System

### Color Palette (Cybercore theme)
```
#020812  desktop background (near-black)
#00ffff  primary cyan accent
#0055ff  cobalt blue
#eaea00  yellow accent
#d3d4d5  win95 gray (window chrome, dark mode)
#ffffff  white (window chrome, light mode)
```

### Fonts
- `Press Start 2P` → UI chrome, HUD, titles (8px pixel font)
- `VT323` → window content / terminal body text (16-18px)
- `Space Grotesk` → settings labels, menus
- `Public Sans` → body text

### Win95 Bevel Border
All windows use the classic 3D bevel:
```css
box-shadow: inset 1.5px 1.5px 0px #ffffff, inset -1.5px -1.5px 0px #808080, 2px 2px 0px #000000;
```

---

## State Management (Zustand)

### windowStore
Tracks all windows: position, size, z-index, minimized/maximized state.
Desktop icons: draggable positions.

### systemStore
| Field | Type | Description |
|-------|------|-------------|
| `theme` | `'cybercore'\|'vaporwave'\|'matrix'\|'amber'` | Color theme |
| `wallpaper` | `Wallpaper` | Active wallpaper (animated/solid/photo/preset) |
| `wallpaperColor` | `string` | Hex color for solid wallpaper |
| `wallpaperPhoto` | `string` | Base64 data URL for custom photo |
| `uiMode` | `'dark'\|'light'` | Window chrome dark/light mode |
| `brightness` | `number` | 20–100, screen dimming overlay |
| `volume` | `number` | 0–100 |
| `cursorStyle` | `'cyberwave'\|'pixel'\|'box'` | Custom cursor |
| `viewMode` | `'desktop'\|'phone'\|'terminal'` | Viewport overlay mode |
| `settingsInitTab` | `string` | Tabs settings window opens to |

All state persisted to `localStorage` via Zustand `persist` middleware.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open Spotlight search |
| `Escape` | Close context menus / Spotlight |
| `←` `→` / `A` `D` | Snowboard steer |
| `Space` / `Enter` | Snowboard start/restart |
| `Arrow keys` / `WASD` | Snake direction |

---

## Roadmap

- [x] Boot → Login → Desktop phase system
- [x] Draggable windows & icons
- [x] Animated wallpapers (4 types)
- [x] Wallpaper: solid colors + preset photos + custom upload
- [x] Settings: Display / Wallpaper / Appearance / Sound tabs
- [x] Light mode / Dark mode (window chrome)
- [x] PIXEL SNOWBOARD game — white snow, bear animations, trail, responsive
- [x] SNAKE.EXE — responsive canvas
- [x] PAINT.EXE — rainbow brush icon
- [x] 4 themes (cybercore / vaporwave / matrix / amber)
- [ ] Mobile touch controls for games
- [ ] More preset wallpaper photos
- [ ] Project detail pages
- [ ] About section expansion
