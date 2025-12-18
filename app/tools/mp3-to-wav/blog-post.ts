// app/tools/mp3-to-wav/blog-post.ts
import { FileAudio } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const mp3ToWavPost: BlogPost = {
  id: 'mp3-to-wav-guide',
  title: 'MP3 to WAV Converter - Convert Audio for Editing & Production',
  description:
    'Convert MP3 to WAV format instantly in your browser. Get uncompressed audio for editing, production, and CD burning.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: FileAudio,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'MP3 to WAV Converter',
    url: '/tools/mp3-to-wav',
  },
  
  tags: ['audio', 'converter', 'mp3', 'wav', 'audio-editing'],
  keywords: ['mp3 to wav', 'audio converter', 'convert mp3', 'wav converter'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'MP3 to WAV Converter - Free Online Audio Conversion Tool',
  seoDescription:
    'Convert MP3 to WAV format free online. Uncompressed audio for editing and production. 100% browser-based, no upload required.',
  ogImage: '/og/mp3-to-wav-guide.png',
  canonical: 'https://ai-autosite.com/blog/mp3-to-wav-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'MP3 to WAV Converter',
    description: 'Convert MP3 to WAV instantly. Free online tool.',
    image: '/og/mp3-to-wav-guide.png'
  }
}
