'use client'
import React, { useState } from 'react'
import { Window } from './Window'
import { WindowState, useWindowStore } from '@/store/windowStore'
import { APP_META, AppMeta, WindowType } from '@/config/appMeta'
import { MARKET_ICONS } from '@/config/iconRegistry'

// Apps shown in market — excludes internal/legacy entries and sysinfo
const MARKET_APPS: AppMeta[] = APP_META.filter(a =>
  a.type !== 'projectdetail' &&
  a.type !== 'cinema' &&
  a.type !== 'arcade' &&
  a.type !== 'swr' &&
  a.type !== 'appmarket' &&
  a.type !== 'sysinfo'
)

const SYSTEM_APPS  = MARKET_APPS.filter(a => a.preInstalled)
const OPTIONAL_APPS = MARKET_APPS.filter(a => !a.preInstalled)

function AppIcon({ type, icon, iconColor, size = 28 }: {
  type: WindowType; icon: string; iconColor: string; size?: number
}) {
  const custom = MARKET_ICONS[type]
  if (custom) return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {custom}
    </div>
  )
  if ([...icon].length === 1 && icon.charCodeAt(0) > 255)
    return <span style={{ fontSize: size * 0.78, lineHeight: 1 }}>{icon}</span>
  return (
    <span className="material-symbols-outlined" style={{ fontSize: size, color: iconColor, lineHeight: 1 }}>
      {icon}
    </span>
  )
}

// ── Single app card ────────────────────────────────────────────────────
function AppCard({
  app, installed, installing, onInstall, onUninstall,
}: {
  app: AppMeta
  installed: boolean
  installing: boolean
  onInstall: () => void
  onUninstall: () => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px',
        background: hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'background 0.12s',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AppIcon type={app.type} icon={app.icon} iconColor={app.iconColor} size={22} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-h)', fontSize: 8, color: '#d0d2d8',
          letterSpacing: '0.06em', marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {app.label}
        </div>
        <div style={{
          fontFamily: 'var(--font-vt)', fontSize: 12, color: '#484e60',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {app.spotlightDesc}
        </div>
      </div>

      {/* Action */}
      {app.preInstalled ? (
        <span style={{
          fontFamily: 'var(--font-h)', fontSize: 7, color: '#404858',
          border: '1px solid #2a3040', padding: '3px 7px', flexShrink: 0,
        }}>SYSTEM</span>
      ) : installing ? (
        <div style={{
          width: 64, height: 22, flexShrink: 0,
          background: '#2a3050', border: '1px solid #3a4880',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 4,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            border: '1.5px solid #5060c0',
            borderTopColor: '#9097ff',
            animation: 'spin 0.7s linear infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#9097ff' }}>
            LOADING
          </span>
        </div>
      ) : installed ? (
        <button
          onClick={onUninstall}
          style={{
            fontFamily: 'var(--font-h)', fontSize: 7, color: '#cc5555',
            border: '1px solid #cc5555', background: 'transparent',
            padding: '3px 7px', cursor: 'pointer', flexShrink: 0,
          }}
        >
          REMOVE
        </button>
      ) : (
        <button
          onClick={onInstall}
          style={{
            fontFamily: 'var(--font-h)', fontSize: 7, color: '#fff',
            border: 'none', background: '#484fb9',
            padding: '4px 10px', cursor: 'pointer', flexShrink: 0,
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.25)',
          }}
        >
          INSTALL
        </button>
      )}
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────
function SectionHeader({ icon, title, count }: { icon: string; title: string; count: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 10px 6px',
      background: '#1a1c24',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 1,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#9097ff' }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#9097ff', letterSpacing: '0.1em' }}>
        {title}
      </span>
      <span style={{
        marginLeft: 'auto',
        fontFamily: 'var(--font-h)', fontSize: 7, color: '#404858',
        background: 'rgba(255,255,255,0.05)', padding: '1px 6px',
      }}>
        {count}
      </span>
    </div>
  )
}

export function AppMarketWindow({ win, isMobile }: { win: WindowState; isMobile?: boolean }) {
  const { installedApps, installApp, uninstallApp } = useWindowStore()
  // Map of type → installing state
  const [installing, setInstalling] = useState<Partial<Record<WindowType, boolean>>>({})

  const handleInstall = (type: WindowType) => {
    setInstalling(p => ({ ...p, [type]: true }))
    setTimeout(() => {
      installApp(type)
      setInstalling(p => ({ ...p, [type]: false }))
    }, 1400)
  }

  const installedOptional = OPTIONAL_APPS.filter(a => installedApps.includes(a.type))
  const availableOptional  = OPTIONAL_APPS.filter(a => !installedApps.includes(a.type))

  return (
    <Window win={win} isMobile={isMobile} menu={[]} status={`${installedApps.filter(t => !APP_META.find(a => a.type === t)?.preInstalled).length} user app(s) installed`}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#14161e' }}>

        {/* ── Header ── */}
        <div style={{
          padding: '10px 12px 8px',
          background: '#1a1c24',
          borderBottom: '2px solid rgba(72,79,185,0.4)',
          display: 'flex', alignItems: 'center', gap: 10,
          flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ff71ce' }}>storefront</span>
          <div>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: 10, color: '#d0d2d8', letterSpacing: '0.1em' }}>
              LIZARD.OS APP MARKET
            </div>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 12, color: '#404858', marginTop: 1 }}>
              {SYSTEM_APPS.length} system · {OPTIONAL_APPS.length} optional · {installedOptional.length} installed
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', gap: 1 }}>

          {/* Left: System + installed optional apps */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeader icon="check_circle" title="MY APPS" count={SYSTEM_APPS.length + installedOptional.length} />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {SYSTEM_APPS.map(app => (
                <AppCard key={app.type} app={app}
                  installed={true}
                  installing={!!installing[app.type]}
                  onInstall={() => {}}
                  onUninstall={() => {}}
                />
              ))}
              {installedOptional.map(app => (
                <AppCard key={app.type} app={app}
                  installed={true}
                  installing={!!installing[app.type]}
                  onInstall={() => {}}
                  onUninstall={() => uninstallApp(app.type)}
                />
              ))}
              {installedOptional.length === 0 && (
                <div style={{
                  padding: '14px 10px',
                  fontFamily: 'var(--font-h)', fontSize: 7,
                  color: '#2a3040', letterSpacing: '0.1em', textAlign: 'center',
                }}>
                  NO OPTIONAL APPS INSTALLED
                </div>
              )}
            </div>
          </div>

          {/* Right: Available to install */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <SectionHeader icon="download" title="AVAILABLE" count={availableOptional.length} />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {availableOptional.length === 0 ? (
                <div style={{
                  padding: '14px 10px',
                  fontFamily: 'var(--font-h)', fontSize: 7,
                  color: '#2a3040', letterSpacing: '0.1em', textAlign: 'center',
                }}>
                  ALL APPS INSTALLED
                </div>
              ) : availableOptional.map(app => (
                <AppCard key={app.type} app={app}
                  installed={false}
                  installing={!!installing[app.type]}
                  onInstall={() => handleInstall(app.type)}
                  onUninstall={() => {}}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '4px 10px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'var(--font-h)', fontSize: 6, color: '#282e40',
          letterSpacing: '0.1em', flexShrink: 0,
        }}>
          SYSTEM APPS CANNOT BE REMOVED
        </div>

        {/* Spin animation */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Window>
  )
}
