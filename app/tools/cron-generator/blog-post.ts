// app/tools/cron-generator/blog-post.ts
import { Calendar } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const cronGeneratorPost: BlogPost = {
  id: 'cron-generator-guide',
  title: 'Cron Generator: Build Cron Expressions Visually',
  description: 'Create cron expressions with visual builder, human-readable translation, and next runs preview.',
  readTime: '7 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Calendar,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Cron Generator',
    url: '/tools/cron-generator',
  },
  
  tags: ['cron', 'scheduler', 'automation', 'developer', 'linux'],
  keywords: ['cron generator', 'cron expression', 'crontab', 'scheduled tasks'],
  category: 'dev-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Cron Generator - Visual Cron Expression Builder',
  seoDescription: 'Build cron expressions visually. Human-readable translation, next 5 runs preview, common presets. No signup required.',
  ogImage: '/og/cron-generator-guide.png',
  canonical: 'https://ai-autosite.com/blog/cron-generator-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
