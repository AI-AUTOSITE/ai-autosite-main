// app/tools/lorem-ipsum/blog-post.ts
import { Type } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const loremIpsumPost: BlogPost = {
    id: 'lorem-ipsum-generator-guide',
    title: 'Lorem Ipsum Generator - Modern Placeholder Text Tool',
    description:
      'Generate Lorem Ipsum with dark mode, multiple formats, keyboard shortcuts, and API access. Privacy-first modern alternative.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-11-25',
    icon: Type,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Lorem Ipsum Generator',
      url: '/tools/lorem-ipsum',
    },
    
    tags: ['lorem', 'ipsum', 'text', 'placeholder', 'dark-mode', 'api', 'download', 'keyboard-shortcuts'],
    keywords: [
      'lorem ipsum generator',
      'dummy text',
      'placeholder text',
      'lorem ipsum with dark mode',
      'lorem ipsum api',
      'download lorem ipsum',
      'modern lorem ipsum',
      'privacy-first lorem ipsum',
    ],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Lorem Ipsum Generator - Dark Mode, API, Multiple Formats | Free',
    seoDescription:
      'Modern Lorem Ipsum generator with dark mode, download in 4 formats (TXT, HTML, MD, JSON), keyboard shortcuts, and API access. Privacy-first, no tracking.',
    ogImage: '/og/lorem-ipsum-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/lorem-ipsum-generator-guide',
    
    priority: 0.8,
    changeFreq: 'monthly',
  }