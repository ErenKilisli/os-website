'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import {
  useSystemStore, Theme, Wallpaper, CursorStyle, ViewMode, UiMode,
  THEME_LABELS, WALLPAPER_LABELS, CURSOR_LABELS,
  ANIMATED_WALLPAPERS, SOLID_COLORS,
} from '@/store/systemStore'

// Photo wallpaper imports
import imgRice      from '@/img/wallpaper/pexels-jplenio-1146708.jpg'
import imgDawn      from '@/img/wallpaper/pexels-lastly-1671630.jpg'
import imgIstanbul  from '@/img/wallpaper/pexels-muhammed-mahsum-tunc-859110584-35389651.jpg'
import imgLizard    from '@/img/wallpaper/pexels-litti-lens-680831702-31598217.jpg'
import imgHighland  from '@/img/wallpaper/pexels-cmrcn-27756912.jpg'
import imgJaguar    from '@/img/wallpaper/pexels-benni-fish-40038242-17528288.jpg'

const imgSrc = (img: { src: string } | string) =>
  typeof img === 'string' ? img : img.src

const ANIMAL_ICONS = [
  '🦎','🐉','🐈','🐕','🐺','🦊','🐻','🦁','🐯','🐨',
  '🐼','🦝','🦋','🦅','🦉','🐸','🐙','🦑','🦈','🐬',
  '🦔','🐇','🦦','🐊','🦕','🦖','🐳','🦜','🦚','🐧',
]

type Tab = 'Display' | 'Wallpaper' | 'Appearance' | 'Sound' | 'User' | 'System'
const TABS: { id: Tab; icon: string }[] = [
  { id: 'Display',    icon: 'desktop_windows' },
  { id: 'Wallpaper',  icon: 'wallpaper' },
  { id: 'Appearance', icon: 'palette' },
  { id: 'Sound',      icon: 'volume_up' },
  { id: 'User',       icon: 'person' },
  { id: 'System',     icon: 'memory' },
]

const THEMES: Theme[]      = ['cybercore', 'vaporwave', 'matrix', 'amber']
const CURSORS: CursorStyle[] = ['cyberwave', 'pixel', 'box']


const PHOTO_WALLPAPERS: { id: Wallpaper; label: string; img: { src: string } | string }[] = [
  { id: 'preset-rice',     label: 'RICE FIELD', img: imgRice },
  { id: 'preset-dawn',     label: 'DAWN PEAKS', img: imgDawn },
  { id: 'preset-istanbul', label: 'ISTANBUL',   img: imgIstanbul },
  { id: 'preset-lizard',   label: 'LIZARD',     img: imgLizard },
  { id: 'preset-highland', label: 'HIGHLAND',   img: imgHighland },
  { id: 'preset-jaguar',   label: 'JAGUAR',     img: imgJaguar },
]

const SECTION: React.CSSProperties = {
  fontFamily: 'var(--font-h)', fontSize: 7, color: 'var(--primary)',
  letterSpacing: '0.15em', marginBottom: 8, marginTop: 14,
  paddingBottom: 4, borderBottom: '1px solid rgba(72,79,185,0.3)',
}

interface Props { win: WindowState; isMobile?: boolean }

export function SettingsWindow({ win, isMobile = false }: Props) {
  const {
    volume, brightness, theme, wallpaper, wallpaperColor, wallpaperPhoto,
    cursorStyle, viewMode, uiMode, settingsInitTab,
    userName, userIcon, loginPassword,
    setVolume, setBrightness, setTheme, setWallpaper, setWallpaperColor, setWallpaperPhoto,
    setCursorStyle, setViewMode, setUiMode, setSettingsInitTab,
    setUserName, setUserIcon, setLoginPassword,
  } = useSystemStore()

  const [activeTab, setActiveTab] = useState<Tab>('Display')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draftName, setDraftName] = useState(userName)
  const [draftPass, setDraftPass] = useState(loginPassword)
  const [showPass, setShowPass] = useState(false)

  // Real browser sys info
  const [sysInfo, setSysInfo] = useState({
    resolution: '—',
    colorDepth: '—',
    platform: '—',
    cores: '—',
    memory: '—',
    lang: '—',
    ua: '—',
    online: false,
    uptime: '—',
  })

  useEffect(() => {
    const loadedAt = Date.now()
    const update = () => {
      const secs = Math.floor((Date.now() - loadedAt) / 1000)
      const h = Math.floor(secs / 3600)
      const m = Math.floor((secs % 3600) / 60)
      const s = secs % 60
      setSysInfo({
        resolution: `${window.screen.width}×${window.screen.height} (viewport ${window.innerWidth}×${window.innerHeight})`,
        colorDepth: `${window.screen.colorDepth}-bit`,
        platform:   navigator.platform || '—',
        cores:      String(navigator.hardwareConcurrency ?? '—'),
        // @ts-expect-error deviceMemory not in all TS libs
        memory:     navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '—',
        lang:       navigator.language,
        ua:         navigator.userAgent.slice(0, 60) + '…',
        online:     navigator.onLine,
        uptime:     `${h}h ${m}m ${s}s`,
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Navigate to tab from external trigger
  useEffect(() => {
    const TAB_IDS = TABS.map(t => t.id)
    if (settingsInitTab && TAB_IDS.includes(settingsInitTab as Tab)) {
      setActiveTab(settingsInitTab as Tab)
      setSettingsInitTab('')
    }
  }, [settingsInitTab, setSettingsInitTab])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      setWallpaperPhoto(url)
      setWallpaper('photo')
    }
    reader.readAsDataURL(file)
  }

  return (
    <Window win={win} menu={[]} status="SETTINGS.EXE" isMobile={isMobile}>
      <div className="settings-wrap">

        {/* ── Tab sidebar ── */}
        <div className="settings-tabs">
          {TABS.map(t => (
            <div
              key={t.id}
              className={`stab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{t.icon}</span>
              {t.id}
            </div>
          ))}
        </div>

        {/* ── Panel ── */}
        <div className="settings-panel">

          {/* ─── DISPLAY ─── */}
          {activeTab === 'Display' && (
            <>
              <div style={SECTION}>VIEW MODE</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { v: 'desktop'  as ViewMode, label: 'DESKTOP',  icon: 'desktop_windows' },
                  { v: 'phone'    as ViewMode, label: 'PHONE',    icon: 'smartphone' },
                  { v: 'terminal' as ViewMode, label: 'TERMINAL', icon: 'terminal' },
                ]).map(m => (
                  <button key={m.v} className={`swp-btn${viewMode === m.v ? ' active' : ''}`}
                    onClick={() => setViewMode(m.v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              <div style={SECTION}>BRIGHTNESS</div>
              <div className="sslider-wrap">
                <input type="range" min={20} max={100} value={brightness}
                  onChange={e => setBrightness(Number(e.target.value))} className="sslider" />
                <span className="sslider-val">{brightness}%</span>
              </div>
            </>
          )}

          {/* ─── WALLPAPER ─── */}
          {activeTab === 'Wallpaper' && (
            <>
              <div style={SECTION}>ANIMATED</div>
              <div className="swallpaper-grid" style={{ marginBottom: 6 }}>
                {ANIMATED_WALLPAPERS.map(w => (
                  <button key={w} className={`swp-btn${wallpaper === w ? ' active' : ''}`}
                    onClick={() => setWallpaper(w)}>
                    {WALLPAPER_LABELS[w]}
                  </button>
                ))}
              </div>

              <div style={SECTION}>SOLID COLOR</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                {SOLID_COLORS.map(sc => (
                  <button key={sc.hex} onClick={() => { setWallpaperColor(sc.hex); setWallpaper('solid') }}
                    title={sc.name} style={{
                      width: 32, height: 32, background: sc.hex,
                      border: wallpaper === 'solid' && wallpaperColor === sc.hex
                        ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                    }} />
                ))}
                <label title="Custom color" style={{ position: 'relative', cursor: 'pointer' }}>
                  <div style={{
                    width: 32, height: 32, cursor: 'pointer',
                    background: 'linear-gradient(135deg,#ff0040,#ff6600,#ffee00,#00dd44,#00aaff,#7744ff,#ff00cc)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff', textShadow: '0 1px 2px #000' }}>colorize</span>
                  </div>
                  <input type="color" value={wallpaperColor}
                    onChange={e => { setWallpaperColor(e.target.value); setWallpaper('solid') }}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                </label>
              </div>

              <div style={SECTION}>PHOTO GALLERY</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                {PHOTO_WALLPAPERS.map(pw => (
                  <button key={pw.id} onClick={() => setWallpaper(pw.id)} style={{
                    width: 80, height: 52, padding: 0, cursor: 'pointer',
                    backgroundImage: `url(${imgSrc(pw.img)})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    border: wallpaper === pw.id ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.18)',
                    position: 'relative',
                    boxShadow: wallpaper === pw.id ? '0 0 10px rgba(72,79,185,0.5)' : 'none',
                  }}>
                    <span style={{
                      position: 'absolute', bottom: 2, left: 0, right: 0,
                      fontFamily: 'var(--font-h)', fontSize: 5, color: '#fff',
                      textAlign: 'center', textShadow: '0 1px 3px #000',
                      letterSpacing: '0.06em',
                    }}>
                      {pw.label}
                    </span>
                  </button>
                ))}
              </div>

              <div style={SECTION}>CUSTOM PHOTO</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <button className="sbtn" onClick={() => fileInputRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>
                  UPLOAD IMAGE
                </button>
                {wallpaperPhoto && (
                  <button className={`swp-btn${wallpaper === 'photo' ? ' active' : ''}`}
                    onClick={() => setWallpaper('photo')}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>photo</span>
                    USE UPLOADED
                  </button>
                )}
              </div>
              {wallpaperPhoto && (
                <div style={{ marginTop: 8 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={wallpaperPhoto} alt="Custom wallpaper preview"
                    style={{ width: 110, height: 70, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />
                </div>
              )}
            </>
          )}

          {/* ─── APPEARANCE ─── */}
          {activeTab === 'Appearance' && (
            <>
              <div style={SECTION}>THEME</div>
              <div className="stheme-grid">
                {THEMES.map(t => (
                  <button key={t} className={`stheme-btn theme-${t}${theme === t ? ' active' : ''}`}
                    onClick={() => setTheme(t)}>
                    {THEME_LABELS[t]}
                  </button>
                ))}
              </div>

              <div style={SECTION}>CURSOR STYLE</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CURSORS.map(c => (
                  <button key={c} className={`swp-btn${cursorStyle === c ? ' active' : ''}`}
                    onClick={() => setCursorStyle(c)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_selector_tool</span>
                    {CURSOR_LABELS[c]}
                  </button>
                ))}
              </div>

              <div style={SECTION}>WINDOW CHROME</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {([
                  { mode: 'dark'  as UiMode, label: 'DARK',  desc: 'Dark panels',  preview: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)', text: '#fff' },
                  { mode: 'light' as UiMode, label: 'LIGHT', desc: 'White panels', preview: 'linear-gradient(135deg,#f0f0f0,#ffffff)', text: '#000' },
                ]).map(opt => (
                  <button key={opt.mode} onClick={() => setUiMode(opt.mode)} style={{
                    flex: 1, height: 70, background: opt.preview,
                    border: uiMode === opt.mode ? '3px solid var(--primary)' : '2px solid rgba(128,128,128,0.35)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 3,
                    boxShadow: uiMode === opt.mode ? '0 0 12px rgba(72,79,185,0.4)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: opt.text, letterSpacing: '0.08em' }}>{opt.label}</span>
                    <span style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: opt.mode === 'light' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)' }}>{opt.desc}</span>
                    {uiMode === opt.mode && <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: 'var(--primary)' }}>✓ ACTIVE</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ─── SOUND ─── */}
          {activeTab === 'Sound' && (
            <>
              <div style={SECTION}>MASTER VOLUME</div>
              <div className="sslider-wrap">
                <input type="range" min={0} max={100} value={volume}
                  onChange={e => setVolume(Number(e.target.value))} className="sslider" />
                <span className="sslider-val">{volume}%</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div className="svol-bar">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="svol-seg"
                      style={{ opacity: i < Math.round(volume / 10) ? 1 : 0.15 }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ─── USER ─── */}
          {activeTab === 'User' && (
            <>
              {/* Current profile preview */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '10px 12px', marginBottom: 4,
                background: '#020812', border: '1px solid rgba(0,255,255,0.15)',
              }}>
                <div style={{
                  width: 48, height: 48, background: '#000',
                  border: '2px solid #00ffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, boxShadow: '0 0 12px rgba(0,255,255,0.2)', flexShrink: 0,
                }}>
                  {userIcon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 10, color: '#00ffff', letterSpacing: '0.1em' }}>
                    {userName}
                  </div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#404860', letterSpacing: '0.1em', marginTop: 4 }}>
                    LIZARD.OS USER ACCOUNT
                  </div>
                </div>
              </div>

              <div style={SECTION}>ANIMAL ICON</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {ANIMAL_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setUserIcon(icon)}
                    title={icon}
                    style={{
                      width: 34, height: 34, fontSize: 18,
                      background: userIcon === icon ? 'rgba(0,255,255,0.15)' : 'transparent',
                      border: userIcon === icon ? '2px solid #00ffff' : '2px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer', borderRadius: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: userIcon === icon ? '0 0 8px rgba(0,255,255,0.3)' : 'none',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <div style={SECTION}>DISPLAY NAME</div>
              <input
                type="text"
                value={draftName}
                maxLength={14}
                onChange={e => setDraftName(e.target.value.toUpperCase())}
                style={{
                  background: '#000', width: '100%', boxSizing: 'border-box',
                  border: '2px solid', borderTopColor: '#404040', borderLeftColor: '#404040',
                  borderBottomColor: '#00ffff', borderRightColor: '#00ffff',
                  color: '#00ffff', fontFamily: 'monospace', fontSize: 14,
                  padding: '6px 8px', outline: 'none', letterSpacing: '0.12em',
                }}
              />

              <div style={SECTION}>LOCK SCREEN PASSWORD</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={draftPass}
                  placeholder="leave blank to disable"
                  onChange={e => setDraftPass(e.target.value)}
                  style={{
                    background: '#000', flex: 1,
                    border: '2px solid', borderTopColor: '#404040', borderLeftColor: '#404040',
                    borderBottomColor: '#00ffff', borderRightColor: '#00ffff',
                    color: '#00ffff', fontFamily: 'monospace', fontSize: 13,
                    padding: '6px 8px', outline: 'none', letterSpacing: '0.1em',
                  }}
                />
                <button
                  onClick={() => setShowPass(s => !s)}
                  className="swp-btn"
                  style={{ padding: '5px 8px', flexShrink: 0 }}
                  title={showPass ? 'Hide' : 'Show'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 6, color: '#303850', letterSpacing: '0.1em', marginTop: 5 }}>
                SHOWN ON LOGIN SCREEN IF SET
              </div>

              {/* Save button */}
              <button
                className="sbtn"
                onClick={() => { setUserName(draftName || 'USER'); setLoginPassword(draftPass) }}
                style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>save</span>
                SAVE PROFILE
              </button>
            </>
          )}

          {/* ─── SYSTEM ─── */}
          {activeTab === 'System' && (
            <>
              {/* OS header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 0 10px', marginBottom: 6,
                borderBottom: '1px solid rgba(0,255,255,0.15)',
              }}>
                <div style={{
                  width: 40, height: 40, background: '#000',
                  border: '2px solid #00ffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(0,255,255,0.2)', flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#00ffff' }}>memory</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#fff', letterSpacing: '0.1em' }}>
                    LIZARD.OS
                  </div>
                  <div style={{ fontFamily: 'var(--font-vt)', fontSize: 13, color: '#a0b8d0' }}>
                    Build 2026 · Registered to: Ibrahim Eren Kilisli
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-h)', fontSize: 7, color: sysInfo.online ? '#00dd44' : '#dd4444' }}>
                  ● {sysInfo.online ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>

              {/* Browser info */}
              {[
                {
                  title: 'DISPLAY',
                  rows: [
                    { label: 'RESOLUTION', value: sysInfo.resolution },
                    { label: 'COLOR DEPTH', value: sysInfo.colorDepth },
                  ],
                },
                {
                  title: 'HARDWARE',
                  rows: [
                    { label: 'PLATFORM',  value: sysInfo.platform },
                    { label: 'CPU CORES', value: sysInfo.cores },
                    { label: 'MEMORY',    value: sysInfo.memory },
                    { label: 'LANGUAGE',  value: sysInfo.lang },
                    { label: 'UPTIME',    value: sysInfo.uptime },
                  ],
                },
                {
                  title: 'TECH STACK',
                  rows: [
                    { label: 'FRAMEWORK', value: 'Next.js 16 (Turbopack)' },
                    { label: 'LANGUAGE',  value: 'TypeScript 5' },
                    { label: 'ANIMATION', value: 'Framer Motion 12' },
                    { label: 'STATE',     value: 'Zustand (persist)' },
                    { label: 'DEPLOY',    value: 'Vercel (Edge Runtime)' },
                  ],
                },
              ].map(({ title, rows }) => (
                <div key={title} style={{ marginBottom: 10 }}>
                  <div style={{
                    fontFamily: 'var(--font-h)', fontSize: 7, color: '#00ffff',
                    letterSpacing: '0.15em', marginBottom: 4, paddingBottom: 3,
                    borderBottom: '1px solid rgba(0,255,255,0.25)',
                  }}>{title}</div>
                  {rows.map(r => (
                    <div key={r.label} style={{
                      display: 'flex', gap: 8, padding: '3px 0',
                      borderBottom: '1px solid #0a1628',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-h)', fontSize: 6, color: '#8aa8c4',
                        minWidth: 72, paddingTop: 2, flexShrink: 0, letterSpacing: '0.06em',
                      }}>{r.label}</span>
                      <span style={{ fontFamily: 'var(--font-vt)', fontSize: 14, color: '#e8f0f8' }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              ))}

              {/* About */}
              <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid #0a1628' }}>
                <div style={{ fontFamily: 'var(--font-vt)', fontSize: 13, color: '#a0b8d0' }}>
                  Version 0.2.0 (Build 2026) · MIT License · © 2026 Ibrahim Eren Kilisli
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Window>
  )
}
