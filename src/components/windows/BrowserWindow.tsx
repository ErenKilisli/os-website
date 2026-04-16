'use client'
import { useState, useRef, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

const BOOKMARKS = [
  { label: 'himerenkilisli.com', url: 'https://himerenkilisli.com' },
  { label: 'Lizard — Wikipedia', url: 'https://en.m.wikipedia.org/wiki/Lizard' },
  { label: 'Hacker News',        url: 'https://news.ycombinator.com' },
  { label: 'Internet Archive',   url: 'https://archive.org' },
  { label: 'OpenStreetMap',      url: 'https://www.openstreetmap.org' },
  { label: 'MDN Docs',           url: 'https://developer.mozilla.org/en-US/' },
]

// Sites known to hard-block iframes
const BLOCKED_DOMAINS = [
  'google.com', 'youtube.com', 'twitter.com', 'x.com',
  'instagram.com', 'facebook.com', 'linkedin.com',
]
function isLikelyBlocked(url: string) {
  // Allow html.duckduckgo.com (iframe-friendly endpoint), block duckduckgo.com home
  if (url.includes('html.duckduckgo.com')) return false
  if (url.includes('duckduckgo.com')) return true
  return BLOCKED_DOMAINS.some(d => url.includes(d))
}

/** Returns true if the input looks like a search query (not a URL) */
function isSearchQuery(input: string) {
  const t = input.trim()
  if (t.startsWith('http://') || t.startsWith('https://')) return false
  if (t.includes('.') && !t.includes(' ') && !t.startsWith('/')) return false
  return true
}

// Win95-style beveled button
function W95Btn({
  onClick, disabled = false, title, children,
}: {
  onClick?: () => void; disabled?: boolean; title?: string; children: React.ReactNode
}) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        minWidth: 26, height: 24, padding: '0 6px',
        background: '#d4d0c8',
        border: '2px solid',
        borderTopColor:    pressed ? '#808080' : '#ffffff',
        borderLeftColor:   pressed ? '#808080' : '#ffffff',
        borderBottomColor: pressed ? '#ffffff' : '#808080',
        borderRightColor:  pressed ? '#ffffff' : '#808080',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? '#a0a0a0' : '#000',
        fontFamily: 'monospace', fontSize: 12,
        userSelect: 'none', flexShrink: 0,
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
}

export function BrowserAppCore({ isMobile = false }: { isMobile?: boolean }) {
  const [url, setUrl]         = useState('')
  const [input, setInput]     = useState('')
  const [homeInput, setHomeInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [blockedUrl, setBlockedUrl] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const navigate = useCallback((target: string) => {
    let normalized = target.trim()
    if (!normalized) return

    // Search query → Wikipedia search (iframe-friendly; all major search engines block embedding)
    if (isSearchQuery(normalized)) {
      normalized = 'https://en.m.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(normalized)
    }

    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized
    }

    if (isLikelyBlocked(normalized)) {
      setBlocked(true)
      setBlockedUrl(normalized)
      setUrl(normalized)
      setInput(normalized)
      return
    }

    setUrl(normalized)
    setInput(normalized)
    setLoading(true)
    setBlocked(false)
    setBlockedUrl('')
    setHistory(h => {
      const trimmed = h.slice(0, histIdx + 1)
      const next = [...trimmed, normalized]
      setHistIdx(next.length - 1)
      return next
    })
  }, [histIdx])

  const go = () => navigate(input)

  const goBack = () => {
    if (histIdx > 0) {
      const prev = history[histIdx - 1]
      setHistIdx(i => i - 1)
      setUrl(prev); setInput(prev); setLoading(true); setBlocked(false)
    }
  }
  const goForward = () => {
    if (histIdx < history.length - 1) {
      const next = history[histIdx + 1]
      setHistIdx(i => i + 1)
      setUrl(next); setInput(next); setLoading(true); setBlocked(false)
    }
  }

  const handleLoad = () => {
    setLoading(false)
    try {
      const doc = iframeRef.current?.contentDocument
      if (doc && doc.body && doc.body.innerHTML === '') { setBlocked(true); setBlockedUrl(url) }
    } catch { setBlocked(false) }
  }
  const handleError = () => { setLoading(false); setBlocked(true); setBlockedUrl(url) }

  const canBack    = histIdx > 0
  const canForward = histIdx < history.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: isMobile ? '#c0c0c0' : 'transparent' }}>


        {/* ── Win95 Toolbar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '3px 6px',
          background: '#d4d0c8',
          borderBottom: '2px solid #808080',
        }}>
          <W95Btn onClick={goBack}    disabled={!canBack}    title="Back">◄</W95Btn>
          <W95Btn onClick={goForward} disabled={!canForward} title="Forward">►</W95Btn>
          <W95Btn onClick={() => { if (url) { setLoading(true); setBlocked(false); setUrl(u => u) } }} disabled={!url} title="Refresh">↺</W95Btn>
          <W95Btn onClick={() => { setUrl(''); setInput(''); setBlocked(false) }} title="Home">⌂</W95Btn>

          {/* Separator */}
          <div style={{ width: 2, height: 20, background: '#808080', margin: '0 3px', flexShrink: 0 }} />

          {/* Address bar */}
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#000', flexShrink: 0 }}>Address:</span>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', height: 22,
            background: '#fff',
            border: '2px solid',
            borderTopColor: '#808080', borderLeftColor: '#808080',
            borderBottomColor: '#fff', borderRightColor: '#fff',
            padding: '0 4px', gap: 4,
          }}>
            <span style={{ fontSize: 11, flexShrink: 0 }}>
              {url.startsWith('https') ? '🔒' : '🌐'}
            </span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && go()}
              placeholder="Type a web address or search..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'monospace', fontSize: 12, color: '#000',
              }}
            />
          </div>
          <W95Btn onClick={go} title="Go">Go</W95Btn>
        </div>

        {/* ── Bookmarks bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 1,
          padding: '2px 6px',
          background: '#d4d0c8',
          borderBottom: '1px solid #808080',
          overflowX: 'auto',
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#808080', flexShrink: 0, marginRight: 4 }}>
            Links:
          </span>
          {BOOKMARKS.map(b => (
            <button key={b.url} onClick={() => navigate(b.url)}
              style={{
                fontFamily: 'monospace', fontSize: 11, padding: '1px 8px',
                background: 'none', border: 'none', color: '#000080',
                cursor: 'pointer', whiteSpace: 'nowrap',
                textDecoration: 'underline',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ff0000')}
              onMouseLeave={e => (e.currentTarget.style.color = '#000080')}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* ── Content area ── */}
        <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
          {/* Loading bar */}
          {loading && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 2 }}>
              <div style={{ height: '100%', background: '#000080', animation: 'browserLoad 1.2s ease-in-out infinite' }} />
            </div>
          )}

          {/* ── Home / New Tab page — DDG-inspired ── */}
          {!url && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: '#ffffff',
              gap: 0,
            }}>
              {/* Logo area */}
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}>🦎</div>
                <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 'bold', color: '#cc3300', letterSpacing: 2 }}>
                  LIZARD
                  <span style={{ color: '#ff6600' }}>.</span>
                  <span style={{ color: '#cc3300' }}>OS</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#888', marginTop: 2 }}>
                  Internet Browser
                </div>
              </div>

              {/* Search box */}
              <div style={{ width: 'min(480px, 88%)', marginBottom: 20 }}>
                <div style={{
                  display: 'flex', border: '2px solid #ccc',
                  borderRadius: 0, overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  <input
                    value={homeInput}
                    onChange={e => setHomeInput(e.target.value)}
                    placeholder="Search or enter a web address"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        navigate(homeInput)
                        setHomeInput('')
                      }
                    }}
                    style={{
                      flex: 1, padding: '10px 14px',
                      border: 'none', outline: 'none',
                      fontFamily: 'monospace', fontSize: 13, color: '#000',
                      background: '#fff',
                    }}
                  />
                  <button
                    onClick={() => { navigate(homeInput); setHomeInput('') }}
                    style={{
                      padding: '0 16px',
                      background: '#cc3300', border: 'none',
                      color: '#fff', fontFamily: 'monospace', fontSize: 12,
                      cursor: 'pointer', fontWeight: 'bold',
                    }}
                  >
                    Go
                  </button>
                </div>
                <div style={{
                  fontFamily: 'monospace', fontSize: 9, color: '#aaa', marginTop: 6, textAlign: 'center',
                }}>
                  Search loads Wikipedia · Enter a URL to browse any site
                </div>
              </div>

              {/* Bookmarks grid */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
                width: 'min(480px, 88%)',
              }}>
                {BOOKMARKS.map(b => (
                  <button key={b.url} onClick={() => navigate(b.url)}
                    style={{
                      fontFamily: 'monospace', fontSize: 11,
                      padding: '5px 12px', cursor: 'pointer',
                      background: '#f5f5f5',
                      border: '1px solid #ddd',
                      color: '#333',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ffe8e0'; e.currentTarget.style.borderColor = '#cc3300' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.borderColor = '#ddd' }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blocked */}
          {url && blocked && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              background: '#d4d0c8',
            }}>
              <div style={{
                background: '#d4d0c8',
                border: '2px solid',
                borderTopColor: '#fff', borderLeftColor: '#fff',
                borderBottomColor: '#808080', borderRightColor: '#808080',
                boxShadow: '2px 2px 0 #000', padding: '0 0 14px',
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, #800000, #c04040)',
                  padding: '4px 8px', marginBottom: 14,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#fff', fontWeight: 'bold' }}>
                    ✕ This page cannot be displayed
                  </span>
                </div>
                <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#000' }}>
                    The site refuses to be embedded in a frame.
                  </div>
                  <button
                    onClick={() => window.open(blockedUrl, '_blank')}
                    style={{
                      alignSelf: 'flex-start',
                      fontFamily: 'monospace', fontSize: 11, padding: '4px 16px',
                      background: '#d4d0c8', cursor: 'pointer',
                      border: '2px solid',
                      borderTopColor: '#fff', borderLeftColor: '#fff',
                      borderBottomColor: '#808080', borderRightColor: '#808080',
                    }}
                  >
                    Open in New Window
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* iframe */}
          {url && !blocked && (
            <iframe
              ref={iframeRef}
              key={url}
              src={url}
              onLoad={handleLoad}
              onError={handleError}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              title="browser"
            />
          )}
        </div>

        {/* ── Win95 Status bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#d4d0c8',
          borderTop: '1px solid #808080',
          padding: '2px 6px', gap: 8,
        }}>
          <div style={{
            flex: 1, border: '1px solid', borderTopColor: '#808080', borderLeftColor: '#808080',
            borderBottomColor: '#fff', borderRightColor: '#fff',
            padding: '1px 4px',
            fontFamily: 'monospace', fontSize: 10, color: '#000',
          }}>
            {loading ? 'Loading...' : url ? url.slice(0, 60) : 'Done'}
          </div>
          <div style={{
            border: '1px solid', borderTopColor: '#808080', borderLeftColor: '#808080',
            borderBottomColor: '#fff', borderRightColor: '#fff',
            padding: '1px 8px',
            fontFamily: 'monospace', fontSize: 10, color: '#000', flexShrink: 0,
          }}>
            {url.startsWith('https') ? '🔒' : '🌐'} Internet
          </div>
      </div>

      <style>{`
        @keyframes browserLoad {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}

export function BrowserWindow({ win, isMobile = false }: Props) {
  return (
    <Window win={win} menu={['File', 'View', 'Go', 'Favorites', 'Help']} status={'BROWSER.EXE | Web Browser'} isMobile={isMobile}>
      <BrowserAppCore isMobile={isMobile} />
    </Window>
  )
}