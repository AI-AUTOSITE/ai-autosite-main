// app/lib/blog-posts/business-tools.ts
import { Hash, Instagram, Youtube, MessageCircle, 
  Sparkles, Palette, TrendingUp, BarChart3, Target, Briefcase } from 'lucide-react'
import type { BlogPost } from './types'

export const businessToolsPosts: BlogPost[] = [
  {
    id: 'competitive-analyzer-guide',
    title: 'Master Competitive Analysis with AI-Powered Tool Analyzer',
    description: 'Learn how to instantly analyze competitor SaaS products, identify market gaps, and generate innovative product ideas using AI technology.',
    readTime: '7 min',
    publishDate: 'January 2025',
    icon: TrendingUp,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Competitive Tool Analyzer',
      url: '/tools/competitive-analyzer'
    },
    category: 'business'  // 'business' → 'business'に変更
  },
  {
    id: 'instagram-bio-generator-guide',
    title: 'Instagram Bio Generator - Perfect Profiles',
    description: 'Create engaging Instagram bios that attract followers. Free bio generator with templates.',
    readTime: '4 min',
    publishDate: '2025-01-20',
    icon: Instagram,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Instagram Bio Generator',
      url: '/tools/instagram-bio'
    },
    tags: ['instagram', 'bio', 'social'],
    category: 'business'  // 'business' → 'business'に変更
  },
  {
    id: 'youtube-thumbnail-guide',
    title: 'YouTube Thumbnail Downloader - Get HD Thumbnails',
    description: 'Download YouTube video thumbnails in HD. Free thumbnail grabber for content creators.',
    readTime: '3 min',
    publishDate: '2025-01-20',
    icon: Youtube,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'YouTube Thumbnail',
      url: '/tools/youtube-thumbnail'
    },
    tags: ['youtube', 'thumbnail', 'download'],
    category: 'business'  // 'business' → 'business'に変更
  },
  {
    id: 'whatsapp-link-generator-guide',
    title: 'WhatsApp Link Generator - Click to Chat',
    description: 'Create WhatsApp chat links for business. Let customers message without saving numbers.',
    readTime: '3 min',
    publishDate: '2025-01-20',
    icon: MessageCircle,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'WhatsApp Link',
      url: '/tools/whatsapp-link'
    },
    tags: ['whatsapp', 'business', 'link'],
    category: 'business'  // 'business' → 'business'に変更
  },
  {
    id: 'hashtag-generator-guide',
    title: 'Master Hashtag Strategy: Get More Reach on Social Media',
    description: 'Learn how to generate perfect hashtags for Instagram, Twitter, and TikTok. Boost engagement with strategic tag selection.',
    readTime: '6 min',
    publishDate: 'January 2025',
    lastUpdated: '2025-01-26',
    icon: Hash,
    coverImage: '/blog/images/hashtag-strategy-hero.jpg',
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Hashtag Generator',
      url: '/tools/hashtag-generator'
    },
    tags: ['hashtags', 'social-media', 'instagram', 'twitter', 'tiktok', 'marketing', 'engagement', 'content-strategy'],
    category: 'business',  // 'business' → 'business'に変更
    author: 'AI AutoSite Team',
    views: 0,
    seoTitle: 'Hashtag Generator Guide 2025 - Best Tags for Social Media',
    seoDescription: 'Generate perfect hashtags for Instagram, Twitter, and TikTok. Learn hashtag strategies to increase reach and engagement. Free tool included.',
    ogImage: '/og/hashtag-generator-guide.png'
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
      url: '/tools/ai-prompt-generator'
    },
    tags: ['ai', 'prompt', 'chatgpt'],
    category: 'business'  // 'business' → 'business'に変更
  },
  {
    id: 'gradient-generator-guide',
    title: 'Gradient Generator CSS - Beautiful Colors',
    description: 'Create stunning CSS gradients for web design. Free gradient generator with live preview.',
    readTime: '4 min',
    publishDate: '2025-01-20',
    icon: Palette,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'Gradient Generator',
      url: '/tools/gradient-generator'
    },
    tags: ['gradient', 'css', 'design'],
    category: 'business'  // 'business' → 'business'に変更
  }
  // 注意：competitive-analyzer-guideの重複を削除しました
]