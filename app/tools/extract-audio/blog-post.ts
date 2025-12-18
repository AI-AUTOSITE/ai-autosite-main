// app/tools/extract-audio/blog-post.ts
import { Film } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const extractAudioPost: BlogPost = {
  id: 'extract-audio-guide',
  title: 'Extract Audio from Video - MP4 to MP3 Converter Online',
  description:
    'Extract audio track from video files. Convert MP4, WebM to MP3 or WAV. Perfect for ripping music from videos.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Film,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Extract Audio',
    url: '/tools/extract-audio',
  },
  
  tags: ['audio', 'video', 'extract', 'mp4', 'converter'],
  keywords: ['extract audio', 'video to audio', 'mp4 to mp3', 'rip audio'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Extract Audio from Video - MP4 to MP3 Online Free',
  seoDescription:
    'Extract audio from video files online. Convert MP4, WebM to MP3 or WAV. 100% browser-based.',
  ogImage: '/og/extract-audio-guide.png',
  canonical: 'https://ai-autosite.com/blog/extract-audio-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Extract Audio from Video',
    description: 'Rip audio from videos instantly. Free online tool.',
    image: '/og/extract-audio-guide.png'
  }
}
