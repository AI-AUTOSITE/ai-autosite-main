// app/tools/voice-transcription/blog-post.ts
import { Mic } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const voiceTranscriptionPost: BlogPost = {
  id: 'voice-transcription-guide',
  title: 'Free Voice Transcription: Convert Speech to Text with AI',
  description:
    'Learn how to use our free voice transcription tool to convert audio to text with AI Whisper. 100% private, browser-based processing.',
  readTime: '6 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-13',
  icon: Mic,
  featured: true,
  status: 'published',

  relatedTool: {
    name: 'Voice Transcription',
    url: '/tools/voice-transcription',
  },

  tags: ['transcription', 'speech-to-text', 'audio', 'whisper', 'ai', 'privacy', 'offline'],
  keywords: [
    'voice transcription',
    'speech to text',
    'audio transcription',
    'whisper ai',
    'free transcription',
    'private transcription',
  ],
  category: 'audio-tools',
  author: 'AI AutoSite Team',
  views: 0,

  seoTitle: 'Free Voice Transcription Tool - Convert Speech to Text with AI Whisper',
  seoDescription:
    'Convert audio to text with 99+ language support. Free AI-powered transcription that runs entirely in your browser. No uploads, no limits, 100% private.',
  ogImage: '/og/voice-transcription-guide.png',
  canonical: 'https://ai-autosite.com/blog/voice-transcription-guide',

  schema: {
    type: 'HowTo',
    headline: 'How to Transcribe Audio to Text with AI',
    image: ['/og/voice-transcription-guide.png'],
    datePublished: '2025-12-13',
    dateModified: '2025-12-13',
    author: {
      type: 'Organization',
      name: 'AI AutoSite Team',
      url: 'https://ai-autosite.com',
    },
    publisher: {
      type: 'Organization',
      name: 'AI AutoSite',
      logo: {
        type: 'ImageObject',
        url: 'https://ai-autosite.com/logo.png',
      },
    },
    wordCount: 3000,
    inLanguage: 'en',
  },

  priority: 0.9,
  changeFreq: 'monthly',

  twitter: {
    card: 'summary_large_image',
    site: '@aiautositecom',
    title: 'Free Voice Transcription with AI Whisper',
    description: '100% private, browser-based speech-to-text. No uploads required.',
    image: '/og/voice-transcription-guide.png',
  },

  openGraph: {
    title: 'Free Voice Transcription: Convert Speech to Text with AI',
    description: 'AI-powered transcription that runs entirely in your browser. 99+ languages.',
    type: 'article',
    url: 'https://ai-autosite.com/blog/voice-transcription-guide',
    images: [
      {
        url: 'https://ai-autosite.com/og/voice-transcription-guide.png',
        width: 1200,
        height: 630,
        alt: 'Voice Transcription Guide',
      },
    ],
    locale: 'en_US',
    siteName: 'AI AutoSite',
    article: {
      publishedTime: '2025-12-13',
      modifiedTime: '2025-12-13',
      authors: ['AI AutoSite Team'],
      tags: ['transcription', 'speech-to-text', 'ai', 'whisper'],
      section: 'Audio Tools',
    },
  },
}
