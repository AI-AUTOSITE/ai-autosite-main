// app/tools/haiku-generator/blog-post.ts
import { Sparkles } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const haikuGeneratorPost: BlogPost = {
   id: 'haiku-generator-guide',
    title: 'AI Haiku Generator: Learn Poetry Writing',
    description: 'Master 5-7-5 poetry structure with AI coaching.',
    readTime: '7 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Sparkles,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'AI Haiku Generator',
      url: '/tools/haiku-generator',
    },
    relatedPosts: [
      'text-counter-guide',
      'lorem-ipsum-guide'
    ],
    
    tags: ['haiku', 'poetry', 'creative-writing', 'ai'],
    keywords: [
      'haiku generator',
      'ai poetry',
      '5-7-5 poetry',
      'season words',
      'kigo'
    ],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'AI Haiku Generator - Learn Poetry Writing | Free Tool',
    seoDescription: 'Create beautiful haikus with AI guidance. Learn 5-7-5 syllable structure, season words (kigo), and poetry writing. Free coaching included.',
    ogImage: '/og/haiku-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/haiku-generator-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Write Perfect Haikus with AI',
      image: ['/og/haiku-generator-guide.png'],
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
      wordCount: 3500,
      inLanguage: 'en'
    },
    
    language: 'en',
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      creator: '@aiautositecom',
      title: 'AI Haiku Generator - Master Poetry Writing',
      description: 'Learn 5-7-5 haiku structure with AI coaching',
      image: '/og/haiku-generator-guide.png'
    },
    
    openGraph: {
      title: 'AI Haiku Generator - Master Poetry Writing',
      description: 'Create beautiful haikus with AI guidance',
      type: 'article',
      url: 'https://ai-autosite.com/blog/haiku-generator-guide',
      images: [{
        url: 'https://ai-autosite.com/og/haiku-generator-guide.png',
        width: 1200,
        height: 630,
        alt: 'AI Haiku Generator Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['haiku', 'poetry', 'ai', 'learning'],
        section: 'Study Tools'
      }
    }
  }
