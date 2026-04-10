'use client'
import { useState } from 'react'
import { Window } from './Window'
import { WindowState } from '@/store/windowStore'

const CONTACTS = [
  { service: 'LINKEDIN', emoji: '💼', name: 'linkedin.com/in/erenkilisli', href: 'https://linkedin.com/in/erenkilisli' },
  { service: 'GITHUB',   emoji: '💻', name: 'github.com/erenkilisli',     href: 'https://github.com/erenkilisli' },
  { service: 'EMAIL',    emoji: '✉',  name: 'ibr@himerenkilisli.com',     href: null },
]

interface Props {
  win: WindowState
  isMobile?: boolean
}

export function MailWindow({ win, isMobile = false }: Props) {
  const [from, setFrom]       = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody]       = useState('')
  const [sent, setSent]       = useState(false)

  const handleSend = () => {
    if (!subject.trim() && !body.trim()) return
    const mailBody = `${body}${from ? `\n\n---\nReply-To: ${from}` : ''}`
    window.open(
      `mailto:ibr@himerenkilisli.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`
    )
    setFrom('')
    setSubject('')
    setBody('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <Window win={win} menu={['File', 'Edit', 'Message', 'Help']} status="MAIL.EXE | Ready" isMobile={isMobile}>
      <div className="mail-toolbar">
        <button className="mail-tbtn active">COMPOSE</button>
        <button className="mail-tbtn">INBOX</button>
        <button className="mail-tbtn">DRAFTS</button>
      </div>
      <div className="mail-split">
        {/* Sidebar */}
        <div className="mail-sb">
          <div className="mail-sb-hdr">CONTACTS</div>
          {CONTACTS.map(c => (
            c.href
              ? <a key={c.service} className="contact-row" href={c.href} target="_blank" rel="noopener noreferrer">
                  <div className="c-svc">{c.emoji} {c.service}</div>
                  <div className="c-name">{c.name}</div>
                </a>
              : <div key={c.service} className="contact-row" style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard?.writeText(c.name)}>
                  <div className="c-svc">{c.emoji} {c.service}</div>
                  <div className="c-name">{c.name}</div>
                </div>
          ))}
        </div>
        {/* Compose */}
        <div className="mail-compose">
          <div className="mail-form">
            <div className="mail-field">
              <div className="mail-lbl">FROM:</div>
              <input className="mail-in" type="email" value={from} onChange={e => setFrom(e.target.value)} placeholder="your@email.com" />
            </div>
            <div className="mail-field">
              <div className="mail-lbl">TO:</div>
              <input className="mail-in" type="text" defaultValue="ibr@himerenkilisli.com" readOnly />
            </div>
            <div className="mail-field">
              <div className="mail-lbl">SUBJECT:</div>
              <input className="mail-in" type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter subject..." />
            </div>
            <div className="mail-field" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="mail-lbl">MESSAGE:</div>
              <textarea className="mail-ta" value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message here..." rows={6} />
            </div>
            <div className="mail-actions">
              <button className="mail-send" onClick={handleSend}>▶ SEND MESSAGE</button>
              {sent && <span className="mail-ok">✓ MESSAGE SENT!</span>}
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}