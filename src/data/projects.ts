import type { Project } from '@/types'

export const projects: Project[] = [
  /* ── System & Code ─────────────────────────── */
  {
    id: 'deux',
    title: 'Deux',
    subtitle: 'Creative Studio Platform',
    category: 'code',
    tags: ['Product Design', 'Full-Stack', 'SaaS'],
    year: '2024',
    url: 'https://deuxstud.io',
    description:
      'A creative studio platform connecting brands with emerging digital artists. Built with a focus on performance, aesthetic precision, and a radical design language.',
    accentColor: '#00ffaa',
    size: 'lg',
  },
  {
    id: 'rezinn',
    title: 'Rezinn',
    subtitle: 'Next-Gen Marketplace',
    category: 'code',
    tags: ['React', 'Node.js', 'Product Engineering'],
    year: '2023',
    description:
      'A marketplace platform with real-time negotiation, advanced multi-dimensional filtering, and a trust-layer built on verified reviews.',
    accentColor: '#00ffaa',
    size: 'md',
  },
  {
    id: 'streetshare',
    title: 'Streetshare',
    subtitle: 'Urban Photography Network',
    category: 'code',
    tags: ['Mobile', 'Geo', 'Community'],
    year: '2023',
    description:
      'Social platform for urban photographers to share and discover street photography geotagged to real locations across Istanbul and beyond.',
    accentColor: '#00ffaa',
    size: 'md',
  },
  {
    id: 'damned-ape',
    title: 'Damned Ape',
    subtitle: 'Unreal Engine 5 Game',
    category: 'code',
    tags: ['UE5', 'Game Dev', 'C++', 'Nanite'],
    year: '2024',
    description:
      'A first-person psychological thriller built in Unreal Engine 5. Features Nanite geometry, Lumen global illumination, and a procedural narrative system.',
    accentColor: '#00ffaa',
    size: 'wide',
  },

  /* ── Lens & Motion ──────────────────────────── */
  {
    id: 'showreel',
    title: 'Film Showreel',
    subtitle: '2023 — 2024 Reel',
    category: 'film',
    tags: ['Directing', 'Cinematography', 'Color Grade'],
    year: '2024',
    description:
      'Curated collection of directorial and cinematographic work. Shot on RED Monstro and Sony FX9. Color graded in DaVinci Resolve with custom LUTs.',
    accentColor: '#ff6b35',
    size: 'wide',
  },
  {
    id: 'geeknasyon',
    title: 'Geeknasyon',
    subtitle: 'Tech Media Content',
    category: 'film',
    tags: ['YouTube', 'Long-form', 'Direction'],
    year: '2022–Present',
    url: 'https://geeknasyon.com',
    description:
      "Turkey's leading tech media platform. Long-form documentary-style reviews with a cinematic visual language. 200k+ combined views.",
    accentColor: '#ff6b35',
    size: 'lg',
  },
  {
    id: 'photography',
    title: 'Photography',
    subtitle: 'Street & Portrait Work',
    category: 'film',
    tags: ['Street', 'Portrait', 'Luminar', 'Darktable'],
    year: 'Ongoing',
    description:
      'A body of street and portrait photography developed in Luminar Neo and Darktable. Drawn from the textures of Istanbul and its contradictions.',
    accentColor: '#ff6b35',
    size: 'md',
  },
]

export const codeProjects = projects.filter((p) => p.category === 'code')
export const filmProjects = projects.filter((p) => p.category === 'film')
