// app/tools/spam-email-checker/blog-post.ts
import { Shield } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const spamEmailCheckerPost: BlogPost = {
    id: 'spam-email-checker-guide',
    title: 'Spam Email Checker - Protect Yourself from Phishing Attacks',
    description:
      'Complete guide to checking suspicious emails. Learn to detect phishing attempts, typosquatting, and email fraud before opening messages.',
    readTime: '7 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Shield,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Spam Email Checker',
      url: '/tools/spam-email-checker',
    },
    
    tags: ['email-security', 'phishing', 'spam', 'fraud-detection', 'online-safety', 'privacy'],
    keywords: [
      'spam email checker',
      'phishing detection',
      'email security',
      'typosquatting',
      'fraud detection',
    ],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Spam Email Checker Guide - How to Detect Phishing Emails',
    seoDescription:
      'Learn to identify spam and phishing emails before opening them. Free email checker detects typosquatting, suspicious domains, and fraud attempts. Protect your privacy.',
    ogImage: '/og/spam-email-checker-guide.png',
    canonical: 'https://ai-autosite.com/blog/spam-email-checker-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Detect Spam and Phishing Emails',
      image: ['/og/spam-email-checker-guide.png'],
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
    
    priority: 0.9,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'Spam Email Checker - Detect Phishing',
      description: 'Protect yourself from email fraud',
      image: '/og/spam-email-checker-guide.png'
    },
    
    openGraph: {
      title: 'Spam Email Checker - Protect from Phishing Attacks',
      description: 'Complete guide to detecting email fraud',
      type: 'article',
      url: 'https://ai-autosite.com/blog/spam-email-checker-guide',
      images: [{
        url: 'https://ai-autosite.com/og/spam-email-checker-guide.png',
        width: 1200,
        height: 630,
        alt: 'Spam Email Checker Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['email-security', 'phishing', 'privacy'],
        section: 'Quick Tools'
      }
    }
}
