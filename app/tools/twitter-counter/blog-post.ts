// app/tools/twitter-counter/blog-post.ts
import { Twitter } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const twitterCounterPost: BlogPost = {
    id: 'twitter-counter-guide',
    title: 'Twitter Character Counter - Stay Within Limits',
    description:
      'Count characters for Twitter/X posts. Never exceed the 280 character limit with our free counter.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Twitter,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Twitter Counter',
      url: '/tools/twitter-counter',
    },
    
    tags: ['twitter', 'counter', 'social', 'character-count'],
    keywords: ['twitter character counter', 'x character counter', 'tweet counter'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Twitter Character Counter - Count Tweet Characters',
    seoDescription:
      'Count characters for Twitter/X posts. Stay within the 280 character limit. Free Twitter character counter.',
    ogImage: '/og/twitter-counter-guide.png',
    canonical: 'https://ai-autosite.com/blog/twitter-counter-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
