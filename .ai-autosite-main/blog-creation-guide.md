# ブログ作成ガイド - AI AutoSite

## 📋 システム概要
このブログシステムは「**カテゴリ駆動型コンテンツ管理システム（Category-Driven CMS）**」と呼ばれる設計パターンを採用しています。

### アーキテクチャの特徴
- **分散型データ管理**: カテゴリごとにファイル分離
- **疎結合設計**: UI層とデータ層の完全分離
- **スケーラブル構造**: カテゴリ追加が容易

## 📁 ディレクトリ構造
app/
├── lib/
│   ├── blog-config.ts         # カテゴリ設定
│   └── blog-posts/
│       ├── types.ts           # TypeScript型定義
│       ├── study-tools.ts     # Study Tools記事データ
│       ├── dev-tools.ts       # Developer Tools記事データ
│       ├── quick-tools.ts     # Quick Tools記事データ
│       ├── learning.ts        # Learning Hub記事データ
│       └── index.ts           # データ統合・エクスポート
└── blog/
├── layout.tsx             # 共通レイアウト（Header/Footer）
├── page.tsx               # 記事一覧ページ（UI）
└── [記事ID]/
└── page.tsx           # 個別記事ページ

## ✅ 新規記事作成の3ステップ

### Step 1: カテゴリファイルにデータ追加
```typescript
// app/lib/blog-posts/[category].ts
import { IconName } from 'lucide-react'

export const [category]Posts: BlogPost[] = [
  // ... 既存記事
  {
    id: 'article-slug',           // URLパス（/blog/article-slug）
    title: '記事タイトル',
    description: '150文字程度の説明',
    readTime: '5 min',            
    publishDate: 'January 2025',  
    icon: IconName,               // lucide-reactアイコン
    featured: false,              // ⭐バッジ表示
    status: 'published',          
    relatedTool: {               
      name: 'ツール名',
      url: '/tools/tool-slug'
    }
  }
]
Step 2: 記事ページ作成
bashmkdir app/blog/article-slug
touch app/blog/article-slug/page.tsx
Step 3: 記事コンテンツ実装
typescript// app/blog/article-slug/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, [Icon] } from 'lucide-react'

export const metadata: Metadata = {
  title: 'タイトル | AI AutoSite',
  description: 'SEO説明文（150-160文字）',
  keywords: 'keyword1, keyword2, keyword3',
}

export default function ArticlePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Blog
        </Link>
        <h1 className="text-3xl font-bold text-white mb-3">
          記事タイトル
        </h1>
      </header>

      {/* コンテンツ */}
      <section className="space-y-8">
        {/* 4-6セクションで構成 */}
      </section>

      {/* ツールCTA */}
      <div className="mt-12 text-center">
        <Link
          href="/tools/[tool]"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg"
        >
          Try [Tool] Now
        </Link>
      </div>
    </article>
  )
}
🏷️ バッジシステム
バッジタイプ（自動判定）
バッジ条件表示カラー⭐ Featuredfeatured: true注目記事黄色🆕 New最新月の記事新着緑色🔥 Popularビュー数上位人気オレンジ
バッジロジックのカスタマイズ
typescript// app/blog/page.tsx内
const getPostBadge = (post) => {
  if (post.featured) return 'featured'
  if (post.publishDate === 'January 2025') return 'new'
  // カスタム条件を追加
  return null
}
📊 カテゴリ管理
新カテゴリ追加手順

blog-config.tsにカテゴリ定義追加
blog-posts/new-category.ts作成
index.tsにインポート追加

カテゴリ設定
typescript// app/lib/blog-config.ts
{
  id: 'category-id',
  name: 'Display Name',
  shortName: 'Short',     // モバイル表示用
  icon: IconComponent,
  color: 'from-color1 to-color2',
  description: '説明文'
}
💡 ベストプラクティス
コンテンツ設計

記事の長さ: 4-6セクション（縦長回避）
段落: 3-4文まで
ビジュアル: アイコンとカードで視覚的に
CTA: 上下2箇所のみ

SEO最適化

タイトル: 50-60文字
説明: 150-160文字
キーワード: 5-10個
内部リンク: 最低3つ

パフォーマンス

画像は最小限
コードスプリットで軽量化
動的インポート活用

🔄 更新履歴
Ver日付内容3.02025-01-24バッジシステム追加、UI簡略化2.02025-01-24カテゴリ分離構造1.02025-01-21初版

このガイドに従うことで、保守性とスケーラビリティを両立した
モダンなブログシステムを維持できます。