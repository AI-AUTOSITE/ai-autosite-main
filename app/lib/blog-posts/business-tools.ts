// app/lib/blog-posts/business-tools.ts
import { Hash, MessageCircle, Sparkles, TrendingUp, FileText } from 'lucide-react'
import type { BlogPost } from './types'

export const businessToolsPosts: BlogPost[] = [
  {
    id: 'competitive-analyzer-guide',
    title: 'Master Competitive Analysis with AI-Powered Tool Analyzer',
    description:
      'Learn how to instantly analyze competitor SaaS products, identify market gaps, and generate innovative product ideas using AI technology.',
    readTime: '7 min',
    publishDate: 'January 2025',
    icon: TrendingUp,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Competitive Tool Analyzer',
      url: '/tools/competitive-analyzer',
    },
    category: 'business',
  },
  {
    id: 'whatsapp-link-generator-guide',
    title: 'WhatsApp Link Generator - Click to Chat',
    description:
      'Create WhatsApp chat links for business. Let customers message without saving numbers.',
    readTime: '3 min',
    publishDate: '2025-01-20',
    icon: MessageCircle,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'WhatsApp Link Generator',
      url: '/tools/whatsapp-link',
    },
    tags: ['whatsapp', 'business', 'link', 'chat', 'generator'],
    category: 'business',
  },
  {
    id: 'hashtag-generator-guide',
    title: 'Master Hashtag Strategy: Get More Reach on Social Media',
    description:
      'Learn how to generate perfect hashtags for Instagram, Twitter, and TikTok. Boost engagement with strategic tag selection.',
    readTime: '6 min',
    publishDate: 'January 2025',
    lastUpdated: '2025-01-26',
    icon: Hash,
    coverImage: '/blog/images/hashtag-strategy-hero.jpg',
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Hashtag Generator',
      url: '/tools/hashtag-generator',
    },
    tags: [
      'hashtags',
      'social-media',
      'instagram',
      'twitter',
      'tiktok',
      'marketing',
      'engagement',
      'content-strategy',
    ],
    category: 'business',
    author: 'AI AutoSite Team',
    views: 0,
    seoTitle: 'Hashtag Generator Guide 2025 - Best Tags for Social Media',
    seoDescription:
      'Generate perfect hashtags for Instagram, Twitter, and TikTok. Learn hashtag strategies to increase reach and engagement. Free tool included.',
    ogImage: '/og/hashtag-generator-guide.png',
  },
  {
    id: 'ai-prompt-generator-guide',
    title: 'AI Prompt Generator - Better ChatGPT Prompts',
    description: 'Generate effective AI prompts. Master prompt engineering for ChatGPT and Claude.',
    readTime: '5 min',
    publishDate: '2025-01-20',
    icon: Sparkles,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'AI Prompt Generator',
      url: '/tools/ai-prompt-generator',
    },
    tags: ['ai', 'prompt', 'chatgpt', 'claude', 'generator'],
    category: 'business',
  },
  {
    id: 'ai-resume-guide',
    title: 'AI Resume & Cover Letter Generator - Professional Documents in Minutes',
    description:
      'Create tailored resumes and cover letters with AI. Stand out in job applications with professionally crafted documents.',
    readTime: '5 min',
    publishDate: 'January 2025',
    icon: FileText,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'AI Resume & Cover Letter',
      url: '/tools/ai-resume',
    },
    tags: ['resume', 'cover-letter', 'ai', 'career', 'job-search', 'claude'],
    category: 'business',
    author: 'AI AutoSite Team',
    views: 0,
    seoTitle: 'AI Resume Generator - Create Professional Resumes & Cover Letters',
    seoDescription:
      'Generate professional resumes and cover letters with AI. Tailored for your job applications. Free AI-powered career tool.',
    ogImage: '/og/ai-resume-guide.png',
  },
]
