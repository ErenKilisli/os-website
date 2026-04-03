'use client'
import { useState, useEffect, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

type BtnDef = { label: string; type: 'num' | 'op' | 'action' | 'eq' | 'zero' }

const BUTTONS: BtnDef[] = [
  { label: 'C',   type: 'action' }, { label: '±',  type: 'action' }, { label: '%',  type: 'op' }, { label: '÷', type: 'op' },
  { label: '7',   type: 'num'    }, { label: '8',  type: 'num'    }, { label: '9',  type: 'num' }, { label: '×', type: 'op' },
  { label: '4',   type: 'num'    }, { label: '5',  type: 'num'    }, { label: '6',  type: 'num' }, { label: '−', type: 'op' },
  { label: '1',   type: 'num'    }, { label: '2',  type: 'num'    }, { label: '3',  type: 'num' }, { label: '+', type: 'op' },
  { label: '0',   type: 'zero'   }, { label: '.',  type: 'num'    },                               { label: '=', type: 'eq'  },
]

export function CalcWindow({ win, isMobile = false }: Props) {
  const [display, setDisplay]   = useState('0')
  const [stored, setStored]     = useState<number | null>(null)
  const [op, setOp]             = useState<string | null>(null)
  const [fresh, setFresh]       = useState(true)
  const [expr, setExpr]         = useState('')

  const compute = useCallback((a: number, operator: string, b: number): number => {
    switch (operator) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 0
      default:  return b
    }
  }, [])

  const press = useCallback((label: string) => {
    if (label === 'C') {
      setDisplay('0'); setStored(null); setOp(null); setFresh(true); setExpr(''); return
    }
    if (label === '±') {
      setDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d); return
    }
    if (label === '%') {
      setDisplay(d => String(parseFloat(d) / 100)); return
    }
    if (['+', '−', '×', '÷'].includes(label)) {
      const current = parseFloat(display)
      if (stored !== null && op && !fresh) {
        const result = compute(stored, op, current)
        setDisplay(String(parseFloat(result.toPrecision(12))))
        setStored(result)
        setExpr(String(parseFloat(result.toPrecision(12))) + ' ' + label)
      } else {
        setStored(current)
        setExpr(display + ' ' + label)
      }
      setOp(label); setFresh(true); return
    }
    if (label === '=') {
      if (stored !== null && op) {
        const result = compute(stored, op, parseFloat(display))
        const rounded = parseFloat(result.toPrecision(12))
        setExpr(expr + ' ' + display + ' =')
        setDisplay(String(rounded))
        setStored(null); setOp(null); setFresh(true)
      }
      return
    }
    // digit / decimal
    setDisplay(prev => {
      if (fresh) { setFresh(false); return label === '.' ? '0.' : label }
      if (label === '.' && prev.includes('.')) return prev
      if (prev === '0' && label !== '.') return label
      return prev + label
    })
  }, [display, stored, op, fresh, expr, compute])

  // Keyboard support
  useEffect(() => {
    const map: Record<string, string> = {
      '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
      '.':'.', '+':'+', '-':'−', '*':'×', '/':'÷', 'Enter':'=', '=':'=', 'Backspace':'C', 'Escape':'C',
    }
    const handler = (e: KeyboardEvent) => {
      const mapped = map[e.key]
      if (mapped) { e.preventDefault(); press(mapped) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [press])

  const displayNum = display.length > 12 ? parseFloat(display).toExponential(6) : display

  const BG: Record<BtnDef['type'], string> = {
    num: '#0a1628', op: '#0d2040', action: '#1a2a3a', eq: '#00ffff', zero: '#0a1628',
  }
  const COLOR: Record<BtnDef['type'], string> = {
    num: '#c8d8e8', op: '#00ffff', action: '#aabbcc', eq: '#000', zero: '#c8d8e8',
  }

  return (
    <Window win={win} menu={['Edit', 'Help']} status="CALC | Standard" isMobile={isMobile}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#020812', padding: 12, gap: 8 }}>

        {/* Expression */}
        <div style={{
          textAlign: 'right', fontFamily: 'var(--font-b)', fontSize: 12,
          color: '#4a6080', minHeight: 18, paddingRight: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {expr || ' '}
        </div>

        {/* Display */}
        <div style={{
          background: '#000', border: '1px solid #0d2040',
          padding: '8px 12px', textAlign: 'right',
          fontFamily: 'var(--font-b)', fontSize: 32, color: '#00ffff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          boxShadow: 'inset 0 0 20px rgba(0,255,255,0.05)',
        }}>
          {displayNum}
        </div>

        {/* Buttons grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, flex: 1 }}>
          {BUTTONS.map((btn, i) => {
            const isZero = btn.type === 'zero'
            return (
              <button
                key={i}
                onClick={() => press(btn.label)}
                style={{
                  gridColumn: isZero ? 'span 2' : undefined,
                  background: BG[btn.type],
                  color: COLOR[btn.type],
                  border: 'none', cursor: 'pointer',
                  fontFamily: btn.type === 'eq' ? 'var(--font-h)' : 'var(--font-b)',
                  fontSize: 20,
                  boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.06)',
                  transition: 'background 0.08s, transform 0.05s',
                  ...(btn.type === 'eq' ? { boxShadow: '0 0 12px rgba(0,255,255,0.3)' } : {}),
                }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {btn.label}
              </button>
            )
          })}
        </div>
      </div>
    </Window>
  )
}
