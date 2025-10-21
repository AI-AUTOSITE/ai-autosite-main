// app/tools/bmi-calculator/blog-post.ts
import { Heart } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const bmiCalculatorPost: BlogPost = {
    id: 'bmi-calculator-guide',
    title: 'BMI Calculator - Check Body Mass Index',
    description:
      'Calculate your BMI instantly. Understand your weight category and health risks with our free BMI calculator.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Heart,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'BMI Calculator',
      url: '/tools/bmi-calculator',
    },
    
    tags: ['bmi', 'health', 'calculator', 'fitness'],
    keywords: ['bmi calculator', 'body mass index', 'health calculator'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'BMI Calculator - Check Your Body Mass Index',
    seoDescription:
      'Calculate your BMI and understand your weight category. Free BMI calculator with health insights. Check your body mass index now.',
    ogImage: '/og/bmi-calculator-guide.png',
    canonical: 'https://ai-autosite.com/blog/bmi-calculator-guide',
    
    priority: 0.6,
    changeFreq: 'monthly',
  }
