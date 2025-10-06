// app/tools/pdf-tools/layout.tsx
import type { Metadata, Viewport } from 'next'

// Viewport設定を分離
export const viewport: Viewport = {
  themeColor: '#06b6d4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'PDF Tools - Free Online PDF Editor | No Upload Required',
  description:
    'Free PDF editor with 15+ tools. Rotate, merge, split, compress, add signatures, watermarks, convert to Word/Excel. Works offline, no file uploads, completely private.',
  keywords:
    'pdf editor, pdf tools, merge pdf, split pdf, compress pdf, pdf to word, pdf to excel, watermark pdf, sign pdf, rotate pdf, offline pdf editor, free pdf tools',

  applicationName: 'PDF Tools',
  authors: [{ name: 'AI AutoSite' }],
  generator: 'Next.js',

  manifest: '/manifest.json',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PDF Tools',
    startupImage: [
      '/splash/apple-splash-2048-2732.jpg',
      '/splash/apple-splash-1668-2224.jpg',
      '/splash/apple-splash-1536-2048.jpg',
      '/splash/apple-splash-1125-2436.jpg',
    ],
  },

  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-autosite.com/tools/pdf-tools',
    siteName: 'PDF Tools',
    title: 'PDF Tools - Free Online PDF Editor',
    description:
      'Edit PDFs instantly in your browser. No uploads, no registration, completely private.',
    images: [
      {
        url: '/og-pdf-tools.png',
        width: 1200,
        height: 630,
        alt: 'PDF Tools - Free Online PDF Editor',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'PDF Tools - Free Online PDF Editor',
    description: 'Edit PDFs instantly. No uploads, no registration, completely private.',
    images: ['/og-pdf-tools.png'],
    creator: '@aiautositecom',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'your-google-verification-code',
  },

  alternates: {
    canonical: 'https://ai-autosite.com/tools/pdf-tools',
  },
}

export default function PDFToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
