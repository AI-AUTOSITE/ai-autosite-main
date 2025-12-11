// app/tools/meta-tag-generator/blog-post.ts
import { Code } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const metaTagGeneratorPost: BlogPost = {
  id: 'meta-tag-generator-guide',
  title: 'Meta Tag Generator: SEO Tags Made Easy',
  description: 'Generate SEO meta tags with Open Graph and Twitter card support.',
  readTime: '6 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Code,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Meta Tag Generator',
    url: '/tools/meta-tag-generator',
  },
  
  tags: ['meta-tags', 'seo', 'og-tags', 'twitter-card', 'html'],
  keywords: ['meta tag generator', 'seo tags', 'open graph generator', 'twitter card generator'],
  category: 'dev-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Meta Tag Generator - SEO & Social Tags',
  seoDescription: 'Generate complete meta tags for SEO. Includes Open Graph, Twitter cards, and Google search preview.',
  ogImage: '/og/meta-tag-generator-guide.png',
  canonical: 'https://ai-autosite.com/blog/meta-tag-generator-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
