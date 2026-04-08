'use client'
import React from 'react'
import { Window } from './Window'
import { WindowState, useWindowStore } from '@/store/windowStore'
import { Project } from '@/data/projects'
import { PROJECT_LOGOS } from '@/components/desktop/FolderIcons'

interface Props { win: WindowState; isMobile?: boolean }

const TAG_COLOR: Record<string, string> = {
  'Unreal Engine': '#6a3d9b', 'C++': '#1a6aab', 'React': '#0090bb',
  'TypeScript': '#1060a0', 'Rust': '#c05010', 'Go': '#007890',
  'Short Film': '#907000', 'Director': '#903030', 'Cinematics': '#804080',
  'Game Dev': '#007000', 'AI': '#008080', 'Web': '#805030',
  'Platform': '#805030', 'Game Design': '#007000', 'Game Development': '#007000',
  'Music Video': '#907000', 'Commercial': '#907000',
  'Writer': '#903030', 'Rendering': '#c05010', 'Native': '#c05010',
  'CLI': '#007890', 'Tooling': '#1060a0',
}
function tagColor(t: string) { return TAG_COLOR[t] ?? '#505870' }

const GAME_TAGS = new Set(['Unreal Engine', 'Game Dev', 'Game Design', 'Game Development', 'C++'])
const FILM_TAGS = new Set(['Short Film', 'Director', 'Cinematics', 'Music Video', 'Commercial', 'Camera', 'Lighting'])

function detectCat(p: Project): { accent: string; icon: string; label: string } {
  if (p.tags.some(t => GAME_TAGS.has(t))) return { accent: '#00a800', icon: 'sports_esports', label: 'GAME PROJECT' }
  if (p.tags.some(t => FILM_TAGS.has(t)))  return { accent: '#b8a000', icon: 'movie',          label: 'FILM PROJECT'  }
  return                                           { accent: '#c06000', icon: 'folder_code',    label: 'DEV PROJECT'   }
}

export function ProjectDetailWindow({ win, isMobile = false }: Props) {
  const { currentProject: p } = useWindowStore()
  if (!p) return null

  const cat = detectCat(p)

  return (
    <Window win={win} menu={['File', 'Edit', 'Help']} status={`${p.name}  ·  Read-only`} isMobile={isMobile}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-dim)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '12px 14px 10px',
          background: 'var(--surface-dim)',
          borderBottom: '1px solid #808080',
          boxShadow: '0 1px 0 #fff',
          flexShrink: 0,
        }}>
          {/* Icon box */}
          <div style={{
            width: 48, height: 48, flexShrink: 0,
            background: PROJECT_LOGOS[p.id] ? 'transparent' : '#fff',
            boxShadow: PROJECT_LOGOS[p.id] ? 'none' : 'inset 1.5px 1.5px 0 #808080, inset -1.5px -1.5px 0 #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {PROJECT_LOGOS[p.id] ? (
              React.createElement(PROJECT_LOGOS[p.id], { size: 48 })
            ) : (
              <span className="material-symbols-outlined"
                style={{ fontSize: 28, color: cat.accent, fontVariationSettings: "'FILL' 1" }}>
                {cat.icon}
              </span>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-h)', fontSize: 9,
              color: '#000', letterSpacing: '0.04em', lineHeight: 1.5,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {p.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{
                fontFamily: 'var(--font-h)', fontSize: 5.5,
                background: cat.accent, color: '#fff',
                padding: '1px 5px', letterSpacing: '0.08em',
              }}>
                {cat.label}
              </span>
              <span style={{ fontFamily: 'var(--font-h)', fontSize: 5.5, color: '#666', letterSpacing: '0.08em' }}>
                {p.year}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-b)', fontSize: 14, color: '#555', marginTop: 4 }}>
              {p.type}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflow: 'auto', background: '#fff', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Tags */}
          <div>
            <div style={{
              fontFamily: 'var(--font-h)', fontSize: 5.5, color: '#555',
              letterSpacing: '0.1em', marginBottom: 6,
              textTransform: 'uppercase',
            }}>
              Tags
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {p.tags.map(tag => (
                <span key={tag} style={{
                  fontFamily: 'var(--font-h)', fontSize: 6,
                  padding: '2px 7px',
                  background: tagColor(tag) + '18',
                  color: tagColor(tag),
                  border: `1px solid ${tagColor(tag)}55`,
                  letterSpacing: '0.05em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: '#e0e0e0', boxShadow: '0 1px 0 #fff' }} />

          {/* Description */}
          <div>
            <div style={{
              fontFamily: 'var(--font-h)', fontSize: 5.5, color: '#555',
              letterSpacing: '0.1em', marginBottom: 6,
              textTransform: 'uppercase',
            }}>
              Description
            </div>
            <div style={{
              fontFamily: 'var(--font-b)', fontSize: 17, color: '#222', lineHeight: 1.6,
            }}>
              {p.description}
            </div>
          </div>

          {/* Links */}
          {p.links.length > 0 && (
            <>
              <div style={{ height: 1, background: '#e0e0e0', boxShadow: '0 1px 0 #fff' }} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-h)', fontSize: 5.5, color: '#555',
                  letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase',
                }}>
                  Links
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {p.links.map(link => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontFamily: 'var(--font-h)', fontSize: 7,
                        padding: '6px 12px',
                        background: 'var(--surface-dim)',
                        boxShadow: 'inset 1.5px 1.5px 0 #fff, inset -1.5px -1.5px 0 #808080',
                        color: '#000080',
                        textDecoration: 'none',
                        letterSpacing: '0.06em',
                        alignSelf: 'flex-start',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = 'inset 1.5px 1.5px 0 #808080, inset -1.5px -1.5px 0 #fff'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = 'inset 1.5px 1.5px 0 #fff, inset -1.5px -1.5px 0 #808080'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#000080' }}>open_in_new</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '5px 14px',
          background: 'var(--surface-dim)',
          borderTop: '1px solid #808080',
          boxShadow: 'inset 0 1px 0 #fff',
          display: 'flex', alignItems: 'center', gap: 8,
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 5.5, color: '#666', letterSpacing: '0.06em' }}>
            {p.tags.length} tag(s)  ·  {p.links.length} link(s)  ·  {p.year}
          </span>
        </div>
      </div>
    </Window>
  )
}
