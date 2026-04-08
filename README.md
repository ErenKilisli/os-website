# 🖥️ LIZARD.OS — Ibrahim Eren Kilisli's Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?style=for-the-badge&logo=framer)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

**A personal portfolio presented as a fully interactive fictional operating system.**

[Live Demo →](https://himerenkilisli.com) · [Report Bug](https://github.com/ErenKilisli/os-website/issues) · [Request Feature](https://github.com/ErenKilisli/os-website/issues)

</div>

---

## ✨ What is LIZARD.OS?

LIZARD.OS is an open-source portfolio website built to look and feel like **a real operating system** — inspired by Windows 95 aesthetics fused with cyberpunk / cybercore design. Visitors interact with draggable windows, desktop icons, mini-games, a terminal emulator, a music player, a pixel art canvas, and more — all rendered entirely in the browser with Next.js and Framer Motion.

> This project is **100% open source** under the MIT license. Contributions, forks, and PRs are warmly welcomed. Build your own OS-themed portfolio on top of it!

---

## 🚀 Feature Overview

| Category | Features |
|---|---|
| **OS Shell** | Boot screen → Login → Desktop phase system |
| **Windows** | Draggable, resizable, minimize / maximize / close |
| **Icons** | Freely draggable desktop icons, double-click to open |
| **Context Menu** | Right-click desktop for quick actions & wallpaper switch |
| **Taskbar** | Start menu, window previews, clock, system tray |
| **Spotlight** | `Ctrl+K` / `Cmd+K` instant app search |
| **Phone Mode** | Auto-switches on `<768px` with phone boot screen & home grid |
| **Terminal Mode** | Full-screen terminal overlay |
| **CRT Effects** | Scanlines + vignette overlay on desktop |
| **Themes** | 4 color themes (Cybercore, Vaporwave, Matrix, Amber) |
| **Cursors** | 3 custom cursor styles |
| **Wallpapers** | 4 animated + 3 preset scenes + solid colors + custom upload |
| **App Market** | Install / uninstall optional apps with loading animation |
| **Games** | Snake, Pixel Snowboard (built-in canvas games) |
| **Mini-Apps** | Paint, Notepad, Calculator, Music Player, Browser |
| **Projects** | Game dev, film, software projects with detail views |
| **Contact** | Contact form powered by Resend API |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS v4** |
| Animation | **Framer Motion 12** |
| State | **Zustand** (with `persist` middleware → localStorage) |
| Canvas | **HTML5 Canvas API** (games, animated wallpapers) |
| Email | **Resend API** (contact form) |
| Fonts | **Press Start 2P** + **VT323** (pixel font duo) |
| Deployment | **Vercel** |

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/ErenKilisli/os-website.git
cd os-website

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your RESEND_API_KEY for the contact form
```

### Development

```bash
npm run dev     # Start dev server → http://localhost:3000
npm run build   # Production build
npm run lint    # Run ESLint
```

---

## 🗂️ Architecture

```
src/
├── app/
│   ├── layout.tsx            # Root layout — fonts, full SEO metadata, JSON-LD
│   ├── page.tsx              # Entry point → renders <Desktop />
│   ├── globals.css           # Full design system (CSS vars, win95, themes, paint, games)
│   ├── robots.ts             # Next.js robots.txt
│   ├── sitemap.ts            # Next.js sitemap.xml
│   └── api/
│       └── contact/
│           └── route.ts      # Resend API route (contact form)
│
├── store/
│   ├── windowStore.ts        # Zustand: window positions, z-index, open/close/minimize/maximize
│   └── systemStore.ts        # Zustand: theme, wallpaper, brightness, volume, uiMode, cursor
│
├── components/
│   ├── desktop/
│   │   ├── Desktop.tsx             # Main desktop shell (phases: boot → login → desktop)
│   │   ├── DesktopWallpaper.tsx    # Canvas animated wallpapers (synthwave/grid/stars/scanlines/solid/photo/presets)
│   │   ├── DesktopIcon.tsx         # Draggable icons (rainbow Paint icon included)
│   │   ├── DesktopContextMenu.tsx  # Right-click menu (wallpaper quick-switch + open apps)
│   │   ├── Taskbar.tsx             # Bottom taskbar, start menu, clock, system tray
│   │   ├── PixelIcons.tsx          # Pixel-art SVG icons (gear, folder, mail, terminal…)
│   │   ├── FolderIcons.tsx         # Folder/snowboard pixel icons
│   │   ├── BootScreen.tsx          # Animated boot sequence
│   │   ├── LoginScreen.tsx         # Login screen (ENTER only, no password)
│   │   ├── ShutdownScreen.tsx      # Shutdown/restart animation
│   │   ├── Spotlight.tsx           # Ctrl+K / Cmd+K search overlay
│   │   ├── CustomCursor.tsx        # Custom cursor (cyberwave / pixel / box)
│   │   ├── SoundManager.tsx        # Audio management
│   │   ├── PhoneView.tsx           # Phone viewport overlay
│   │   └── TerminalMode.tsx        # Full-screen terminal overlay
│   │
│   └── windows/
│       ├── Window.tsx              # Reusable window wrapper (drag, resize, min/max/close)
│       ├── AboutWindow.tsx         # ABOUT.EXE — bio, skills, tech tags
│       ├── MailWindow.tsx          # CONTACT.MSG — contact form (Resend)
│       ├── TerminalWindow.tsx      # TERMINAL.EXE — interactive terminal emulator
│       ├── SettingsWindow.tsx      # SETTINGS.EXE — Display/Wallpaper/Appearance/Sound/System tabs
│       ├── FileBrowserWindow.tsx   # File browser for project lists
│       ├── ProjectDetailWindow.tsx # Individual project detail view
│       ├── MusicWindow.tsx         # MUSIC.EXE — music player with visualizer
│       ├── NotePadWindow.tsx       # NOTEPAD.EXE — plain text editor (localStorage)
│       ├── CalcWindow.tsx          # CALC.EXE — calculator (optional, App Market)
│       ├── PaintWindow.tsx         # PAINT.EXE — pixel art canvas (6 tools, 20 colors, save PNG)
│       ├── SnakeWindow.tsx         # SNAKE.EXE — classic snake (responsive canvas)
│       ├── SnowboardWindow.tsx     # SNOWBOARD.EXE — endless pixel snowboard runner
│       └── BrowserWindow.tsx       # BROWSER.EXE — embedded web browser
│
└── registry/
    ├── appMeta.ts              # Single source of truth — all app metadata
    └── appRegistry.tsx         # Auto-wires apps to desktop, phone, spotlight, taskbar, context menu
```

---

## 🖥️ Apps Reference

### Built-in Apps

| App | ID | Description |
|---|---|---|
| ABOUT.EXE | `about` | Bio, skills, tech tags |
| CONTACT.MSG | `mail` | Contact form (Resend API) |
| TERMINAL.EXE | `terminal` | Interactive terminal with custom commands |
| SETTINGS.EXE | `settings` | Display / Wallpaper / Appearance / Sound / System tabs |
| DEV_PROJECTS.EXE | `software` | Software projects: Rezinn, DEUX |
| FILM_PROJECTS.EXE | `film` | Short films, commercials, music videos |
| GAME_PROJECTS.EXE | `game` | Unreal Engine games |
| PAINT.EXE | `paint` | Pixel art canvas (6 tools, 20-color palette, export PNG) |
| SNAKE.EXE | `snake` | Classic snake game |
| SNOWBOARD.EXE | `snowboard` | Endless pixel snowboard runner |
| MUSIC.EXE | `music` | Music player with visualizer |
| NOTEPAD.EXE | `notepad` | Plain text editor (localStorage persist) |

### Optional Apps (via App Market)

| App | ID | Description |
|---|---|---|
| CALC.EXE | `calc` | Calculator |
| BROWSER.EXE | `browser` | Embedded web browser |
| APP MARKET.EXE | `appmarket` | Install / remove optional apps |

---

## 🎨 Wallpaper System

| Type | Options |
|---|---|
| **Animated** | Synthwave (retro grid), Grid (dot wave), Stars (shooting stars), Scanlines (CRT) |
| **Preset Scenes** | Aurora Borealis, Sunset City, Ocean Deep |
| **Solid Colors** | 8 presets + custom color picker |
| **Custom Upload** | Upload any image from your device (stored as base64) |

Right-click desktop → **CHANGE WALLPAPER...** → opens Settings > Wallpaper tab.

---

## 🎮 Games

### SNAKE.EXE
Classic snake on a dark pixel grid. Green snake, pulsing red food. WASD or arrow keys. Responsive canvas — scales to fit the window.

### SNOWBOARD.EXE
Endless pixel snowboard runner on a white snow background with animated mountain silhouettes. Obstacles: pixel trees, 2-frame roar bears, rocks. Hold `←`/`→` to lean. Increasing speed over distance.

---

## 🎨 Design System

### CYBERCORE Palette (default theme)

```
#020812  — desktop background (near-black)
#00ffff  — primary cyan accent
#0055ff  — cobalt blue
#eaea00  — yellow accent
#d3d4d5  — Win95 gray (window chrome, dark mode)
#ffffff  — white (window chrome, light mode)
```

### Themes

| Theme | Accent Color | Vibe |
|---|---|---|
| `CYBERCORE` | Cyan `#00ffff` | Classic |
| `VAPORWAVE` | Pink `#ff00ff` | Retro-future |
| `MATRIX` | Green `#00ff41` | Hacker |
| `AMBER` | Orange `#ffaa00` | Warm CRT |

### Fonts

| Variable | Font | Usage |
|---|---|---|
| `--font-press-start` | Press Start 2P | UI chrome, HUD, titles (8px pixel) |
| `--font-vt323` | VT323 | Window content, terminal body (16–18px) |
| `--font-headline` | Space Grotesk | Settings labels, menus |
| `--font-body` | Public Sans | Body text |

### Win95 Bevel Border

All windows use the classic 3D bevel:

```css
box-shadow:
  inset 1.5px 1.5px 0px #ffffff,
  inset -1.5px -1.5px 0px #808080,
  2px 2px 0px #000000;
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` / `Cmd+K` | Open Spotlight search |
| `Escape` | Close Spotlight / context menus |
| `←` `→` / `A` `D` | Snowboard steer |
| `Space` / `Enter` | Snowboard start / restart |
| `Arrow keys` / `WASD` | Snake direction |
| `Enter` | Login screen (no password required) |

---

## 🗃️ State Management (Zustand)

### windowStore

Tracks all open windows: position, size, z-index, minimized/maximized state.
Also tracks desktop icon draggable positions.

### systemStore

| Field | Type | Description |
|---|---|---|
| `theme` | `'cybercore'\|'vaporwave'\|'matrix'\|'amber'` | Color theme |
| `wallpaper` | `Wallpaper` | Active wallpaper config |
| `wallpaperColor` | `string` | Hex color for solid wallpaper |
| `wallpaperPhoto` | `string` | Base64 data URL for custom photo |
| `uiMode` | `'dark'\|'light'` | Window chrome mode |
| `brightness` | `number` | 20–100, screen dimming overlay |
| `volume` | `number` | 0–100 |
| `cursorStyle` | `'cyberwave'\|'pixel'\|'box'` | Custom cursor style |
| `viewMode` | `'desktop'\|'phone'\|'terminal'` | Viewport overlay mode |
| `settingsInitTab` | `string` | Which tab Settings opens to |

All state is persisted to `localStorage` via Zustand `persist` middleware.

---

## 🔌 App Registry (How to Add a New App)

LIZARD.OS has a single-source-of-truth app registry. Adding a new app takes three steps:

### Step 1 — Register app metadata in `appMeta.ts`

```ts
// src/registry/appMeta.ts
export const MY_APP: AppMeta = {
  id: 'myapp',
  label: 'MYAPP.EXE',
  icon: <MyAppIcon />,         // pixel-art SVG icon
  defaultSize: { width: 500, height: 400 },
  isOptional: false,           // true = only available via App Market
};
```

### Step 2 — Add the window component in `appRegistry.tsx`

```tsx
// src/registry/appRegistry.tsx
case 'myapp':
  return <MyAppWindow />;
```

### Step 3 — Create your window component

```tsx
// src/components/windows/MyAppWindow.tsx
'use client'
export default function MyAppWindow() {
  return <div className="p-4 font-vt323">Hello from MYAPP.EXE!</div>;
}
```

That's it — the app automatically appears in desktop icons, the phone home grid, Spotlight search, the Start menu, the context menu, and the App Market.

---

## 🗺️ Roadmap

### Completed ✅

- [x] Boot → Login → Desktop phase system
- [x] Draggable windows (titlebar drag, resize handles, min/max/close)
- [x] Draggable desktop icons with free positioning
- [x] Right-click context menu (wallpaper + open apps)
- [x] Taskbar with Start menu, window previews, clock, system tray
- [x] Spotlight search (Ctrl+K / Cmd+K)
- [x] Phone / mobile mode (auto-switch `<768px`, phone boot, home grid)
- [x] Terminal mode overlay
- [x] CRT scanlines + vignette overlay
- [x] 4 animated wallpapers (Synthwave, Grid, Stars, Scanlines)
- [x] Wallpaper: solid colors + preset photos + custom upload
- [x] 4 themes (Cybercore, Vaporwave, Matrix, Amber)
- [x] 3 custom cursor styles
- [x] Settings: Display / Wallpaper / Appearance / Sound / System tabs
- [x] Light mode / Dark mode window chrome
- [x] SNAKE.EXE — responsive canvas
- [x] SNOWBOARD.EXE — white snow, bear animations, ski trail, responsive
- [x] PAINT.EXE — 6 tools, 20-color palette, save PNG
- [x] MUSIC.EXE — music player with visualizer
- [x] NOTEPAD.EXE — localStorage persist
- [x] TERMINAL.EXE — interactive terminal emulator
- [x] App Market — install / uninstall optional apps
- [x] App Registry — single source of truth for all app metadata
- [x] Game projects: Damned Ape, Chronobreak, DAA Retro FPS
- [x] Film projects: ÇEMBER, McDonald's, Kaya Giray MV, LIGHT, BLOOD, KRONOS
- [x] Software projects: Rezinn, DEUX
- [x] Contact form (Resend API)
- [x] Full production SEO + JSON-LD structured data
- [x] robots.txt + sitemap.xml

### Planned 🔜

- [ ] Mobile touch controls for Snake and Snowboard
- [ ] More preset wallpaper photos
- [ ] More terminal commands
- [ ] Window snap (drag to edge to snap 50/50)
- [ ] Multi-monitor simulation
- [ ] Save / restore desktop layout
- [ ] Accessibility pass (ARIA, keyboard-only navigation)
- [ ] More languages (Turkish/English toggle in About)
- [ ] More themes
- [ ] Screensaver mode

---

## 🤝 Contributing

Contributions are what make open source great. Any contribution you make is **greatly appreciated**.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'feat: add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Good first issues

- Add a new app window (see the **App Registry** section above — it's very easy)
- Add a new wallpaper type
- Add new terminal commands in `TerminalWindow.tsx`
- Improve mobile / touch controls for games
- Add more pixel-art icons to `PixelIcons.tsx`

---

## 📁 Projects Featured

### 🎮 Game Development

| Project | Engine | Notes |
|---|---|---|
| **DAMNED APE** | Unreal Engine | AI enemies, wall-running, cinematics |
| **CHRONOBREAK** | Unreal Engine + C++ | Steam release |
| **DAA Retro FPS** | Unreal Engine | Retro 2D enemies in 3D space |

### 🎬 Film & Cinematics

| Project | Type | Notes |
|---|---|---|
| **ÇEMBER** | Short Film | IMDB listed |
| **McDonald's Commercial** | Commercial | LAB34 Production |
| **Kaya Giray Music Video** | Music Video | Milk Jack |
| **LIGHT** | Short Film | EU-supported, Hatay earthquake |
| **BLOOD** | Short Film | Semi-Finalist + Honorable Mention, international festivals |
| **KRONOS** | Short Film | International festival circuit |

### 💾 Software

| Project | Description |
|---|---|
| **REZINN** | Istanbul venue discovery & reservation mobile app — Rezinn Teknoloji A.Ş. |
| **DEUX** | Creative intelligence pre-production platform — deuxstud.io |

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author

**Ibrahim Eren Kilisli** — Game Developer · Filmmaker · Full-Stack Developer

- Website: [himerenkilisli.com](https://himerenkilisli.com)
- GitHub: [@ErenKilisli](https://github.com/ErenKilisli)

---

<div align="center">
Made with ❤️ and too much cyan. Star the repo if you like it ⭐
</div>
