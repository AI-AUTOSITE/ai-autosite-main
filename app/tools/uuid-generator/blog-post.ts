// app/tools/uuid-generator/blog-post.ts
import { Key } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const uuidGeneratorPost: BlogPost = {
    id: 'uuid-generator-guide',
    title: 'UUID Generator - Create Unique Identifiers',
    description:
      'Generate UUIDs for databases and APIs. Create unique identifiers instantly with our free tool.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Key,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'UUID Generator',
      url: '/tools/uuid-generator',
    },
    
    tags: ['uuid', 'guid', 'identifier', 'database'],
    keywords: ['uuid generator', 'guid generator', 'unique identifier', 'database id'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'UUID Generator - Create Unique Database Identifiers',
    seoDescription:
      'Generate UUIDs/GUIDs for databases and APIs. Create unique identifiers instantly. Free online UUID generator.',
    ogImage: '/og/uuid-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/uuid-generator-guide',
    
    schema: {
      type: 'TechArticle',
      headline: 'UUID Generator - Create Unique Identifiers',
      image: ['/og/uuid-generator-guide.png'],
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
      wordCount: 2000,
      inLanguage: 'en'
    },
    
    priority: 0.8,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'UUID Generator - Unique Identifiers',
      description: 'Generate UUIDs for databases and APIs',
      image: '/og/uuid-generator-guide.png'
    },
    
    openGraph: {
      title: 'UUID Generator - Create Unique Identifiers',
      description: 'Generate UUIDs/GUIDs instantly',
      type: 'article',
      url: 'https://ai-autosite.com/blog/uuid-generator-guide',
      images: [{
        url: 'https://ai-autosite.com/og/uuid-generator-guide.png',
        width: 1200,
        height: 630,
        alt: 'UUID Generator Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['uuid', 'database', 'identifier'],
        section: 'Dev Tools'
      }
    }
  }
