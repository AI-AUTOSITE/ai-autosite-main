// app/tools/stack-recommender/blog-post.ts
import { Cpu } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const stackRecommenderPost: BlogPost = {
    id: 'ai-stack-recommender-guide',
    title: 'AI Stack Recommender: Get Your Perfect Tech Stack in 30 Seconds',
    description:
      'Stop analysis paralysis. Get personalized tech stack recommendations based on your project, budget, and experience level.',
    readTime: '5 min read',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Cpu,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'AI Stack Recommender',
      url: '/tools/stack-recommender',
    },
    
    tags: ['tech-stack', 'ai', 'recommendations', 'frameworks'],
    keywords: ['tech stack recommender', 'ai recommendations', 'framework selection', 'technology choice'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'AI Stack Recommender - Get Your Perfect Tech Stack',
    seoDescription:
      'Get personalized tech stack recommendations in 30 seconds. Stop analysis paralysis. AI-powered technology selection.',
    ogImage: '/og/ai-stack-recommender-guide.png',
    canonical: 'https://ai-autosite.com/blog/ai-stack-recommender-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Choose the Perfect Tech Stack with AI',
      image: ['/og/ai-stack-recommender-guide.png'],
      datePublished: '2025-10-19',
      dateModified: '2025-10-19',
      author: {
        type: 'Organization',
        name: 'AI AutoSite Team',
        url: 'https://ai-autosite.com'
      },
      publisher: {
        type: 'Organization',
        name: 'AI AutoSite',
        logo: {
          type: 'ImageObject',
          url: 'https://ai-autosite.com/logo.png'
        }
      },
      wordCount: 2500,
      inLanguage: 'en'
    },
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'AI Stack Recommender - Perfect Tech Stack',
      description: 'Get recommendations in 30 seconds',
      image: '/og/ai-stack-recommender-guide.png'
    },
    
    openGraph: {
      title: 'AI Stack Recommender: Get Your Perfect Tech Stack',
      description: 'Personalized recommendations in 30 seconds',
      type: 'article',
      url: 'https://ai-autosite.com/blog/ai-stack-recommender-guide',
      images: [{
        url: 'https://ai-autosite.com/og/ai-stack-recommender-guide.png',
        width: 1200,
        height: 630,
        alt: 'AI Stack Recommender Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['tech-stack', 'ai', 'recommendations'],
        section: 'Dev Tools'
      }
    }
  }
