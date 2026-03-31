'use client'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'
import { DesktopPixelIcon } from '../desktop/PixelIcons'

interface Props {
  win: WindowState
  isMobile?: boolean
}

export function AboutWindow({ win, isMobile = false }: Props) {
  return (
    <Window win={win} menu={['File', 'Edit', 'Help']} status="ABOUT.EXE | Read-only" isMobile={isMobile}>
      <div className="about-wrap">
        {/* Left: pixel art person graphic */}
        <div className="about-left">
          <DesktopPixelIcon type="about" />
        </div>
        {/* Right: info */}
        <div className="about-right">
          <div className="about-name">IBRAHIM EREN<br />KILISLI</div>
          <div className="about-role">Software Engineer · Filmmaker · Game Dev</div>
          <div className="about-tags">
            <span className="atag">SOFTWARE ENG</span>
            <span className="atag">FILMMAKER</span>
            <span className="atag">GAME DEV</span>
            <span className="atag">ISTANBUL, TR</span>
          </div>
          <hr className="about-divider" />
          <div className="about-bio">
            &gt; Building at the intersection of <em>code</em>, film &amp; play.<br />
            &gt; Based in Istanbul — open to remote collab.<br />
            &gt; Available for freelance &amp; full-time roles.
          </div>
          <div className="about-skills">
            {['NEXT.JS','TYPESCRIPT','RUST','REACT','THREE.JS','UNITY','GO','FILM','NODE.JS','GSAP'].map((sk, i) => (
              <span key={sk} className={`sk${[0,1,2,5].includes(i) ? ' on' : ''}`}>{sk}</span>
            ))}
          </div>
        </div>
      </div>
    </Window>
  )
}
