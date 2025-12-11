// app/tools/timestamp-converter/blog-post.ts
import { Clock } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const timestampConverterPost: BlogPost = {
  id: 'timestamp-converter-guide',
  title: 'Timestamp Converter: Unix Time Made Easy',
  description: 'Convert Unix timestamps with Discord formatting, timezone support, and auto-precision detection.',
  readTime: '6 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Clock,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Timestamp Converter',
    url: '/tools/timestamp-converter',
  },
  
  tags: ['timestamp', 'unix', 'datetime', 'timezone', 'discord'],
  keywords: ['unix timestamp converter', 'epoch converter', 'discord timestamp', 'timezone converter'],
  category: 'converters',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Timestamp Converter - Unix Time & Discord Formatting',
  seoDescription: 'Convert Unix timestamps to human-readable dates. Discord timestamp formatting, 13 timezones, millisecond precision support.',
  ogImage: '/og/timestamp-converter-guide.png',
  canonical: 'https://ai-autosite.com/blog/timestamp-converter-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
