import { Metadata } from 'next'
import TimestampConverterClient from './components/TimestampConverterClient'

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter - Epoch to Date Online | AI AutoSite',
  description:
    'Convert Unix timestamps to human-readable dates and vice versa. Auto-detects seconds/milliseconds, supports multiple timezones, and generates Discord timestamp codes. 100% private.',
  keywords: 'unix timestamp converter, epoch converter, timestamp to date, date to timestamp, unix time, epoch time, discord timestamp',
  openGraph: {
    title: 'Unix Timestamp Converter - Free Online Tool',
    description: 'Convert timestamps instantly with auto-detection, timezone support, and Discord/Slack formatters. No tracking.',
    type: 'website',
    images: [
      {
        url: '/og-timestamp-converter.png',
        width: 1200,
        height: 630,
        alt: 'Unix Timestamp Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unix Timestamp Converter - Free & Private',
    description: 'Convert Unix timestamps with auto-detection and Discord support. Zero tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/timestamp-converter',
  },
}

export default function TimestampConverterPage() {
  return <TimestampConverterClient />
}
