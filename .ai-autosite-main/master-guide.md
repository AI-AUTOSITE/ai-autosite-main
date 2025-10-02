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

markdown## 🎨 UX/パフォーマンス実装パターン

### 1. ファイルアップロード処理
#### 問題: OSダイアログ後の待機時間
ブラウザのセキュリティサンドボックスでファイルオブジェクトを準備する2-5秒は制御不可能

#### 解決策: 視覚的フィードバック
```typescript
// ❌ 悪い例：何も表示しない
<input type="file" onChange={handleFiles} />

// ✅ 良い例：カーソル + メッセージ
const [isWaitingForFiles, setIsWaitingForFiles] = useState(false)

useEffect(() => {
  if (isWaitingForFiles) {
    document.body.style.cursor = 'wait'
    return () => { document.body.style.cursor = '' }
  }
}, [isWaitingForFiles])

const handleButtonClick = () => {
  setIsWaitingForFiles(true)
  fileInputRef.current?.click()
}

// UI表示
{isWaitingForFiles && (
  <>
    <Loader2 className="animate-spin" />
    <p>Preparing files...</p>
    <p className="text-sm">This may take a few seconds for large folders</p>
  </>
)}
2. 大量データのレンダリング最適化
問題: 数万件のデータを一度に表示すると重い
例: 61,343件の依存関係を全てレンダリング → タブ切り替えが数秒かかる
解決策: ページネーション + 検索
typescript// 初期表示件数を制限
const [displayedCount, setDisplayedCount] = useState(100)
const [searchQuery, setSearchQuery] = useState('')

// フィルタリング
const filteredData = data.filter(item => 
  searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
)

// 表示データをスライス
const visibleData = filteredData.slice(0, displayedCount)
const hasMore = filteredData.length > displayedCount

// Load Moreボタン
{hasMore && (
  <button onClick={() => setDisplayedCount(prev => prev + 100)}>
    Load More ({filteredData.length - displayedCount} remaining)
  </button>
)}
目安:

100件以下: そのまま表示OK
100-1000件: ページネーション推奨
1000件以上: 検索 + ページネーション必須

3. ファイル重複処理
問題: 同名ファイルの衝突（page.tsx, component.tsx等）
解決策: 自動リネーム + 通知
typescriptconst handleAddFiles = (newFiles: File[]) => {
  const existingPaths = new Set(files.map(f => f.webkitRelativePath || f.name))
  const renamedFiles: Array<{ original: string; renamed: string }> = []
  
  newFiles.forEach(newFile => {
    const originalPath = newFile.webkitRelativePath || newFile.name
    let path = originalPath
    let counter = 1
    
    // 重複チェック
    while (existingPaths.has(path)) {
      const lastDotIndex = originalPath.lastIndexOf('.')
      const baseName = lastDotIndex > 0 ? originalPath.substring(0, lastDotIndex) : originalPath
      const ext = lastDotIndex > 0 ? originalPath.substring(lastDotIndex) : ''
      path = `${baseName}(${counter})${ext}`
      counter++
    }
    
    if (path !== originalPath) {
      renamedFiles.push({ original: originalPath, renamed: path })
    }
  })
  
  // 通知表示
  if (renamedFiles.length > 0) {
    showNotification({
      type: 'warning',
      message: `${renamedFiles.length} duplicate file(s) were renamed`
    })
  }
}
リネームパターン:
page.tsx → page(1).tsx → page(2).tsx
my.component.tsx → my.component(1).tsx
4. 通知システム
実装パターン
typescriptconst [notification, setNotification] = useState<{
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
} | null>(null)

// 自動非表示
const showNotification = (notif: typeof notification) => {
  setNotification(notif)
  setTimeout(() => setNotification(null), 
    notif.type === 'warning' ? 5000 : 3000
  )
}

// UI表示
{notification && (
  <div className={`animate-slide-down ${
    notification.type === 'warning' 
      ? 'bg-yellow-500/10 border-yellow-500/30' 
      : 'bg-cyan-500/10 border-cyan-500/30'
  }`}>
    <AlertCircle />
    <p>{notification.message}</p>
    <button onClick={() => setNotification(null)}>×</button>
  </div>
)}
5. エラーハンドリング（ファイル読み取り）
問題: 大量ファイル処理中に一部が読み取り不可
解決策: 個別エラーハンドリング + タイムアウト
typescriptconst failedFiles: string[] = []

for (const file of files) {
  try {
    // タイムアウト付き読み取り
    const content = await Promise.race([
      file.text(),
      new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ])
    
    // 処理続行
    processFile(content)
  } catch (error) {
    console.warn(`Failed to read: ${file.name}`, error)
    failedFiles.push(file.name)
    // エラーでも処理を継続
  }
}

// 警告表示
if (failedFiles.length > 0) {
  showNotification({
    type: 'warning',
    message: `${failedFiles.length} file(s) could not be read and were skipped`
  })
}
6. ローディング状態の多段階表示
typescriptconst [isSelecting, setIsSelecting] = useState(false)    // ファイル選択中
const [isProcessing, setIsProcessing] = useState(false)   // 解析中

// フルスクリーンオーバーレイ（処理中）
{isProcessing && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-wait">
    <Loader2 className="animate-spin" />
    <p>Processing files...</p>
  </div>
)}

### 7. UI簡素化の原則
#### 情報の表示タイミング
- **常時表示**: ユーザーの行動に必要な情報のみ
- **エラー時表示**: 失敗した時に初めて必要な情報
- **オンデマンド**: ガイドやツールチップに隠す

#### ファイルアップロードの例
```typescript
// ❌ 悪い例：全ての情報を常時表示
<p>Supports: TS, TSX, JS, JSX, JSON, CSS, MD</p>
<p>Auto-skips: node_modules, .git</p>
<p>Max size: 100MB</p>

// ✅ 良い例：必要な情報のみ表示
<p>Drop files or folder here</p>
<button>Select Files</button>
<div className="text-sm text-gray-400">
  <span>• Max 100MB</span>
  <span>• Max 1000 files</span>
</div>

// サポート形式はエラー時のみ
{error && (
  <p className="text-xs">Supported: TS, TSX, JS, JSX, JSON, CSS, MD</p>
)}
⚡ パフォーマンスチェックリスト
ファイルアップロード機能

 ボタンクリック時に即座にローディング表示
 document.body.style.cursor = 'wait' でカーソル変更
 "Preparing files..." メッセージ表示
 大容量フォルダ用の注意書き追加

大量データ表示

 初期表示100件に制限
 検索ボックス実装
 Load Moreボタンで追加読み込み
 合計件数を表示
 スクロールバーにカスタムスタイル（custom-scrollbar）

エラー対策

 個別ファイルのエラーハンドリング
 5秒タイムアウト設定
 失敗ファイル数の通知
 処理は継続（全体を止めない）

ユーザー通知

 成功時: 情報通知（3秒後自動消去）
 警告時: 警告通知（5秒後自動消去）
 手動閉じるボタン（×）
 アニメーション（animate-slide-down）

🎯 実装時の判断基準
いつページネーションを使うか
データ件数対応~100件そのまま表示100-1000件ページネーション推奨1000件~検索 + ページネーション必須
いつローディングを表示するか
処理時間対応~500ms表示不要500ms-2秒インラインスピナー2秒~フルスクリーンオーバーレイ
通知の自動消去時間
種類時間成功3秒情報3秒警告5秒エラー手動のみ
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

## 📁 カテゴリーページSEO実装ガイド

### ファイル構造
各カテゴリーに専用ページを作成し、クリーンなURLでSEO最適化を行います。
app/tools/
├── quick-tools/page.tsx
├── dev-tools/page.tsx
├── study-tools/page.tsx
├── business-tools/page.tsx
├── creative-tools/page.tsx
└── learning-hub/page.tsx

### URL構造の変更
**旧:** `/tools?category=quick-tools` （クエリパラメータ）  
**新:** `/tools/quick-tools` （クリーンURL）

### カテゴリーページメタデータテンプレート

#### 1. Quick Tools
```typescript
// app/tools/quick-tools/page.tsx
import { Metadata } from 'next'

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
2. Developer Tools
typescript// app/tools/dev-tools/page.tsx
export const metadata: Metadata = {
  title: 'Free Developer Tools - Debug & Analyze Code | AI AutoSite',
  description: 'Professional tools for debugging and optimizing code. Deep analysis, dependency mapping. No ads, no tracking.',
  keywords: 'developer tools, code analysis, debugging, free dev tools, no ads',
  openGraph: {
    title: 'Developer Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Professional tools for developers.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/dev-tools'
  }
}
3. Study Tools
typescript// app/tools/study-tools/page.tsx
export const metadata: Metadata = {
  title: 'Free AI Study Tools - Smart Learning Assistance | AI AutoSite',
  description: 'AI-powered study tools. PDF summarization, study guides, note-taking. 100% free, no ads, no tracking.',
  keywords: 'study tools, AI learning, PDF summary, study guides, free, no ads',
  openGraph: {
    title: 'Study Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. AI-powered learning assistance.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/study-tools'
  }
}
4. Business Tools
typescript// app/tools/business-tools/page.tsx
export const metadata: Metadata = {
  title: 'Free Business Tools - Professional Suite | AI AutoSite',
  description: 'Professional productivity tools for business. Invoice generation, email templates, report automation. No ads.',
  keywords: 'business tools, professional tools, productivity, free, no ads',
  openGraph: {
    title: 'Business Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Professional business productivity.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/business-tools'
  }
}
5. Creative Tools
typescript// app/tools/creative-tools/page.tsx
export const metadata: Metadata = {
  title: 'Free Creative Tools - Design & Create | AI AutoSite',
  description: 'Creative tools for designers and content creators. Color palettes, image editing, design templates. No ads.',
  keywords: 'creative tools, design tools, color palette, image editing, free, no ads',
  openGraph: {
    title: 'Creative Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Tools for designers and creators.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/creative-tools'
  }
}
6. Learning Hub
typescript// app/tools/learning-hub/page.tsx
export const metadata: Metadata = {
  title: 'Free Learning Hub - Understand Concepts | AI AutoSite',
  description: 'Learn technical concepts with interactive examples. Visual explanations, beginner-friendly. No ads, no tracking.',
  keywords: 'learning hub, technical learning, interactive examples, free, no ads',
  openGraph: {
    title: 'Learning Hub - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Interactive learning resources.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/learning-hub'
  }
}
カテゴリーページ作成チェックリスト

 6つのカテゴリーディレクトリ作成
 各page.tsxにメタデータ設定
 クライアントコンポーネント作成
 categories-config.tsのpath更新
 sitemap.tsにカテゴリーURL追加
 内部リンクの更新

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