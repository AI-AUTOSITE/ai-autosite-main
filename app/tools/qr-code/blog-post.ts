// app/tools/qr-code/blog-post.ts
import { QrCode } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const qrCodePost: BlogPost = {
    id: 'qr-code-guide',
    title: 'QR Code Generator - Create Custom QR Codes Instantly',
    description:
      'Generate QR codes for URLs, WiFi, text, and more. Customize colors and styles for your brand.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: QrCode,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'QR Code Generator',
      url: '/tools/qr-code',
    },
    
    tags: ['qr-code', 'generator', 'barcode', 'scan', 'mobile'],
    keywords: ['qr code generator', 'create qr code', 'custom qr code'],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'QR Code Generator - Create Custom QR Codes Free',
    seoDescription:
      'Generate QR codes for URLs, WiFi, text, and more. Customize colors and download in high quality. Free online tool.',
    ogImage: '/og/qr-code-guide.png',
    canonical: 'https://ai-autosite.com/blog/qr-code-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
