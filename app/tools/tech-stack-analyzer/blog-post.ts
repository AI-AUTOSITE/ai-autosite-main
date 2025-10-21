// app/tools/tech-stack-analyzer/blog-post.ts
import { Code } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const techStackAnalyzerPost: BlogPost = {
    id: 'choosing-the-right-tech-stack',
    title: 'Choosing the Right Tech Stack in 2025',
    description: 'A complete guide to selecting frameworks and tools.',
    readTime: '12 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Code,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Tech Stack Analyzer',
      url: '/tools/tech-stack-analyzer',
    },
    
    tags: ['tech-stack', 'frameworks', 'architecture', 'decision-making'],
    keywords: ['tech stack guide', 'framework selection', 'technology decisions', 'architecture'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Choose the Right Tech Stack in 2025 - Complete Guide',
    seoDescription:
      'Select the perfect tech stack for your project. Compare frameworks, tools, and technologies. Make informed decisions with our comprehensive guide.',
    ogImage: '/og/tech-stack-guide.png',
    canonical: 'https://ai-autosite.com/blog/choosing-the-right-tech-stack',
    
    schema: {
      type: 'Article',
      headline: 'Choosing the Right Tech Stack in 2025',
      image: ['/og/tech-stack-guide.png'],
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
      wordCount: 4000,
      inLanguage: 'en'
    },
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'Choose the Right Tech Stack in 2025',
      description: 'Complete guide to framework selection',
      image: '/og/tech-stack-guide.png'
    },
    
    openGraph: {
      title: 'Choosing the Right Tech Stack in 2025',
      description: 'Complete guide to selecting frameworks and tools',
      type: 'article',
      url: 'https://ai-autosite.com/blog/choosing-the-right-tech-stack',
      images: [{
        url: 'https://ai-autosite.com/og/tech-stack-guide.png',
        width: 1200,
        height: 630,
        alt: 'Tech Stack Guide 2025'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['tech-stack', 'frameworks', 'architecture'],
        section: 'Dev Tools'
      }
    }
  }
