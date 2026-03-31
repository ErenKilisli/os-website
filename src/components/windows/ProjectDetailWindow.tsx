'use client'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useWindowStore } from '@/store/windowStore'

interface Props {
  win: WindowState
  isMobile?: boolean
}

export function ProjectDetailWindow({ win, isMobile = false }: Props) {
  const { currentProject } = useWindowStore()
  const p = currentProject

  if (!p) return null

  return (
    <Window win={win} menu={['File', 'Edit', 'Help']} status={`${p.name}.EXE | Read-only`} isMobile={isMobile}>
      <div className="pd-wrap">
        {/* Header */}
        <div className="pd-header">
          <div className="pd-icon-wrap">
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#484fb9', fontVariationSettings: "'FILL' 1" }}>folder</span>
          </div>
          <div className="pd-header-info">
            <div className="pd-title">{p.name}</div>
            <div className="pd-meta">{p.year} &nbsp;·&nbsp; {p.type}</div>
            <div className="pd-tags">
              {p.tags.map(tag => (
                <span key={tag} className="pd-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pd-divider" />

        {/* Description */}
        <div className="pd-section-label">DESCRIPTION</div>
        <div className="pd-desc">{p.description}</div>

        {/* Links */}
        {p.links.length > 0 && (
          <>
            <div className="pd-divider" />
            <div className="pd-section-label">LINKS</div>
            <div className="pd-links">
              {p.links.map(link => (
                <a
                  key={link.label}
                  className="pd-link-btn"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                  {link.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </Window>
  )
}
