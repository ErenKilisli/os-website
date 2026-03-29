import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Providers } from '@/providers/Providers'
import './globals.css'

/* ── Fonts ──────────────────────────────────────────────
   Geist Mono  → engineer / code identity (monospace)
   Geist Sans  → UI chrome / body copy
   Playfair    → filmmaker / cinematic identity (serif)
─────────────────────────────────────────────────────── */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets:  ['latin'],
  display:  'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets:  ['latin'],
  display:  'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets:  ['latin'],
  weight:   ['400', '700', '900'],
  style:    ['normal', 'italic'],
  display:  'swap',
})

/* ── Metadata ─────────────────────────────────────────── */
export const metadata: Metadata = {
  title:       'Ibrahim Erenkilisli — Engineer ✦ Filmmaker',
  description: 'Software/Product Engineer and Filmmaker based in Istanbul. Building systems and telling stories.',
  metadataBase: new URL('https://himerenkilisli.com'),
  openGraph: {
    title:       'Ibrahim Erenkilisli — Engineer ✦ Filmmaker',
    description: 'Software/Product Engineer and Filmmaker based in Istanbul.',
    url:         'https://himerenkilisli.com',
    siteName:    'Ibrahim Erenkilisli',
    locale:      'en_US',
    type:        'website',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Ibrahim Erenkilisli — Engineer ✦ Filmmaker',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
}

/* ── Root layout ──────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
