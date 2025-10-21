// app/tools/password-generator/blog-post.ts
import { Shield } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const passwordGeneratorPost: BlogPost = {
    id: 'password-generator-guide',
    title: 'How to Create Strong Passwords in 2025',
    description:
      'Your complete guide to password security. Learn what makes passwords strong and how to protect accounts.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Shield,
    coverImage: '/blog/images/password-security-hero.jpg',
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Password Generator',
      url: '/tools/password-generator',
    },
    
    tags: ['password', 'security', 'online-safety', 'tools', 'privacy', 'cyber-security'],
    keywords: ['password generator', 'strong passwords', 'password security', 'online safety'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Password Generator Guide 2025 - Create Strong Secure Passwords',
    seoDescription:
      'Learn to create unbreakable passwords. Free password generator with strength meter. Protect your accounts with our security guide.',
    ogImage: '/og/password-security-guide.png',
    canonical: 'https://ai-autosite.com/blog/password-generator-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Create Strong Passwords in 2025',
      image: ['/blog/images/password-security-hero.jpg'],
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
      title: 'Create Strong Passwords in 2025',
      description: 'Complete password security guide',
      image: '/og/password-security-guide.png'
    },
    
    openGraph: {
      title: 'How to Create Strong Passwords in 2025',
      description: 'Complete guide to password security',
      type: 'article',
      url: 'https://ai-autosite.com/blog/password-generator-guide',
      images: [{
        url: 'https://ai-autosite.com/og/password-security-guide.png',
        width: 1200,
        height: 630,
        alt: 'Password Security Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['password', 'security', 'privacy'],
        section: 'Quick Tools'
      }
    }
  }
