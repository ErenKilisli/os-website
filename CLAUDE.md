# CLAUDE.md

## Commands
```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

## Architecture
Next.js 15 App Router + TypeScript + Tailwind CSS v4 + Framer Motion + Zustand

**UI Concept:** CYBERCORE WIN95 PIXEL ART DESKTOP OS
A personal portfolio presented as a fictional operating system (EREN.OS) with draggable windows, desktop icons, and a taskbar.

**Entry point:** `src/app/page.tsx` → renders `<Desktop />`

**Client boundary:** Everything under `src/components/desktop/` and `src/components/windows/` is `'use client'`

**State:** `src/store/windowStore.ts` (Zustand) — manages all window positions, z-index, open/close/minimize/maximize state, and desktop icon positions

**Drag:** Framer Motion `drag` prop
- Desktop icons: freely draggable anywhere on desktop
- Windows: draggable by titlebar using `useDragControls`

**Animation:** Framer Motion
- Window open/close: scale 0.05 → 1 with brightness flash
- AnimatePresence for unmount animations

**Design system:** `src/app/globals.css`
- CYBERCORE palette: near-black desktop (#020812), vivid cyan (#00ffff), cobalt blue (#0055ff)
- Win95 dark beveled borders
- Press Start 2P (8px pixel font) + VT323 (terminal body text)
- CRT scanlines + vignette overlays

**Font variables** (next/font/google):
- `--font-press-start` → Press Start 2P (UI chrome, 8px)
- `--font-vt323` → VT323 (window content, 16-18px)

**Windows:**
- GAME.PRJ / FILM.PRJ / SWR.PRJ → FileBrowserWindow (project lists)
- ABOUT.EXE → AboutWindow (bio, skills, tags)
- MAIL.EXE → MailWindow (contacts sidebar + compose form)

**Desktop Icons (draggable):** 🎮 GAME.PRJ | 🎬 FILM.PRJ | 💾 SWR.PRJ | 👤 ABOUT.EXE | 📧 MAIL.EXE
