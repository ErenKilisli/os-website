import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://himerenkilisli.com/sitemap.xml',
    host: 'https://himerenkilisli.com',
  }
}
