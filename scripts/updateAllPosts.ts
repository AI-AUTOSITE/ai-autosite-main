// scripts/updateAllPosts.ts
// 全ブログ記事のSEOフィールドを一括チェック・更新

import type { BlogPost } from '../app/lib/blog-posts/types'

// ==================
// 必須フィールドチェッカー
// ==================
export function checkRequiredFields(post: BlogPost): string[] {
  const missing: string[] = []

  // 基本フィールド
  if (!post.publishDate) missing.push('publishDate')
  if (!post.lastUpdated) missing.push('lastUpdated')
  if (!post.tags || post.tags.length === 0) missing.push('tags')
  if (!post.category) missing.push('category')
  if (!post.author) missing.push('author')

  // SEO基本
  if (!post.seoTitle) missing.push('seoTitle')
  if (!post.seoDescription) missing.push('seoDescription')
  if (!post.ogImage) missing.push('ogImage')
  if (!post.canonical) missing.push('canonical')

  // Featured記事の追加チェック
  if (post.featured) {
    if (!post.schema) missing.push('schema (required for featured posts)')
    if (!post.twitter) missing.push('twitter (recommended for featured posts)')
    if (!post.openGraph) missing.push('openGraph (recommended for featured posts)')
    if (!post.keywords) missing.push('keywords (recommended for featured posts)')
  }

  return missing
}

// ==================
// SEOフィールド自動生成
// ==================
export function generateSEOFields(post: Partial<BlogPost>): Partial<BlogPost> {
  const today = new Date().toISOString().split('T')[0] // 2025-10-19

  return {
    ...post,

    // 基本フィールド
    lastUpdated: post.lastUpdated || today,
    category: post.category || 'quick-tools',
    author: post.author || 'AI AutoSite Team',
    views: post.views ?? 0,

    // SEO基本（未設定の場合のみ）
    seoTitle: post.seoTitle || `${post.title} | AI AutoSite`,
    seoDescription: post.seoDescription || post.description,
    ogImage: post.ogImage || `/og/${post.id}.png`,
    canonical: post.canonical || `https://ai-autosite.com/blog/${post.id}`,

    // タグ・キーワード
    tags: post.tags || [],
    keywords: post.keywords || post.tags?.slice(0, 5) || [],

    // サイトマップ
    priority: post.priority ?? (post.featured ? 0.9 : 0.7),
    changeFreq: post.changeFreq || 'monthly',
  }
}

// ==================
// Featured記事用の完全SEO生成
// ==================
export function generateFullSEO(post: BlogPost): BlogPost {
  const basePost = generateSEOFields(post) as BlogPost

  if (!post.featured) return basePost

  return {
    ...basePost,

    // 構造化データ
    schema: post.schema || {
      type: 'Article',
      headline: post.title,
      image: [post.ogImage || `/og/${post.id}.png`],
      datePublished: post.publishDate,
      dateModified: post.lastUpdated || post.publishDate,
      author: {
        type: 'Organization',
        name: 'AI AutoSite Team',
        url: 'https://ai-autosite.com',
      },
      publisher: {
        type: 'Organization',
        name: 'AI AutoSite',
        logo: {
          type: 'ImageObject',
          url: 'https://ai-autosite.com/logo.png',
        },
      },
      wordCount: 2000,
      inLanguage: 'en',
    },

    // Twitter Card
    twitter: post.twitter || {
      card: 'summary_large_image',
      site: '@aiautositecom',
      creator: '@aiautositecom',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      image: post.ogImage || `/og/${post.id}.png`,
    },

    // Open Graph
    openGraph: post.openGraph || {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      type: 'article',
      url: `https://ai-autosite.com/blog/${post.id}`,
      images: [
        {
          url: `https://ai-autosite.com${post.ogImage || `/og/${post.id}.png`}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      siteName: 'AI AutoSite',
      article: {
        publishedTime: post.publishDate,
        modifiedTime: post.lastUpdated || post.publishDate,
        authors: [post.author || 'AI AutoSite Team'],
        tags: post.tags || [],
        section: post.category || 'Tools',
      },
    },
  }
}

// ==================
// 全記事のSEOレポート生成
// ==================
export function generateSEOReport(posts: BlogPost[]): void {
  console.log('='.repeat(50))
  console.log('📊 SEO Report for All Blog Posts')
  console.log('='.repeat(50))

  let totalIssues = 0

  posts.forEach((post, index) => {
    const missing = checkRequiredFields(post)

    if (missing.length > 0) {
      console.log(`\n${index + 1}. ❌ ${post.id}`)
      console.log(`   Title: ${post.title}`)
      console.log(`   Missing fields: ${missing.join(', ')}`)
      totalIssues += missing.length
    }
  })

  // サマリー
  console.log('\n' + '='.repeat(50))
  console.log(`Total Posts: ${posts.length}`)
  console.log(`Posts with Issues: ${posts.filter((p) => checkRequiredFields(p).length > 0).length}`)
  console.log(`Total Issues: ${totalIssues}`)
  console.log('='.repeat(50))

  // 推奨アクション
  if (totalIssues > 0) {
    console.log('\n💡 Recommended Actions:')
    console.log('1. Run generateSEOFields() for basic posts')
    console.log('2. Run generateFullSEO() for featured posts')
    console.log('3. Review and customize auto-generated content')
  } else {
    console.log('\n✅ All posts have required SEO fields!')
  }
}

// ==================
// 使用例
// ==================
/*
import { allBlogPosts } from '../app/lib/blog-posts'
import { generateSEOReport, generateFullSEO } from './updateAllPosts'

// 1. レポート生成
generateSEOReport(allBlogPosts)

// 2. 全記事を更新
const updatedPosts = allBlogPosts.map(post => {
  if (post.featured) {
    return generateFullSEO(post)
  } else {
    return generateSEOFields(post) as BlogPost
  }
})

// 3. 結果を確認
console.log(updatedPosts)
*/