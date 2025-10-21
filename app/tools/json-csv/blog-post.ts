// app/tools/json-csv/blog-post.ts
import { FileJson } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts/types'

export const jsonCsvPost: BlogPost = {
    id: 'json-csv-converter-guide',
    title: 'JSON to CSV Converter - Easy Data Conversion',
    description:
      'Convert JSON to CSV and CSV to JSON. Free online converter for developers and data analysts.',
    readTime: '4 min',
    publishDate: 'October 2025',
    lastUpdated: '2025-10-19',
    icon: FileJson,
    featured: false,
    status: 'published',
    
    relatedTool: {
      name: 'JSON-CSV Converter',
      url: '/tools/json-csv',
    },
    
    tags: ['json', 'csv', 'converter', 'data-conversion'],
    keywords: ['json to csv', 'csv to json', 'data converter'],
    category: 'dev-tools',
    author: 'AI AutoSite Team',
    views: 0,
    
    seoTitle: 'JSON to CSV Converter - Free Data Conversion Tool',
    seoDescription:
      'Convert JSON to CSV and CSV to JSON. Free online converter for developers. Easy data transformation tool.',
    ogImage: '/og/json-csv-converter-guide.png',
    canonical: 'https://ai-autosite.com/blog/json-csv-converter-guide',
    
    priority: 0.7,
    changeFreq: 'monthly',
  }
