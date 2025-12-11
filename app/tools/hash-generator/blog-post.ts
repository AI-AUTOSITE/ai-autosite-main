// app/tools/hash-generator/blog-post.ts
import { Hash } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const hashGeneratorPost: BlogPost = {
  id: 'hash-generator-guide',
  title: 'Hash Generator: Secure Hashing Made Easy',
  description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes for text and files with one click.',
  readTime: '5 min',
  publishDate: 'December 2025',
  lastUpdated: '2025-12-05',
  icon: Hash,
  featured: true,
  status: 'published',
  
  relatedTool: {
    name: 'Hash Generator',
    url: '/tools/hash-generator',
  },
  
  tags: ['hash', 'md5', 'sha256', 'sha512', 'security', 'checksum'],
  keywords: ['hash generator', 'md5 generator', 'sha256 hash', 'file checksum', 'hash calculator'],
  category: 'dev-tools',
  author: 'AI AutoSite Team',
  views: 0,
  
  seoTitle: 'Hash Generator - MD5, SHA-256, SHA-512 Online',
  seoDescription: 'Generate secure hashes online. Supports MD5, SHA-1, SHA-256, SHA-512. File hashing supported. 100% private, browser-based.',
  ogImage: '/og/hash-generator-guide.png',
  canonical: 'https://ai-autosite.com/blog/hash-generator-guide',
  
  priority: 0.8,
  changeFreq: 'monthly',
}
