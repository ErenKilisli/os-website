export type ProjectCategory = 'code' | 'film'
export type ProjectSize = 'sm' | 'md' | 'lg' | 'wide'

export interface Project {
  id: string
  title: string
  subtitle: string
  category: ProjectCategory
  tags: string[]
  year: string
  url?: string
  description: string
  accentColor: string
  size: ProjectSize
}

export interface MousePosition {
  x: number
  y: number
}

export interface FloatingIconDef {
  content: string
  type: 'engineer' | 'film'
  /** percentage 0–100 */
  initialX: number
  initialY: number
  size: 'sm' | 'md' | 'lg'
  speed: number
  /** rotation offset in degrees for idle spin */
  rotationSpeed?: number
}
