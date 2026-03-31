'use client'
import { useState } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useWindowStore } from '@/store/windowStore'
import { GAME_PROJECTS, FILM_PROJECTS, SOFTWARE_PROJECTS, DEVFILES_PROJECTS, CINEMA_PROJECTS, ARCADE_PROJECTS, Project } from '@/data/projects'

type ViewMode = 'list' | 'small' | 'medium' | 'large'

const CATEGORY_DATA: Record<string, { projects: Project[]; path: string }> = {
  game:     { projects: GAME_PROJECTS,     path: 'C:\\EREN\\GAMES\\'    },
  film:     { projects: FILM_PROJECTS,     path: 'C:\\EREN\\FILMS\\'    },
  swr:      { projects: SOFTWARE_PROJECTS, path: 'C:\\EREN\\SOFTWARE\\' },
  devfiles: { projects: DEVFILES_PROJECTS, path: 'C:\\EREN\\DEVFILES\\' },
  cinema:   { projects: CINEMA_PROJECTS,   path: 'C:\\EREN\\CINEMA\\'   },
  arcade:   { projects: ARCADE_PROJECTS,   path: 'C:\\EREN\\ARCADE\\'   },
}

const VIEW_ICONS: Record<ViewMode, string> = {
  list:   'list',
  small:  'apps',
  medium: 'grid_view',
  large:  'view_module',
}

interface Props {
  win: WindowState
  category: string
  isMobile?: boolean
}

export function FileBrowserWindow({ win, category, isMobile = false }: Props) {
  const { openProjectDetail } = useWindowStore()
  const data = CATEGORY_DATA[category]
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selected, setSelected] = useState<string | null>(null)
  const clickTimer = { current: null as ReturnType<typeof setTimeout> | null }
  const clickCount = { current: 0 }

  const handleProjectClick = (project: Project) => {
    setSelected(project.id)
    clickCount.current += 1
    if (clickCount.current === 2) {
      if (clickTimer.current) clearTimeout(clickTimer.current)
      clickCount.current = 0
      openProjectDetail(project)
      return
    }
    clickTimer.current = setTimeout(() => { clickCount.current = 0 }, 400)
  }

  return (
    <Window win={win} menu={['File', 'Edit', 'View', 'Help']} status={`${data.projects.length} object(s) | ${data.path}`} isMobile={isMobile}>
      {/* View mode toolbar */}
      <div className="fb-viewbar">
        <span className="fb-path-inline">{data.path}</span>
        <div className="fb-view-btns">
          {(['list', 'small', 'medium', 'large'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              className={`fb-view-btn${viewMode === mode ? ' active' : ''}`}
              onClick={() => setViewMode(mode)}
              title={mode.toUpperCase()}
            >
              <span className="material-symbols-outlined">{VIEW_ICONS[mode]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List view */}
      {viewMode === 'list' && (
        <>
          <div className="fb-cols"><span>NAME</span><span>YEAR</span><span>TYPE</span></div>
          <ul className="fb-list">
            {data.projects.map((p) => (
              <li
                key={p.id}
                className={`fb-row${selected === p.id ? ' fb-selected' : ''}`}
                onClick={() => handleProjectClick(p)}
              >
                <span className="fb-name">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>folder</span>
                  {p.name}
                </span>
                <span className="fb-yr">{p.year}</span>
                <span className="fb-type">{p.type}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Small grid view */}
      {viewMode === 'small' && (
        <div className="fb-grid fb-grid-small">
          {data.projects.map((p) => (
            <div
              key={p.id}
              className={`fb-grid-item${selected === p.id ? ' fb-selected' : ''}`}
              onClick={() => handleProjectClick(p)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#484fb9' }}>folder</span>
              <span className="fb-grid-name">{p.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Medium grid view */}
      {viewMode === 'medium' && (
        <div className="fb-grid fb-grid-medium">
          {data.projects.map((p) => (
            <div
              key={p.id}
              className={`fb-grid-item${selected === p.id ? ' fb-selected' : ''}`}
              onClick={() => handleProjectClick(p)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#484fb9' }}>folder</span>
              <span className="fb-grid-name">{p.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Large grid view */}
      {viewMode === 'large' && (
        <div className="fb-grid fb-grid-large">
          {data.projects.map((p) => (
            <div
              key={p.id}
              className={`fb-grid-item${selected === p.id ? ' fb-selected' : ''}`}
              onClick={() => handleProjectClick(p)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#484fb9' }}>folder</span>
              <span className="fb-grid-name">{p.name}</span>
              <span className="fb-grid-year">{p.year}</span>
            </div>
          ))}
        </div>
      )}
    </Window>
  )
}
