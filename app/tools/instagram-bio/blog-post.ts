// app/tools/instagram-bio/blog-post.ts
import { Instagram } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const instagramBioPost: BlogPost = {
    id: 'instagram-bio-guide',
    title: 'Instagram Bio Generator - Perfect Profiles',
    description:
      'Create engaging Instagram bios that attract followers. Free bio generator with templates.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Instagram,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Instagram Bio Generator',
      url: '/tools/instagram-bio',
    },
    
    tags: ['instagram', 'bio', 'social', 'profile', 'generator'],
    keywords: [
      'instagram bio generator',
      'profile bio',
      'instagram profile',
      'bio templates',
    ],
    category: 'creative',
    author: 'AI AutoSite Team',
    views: 0,
    seoTitle: 'Instagram Bio Generator - Create Perfect Profile Bios',
    seoDescription:
      'Generate engaging Instagram bios that attract followers. Free templates and ideas for your profile. Stand out on Instagram.',
    ogImage: '/og/instagram-bio-guide.png',
    canonical: 'https://ai-autosite.com/blog/instagram-bio-guide',
    schema: {
      type: 'HowTo',
      headline: 'How to Create Perfect Instagram Bios',
      image: ['/og/instagram-bio-guide.png'],
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
      wordCount: 2000,
      inLanguage: 'en'
    },
    language: 'en',
    priority: 0.9,
    changeFreq: 'monthly',
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      creator: '@aiautositecom',
      title: 'Instagram Bio Generator - Perfect Profiles',
      description: 'Create engaging bios that attract followers',
      image: '/og/instagram-bio-guide.png'
    },
      openGraph: {
      title: 'Instagram Bio Generator - Create Perfect Profile Bios',
      description: 'Free templates and ideas for your Instagram profile',
      type: 'article',
      url: 'https://ai-autosite.com/blog/instagram-bio-guide',
      images: [{
        url: 'https://ai-autosite.com/og/instagram-bio-guide.png',
        width: 1200,
        height: 630,
        alt: 'Instagram Bio Generator Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['instagram', 'bio', 'social-media'],
        section: 'Creative Tools'
      }
    }
  }