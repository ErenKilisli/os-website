import { useState, useRef, useEffect } from 'react'

export function useColumnResize(initialTypeW: number, initialYearW: number) {
  const [nameW, setNameW] = useState<string | number>('1fr')
  const [typeW, setTypeW] = useState(initialTypeW)
  const [yearW, setYearW] = useState(initialYearW)
  
  const dragState = useRef<{
    col: 'name' | 'type' | 'year';
    startX: number;
    startNameW: number;
    startTypeW: number;
    startYearW: number;
  } | null>(null)

  const onMouseDown = (col: 'name' | 'type' | 'year', e: React.MouseEvent, nameEl?: HTMLElement | null) => {
    e.preventDefault()
    e.stopPropagation()
    const nameRect = nameEl?.getBoundingClientRect()
    
    dragState.current = {
      col,
      startX: e.clientX,
      startNameW: nameRect ? nameRect.width : (typeof nameW === 'number' ? nameW : 150),
      startTypeW: typeW,
      startYearW: yearW,
    }
    
    if (col === 'name' && nameW === '1fr' && nameRect) {
      setNameW(nameRect.width)
    }
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const { col, startX, startNameW, startTypeW, startYearW } = dragState.current
      const deltaX = e.clientX - startX

      if (col === 'name') {
        setNameW(Math.max(40, startNameW + deltaX))
      } else if (col === 'type') {
        setTypeW(Math.max(40, startTypeW + deltaX))
      } else if (col === 'year') {
        setYearW(Math.max(30, startYearW + deltaX))
      }
    }
    
    const onMouseUp = () => {
      dragState.current = null
    }

    if (dragState.current !== undefined) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [typeW, yearW, nameW])

  const colsString = `30px ${typeof nameW === 'number' ? nameW + 'px' : nameW} ${typeW}px ${yearW}px`

  return { colsString, onMouseDown }
}
