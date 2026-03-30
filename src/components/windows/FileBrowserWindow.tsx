'use client'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { GAME_PROJECTS, FILM_PROJECTS, SOFTWARE_PROJECTS, Project } from '@/data/projects'

const CATEGORY_DATA: Record<string, { projects: Project[]; path: string }> = {
  game: { projects: GAME_PROJECTS, path: 'C:\\EREN\\GAMES\\' },
  film: { projects: FILM_PROJECTS, path: 'C:\\EREN\\FILMS\\' },
  swr:  { projects: SOFTWARE_PROJECTS, path: 'C:\\EREN\\SOFTWARE\\' },
}

export function FileBrowserWindow({ win, category }: { win: WindowState; category: string }) {
  const data = CATEGORY_DATA[category]
  return (
    <Window win={win} menu={['File', 'Edit', 'View', 'Help']} status={`${data.projects.length} object(s) | ${data.path}`}>
      <div className="fb-path">{data.path} &nbsp; {data.projects.length} object(s)</div>
      <div className="fb-cols"><span>NAME</span><span>YEAR</span><span>TYPE</span></div>
      <ul className="fb-list">
        {data.projects.map((p, i) => (
          <li key={i} className="fb-row">
            <span className="fb-name">{p.icon} {p.name}</span>
            <span className="fb-yr">{p.year}</span>
            <span className="fb-type">{p.type}</span>
          </li>
        ))}
      </ul>
    </Window>
  )
}
