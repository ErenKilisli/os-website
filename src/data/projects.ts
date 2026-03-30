export interface Project {
  name: string
  year: string
  type: string
  icon: string
}

export const GAME_PROJECTS: Project[] = [
  { name: 'VOID.RUNNER',  year: '2025', type: 'Unity · PC/Mac',  icon: '📁' },
  { name: 'GLITCH.WORLD', year: '2024', type: 'Unity · Mobile',  icon: '📁' },
  { name: '8BIT.CHRON',   year: '2023', type: 'Unity · WebGL',   icon: '📁' },
  { name: 'NEON.DRIFT',   year: '2023', type: 'Godot · PC',      icon: '📁' },
]

export const FILM_PROJECTS: Project[] = [
  { name: 'ECHOES.AVI',   year: '2024', type: 'Short Film',     icon: '📁' },
  { name: 'STATIC.DRM',   year: '2024', type: 'Short Film',     icon: '📁' },
  { name: 'LAST.TX',      year: '2023', type: 'Short Film',     icon: '📁' },
  { name: 'ARCHIVE/',     year: '2022', type: 'Collection',     icon: '📂' },
]

export const SOFTWARE_PROJECTS: Project[] = [
  { name: 'NEURAL.SYS',  year: '2025', type: 'React · Web',    icon: '📁' },
  { name: 'RT.RENDER',   year: '2024', type: 'Rust · Native',  icon: '📁' },
  { name: 'TERM.GAME',   year: '2024', type: 'Go · CLI',       icon: '📁' },
  { name: 'DEV.TOOLS',   year: '2024', type: 'TypeScript',     icon: '📁' },
  { name: 'RESUME.PDF',  year: '2025', type: 'Document',       icon: '📄' },
]
