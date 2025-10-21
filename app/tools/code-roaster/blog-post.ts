// app/tools/code-roaster/blog-post.ts
import { Flame, Code2 } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const codeRoasterPost: BlogPost = {
    id: 'code-roaster-guide',
    title: 'Code Roaster: The AI Code Review Tool That Actually Makes You Laugh',
    description:
      'Discover the revolutionary AI-powered code review tool that combines humor with helpful feedback',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Flame,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Code Roaster',
      url: '/tools/code-roaster',
    },
    
    tags: ['code-review', 'ai', 'humor', 'developer-tools'],
    keywords: ['code roaster', 'ai code review', 'code feedback', 'funny code review'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Code Roaster - AI Code Review with Humor',
    seoDescription:
      'Revolutionary AI code review tool that makes you laugh. Get helpful feedback with humor. Perfect for developers who need constructive criticism.',
    ogImage: '/og/code-roaster-guide.png',
    canonical: 'https://ai-autosite.com/blog/code-roaster-guide',
    
    schema: {
      type: 'Article',
      headline: 'Code Roaster: AI Code Review with Humor',
      image: ['/og/code-roaster-guide.png'],
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
    
    priority: 0.8,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'Code Roaster - Funny AI Code Review',
      description: 'AI code review that makes you laugh',
      image: '/og/code-roaster-guide.png'
    },
    
    openGraph: {
      title: 'Code Roaster: AI Code Review That Makes You Laugh',
      description: 'Revolutionary AI-powered code review with humor',
      type: 'article',
      url: 'https://ai-autosite.com/blog/code-roaster-guide',
      images: [{
        url: 'https://ai-autosite.com/og/code-roaster-guide.png',
        width: 1200,
        height: 630,
        alt: 'Code Roaster Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['code-review', 'ai', 'humor'],
        section: 'Dev Tools'
      }
    },
  }
  
  export const codeRoasterTutorialPost: BlogPost = {
    id: 'how-to-use-code-roaster',
    title: 'How to Use Code Roaster: Complete Guide to AI Code Reviews',
    description: 'Step-by-step guide to using Code Roaster for AI-powered code reviews',
    readTime: '7 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Code2,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'Code Roaster',
      url: '/tools/code-roaster',
    },
    
    tags: ['code-review', 'ai', 'humor', 'feedback', 'development'],
    keywords: ['code roaster tutorial', 'ai code review guide', 'how to use code roaster'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Code Roaster Tutorial - AI Code Reviews with Humor',
    seoDescription:
      'Step-by-step guide to using Code Roaster for humorous AI code reviews. Get helpful feedback while having fun. Free developer tool.',
    ogImage: '/og/code-roaster-tutorial.png',
    canonical: 'https://ai-autosite.com/blog/how-to-use-code-roaster',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }