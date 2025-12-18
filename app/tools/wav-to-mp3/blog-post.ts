// app/tools/wav-to-mp3/blog-post.ts
import { FileAudio } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const wavToMp3Post: BlogPost = {
  id: 'wav-to-mp3-guide',
  title: 'WAV to MP3 Converter - Compress Audio Files Without Quality Loss',
  description:
    'Convert WAV to MP3 and reduce file size by up to 90%. Perfect for sharing, streaming, and storage.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: FileAudio,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'WAV to MP3 Converter',
    url: '/tools/wav-to-mp3',
  },
  
  tags: ['audio', 'converter', 'wav', 'mp3', 'compress'],
  keywords: ['wav to mp3', 'compress audio', 'audio converter', 'mp3 encoder'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'WAV to MP3 Converter - Free Online Audio Compression',
  seoDescription:
    'Convert WAV to MP3 free online. Reduce file size by 90% with adjustable bitrate. 100% browser-based.',
  ogImage: '/og/wav-to-mp3-guide.png',
  canonical: 'https://ai-autosite.com/blog/wav-to-mp3-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'WAV to MP3 Converter',
    description: 'Compress WAV to MP3 instantly. Free online tool.',
    image: '/og/wav-to-mp3-guide.png'
  }
}
