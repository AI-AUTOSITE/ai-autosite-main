// app/tools/json-format/blog-post.ts
import { Braces } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const jsonFormatPost: BlogPost = {
    id: 'json-beautify-guide',
    title: 'JSON Beautify: Format & Debug Like a Pro',
    description: 'Learn how to format, validate, and debug JSON effectively.',
    readTime: '10 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Braces,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'JSON Beautify',
      url: '/tools/json-format',
    },
    
    tags: ['json', 'formatter', 'beautify', 'debug', 'developer-tools'],
    keywords: ['json beautify', 'json formatter', 'json validator', 'json debug'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'JSON Beautify & Format - Debug JSON Like a Pro',
    seoDescription:
      'Format, validate, and debug JSON with our free online tool. Beautify messy JSON, find errors, and improve readability instantly.',
    ogImage: '/og/json-beautify-guide.png',
    canonical: 'https://ai-autosite.com/blog/json-beautify-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
