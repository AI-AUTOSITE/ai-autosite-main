// app/tools/whatsapp-link/blog-post.ts
import { MessageCircle } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const whatsappLinkPost: BlogPost = {
    id: 'whatsapp-link-generator-guide',
    title: 'WhatsApp Link Generator - Click to Chat',
    description:
      'Create WhatsApp chat links for business. Let customers message without saving numbers.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: MessageCircle,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'WhatsApp Link Generator',
      url: '/tools/whatsapp-link',
    },
    
    tags: ['whatsapp', 'business', 'link', 'chat', 'customer-service'],
    keywords: ['whatsapp link', 'click to chat', 'wa.me link'],
    category: 'business',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'WhatsApp Link Generator - Create Click-to-Chat Links',
    seoDescription:
      'Generate WhatsApp chat links for your business. Let customers message you without saving your number. Free link generator tool.',
    ogImage: '/og/whatsapp-link-guide.png',
    canonical: 'https://ai-autosite.com/blog/whatsapp-link-generator-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
