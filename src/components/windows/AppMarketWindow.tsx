'use client'
import React, { useState } from 'react'
import { Window } from './Window'
import { WindowState, useWindowStore } from '@/store/windowStore'
import { APP_META, AppMeta, WindowType } from '@/config/appMeta'
import { MARKET_ICONS } from '@/config/iconRegistry'

// Apps shown in market
const MARKET_APPS: AppMeta[] = APP_META.filter(a =>
  a.type !== 'projectdetail' &&
  a.type !== 'cinema' &&
  a.type !== 'arcade' &&
  a.type !== 'swr' &&
  a.type !== 'appmarket' &&
  a.type !== 'sysinfo'
)
const SYSTEM_APPS   = MARKET_APPS.filter(a =>  a.preInstalled)
const OPTIONAL_APPS = MARKET_APPS.filter(a => !a.preInstalled)

// ── Dark Win95 tokens ──────────────────────────────────────────────
const D = {
  bg:     '#14161e',
  card:   '#1e2030',
  navy:   '#484fb9',
  white:  '#d0d2d8',
  dim:    '#6070a0',
  gray:   '#2a3040',
  raised: 'inset 1.5px 1.5px 0 rgba(255,255,255,0.10), inset -1.5px -1.5px 0 rgba(0,0,0,0.45)',
  sunken: 'inset 2px 2px 0 rgba(0,0,0,0.45), inset -1px -1px 0 rgba(255,255,255,0.07)',
  font:   'var(--font-h)',
}

// ── Win95-style button ─────────────────────────────────────────────
function Btn({ children, onClick, primary, danger, style }: {
  children: React.ReactNode
  onClick?: () => void
  primary?: boolean
  danger?: boolean
  style?: React.CSSProperties
}) {
  const [active, setActive] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      style={{
        fontFamily: D.font,
        fontSize: 7,
        padding: '4px 10px',
        cursor: 'pointer',
        border: 'none',
        letterSpacing: '0.08em',
        background: primary ? D.navy : danger ? 'transparent' : D.card,
        color:   primary ? '#fff' : danger ? '#cc5555' : D.white,
        boxShadow: active
          ? D.sunken
          : danger
            ? `inset 0 0 0 1px #cc5555`
            : D.raised,
        transition: 'box-shadow 0.05s',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ── App icon ──────────────────────────────────────────────────────
function AppIcon({ type, icon, iconColor, size = 22 }: {
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

// ── Single app row ─────────────────────────────────────────────────
function AppRow({ app, isInstalled, isInstalling, onInstall, onUninstall }: {
  app: AppMeta
  isInstalled: boolean
  isInstalling: boolean
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
        background: hov ? 'rgba(255,255,255,0.03)' : D.card,
        boxShadow: D.sunken,
        marginBottom: 6,
        transition: 'background 0.1s',
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        background: D.bg, boxShadow: D.raised,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AppIcon type={app.type} icon={app.icon} iconColor={app.iconColor} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: D.font, fontSize: 9, color: D.white,
          letterSpacing: '0.06em', marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {app.label}
        </div>
        <div style={{
          fontFamily: D.font, fontSize: 6, color: D.dim,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {app.spotlightDesc}
        </div>
      </div>

      {/* Action */}
      {app.preInstalled ? (
        <div style={{
          fontFamily: D.font, fontSize: 6, color: D.dim,
          border: `1px solid ${D.gray}`, padding: '4px 7px', flexShrink: 0,
        }}>
          SYSTEM
        </div>
      ) : isInstalling ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: D.font, fontSize: 6, color: '#9097ff',
          border: '1px solid #9097ff', background: '#2a3050',
          padding: '4px 7px', flexShrink: 0,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            border: '1.5px solid #5060c0', borderTopColor: '#9097ff',
            animation: 'spin 0.7s linear infinite',
          }} />
          LOADING
        </div>
      ) : isInstalled ? (
        <Btn danger onClick={onUninstall}>REMOVE</Btn>
      ) : (
        <Btn primary onClick={onInstall}>INSTALL</Btn>
      )}
    </div>
  )
}

// ── Tab button ─────────────────────────────────────────────────────
function Tab({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '7px 0',
        fontFamily: D.font, fontSize: 8,
        border: 'none', cursor: 'pointer', letterSpacing: '0.08em',
        background: active ? D.navy : D.card,
        color: active ? '#fff' : D.dim,
        boxShadow: active ? D.sunken : D.raised,
        transition: 'all 0.1s',
      }}
    >
      {children}
    </button>
  )
}

// ── Main window ───────────────────────────────────────────────────
export function AppMarketWindow({ win, isMobile }: { win: WindowState; isMobile?: boolean }) {
  const { installedApps, installApp, uninstallApp } = useWindowStore()
  const [tab, setTab] = useState<'install' | 'system'>('install')
  const [installing, setInstalling] = useState<Partial<Record<WindowType, boolean>>>({})

  const handleInstall = (type: WindowType) => {
    setInstalling(p => ({ ...p, [type]: true }))
    setTimeout(() => {
      installApp(type)
      setInstalling(p => ({ ...p, [type]: false }))
    }, 1400)
  }

  const appsToList = tab === 'system' ? SYSTEM_APPS : OPTIONAL_APPS
  const installedCount = installedApps.filter(t => !APP_META.find(a => a.type === t)?.preInstalled).length

  return (
    <Window
      win={win}
      isMobile={isMobile}
      menu={[]}
      status={`${installedCount} user app(s) installed · ${OPTIONAL_APPS.length - installedCount} available`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: D.bg }}>

        {/* Header */}
        <div style={{
          padding: '10px 12px 8px',
          background: D.card,
          borderBottom: `2px solid rgba(72,79,185,0.45)`,
          display: 'flex', alignItems: 'center', gap: 10,
          flexShrink: 0,
          boxShadow: D.raised,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#7080ff' }}>storefront</span>
          <div>
            <div style={{ fontFamily: D.font, fontSize: 10, color: D.white, letterSpacing: '0.1em' }}>
              LIZARD.OS APP MARKET
            </div>
            <div style={{ fontFamily: D.font, fontSize: 6, color: D.dim, marginTop: 1 }}>
              {SYSTEM_APPS.length} system · {OPTIONAL_APPS.length} optional · {installedCount} installed
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, padding: '8px 10px 0', flexShrink: 0 }}>
          <Tab active={tab === 'install'} onClick={() => setTab('install')}>INSTALL APPS</Tab>
          <Tab active={tab === 'system'}  onClick={() => setTab('system')}>SYSTEM APPS</Tab>
        </div>

        {/* App list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px 4px' }}>
          {appsToList.length === 0 && (
            <div style={{
              padding: '24px 10px', textAlign: 'center',
              fontFamily: D.font, fontSize: 7, color: D.gray, letterSpacing: '0.1em',
            }}>
              {tab === 'install' ? 'ALL APPS INSTALLED' : 'NO SYSTEM APPS'}
            </div>
          )}
          {appsToList.map(app => {
            const isInstalled = app.preInstalled || installedApps.includes(app.type)
            return (
              <AppRow
                key={app.type}
                app={app}
                isInstalled={isInstalled}
                isInstalling={!!installing[app.type]}
                onInstall={() => handleInstall(app.type)}
                onUninstall={() => uninstallApp(app.type)}
              />
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '4px 10px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: D.font, fontSize: 6, color: D.gray,
          letterSpacing: '0.1em', flexShrink: 0,
        }}>
          SYSTEM APPS CANNOT BE REMOVED
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Window>
  )
}
