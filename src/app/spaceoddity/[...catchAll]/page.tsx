import type { Metadata } from 'next'
import styles from '../spaceoddity.module.css'

export const metadata: Metadata = {
  title: { absolute: 'Signal Lost' },
}

// Any path under /spaceoddity/* that isn't the root page lands here.
export default function SpaceOddityCatchAll() {
  return (
    <main className={styles.lostScreen}>
      <p className={styles.lostCode}>HSTR-155</p>
      <p className={styles.lostLabel}>NO SIGNAL</p>
    </main>
  )
}
