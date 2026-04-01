'use client'
import { useState } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { useSystemStore, Theme, Wallpaper, THEME_LABELS, WALLPAPER_LABELS } from '@/store/systemStore'

type Tab = 'Display' | 'Sound' | 'Network' | 'About'
const TABS: Tab[] = ['Display', 'Sound', 'Network', 'About']

const THEMES: Theme[] = ['cybercore', 'vaporwave', 'matrix', 'amber']
const WALLPAPERS: Wallpaper[] = ['synthwave', 'grid', 'stars', 'scanlines']

interface Props {
  win: WindowState
  isMobile?: boolean
}

export function SettingsWindow({ win, isMobile = false }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Display')
  const { volume, brightness, theme, wallpaper, setVolume, setBrightness, setTheme, setWallpaper } = useSystemStore()

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
                <label>Brightness:</label>
                <div className="sslider-wrap">
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="sslider"
                  />
                  <span className="sslider-val">{brightness}%</span>
                </div>
              </div>
              <div className="srow">
                <label>Theme:</label>
                <div className="stheme-grid">
                  {THEMES.map((t) => (
                    <button
                      key={t}
                      className={`stheme-btn theme-${t}${theme === t ? ' active' : ''}`}
                      onClick={() => setTheme(t)}
                    >
                      {THEME_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="srow">
                <label>Wallpaper:</label>
                <div className="swallpaper-grid">
                  {WALLPAPERS.map((w) => (
                    <button
                      key={w}
                      className={`swp-btn${wallpaper === w ? ' active' : ''}`}
                      onClick={() => setWallpaper(w)}
                    >
                      {WALLPAPER_LABELS[w]}
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

          {/* ── Sound ── */}
          {activeTab === 'Sound' && (
            <>
              <div className="srow">
                <label>Master Volume:</label>
                <div className="sslider-wrap">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="sslider"
                  />
                  <span className="sslider-val">{volume}%</span>
                </div>
              </div>
              <div className="srow">
                <label>Vol Level:</label>
                <div className="svol-bar">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="svol-seg"
                      style={{ opacity: i < Math.round(volume / 10) ? 1 : 0.15 }}
                    />
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
                <div className="sfake-select"><span>EREN.OS Classic</span><span>▼</span></div>
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

          {/* ── About ── */}
          {activeTab === 'About' && (
            <>
              <div className="srow" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <div style={{ fontFamily: 'var(--font-h)', fontSize: '9px', color: 'var(--primary)', marginBottom: '4px', fontWeight: 900 }}>EREN.OS</div>
                <div style={{ fontFamily: 'var(--font-b)', fontSize: '15px' }}>Version 0.1.0 (Build 2025)</div>
                <div style={{ fontFamily: 'var(--font-b)', fontSize: '14px', color: '#444' }}>Copyright © 2025 Eren Kilisli</div>
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
