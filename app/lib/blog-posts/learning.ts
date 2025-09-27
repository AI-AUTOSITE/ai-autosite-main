import { BookOpen } from 'lucide-react'
import type { BlogPost } from './types'

export const learningPosts: BlogPost[] = [
  {
    id: 'ai-dev-dictionary',
    title: 'Introducing AI Dev Dictionary',
    description: 'Master AI and development terminology with our interactive dictionary.',
    readTime: '5 min',
    publishDate: 'December 2024',
    lastUpdated: '2025-01-26',
    icon: BookOpen,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'AI Dev Dictionary',
      url: '/tools/ai-dev-dictionary'
    },
    // Additional metadata
    tags: ['ai', 'development', 'dictionary', 'learning', 'terminology', 'education'],
    category: 'learning',
    author: 'AI AutoSite Team',
    views: 0,
    // SEO
    seoTitle: 'AI Dev Dictionary - Learn AI & Development Terms',
    seoDescription: 'Master AI and development terminology with our interactive dictionary. Understand technical concepts easily. Free learning resource.',
    ogImage: '/og/ai-dev-dictionary-guide.png'
  }
]