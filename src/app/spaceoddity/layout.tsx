import type { Metadata } from 'next'
import styles from './spaceoddity.module.css'
import { copy, flags } from './content'

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.status,
  robots: {
    index: !flags.noindex,
    follow: !flags.noindex,
  },
}

export default function SpaceOddityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={styles.root}>{children}</div>
}
