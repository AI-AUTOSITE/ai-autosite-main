# ツール統合標準手順書 (Tool Integration Standard Guide)

## 📋 概要
このドキュメントは、ai-autosite-mainプロジェクトに新しいツールを統合する際の標準手順書です。
**Claudeと共有して効率的に作業を進めるための完全ガイド**です。

---

## 🎯 Claudeに共有する前の準備

### 1. 必須共有ファイル
以下のファイルを必ずClaudeに共有してください：

```
【プロジェクト構造】
- project-structure.md（プロジェクト全体の構造）

【既存設定ファイル】
- package.json（依存関係確認）
- app/layout.tsx（メインレイアウト）
- app/tools/layout.tsx（ツール共通レイアウト）
- app/lib/categories.config.ts（ツール登録設定）
- app/globals.css（スタイル）

【参考となる既存ツール例】
- app/tools/[既存ツール名]/page.tsx
- app/tools/[既存ツール名]/components/[Component].tsx
```

### 2. 環境情報の共有
```markdown
開発環境:
- OS: Windows
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS v3
- TypeScript: 使用
- Deploy: Vercel

注意事項:
- Next.js 15は使用しない
- Tailwind CSS v4は使用しない
- 実験的機能は使用しない
```

---

## 🎨 UI/UXデザインガイドライン

### ヘッダーとナビゲーション設計

#### 階層構造の原則
```
共通ヘッダー（AI AutoSite）
    ↓
パンくずリスト（階層表示）
    ↓
ツールタイトル（メインコンテンツ）
```

#### パンくずリストの実装ルール

**重要な原則：現在のページ名は省略する**

```typescript
// ❌ 悪い例：重複している
Home > Tools > Study Tools > AI Text Summarizer
                             ↑
                     [下にも「AI Text Summarizer」が大きく表示される]

// ✅ 良い例：スッキリして見やすい
Home > Tools > Study Tools
                ↓
        [AI Text Summarizer] ← メインタイトルとして表示
```

#### 実装例（app/tools/layout.tsx）
```typescript
// パンくずリストコンポーネント
<nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
  <div className="container mx-auto px-4 py-3">
    <div className="flex items-center gap-2 text-sm">
      <Link href="/">
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      
      <ChevronRight className="w-4 h-4 text-gray-600" />
      
      <Link href="/tools">Tools</Link>
      
      <ChevronRight className="w-4 h-4 text-gray-600" />
      
      <span className="text-gray-400">
        {/* カテゴリ名を表示 */}
        Study Tools
      </span>
      
      {/* 現在のページ名は表示しない */}
    </div>
  </div>
</nav>
```

### ツールページのレイアウト構成

#### 標準的なページ構造
```
1. パンくずリスト（最後の項目は現在のページ名を除く）
2. ツールタイトルセクション
   - メインタイトル（大きく表示）
   - サブタイトル/説明文
3. 機能セクション
   - 特徴アイコン
   - 説明テキスト
4. メインツールエリア
   - 入力/操作エリア
   - 結果表示エリア
```

#### 視覚的階層の維持
```css
/* 視覚的な重要度の順序 */
.main-header { /* AI AutoSite ヘッダー */ }
.breadcrumb { /* 小さく、控えめに */ }
.tool-title { /* 最も大きく、目立つように */ }
.tool-content { /* 適切なサイズで読みやすく */ }
```

---

## 📁 標準ディレクトリ構造

```
app/
├── tools/
│   └── [tool-name]/               # ツールディレクトリ
│       ├── page.tsx               # ページファイル（必須）
│       ├── components/            # コンポーネント
│       │   └── [ToolName].tsx    # メインコンポーネント
│       ├── lib/                   # ライブラリ
│       │   └── types.ts          # 型定義
│       └── status.md             # 開発ステータス
├── api/
│   └── [api-name]/               # APIエンドポイント（必要時）
│       └── route.ts              # APIルート
└── lib/
    └── categories.config.ts      # ツール登録（更新必須）
```

---

## ✅ 統合チェックリスト

### Phase 1: 基本実装
- [ ] ツール仕様の明確化
- [ ] 必要な依存関係の確認
- [ ] ディレクトリ構造の作成
- [ ] 基本UIの実装
- [ ] APIエンドポイントの作成（必要時）

### Phase 2: 統合作業
- [ ] categories.config.tsへの登録
- [ ] ルーティングの確認
- [ ] スタイリングの調整
- [ ] レスポンシブ対応
- [ ] **パンくずリストの重複チェック**（新規追加）

### Phase 3: 最適化
- [ ] エラーハンドリング
- [ ] ローディング状態
- [ ] パフォーマンス最適化
- [ ] SEOメタデータ設定
- [ ] **UI階層の視覚的確認**（新規追加）

### Phase 4: ブログ作成（SEO強化）
- [ ] ツール紹介記事の作成
- [ ] 使い方ガイドの作成
- [ ] 技術解説記事の作成

---

## 🔧 実装詳細

### 1. page.tsx テンプレート
```typescript
// app/tools/[tool-name]/page.tsx
import { Metadata } from 'next'
import ToolComponent from './components/ToolComponent'

export const metadata: Metadata = {
  title: '[Tool Name] - [Description] | AI AutoSite',
  description: '[Detailed description for SEO]',
  keywords: '[keyword1, keyword2, keyword3]',
  openGraph: {
    title: '[Tool Name] - Free Online Tool',
    description: '[Short description]',
    type: 'website',
  }
}

export default function ToolPage() {
  return <ToolComponent />
}
```

### 2. ツールコンポーネントのヘッダー部分テンプレート
```typescript
// app/tools/[tool-name]/components/ToolComponent.tsx
export default function ToolComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ツールタイトルセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          [Tool Name]
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          [Tool description - パンくずリストには表示しない]
        </p>
      </div>
      
      {/* 機能セクション */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          AI-Powered [Feature Name]
        </h2>
        {/* 機能アイコンと説明 */}
      </div>
      
      {/* メインツールエリア */}
      <div className="space-y-6">
        {/* ツールの実装 */}
      </div>
    </div>
  )
}
```

### 3. categories.config.ts 登録
```typescript
{
  id: 'tool-id',
  name: 'Tool Name',
  description: 'Tool description',
  category: 'category-id',
  icon: '🔧',
  color: 'from-color-500 to-color-600',
  status: 'live',
  url: '/tools/tool-name',  // toolIdと一致させる
  tags: ['tag1', 'tag2'],
  difficulty: 'Simple',
  timeToUse: '1 minute',
  users: '1.0k',
  featured: false,
  new: true,
  pricing: 'free',
  apiRequired: false,
  dataProcessing: 'local'
}
```

### 4. 環境変数設定（API使用時）
```bash
# .env.local
API_KEY_NAME=your-api-key-here

# .env.example（更新）
API_KEY_NAME=your-api-key-placeholder
```

---

## 💡 UI/UXベストプラクティス

### 視覚的階層のガイドライン

#### フォントサイズの推奨値
```css
/* タイトル階層 */
.site-header { font-size: 1.5rem; }    /* 24px */
.breadcrumb { font-size: 0.875rem; }   /* 14px */
.tool-title { font-size: 3rem; }       /* 48px */
.section-title { font-size: 1.875rem; } /* 30px */
.body-text { font-size: 1rem; }        /* 16px */
```

#### カラースキーム
```css
/* 階層による明度の違い */
.breadcrumb { color: rgb(156, 163, 175); }  /* text-gray-400 */
.tool-title { color: white; }               /* text-white */
.description { color: rgb(209, 213, 219); } /* text-gray-300 */
```

### レスポンシブデザイン
```typescript
// モバイル対応のタイトル
<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
  {toolName}
</h1>

// パンくずリストのモバイル対応
<nav className="overflow-x-auto">
  <div className="flex items-center gap-2 text-sm whitespace-nowrap">
    {/* breadcrumb items */}
  </div>
</nav>
```

---

## 📝 SEO最適化とブログ作成

### ブログ記事の標準構成

#### 1. ツール紹介記事（必須）
```markdown
app/blog/[tool-name]-guide/page.tsx

構成:
- ツールの概要と特徴
- 使用するメリット
- 対象ユーザー
- 他ツールとの比較
- 今後の展開
```

#### 2. 使い方ガイド（必須）
```markdown
app/blog/how-to-use-[tool-name]/page.tsx

構成:
- ステップバイステップガイド
- スクリーンショット付き説明
- よくある使用例
- トラブルシューティング
- FAQ
```

#### 3. 技術解説記事（オプション）
```markdown
app/blog/[tool-name]-technical/page.tsx

構成:
- 技術的な仕組み
- 使用している技術スタック
- パフォーマンス最適化
- セキュリティ対策
```

### SEOチェックリスト
- [ ] メタタイトル（50-60文字）
- [ ] メタディスクリプション（150-160文字）
- [ ] OGP画像設定
- [ ] 構造化データ（Schema.org）
- [ ] 内部リンク設定
- [ ] パンくずリスト（重複なし）
- [ ] sitemap.xml更新
- [ ] robots.txt確認

---

## 🚀 デプロイ前チェック

### ローカルテスト
```bash
# 開発サーバー起動
npm run dev

# ビルドテスト
npm run build

# 本番モード確認
npm run start
```

### テスト項目
- [ ] 基本機能の動作確認
- [ ] エラーケースのテスト
- [ ] レスポンシブデザイン確認
- [ ] ブラウザ互換性（Chrome, Firefox, Safari, Edge）
- [ ] パフォーマンス測定（Lighthouse）
- [ ] **UI階層の視覚的確認**（新規追加）
- [ ] **パンくずリストの重複チェック**（新規追加）

### Vercel設定
- [ ] 環境変数の設定
- [ ] ドメイン設定
- [ ] Analytics設定
- [ ] エラーモニタリング

---

## 📊 統合後の確認事項

### アナリティクス設定
- [ ] Google Analytics設定
- [ ] Vercel Analytics確認
- [ ] ユーザー行動追跡

### モニタリング
- [ ] エラー率の確認
- [ ] API使用量（該当時）
- [ ] パフォーマンスメトリクス
- [ ] **ユーザビリティメトリクス**（新規追加）

### ユーザーフィードバック
- [ ] フィードバックフォーム設置
- [ ] 改善点の収集
- [ ] アップデート計画
- [ ] **UI/UXに関するフィードバック**（新規追加）

---

## 🤝 Claudeとの効率的な作業フロー

### 1. 初回共有時
```markdown
以下の情報を共有：
1. このガイドドキュメント
2. 必須共有ファイル（上記参照）
3. ツールの仕様・要件
4. 参考URL・デザイン（あれば）
5. UI階層の説明（パンくずリスト重複を避ける）
```

### 2. 作業依頼テンプレート
```markdown
【作成依頼】
ツール名: [Tool Name]
カテゴリ: [Category]
機能概要: [Description]

【技術要件】
- API使用: [Yes/No]
- データ処理: [Local/Server]
- 特殊ライブラリ: [Library names]

【デザイン要件】
- カラースキーム: [Colors]
- レイアウト: [Layout type]
- 参考デザイン: [URLs]
- パンくずリスト: 最後の項目（現在のページ名）は省略

【SEO要件】
- ターゲットキーワード: [Keywords]
- 想定ユーザー: [Target users]
- 競合ツール: [Competitors]
```

### 3. レビュー項目
```markdown
コード品質:
- [ ] TypeScript型定義
- [ ] エラーハンドリング
- [ ] コメント記述

UI/UX:
- [ ] レスポンシブ対応
- [ ] アクセシビリティ
- [ ] ローディング表示
- [ ] パンくずリストの重複なし
- [ ] 視覚的階層の適切さ

パフォーマンス:
- [ ] 不要な再レンダリング
- [ ] バンドルサイズ
- [ ] 画像最適化
```

---

## 📌 重要な注意事項

### 避けるべきこと
- ❌ 実験的機能の使用
- ❌ 最新版への安易なアップグレード
- ❌ クライアントサイドでのAPIキー露出
- ❌ 過度に複雑な実装
- ❌ テスト不足でのデプロイ
- ❌ **パンくずリストでの現在ページ名の重複表示**（新規追加）
- ❌ **視覚的階層の無視**（新規追加）

### 推奨事項
- ✅ 安定版ライブラリの使用
- ✅ 段階的な機能追加
- ✅ 十分なエラーハンドリング
- ✅ ユーザビリティ重視
- ✅ SEOを意識した実装
- ✅ **クリーンで階層的なUI設計**（新規追加）
- ✅ **パンくずリストの簡潔性**（新規追加）

---

## 📰 ブログ記事の作成と統合

### ブログシステム構造
```
app/blog/
├── layout.tsx               # ブログ共通レイアウト
├── page.tsx                 # ブログ一覧ページ
├── [slug]/                  # 動的ルーティング（使用していない）
│   └── page.tsx
└── [tool-name]-guide/       # 個別記事フォルダ
    └── page.tsx             # 記事ページ
```

### 1. ブログ記事の作成手順

#### Step 1: 記事フォルダとファイルの作成
```bash
# 新しい記事フォルダを作成
mkdir app/blog/[tool-name]-guide
touch app/blog/[tool-name]-guide/page.tsx
```

#### Step 2: 記事ページテンプレート
```typescript
// app/blog/[tool-name]-guide/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, BookOpen, Zap, Code, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: '[記事タイトル] | AI AutoSite Blog',
  description: '[SEO用の詳細説明 - 150-160文字]',
  keywords: '[keyword1, keyword2, keyword3]',
  openGraph: {
    title: '[OGPタイトル]',
    description: '[OGP説明]',
    type: 'article',
    images: ['/og-[tool-name].png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '[Twitterタイトル]',
    description: '[Twitter説明]',
  }
}

export default function [ToolName]BlogPost() {
  const publishDate = '2025-01-XX'
  const author = 'AI AutoSite Team'
  const readTime = 'X min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Blog */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        {/* カテゴリバッジと日付 */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-[color]/20 text-[color] rounded-full">
            [Category]
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          [記事タイトル]
          <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-[color1] to-[color2] bg-clip-text text-transparent">
            [サブタイトル]
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          [記事の概要]
        </p>
      </header>

      {/* 記事本文 */}
      {/* セクション構成例を含める */}
      
      {/* CTA - ツールへの誘導 */}
      <section className="text-center py-12 bg-gradient-to-r from-[color]/10 to-[color]/10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Try [Tool Name] Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          [ツールの価値提案]
        </p>
        <Link
          href="/tools/[tool-name]"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[color1] to-[color2] text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Zap className="mr-2" size={20} />
          Try It Free
        </Link>
      </section>
    </article>
  )
}
```

### 2. ブログ一覧への登録

#### app/blog/page.tsx の blogPosts 配列に追加
```typescript
const blogPosts = [
  // ... 既存の記事
  {
    id: '[tool-name]-guide',
    title: '[記事タイトル]',
    description: '[記事説明]',
    category: '[Category]',
    readTime: 'X min read',
    publishDate: 'January 2025',
    featured: false, // or true for 特集記事
    status: 'published', // or 'coming-soon'
    url: '/blog/[tool-name]-guide',
    icon: [Icon], // lucide-reactからインポート
    color: 'from-[color1] to-[color2]',
    relatedTool: {
      name: '[Tool Name]',
      url: '/tools/[tool-name]',
      description: '[ツール説明]'
    }
  }
]
```

### 3. SEO最適化の記事構成

#### 推奨セクション構成
```typescript
// 記事本文の構成例
<>
  {/* なぜこのツールが必要か */}
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-white mb-6">Why You Need [Tool Name]</h2>
    <p className="text-gray-300">
      [問題提起と解決策の提示]
    </p>
  </section>

  {/* 主要機能 */}
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>
    <div className="grid md:grid-cols-2 gap-6">
      {features.map((feature) => (
        // 機能カード
      ))}
    </div>
  </section>

  {/* 使い方ガイド */}
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-white mb-6">How to Use [Tool Name]</h2>
    <div className="space-y-6">
      {/* ステップバイステップガイド */}
    </div>
  </section>

  {/* 使用例・ユースケース */}
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-white mb-6">Real-World Use Cases</h2>
    {/* 実際の使用例 */}
  </section>

  {/* 技術的な詳細（オプション） */}
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-white mb-6">Technical Implementation</h2>
    {/* 技術スタックや実装詳細 */}
  </section>

  {/* FAQ */}
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
    {/* よくある質問と回答 */}
  </section>
</>
```

### 4. SEO最適化チェックリスト

#### メタデータ
- [ ] タイトル: 50-60文字、キーワード含む
- [ ] 説明: 150-160文字、アクション促進
- [ ] キーワード: 5-10個の関連キーワード
- [ ] OGP画像: 1200x630px
- [ ] 構造化データ: Article schema

#### コンテンツ
- [ ] H1タグ: 1つのみ、キーワード含む
- [ ] H2タグ: 3-5個、論理的な構成
- [ ] 内部リンク: ツールページへ最低3つ
- [ ] 外部リンク: 信頼できるソースへ
- [ ] 画像alt属性: すべての画像に設定
- [ ] 読了時間: 正確に計算（約200単語/分）

#### ユーザーエンゲージメント
- [ ] CTA: 明確で魅力的な行動喚起
- [ ] 関連ツールへのリンク
- [ ] 視覚的要素（アイコン、カード）
- [ ] レスポンシブデザイン確認

### 5. ブログ記事のタイプ別テンプレート

#### タイプ1: ツール紹介記事
```
- ツールの概要と価値提案
- 主要機能の詳細説明
- 他ツールとの比較
- 料金とプラン（該当する場合）
- ユーザーレビュー/テスティモニアル
```

#### タイプ2: ハウツー記事
```
- 問題の定義
- ステップバイステップのソリューション
- スクリーンショット/デモ
- よくある間違いと回避方法
- プロのヒントとコツ
```

#### タイプ3: 技術解説記事
```
- 技術的背景
- 実装の詳細
- コード例
- パフォーマンス考慮事項
- ベストプラクティス
```

### 6. パフォーマンス最適化

```typescript
// 画像の最適化
import Image from 'next/image'

// 遅延読み込み
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

## 📚 参考リソース

### ドキュメント
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v3](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

### 既存ツール参考例
- `/tools/ai-summarizer` - API連携の例
- `/tools/json-format` - ローカル処理の例
- `/tools/pdf-tools` - 複雑な機能の例

### 既存ブログ記事参考例
- `/blog/ai-dev-dictionary` - ツール紹介記事の例
- `/blog/choosing-the-right-tech-stack` - 技術解説記事の例
- `/blog/text-case-converter` - ハウツー記事の例

---

## 🔄 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-01-XX | 初版作成 | - |
| 2025-01-XX | SEO/ブログセクション追加 | - |
| 2025-01-XX | ブログ作成詳細ガイド追加 | - |
| 2025-01-XX | **UI/UXデザインガイドライン追加** | Claude |
| 2025-01-XX | **パンくずリスト重複解消の説明追加** | Claude |

---

## 🆕 Claude向け重要ポイント

### UI階層の理解
1. **共通ヘッダー（AI AutoSite）**: プロジェクト全体で共通
2. **パンくずリスト**: 階層を示すが、現在のページ名は省略
3. **ツールタイトル**: メインコンテンツとして最も大きく表示

### パンくずリスト実装時の注意
```typescript
// ❌ してはいけないこと
// パンくずリストの最後に現在のページ名を含める
<nav>
  Home > Tools > Study Tools > AI Text Summarizer
</nav>
<h1>AI Text Summarizer</h1>  // 重複！

// ✅ 正しい実装
// パンくずリストは親階層まで
<nav>
  Home > Tools > Study Tools
</nav>
<h1>AI Text Summarizer</h1>  // メインタイトルとして1回だけ表示
```

### 視覚的バランスの維持
- パンくずリスト: 小さく、控えめに（text-sm, text-gray-400）
- ツールタイトル: 大きく、目立つように（text-4xl/5xl, text-white）
- 説明文: 適度なサイズ（text-xl, text-gray-300）

---

**最終更新**: 2025年1月
**バージョン**: 1.2.0

このガイドは定期的に更新されます。最新版は常にプロジェクトリポジトリで確認してください。