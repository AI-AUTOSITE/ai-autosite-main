// app/tools/test-text-generator/blog-post.ts
import { FileText } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const testTextGeneratorPost: BlogPost = {
    id: 'test-text-generator-guide',
    title: 'Test Text Generator Guide',
    description: 'Complete guide to generating test text with custom length and complexity for development testing.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileText,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Test Text Generator',
      url: '/tools/test-text-generator'
    },
    
    tags: ['testing', 'text', 'lorem ipsum', 'development'],
    keywords: ['test text generator', 'lorem ipsum', 'dummy text'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Test Text Generator - Create Dummy Text for Testing',
    seoDescription:
      'Generate test text with custom length and complexity. Perfect for development testing. Free online tool.',
    ogImage: '/og/test-text-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/test-text-generator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
