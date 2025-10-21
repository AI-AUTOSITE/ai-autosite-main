// app/lib/blog-posts/types.ts
import type { LucideIcon } from 'lucide-react'

// ===================================
// Extended blog post type with comprehensive SEO metadata
// ===================================

export interface BlogPost {
  // ==================
  // Core fields
  // ==================
  id: string
  title: string
  description: string

  // ==================
  // Time-related (SEO重要)
  // ==================
  readTime: string
  publishDate: string
  lastUpdated?: string // Googleが評価する更新日

  // ==================
  // Visual
  // ==================
  icon: LucideIcon
  coverImage?: string

  // ==================
  // Status & Display
  // ==================
  featured: boolean
  status: 'published' | 'coming-soon' | 'draft'

  // ==================
  // Related content (内部リンクSEO)
  // ==================
  relatedTool?: {
    name: string
    url: string
  }
  relatedPosts?: string[] // 関連記事のID配列

  // ==================
  // Organization & Categorization
  // ==================
  tags?: string[]
  keywords?: string[] // SEOキーワード
  author?: string
  views?: number
  category?: string

  // ==================
  // SEO & Social (基本)
  // ==================
  seoTitle?: string // カスタムSEOタイトル（推奨: 50-60文字）
  seoDescription?: string // メタディスクリプション（推奨: 150-160文字）
  ogImage?: string // Open Graph画像

  // ==================
  // SEO Advanced (新規追加)
  // ==================
  
  // 構造化データ用
  schema?: {
    type: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage' | 'TechArticle'
    headline?: string
    image?: string[]
    datePublished?: string
    dateModified?: string
    author?: {
      type: 'Person' | 'Organization'
      name: string
      url?: string
    }
    publisher?: {
      type: 'Organization'
      name: string
      logo?: {
        type: 'ImageObject'
        url: string
      }
    }
    mainEntityOfPage?: string
    articleSection?: string
    wordCount?: number
    inLanguage?: string
  }

  // 多言語対応
  language?: 'en' | 'ja' | 'es' | 'fr' | 'de' | 'zh' | 'ko'
  alternateUrls?: Array<{
    lang: string
    url: string
  }>

  // サイトマップ・クローラー制御
  priority?: number // 0.0 - 1.0 (デフォルト: 0.5)
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  noIndex?: boolean // 検索エンジンにインデックスさせない場合
  noFollow?: boolean // リンクを辿らせない場合

  // ソーシャルメディア最適化
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    site?: string // @username
    creator?: string // @username
    title?: string
    description?: string
    image?: string
  }

  openGraph?: {
    title?: string
    description?: string
    type?: 'article' | 'website' | 'blog'
    url?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    locale?: string
    siteName?: string
    article?: {
      publishedTime?: string
      modifiedTime?: string
      authors?: string[]
      tags?: string[]
      section?: string
    }
  }

  // パフォーマンス最適化
  preload?: string[] // プリロードするリソース
  canonical?: string // 正規URL

  // アナリティクス・トラッキング
  trackingId?: string // Google Analytics等
  customEventName?: string // カスタムイベント名
}

// ==================
// Category type
// ==================
export interface BlogCategory {
  id: string
  name: string
  shortName: string
  icon: LucideIcon
  color: string
  description: string

  // SEO追加
  seoTitle?: string
  seoDescription?: string
  slug?: string
}

// ==================
// Pagination type
// ==================
export interface BlogPagination {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

// ==================
// Filter options
// ==================
export interface BlogFilters {
  category?: string
  status?: BlogPost['status']
  featured?: boolean
  searchQuery?: string
  tags?: string[]
  sortBy?: 'date' | 'title' | 'readTime' | 'views' | 'relevance'
  sortOrder?: 'asc' | 'desc'
  language?: string
}

// ==================
// Blog statistics
// ==================
export interface BlogStats {
  totalPosts: number
  publishedPosts: number
  featuredPosts: number
  categories: number
  totalReadTime: number
  mostPopularCategory: string
  totalViews?: number
  avgReadTime?: number
}

// ==================
// Author information
// ==================
export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  role?: string
  social?: {
    twitter?: string
    github?: string
    linkedin?: string
    website?: string
  }
  
  // SEO for author pages
  seoTitle?: string
  seoDescription?: string
  authorUrl?: string
}

// ==================
// SEO Helpers (便利な型定義)
// ==================

// メタタグ生成用
export interface MetaTags {
  title: string
  description: string
  keywords?: string[]
  robots?: string
  canonical?: string
  ogImage?: string
  twitterCard?: string
}

// 構造化データ（JSON-LD）用
export interface StructuredData {
  '@context': 'https://schema.org'
  '@type': string
  [key: string]: any
}

// サイトマップエントリ用
export interface SitemapEntry {
  url: string
  lastmod?: string
  changefreq?: BlogPost['changeFreq']
  priority?: number
}

// Breadcrumb用
export interface Breadcrumb {
  name: string
  url: string
  position: number
}