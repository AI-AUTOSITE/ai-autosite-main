// app/tools/qr-code/blog-post.ts
import { QrCode } from 'lucide-react'
import type { BlogPost } from '../../../app/lib/blog-posts/types'

export const qrCodePost: BlogPost = {
    id: 'qr-code-guide',
    title: 'Free QR Code Generator with Logo - No Expiration, No Ads',
    description:
      'Create custom QR codes with free logo embedding, 8 color presets, 6 dot styles. No 14-day expiration like QRMonkey. 100% private, works offline.',
    readTime: '5 min',
    publishDate: 'November 2025',
    lastUpdated: '2025-11-24',
    icon: QrCode,
    featured: true,
    status: 'published',
    
    relatedTool: {
      name: 'QR Code Generator',
      url: '/tools/qr-code',
    },
    
    tags: ['qr-code', 'generator', 'logo', 'wifi', 'vcard', 'free', 'no-expiration'],
    keywords: [
      'free qr code generator',
      'qr code with logo free',
      'qrmonkey alternative',
      'no expiration qr code',
      'wifi qr code',
      'vcard qr code',
      'custom qr code colors',
    ],
    category: 'quick-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'Free QR Code Generator with Logo - No Expiration, No Ads',
    seoDescription:
      'Create QR codes with free logo embedding, custom colors & styles. Unlike QRMonkey, your codes never expire. 100% private, no server uploads.',
    ogImage: '/og/qr-code-guide.png',
    canonical: 'https://ai-autosite.com/blog/qr-code-guide',
    
    priority: 0.9,
    changeFreq: 'weekly',
  }
