'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSystemStore } from '@/store/systemStore'

export function SystemTray() {
  const [open, setOpen] = useState(false)
  const { volume, brightness, setVolume, setBrightness } = useSystemStore()

  const volIcon =
    volume === 0 ? 'volume_off' : volume < 40 ? 'volume_down' : 'volume_up'
  const briIcon =
    brightness < 45 ? 'brightness_low' : brightness < 75 ? 'brightness_medium' : 'brightness_high'

  return (
    <div className="sys-tray">
      {/* Fake status indicators */}
      <span className="tray-ico material-symbols-outlined" title="NETWORK: CONNECTED">wifi</span>
      <span className="tray-ico material-symbols-outlined" title="POWER: ∞%">bolt</span>

      {/* Toggle button */}
      <button
        className={`tray-toggle${open ? ' active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="System controls"
      >
        <span className="material-symbols-outlined">{volIcon}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="tray-overlay" onClick={() => setOpen(false)} />
            <motion.div
              className="tray-panel"
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.12 }}
            >
              <div className="tray-panel-title">SYSTEM CONTROLS</div>
              <div className="tray-panel-body">
                {/* Volume */}
                <div className="tray-row">
                  <span className="material-symbols-outlined tray-row-ico">{volIcon}</span>
                  <span className="tray-row-lbl">VOLUME</span>
                  <div className="tray-slider-wrap">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="tray-slider"
                    />
                  </div>
                  <span className="tray-val">{volume}</span>
                </div>

                {/* Brightness */}
                <div className="tray-row">
                  <span className="material-symbols-outlined tray-row-ico">{briIcon}</span>
                  <span className="tray-row-lbl">BRIGHT</span>
                  <div className="tray-slider-wrap">
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="tray-slider"
                    />
                  </div>
                  <span className="tray-val">{brightness}</span>
                </div>

                <div className="tray-divider" />

                {/* Status rows */}
                <div className="tray-status-row">
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>wifi</span>
                  <span>NETWORK_V1</span>
                  <span className="tray-dot-on">●</span>
                </div>
                <div className="tray-status-row">
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>bolt</span>
                  <span>POWER: ∞%</span>
                  <span className="tray-dot-on">●</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
