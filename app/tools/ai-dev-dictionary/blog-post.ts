// app/tools/ai-dev-dictionary/blog-post.ts
import { BookOpen } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const aiDevDictionaryPost: BlogPost = {
    id: 'ai-dev-dictionary',
    title: 'Introducing AI Dev Dictionary',
    description: 'Master AI and development terminology with our interactive dictionary.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: BookOpen,
    featured: true,
    status: 'published',

    relatedTool: {
      name: 'AI Dev Dictionary',
      url: '/tools/ai-dev-dictionary',
    },

    tags: ['ai', 'development', 'dictionary', 'learning', 'terminology', 'education'],
    keywords: [
      'ai dictionary',
      'development terms',
      'tech terminology',
      'ai learning',
      'developer education',
    ],
    category: 'learning',
    author: 'AI AutoSite Team',
    views: 0,

    seoTitle: 'AI Dev Dictionary - Learn AI & Development Terms',
    seoDescription:
      'Master AI and development terminology with our interactive dictionary. Understand technical concepts easily. Free learning resource.',
    ogImage: '/og/ai-dev-dictionary-guide.png',
    canonical: 'https://ai-autosite.com/blog/ai-dev-dictionary',
    schema: {
      type: 'Article',
      headline: 'Introducing AI Dev Dictionary',
      image: ['/og/ai-dev-dictionary-guide.png'],
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
    
    language: 'en',
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      creator: '@aiautositecom',
      title: 'AI Dev Dictionary - Master Tech Terms',
      description: 'Interactive dictionary for AI and development',
      image: '/og/ai-dev-dictionary-guide.png'
    },

    openGraph: {
      title: 'Introducing AI Dev Dictionary',
      description: 'Master AI and development terminology',
      type: 'article',
      url: 'https://ai-autosite.com/blog/ai-dev-dictionary',
      images: [{
        url: 'https://ai-autosite.com/og/ai-dev-dictionary-guide.png',
        width: 1200,
        height: 630,
        alt: 'AI Dev Dictionary Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['ai', 'development', 'learning', 'education'],
        section: 'Learning Hub'
      }
    }
  }
