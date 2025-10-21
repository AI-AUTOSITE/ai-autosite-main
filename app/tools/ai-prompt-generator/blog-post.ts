// app/tools/ai-prompt-generator/blog-post.ts
import { Sparkles } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const aiPromptGeneratorPost: BlogPost = {
    id: 'ai-prompt-generator-guide',
    title: 'AI Prompt Generator - Better ChatGPT Prompts',
    description: 'Generate effective AI prompts. Master prompt engineering for ChatGPT and Claude.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Sparkles,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'AI Prompt Generator',
      url: '/tools/ai-prompt-generator',
    },
    
    tags: ['ai', 'prompt', 'chatgpt', 'claude', 'prompt-engineering'],
    keywords: ['prompt generator', 'chatgpt prompts', 'ai prompts'],
    category: 'business',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'AI Prompt Generator - Create Better ChatGPT Prompts',
    seoDescription:
      'Generate effective AI prompts for ChatGPT and Claude. Master prompt engineering with our free tool. Get better AI responses.',
    ogImage: '/og/ai-prompt-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/ai-prompt-generator-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
