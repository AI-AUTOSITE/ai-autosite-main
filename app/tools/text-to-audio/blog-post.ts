// app/tools/text-to-audio/blog-post.ts
import { Volume2 } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const textToAudioPost: BlogPost = {
  id: 'text-to-audio-guide',
  title: 'Text to Speech Online - Convert Text to Natural Audio',
  description:
    'Convert text to speech with natural-sounding voices. Multiple languages, speed and pitch control.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Volume2,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Text to Audio',
    url: '/tools/text-to-audio',
  },
  
  tags: ['audio', 'tts', 'text-to-speech', 'voice', 'synthesis'],
  keywords: ['text to speech', 'tts', 'text to audio', 'voice synthesis'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Text to Speech Online - Free TTS Tool',
  seoDescription:
    'Convert text to speech online with natural voices. Multiple languages, speed control. 100% browser-based.',
  ogImage: '/og/text-to-audio-guide.png',
  canonical: 'https://ai-autosite.com/blog/text-to-audio-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Text to Speech Online',
    description: 'Convert text to speech instantly. Free online tool.',
    image: '/og/text-to-audio-guide.png'
  }
}
