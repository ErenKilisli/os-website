# Ibrahim Erenkilisli — himerenkilisli.com

> **Engineer ✦ Filmmaker** — A personal portfolio at the intersection of technical systems and cinematic storytelling.

---

## Vision

This site rejects the standard "developer portfolio" template. The design is built on a single tension: **logic vs. emotion**, **terminal vs. lens**, **grid vs. grain**.

Every decision — the dual font system, the two accent colours, the text hover effects — is a deliberate expression of a split identity: software engineer by day, filmmaker by night, both equally.

---

## Tech Stack

| Layer         | Technology                        | Reason                                          |
|---------------|-----------------------------------|-------------------------------------------------|
| Framework     | **Next.js 15** (App Router)       | RSC, layouts, metadata, image optimisation      |
| Language      | **TypeScript**                    | Type safety across the animation-heavy codebase |
| Styling       | **Tailwind CSS v4**               | CSS variable-based config, no config file needed |
| UI Animation  | **Framer Motion**                 | Spring physics, layout animations, `layoutId`   |
| Scroll        | **Lenis**                         | Buttery smooth scroll, feeds into ScrollTrigger |
| Scroll FX     | **GSAP + ScrollTrigger**          | Parallax floating grid, scroll-driven reveals   |
| Fonts         | **Geist Mono + Playfair Display** | Engineer identity + Filmmaker identity          |

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, Providers
│   ├── page.tsx            # Section assembly (server component)
│   └── globals.css         # Full design system — CSS variables, glass, text FX
│
├── components/
│   ├── navigation/
│   │   └── DynamicIsland.tsx   # iOS 18–style floating nav pill
│   ├── hero/
│   │   ├── Hero.tsx            # Hero section + hover effects orchestration
│   │   ├── FloatingIcons.tsx   # Magnetic repel icons (RAF + Framer springs)
│   │   └── MatrixCanvas.tsx    # Canvas matrix rain (fades in/out with intensity prop)
│   ├── projects/
│   │   ├── ProjectsSection.tsx # Floating parallax grid (Phase 2)
│   │   ├── ProjectCard.tsx     # Individual glassmorphic card
│   │   └── ProjectModal.tsx    # Shared element transition expand (layoutId)
│   ├── contact/
│   │   └── ContactFAB.tsx      # Expanding liquid-glass FAB (Phase 2)
│   └── ui/
│       └── CustomCursor.tsx    # Two-layer cursor (dot + lagging ring)
│
├── providers/
│   ├── Providers.tsx           # Client provider tree (imported by server layout)
│   └── SmoothScrollProvider.tsx # Lenis init + ScrollTrigger sync
│
├── hooks/
│   └── useMousePosition.ts     # State-based and ref-based mouse trackers
│
├── data/
│   └── projects.ts             # All project metadata
│
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## Design System

### Dual Accent System

| Identity  | Colour  | Hex       |
|-----------|---------|-----------|
| Engineer  | Cyber Green | `#00ffaa` |
| Filmmaker | Cinematic Orange | `#ff6b35` |

### Typography

- **Geist Mono** — all "code" contexts: nav, labels, taglines, tags, project numbers
- **Playfair Display Italic** — all "cinematic" contexts: FILMMAKER headline, editorial headers
- The clash between the two is intentional and load-bearing to the concept.

### Glassmorphism

Three pre-built utility classes in `globals.css`:

```css
.glass        /* cards, panels */
.glass-pill   /* Dynamic Island, pill-shaped elements */
.glass-card   /* project cards */
```

All use `backdrop-filter: blur(20–24px) saturate(180–200%)` for the liquid glass feel.

### Animation Principles

- **Spring physics everywhere** — stiffness 300–400, damping 24–30. No `ease-in-out` for primary interactions.
- **Text masking on hover**:
  - `ENGINEER` → `.text-matrix` CSS class: repeating gradient scanlines, #00ffaa, canvas matrix rain intensifies behind
  - `FILMMAKER` → `.text-cinematic` CSS class: animated warm gradient (#ff6b35 → #ffcc02), film grain overlay activates
- **Floating icons** — each icon runs its own RAF loop: sine-wave float + inverse-square mouse repel (radius: 170px)
- **Dynamic Island** — `animate={{ width, height }}` with spring transition. `AnimatePresence` handles content swap.

---

## Sections Roadmap

- [x] Phase 0 — Init, design system, context files
- [x] Phase 1 — Dynamic Island nav + Hero section
- [ ] Phase 2 — Projects floating grid + Contact FAB
- [ ] Phase 3 — About section + easter eggs
- [ ] Phase 4 — Performance polish + deploy to Vercel
