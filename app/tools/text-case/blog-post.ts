// app/tools/text-case/blog-post.ts
import { Type } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const textCasePost: BlogPost = {
    id: 'text-case-converter',
    title: 'Master Text Case Conversion: 10 Essential Formats',
    description: 'Complete guide to text case conversion for developers.',
    readTime: '8 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Type,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Text Case Converter',
      url: '/tools/text-case',
    },
    
    tags: ['text-conversion', 'case-converter', 'developer-tools', 'formatting'],
    keywords: ['text case converter', 'camelCase', 'snake_case', 'PascalCase'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Text Case Converter - 10 Essential Formats for Developers',
    seoDescription:
      'Convert text between camelCase, PascalCase, snake_case and more. Essential developer tool for code formatting. Free online converter.',
    ogImage: '/og/text-case-converter-guide.png',
    canonical: 'https://ai-autosite.com/blog/text-case-converter',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
