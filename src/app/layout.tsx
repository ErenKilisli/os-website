import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Public_Sans } from 'next/font/google'
import './globals.css'

// ─── Fonts ───────────────────────────────────────────────────────────────────

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

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://himerenkilisli.com'

const TITLE = 'LIZARD.OS — Ibrahim Eren Kilisli | Game Developer & Filmmaker Portfolio'
const DESCRIPTION =
  'The interactive OS-themed portfolio of Ibrahim Eren Kilisli — Unreal Engine game developer, filmmaker, and full-stack developer from Turkey. Explore projects, games, films, and software inside a pixel-art cyberpunk desktop.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: TITLE,
    template: '%s | LIZARD.OS',
  },

  description: DESCRIPTION,

  keywords: [
    'ibrahim eren kilisli',
    'portfolio website os',
    'creative developer portfolio',
    'game developer filmmaker portfolio',
    'unreal engine developer turkey',
    'interactive portfolio website',
    'os themed portfolio',
    'pixel art portfolio website',
    'cyberpunk portfolio website',
    'next.js portfolio',
    'full stack developer filmmaker',
    'lizard os portfolio',
    'game developer portfolio',
    'unreal engine portfolio',
    'filmmaker portfolio',
    'turkey game developer',
    'türk oyun geliştirici',
    'eren kilisli',
    'damned ape game',
    'chronobreak steam',
    'rezinn app',
    'deux platform',
    'çember short film',
    'interactive resume',
    'os themed website',
    'win95 portfolio',
    'pixel art website',
    'cybercore design',
  ],

  authors: [{ name: 'Ibrahim Eren Kilisli', url: BASE_URL }],
  creator: 'Ibrahim Eren Kilisli',
  publisher: 'Ibrahim Eren Kilisli',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      'en':      BASE_URL,
      'tr':      BASE_URL,
      'x-default': BASE_URL,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'LIZARD.OS — Ibrahim Eren Kilisli',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'LIZARD.OS — Ibrahim Eren Kilisli Portfolio — Cyberpunk OS-themed interactive portfolio',
        type: 'image/png',
      },
    ],
  },

  // ── Verification placeholders ────────────────────────────────────────────────
  // verification: {
  //   google: 'YOUR_GOOGLE_SITE_VERIFICATION_TOKEN',
  // },

  // ── Icons ────────────────────────────────────────────────────────────────────
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦎</text></svg>",
    apple: '/apple-touch-icon.png',
  },

  // ── Manifest ─────────────────────────────────────────────────────────────────
  // manifest: '/site.webmanifest',
}

// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020812' },
    { media: '(prefers-color-scheme: light)', color: '#020812' },
  ],
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: 'Ibrahim Eren Kilisli',
      url: BASE_URL,
      jobTitle: 'Game Developer, Filmmaker & Full-Stack Developer',
      description:
        'Ibrahim Eren Kilisli is an Unreal Engine game developer, filmmaker, and full-stack developer from Turkey. Creator of Damned Ape, Chronobreak (Steam), the Rezinn app, and the DEUX platform.',
      knowsAbout: [
        'Unreal Engine',
        'Game Development',
        'Filmmaking',
        'TypeScript',
        'Next.js',
        'React',
        'Full-Stack Development',
        'C++',
        'Pixel Art',
        'Interactive Web Design',
      ],
      nationality: {
        '@type': 'Country',
        name: 'Turkey',
      },
      sameAs: [
        'https://github.com/ErenKilisli',
        'https://www.linkedin.com/in/ierenkilisli/',
        BASE_URL,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'LIZARD.OS — Ibrahim Eren Kilisli Portfolio',
      description: DESCRIPTION,
      publisher: {
        '@id': `${BASE_URL}/#person`,
      },
      inLanguage: ['en-US', 'tr-TR'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'CreativeWork',
      '@id': `${BASE_URL}/#portfolio`,
      name: 'LIZARD.OS Interactive Portfolio',
      url: BASE_URL,
      description:
        'An open-source OS-themed interactive portfolio website built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. Features draggable windows, mini-games, a pixel art editor, and more.',
      author: {
        '@id': `${BASE_URL}/#person`,
      },
      keywords:
        'portfolio, os theme, pixel art, cyberpunk, game developer, filmmaker, next.js, interactive',
      license: 'https://opensource.org/licenses/MIT',
      codeRepository: 'https://github.com/ErenKilisli/os-website',
    },
  ],
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${publicSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pixel fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />

        {/* Apple touch icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <noscript>
          <h1>Ibrahim Eren Kilisli</h1>
          <p>Game Developer (Unreal Engine, C++), Short Film Director, Full-Stack Engineer. Based in Istanbul, Turkey.</p>
          <p>Projects: Damned Ape, Chronobreak (Steam), Rezinn (Istanbul venue app), Deux (creative intelligence platform), Blood (festival short film), Kronos, Light.</p>
        </noscript>
      </body>
    </html>
  )
}
