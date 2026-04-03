'use client'
import { useState } from 'react'
import { Window } from './Window'
import { WindowState, useWindowStore } from '@/store/windowStore'
import { GAME_PROJECTS, FILM_PROJECTS, DEVFILES_PROJECTS, CINEMA_PROJECTS, ARCADE_PROJECTS, Project } from '@/data/projects'

interface Props { win: WindowState; category: string; isMobile?: boolean }

const CATEGORY_DATA: Record<string, { projects: Project[]; label: string; accent: string; icon: string; path: string }> = {
  game:     { projects: GAME_PROJECTS,     label: 'GAME PROJECTS',  accent: '#00fd00', icon: 'sports_esports', path: 'C:\\Projects\\Games' },
  film:     { projects: FILM_PROJECTS,     label: 'FILM PROJECTS',  accent: '#eaea00', icon: 'movie',          path: 'C:\\Projects\\Films' },
  devfiles: { projects: DEVFILES_PROJECTS, label: 'DEV PROJECTS',   accent: '#ff8c42', icon: 'folder_code',    path: 'C:\\Projects\\Dev'   },
  cinema:   { projects: CINEMA_PROJECTS,   label: 'FILM PROJECTS',  accent: '#eaea00', icon: 'movie',          path: 'C:\\Projects\\Films' },
  arcade:   { projects: ARCADE_PROJECTS,   label: 'GAME PROJECTS',  accent: '#00fd00', icon: 'sports_esports', path: 'C:\\Projects\\Games' },
}

const TYPE_TAG_COLOR: Record<string, string> = {
  'Unreal Engine': '#9b59b6', 'C++': '#3498db', 'React': '#61dafb',
  'TypeScript': '#3178c6', 'Rust': '#e67e22', 'Go': '#00add8',
  'Short Film': '#eaea00', 'Director': '#ff6b6b', 'Cinematics': '#ff71ce',
  'Game Dev': '#00fd00', 'AI': '#00ffff', 'Web': '#ff8c42',
  'Platform': '#ff8c42', 'Game Design': '#00fd00', 'Game Development': '#00fd00',
  'Music Video': '#eaea00', 'Commercial': '#eaea00',
}

function tagColor(tag: string) { return TYPE_TAG_COLOR[tag] ?? '#4a6080' }

type ViewMode = 'list' | 'icon'

// ── Icon view card ────────────────────────────────────────────────────
function IconCard({ p, accent, icon, selected, onClick, onDoubleClick }: {
  p: Project; accent: string; icon: string; selected: boolean
  onClick: () => void; onDoubleClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '14px 10px 10px',
        cursor: 'pointer', userSelect: 'none', width: 90,
        background: selected ? accent + '18' : hovered ? '#0a1628' : 'transparent',
        border: `1px solid ${selected ? accent + '66' : hovered ? '#1a3050' : 'transparent'}`,
        transition: 'background 0.1s, border-color 0.1s',
      }}
    >
      {/* Folder icon */}
      <div style={{ position: 'relative' }}>
        <span className="material-symbols-outlined" style={{
          fontSize: 46, color: accent,
          fontVariationSettings: "'FILL' 1",
          filter: selected ? `drop-shadow(0 0 8px ${accent}88)` : 'none',
          display: 'block',
        }}>
          folder
        </span>
        {/* badge icon overlay */}
        <span className="material-symbols-outlined" style={{
          position: 'absolute', bottom: 6, right: -2,
          fontSize: 16, color: '#000',
          fontVariationSettings: "'FILL' 1",
          background: accent,
          borderRadius: 2,
          padding: 1,
        }}>
          {icon}
        </span>
      </div>
      {/* Label */}
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 6,
        color: selected ? accent : '#8aaabb',
        textAlign: 'center', lineHeight: 1.5,
        letterSpacing: '0.04em',
        maxWidth: 84, wordBreak: 'break-word',
      }}>
        {p.name}
      </div>
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 5,
        color: '#2a4060', letterSpacing: '0.06em',
      }}>
        {p.year}
      </div>
    </div>
  )
}

// ── List view row ─────────────────────────────────────────────────────
function ListRow({ p, accent, icon, selected, onClick, onDoubleClick }: {
  p: Project; accent: string; icon: string; selected: boolean
  onClick: () => void; onDoubleClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr 120px 50px 1fr',
        alignItems: 'center',
        gap: 0,
        padding: '0 12px',
        height: 32,
        cursor: 'pointer', userSelect: 'none',
        background: selected ? accent + '14' : hovered ? '#0a1628' : 'transparent',
        borderBottom: '1px solid #06121e',
        borderLeft: `2px solid ${selected ? accent : 'transparent'}`,
        transition: 'background 0.08s',
      }}
    >
      {/* Icon */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className="material-symbols-outlined" style={{
          fontSize: 16, color: accent + 'cc',
          fontVariationSettings: "'FILL' 1",
        }}>
          {icon}
        </span>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 7,
        color: selected ? accent : '#c8d8e8',
        letterSpacing: '0.05em',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        paddingRight: 8,
      }}>
        {p.name}
      </div>

      {/* Type */}
      <div style={{
        fontFamily: 'var(--font-b)', fontSize: 12, color: '#3a5570',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        paddingRight: 8,
      }}>
        {p.type}
      </div>

      {/* Year */}
      <div style={{
        fontFamily: 'var(--font-h)', fontSize: 6, color: '#2a4060',
        letterSpacing: '0.08em',
      }}>
        {p.year}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 4, overflow: 'hidden' }}>
        {p.tags.slice(0, 3).map(tag => (
          <span key={tag} style={{
            fontFamily: 'var(--font-h)', fontSize: 5,
            padding: '1px 4px',
            background: tagColor(tag) + '22',
            color: tagColor(tag),
            border: `1px solid ${tagColor(tag)}44`,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function FileBrowserWindow({ win, category, isMobile = false }: Props) {
  const { openProjectDetail } = useWindowStore()
  const data = CATEGORY_DATA[category]
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  if (!data) return null

  const selected = data.projects.find(p => p.id === selectedId) ?? null

  return (
    <Window
      win={win}
      menu={['File', 'Edit', 'View', 'Help']}
      status={selectedId ? `1 object selected  ·  ${data.label}` : `${data.projects.length} object(s)  ·  ${data.label}`}
      isMobile={isMobile}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#020812' }}>

        {/* ── Toolbar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          padding: '0 0 0 0', height: 30,
          borderBottom: '1px solid #0a1628',
          background: '#000', flexShrink: 0,
        }}>
          {/* Nav buttons */}
          {(['arrow_back', 'arrow_forward', 'arrow_upward'] as const).map((ico, i) => (
            <button key={i} style={{
              width: 30, height: 30, background: 'none', border: 'none',
              borderRight: '1px solid #0a1628',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#2a4060', cursor: 'default',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{ico}</span>
            </button>
          ))}

          {/* Address bar */}
          <div style={{
            flex: 1, height: '100%',
            display: 'flex', alignItems: 'center',
            borderRight: '1px solid #0a1628',
            padding: '0 10px', gap: 6,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 12, color: data.accent + '88' }}>
              {data.icon}
            </span>
            <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#3a5570', letterSpacing: '0.06em' }}>
              {data.path}
            </span>
          </div>

          {/* View mode toggles */}
          <div style={{ display: 'flex', borderLeft: '1px solid #0a1628' }}>
            {(['list', 'icon'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 30, height: 30, background: viewMode === mode ? data.accent + '22' : 'none',
                  border: 'none',
                  borderLeft: mode === 'icon' ? '1px solid #0a1628' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: viewMode === mode ? data.accent : '#2a4060',
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                  {mode === 'list' ? 'format_list_bulleted' : 'grid_view'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Body: sidebar + content ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Sidebar */}
          <div style={{
            width: 140, flexShrink: 0,
            borderRight: '1px solid #0a1628',
            background: '#000',
            display: 'flex', flexDirection: 'column',
            padding: '10px 0',
            gap: 0,
          }}>
            {/* Category section */}
            <div style={{
              padding: '0 12px 8px',
              borderBottom: '1px solid #0a1628',
              marginBottom: 8,
            }}>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: '#2a4060', letterSpacing: '0.12em', marginBottom: 6 }}>
                LOCATION
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 6px',
                background: data.accent + '14',
                border: `1px solid ${data.accent}33`,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: data.accent }}>
                  {data.icon}
                </span>
                <span style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: data.accent, letterSpacing: '0.06em' }}>
                  {data.label}
                </span>
              </div>
            </div>

            {/* Quick info */}
            <div style={{ padding: '0 12px' }}>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: '#2a4060', letterSpacing: '0.12em', marginBottom: 6 }}>
                INFO
              </div>
              {[
                { label: 'ITEMS', value: data.projects.length },
                { label: 'TYPE', value: category.toUpperCase() },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: '#2a4060', letterSpacing: '0.08em' }}>{row.label}</span>
                  <span style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: '#4a6080', letterSpacing: '0.06em' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Selected file info */}
            {selected && (
              <div style={{
                margin: '10px 8px 0',
                padding: 8,
                border: `1px solid ${data.accent}33`,
                background: data.accent + '0a',
              }}>
                <div style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: '#2a4060', letterSpacing: '0.12em', marginBottom: 6 }}>
                  SELECTED
                </div>
                <div style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: data.accent, letterSpacing: '0.05em', lineHeight: 1.6, marginBottom: 4 }}>
                  {selected.name}
                </div>
                <div style={{ fontFamily: 'var(--font-h)', fontSize: 5, color: '#2a4060', letterSpacing: '0.06em' }}>
                  {selected.year}
                </div>
                <div style={{ marginTop: 6, fontFamily: 'var(--font-h)', fontSize: 5, color: '#2a5070', letterSpacing: '0.05em', lineHeight: 1.5 }}>
                  {selected.tags.slice(0, 2).join(' · ')}
                </div>
              </div>
            )}

            <div style={{ flex: 1 }} />

            {/* Hint */}
            <div style={{ padding: '0 12px 4px' }}>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 4, color: '#1a2a3a', letterSpacing: '0.08em', lineHeight: 1.8 }}>
                DOUBLE-CLICK<br />TO OPEN
              </div>
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, overflow: 'auto', background: '#020812' }}>

            {/* List header (only in list mode) */}
            {viewMode === 'list' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr 120px 50px 1fr',
                gap: 0,
                padding: '0 12px',
                height: 22,
                borderBottom: '1px solid #0a1628',
                background: '#000',
                position: 'sticky', top: 0, zIndex: 1,
              }}>
                {['', 'NAME', 'TYPE', 'YEAR', 'TAGS'].map((col, i) => (
                  <div key={i} style={{
                    fontFamily: 'var(--font-h)', fontSize: 5,
                    color: '#1a3050', letterSpacing: '0.12em',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {col}
                  </div>
                ))}
              </div>
            )}

            {/* Items */}
            {viewMode === 'list' ? (
              <div>
                {data.projects.map(p => (
                  <ListRow
                    key={p.id}
                    p={p}
                    accent={data.accent}
                    icon={data.icon}
                    selected={selectedId === p.id}
                    onClick={() => setSelectedId(p.id)}
                    onDoubleClick={() => { setSelectedId(p.id); openProjectDetail(p) }}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                display: 'flex', flexWrap: 'wrap',
                alignContent: 'flex-start',
                padding: 16, gap: 4,
              }}>
                {data.projects.map(p => (
                  <IconCard
                    key={p.id}
                    p={p}
                    accent={data.accent}
                    icon={data.icon}
                    selected={selectedId === p.id}
                    onClick={() => setSelectedId(p.id)}
                    onDoubleClick={() => { setSelectedId(p.id); openProjectDetail(p) }}
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
