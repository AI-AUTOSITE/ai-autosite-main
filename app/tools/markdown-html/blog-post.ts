// app/tools/markdown-html/blog-post.ts
import { Hash } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const markdownHtmlPost: BlogPost = {
    id: 'markdown-guide',
    title: "Master Markdown: The Developer's Writing Tool",
    description:
      'Complete guide to Markdown syntax. Learn to write documentation, README files, and blog posts efficiently.',
    readTime: '6 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Hash,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Markdown to HTML',
      url: '/tools/markdown-html',
    },
    
    tags: ['markdown', 'documentation', 'writing', 'github'],
    keywords: ['markdown guide', 'markdown syntax', 'readme files', 'documentation'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Markdown Guide - Master Documentation & README Files',
    seoDescription:
      'Complete Markdown syntax guide. Learn to write documentation, README files, and blog posts. Essential for developers.',
    ogImage: '/og/markdown-guide.png',
    canonical: 'https://ai-autosite.com/blog/markdown-guide',
    
    schema: {
      type: 'TechArticle',
      headline: 'Master Markdown: The Developer\'s Writing Tool',
      image: ['/og/markdown-guide.png'],
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
      wordCount: 3000,
      inLanguage: 'en'
    },
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'Master Markdown - Developer\'s Guide',
      description: 'Complete Markdown syntax guide',
      image: '/og/markdown-guide.png'
    },
    
    openGraph: {
      title: 'Master Markdown: The Developer\'s Writing Tool',
      description: 'Complete guide to Markdown syntax',
      type: 'article',
      url: 'https://ai-autosite.com/blog/markdown-guide',
      images: [{
        url: 'https://ai-autosite.com/og/markdown-guide.png',
        width: 1200,
        height: 630,
        alt: 'Markdown Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['markdown', 'documentation', 'github'],
        section: 'Dev Tools'
      }
    }
  }
