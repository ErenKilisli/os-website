'use client'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useWindowStore } from '@/store/windowStore'
import { Project } from '@/data/projects'

interface Props {
  win: WindowState
  isMobile?: boolean
}

const TYPE_TAG_COLOR: Record<string, string> = {
  'Unreal Engine': '#9b59b6', 'C++': '#3498db', 'React': '#61dafb',
  'TypeScript': '#3178c6', 'Rust': '#e67e22', 'Go': '#00add8',
  'Short Film': '#eaea00', 'Director': '#ff6b6b', 'Cinematics': '#ff71ce',
  'Game Dev': '#00fd00', 'AI': '#00ffff', 'Web': '#ff8c42',
  'Platform': '#ff8c42', 'Game Design': '#00fd00', 'Game Development': '#00fd00',
  'Music Video': '#eaea00', 'Commercial': '#eaea00', 'Lighting': '#eaea00',
  'Camera': '#eaea00', 'Production': '#eaea00', 'Festival': '#eaea00',
  'Writer': '#ff6b6b', 'Rendering': '#e67e22', 'Native': '#e67e22',
  'CLI': '#00add8', 'Tooling': '#3178c6',
}

function tagColor(tag: string) {
  return TYPE_TAG_COLOR[tag] ?? '#4a6080'
}

const GAME_TAGS  = new Set(['Unreal Engine', 'Game Dev', 'Game Design', 'Game Development', 'C++'])
const FILM_TAGS  = new Set(['Short Film', 'Director', 'Cinematics', 'Music Video', 'Commercial', 'Camera', 'Lighting'])

function detectCategory(p: Project): { accent: string; icon: string; label: string } {
  if (p.tags.some(t => GAME_TAGS.has(t))) return { accent: '#00fd00', icon: 'sports_esports', label: 'GAME PROJECT' }
  if (p.tags.some(t => FILM_TAGS.has(t)))  return { accent: '#eaea00', icon: 'movie',          label: 'FILM PROJECT'  }
  return                                           { accent: '#ff8c42', icon: 'folder_code',    label: 'DEV PROJECT'   }
}

export function ProjectDetailWindow({ win, isMobile = false }: Props) {
  const { currentProject } = useWindowStore()
  const p = currentProject

  if (!p) return null

  const cat = detectCategory(p)

  return (
    <Window win={win} menu={['File', 'Edit', 'Help']} status={`${p.name}.EXE  ·  READ ONLY`} isMobile={isMobile}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#020812', overflow: 'hidden' }}>

        {/* Top accent bar */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${cat.accent}, transparent)`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 14,
          padding: '16px 18px 14px',
          borderBottom: '1px solid #0a1628',
          background: '#000',
          flexShrink: 0,
        }}>
          <div style={{
            width: 48, height: 48, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${cat.accent}44`,
            background: cat.accent + '11',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 26, color: cat.accent }}>
              {cat.icon}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-h)', fontSize: 10, color: cat.accent,
              letterSpacing: '0.08em', lineHeight: 1.5,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {p.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span style={{
                fontFamily: 'var(--font-h)', fontSize: 6, color: '#2a5070',
                background: '#0a1628', padding: '2px 6px', letterSpacing: '0.1em',
              }}>
                {p.year}
              </span>
              <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: cat.accent + '88', letterSpacing: '0.1em' }}>
                {cat.label}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-b)', fontSize: 13, color: '#4a6080',
              marginTop: 4, lineHeight: 1.3,
            }}>
              {p.type}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Tags */}
          <div>
            <div style={{
              fontFamily: 'var(--font-h)', fontSize: 6, color: '#2a4060',
              letterSpacing: '0.12em', marginBottom: 8,
            }}>
              TAGS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {p.tags.map(tag => (
                <span key={tag} style={{
                  fontFamily: 'var(--font-h)', fontSize: 6,
                  padding: '3px 8px',
                  background: tagColor(tag) + '18',
                  color: tagColor(tag),
                  border: `1px solid ${tagColor(tag)}44`,
                  letterSpacing: '0.07em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#0a1628' }} />

          {/* Description */}
          <div>
            <div style={{
              fontFamily: 'var(--font-h)', fontSize: 6, color: '#2a4060',
              letterSpacing: '0.12em', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ display: 'inline-block', width: 8, height: 1, background: cat.accent + '88' }} />
              DESCRIPTION
            </div>
            <div style={{
              fontFamily: 'var(--font-b)', fontSize: 17, color: '#8aaabb',
              lineHeight: 1.6,
            }}>
              {p.description}
            </div>
          </div>

          {/* Links */}
          {p.links.length > 0 && (
            <>
              <div style={{ height: 1, background: '#0a1628' }} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-h)', fontSize: 6, color: '#2a4060',
                  letterSpacing: '0.12em', marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ display: 'inline-block', width: 8, height: 1, background: cat.accent + '88' }} />
                  LINKS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.links.map(link => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontFamily: 'var(--font-h)', fontSize: 7,
                        padding: '8px 14px',
                        background: cat.accent + '14',
                        border: `1px solid ${cat.accent}44`,
                        color: cat.accent,
                        textDecoration: 'none',
                        letterSpacing: '0.1em',
                        alignSelf: 'flex-start',
                        transition: 'background 0.1s, border-color 0.1s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = cat.accent + '28'
                        e.currentTarget.style.borderColor = cat.accent + 'aa'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = cat.accent + '14'
                        e.currentTarget.style.borderColor = cat.accent + '44'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom accent */}
        <div style={{
          padding: '6px 18px', borderTop: '1px solid #0a1628',
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#000', flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 10, color: '#1a3050' }}>info</span>
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#1a3050', letterSpacing: '0.1em' }}>
            {p.tags.length} TAGS  ·  {p.links.length} LINK{p.links.length !== 1 ? 'S' : ''}  ·  {p.year}
          </span>
        </div>

      </div>
    </Window>
  )
}
