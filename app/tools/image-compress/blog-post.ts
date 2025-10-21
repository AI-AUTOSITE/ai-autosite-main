// app/tools/image-compress/blog-post.ts
import { Image } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const imageCompressPost: BlogPost = {
    id: 'image-compress-guide',
    title: 'How to Compress Images Without Losing Quality',
    description:
      'Learn how to compress images for faster websites. Reduce file sizes by 60-80% while keeping perfect quality.',
    readTime: '6 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Image,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Image Compress',
      url: '/tools/image-compress',
    },
    
    tags: ['image-compression', 'web-performance', 'seo', 'optimization'],
    keywords: ['image compression', 'compress images', 'image optimization', 'reduce file size'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Image Compression Guide - Reduce Size Without Losing Quality',
    seoDescription:
      'Compress images by 60-80% while maintaining quality. Free image compression tool for faster websites. Perfect for web developers.',
    ogImage: '/og/image-compress-guide.png',
    canonical: 'https://ai-autosite.com/blog/image-compress-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Compress Images Without Losing Quality',
      image: ['/og/image-compress-guide.png'],
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
      title: 'Compress Images Without Losing Quality',
      description: 'Reduce file sizes by 60-80%',
      image: '/og/image-compress-guide.png'
    },
    
    openGraph: {
      title: 'How to Compress Images Without Losing Quality',
      description: 'Complete image compression guide',
      type: 'article',
      url: 'https://ai-autosite.com/blog/image-compress-guide',
      images: [{
        url: 'https://ai-autosite.com/og/image-compress-guide.png',
        width: 1200,
        height: 630,
        alt: 'Image Compression Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['image-compression', 'optimization', 'web-performance'],
        section: 'Quick Tools'
      }
    }
  }
