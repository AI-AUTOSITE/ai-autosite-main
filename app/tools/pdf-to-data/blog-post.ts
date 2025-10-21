// app/tools/pdf-to-data/blog-post.ts
import { FileSpreadsheet } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const pdfToDataPost: BlogPost = {
    id: 'pdf-to-data-guide',
    title: 'PDF to CSV/Excel Converter - Extract Tables with AI',
    description:
      'Convert PDF tables to CSV or Excel format using AI. Extract data from scanned documents with high accuracy.',
    readTime: '5 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileSpreadsheet,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'PDF to CSV/Excel',
      url: '/tools/pdf-to-data',
    },
    
    tags: ['pdf', 'csv', 'excel', 'data-extraction', 'ai', 'tables'],
    keywords: ['pdf to csv', 'pdf to excel', 'extract pdf tables', 'pdf converter'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'PDF to CSV/Excel Converter - AI-Powered Data Extraction',
    seoDescription:
      'Extract tables from PDFs to CSV or Excel. AI-powered conversion for accurate data extraction. Free online tool.',
    ogImage: '/og/pdf-to-data-guide.png',
    canonical: 'https://ai-autosite.com/blog/pdf-to-data-guide',
    
    schema: {
      type: 'HowTo',
      headline: 'How to Extract Tables from PDF to CSV/Excel',
      image: ['/og/pdf-to-data-guide.png'],
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
      title: 'PDF to CSV/Excel - AI Data Extraction',
      description: 'Extract tables from PDFs with AI',
      image: '/og/pdf-to-data-guide.png'
    },
    
    openGraph: {
      title: 'PDF to CSV/Excel Converter - Extract Tables with AI',
      description: 'AI-powered PDF table extraction',
      type: 'article',
      url: 'https://ai-autosite.com/blog/pdf-to-data-guide',
      images: [{
        url: 'https://ai-autosite.com/og/pdf-to-data-guide.png',
        width: 1200,
        height: 630,
        alt: 'PDF to Data Converter Guide'
      }],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: '2025-10-19',
        modifiedTime: '2025-10-19',
        authors: ['AI AutoSite Team'],
        tags: ['pdf', 'data-extraction', 'ai'],
        section: 'Quick Tools'
      }
    }
  }
