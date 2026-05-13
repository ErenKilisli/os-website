import type { WindowType } from '@/config/appMeta'

export const URL_TO_WINDOW: Record<string, WindowType> = {
  about:   'about',
  contact: 'mail',
  dev:     'devfiles',
  film:    'film',
  game:    'game',
}

export const WINDOW_TO_URL: Partial<Record<WindowType, string>> = {
  about:    'about',
  mail:     'contact',
  devfiles: 'dev',
  film:     'film',
  game:     'game',
}

export function readOpenParam(): WindowType[] {
  if (typeof window === 'undefined') return []
  const param = new URLSearchParams(window.location.search).get('open')
  if (!param) return []
  return param
    .split(',')
    .map(s => URL_TO_WINDOW[s.trim().toLowerCase()])
    .filter((t): t is WindowType => !!t)
}

export function writeOpenParam(types: WindowType[]): void {
  const slugs = types
    .map(t => WINDOW_TO_URL[t])
    .filter((s): s is string => !!s)
  const url = new URL(window.location.href)
  if (slugs.length > 0) {
    url.searchParams.set('open', slugs.join(','))
  } else {
    url.searchParams.delete('open')
  }
  window.history.replaceState({}, '', url.toString())
}
