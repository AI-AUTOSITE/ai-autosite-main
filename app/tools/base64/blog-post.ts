// app/tools/base64/blog-post.ts
import { Code } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const base64Post: BlogPost = {
    id: 'base64-guide',
    title: "Base64 Encoding: The Developer's Guide",
    description:
      'Everything about Base64 encoding. Learn when to use it, how it works, and common use cases.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Code,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Base64 Tool',
      url: '/tools/base64',
    },
    
    tags: ['base64', 'encoding', 'development', 'api'],
    keywords: ['base64 encoding', 'base64 decoder', 'data encoding', 'developer tools'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Base64 Encoding Guide - Everything Developers Need to Know',
    seoDescription:
      'Complete guide to Base64 encoding. Learn when to use it, how it works, and common use cases. Free encoder/decoder tool.',
    ogImage: '/og/base64-guide.png',
    canonical: 'https://ai-autosite.com/blog/base64-guide',
    
    schema: {
      type: 'TechArticle',
      headline: 'Base64 Encoding: The Developer\'s Guide',
      image: ['/og/base64-guide.png'],
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
    
    priority: 0.8,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'Base64 Encoding: Developer\'s Guide',
      description: 'Learn when and how to use Base64 encoding',
      image: '/og/base64-guide.png'
    },
    
    openGraph: {
      title: 'Base64 Encoding: The Developer\'s Guide',
      description: 'Everything you need to know about Base64',
      type: 'article',
      url: 'https://ai-autosite.com/blog/base64-guide',
      images: [{
        url: 'https://ai-autosite.com/og/base64-guide.png',
        width: 1200,
        height: 630,
        alt: 'Base64 Encoding Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['base64', 'encoding', 'development'],
        section: 'Dev Tools'
      }
    }
  }
