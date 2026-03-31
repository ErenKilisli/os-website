import type { Metadata } from 'next'
import { Space_Grotesk, Public_Sans } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-headline',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
})

const publicSans = Public_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SYSTEM_V01 | ENGINEER + FILMMAKER',
  description: 'Eren Kılışlı — Portfolio',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${publicSans.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body>{children}</body>
    </html>
  )
}
