'use client'
import { useEffect, useRef } from 'react'
import { useWindowStore } from '@/store/windowStore'
import { useSounds } from '@/hooks/useSounds'

export function SoundManager() {
  const windows = useWindowStore((s) => s.windows)
  const { playOpen, playClose } = useSounds()
  const prevLen = useRef(windows.length)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      prevLen.current = windows.length
      return
    }
    if (windows.length > prevLen.current) playOpen()
    else if (windows.length < prevLen.current) playClose()
    prevLen.current = windows.length
  }, [windows.length, playOpen, playClose])

  return null
}
