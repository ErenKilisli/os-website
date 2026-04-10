import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'LIZARD.OS — Ibrahim Eren Kilisli Portfolio'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: '#020812',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #020812, #0055ff 30%, #00ffff 50%, #0055ff 70%, #020812)',
          display: 'flex',
        }} />

        {/* Corner brackets TL */}
        <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 40, height: 3, background: '#00ffff', display: 'flex' }} />
          <div style={{ width: 3, height: 40, background: '#00ffff', display: 'flex' }} />
        </div>
        {/* Corner brackets TR */}
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ width: 40, height: 3, background: '#00ffff', display: 'flex' }} />
          <div style={{ width: 3, height: 40, background: '#00ffff', alignSelf: 'flex-end', display: 'flex' }} />
        </div>
        {/* Corner brackets BL */}
        <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ width: 3, height: 40, background: '#00ffff', display: 'flex' }} />
          <div style={{ width: 40, height: 3, background: '#00ffff', display: 'flex' }} />
        </div>
        {/* Corner brackets BR */}
        <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <div style={{ width: 3, height: 40, background: '#00ffff', alignSelf: 'flex-end', display: 'flex' }} />
          <div style={{ width: 40, height: 3, background: '#00ffff', display: 'flex' }} />
        </div>

        {/* Lizard emoji */}
        <div style={{ fontSize: 80, marginBottom: 8, display: 'flex' }}>🦎</div>

        {/* LIZARD.OS title */}
        <div style={{
          fontSize: 80, fontWeight: 900, color: '#00ffff',
          letterSpacing: 10,
          display: 'flex',
        }}>
          LIZARD.OS
        </div>

        {/* Horizontal divider */}
        <div style={{
          width: 480, height: 1, background: 'rgba(0,255,255,0.25)',
          margin: '18px 0', display: 'flex',
        }} />

        {/* Name */}
        <div style={{
          fontSize: 34, color: '#d0d8e8', fontWeight: 700,
          letterSpacing: 4, display: 'flex',
        }}>
          IBRAHIM EREN KILISLI
        </div>

        {/* Role tags */}
        <div style={{
          display: 'flex', gap: 16, marginTop: 16,
        }}>
          {['Game Developer', 'Filmmaker', 'Full-Stack Engineer'].map((tag) => (
            <div key={tag} style={{
              fontSize: 18, color: '#4a7080',
              border: '1px solid #1a3040',
              padding: '4px 14px',
              display: 'flex',
            }}>{tag}</div>
          ))}
        </div>

        {/* Location + URL */}
        <div style={{
          position: 'absolute', bottom: 38,
          display: 'flex', gap: 48,
          fontSize: 18, color: '#2a4a60',
        }}>
          <span style={{ display: 'flex' }}>Berlin, DE</span>
          <span style={{ color: '#1a3a50', display: 'flex' }}>·</span>
          <span style={{ display: 'flex' }}>himerenkilisli.com</span>
        </div>

        {/* Bottom accent line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #020812, #00ffff 30%, #0055ff 50%, #00ffff 70%, #020812)',
          display: 'flex',
        }} />
      </div>
    ),
    { ...size },
  )
}