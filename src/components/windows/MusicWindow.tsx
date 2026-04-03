'use client'
import { useState, useEffect, useRef } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

const TRACKS = [
  { title: 'NEON_DRIVE',    artist: 'OS.WEBSITE OST', duration: '3:42' },
  { title: 'GRID_RUSH',     artist: 'OS.WEBSITE OST', duration: '4:17' },
  { title: 'CYBER_DAWN',    artist: 'OS.WEBSITE OST', duration: '2:58' },
  { title: 'MATRIX_BLOOM',  artist: 'OS.WEBSITE OST', duration: '5:03' },
  { title: 'PIXEL_WAVE',    artist: 'OS.WEBSITE OST', duration: '3:29' },
  { title: 'SIGNAL_LOST',   artist: 'OS.WEBSITE OST', duration: '4:44' },
]

const BAR_COUNT = 20

export function MusicWindow({ win, isMobile = false }: Props) {
  const [playing, setPlaying]       = useState(false)
  const [trackIdx, setTrackIdx]     = useState(0)
  const [progress, setProgress]     = useState(0)
  const [volume, setVolume]         = useState(80)
  const [bars, setBars]             = useState<number[]>(Array(BAR_COUNT).fill(4))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const barIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const track = TRACKS[trackIdx]

  // Progress ticker
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setTrackIdx(i => (i + 1) % TRACKS.length)
            return 0
          }
          return p + 100 / (parseFloat(track.duration) * 60 / 0.1)
        })
      }, 100)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, track.duration])

  // Visualizer bars
  useEffect(() => {
    if (playing) {
      barIntervalRef.current = setInterval(() => {
        setBars(Array.from({ length: BAR_COUNT }, () => Math.floor(Math.random() * 28) + 2))
      }, 80)
    } else {
      if (barIntervalRef.current) clearInterval(barIntervalRef.current)
      setBars(Array(BAR_COUNT).fill(4))
    }
    return () => { if (barIntervalRef.current) clearInterval(barIntervalRef.current) }
  }, [playing])

  const togglePlay = () => setPlaying(p => !p)
  const prev = () => { setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0) }
  const next = () => { setTrackIdx(i => (i + 1) % TRACKS.length); setProgress(0) }

  const elapsed = (() => {
    const [m, s] = track.duration.split(':').map(Number)
    const total = m * 60 + s
    const sec = Math.floor((progress / 100) * total)
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
  })()

  return (
    <Window win={win} menu={['File', 'View', 'Help']} status={`MUSIC | ${track.title}`} isMobile={isMobile}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#020812' }}>

        {/* Visualizer */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          gap: 2, height: 48, padding: '4px 12px', background: '#000',
          borderBottom: '1px solid #0a1628',
        }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              width: 8,
              height: h,
              background: playing
                ? `hsl(${180 + i * 8}, 100%, ${40 + h}%)`
                : '#1a2a3a',
              transition: 'height 0.08s, background 0.3s',
              flexShrink: 0,
            }} />
          ))}
        </div>

        {/* Now playing */}
        <div style={{ padding: '10px 12px 6px', borderBottom: '1px solid #0a1628' }}>
          <div style={{ fontFamily: 'var(--font-h)', fontSize: 9, color: '#00ffff', letterSpacing: '0.12em', marginBottom: 3 }}>
            NOW PLAYING
          </div>
          <div style={{ fontFamily: 'var(--font-b)', fontSize: 18, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {track.title}
          </div>
          <div style={{ fontFamily: 'var(--font-b)', fontSize: 13, color: '#4a6080' }}>{track.artist}</div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '6px 12px' }}>
          <div
            style={{ height: 6, background: '#0a1628', cursor: 'pointer', position: 'relative' }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              setProgress(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <div style={{ height: '100%', width: `${progress}%`, background: '#00ffff', transition: 'width 0.1s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080' }}>{elapsed}</span>
            <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080' }}>{track.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '4px 12px 8px' }}>
          {[
            { icon: 'skip_previous', action: prev },
            { icon: playing ? 'pause' : 'play_arrow', action: togglePlay, primary: true },
            { icon: 'skip_next', action: next },
          ].map(({ icon, action, primary }) => (
            <button
              key={icon}
              onClick={action}
              style={{
                width: primary ? 36 : 28, height: primary ? 36 : 28,
                background: primary ? '#00ffff' : '#0a1628',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: primary ? '#000' : '#00ffff',
                boxShadow: primary ? '0 0 12px rgba(0,255,255,0.4)' : 'none',
                transition: 'all 0.1s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: primary ? 20 : 16 }}>{icon}</span>
            </button>
          ))}
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px 8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#4a6080' }}>
            {volume === 0 ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
          </span>
          <input
            type="range" min={0} max={100} value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#00ffff', height: 3 }}
          />
          <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080', minWidth: 24 }}>{volume}%</span>
        </div>

        {/* Track list */}
        <div style={{ flex: 1, overflow: 'auto', borderTop: '1px solid #0a1628' }}>
          {TRACKS.map((t, i) => (
            <div
              key={i}
              onClick={() => { setTrackIdx(i); setProgress(0) }}
              onDoubleClick={() => { setTrackIdx(i); setProgress(0); setPlaying(true) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 12px', cursor: 'pointer',
                background: i === trackIdx ? 'rgba(0,255,255,0.08)' : 'transparent',
                borderLeft: i === trackIdx ? '2px solid #00ffff' : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080', minWidth: 14 }}>
                  {i === trackIdx && playing ? '▶' : String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-b)', fontSize: 14, color: i === trackIdx ? '#00ffff' : '#8090a0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.title}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#4a6080', flexShrink: 0 }}>{t.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  )
}
