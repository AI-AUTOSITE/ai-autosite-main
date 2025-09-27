# ブログ作成ガイド - AI AutoSite

## 📋 システム概要
このブログシステムは「**カテゴリ駆動型コンテンツ管理システム（Category-Driven CMS）**」を採用しています。

### アーキテクチャの特徴
- **分散型データ管理**: カテゴリごとにファイル分離
- **疎結合設計**: UI層とデータ層の完全分離
- **スケーラブル構造**: カテゴリ追加が容易
- **コンポーネント化**: 再利用可能なUIコンポーネント

## 📁 ディレクトリ構造
```
app/
├── components/
│   └── blog/
│       ├── BlogPostCard.tsx   # 記事カードコンポーネント
│       ├── BlogStats.tsx      # 統計情報コンポーネント
│       └── CategoryGrid.tsx   # カテゴリグリッド表示
├── lib/
│   ├── blog-config.ts         # カテゴリ設定
│   ├── blog-utils.ts          # ユーティリティ関数
│   ├── grid-utils.ts          # グリッド表示ユーティリティ
│   └── blog-posts/
│       ├── types.ts           # TypeScript型定義（拡張版）
│       ├── study-tools.ts     # Study Tools記事データ
│       ├── dev-tools.ts       # Developer Tools記事データ
│       ├── quick-tools.ts     # Quick Tools記事データ
│       ├── learning.ts        # Learning Hub記事データ
│       ├── business-tools.ts  # Business Tools記事データ
│       └── index.ts           # データ統合・エクスポート
└── blog/
    ├── layout.tsx              # 共通レイアウト（Header/Footer）
    ├── page.tsx                # 記事一覧ページ（UI）- リファクタリング版
    └── [記事ID]/
        └── page.tsx            # 個別記事ページ
```

## ✅ 新規記事作成の3ステップ

### Step 1: カテゴリファイルにデータ追加
```typescript
// app/lib/blog-posts/[category].ts
import { IconName } from 'lucide-react'
import type { BlogPost } from './types'

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
    status: 'published',          // published | coming-soon | draft
    relatedTool: {               
      name: 'ツール名',
      url: '/tools/tool-slug'
    },
    // 新規オプションフィールド
    lastUpdated: '2025-01-24',   // 更新日（オプション）
    tags: ['tag1', 'tag2'],       // タグ（オプション）
    author: 'AI AutoSite Team',   // 著者（オプション）
  }
]
```

### Step 2: 記事ページ作成
```bash
mkdir app/blog/article-slug
touch app/blog/article-slug/page.tsx
```

### Step 3: 記事コンテンツ実装
```typescript
// app/blog/article-slug/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, [Icon] } from 'lucide-react'

export const metadata: Metadata = {
  title: 'タイトル | AI AutoSite Blog',  // ブログ用サフィックス追加
  description: 'SEO説明文（150-160文字）',
  keywords: 'keyword1, keyword2, keyword3',
  openGraph: {
    title: 'OGタイトル',
    description: 'OG説明文',
    type: 'article',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitterタイトル',
    description: 'Twitter説明文',
  }
}

export default function ArticlePage() {
  const publishDate = '2025-01-XX'
  const author = 'AI AutoSite Team'
  const readTime = 'X min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Navigation */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-[category-color]/20 text-[category-color] rounded-full">
            カテゴリ名
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          記事タイトル
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          記事の概要説明
        </p>
      </header>

      {/* Main Content */}
      <section className="space-y-12">
        {/* 4-6セクションで構成 */}
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Try [Tool Name] Now
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          CTAの説明文
        </p>
        <Link
          href="/tools/[tool]"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <[Icon] className="mr-2" size={20} />
          Try It Free
        </Link>
      </section>
    </article>
  )
}
```

## 🏷️ バッジシステム

### バッジタイプ（自動判定）
| バッジ | 条件 | 表示 | カラー |
|-------|------|------|--------|
| ⭐ Featured | `featured: true` | 注目記事 | 黄色 |
| 🆕 New | 最新月の記事 | 新着 | 緑色 |
| 🔥 Popular | ビュー数上位/指定記事 | 人気 | オレンジ |
| 🔄 Updated | 7日以内に更新 | 更新 | 青色 |

### バッジロジックのカスタマイズ
```typescript
// app/lib/blog-utils.ts 内で管理
import { getPostBadge, BADGE_TYPES } from '@/lib/blog-utils'

// 使用例
const badgeType = getPostBadge(post)
const badge = badgeType ? BADGE_TYPES[badgeType] : null
```

## 🧩 新コンポーネントシステム

### コンポーネント構成
```typescript
// BlogPostCard - 記事カード表示
import { BlogPostCard } from '@/components/blog/BlogPostCard'
<BlogPostCard post={post} badge={badge} />

// BlogStats - 統計情報表示
import { BlogStats } from '@/components/blog/BlogStats'
<BlogStats totalArticles={10} categories={5} isFree={true} />

// CategoryGrid - カテゴリグリッド
import { CategoryGrid } from '@/components/blog/CategoryGrid'
<CategoryGrid 
  categories={blogCategories}
  onSelectCategory={handleSelect}
  isMobile={isMobile}
/>
```

### ユーティリティ関数
```typescript
// app/lib/blog-utils.ts
import { 
  searchPosts,      // 記事検索
  sortPosts,        // ソート
  getRelatedPosts,  // 関連記事取得
  paginatePosts     // ページネーション
} from '@/lib/blog-utils'

// 使用例
const filtered = searchPosts(posts, 'AI')
const sorted = sortPosts(filtered, 'date')
const paginated = paginatePosts(sorted, page, 6)
```

## 📊 カテゴリ管理

### 新カテゴリ追加手順
1. **blog-config.ts**にカテゴリ定義追加
2. **blog-posts/new-category.ts**作成
3. **index.ts**にインポート追加

### カテゴリ設定例
```typescript
// app/lib/blog-config.ts
import { IconComponent } from 'lucide-react'

export const blogCategories: BlogCategory[] = [
  {
    id: 'category-id',        // 内部ID（URLセーフ）
    name: 'Display Name',     // 表示名
    shortName: 'Short',       // モバイル表示用
    icon: IconComponent,      // lucide-reactアイコン
    color: 'from-color1 to-color2',  // グラデーション
    description: '説明文'
  }
]
```

## 💡 ベストプラクティス

### コンテンツ設計
- **記事の長さ**: 4-6セクション（縦長回避）
- **段落**: 3-4文まで
- **ビジュアル**: アイコンとカードで視覚的に
- **CTA**: 上下2箇所のみ
- **画像**: WebP形式推奨、遅延読み込み実装

### SEO最適化
- **タイトル**: 50-60文字
- **説明**: 150-160文字  
- **キーワード**: 5-10個
- **内部リンク**: 最低3つ
- **構造化データ**: Article schemaを実装

### パフォーマンス
- **画像最適化**: next/imageコンポーネント使用
- **コードスプリット**: 動的インポート活用
- **キャッシュ戦略**: 静的生成（SSG）を活用
- **バンドルサイズ**: 不要なインポートを避ける

## 📝 記事テンプレート集

### 1. ツール紹介記事
```typescript
// 構成例
- イントロダクション（問題提起）
- ツールの概要と特徴
- 主要機能の詳細説明
- 使い方ステップガイド
- ユースケース・活用例
- FAQ
- CTA（ツールへの誘導）
```

### 2. ハウツー記事
```typescript
// 構成例
- 問題の定義
- 解決策の概要
- ステップバイステップガイド
- トラブルシューティング
- プロのヒント
- 関連ツールの紹介
```

### 3. 技術解説記事
```typescript
// 構成例
- 技術の背景
- 基本概念の説明
- 実装例・コードサンプル
- ベストプラクティス
- よくある間違い
- 参考リソース
```

## 📋 チェックリスト

### 記事公開前チェック
- [ ] メタデータ（title, description, keywords）設定済み
- [ ] OGP画像設定済み
- [ ] 内部リンク3つ以上
- [ ] 関連ツールへのリンク設置
- [ ] レスポンシブデザイン確認
- [ ] 文字数・読了時間の確認
- [ ] カテゴリファイルへの登録
- [ ] featured/newフラグの設定

### SEOチェック
- [ ] URLスラッグが適切（英語、ハイフン区切り）
- [ ] H1タグが1つのみ
- [ ] 画像のalt属性設定
- [ ] 構造化データの実装
- [ ] モバイルフレンドリー確認

## 🔄 更新履歴

| Ver | 日付 | 内容 |
|-----|------|------|
| 4.0 | 2025-01-24 | コンポーネント化・リファクタリング完了 |
| 3.1 | 2025-01-24 | Business Tools追加、テンプレート拡充 |
| 3.0 | 2025-01-24 | バッジシステム追加、UI簡略化 |
| 2.0 | 2025-01-24 | カテゴリ分離構造 |
| 1.0 | 2025-01-21 | 初版 |

## 🔀 既存システムからの移行ガイド

### 移行手順
1. **コンポーネントの追加**
   ```bash
   mkdir -p app/components/blog
   # BlogPostCard.tsx, BlogStats.tsx, CategoryGrid.tsx を配置
   ```

2. **ユーティリティの追加**
   ```bash
   # app/lib/blog-utils.ts を追加
   # app/lib/grid-utils.ts を追加
   ```

3. **型定義の更新**
   ```bash
   # app/lib/blog-posts/types.ts を拡張版に更新
   ```

4. **blog/page.tsx の更新**
   ```bash
   # リファクタリング版に置き換え
   ```

### 互換性
- 既存の記事データはそのまま使用可能
- 新しいオプションフィールドは段階的に追加可能
- バックワードコンパティビリティ保証

---

このガイドに従うことで、保守性とスケーラビリティを両立したモダンなブログシステムを維持できます。