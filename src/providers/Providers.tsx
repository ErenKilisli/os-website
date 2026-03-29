'use client'

import { ReactNode } from 'react'
import { SmoothScrollProvider } from './SmoothScrollProvider'
import { CustomCursor } from '@/components/ui/CustomCursor'

interface Props {
  children: ReactNode
}

/**
 * Client-side provider tree.
 * Imported by the root server layout so that server components
 * keep their full RSC benefits while client-side singletons
 * (Lenis, custom cursor) are isolated here.
 */
export function Providers({ children }: Props) {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      {children}
    </SmoothScrollProvider>
  )
}
