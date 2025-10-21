// app/tools/debate-trainer/blog-post.ts
import { MessageSquare } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const debateTrainerPost: BlogPost = {
    id: 'debate-trainer-guide',
    title: 'Master Debate Skills with AI: 3 Coaching Styles',
    description: 'Learn to improve argumentation skills with our AI Debate Trainer.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: MessageSquare,
    featured: true,
    status: 'published',

    relatedTool: {
      name: 'Debate Trainer',
      url: '/tools/debate-trainer',
    },

    tags: ['debate', 'ai-training', 'argumentation', 'public-speaking', 'education'],
    keywords: [
      'debate training',
      'ai debate coach',
      'argumentation skills',
      'public speaking practice',
    ],
    category: 'study-tools',
    author: 'AI AutoSite Team',
    views: 0,

    seoTitle: 'AI Debate Trainer - Master Argumentation Skills',
    seoDescription:
      'Improve debate skills with AI coaching. Learn argumentation, critical thinking, and public speaking with 3 personalized coaching styles.',
    ogImage: '/og/debate-trainer-guide.png',
    canonical: 'https://ai-autosite.com/blog/debate-trainer-guide',

    schema: {
      type: 'HowTo',
      headline: 'How to Master Debate Skills with AI',
      image: ['/og/debate-trainer-guide.png'],
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
      title: 'Master Debate Skills with AI',
      description: 'Learn argumentation with 3 coaching styles',
      image: '/og/debate-trainer-guide.png'
    },
    
    // === Open Graph ===
    openGraph: {
      title: 'Master Debate Skills with AI: 3 Coaching Styles',
      description: 'Improve argumentation and public speaking',
      type: 'article',
      url: 'https://ai-autosite.com/blog/debate-trainer-guide',
      images: [{
        url: 'https://ai-autosite.com/og/debate-trainer-guide.png',
        width: 1200,
        height: 630,
        alt: 'AI Debate Trainer Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['debate', 'ai-training', 'education'],
        section: 'Study Tools'
      }
    }
  }