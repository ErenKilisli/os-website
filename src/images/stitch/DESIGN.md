# Design System Strategy: Windows 95 meets Y2K Cybercore

## 1. Overview & Creative North Star: "The Analog Architect"
This design system serves as a bridge between the rigid, industrial precision of early engineering software and the fluid, saturated escapism of Y2K filmmaker aesthetics. Our Creative North Star is **The Analog Architect**. 

Unlike standard modern systems that favor flat, "invisible" interfaces, this system celebrates the interface as a physical object. We break the "template" look by utilizing intentional layering, hard-edged bevels, and a high-contrast palette. The layout should feel like a multi-windowed workstation: asymmetric, overlapping, and hyper-functional, yet drenched in the vibrant, digital soul of the early 2000s.

---

## 2. Colors & Surface Logic

### The Palette
The core of the system relies on a high-tension relationship between neutral grays and electric blues/greens.
- **Primary (`#484fb9`):** Our "Terminal Blue," used for active title bars and key interaction points.
- **Secondary (`#5f5f00`):** A "Utility Gold," used for system alerts or folder-inspired accents.
- **Tertiary (`#026b00`):** "Matrix Green," reserved for success states and digital progress indicators.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural separation must be achieved through **background color shifts**. Use `surface-container-low` for secondary panels sitting on a `surface` background. The eye should perceive depth through tonal change, not through drawn lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked physical plates. 
- Use `surface-container-lowest` (`#ffffff`) for high-contrast content areas within a window.
- Use `surface-dim` (`#d3d4d5`) for the "metal" chassis of the UI.
- Nested containers should oscillate between `surface-container` tiers to create a "recessed" or "raised" effect without relying on modern drop shadows.

### The "Glass & Gradient" Rule
To elevate the system from "retro-parody" to "high-end editorial," use semi-transparent glassmorphism for floating palettes. Apply a `surface-container-highest` background with 60% opacity and a `backdrop-blur` of 12px. For main backgrounds, use a signature gradient transitioning from `primary` (`#484fb9`) to `primary-container` (`#9097ff`) with a 15% digital noise overlay to simulate a CRT phosphor glow.

---

## 3. Typography: Pixel Editorial
The typography strategy contrasts low-resolution technicality with high-fashion spacing.

- **Display & Headlines (`spaceGrotesk`):** Our "Filmmaker" voice. Use `display-lg` (3.5rem) with tight letter-spacing for a bold, cinematic impact. This font brings a modern, geometric sharpness that balances the retro elements.
- **Body & Titles (`publicSans`):** Our "Engineer" voice. It mimics the clarity of MS Sans Serif. Use `body-md` (0.875rem) for all functional text.
- **Labeling:** All labels should be uppercase, utilizing `label-sm` (0.6875rem). This reinforces the "technical specification" aesthetic found in early CAD software.

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Depth is achieved through the **Roundedness Scale of 0px**. Hard edges are non-negotiable. 
- **Level 1 (Base):** `surface`
- **Level 2 (Inlay):** `surface-container-low` (used for the inner work area of a window).
- **Level 3 (Raised):** `surface-bright` (used for buttons or active tabs).

### Ambient Shadows
We reject the standard "soft shadow." Instead, for floating windows, use a "Hard Shadow" approach: a 2px offset with no blur, using `on-surface` at 20% opacity. If a "floating" feel is needed for modern components, use a large-diffused shadow tinted with the `primary` color (`#484fb9`) at 6% opacity to simulate ambient monitor glow.

### The "Ghost Border" Fallback
If an element requires a border for accessibility (e.g., an input field), use the `outline-variant` token at 20% opacity. This creates a "Ghost Border" that defines space without cluttering the visual hierarchy.

---

## 5. Components

### Buttons
- **Primary:** Background `primary`, text `on-primary`. Styling must include a 2px "outset" bevel using `surface-container-lowest` on the top/left and `surface-dim` on the bottom/right.
- **Secondary:** Background `surface-container`, text `on-surface`.
- **States:** On "Active/Pressed," swap the bevel colors to create an "inset" effect, simulating a physical push.

### Window Chrome (Cards)
- **Title Bars:** Fixed height using `Spacing 8` (1.75rem). Background `inverse_surface` for inactive and `primary` for active.
- **Window Body:** `surface-container-high` with 0px corner radius.
- **Content Separation:** Forbid divider lines. Use `Spacing 4` (0.9rem) of vertical white space or a shift to `surface-container-lowest` to separate content blocks.

### Input Fields
- **Styling:** Use an "inset" 2px bevel (dark top/left, light bottom/right) to make the field feel carved into the UI.
- **Typography:** `body-md` (publicSans).
- **Error State:** Background `error_container`, text `on_error_container`, with a 1px `error` ghost border.

### Progress Indicators (The "Loading Bar")
- Inspired by early Y2K loaders: A container of `surface-dim` filled with incremental blocks of `tertiary_fixed` (`#00fd00`).

---

## 6. Do's and Don'ts

### Do:
- **Do** overlap windows and components. Asymmetry is a feature, not a bug.
- **Do** use pixelated icons for functional actions (Trash, Folder, Terminal).
- **Do** apply a subtle CRT scanline overlay to `surface` backgrounds to unify the "Cybercore" vibe.
- **Do** use `Spacing 1` (0.2rem) for tight, technical groupings and `Spacing 16` (3.5rem) to separate major editorial sections.

### Don't:
- **Don't** use border-radius. Every element must be `0px` (Sharp).
- **Don't** use standard "Material Design" shadows. They break the retro-engineering immersion.
- **Don't** use 100% opaque black for text. Use `on_surface` (`#2d2f2f`) to maintain a slightly "inked" look on the digital display.
- **Don't** center-align everything. Lean into left-aligned, "data-heavy" layouts that suggest a sophisticated professional tool.