'use client'
import { useCallback } from 'react'
import { useSystemStore } from '@/store/systemStore'

let sharedCtx: AudioContext | null = null
function getCtx(): AudioContext {
  if (!sharedCtx) sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') sharedCtx.resume()
  return sharedCtx
}

// Bell-like sine tone — soft attack, natural exponential decay
function ding(
  ctx: AudioContext,
  freq: number,
  duration: number,
  vol: number,
  delayMs = 0
) {
  if (vol <= 0) return
  setTimeout(() => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.015)       // soft attack
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration + 0.05)
  }, delayMs)
}

// Richer ding — adds quiet octave harmonic for warmth (Win95 piano-like feel)
function richDing(
  ctx: AudioContext,
  freq: number,
  duration: number,
  vol: number,
  delayMs = 0
) {
  ding(ctx, freq,      duration,       vol,         delayMs)  // fundamental
  ding(ctx, freq * 2,  duration * 0.5, vol * 0.12,  delayMs)  // octave harmonic
}

export function useSounds() {
  const volume = useSystemStore((s) => s.volume)
  const v = useCallback((scale = 1) => (volume / 100) * 0.18 * scale, [volume])

  // OPEN: Ascending D5 → G5 (perfect 4th up — Win95 maximize style)
  const playOpen = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    richDing(ctx, 587, 0.22, v(),       0)   // D5
    richDing(ctx, 784, 0.28, v(0.85),  85)   // G5
  }, [volume, v])

  // CLOSE: Descending G5 → D5 (reverse of open — Win95 close style)
  const playClose = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    richDing(ctx, 784, 0.18, v(0.8),   0)    // G5
    richDing(ctx, 587, 0.22, v(0.65), 70)    // D5
  }, [volume, v])

  // MINIMIZE: Quick descending D5 → B4 (smaller interval, quicker)
  const playMinimize = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    ding(ctx, 587, 0.14, v(0.55),  0)        // D5
    ding(ctx, 494, 0.17, v(0.40), 60)        // B4
  }, [volume, v])

  // CLICK: Near-silent soft sine tick (Win95 "ding" style)
  const playClick = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    ding(ctx, 900, 0.025, v(0.20), 0)
  }, [volume, v])

  // STARTUP: Win95-inspired warm ascending chord (F major — royalty-free, original feel)
  // Win95 original used E major; this uses F major for different character
  const playStartup = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    const vol = v(0.78)
    const notes = [
      { freq: 349, dur: 0.60, delay:   0 },  // F4  — first breath
      { freq: 440, dur: 0.60, delay: 150 },  // A4
      { freq: 523, dur: 0.65, delay: 320 },  // C5
      { freq: 698, dur: 0.60, delay: 500 },  // F5
      { freq: 880, dur: 1.10, delay: 680 },  // A5  — final long hold
    ]
    notes.forEach(({ freq, dur, delay }) => richDing(ctx, freq, dur, vol, delay))
  }, [volume, v])

  // SHUTDOWN: Descending F major — system powering down (reverse of startup)
  const playShutdown = useCallback(() => {
    if (volume === 0) return
    const ctx = getCtx()
    const vol = v(0.72)
    const notes = [
      { freq: 698, dur: 0.55, delay:   0 },  // F5
      { freq: 523, dur: 0.55, delay: 160 },  // C5
      { freq: 440, dur: 0.60, delay: 330 },  // A4
      { freq: 349, dur: 0.90, delay: 500 },  // F4  ← long final fade
    ]
    notes.forEach(({ freq, dur, delay }) => richDing(ctx, freq, dur, vol * (1 - delay / 2000), delay))
  }, [volume, v])

  return { playOpen, playClose, playMinimize, playClick, playStartup, playShutdown }
}