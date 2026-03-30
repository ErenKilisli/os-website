'use client'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

export function AboutWindow({ win }: { win: WindowState }) {
  return (
    <Window win={win} menu={['File', 'Edit', 'Help']} status="ABOUT.EXE | Read-only">
      <div className="about-wrap">
        <div className="about-top">
          <div className="about-av">👤</div>
          <div className="about-meta">
            <h1>EREN<br />KILISLI</h1>
            <div className="sub">Software Eng · Filmmaker · Game Dev</div>
            <div className="about-tags">
              <span className="atag">SOFTWARE ENG</span>
              <span className="atag m">FILMMAKER</span>
              <span className="atag g">GAME DEV</span>
              <span className="atag">ISTANBUL, TR</span>
            </div>
          </div>
        </div>
        <hr className="about-divider" />
        <div className="about-bio">
          <span>&gt;</span> Building at the intersection of <em>code</em>, film &amp; play.<br />
          <span>&gt;</span> Based in Istanbul — open to remote collab.<br />
          <span>&gt;</span> Available for freelance &amp; full-time roles.
        </div>
        <div className="about-skills">
          {['NEXT.JS','TYPESCRIPT','RUST','REACT','THREE.JS','UNITY','GO','FILM','NODE.JS','GSAP'].map((sk, i) => (
            <span key={sk} className={`sk${[0,1,2,5].includes(i) ? ' on' : i === 7 ? ' m' : ''}`}>{sk}</span>
          ))}
        </div>
      </div>
    </Window>
  )
}
