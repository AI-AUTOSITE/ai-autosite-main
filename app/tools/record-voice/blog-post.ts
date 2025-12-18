// app/tools/record-voice/blog-post.ts
import { Mic } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const recordVoicePost: BlogPost = {
  id: 'record-voice-guide',
  title: 'Online Voice Recorder - Record Audio From Your Microphone',
  description:
    'Free online voice recorder. Capture audio from your microphone and download as WAV or MP3. No installation required.',
  readTime: '3 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-18',
  icon: Mic,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Record Voice',
    url: '/tools/record-voice',
  },
  
  tags: ['audio', 'recorder', 'microphone', 'voice', 'recording'],
  keywords: ['voice recorder', 'audio recorder', 'record microphone', 'online recorder'],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Online Voice Recorder - Free Audio Recording Tool',
  seoDescription:
    'Record audio from your microphone online. Download as WAV or MP3. 100% free, no installation required.',
  ogImage: '/og/record-voice-guide.png',
  canonical: 'https://ai-autosite.com/blog/record-voice-guide',
  
  priority: 0.7,
  changeFreq: 'monthly',
  
  twitter: {
    card: 'summary_large_image',
    title: 'Online Voice Recorder',
    description: 'Record audio from your microphone. Free online tool.',
    image: '/og/record-voice-guide.png'
  }
}
