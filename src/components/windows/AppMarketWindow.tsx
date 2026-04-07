'use client'
import { useState } from 'react'
import { Window } from './Window'
import { WindowState, useWindowStore } from '@/store/windowStore'
import { APP_META, AppMeta, WindowType } from '@/config/appMeta'
import { MARKET_ICONS } from '@/config/iconRegistry'

// All meaningful apps shown in the market (excludes internal / legacy entries)
const MARKET_APPS: AppMeta[] = APP_META.filter(a =>
  a.type !== 'projectdetail' &&
  a.type !== 'cinema' &&
  a.type !== 'arcade' &&
  a.type !== 'swr' &&
  a.type !== 'appmarket'
)

function AppIcon({ type, icon, iconColor, size = 32 }: {
  type: WindowType
  icon: string
  iconColor: string
  size?: number
}) {
  const custom = MARKET_ICONS[type]
  if (custom) return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {custom}
    </div>
  )
  // Emoji icon (e.g. snake 🐍)
  if ([...icon].length === 1 && icon.charCodeAt(0) > 255) return (
    <span style={{ fontSize: size * 0.75, lineHeight: 1 }}>{icon}</span>
  )
  return (
    <span className="material-symbols-outlined" style={{ fontSize: size, color: iconColor, lineHeight: 1 }}>
      {icon}
    </span>
  )
}

function AppRow({ app, installed, onInstall, onUninstall }: {
  app: AppMeta
  installed: boolean
  onInstall: () => void
  onUninstall: () => void
}) {
  const [hover, setHover] = useState(false)

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    background: hover ? 'rgba(72,79,185,0.12)' : 'transparent',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    transition: 'background 0.1s',
  }

  const btnBase: React.CSSProperties = {
    fontFamily: 'var(--font-h)',
    fontSize: 8,
    letterSpacing: '0.08em',
    border: 'none',
    cursor: 'pointer',
    padding: '5px 10px',
    flexShrink: 0,
  }

  const installBtn: React.CSSProperties = {
    ...btnBase,
    background: '#484fb9',
    color: '#fff',
    boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.3)',
  }

  const removeBtn: React.CSSProperties = {
    ...btnBase,
    background: 'transparent',
    color: '#cc4444',
    border: '1px solid #cc4444',
  }

  const systemBadge: React.CSSProperties = {
    ...btnBase,
    background: 'transparent',
    color: '#606060',
    border: '1px solid #404040',
    cursor: 'default',
  }

  return (
    <div style={rowStyle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {/* Icon */}
      <div style={{
        width: 40, height: 40, flexShrink: 0,
        background: 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <AppIcon type={app.type} icon={app.icon} iconColor={app.iconColor} size={26} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-h)',
          fontSize: 9,
          color: installed ? '#d3d4d5' : '#808080',
          letterSpacing: '0.06em',
          marginBottom: 3,
        }}>
          {app.label}
        </div>
        <div style={{
          fontFamily: 'var(--font-vt)',
          fontSize: 13,
          color: '#505860',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {app.appDescription ?? app.spotlightDesc}
        </div>
      </div>

      {/* Action */}
      {app.preInstalled ? (
        <span style={systemBadge}>SYSTEM</span>
      ) : installed ? (
        <button style={removeBtn} onClick={onUninstall}>REMOVE</button>
      ) : (
        <button style={installBtn} onClick={onInstall}>INSTALL</button>
      )}
    </div>
  )
}

export function AppMarketWindow({ win, isMobile }: { win: WindowState; isMobile?: boolean }) {
  const { installedApps, installApp, uninstallApp } = useWindowStore()
  const [filter, setFilter] = useState<'all' | 'installed' | 'available'>('all')

  const visible = MARKET_APPS.filter(a => {
    const inst = installedApps.includes(a.type)
    if (filter === 'installed') return inst
    if (filter === 'available') return !inst
    return true
  })

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-h)',
    fontSize: 8,
    letterSpacing: '0.08em',
    padding: '4px 10px',
    cursor: 'pointer',
    border: 'none',
    background: active ? '#484fb9' : 'transparent',
    color: active ? '#fff' : '#606060',
  })

  return (
    <Window win={win} isMobile={isMobile} menu={['FILE', 'STORE', 'HELP']} status="APP MARKET | EREN.OS">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d0e0f' }}>

        {/* Header */}
        <div style={{
          padding: '10px 14px 8px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ff71ce' }}>storefront</span>
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 10, color: '#d3d4d5', letterSpacing: '0.08em' }}>
            EREN.OS APP MARKET
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
            <button style={tabStyle(filter === 'all')} onClick={() => setFilter('all')}>ALL</button>
            <button style={tabStyle(filter === 'installed')} onClick={() => setFilter('installed')}>INSTALLED</button>
            <button style={tabStyle(filter === 'available')} onClick={() => setFilter('available')}>AVAILABLE</button>
          </div>
        </div>

        {/* Count */}
        <div style={{
          padding: '5px 14px',
          fontFamily: 'var(--font-h)',
          fontSize: 7,
          color: '#404850',
          letterSpacing: '0.1em',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {visible.length} APP{visible.length !== 1 ? 'S' : ''} — {installedApps.filter(t => !APP_META.find(a => a.type === t)?.preInstalled).length} USER-INSTALLED
        </div>

        {/* App list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {visible.length === 0 ? (
            <div style={{
              padding: 24,
              textAlign: 'center',
              fontFamily: 'var(--font-h)',
              fontSize: 8,
              color: '#404040',
              letterSpacing: '0.1em',
            }}>
              NO APPS FOUND
            </div>
          ) : (
            visible.map(app => (
              <AppRow
                key={app.type}
                app={app}
                installed={installedApps.includes(app.type)}
                onInstall={() => installApp(app.type)}
                onUninstall={() => uninstallApp(app.type)}
              />
            ))
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '5px 14px',
          fontFamily: 'var(--font-h)',
          fontSize: 7,
          color: '#303038',
          letterSpacing: '0.1em',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          SYSTEM APPS CANNOT BE REMOVED — USER APPS ARE RESTORED ON RELOAD
        </div>
      </div>
    </Window>
  )
}
