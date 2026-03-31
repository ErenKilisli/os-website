'use client'
import { useState } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

type Tab = 'Display' | 'Sound' | 'Network' | 'About'

const TABS: Tab[] = ['Display', 'Sound', 'Network', 'About']

interface Props {
  win: WindowState
  isMobile?: boolean
}

export function SettingsWindow({ win, isMobile = false }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Display')

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
          {TABS.map(tab => (
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
          {activeTab === 'Display' && (
            <>
              <div className="srow">
                <label>Theme:</label>
                <div className="sfake-select">
                  <span>CYBERCORE</span>
                  <span>▼</span>
                </div>
              </div>
              <div className="srow">
                <label>Resolution:</label>
                <div className="sfake-select">
                  <span>1920×1080</span>
                  <span>▼</span>
                </div>
              </div>
              <div className="srow">
                <label>Color Depth:</label>
                <div className="sradio">
                  <div className="sradio-opt">
                    <span>○</span>
                    <span>16-bit</span>
                  </div>
                  <div className="sradio-opt">
                    <span>◉</span>
                    <span>32-bit</span>
                  </div>
                </div>
              </div>
              <div className="srow">
                <label>Refresh Rate:</label>
                <div className="sradio">
                  <div className="sradio-opt">
                    <span>○</span>
                    <span>60Hz</span>
                  </div>
                  <div className="sradio-opt">
                    <span>◉</span>
                    <span>144Hz</span>
                  </div>
                </div>
              </div>
              <div className="sbtn-row">
                <button className="sbtn">Cancel</button>
                <button className="sbtn">Apply</button>
                <button className="sbtn">OK</button>
              </div>
            </>
          )}
          {activeTab === 'Sound' && (
            <>
              <div className="srow">
                <label>Master Volume:</label>
                <div className="sfake-select"><span>████████░░  80%</span></div>
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
                <span style={{ fontFamily: 'var(--font-vt)', fontSize: '14px', color: '#008000' }}>● CONNECTED</span>
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
          {activeTab === 'About' && (
            <>
              <div className="srow" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: '#000080', marginBottom: '4px' }}>EREN.OS</div>
                <div style={{ fontFamily: 'var(--font-vt)', fontSize: '15px', color: '#000' }}>Version 0.0.2 (Build 2025)</div>
                <div style={{ fontFamily: 'var(--font-vt)', fontSize: '14px', color: '#444' }}>Copyright © 2025 Eren Kilisli</div>
              </div>
              <div className="srow">
                <label>Processor:</label>
                <span style={{ fontFamily: 'var(--font-vt)', fontSize: '14px' }}>Creative Engine @ ∞ GHz</span>
              </div>
              <div className="srow">
                <label>Memory:</label>
                <span style={{ fontFamily: 'var(--font-vt)', fontSize: '14px' }}>∞ MB RAM (all used for ideas)</span>
              </div>
              <div className="srow">
                <label>Disk:</label>
                <span style={{ fontFamily: 'var(--font-vt)', fontSize: '14px' }}>Projects: 47 GB free</span>
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
