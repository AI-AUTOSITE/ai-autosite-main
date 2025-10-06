// app/lib/blog-posts/creative-tools.ts
import { Palette, Instagram, Youtube } from 'lucide-react'
import type { BlogPost } from './types'

export const creativeToolsPosts: BlogPost[] = [
  {
    id: 'instagram-bio-guide',
    title: 'Instagram Bio Generator - Perfect Profiles',
    description:
      'Create engaging Instagram bios that attract followers. Free bio generator with templates.',
    readTime: '4 min',
    publishDate: '2025-01-20',
    icon: Instagram,
    featured: true,
    status: 'published',
    relatedTool: {
      name: 'Instagram Bio Generator',
      url: '/tools/instagram-bio',
    },
    tags: ['instagram', 'bio', 'social', 'profile', 'generator'],
    category: 'creative',
    author: 'AI AutoSite Team',
    views: 0,
    seoTitle: 'Instagram Bio Generator - Create Perfect Profile Bios',
    seoDescription:
      'Generate engaging Instagram bios that attract followers. Free templates and ideas for your profile. Stand out on Instagram.',
    ogImage: '/og/instagram-bio-guide.png',
  },
  {
    id: 'youtube-thumbnail-guide',
    title: 'YouTube Thumbnail Downloader - Get HD Thumbnails',
    description:
      'Download YouTube video thumbnails in HD. Free thumbnail grabber for content creators.',
    readTime: '3 min',
    publishDate: '2025-01-20',
    icon: Youtube,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'YouTube Thumbnail Downloader',
      url: '/tools/youtube-thumbnail',
    },
    tags: ['youtube', 'thumbnail', 'download', 'video', 'content-creation'],
    category: 'creative',
    author: 'AI AutoSite Team',
    views: 0,
    seoTitle: 'YouTube Thumbnail Downloader - HD Quality Download',
    seoDescription:
      'Download YouTube video thumbnails in HD quality. Free tool for content creators and designers. Get any video thumbnail instantly.',
    ogImage: '/og/youtube-thumbnail-guide.png',
  },
  {
    id: 'gradient-generator-guide',
    title: 'Gradient Generator CSS - Beautiful Colors',
    description:
      'Create stunning CSS gradients for web design. Free gradient generator with live preview.',
    readTime: '4 min',
    publishDate: '2025-01-20',
    icon: Palette,
    featured: false,
    status: 'published',
    relatedTool: {
      name: 'Gradient Generator',
      url: '/tools/gradient-generator',
    },
    tags: ['gradient', 'css', 'design', 'color', 'web-design'],
    category: 'creative',
    author: 'AI AutoSite Team',
    views: 0,
    seoTitle: 'CSS Gradient Generator - Create Beautiful Gradients',
    seoDescription:
      'Generate beautiful CSS gradients for web design. Live preview, custom colors, and easy copy-paste code. Free gradient tool.',
    ogImage: '/og/gradient-generator-guide.png',
  },
]
