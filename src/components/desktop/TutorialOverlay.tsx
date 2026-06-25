'use client'
import { motion } from 'framer-motion'

const bounce = {
  animate: { y: [0, -6, 0] },
  transition: { repeat: Infinity, duration: 1.4 },
}

const bounceRight = {
  animate: { x: [0, 6, 0] },
  transition: { repeat: Infinity, duration: 1.4 },
}

export function TutorialOverlay({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(2,8,18,0.55)',
        zIndex: 99990,
        cursor: 'pointer',
        pointerEvents: 'all',
      }}
    >
      {/* ── Top arrow → navbar ── */}
      <div style={{
        position: 'absolute',
        top: 52,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'none',
      }}>
        <motion.div {...bounce} style={{ color: '#00ffff', fontSize: 26, lineHeight: 1 }}>▲</motion.div>
        <div style={{
          fontFamily: 'var(--font-h)',
          fontSize: 9,
          color: '#00ffff',
          letterSpacing: '0.12em',
          textAlign: 'center',
          textShadow: '0 0 12px rgba(0,255,255,0.6)',
          lineHeight: 1.7,
        }}>
          NAVBAR<br />
          <span style={{ color: 'rgba(0,255,255,0.55)', fontSize: 8 }}>VIEWS · SEARCH · SETTINGS</span>
        </div>
      </div>

      {/* ── Center message ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        maxWidth: 340,
        padding: '0 24px',
      }}>
        <div style={{
          fontFamily: 'var(--font-h)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '0.14em',
          lineHeight: 1.9,
          textShadow: '0 0 20px rgba(0,255,255,0.3)',
        }}>
          Bu portfolyo sitesi bir<br />
          <span style={{ color: '#00ffff' }}>işletim sistemi</span> gibi tasarlanmıştır.<br />
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 8, letterSpacing: '0.1em' }}>
            İkonlara tıkla · Pencereleri sürükle
          </span>
        </div>
        <div style={{
          marginTop: 28,
          fontFamily: 'var(--font-h)',
          fontSize: 8,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.2em',
        }}>
          [ CLICK ANYWHERE TO DISMISS ]
        </div>
      </div>

      {/* ── Right arrow → icons ── */}
      <div style={{
        position: 'absolute',
        right: 80,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'var(--font-h)',
          fontSize: 8,
          color: '#00ffff',
          letterSpacing: '0.12em',
          textAlign: 'center',
          textShadow: '0 0 12px rgba(0,255,255,0.6)',
          lineHeight: 1.7,
          marginBottom: 4,
        }}>
          PROJELER<br />
          <span style={{ color: 'rgba(0,255,255,0.55)', fontSize: 7 }}>İKONLARA TIKLA</span>
        </div>
        <motion.div {...bounceRight} style={{ color: '#00ffff', fontSize: 26, lineHeight: 1 }}>▶</motion.div>
      </div>
    </motion.div>
  )
}
