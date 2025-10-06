# 📄 ファイル3: metadata-seo-guide.md

````markdown
# メタデータ・SEO設定ガイド

**Version: 1.0**  
**最終更新: 2025-01-29**

## 📌 概要

本ドキュメントは、SEO最適化のためのメタデータ設定方法をまとめたものです。
すべてのツールページとブログ記事で統一された設定を行います。

### 関連ドキュメント

- [master-guide.md](./master-guide.md) - 開発の基本方針
- [tool-properties-guide.md](./tool-properties-guide.md) - ツール定義
- [blog-guide.md](./blog-guide.md) - ブログSEO

---

## 🔧 基本構造（page.tsx）

### ツールページのメタデータ

```typescript
// app/tools/[tool-name]/page.tsx
import { Metadata } from 'next'
import ToolNameClient from './components/ToolNameClient'

export const metadata: Metadata = {
  title: 'Free [Tool Name] - No Ads, No Sign Up | AI AutoSite',
  description: '[Action] instantly. 100% free, no ads, no tracking, no email required. Works offline in your browser.',
  keywords: 'free [tool], no ads, no sign up, privacy, no tracking, open source',

  // OpenGraph（必須）
  openGraph: {
    title: '[Tool Name] - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. [What it does]',
    type: 'website',
    images: [{
      url: '/og-[tool-name].png',
      width: 1200,
      height: 630,
      alt: 'Free [Tool Name] - No Ads'
    }]
  },

  // Twitter Card（推奨）
  twitter: {
    card: 'summary_large_image',
    title: '[Tool Name] - Free Forever, No Ads',
    description: '[Short description without ads]'
  },

  // 追加メタ（オプション）
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/[tool-name]'
  }
}

export default function ToolNamePage() {
  return <ToolNameClient />
}
メタデータのポイント
title

50-60文字
「Free」を先頭に
「No Ads, No Sign Up」を含む
サイト名で終わる

description

150-160文字
動詞で始める
「100% free, no ads, no tracking」を含む
具体的な機能を説明

keywords

5-10個
必須: free, no ads, no sign up, privacy
ツール固有のキーワード追加


📊 サイトマップ実装
sitemap.ts 完全版
typescript// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ai-autosite.com'
  const currentDate = new Date()

  // 44個のツール（アルファベット順）
  const tools = [
    'age-calculator',
    'ai-dev-dictionary',
    'ai-project-visualizer',
    'ai-prompt-generator',
    'ai-resume',
    'ai-summarizer',
    'base64',
    'blurtap',
    'bmi-calculator',
    'code-dependency-visualizer',
    'code-roaster',
    'color-palette',
    'competitive-analyzer',
    'countdown-timer',
    'debate-trainer',
    'favicon-generator',
    'gradient-generator',
    'hashtag-generator',
    'image-compress',
    'image-grid-maker',
    'image-splitter',
    'instagram-bio',
    'japanese-ocr',
    'json-csv',
    'json-format',
    'lorem-ipsum',
    'markdown-html',
    'password-generator',
    'pc-optimizer',
    'pdf-summarizer',
    'pdf-to-data',
    'pdf-tools',
    'percentage-calculator',
    'qr-code',
    'stack-recommender',
    'tech-stack-analyzer',
    'text-case',
    'text-counter',
    'token-compressor',
    'twitter-counter',
    'unit-converter',
    'uuid-generator',
    'whatsapp-link',
    'youtube-thumbnail'
  ]

  // 高優先度ツール（AI機能付き）
  const highPriorityTools = [
    'ai-dev-dictionary',
    'ai-project-visualizer',
    'ai-prompt-generator',
    'ai-resume',
    'ai-summarizer',
    'code-roaster',
    'competitive-analyzer',
    'debate-trainer',
    'pdf-summarizer',
    'pdf-tools',
    'stack-recommender',
    'tech-stack-analyzer'
  ]

  const blogPosts = getAllBlogPosts()

  return [
    // 静的ページ
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },

    // ツールページ（優先度別）
    ...tools.map(tool => ({
      url: `${baseUrl}/tools/${tool}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: highPriorityTools.includes(tool) ? 0.9 : 0.7
    })),

    // ブログ記事
    ...blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ]
}
新規ツール追加時
typescript// tools配列に追加（アルファベット順）
const tools = [
  // ... 既存ツール
  'new-tool',  // ← 追加
]

// AI機能付きの場合はhighPriorityToolsにも追加
const highPriorityTools = [
  // ... 既存ツール
  'new-tool',  // ← 追加
]

🏷️ カテゴリーページSEO
URL構造
旧: /tools?category=quick-tools
新: /tools/quick-tools
メタデータテンプレート
Quick Tools
typescript// app/tools/quick-tools/page.tsx
export const metadata: Metadata = {
  title: 'Free Quick Tools - One-Click Solutions | AI AutoSite',
  description: 'Instant tools for everyday tasks. No setup needed. 100% free, no ads, no tracking. Works offline.',
  keywords: 'quick tools, instant tools, free tools, no ads, productivity, one-click',
  openGraph: {
    title: 'Quick Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. One-click solutions for everyday tasks.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/quick-tools'
  }
}
Developer Tools
typescriptexport const metadata: Metadata = {
  title: 'Free Developer Tools - Debug & Analyze Code | AI AutoSite',
  description: 'Professional tools for debugging and optimizing code. Deep analysis, dependency mapping. No ads, no tracking.',
  keywords: 'developer tools, code analysis, debugging, free dev tools, no ads',
  // ... 同様の構造
}
Study Tools
typescriptexport const metadata: Metadata = {
  title: 'Free AI Study Tools - Smart Learning Assistance | AI AutoSite',
  description: 'AI-powered study tools. PDF summarization, study guides, note-taking. 100% free, no ads, no tracking.',
  keywords: 'study tools, AI learning, PDF summary, study guides, free, no ads',
  // ... 同様の構造
}

📈 SEOキーフレーズ戦略
必須キーフレーズ
すべてのページに含める：

"Free [Tool Name]" - タイトル先頭
"No Ads, No Sign Up" - タイトル中央
"Zero Tracking" - 説明文
"100% Free" - 説明文
"Works Offline" - 技術的優位性
"Privacy First" - 価値提案

OpenGraph専用フレーズ
SNSシェア用の強調表現：

"Truly Free, No Ads Ever" - OGタイトル
"Zero ads, zero tracking, zero BS" - OG説明
"Free Forever" - 強調
"100% Private" - プライバシー強調


🖼️ OG画像作成（オプション）
仕様

サイズ: 1200x630px
フォーマット: PNG
ファイル名: og-[tool-name].png
配置: /public/ ディレクトリ

デザインガイドライン
含めるべき要素

ツール名（大きく）
アイコン/絵文字
「Free」「No Ads」テキスト
サイトロゴ（小さく）

避けるべき要素

小さすぎるテキスト
複雑すぎるデザイン
著作権のある画像


⚠️ よくある実装ミス
1. Client/Server分離
typescript// ❌ 間違い
'use client'
export const metadata = {...}  // エラー！

// ✅ 正解
// page.tsx（サーバーコンポーネント）
export const metadata = {...}
export default function Page() {
  return <ClientComponent />
}

// components/ClientComponent.tsx
'use client'
export default function ClientComponent() {...}
2. tools/layout.tsx への追加忘れ
typescript// app/tools/layout.tsx
const getToolTitle = (pathname: string) => {
  const toolMap: Record<string, string> = {
    // ... 既存ツール
    '/tools/new-tool': 'New Tool Name',  // ← 追加必須
  }
  return toolMap[pathname] || 'Tools'
}

✅ チェックリスト
メタデータ設定

 タイトルに「Free」含む
 タイトルに「No Ads, No Sign Up」含む
 説明文に「100% free, no ads, no tracking」含む
 OGタイトルに「Truly Free, No Ads Ever」含む
 OG説明文に「Zero ads, zero tracking, zero BS」含む
 キーワードに必須フレーズ含む
 canonical URL設定

サイトマップ

 tools配列に追加（アルファベット順）
 AI機能付きはhighPriorityToolsに追加
 ローカルで /sitemap.xml 確認
 本番環境でクロール可能

その他

 OG画像作成（オプション）
 tools/layout.tsx更新
 モバイルプレビュー確認
 アクセシビリティ確認


🔄 更新履歴
Ver日付内容1.02025-01-29初版作成（master-guideから分離）

SEO設定は一度正しく設定すれば、長期的な効果があります
```
````
