// app/tools/youtube-thumbnail/blog-post.ts
import { Youtube } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const youtubeThumbnailPost: BlogPost = {
    id: 'youtube-thumbnail-guide',
    title: 'YouTube Thumbnail Downloader - Get HD Thumbnails',
    description:
      'Download YouTube video thumbnails in HD. Free thumbnail grabber for content creators.',
    readTime: '3 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: Youtube,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'YouTube Thumbnail Downloader',
      url: '/tools/youtube-thumbnail',
    },
    
    tags: ['youtube', 'thumbnail', 'download', 'video', 'content-creation'],
    keywords: ['youtube thumbnail', 'thumbnail downloader', 'hd thumbnail'],
    category: 'creative',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'YouTube Thumbnail Downloader - HD Quality Download',
    seoDescription:
      'Download YouTube video thumbnails in HD quality. Free tool for content creators and designers. Get any video thumbnail instantly.',
    ogImage: '/og/youtube-thumbnail-guide.png',
    canonical: 'https://ai-autosite.com/blog/youtube-thumbnail-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
  