// app/tools/text-counter/blog-post.ts
import { Type } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const textCounterPost: BlogPost = {
    id: 'text-counter-guide',
    title: 'Word & Character Counter Guide',
    description:
      'Master word and character limits for essays, social media, and SEO. Know exactly how long your text is.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Type,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Text Counter',
      url: '/tools/text-counter',
    },
    
    tags: ['word-counter', 'character-counter', 'writing-tools', 'seo'],
    keywords: ['word counter', 'character counter', 'text counter'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Word & Character Counter - Count Text Instantly',
    seoDescription:
      'Count words and characters for essays, social media, and SEO. Free text counter with instant results.',
    ogImage: '/og/text-counter-guide.png',
    canonical: 'https://ai-autosite.com/blog/text-counter-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
