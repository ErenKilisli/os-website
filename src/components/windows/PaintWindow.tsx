'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

type Tool = 'pencil' | 'eraser' | 'fill' | 'rect' | 'ellipse' | 'line'

const PALETTE = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24',
  '#ff7f27', '#fff200', '#22b14c', '#00a2e8',
  '#3f48cc', '#a349a4', '#ffffff', '#c3c3c3',
  '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0',
  '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
]

const BRUSH_SIZES = [1, 2, 4, 8]

const TOOLS: { id: Tool; icon: string; label: string }[] = [
  { id: 'pencil',  icon: 'edit',         label: 'Pencil'  },
  { id: 'eraser',  icon: 'ink_eraser',   label: 'Eraser'  },
  { id: 'fill',    icon: 'format_color_fill', label: 'Fill' },
  { id: 'line',    icon: 'show_chart',   label: 'Line'    },
  { id: 'rect',    icon: 'rectangle',    label: 'Rect'    },
  { id: 'ellipse', icon: 'circle',       label: 'Ellipse' },
]

export function PaintWindow({ win, isMobile = false }: { win: WindowState; isMobile?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const snapshotRef = useRef<ImageData | null>(null)
  const [tool, setTool] = useState<Tool>('pencil')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(2)
  const [drawing, setDrawing] = useState(false)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const [canvasSize, setCanvasSize] = useState({ w: 480, h: 320 })

  // Init white canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [canvasSize])

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    }
  }

  // Flood fill
  const floodFill = useCallback((canvas: HTMLCanvasElement, startX: number, startY: number, fillColor: string) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width

    const idx = (x: number, y: number) => (y * width + x) * 4
    const target = data.slice(idx(startX, startY), idx(startX, startY) + 4)

    const fill = parseInt(fillColor.slice(1), 16)
    const fr = (fill >> 16) & 255
    const fg = (fill >> 8) & 255
    const fb = fill & 255

    if (target[0] === fr && target[1] === fg && target[2] === fb) return

    const match = (i: number) =>
      data[i] === target[0] && data[i + 1] === target[1] &&
      data[i + 2] === target[2] && data[i + 3] === target[3]

    const stack = [[startX, startY]]
    while (stack.length) {
      const [x, y] = stack.pop()!
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue
      const i = idx(x, y)
      if (!match(i)) continue
      data[i] = fr; data[i + 1] = fg; data[i + 2] = fb; data[i + 3] = 255
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
    ctx.putImageData(imageData, 0, 0)
  }, [])

  const drawShape = useCallback((
    ctx: CanvasRenderingContext2D,
    tool: Tool,
    x0: number, y0: number,
    x1: number, y1: number,
    col: string,
    size: number,
  ) => {
    ctx.strokeStyle = col
    ctx.fillStyle = col
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (tool === 'line') {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke()
    } else if (tool === 'rect') {
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0)
    } else if (tool === 'ellipse') {
      ctx.beginPath()
      ctx.ellipse(
        (x0 + x1) / 2, (y0 + y1) / 2,
        Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2,
        0, 0, Math.PI * 2
      )
      ctx.stroke()
    }
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (tool === 'fill') {
      floodFill(canvas, pos.x, pos.y, color)
      return
    }

    setDrawing(true)
    startRef.current = pos

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
      ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    } else {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }
  }, [tool, color, brushSize, floodFill])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const pos = getPos(e)
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    if (tool === 'pencil' || tool === 'eraser') {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (startRef.current) {
      const oCtx = overlay.getContext('2d')
      if (!oCtx || !snapshotRef.current) return
      oCtx.clearRect(0, 0, overlay.width, overlay.height)
      drawShape(oCtx, tool, startRef.current.x, startRef.current.y, pos.x, pos.y, color, brushSize)
    }
  }, [drawing, tool, color, brushSize, drawShape])

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    setDrawing(false)
    const pos = getPos(e)
    const canvas = canvasRef.current
    const overlay = overlayRef.current
    if (!canvas || !overlay) return

    if ((tool === 'line' || tool === 'rect' || tool === 'ellipse') && startRef.current && snapshotRef.current) {
      const ctx = canvas.getContext('2d')
      const oCtx = overlay.getContext('2d')
      if (!ctx || !oCtx) return
      ctx.putImageData(snapshotRef.current, 0, 0)
      drawShape(ctx, tool, startRef.current.x, startRef.current.y, pos.x, pos.y, color, brushSize)
      oCtx.clearRect(0, 0, overlay.width, overlay.height)
    }
    startRef.current = null
  }, [drawing, tool, color, brushSize, drawShape])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'paint-artwork.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const W = canvasSize.w
  const H = canvasSize.h

  return (
    <Window win={win} menu={['File', 'Edit', 'View', 'Help']} status={`PAINT.EXE | ${tool.toUpperCase()} | ${color.toUpperCase()} | ${brushSize}px`} isMobile={isMobile}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div className="paint-toolbar">
          {/* Tools */}
          <div className="paint-tool-group">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`paint-tool-btn${tool === t.id ? ' active' : ''}`}
                onClick={() => setTool(t.id)}
                title={t.label}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{t.icon}</span>
              </button>
            ))}
          </div>

          <div className="paint-toolbar-sep" />

          {/* Brush sizes */}
          <div className="paint-tool-group">
            {BRUSH_SIZES.map((sz) => (
              <button
                key={sz}
                className={`paint-size-btn${brushSize === sz ? ' active' : ''}`}
                onClick={() => setBrushSize(sz)}
                title={`${sz}px`}
              >
                <div style={{ width: sz * 2 + 2, height: sz * 2 + 2, borderRadius: '50%', background: '#000', margin: 'auto' }} />
              </button>
            ))}
          </div>

          <div className="paint-toolbar-sep" />

          {/* Actions */}
          <div className="paint-tool-group">
            <button className="paint-action-btn" onClick={clearCanvas} title="Clear">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
              <span>CLR</span>
            </button>
            <button className="paint-action-btn" onClick={downloadCanvas} title="Save PNG">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>
              <span>SAVE</span>
            </button>
          </div>

          {/* Active color swatch */}
          <div className="paint-active-color" style={{ background: color }} title={color} />
        </div>

        {/* Canvas area */}
        <div className="paint-canvas-area">
          <div style={{ position: 'relative', display: 'inline-block', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}>
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              style={{ display: 'block', imageRendering: 'pixelated' }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />
            <canvas
              ref={overlayRef}
              width={W}
              height={H}
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* Color palette */}
        <div className="paint-palette">
          {PALETTE.map((c) => (
            <button
              key={c}
              className={`paint-swatch${color === c ? ' active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
          {/* Custom color */}
          <label className="paint-custom-color" title="Custom color">
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>colorize</span>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </Window>
  )
}
