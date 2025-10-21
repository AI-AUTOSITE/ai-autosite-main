// app/tools/blurtap/blog-post.ts
import { Shield } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const blurtapPost: BlogPost = {
    id: 'blurtap-guide',
    title: 'BlurTap - Protect Privacy in Screenshots with One Click',
    description:
      'Instantly blur sensitive information in images. Perfect for sharing screenshots safely on social media.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Shield,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'BlurTap',
      url: '/tools/blurtap',
    },
    
    tags: ['privacy', 'blur', 'images', 'security', 'screenshots'],
    keywords: ['blur tool', 'privacy protection', 'screenshot blur', 'image privacy'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'BlurTap - Privacy Protection Tool for Images',
    seoDescription:
      'Blur sensitive information in screenshots with one click. Protect privacy when sharing images online. Free privacy tool.',
    ogImage: '/og/blurtap-guide.png',
    canonical: 'https://ai-autosite.com/blog/blurtap-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Protect Privacy in Screenshots',
      image: ['/og/blurtap-guide.png'],
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
      wordCount: 1500,
      inLanguage: 'en'
    },
    
    priority: 0.8,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'BlurTap - Protect Screenshot Privacy',
      description: 'One-click privacy protection',
      image: '/og/blurtap-guide.png'
    },
    
    openGraph: {
      title: 'BlurTap - Protect Privacy in Screenshots',
      description: 'One-click blur for sensitive information',
      type: 'article',
      url: 'https://ai-autosite.com/blog/blurtap-guide',
      images: [{
        url: 'https://ai-autosite.com/og/blurtap-guide.png',
        width: 1200,
        height: 630,
        alt: 'BlurTap Privacy Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['privacy', 'blur', 'security'],
        section: 'Quick Tools'
      }
    }
  }
