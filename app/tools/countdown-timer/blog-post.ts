// app/tools/countdown-timer/blog-post.ts
import { Clock } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const countdownTimerPost: BlogPost = {
    id: 'countdown-timer-guide',
    title: 'Countdown Timer - Track Important Events',
    description:
      'Create countdown timers for events and deadlines. Never miss important dates with our free timer.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Clock,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Countdown Timer',
      url: '/tools/countdown-timer',
    },
    
    tags: ['timer', 'countdown', 'events', 'deadline'],
    keywords: ['countdown timer', 'event countdown', 'deadline timer'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Countdown Timer - Track Events & Deadlines',
    seoDescription:
      'Create countdown timers for important events. Never miss deadlines. Free online countdown timer.',
    ogImage: '/og/countdown-timer-guide.png',
    canonical: 'https://ai-autosite.com/blog/countdown-timer-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
