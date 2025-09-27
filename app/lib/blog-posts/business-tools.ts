import {   Hash, Instagram, Youtube, MessageCircle, 
  Sparkles, Palette , TrendingUp, BarChart3, Target, Briefcase } from 'lucide-react'
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
    }
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
  category: 'business-tools'
},
{
  id: 'competitive-analyzer-guide',
  title: 'How to Conduct Market Research with AI: Complete Guide',
  description: 'Learn how to analyze competitors, identify market gaps, and discover product opportunities using AI-powered competitive analysis tools.',
  
  // Time-related
  readTime: '7 min',
  publishDate: 'January 2025',
  lastUpdated: '2025-01-26',
  
  // Visual
  icon: TrendingUp,  // ✅ 文字列ではなく、インポートしたコンポーネント
  coverImage: '/blog/images/competitive-analysis-hero.jpg',
  
  // Status & Display
  featured: true,
  status: 'published',
  
  // Related content
  relatedTool: {
    name: 'Competitive Analyzer',
    url: '/tools/competitive-analyzer'
  },
  
  // Additional metadata
  tags: ['market-research', 'competitive-analysis', 'business-strategy', 'ai-tools'],
  category: 'study-tools',  // または 'business-tools'（配置場所による）
  author: 'AI AutoSite Team',
  views: 0,
  
  // SEO
  seoTitle: 'AI Competitive Analysis Guide 2025 | Market Research Tool',
  seoDescription: 'Master competitive analysis with our AI-powered tool. Analyze competitors, find market gaps, and generate product ideas in seconds.',
  ogImage: '/og/competitive-analyzer-guide.png'
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
  category: 'business-tools'
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
  category: 'business-tools'
},
  {
  id: 'hashtag-generator-guide',
  title: 'Master Hashtag Strategy: Get More Reach on Social Media',
  description: 'Learn how to generate perfect hashtags for Instagram, Twitter, and TikTok. Boost engagement with strategic tag selection.',
  
  // Time-related
  readTime: '6 min',
  publishDate: 'January 2025',
  lastUpdated: '2025-01-26',
  
  // Visual
  icon: Hash, // import from lucide-react
  coverImage: '/blog/images/hashtag-strategy-hero.jpg',
  
  // Status & Display
  featured: true,
  status: 'published',
  
  // Related content
  relatedTool: {
    name: 'Hashtag Generator',
    url: '/tools/hashtag-generator'
  },
  
  // Additional metadata
  tags: ['hashtags', 'social-media', 'instagram', 'twitter', 'tiktok', 'marketing', 'engagement', 'content-strategy'],
  category: 'business-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  // SEO
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
  category: 'business-tools'
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
  category: 'business-tools'
},
]