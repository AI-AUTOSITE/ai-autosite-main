// app/tools/percentage-calculator/blog-post.ts
import { Percent } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const percentageCalculatorPost: BlogPost = {
    id: 'percentage-calculator-guide',
    title: 'Percentage Calculator - Quick % Calculations',
    description:
      'Calculate percentages instantly. Find percentage increase, decrease, and discounts with our free tool.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Percent,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Percentage Calculator',
      url: '/tools/percentage-calculator',
    },
    
    tags: ['percentage', 'calculator', 'math'],
    keywords: ['percentage calculator', 'calculate percentage', 'discount calculator'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Percentage Calculator - Calculate % Instantly',
    seoDescription:
      'Calculate percentages, discounts, and increases instantly. Free percentage calculator for everyday math. Quick and accurate.',
    ogImage: '/og/percentage-calculator-guide.png',
    canonical: 'https://ai-autosite.com/blog/percentage-calculator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
