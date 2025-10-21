// app/tools/age-calculator/blog-post.ts
import { Calendar } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const ageCalculatorPost: BlogPost = {
  id: 'age-calculator-guide',
  title: 'Age Calculator Online - Calculate Exact Age',
  description: "Calculate your exact age with our free age calculator. Find out how many days you've lived and days until next birthday.",
  readTime: '3 min',
  publishDate: 'October 2025',
  lastUpdated: '2025-10-21',
  icon: Calendar,
  featured: false,
  status: 'published',
  
  relatedTool: {
    name: 'Age Calculator',
    url: '/tools/age-calculator',
  },
  
  tags: ['age', 'calculator', 'birthday', 'date'],
  keywords: ['age calculator', 'calculate age', 'birthday calculator'],
  category: 'quick-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Age Calculator - Calculate Your Exact Age Online',
  seoDescription: 'Calculate your exact age in years, months, days, and hours. Find days until your next birthday. Free online age calculator.',
  ogImage: '/og/age-calculator-guide.png',
  canonical: 'https://ai-autosite.com/blog/age-calculator-guide',
  
  priority: 0.6,
  changeFreq: 'monthly',
}