// app/sitemap.ts
import { MetadataRoute } from 'next'

// すべてのツールID（statusがliveのもののみ）
const liveTools = [
  // Business Tools
  'competitive-analyzer',
  'whatsapp-link', 
  'ai-prompt-generator',
  'ai-resume',
  
  // Creative Tools (一部はcoming状態なので除外)
  'hashtag-generator',
  'instagram-bio',
  'youtube-thumbnail',
  'gradient-generator',
  
  // Dev Tools
  'markdown-html',
  'json-csv',
  'favicon-generator',
  'lorem-ipsum',
  'uuid-generator',
  'base64',
  'code-dependency-visualizer',
  'code-roaster',
  'tech-stack-analyzer',
  'stack-recommender',
  'ai-project-visualizer',
  
  // Learning Tools
  'ai-dev-dictionary',
  
  // Quick Tools
  'pc-optimizer',
  'password-generator',
  'age-calculator',
  'bmi-calculator',
  'percentage-calculator',
  'twitter-counter',
  'countdown-timer',
  'unit-converter',
  'text-counter',
  'qr-code',
  'image-compress',
  'color-palette',
  'blurtap',
  'image-grid-maker',
  'image-splitter',
  'pdf-tools',
  'json-format',
  'text-case',
  'pdf-to-data',
  'token-compressor',
  
  // Study Tools
  'pdf-summarizer',
  'japanese-ocr',
  'debate-trainer',
  'ai-summarizer',
]

// ブログ記事のスラッグ
const blogPosts = [
  'age-calculator-guide',
  'ai-dev-dictionary',
  'ai-project-visualizer-guide',
  'ai-prompt-generator-guide',
  'ai-resume-generator',
  'ai-stack-recommender-guide',
  'ai-summarizer-guide',
  'base64-guide',
  'bmi-calculator-guide',
  'choosing-the-right-tech-stack',
  'code-dependency-visualizer',
  'code-roaster-guide',
  'color-palette-guide',
  'competitive-analyzer-guide',
  'countdown-timer-guide',
  'debate-trainer-guide',
  'favicon-generator-guide',
  'gradient-generator-guide',
  'hashtag-generator-guide',
  'how-to-use-code-roaster',
  'image-compress-guide',
  'image-grid-maker-complete-guide',
  'image-splitter-paper-sizes',
  'instagram-bio-generator-guide',
  'japanese-ocr-guide',
  'json-beautify-guide',
  'json-csv-converter-guide',
  'lorem-ipsum-generator-guide',
  'markdown-guide',
  'password-security-guide',
  'pc-optimizer-guide',
  'pdf-summarizer-guide',
  'pdf-tools-guide',
  'percentage-calculator-guide',
  'privacy-in-development',
  'qr-code-guide',
  'text-case-converter',
  'text-counter-guide',
  'token-compressor-guide',
  'twitter-counter-guide',
  'unit-converter-guide',
  'uuid-generator-guide',
  'whatsapp-link-generator-guide',
  'youtube-thumbnail-guide',
]

// 優先度の高いツール（AI機能、有料化可能、ユニーク）
const highPriorityTools = [
  'ai-dev-dictionary',
  'pdf-tools',
  'ai-summarizer',
  'code-roaster',
  'stack-recommender',
  'ai-project-visualizer',
  'competitive-analyzer',
  'token-compressor',
  'japanese-ocr',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ai-autosite.com'
  const currentDate = new Date()
  
  // 1. 静的ページ（最高優先度）
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/documentation`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/request`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]
  
  // 2. ツールページ（優先度別）
  const toolPages: MetadataRoute.Sitemap = liveTools.map(toolId => ({
    url: `${baseUrl}/tools/${toolId}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: highPriorityTools.includes(toolId) ? 0.9 : 0.8,
  }))
  
  // 3. ブログ記事
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  
  // すべてを結合して返す
  return [...staticPages, ...toolPages, ...blogPages]
}