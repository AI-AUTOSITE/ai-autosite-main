// app/tools/url-encoder/blog-post.ts
import { Link } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const urlEncoderPost: BlogPost = {
  id: 'url-encoder-guide',
  title: 'URL Encoder: Encode & Decode URLs Safely',
  description: 'URL encoding with structure parser, query builder, and double-encoding detection.',
  readTime: '5 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Link,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'URL Encoder',
    url: '/tools/url-encoder',
  },
  
  tags: ['url', 'encoder', 'decoder', 'query-string', 'web'],
  keywords: ['url encoder', 'url decoder', 'encodeURIComponent', 'query string builder'],
  category: 'converters',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'URL Encoder/Decoder - Safe URL Encoding Tool',
  seoDescription: 'Encode and decode URLs safely. Includes URL parser, query string builder, and double-encoding detection. 100% private.',
  ogImage: '/og/url-encoder-guide.png',
  canonical: 'https://ai-autosite.com/blog/url-encoder-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
