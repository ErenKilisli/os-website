# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

Next.js 15 App Router + TypeScript + Tailwind CSS v4 + Framer Motion + Lenis + GSAP.

**Entry point:** `src/app/page.tsx` (server component) assembles section components.

**Client boundary:** `src/providers/Providers.tsx` is the client root — it wraps `SmoothScrollProvider` (Lenis + GSAP ScrollTrigger) and renders `CustomCursor`. All other components can be server or client as needed.

**Design system:** Entirely in `src/app/globals.css`. No `tailwind.config.ts` — Tailwind v4 reads configuration from the `@theme` block in CSS. Custom utility classes (`.glass`, `.glass-pill`, `.glass-card`, `.text-matrix`, `.text-cinematic`, `.film-grain`) are also defined there.

**Animation stack:**
- Framer Motion → all UI spring animations (DynamicIsland, hero text scale, modal expand)
- RAF loops → `FloatingIcons.tsx` (per-icon sine-wave float + mouse repel)
- Canvas API → `MatrixCanvas.tsx` (matrix rain; intensity prop drives Framer Motion opacity)
- Lenis + GSAP ScrollTrigger → scroll-driven animations (wired in Phase 2)

**Font variables** (set by `next/font/google` in `layout.tsx`):
- `--font-geist-mono` → `font-family: var(--font-mono)` (engineer identity)
- `--font-playfair` → `font-family: var(--font-serif)` (filmmaker identity)

**Colour system** (Tailwind v4 `--color-*` → utility classes):
- `#00ffaa` accent-green (engineer hover, matrix, glow)
- `#ff6b35` accent-orange (filmmaker hover, film grain, warm gradients)

See `.cursorrules` for the full project context, personal details, and all project names.
