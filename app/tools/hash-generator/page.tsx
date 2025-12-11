import { Metadata } from 'next'
import HashGeneratorClient from './components/HashGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Hash Generator - MD5, SHA-256, SHA-512 | AI AutoSite',
  description:
    'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes instantly. File hashing, HMAC support, hash verification, and type identification. 100% free, no ads, works offline.',
  keywords: 'hash generator, md5 generator, sha256 online, sha512 hash, checksum calculator, hmac generator, file hash, hash verification, no ads, privacy, no tracking',
  openGraph: {
    title: 'Hash Generator - MD5, SHA-256, SHA-512 & More',
    description: 'Generate cryptographic hashes for text and files. All-in-one tool with HMAC, verification, and hash identification.',
    type: 'website',
    images: [
      {
        url: '/og-hash-generator.png',
        width: 1200,
        height: 630,
        alt: 'Free Hash Generator - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hash Generator - Free & Private',
    description: 'Generate MD5, SHA-256, SHA-512 hashes. 100% client-side processing.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/hash-generator',
  },
}

export default function HashGeneratorPage() {
  return <HashGeneratorClient />
}
