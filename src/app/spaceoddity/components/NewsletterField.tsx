'use client'

import { useState } from 'react'
import styles from '../spaceoddity.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function NewsletterField({ endpoint }: { endpoint: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'sending') return

    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <form className={styles.newsletterForm} onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.newsletterInput}
          aria-label="Email address"
        />
        <button
          type="submit"
          className={styles.newsletterButton}
          disabled={status === 'sending'}
        >
          NOTIFY ME
        </button>
      </form>
      {status === 'sent' && (
        <p className={styles.newsletterStatus}>Signal received.</p>
      )}
      {status === 'error' && (
        <p className={styles.newsletterStatus}>Transmission failed — try again.</p>
      )}
    </div>
  )
}
