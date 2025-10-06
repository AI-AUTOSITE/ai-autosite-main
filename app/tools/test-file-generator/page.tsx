// app/tools/test-file-generator/page.tsx

import { Metadata } from 'next'
import TestFileGeneratorClient from './components/TestFileGeneratorClient'

export const metadata: Metadata = {
  title: 'Free Test File Generator - No Ads, No Sign Up | AI AutoSite',
  description:
    'Generate custom test files instantly for upload testing. Set exact file size, content type, and complexity. 100% free, no ads, no tracking. Works offline.',
  keywords:
    'test file generator, dummy file creator, sample pdf, upload testing, file size generator, development tools, free, no ads',

  openGraph: {
    title: 'Test File Generator - Truly Free, No Ads Ever',
    description:
      'Zero ads, zero tracking, zero BS. Create custom test files with exact size and content specifications.',
    type: 'website',
    images: [
      {
        url: '/og-test-file-generator.png',
        width: 1200,
        height: 630,
        alt: 'Free Test File Generator - No Ads',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Test File Generator - Free Forever, No Ads',
    description: 'Generate test files with custom size and content. Perfect for developers.',
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/test-file-generator',
  },
}

export default function TestFileGeneratorPage() {
  return (
    <>
      {/* Breadcrumb navigation will be handled by tools/layout.tsx */}
      <TestFileGeneratorClient />
    </>
  )
}
