AI AutoSite マスターガイド v6.0 - 完全版">
# AI AutoSite マスターガイド v6.0
**理念: Zero Ads・Zero Tracking・Zero BS**  
**ミッション: 真の無料ツールを世界に提供**  
**最終更新: 2025-01-29**
📌 絶対原則
3つのZERO
🚫 Zero Ads     - 広告は一切表示しない
🚫 Zero Tracking - Google Analyticsすら使わない
🚫 Zero Sign-up  - メールアドレスすら要求しない
技術スタック（固定）
✅ Next.js 14 (15は使用禁止)
✅ Tailwind CSS v3 (v4は使用禁止)
✅ TypeScript
✅ Vercel + GitHub
❌ 実験的機能は一切使わない
🎯 開発の黄金律
UI設計原則
説明不要 = 見た瞬間に使い方が分かる
3秒ルール = 3秒以内に操作開始できる
Simple English = 小学生レベルの英語のみ
Local First = 可能な限りブラウザで完結
📝 ツールプロパティ定義
必須フィールド
typescriptinterface Tool {
  // === 必須フィールド ===
  id: string                // URLセーフなID (例: 'age-calculator')
  name: string              // ツール名 (例: 'Age Calculator')
  description: string       // 60文字以内、Simple English
  category: string          // カテゴリーファイル名と一致
  icon: string             // 絵文字アイコン
  color: string            // Tailwindグラデーション (例: 'from-cyan-500 to-blue-500')
  status: 'live' | 'coming' | 'maintenance'
  url: string              // '/tools/[id]'形式
  tags: string[]           // 検索用タグ配列
  difficulty: 'Instant' | 'Simple' | 'Intermediate' | 'Advanced'
  timeToUse: string        // 人間が読める形式 (例: "30 seconds", "2 minutes")
  
  // === オプショナルフィールド（必要時のみ追加）===
  emoji?: string           // 追加の絵文字
  featured?: boolean       // 特集ツール
  new?: boolean           // 新着フラグ
  badge?: 'NEW' | 'HOT' | 'BETA' | 'COMING SOON' | 'MAINTENANCE'
  apiRequired?: boolean    // AI API使用
  pricing?: 'free' | 'freemium' | 'paid'
  dataProcessing?: 'local' | 'server' | 'hybrid'
  dependencies?: string[]  // 依存パッケージ
  configRequired?: boolean // 設定必要
  lastUpdated?: string    // YYYY-MM形式
  projectSource?: string  // ソースプロジェクト名
}
カテゴリー別ファイル構成
app/lib/categories/
├── types.ts           # 型定義（マスター）
├── business-tools.ts  # ビジネスツール
├── creative-tools.ts  # クリエイティブツール
├── dev-tools.ts      # 開発者ツール
├── learning-tools.ts  # 学習ツール
├── quick-tools.ts    # クイックツール
├── study-tools.ts    # スタディツール
└── index.ts          # エクスポート統合
カテゴリー整合性ルール

categoryフィールドは必ずファイル名のプレフィックスと一致
重複ツールは絶対禁止
合計44個のツール管理（photocraf削除済み）

🔧 メタデータ実装ガイド
1. 基本構造（page.tsx）
typescript// app/tools/[tool-name]/page.tsx
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
2. 影響するファイル
新規ツール追加時に更新が必要なファイル：
1. app/tools/[tool-name]/page.tsx          # メタデータ設定
2. app/lib/categories/[category].ts        # ツールエントリー追加
3. app/tools/layout.tsx                    # ツール名マッピング追加
4. app/sitemap.ts                          # サイトマップ登録
5. public/og-[tool-name].png              # OG画像（オプション）
3. tools/layout.tsxへの追加
typescript// app/tools/layout.tsx
const getToolTitle = (pathname: string) => {
  const toolMap: Record<string, string> = {
    '/tools/age-calculator': 'Age Calculator',
    '/tools/ai-dev-dictionary': 'AI Dev Dictionary',
    // ... 他のツール
    '/tools/[new-tool]': '[New Tool Name]',  // 新規追加
  }
  return toolMap[pathname] || 'Tools'
}
📊 サイトマップ実装
sitemap.ts完全版
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
  
  // ブログ記事取得
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
新規ツール追加時のチェックリスト
markdown## ✅ 新規ツール追加チェックリスト

### 1. ファイル作成
- [ ] `app/tools/[tool-name]/` フォルダー作成
- [ ] `page.tsx` メタデータ設定
- [ ] `components/[ToolName]Client.tsx` 作成
- [ ] `guide.tsx` 作成（オプション）

### 2. 登録作業
- [ ] `app/lib/categories/[category].ts` にエントリー追加
- [ ] `app/tools/layout.tsx` のtoolMapに追加
- [ ] `app/sitemap.ts` のtools配列に追加
- [ ] 高優先度の場合はhighPriorityToolsにも追加

### 3. メタデータ確認
- [ ] タイトルに「Free」「No Ads, No Sign Up」含む
- [ ] 説明文に「100% free, no ads, no tracking」含む
- [ ] OpenGraphタイトルに「Truly Free, No Ads Ever」含む
- [ ] OpenGraph説明文に「Zero ads, zero tracking, zero BS」含む
- [ ] キーワードに「free」「no ads」「no sign up」「privacy」含む

### 4. 画像準備（オプション）
- [ ] `/public/og-[tool-name].png` 作成（1200x630px）

### 5. テスト
- [ ] ローカルで動作確認
- [ ] メタデータのプレビュー確認
- [ ] モバイル表示確認
- [ ] sitemap.xmlに含まれているか確認
🚀 実装優先順位
Priority 1: コンテンツ系（URL構造変更必要）

ai-dev-dictionary
ai-project-visualizer
stack-recommender

Priority 2: AI機能付き（SEO強化）

ai-prompt-generator
ai-resume
ai-summarizer
code-roaster
competitive-analyzer
debate-trainer
pdf-summarizer
pdf-tools
tech-stack-analyzer

Priority 3: 計算・変換系（現状維持）

残り32個のツール

⚠️ よくある実装ミス防止
1. Client/Server分離
typescript// ❌ 間違い：'use client'とmetadataの混在
'use client'
export const metadata = {...}  // エラー！

// ✅ 正解：分離する
// page.tsx（サーバーコンポーネント）
export const metadata = {...}
export default function Page() {
  return <ClientComponent />
}

// components/ClientComponent.tsx
'use client'
export default function ClientComponent() {...}
2. 文字色の視認性
typescript// ❌ 読めない
text-gray-600  // 背景と同化
text-gray-500  // 薄すぎる

// ✅ 最低限の視認性
text-gray-400  // 補助テキストの限界
text-gray-300  // メインテキスト
text-white     // 重要テキスト
3. セレクトボックス
typescript// ❌ オプションが見えない
<select className="bg-white/5 text-white">
  <option>選択肢</option>
</select>

// ✅ オプションも視認可能
<select className="bg-white/5 text-white [&>option]:bg-gray-800 [&>option]:text-white">
  <option>選択肢</option>
</select>
📈 SEOキーフレーズ戦略
必須キーフレーズ

"Free [Tool Name]"
"No Ads, No Sign Up"
"Zero Tracking"
"100% Free"
"Works Offline"
"Privacy First"

OpenGraphフレーズ

"Truly Free, No Ads Ever"
"Zero ads, zero tracking, zero BS"
"Free Forever"
"100% Private"

🔄 更新履歴
Ver日付内容6.02025-01-29完全版リファクタリング、44ツール統合5.02025-01-29OpenGraph追加、SEO強化4.02025-01-24ツールプロパティ定義追加3.02025-01-24初版統合ガイド作成