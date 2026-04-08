'use client'
import React, { useState } from 'react'
import { Window } from './Window'
import { WindowState, useWindowStore } from '@/store/windowStore'
import { GAME_PROJECTS, FILM_PROJECTS, DEVFILES_PROJECTS, CINEMA_PROJECTS, ARCADE_PROJECTS, Project } from '@/data/projects'
import { PROJECT_LOGOS } from '@/components/desktop/FolderIcons'

interface Props { win: WindowState; category: string; isMobile?: boolean }

const CATEGORY_DATA: Record<string, {
  projects: Project[]; label: string; accent: string; icon: string; path: string
}> = {
  game:     { projects: GAME_PROJECTS,     label: 'GAME PROJECTS',  accent: '#00a800', icon: 'sports_esports', path: 'C:\\Projects\\Games'  },
  film:     { projects: FILM_PROJECTS,     label: 'FILM PROJECTS',  accent: '#b8a000', icon: 'movie',          path: 'C:\\Projects\\Films'  },
  devfiles: { projects: DEVFILES_PROJECTS, label: 'DEV PROJECTS',   accent: '#c06000', icon: 'folder_code',    path: 'C:\\Projects\\Dev'    },
  cinema:   { projects: CINEMA_PROJECTS,   label: 'FILM PROJECTS',  accent: '#b8a000', icon: 'movie',          path: 'C:\\Projects\\Films'  },
  arcade:   { projects: ARCADE_PROJECTS,   label: 'GAME PROJECTS',  accent: '#00a800', icon: 'sports_esports', path: 'C:\\Projects\\Games'  },
}

const TAG_COLOR: Record<string, string> = {
  'Unreal Engine': '#6a3d9b', 'C++': '#1a6aab', 'React': '#0090bb',
  'TypeScript': '#1060a0', 'Rust': '#c05010', 'Go': '#007890',
  'Short Film': '#907000', 'Director': '#903030', 'Cinematics': '#804080',
  'Game Dev': '#007000', 'AI': '#008080', 'Web': '#805030',
  'Platform': '#805030', 'Game Design': '#007000', 'Game Development': '#007000',
  'Music Video': '#907000', 'Commercial': '#907000',
}
function tagColor(t: string) { return TAG_COLOR[t] ?? '#505870' }

type ViewMode = 'list' | 'icon'

// ── Toolbar button (Win95 style) ──────────────────────────────────────
function TBtn({ children, active, onClick, title, disabled }: {
  children: React.ReactNode; active?: boolean; onClick?: () => void
  title?: string; disabled?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 26, height: 22, border: 'none',
        background: 'var(--surface-dim)',
        boxShadow: active
          ? 'inset 1.5px 1.5px 0 #808080, inset -1.5px -1.5px 0 #fff'
          : 'inset 1.5px 1.5px 0 #fff, inset -1.5px -1.5px 0 #808080',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? '#aaa' : '#000',
        cursor: disabled ? 'default' : 'pointer', flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

// ── List row ──────────────────────────────────────────────────────────
function ListRow({ p, accent, icon, selected, onClick, onDoubleClick }: {
  p: Project; accent: string; icon: string; selected: boolean
  onClick: () => void; onDoubleClick: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '30px 1fr 110px 44px',
        alignItems: 'center',
        height: 28,
        borderBottom: '1px solid #e8e8e8',
        background: selected ? '#000080' : hov ? '#d8e8f8' : '#fff',
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {PROJECT_LOGOS[p.id] ? (
          React.createElement(PROJECT_LOGOS[p.id], { size: 20 })
        ) : (
          <span className="material-symbols-outlined"
            style={{ fontSize: 20, color: selected ? '#fff' : accent, fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 9,
        color: selected ? '#fff' : '#000',
        letterSpacing: '0.03em',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        paddingRight: 6,
      }}>
        {p.name}
      </div>
      <div style={{
        fontFamily: 'var(--font-b)', fontSize: 13,
        color: selected ? '#cce' : '#444',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        paddingRight: 6,
      }}>
        {p.type}
      </div>
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 6,
        color: selected ? '#aac' : '#888',
        letterSpacing: '0.06em',
      }}>
        {p.year}
      </div>
    </div>
  )
}

// ── Icon card ─────────────────────────────────────────────────────────
function IconCard({ p, accent, icon, selected, onClick, onDoubleClick }: {
  p: Project; accent: string; icon: string; selected: boolean
  onClick: () => void; onDoubleClick: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 100, padding: '12px 6px 10px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        cursor: 'pointer', userSelect: 'none',
        background: selected ? '#000080' : hov ? '#d8e8f8' : 'transparent',
        outline: hov && !selected ? '1px dashed #808080' : 'none',
      }}
    >
      <div style={{ position: 'relative', display: 'flex' }}>
        {PROJECT_LOGOS[p.id] ? (
          React.createElement(PROJECT_LOGOS[p.id], { size: 54 })
        ) : (
          <>
            <span className="material-symbols-outlined"
              style={{ fontSize: 54, color: accent, fontVariationSettings: "'FILL' 1" }}>
              folder
            </span>
            <span className="material-symbols-outlined"
              style={{
                position: 'absolute', bottom: 6, right: -5,
                fontSize: 18, color: '#fff',
                fontVariationSettings: "'FILL' 1",
                background: accent,
                padding: '2px',
                boxShadow: '1px 1px 0 #000',
              }}>
              {icon}
            </span>
          </>
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 8,
        color: selected ? '#fff' : '#000',
        textAlign: 'center', lineHeight: 1.6, letterSpacing: '0.03em',
        maxWidth: 94, wordBreak: 'break-word',
        background: selected ? '#000080' : 'transparent',
        padding: '0 2px',
      }}>
        {p.name}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────
export function FileBrowserWindow({ win, category, isMobile = false }: Props) {
  const { openProjectDetail } = useWindowStore()
  const data = CATEGORY_DATA[category]
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewMode, setViewMode]     = useState<ViewMode>('list')

  if (!data) return null

  const sel = data.projects.find(p => p.id === selectedId) ?? null
  const open = (p: Project) => { setSelectedId(p.id); openProjectDetail(p) }

  return (
    <Window
      win={win}
      menu={[]}
      status={sel ? `1 object selected` : `${data.projects.length} object(s)`}
      isMobile={isMobile}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-dim)' }}>

        {/* ── Toolbar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          padding: '3px 4px',
          background: 'var(--surface-dim)',
          borderBottom: '1px solid #808080',
          flexShrink: 0,
        }}>
          <TBtn disabled title="Back">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
          </TBtn>
          <TBtn disabled title="Forward">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
          </TBtn>
          <TBtn disabled title="Up">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_upward</span>
          </TBtn>

          <div style={{ width: 1, height: 18, background: '#808080', margin: '0 2px', boxShadow: '1px 0 0 #fff' }} />

          {/* Address bar */}
          <div style={{
            flex: 1, height: 22,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 8px',
            background: '#fff',
            boxShadow: 'inset 1.5px 1.5px 0 #808080, inset -1.5px -1.5px 0 #fff',
          }}>
            <span className="material-symbols-outlined"
              style={{ fontSize: 13, color: data.accent, fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>
              {data.icon}
            </span>
            <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#333', letterSpacing: '0.04em' }}>
              {data.path}
            </span>
          </div>

          <div style={{ width: 1, height: 18, background: '#808080', margin: '0 2px', boxShadow: '1px 0 0 #fff' }} />

          <TBtn active={viewMode === 'list'} onClick={() => setViewMode('list')} title="Details">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>format_list_bulleted</span>
          </TBtn>
          <TBtn active={viewMode === 'icon'} onClick={() => setViewMode('icon')} title="Icons">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>grid_view</span>
          </TBtn>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>

            {viewMode === 'list' ? (
              <>
                {/* Column headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '30px 1fr 110px 44px',
                  height: 22,
                  position: 'sticky', top: 0, zIndex: 1,
                  background: 'var(--surface-dim)',
                  boxShadow: 'inset 1.5px 1.5px 0 #fff, inset -1.5px -1.5px 0 #808080',
                  borderBottom: '1px solid #808080',
                }}>
                  {['', 'Name', 'Type', 'Year'].map((col, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center',
                      paddingLeft: i === 0 ? 0 : 6,
                      fontFamily: 'var(--font-h)', fontSize: 6,
                      color: '#333', letterSpacing: '0.06em',
                      borderRight: i < 3 ? '1px solid #808080' : 'none',
                    }}>
                      {col}
                    </div>
                  ))}
                </div>

                {data.projects.map(p => (
                  <ListRow
                    key={p.id} p={p} accent={data.accent} icon={data.icon}
                    selected={selectedId === p.id}
                    onClick={() => setSelectedId(p.id)}
                    onDoubleClick={() => open(p)}
                  />
                ))}
              </>
            ) : (
              <div style={{
                display: 'flex', flexWrap: 'wrap',
                alignContent: 'flex-start',
                padding: '10px 8px', gap: 2,
              }}>
                {data.projects.map(p => (
                  <IconCard
                    key={p.id} p={p} accent={data.accent} icon={data.icon}
                    selected={selectedId === p.id}
                    onClick={() => setSelectedId(p.id)}
                    onDoubleClick={() => open(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Window>
  )
}
