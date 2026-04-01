'use client'
import { useCallback, useRef } from 'react'
import { useSystemStore } from '@/store/systemStore'

let sharedCtx: AudioContext | null = null
function getCtx(): AudioContext {
  if (!sharedCtx) sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}

function beep(
  ctx: AudioContext,
  freq: number,
  duration: number,
  vol: number,
  type: OscillatorType = 'square',
  delayMs = 0
) {
  if (vol <= 0) return
  setTimeout(() => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration + 0.01)
  }, delayMs)
}

export function useSounds() {
  const volume = useSystemStore((s) => s.volume)

  const v = useCallback(() => (volume / 100) * 0.12, [volume])

  const playOpen = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    const vol = v()
    beep(ctx, 880, 0.07, vol)
    beep(ctx, 1320, 0.07, vol * 0.7, 'square', 70)
  }, [volume, v])

  const playClose = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    beep(ctx, 440, 0.1, v())
  }, [volume, v])

  const playMinimize = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    beep(ctx, 660, 0.06, v() * 0.6)
  }, [volume, v])

  const playClick = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    beep(ctx, 1400, 0.025, v() * 0.3)
  }, [volume, v])

  const playStartup = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    const vol = v()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => beep(ctx, freq, 0.14, vol * 0.9, 'square', i * 110))
  }, [volume, v])

  return { playOpen, playClose, playMinimize, playClick, playStartup }
}
