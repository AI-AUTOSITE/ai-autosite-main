import { Metadata } from 'next'
import YoutubeThumbnailClient from './components/YoutubeThumbnailClient'

export const metadata: Metadata = {
  title: 'Free YouTube Thumbnail Downloader - No Ads, No Sign Up | AI AutoSite',
  description:
    'Download HD thumbnails instantly. 100% free, no ads, no tracking. All sizes available.',
  keywords: 'free youtube thumbnail, thumbnail download, no ads, HD quality, privacy, no sign up',
  openGraph: {
    title: 'YouTube Thumbnail Downloader - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Download HD thumbnails without the BS.',
    type: 'website',
    images: [
      {
        url: '/og-youtube-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Free YouTube Thumbnail Downloader - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Thumbnails - Free Forever',
    description: 'Download HD thumbnails. No ads ever.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/youtube-thumbnail',
  },
}

export default function YoutubeThumbnailPage() {
  return <YoutubeThumbnailClient />
}
