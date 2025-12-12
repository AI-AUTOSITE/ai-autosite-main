// app/tools/bg-eraser/blog-post.ts
import { Sparkles } from 'lucide-react'
import type { BlogPost } from '../../lib/blog-posts/types'

export const bgEraserPost: BlogPost = {
  id: 'bg-eraser-guide',
  title: 'How to Remove Image Backgrounds for Free',
  description:
    'Learn how to remove backgrounds from photos instantly using AI. No signup, no watermarks, completely free.',
  readTime: '5 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-10',
  icon: Sparkles,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Background Eraser',
    url: '/tools/bg-eraser',
  },
  
  tags: ['background-removal', 'image-editing', 'ai-tools', 'free-tools'],
  keywords: ['remove background', 'background eraser', 'transparent png', 'cutout', 'free background remover'],
  category: 'image-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Free Background Remover - Remove Image Backgrounds Instantly',
  seoDescription:
    'Remove backgrounds from photos instantly with AI. 100% free, no signup required. Create transparent PNGs for e-commerce, social media, and more.',
  ogImage: '/og/bg-eraser-guide.png',
  canonical: 'https://ai-autosite.com/blog/bg-eraser-guide',
  
  schema: {
    type: 'HowTo',
    headline: 'How to Remove Image Backgrounds for Free',
    image: ['/og/bg-eraser-guide.png'],
    datePublished: '2025-12-10',
    dateModified: '2025-12-10',
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
    title: 'Free Background Remover - No Signup Required',
    description: 'Remove backgrounds instantly with AI',
    image: '/og/bg-eraser-guide.png'
  },
  
  openGraph: {
    title: 'How to Remove Image Backgrounds for Free',
    description: 'Complete guide to removing backgrounds from photos',
    type: 'article',
    url: 'https://ai-autosite.com/blog/bg-eraser-guide',
    images: [{
      url: 'https://ai-autosite.com/og/bg-eraser-guide.png',
      width: 1200,
      height: 630,
      alt: 'Background Eraser Guide'
    }],
    locale: 'en_US',
    siteName: 'AI AutoSite',
    article: {
      publishedTime: '2025-12-10',
      modifiedTime: '2025-12-10',
      authors: ['AI AutoSite Team'],
      tags: ['background-removal', 'image-editing', 'ai-tools'],
      section: 'Image Tools'
    }
  }
}
