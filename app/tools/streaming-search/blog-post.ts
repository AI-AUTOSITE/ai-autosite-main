// app/tools/streaming-search/blog-post.ts
import { Monitor } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const streamingSearchPost: BlogPost = {
  id: 'streaming-search-guide',
  title: 'Free Streaming Search: Find Where to Watch Any Movie or TV Show',
  description:
    'Learn how to use our free streaming availability checker to find where to watch movies and TV shows across Netflix, Prime Video, Disney+, and more — no account required.',
  readTime: '5 min read',
  publishDate: '2026-03-17',
  lastUpdated: '2026-03-17',
  icon: Monitor,
  featured: true,
  status: 'published',
  relatedTool: {
    name: 'Streaming Search',
    url: '/tools/streaming-search',
  },
  tags: ['streaming', 'movies', 'tv shows', 'search', 'where to watch'],
  keywords: [
    'where to watch movies',
    'streaming availability checker',
    'free streaming search',
    'netflix search without account',
    'find where to stream',
  ],
  author: 'AI AutoSite Team',
  category: 'analyzers',
  seoTitle:
    'Free Streaming Search Tool - Where to Watch Movies & TV Shows 2026',
  seoDescription:
    'Search across Netflix, Prime Video, Disney+, Hulu, and more to find where any movie or TV show is streaming. Free, private, no account needed.',
  schema: {
    type: 'HowTo',
    headline:
      'How to Find Where to Watch Any Movie or TV Show Online',
    inLanguage: 'en',
    author: {
      type: 'Organization',
      name: 'AI AutoSite',
    },
  },
  priority: 0.8,
  changeFreq: 'monthly',
}
