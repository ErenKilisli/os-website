import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: '#020812',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace',
        }}
      >
        {/* Cyan border */}
        <div style={{
          position: 'absolute', inset: 0,
          border: '4px solid #00ffff',
          display: 'flex',
        }} />
        <div style={{ fontSize: 100, display: 'flex', lineHeight: 1 }}>🦎</div>
      </div>
    ),
    { ...size },
  )
}