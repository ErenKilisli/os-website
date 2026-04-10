'use client'
/**
 * App Registry — adds React Component + custom icon nodes to each AppMeta entry.
 *
 * ── HOW TO ADD A NEW APP ──────────────────────────────────────────────────────
 *
 *  1. Add the type to WindowType in appMeta.ts
 *  2. Add an AppMeta entry (name, icon, size, flags…) to APP_META in appMeta.ts
 *  3. Import the window component below
 *  4. Add it to componentMap
 *  5. (optional) Add custom desktop/phone icons to iconMap
 *
 *  Everything else — desktop icon, phone grid tile, spotlight search,
 *  right-click menu, taskbar — is automatic.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react'
import { APP_META, type AppMeta, type WindowType } from './appMeta'
import type { WindowState } from '@/store/windowStore'

// ── Window components ────────────────────────────────────────────────────────
import { AboutWindow }         from '@/components/windows/AboutWindow'
import { MailWindow }          from '@/components/windows/MailWindow'
import { TerminalWindow }      from '@/components/windows/TerminalWindow'
import { SettingsWindow }      from '@/components/windows/SettingsWindow'
import { ProjectDetailWindow } from '@/components/windows/ProjectDetailWindow'
import { SnakeWindow }         from '@/components/windows/SnakeWindow'
import { SnowboardWindow }     from '@/components/windows/SnowboardWindow'
import { PaintWindow }         from '@/components/windows/PaintWindow'
import { MusicWindow }         from '@/components/windows/MusicWindow'
import { NotePadWindow }       from '@/components/windows/NotePadWindow'
import { CalcWindow }          from '@/components/windows/CalcWindow'
import { SysInfoWindow }       from '@/components/windows/SysInfoWindow'
import { BrowserWindow }       from '@/components/windows/BrowserWindow'
import { FileBrowserWindow }   from '@/components/windows/FileBrowserWindow'
import { AppMarketWindow }     from '@/components/windows/AppMarketWindow'
import { ReadmeWindow }        from '@/components/windows/ReadmeWindow'

// ── Icon components ──────────────────────────────────────────────────────────
import {
  SnowboarderPixelIcon,
  FolderFilmIcon,
  FolderGameIcon,
} from '@/components/desktop/FolderIcons'

// ── Types ─────────────────────────────────────────────────────────────────────
type WindowComponent = React.ComponentType<{ win: WindowState; isMobile?: boolean }>

export interface AppDef extends AppMeta {
  type: WindowType
  /** The window component to render when this app is open */
  Component: WindowComponent
  /** Custom icon for the desktop (replaces the material symbol). */
  desktopIconNode?: React.ReactNode
  /** Custom icon rendered inside the phone tile (replaces the material symbol). */
  phoneIconNode?: React.ReactNode
}

// ── FileBrowser wrappers (one per category) ──────────────────────────────────
const FilmBrowser     = (p: { win: WindowState; isMobile?: boolean }) => <FileBrowserWindow {...p} category="film" />
const DevfilesBrowser = (p: { win: WindowState; isMobile?: boolean }) => <FileBrowserWindow {...p} category="devfiles" />
const GameBrowser     = (p: { win: WindowState; isMobile?: boolean }) => <FileBrowserWindow {...p} category="game" />
const CinemaBrowser   = (p: { win: WindowState; isMobile?: boolean }) => <FileBrowserWindow {...p} category="cinema" />
const ArcadeBrowser   = (p: { win: WindowState; isMobile?: boolean }) => <FileBrowserWindow {...p} category="arcade" />
const SwrBrowser      = (p: { win: WindowState; isMobile?: boolean }) => <FileBrowserWindow {...p} category="swr" />

// ── Component map ─────────────────────────────────────────────────────────────
const componentMap: Record<WindowType, WindowComponent> = {
  about:         AboutWindow,
  mail:          MailWindow,
  terminal:      TerminalWindow,
  settings:      SettingsWindow,
  projectdetail: ProjectDetailWindow,
  snake:         SnakeWindow,
  snowboard:     SnowboardWindow,
  paint:         PaintWindow,
  music:         MusicWindow,
  notepad:       NotePadWindow,
  calc:          CalcWindow,
  sysinfo:       SysInfoWindow,
  browser:       BrowserWindow,
  appmarket:     AppMarketWindow,
  readme:        ReadmeWindow,
  film:          FilmBrowser,
  devfiles:      DevfilesBrowser,
  game:          GameBrowser,
  cinema:        CinemaBrowser,
  arcade:        ArcadeBrowser,
  swr:           SwrBrowser,
}

// ── Custom icon nodes (desktop + phone) ───────────────────────────────────────
// These replace the generic material symbol wherever the app icon is shown.
const iconMap: Partial<Record<WindowType, { desktop?: React.ReactNode; phone?: React.ReactNode }>> = {
  snowboard: {
    desktop: (
      <div style={{
        width: 52, height: 52,
        background: 'linear-gradient(145deg,#0a5020,#1a8040)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 10px rgba(26,128,64,0.4)',
      }}>
        <SnowboarderPixelIcon size={38} />
      </div>
    ),
    phone: <SnowboarderPixelIcon size={34} />,
  },
  cinema: {
    desktop: <FolderFilmIcon color="#eaea00" size={48} />,
  },
  arcade: {
    desktop: <FolderGameIcon color="#00fd00" size={48} />,
  },
}

// ── Registry ──────────────────────────────────────────────────────────────────
export const APP_REGISTRY: AppDef[] = APP_META.map((meta: AppMeta) => ({
  ...meta,
  Component:       componentMap[meta.type],
  desktopIconNode: iconMap[meta.type]?.desktop,
  phoneIconNode:   iconMap[meta.type]?.phone,
}))

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getApp(type: WindowType): AppDef | undefined {
  return APP_REGISTRY.find(a => a.type === type)
}

/** Apps shown as desktop icons, sorted by col then row */
export function desktopApps(): AppDef[] {
  return APP_REGISTRY.filter(a => a.showOnDesktop && a.desktopCol != null)
    .sort((a, b) => {
      const colOrder = { L1: 0, L2: 1, R: 2 }
      const ca = colOrder[a.desktopCol!] ?? 99
      const cb = colOrder[b.desktopCol!] ?? 99
      return ca !== cb ? ca - cb : (a.desktopRow ?? 0) - (b.desktopRow ?? 0)
    })
}

/** Apps shown in the phone home screen grid (in registry order) */
export function phoneApps(installed?: WindowType[]): AppDef[] {
  return APP_REGISTRY.filter(a =>
    a.showOnPhone && (installed == null || installed.includes(a.type))
  )
}

/** Apps surfaced in Spotlight search */
export function spotlightApps(installed?: WindowType[]): AppDef[] {
  return APP_REGISTRY.filter(a =>
    a.showInSpotlight && (installed == null || installed.includes(a.type))
  )
}

/** Apps in the desktop right-click context menu */
export function contextMenuApps(installed?: WindowType[]): AppDef[] {
  return APP_REGISTRY.filter(a =>
    a.showInContextMenu && (installed == null || installed.includes(a.type))
  )
}
