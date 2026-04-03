'use client'
import { useState, useRef, useCallback } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

interface Props { win: WindowState; isMobile?: boolean }

const BOOKMARKS = [
  { label: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  { label: 'Wikipedia',  url: 'https://en.m.wikipedia.org' },
  { label: 'MDN',        url: 'https://developer.mozilla.org' },
  { label: 'Hacker News', url: 'https://news.ycombinator.com' },
  { label: 'OpenStreetMap', url: 'https://www.openstreetmap.org' },
]

// Sites known to block iframes — open in new tab instead
const BLOCKED_DOMAINS = ['google.com', 'youtube.com', 'twitter.com', 'x.com', 'instagram.com', 'facebook.com', 'linkedin.com']

function isLikelyBlocked(url: string) {
  return BLOCKED_DOMAINS.some(d => url.includes(d))
}

export function BrowserWindow({ win, isMobile = false }: Props) {
  const [url, setUrl]         = useState('')
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [blockedUrl, setBlockedUrl] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const navigate = useCallback((target: string) => {
    let normalized = target.trim()
    if (!normalized) return
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      if (normalized.includes('.') && !normalized.includes(' ')) {
        normalized = 'https://' + normalized
      } else {
        // Search query → open Google in new tab (Google blocks iframes)
        normalized = 'https://duckduckgo.com/?q=' + encodeURIComponent(normalized)
      }
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

  const navBtn = (active: boolean): React.CSSProperties => ({
    width: 26, height: 26, background: 'none', border: 'none',
    cursor: active ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: active ? '#00ffff' : '#2a3a4a', flexShrink: 0,
  })

  return (
    <Window win={win} menu={['File', 'View', 'History', 'Bookmarks', 'Help']} status={url || 'BROWSER | New Tab'} isMobile={isMobile}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#020812' }}>

        {/* Nav bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'var(--surface-dim)', borderBottom: '1px solid #0a1628' }}>
          <button style={navBtn(canBack)}    onClick={goBack}    disabled={!canBack}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          </button>
          <button style={navBtn(canForward)} onClick={goForward} disabled={!canForward}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>
          <button style={navBtn(!!url)} onClick={() => { setLoading(true); setBlocked(false); setUrl(u => u) }} disabled={!url}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{loading ? 'close' : 'refresh'}</span>
          </button>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#000', border: '1px solid #0d2040', padding: '0 8px', height: 24, gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: url.startsWith('https') ? '#00c853' : '#4a6080' }}>
              {url.startsWith('https') ? 'lock' : 'public'}
            </span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && go()}
              placeholder="Enter URL or search with DuckDuckGo..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-b)', fontSize: 13, color: '#c8d8e8', caretColor: '#00ffff' }}
            />
          </div>

          <button onClick={go} style={{ background: '#00ffff', border: 'none', cursor: 'pointer', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </button>
        </div>

        {/* Bookmarks bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '3px 8px', background: '#030e1a', borderBottom: '1px solid #0a1628', overflowX: 'auto' }}>
          {BOOKMARKS.map(b => (
            <button key={b.url} onClick={() => navigate(b.url)}
              style={{ fontFamily: 'var(--font-h)', fontSize: 7, padding: '2px 8px', background: 'none', border: 'none', color: '#4a7090', cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00ffff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4a7090')}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, position: 'relative', background: '#000' }}>
          {loading && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 2 }}>
              <div style={{ height: '100%', background: '#00ffff', animation: 'browserLoad 1.2s ease-in-out infinite' }} />
            </div>
          )}

          {/* New tab / home */}
          {!url && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 11, color: '#1a3a5a', letterSpacing: '0.2em' }}>OS.WEBSITE BROWSER</div>
              {/* Search box */}
              <div style={{ display: 'flex', width: 360, gap: 0 }}>
                <input
                  placeholder="Search Google or enter URL..."
                  onKeyDown={e => { if (e.key === 'Enter') navigate((e.target as HTMLInputElement).value) }}
                  style={{ flex: 1, background: '#0a1628', border: '1px solid #0d2040', borderRight: 'none', outline: 'none', padding: '8px 12px', fontFamily: 'var(--font-b)', fontSize: 14, color: '#c8d8e8', caretColor: '#00ffff' }}
                />
                <button
                  onClick={e => { const inp = (e.currentTarget.previousSibling as HTMLInputElement); navigate(inp.value) }}
                  style={{ background: '#00ffff', border: 'none', padding: '0 14px', cursor: 'pointer', color: '#000' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 400 }}>
                {BOOKMARKS.map(b => (
                  <button key={b.url} onClick={() => navigate(b.url)}
                    style={{ fontFamily: 'var(--font-h)', fontSize: 7, padding: '6px 14px', background: '#0a1628', border: '1px solid #0d2040', color: '#4a7090', cursor: 'pointer', letterSpacing: '0.1em' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#00ffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#4a7090')}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 7, color: '#1a2a3a', letterSpacing: '0.1em' }}>
                NOTE: Google/YouTube/Twitter block embedding — use DuckDuckGo to search
              </div>
            </div>
          )}

          {/* Blocked */}
          {url && blocked && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: '#000810' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#ff4444' }}>block</span>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: 8, color: '#ff4444', letterSpacing: '0.12em' }}>IFRAME BLOCKED</div>
              <div style={{ fontFamily: 'var(--font-b)', fontSize: 13, color: '#4a6080', textAlign: 'center', maxWidth: 320 }}>
                This site refuses to be embedded. Open it in a real browser tab instead.
              </div>
              <button
                onClick={() => window.open(blockedUrl, '_blank')}
                style={{ fontFamily: 'var(--font-h)', fontSize: 8, padding: '8px 20px', background: '#00ffff', border: 'none', color: '#000', cursor: 'pointer', letterSpacing: '0.1em' }}
              >
                OPEN IN NEW TAB
              </button>
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
      </div>

      <style>{`
        @keyframes browserLoad {
          0%   { width: 0%;  margin-left: 0; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%;  margin-left: 100%; }
        }
      `}</style>
    </Window>
  )
}
