// app/tools/hashtag-generator/blog-post.ts
import { Hash } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const hashtagGeneratorPost: BlogPost = {
    id: 'hashtag-generator-guide',
    title: 'Master Hashtag Strategy: Get More Reach on Social Media',
    description:
      'Learn how to generate perfect hashtags for Instagram, Twitter, and TikTok. Boost engagement with strategic tag selection.',
    readTime: '6 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Hash,
    coverImage: '/blog/images/hashtag-strategy-hero.jpg',
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Hashtag Generator',
      url: '/tools/hashtag-generator',
    },
    
    tags: [
      'hashtags',
      'social-media',
      'instagram',
      'twitter',
      'tiktok',
      'marketing',
      'engagement',
      'content-strategy',
    ],
    keywords: [
      'hashtag generator',
      'instagram hashtags',
      'social media marketing',
      'hashtag strategy',
    ],
    category: 'business',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Hashtag Generator 2025 - Best Tags for Social Media',
    seoDescription:
      'Generate perfect hashtags for Instagram, Twitter, and TikTok. Learn hashtag strategies to increase reach and engagement. Free tool included.',
    ogImage: '/og/hashtag-generator-guide.png',
    canonical: 'https://ai-autosite.com/blog/hashtag-generator-guide',
    
    schema: {
      type: 'Article',
      headline: 'Master Hashtag Strategy for Social Media',
      image: ['/blog/images/hashtag-strategy-hero.jpg'],
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
      title: 'Master Hashtag Strategy for Social Media',
      description: 'Boost your reach with perfect hashtags',
      image: '/og/hashtag-generator-guide.png'
    },
    
    openGraph: {
      title: 'Master Hashtag Strategy: Get More Reach on Social Media',
      description: 'Generate perfect hashtags and boost engagement',
      type: 'article',
      url: 'https://ai-autosite.com/blog/hashtag-generator-guide',
      images: [{
        url: 'https://ai-autosite.com/og/hashtag-generator-guide.png',
        width: 1200,
        height: 630,
        alt: 'Hashtag Generator Strategy Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['hashtags', 'social-media', 'marketing'],
        section: 'Business Tools'
      }
    }
  }
