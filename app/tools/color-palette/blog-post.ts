// app/tools/color-palette/blog-post.ts
import { Palette } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const colorPalettePost: BlogPost = {
    id: 'color-palette-guide',
    title: 'How to Create Beautiful Color Palettes',
    description:
      'Master the art of color combinations. Learn to create stunning palettes for web and design.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Palette,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'Color Palette',
      url: '/tools/color-palette',
    },
    
    tags: ['color-palette', 'design', 'web-design', 'branding'],
    keywords: ['color palette generator', 'color combinations', 'design colors'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Color Palette Guide - Create Beautiful Color Combinations',
    seoDescription:
      'Master color combinations for web and design. Create stunning palettes with our guide. Free color palette tool.',
    ogImage: '/og/color-palette-guide.png',
    canonical: 'https://ai-autosite.com/blog/color-palette-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Create Beautiful Color Palettes',
      image: ['/og/color-palette-guide.png'],
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
    
    priority: 0.8,
    changeFreq: 'monthly',
    
    twitter: {
      card: 'summary_large_image',
      site: '@aiautositecom',
      title: 'Create Beautiful Color Palettes',
      description: 'Master color combinations for design',
      image: '/og/color-palette-guide.png'
    },
    
    openGraph: {
      title: 'How to Create Beautiful Color Palettes',
      description: 'Master color combinations for web design',
      type: 'article',
      url: 'https://ai-autosite.com/blog/color-palette-guide',
      images: [{
        url: 'https://ai-autosite.com/og/color-palette-guide.png',
        width: 1200,
        height: 630,
        alt: 'Color Palette Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['color', 'design', 'palette'],
        section: 'Quick Tools'
      }
    }
  }
