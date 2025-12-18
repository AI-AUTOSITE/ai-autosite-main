// app/tools/audio-converter/blog-post.ts
import { ArrowRightLeft } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const audioConverterPost: BlogPost = {
  id: 'audio-converter-guide',
  title: 'Audio Converter - Convert Between MP3, WAV, OGG, FLAC Online',
  description:
    'Universal audio format converter. Convert between MP3, WAV, OGG, FLAC with quality settings control.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: ArrowRightLeft,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Audio Converter',
    url: '/tools/audio-converter',
  },
  
  tags: ['audio', 'converter', 'mp3', 'wav', 'ogg', 'flac'],
  keywords: ['audio converter', 'convert audio', 'mp3 converter', 'wav converter'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Audio Converter - Convert Audio Formats Online Free',
  seoDescription:
    'Convert between audio formats online. MP3, WAV, OGG, FLAC support. Quality settings control. 100% browser-based.',
  ogImage: '/og/audio-converter-guide.png',
  canonical: 'https://ai-autosite.com/blog/audio-converter-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Converter Online',
    description: 'Convert audio formats instantly. Free online tool.',
    image: '/og/audio-converter-guide.png'
  }
}
