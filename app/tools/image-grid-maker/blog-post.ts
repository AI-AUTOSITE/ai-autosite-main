// app/tools/image-grid-maker/blog-post.ts
import { Grid3x3 } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const imageGridMakerPost: BlogPost = {
    id: 'image-grid-maker-guide',
    title: 'How to Create Numbered Image Grids in Seconds',
    description:
      'Learn to merge multiple images into professional grids for comparisons and tutorials.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Grid3x3,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Image Grid Maker',
      url: '/tools/image-grid-maker',
    },
    
    tags: ['image-grid', 'collage', 'comparison', 'tutorial'],
    keywords: ['image grid maker', 'photo collage', 'image comparison'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Image Grid Maker - Create Numbered Grids in Seconds',
    seoDescription:
      'Merge multiple images into professional grids. Perfect for comparisons, tutorials, and presentations. Free online tool.',
    ogImage: '/og/image-grid-maker-guide.png',
    canonical: 'https://ai-autosite.com/blog/image-grid-maker-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Create Numbered Image Grids',
      image: ['/og/image-grid-maker-guide.png'],
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
      title: 'Create Numbered Image Grids',
      description: 'Professional grids in seconds',
      image: '/og/image-grid-maker-guide.png'
    },
    
    openGraph: {
      title: 'How to Create Numbered Image Grids in Seconds',
      description: 'Merge images into professional grids',
      type: 'article',
      url: 'https://ai-autosite.com/blog/image-grid-maker-guide',
      images: [{
        url: 'https://ai-autosite.com/og/image-grid-maker-guide.png',
        width: 1200,
        height: 630,
        alt: 'Image Grid Maker Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['image-grid', 'tutorial', 'comparison'],
        section: 'Quick Tools'
      }
    }
  }
