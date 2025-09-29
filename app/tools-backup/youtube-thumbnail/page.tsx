import { Metadata } from 'next'
import YoutubeThumbnailClient from './components/YoutubeThumbnailClient'

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Downloader - HD Quality | AI AutoSite',
  description: 'Download YouTube video thumbnails in HD quality. Get all thumbnail sizes instantly. Free thumbnail downloader.',
  keywords: 'youtube thumbnail download, youtube thumbnail grabber, thumbnail downloader, youtube image download, video thumbnail',
  openGraph: {
    title: 'YouTube Thumbnail Downloader - Free Tool',
    description: 'Download YouTube thumbnails in HD quality',
    type: 'website',
  },
}

export default function YoutubeThumbnailPage() {
  return <YoutubeThumbnailClient />
}