'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import {
  useSystemStore, Theme, Wallpaper, CursorStyle, ViewMode, UiMode,
  THEME_LABELS, WALLPAPER_LABELS, CURSOR_LABELS,
  ANIMATED_WALLPAPERS, SOLID_COLORS,
} from '@/store/systemStore'

type Tab = 'Display' | 'Wallpaper' | 'Appearance' | 'Sound' | 'Network' | 'SysInfo' | 'About'
const TABS: Tab[] = ['Display', 'Wallpaper', 'Appearance', 'Sound', 'Network', 'SysInfo', 'About']

const THEMES: Theme[] = ['cybercore', 'vaporwave', 'matrix', 'amber']
const CURSORS: CursorStyle[] = ['cyberwave', 'pixel', 'box']

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-h)', fontSize: 8, color: 'var(--primary)',
  letterSpacing: '0.15em', marginBottom: 8,
}

const PRESET_WALLPAPERS: { id: Wallpaper; label: string; preview: string }[] = [
  { id: 'preset-aurora',  label: 'AURORA',     preview: 'linear-gradient(135deg,#010810 0%,#00b4a0 40%,#6644ff 70%,#010810 100%)' },
  { id: 'preset-sunset',  label: 'SUNSET',     preview: 'linear-gradient(180deg,#0a0525 0%,#8b1a4a 50%,#d4502a 75%,#0a0410 100%)' },
  { id: 'preset-ocean',   label: 'OCEAN DEEP', preview: 'linear-gradient(180deg,#000a14 0%,#002030 60%,#001018 100%)' },
]

interface Props {
  win: WindowState
  isMobile?: boolean
}

export function SettingsWindow({ win, isMobile = false }: Props) {
  const {
    volume, brightness, theme, wallpaper, wallpaperColor, wallpaperPhoto,
    cursorStyle, viewMode, uiMode, settingsInitTab,
    setVolume, setBrightness, setTheme, setWallpaper, setWallpaperColor, setWallpaperPhoto,
    setCursorStyle, setViewMode, setUiMode, setSettingsInitTab,
  } = useSystemStore()

  const [activeTab, setActiveTab] = useState<Tab>('Display')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync tab when settingsInitTab changes (e.g. opened from context menu)
  useEffect(() => {
    if (settingsInitTab && TABS.includes(settingsInitTab as Tab)) {
      setActiveTab(settingsInitTab as Tab)
      setSettingsInitTab('')
    }
  }, [settingsInitTab, setSettingsInitTab])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      setWallpaperPhoto(url)
      setWallpaper('photo')
    }
    reader.readAsDataURL(file)
  }

  return (
    <Window
      win={win}
      menu={['File', 'Edit', 'Help']}
      status="SETTINGS.EXE | System Configuration"
      isMobile={isMobile}
    >
      <div className="settings-wrap">
        {/* Tabs */}
        <div className="settings-tabs">
          {TABS.map((tab) => (
            <div
              key={tab}
              className={`stab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Panel */}
        <div className="settings-panel">

          {/* ── Display ── */}
          {activeTab === 'Display' && (
            <>
              <div className="srow">
                <label>View Mode:</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {([
                    { v: 'desktop'  as ViewMode, label: 'DESKTOP',  icon: 'desktop_windows' },
                    { v: 'phone'    as ViewMode, label: 'PHONE',    icon: 'smartphone' },
                    { v: 'terminal' as ViewMode, label: 'TERMINAL', icon: 'terminal' },
                  ]).map(m => (
                    <button
                      key={m.v}
                      className={`swp-btn${viewMode === m.v ? ' active' : ''}`}
                      onClick={() => setViewMode(m.v)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="srow">
                <label>Brightness:</label>
                <div className="sslider-wrap">
                  <input type="range" min={20} max={100} value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))} className="sslider" />
                  <span className="sslider-val">{brightness}%</span>
                </div>
              </div>
              <div className="srow">
                <label>Theme:</label>
                <div className="stheme-grid">
                  {THEMES.map((t) => (
                    <button key={t} className={`stheme-btn theme-${t}${theme === t ? ' active' : ''}`}
                      onClick={() => setTheme(t)}>
                      {THEME_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="srow">
                <label>Cursor:</label>
                <div className="swallpaper-grid">
                  {CURSORS.map((c) => (
                    <button key={c} className={`swp-btn${cursorStyle === c ? ' active' : ''}`}
                      onClick={() => setCursorStyle(c)}>
                      {CURSOR_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="srow">
                <label>Resolution:</label>
                <div className="sfake-select"><span>1920×1080</span><span>▼</span></div>
              </div>
              <div className="srow">
                <label>Color Depth:</label>
                <div className="sradio">
                  <div className="sradio-opt"><span>○</span><span>16-bit</span></div>
                  <div className="sradio-opt"><span>◉</span><span>32-bit</span></div>
                </div>
              </div>
              <div className="sbtn-row">
                <button className="sbtn">Cancel</button>
                <button className="sbtn">Apply</button>
                <button className="sbtn">OK</button>
              </div>
            </>
          )}

          {/* ── Wallpaper ── */}
          {activeTab === 'Wallpaper' && (
            <>
              {/* Animated wallpapers */}
              <div style={SECTION_LABEL}>ANIMATED</div>
              <div className="swallpaper-grid" style={{ marginBottom: 14 }}>
                {ANIMATED_WALLPAPERS.map((w) => (
                  <button key={w} className={`swp-btn${wallpaper === w ? ' active' : ''}`}
                    onClick={() => setWallpaper(w)}>
                    {WALLPAPER_LABELS[w]}
                  </button>
                ))}
              </div>

              {/* Solid colors */}
              <div style={SECTION_LABEL}>SOLID COLOR</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {SOLID_COLORS.map((sc) => (
                  <button
                    key={sc.hex}
                    onClick={() => { setWallpaperColor(sc.hex); setWallpaper('solid') }}
                    title={sc.name}
                    style={{
                      width: 36, height: 36,
                      background: sc.hex,
                      border: wallpaper === 'solid' && wallpaperColor === sc.hex
                        ? '3px solid var(--primary)'
                        : '2px solid rgba(255,255,255,0.25)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      boxShadow: wallpaper === 'solid' && wallpaperColor === sc.hex
                        ? '0 0 8px rgba(72,79,185,0.6)' : 'none',
                    }}
                  />
                ))}
                {/* Custom color picker */}
                <label title="Custom color" style={{ position: 'relative', cursor: 'pointer' }}>
                  <div style={{
                    width: 36, height: 36,
                    background: 'linear-gradient(135deg,#ff0040,#ff6600,#ffee00,#00dd44,#00aaff,#7744ff,#ff00cc)',
                    border: '2px solid rgba(255,255,255,0.25)',
                    borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fff', textShadow: '0 1px 2px #000' }}>colorize</span>
                  </div>
                  <input type="color" value={wallpaperColor}
                    onChange={(e) => { setWallpaperColor(e.target.value); setWallpaper('solid') }}
                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                </label>
              </div>

              {/* Preset photos */}
              <div style={SECTION_LABEL}>PRESET PHOTOS</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {PRESET_WALLPAPERS.map((pw) => (
                  <button
                    key={pw.id}
                    onClick={() => setWallpaper(pw.id)}
                    style={{
                      width: 72, height: 48,
                      background: pw.preview,
                      border: wallpaper === pw.id
                        ? '3px solid var(--primary)'
                        : '2px solid rgba(255,255,255,0.20)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                      padding: '0 0 3px',
                      boxShadow: wallpaper === pw.id ? '0 0 10px rgba(72,79,185,0.5)' : 'none',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-h)', fontSize: 6,
                      color: '#fff', letterSpacing: '0.08em',
                      textShadow: '0 1px 3px #000',
                    }}>{pw.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom photo upload */}
              <div style={SECTION_LABEL}>CUSTOM PHOTO</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  className="sbtn"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>
                  UPLOAD IMAGE
                </button>
                {wallpaperPhoto && (
                  <button
                    className={`swp-btn${wallpaper === 'photo' ? ' active' : ''}`}
                    onClick={() => setWallpaper('photo')}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>photo</span>
                    USE UPLOADED
                  </button>
                )}
              </div>
              {wallpaperPhoto && (
                <div style={{ marginTop: 8 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wallpaperPhoto}
                    alt="Custom wallpaper preview"
                    style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                </div>
              )}

              <div className="sbtn-row" style={{ marginTop: 14 }}>
                <button className="sbtn">Apply</button>
                <button className="sbtn">OK</button>
              </div>
            </>
          )}

          {/* ── Appearance (Light/Dark mode) ── */}
          {activeTab === 'Appearance' && (
            <>
              <div style={{ ...SECTION_LABEL, marginBottom: 12 }}>WINDOW CHROME MODE</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {([
                  {
                    mode: 'dark' as UiMode,
                    label: 'DARK MODE',
                    desc: 'Dark gray panels',
                    preview: 'linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)',
                    textColor: '#ffffff',
                  },
                  {
                    mode: 'light' as UiMode,
                    label: 'LIGHT MODE',
                    desc: 'White panels',
                    preview: 'linear-gradient(135deg,#f0f0f0 0%,#ffffff 100%)',
                    textColor: '#000000',
                  },
                ]).map(opt => (
                  <button
                    key={opt.mode}
                    onClick={() => setUiMode(opt.mode)}
                    style={{
                      flex: 1, height: 80,
                      background: opt.preview,
                      border: uiMode === opt.mode
                        ? '3px solid var(--primary)'
                        : '2px solid rgba(128,128,128,0.4)',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: 4,
                      boxShadow: uiMode === opt.mode
                        ? 'inset 1.5px 1.5px 0 rgba(255,255,255,0.5), 0 0 12px rgba(72,79,185,0.4)'
                        : 'inset 1.5px 1.5px 0 rgba(255,255,255,0.3)',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-h)', fontSize: 9,
                      color: opt.textColor, fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}>{opt.label}</span>
                    <span style={{
                      fontFamily: 'var(--font-h)', fontSize: 7,
                      color: opt.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                    }}>{opt.desc}</span>
                    {uiMode === opt.mode && (
                      <span style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: 'var(--primary)' }}>✓ ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>

              <div style={SECTION_LABEL}>PREVIEW</div>
              <div style={{
                background: uiMode === 'dark' ? '#2a2a2a' : '#f0f0f0',
                border: '2px solid rgba(128,128,128,0.4)',
                borderRadius: 4,
                padding: 10,
                marginBottom: 14,
                boxShadow: 'inset 1.5px 1.5px 0 rgba(255,255,255,0.5), inset -1.5px -1.5px 0 rgba(0,0,0,0.2)',
              }}>
                <div style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: uiMode === 'dark' ? '#ffffff' : '#000000', marginBottom: 4 }}>
                  Window Chrome Preview
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['#cc0000','#cccc00','#00cc00'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{
                  marginTop: 6, padding: '4px 8px',
                  background: uiMode === 'dark' ? '#1a1a1a' : '#ffffff',
                  border: `1px solid ${uiMode === 'dark' ? '#444' : '#ccc'}`,
                  fontFamily: 'var(--font-b)', fontSize: 11,
                  color: uiMode === 'dark' ? '#c8d8e8' : '#2d2f2f',
                }}>
                  Panel content area
                </div>
              </div>

              <div className="sbtn-row">
                <button className="sbtn">Apply</button>
                <button className="sbtn">OK</button>
              </div>
            </>
          )}

          {/* ── Sound ── */}
          {activeTab === 'Sound' && (
            <>
              <div className="srow">
                <label>Master Volume:</label>
                <div className="sslider-wrap">
                  <input type="range" min={0} max={100} value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))} className="sslider" />
                  <span className="sslider-val">{volume}%</span>
                </div>
              </div>
              <div className="srow">
                <label>Vol Level:</label>
                <div className="svol-bar">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="svol-seg"
                      style={{ opacity: i < Math.round(volume / 10) ? 1 : 0.15 }} />
                  ))}
                </div>
              </div>
              <div className="srow">
                <label>Startup Sound:</label>
                <div className="sradio">
                  <div className="sradio-opt"><span>◉</span><span>Enabled</span></div>
                  <div className="sradio-opt"><span>○</span><span>Disabled</span></div>
                </div>
              </div>
              <div className="srow">
                <label>Sound Scheme:</label>
                <div className="sfake-select"><span>OS.WEBSITE Classic</span><span>▼</span></div>
              </div>
              <div className="sbtn-row">
                <button className="sbtn">Cancel</button>
                <button className="sbtn">Apply</button>
                <button className="sbtn">OK</button>
              </div>
            </>
          )}

          {/* ── Network ── */}
          {activeTab === 'Network' && (
            <>
              <div className="srow">
                <label>Connection:</label>
                <div className="sfake-select"><span>LAN (Ethernet)</span><span>▼</span></div>
              </div>
              <div className="srow">
                <label>IP Address:</label>
                <div className="sfake-select"><span>192.168.1.42</span></div>
              </div>
              <div className="srow">
                <label>Status:</label>
                <span style={{ fontFamily: 'var(--font-b)', fontSize: '14px', color: '#008000' }}>● CONNECTED</span>
              </div>
              <div className="srow">
                <label>Firewall:</label>
                <div className="sradio">
                  <div className="sradio-opt"><span>◉</span><span>Active</span></div>
                  <div className="sradio-opt"><span>○</span><span>Disabled</span></div>
                </div>
              </div>
              <div className="sbtn-row">
                <button className="sbtn">Cancel</button>
                <button className="sbtn">Apply</button>
                <button className="sbtn">OK</button>
              </div>
            </>
          )}

          {/* ── SysInfo ── */}
          {activeTab === 'SysInfo' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #0a1628' }}>
                <div style={{ width: 44, height: 44, background: '#000', border: '2px solid #00ffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(0,255,255,0.2)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#00ffff' }}>memory</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 10, color: '#fff', letterSpacing: '0.1em' }}>OS.WEBSITE</div>
                  <div style={{ fontFamily: 'var(--font-b)', fontSize: 12, color: '#4a6080' }}>Build 2026 · Registered to: Ibrahim Eren Kilisli</div>
                </div>
              </div>
              {[
                { section: 'HARDWARE', rows: [
                  { label: 'OS',        value: 'OS.WEBSITE LIZARD VERSION (Build 2026)' },
                  { label: 'PROCESSOR', value: 'Creative Engine™ @ ∞ GHz' },
                  { label: 'MEMORY',    value: '∞ MB RAM · 0 MB available' },
                  { label: 'STORAGE',   value: '/projects/eren/ · 47 GB free' },
                  { label: 'DISPLAY',   value: '1920×1080 · 32-bit TrueColor' },
                  { label: 'UPTIME',    value: '26 years, 0 months, 0 days' },
                ]},
                { section: 'TECH STACK', rows: [
                  { label: 'FRAMEWORK', value: 'Next.js 15 (Turbopack)' },
                  { label: 'LANGUAGE',  value: 'TypeScript 5' },
                  { label: 'STYLING',   value: 'Tailwind CSS v4' },
                  { label: 'ANIMATION', value: 'Framer Motion' },
                  { label: 'STATE',     value: 'Zustand (persist)' },
                  { label: 'CANVAS',    value: 'HTML5 Canvas' },
                  { label: 'DEPLOY',    value: 'Vercel (Edge Runtime)' },
                ]},
              ].map(({ section, rows }) => (
                <div key={section} style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#00ffff', letterSpacing: '0.15em', marginBottom: 4, paddingBottom: 3, borderBottom: '1px solid #00ffff' }}>{section}</div>
                  {rows.map(r => (
                    <div key={r.label} style={{ display: 'flex', gap: 8, padding: '3px 0', borderBottom: '1px solid #0a1628' }}>
                      <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080', minWidth: 70, paddingTop: 2, flexShrink: 0 }}>{r.label}</span>
                      <span style={{ fontFamily: 'var(--font-b)', fontSize: 13, color: '#c8d8e8' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* ── About ── */}
          {activeTab === 'About' && (
            <>
              <div className="srow" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <div style={{ fontFamily: 'var(--font-h)', fontSize: '9px', color: 'var(--primary)', marginBottom: '4px', fontWeight: 900 }}>OS.WEBSITE</div>
                <div style={{ fontFamily: 'var(--font-b)', fontSize: '15px' }}>Version 0.2.0 (Build 2026)</div>
                <div style={{ fontFamily: 'var(--font-b)', fontSize: '14px', color: '#444' }}>Copyright © 2026 Ibrahim Eren Kilisli</div>
                <div style={{ fontFamily: 'var(--font-b)', fontSize: '13px', color: '#888' }}>MIT License — Open Source</div>
              </div>
              <div className="srow">
                <label>Processor:</label>
                <span style={{ fontFamily: 'var(--font-b)', fontSize: '14px' }}>Creative Engine @ ∞ GHz</span>
              </div>
              <div className="srow">
                <label>Memory:</label>
                <span style={{ fontFamily: 'var(--font-b)', fontSize: '14px' }}>∞ MB RAM (all used for ideas)</span>
              </div>
              <div className="srow">
                <label>Disk:</label>
                <span style={{ fontFamily: 'var(--font-b)', fontSize: '14px' }}>Projects: 47 GB free</span>
              </div>
              <div className="sbtn-row">
                <button className="sbtn">OK</button>
              </div>
            </>
          )}
        </div>
      </div>
    </Window>
  )
}
