'use client'
/**
 * Icon registry — maps WindowType → custom React icon nodes at various sizes.
 *
 * Kept separate from appRegistry.tsx so Window.tsx can import it
 * without creating a circular dependency (appRegistry → window components → Window → appRegistry).
 *
 * Sizes:
 *   titlebar — 14 px, shown next to the window title
 *   market   — 32 px, shown in App Market listing cards
 */

import React from 'react'
import {
  PaintBrushIcon,
  SnowboarderPixelIcon,
} from '@/components/desktop/FolderIcons'
import type { WindowType } from './appMeta'

export const TITLEBAR_ICONS: Partial<Record<WindowType, React.ReactNode>> = {
  paint:     <PaintBrushIcon size={14} />,
  snowboard: <SnowboarderPixelIcon size={14} />,
}

export const MARKET_ICONS: Partial<Record<WindowType, React.ReactNode>> = {
  paint:     <PaintBrushIcon size={30} />,
  snowboard: <SnowboarderPixelIcon size={30} />,
}
