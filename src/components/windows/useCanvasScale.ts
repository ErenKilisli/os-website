'use client'
import { useEffect, useRef } from 'react'

/**
 * Scales a canvas element (via CSS) to fill its container up to a max scale factor.
 * The logical canvas dimensions (CW × CH) stay fixed; only the display size changes.
 * A 28px height offset is reserved for the in-game HUD bar.
 */
export function useCanvasScale(
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  logicalWidth: number,
  logicalHeight: number,
  maxScale: number,
) {
  useEffect(() => {
    const scaleCanvas = () => {
      const container = containerRef.current
      const canvas = canvasRef.current
      if (!container || !canvas) return
      const scaleX = container.clientWidth / logicalWidth
      const scaleY = (container.clientHeight - 28) / logicalHeight
      const scale = Math.min(scaleX, scaleY, maxScale)
      canvas.style.width  = `${Math.round(logicalWidth  * scale)}px`
      canvas.style.height = `${Math.round(logicalHeight * scale)}px`
    }
    scaleCanvas()
    const observer = new ResizeObserver(scaleCanvas)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
