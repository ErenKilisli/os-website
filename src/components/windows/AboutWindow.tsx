'use client'
import { useState } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { DesktopPixelIcon } from '../desktop/PixelIcons'

interface Props {
  win: WindowState
  isMobile?: boolean
}

const WORD_MENU = ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']
const RIBBON_TABS = ['Home', 'Insert', 'Layout', 'References', 'Mailings', 'Review', 'View']

const FONTS = [
  'Calibri',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Comic Sans MS',
]

const SKILLS = ['NEXT.JS','TYPESCRIPT','RUST','REACT','THREE.JS','UNITY','GO','FILM','NODE.JS','GSAP']
const SKILL_ON = [0, 1, 2, 5]

export function AboutWindow({ win, isMobile = false }: Props) {
  const [font, setFont] = useState('Calibri')
  const [fontSize, setFontSize] = useState(12)

  return (
    <Window
      win={win}
      menu={WORD_MENU}
      status="ABOUTME.DOC — Read-Only"
      isMobile={isMobile}
      bodyClass="word-body"
    >
      <div className="word-wrap">

        {/* ── Ribbon ── */}
        <div className="word-ribbon">
          <div className="word-ribbon-tabs">
            {RIBBON_TABS.map((t, i) => (
              <div key={t} className={`word-rtab${i === 0 ? ' active' : ''}`}>{t}</div>
            ))}
          </div>
          <div className="word-ribbon-bar">

            {/* Clipboard group */}
            <div className="word-rgroup">
              <div className="word-rgroup-btns">
                <button className="word-rbtn" title="Paste" disabled>
                  <span className="material-symbols-outlined" style={{fontSize:18,opacity:0.4}}>content_paste</span>
                  <span style={{opacity:0.4}}>Paste</span>
                </button>
                <div className="word-rgroup-mini">
                  <button className="word-rbtn-sm" title="Cut" disabled style={{opacity:0.4}}><span className="material-symbols-outlined" style={{fontSize:14}}>content_cut</span></button>
                  <button className="word-rbtn-sm" title="Copy" disabled style={{opacity:0.4}}><span className="material-symbols-outlined" style={{fontSize:14}}>content_copy</span></button>
                </div>
              </div>
              <div className="word-rgroup-label">Clipboard</div>
            </div>

            <div className="word-rdivider"/>

            {/* Font group — FUNCTIONAL */}
            <div className="word-rgroup">
              <div className="word-rgroup-row">
                <select
                  className="word-rselect"
                  value={font}
                  onChange={e => setFont(e.target.value)}
                  title="Font"
                >
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select className="word-rselect" style={{width:44}} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                  <option value={11}>11</option>
                  <option value={12}>12</option>
                  <option value={14}>14</option>
                  <option value={16}>16</option>
                  <option value={18}>18</option>
                  <option value={20}>20</option>
                  <option value={24}>24</option>
                </select>
              </div>
              <div className="word-rgroup-row" style={{marginTop:2}}>
                <button className="word-rbtn-sm font-bold" disabled style={{opacity:0.4}}>B</button>
                <button className="word-rbtn-sm font-italic" disabled style={{opacity:0.4}}>I</button>
                <button className="word-rbtn-sm font-underline" disabled style={{opacity:0.4}}>U</button>
                <button className="word-rbtn-sm" disabled style={{opacity:0.4,textDecoration:'line-through',fontSize:12}}>S</button>
                <button className="word-rbtn-sm" disabled style={{opacity:0.4,borderBottom:'3px solid #ffc000',fontSize:12}}>A</button>
              </div>
              <div className="word-rgroup-label">Font</div>
            </div>

            <div className="word-rdivider"/>

            {/* Paragraph group */}
            <div className="word-rgroup">
              <div className="word-rgroup-row">
                <button className="word-rbtn-sm" disabled style={{opacity:0.4}}>≡</button>
                <button className="word-rbtn-sm" disabled style={{opacity:0.4}}>1≡</button>
                <button className="word-rbtn-sm active" disabled>⬛</button>
                <button className="word-rbtn-sm" disabled style={{opacity:0.4}}>☰</button>
              </div>
              <div className="word-rgroup-label">Paragraph</div>
            </div>

            <div className="word-rdivider"/>

            {/* Styles */}
            <div className="word-rgroup">
              <div className="word-rgroup-row">
                <div className="word-style-box active">Normal</div>
                <div className="word-style-box heading" style={{opacity:0.5}}>Heading 1</div>
              </div>
              <div className="word-rgroup-label">Styles</div>
            </div>

            {/* Read-only badge */}
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',padding:'0 10px'}}>
              <span style={{
                fontSize:9,
                fontFamily:'Segoe UI,Arial,sans-serif',
                color:'#b04000',
                background:'#fff3e8',
                border:'1px solid #e0a060',
                borderRadius:2,
                padding:'3px 8px',
                fontWeight:700,
                letterSpacing:'0.05em',
              }}>🔒 READ-ONLY</span>
            </div>
          </div>
        </div>

        {/* ── Ruler ── */}
        <div className="word-ruler">
          <div className="word-ruler-margin" style={{width:72}}/>
          <div className="word-ruler-body">
            {Array.from({length: 17}, (_, i) => (
              <div key={i} className="word-ruler-mark">
                {i > 0 && i % 2 === 0 && <span className="word-ruler-num">{i / 2}</span>}
                <div className={`word-ruler-tick${i % 2 === 0 ? ' major' : ''}`}/>
              </div>
            ))}
          </div>
          <div className="word-ruler-margin" style={{width:72}}/>
        </div>

        {/* ── Page Area ── */}
        <div className="word-page-area">
          <div className="word-page">

            {/* Page header */}
            <div className="word-page-header">
              <span className="word-header-text">ABOUTME.DOC</span>
              <span className="word-header-text">SYSTEM_V01 · 2026</span>
            </div>

            {/* ── OLD About content — styled with selected font ── */}
            <div className="word-doc-content" style={{fontFamily: font, fontSize: fontSize, flex: 1}}>
              <div className="about-wrap" style={{fontFamily: font, fontSize: fontSize, flex: 1, height: '100%'}}>

                {/* Left: pixel art person */}
                <div className="about-left">
                  <DesktopPixelIcon type="about" />
                </div>

                {/* Right: info */}
                <div className="about-right" style={{fontFamily: font, fontSize: fontSize}}>
                  <div className="about-name" style={{fontFamily: font, fontSize: fontSize * 1.15}}>
                    IBRAHIM EREN<br/>KILISLI
                  </div>
                  <div className="about-role" style={{fontFamily: font, fontSize: fontSize}}>
                    Software Engineer · Filmmaker · Game Dev
                  </div>
                  <div className="about-tags">
                    <span className="atag" style={{fontSize: fontSize * 0.78}}>SOFTWARE ENG</span>
                    <span className="atag" style={{fontSize: fontSize * 0.78}}>FILMMAKER</span>
                    <span className="atag" style={{fontSize: fontSize * 0.78}}>GAME DEV</span>
                    <span className="atag" style={{fontSize: fontSize * 0.78}}>ISTANBUL, TR</span>
                  </div>
                  <hr className="about-divider" />
                  <div className="about-bio" style={{fontFamily: font, fontSize: fontSize}}>
                    &gt; Building at the intersection of <em>code</em>, film &amp; play.<br/>
                    &gt; Based in Istanbul — open to remote collab.<br/>
                    &gt; Available for freelance &amp; full-time roles.
                  </div>
                  <div className="about-skills">
                    {SKILLS.map((sk, i) => (
                      <span key={sk} className={`sk${SKILL_ON.includes(i) ? ' on' : ''}`}
                        style={{fontFamily: font, fontSize: fontSize * 0.78}}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blinking cursor at bottom */}
              <div style={{marginTop:12, paddingLeft:4}}>
                <span className="word-cursor">|</span>
              </div>
            </div>

            {/* Page footer */}
            <div className="word-page-footer">
              <span>Ibrahim Eren Kilisli</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* ── Word status bar ── */}
        <div className="word-statusbar">
          <span>Page 1 of 1</span>
          <span>Words: 42</span>
          <span>Read-Only</span>
          <span style={{marginLeft:'auto',opacity:0.8}}>🔍 100%</span>
        </div>

      </div>
    </Window>
  )
}
