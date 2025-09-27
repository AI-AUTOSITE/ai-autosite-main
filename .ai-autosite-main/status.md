# AI AutoSite ツール作成ガイド v3.6
**理念: シンプル・高速・誰でも使える**
**Target: English-speaking users (Global)**

## 📌 最重要原則

### 絶対に守ること
```
1. 説明不要なデザイン = 見た瞬間に使い方が分かる
2. ツールファースト = ヒーロー部分を最小限に、すぐツール本体
3. 3秒ルール = 3秒で理解・操作開始できる設計
4. 英語は小学生レベル = 10-12歳が理解できる単語のみ使用
5. API利用時は api-usage-guide.md を参照
5. 日付を記述する際は必ず現在の日付を取得し記述
```

### 言語ルール
```
✅ Simple English only（簡単な英語のみ）
✅ 短い文章（15単語以内）
✅ 専門用語は避ける
✅ アイコンで補完する

例：
❌ "Configure your preferences" 
✅ "Choose your settings"

❌ "Initialize the application"
✅ "Start the app"

❌ "Authenticate your credentials"
✅ "Sign in"
```

### 禁止事項
```
❌ Next.js 15（14を使用）
❌ Tailwind CSS v4（v3を使用）
❌ 実験的機能
❌ 複雑な説明セクション
❌ ゴチャゴチャしたUI
```

---

## ⚠️ 実装時の重要な注意点（v3.6更新）

### 1. tools/layout.tsxとの整合性

```typescript
// ❌ 間違い：個別ツールで独自にパンくず・タイトルを実装
export default function ToolPage() {
  return (
    <div>
      <div className="breadcrumb">Home › Tools</div>  // 重複！
      <h1>Tool Title</h1>  // 重複！
    </div>
  )
}

// ✅ 正解：tools/layout.tsxに任せる
export default function ToolPage() {
  return (
    <div className="container mx-auto px-4">
      {/* ツール本体のみ実装 */}
    </div>
  )
}

// tools/layout.tsxに追加を忘れずに！
const getToolTitle = (pathname: string) => {
  const toolMap: Record<string, string> = {
    '/tools/your-new-tool': 'Your Tool Name',  // 追加必須！
  }
}
```

### 2. モーダル実装の必須要件

```typescript
// ✅ 完璧なモーダル実装
<>
  {/* 背景レイヤー - クリックで閉じる */}
  <div 
    className="fixed inset-0 bg-black/50 z-[100000]"
    onClick={() => setShowModal(false)}  // 必須：外側クリックで閉じる
  />
  
  {/* モーダルコンテナ */}
  <div className="fixed inset-0 z-[100001] overflow-y-auto">
    <div className="flex min-h-screen pt-24 px-4 pb-20 justify-center">
      <div 
        className="w-full max-w-2xl h-fit mt-8"
        onClick={(e) => e.stopPropagation()}  // 内側は閉じない
      >
        {/* 必須：×ボタン */}
        <button 
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
        
        {/* コンテンツ */}
      </div>
    </div>
  </div>
</>

// オプション：ESCキーでも閉じる
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowModal(false)
  }
  window.addEventListener('keydown', handleEsc)
  return () => window.removeEventListener('keydown', handleEsc)
}, [])
```

### 3. Next.js 14でのメタデータ

```typescript
// ❌ 間違い：'use client'とmetadataの混在
'use client';
export const metadata = {...}  // エラー！

// ✅ 正解：分離する
// page.tsx（サーバーコンポーネント）
export const metadata = {...}
export default function Page() {
  return <ClientComponent />
}

// ClientComponent.tsx（クライアントコンポーネント）
'use client';
export default function ClientComponent() {...}
```

### 4. 文字色とコントラストのガイドライン

```typescript
// ダークテーマ（bg-gray-900）での推奨文字色

// ✅ 推奨
text-white         // 見出し・重要テキスト
text-gray-300      // メインテキスト  
text-gray-400      // 補助テキスト（読める限界）

// ⚠️ 使用注意
text-gray-500      // アイコンのみOK、重要でないテキストのみ

// ❌ 使用禁止（読めない）
text-gray-600      // 薄すぎる
text-gray-700      // ほぼ見えない
text-gray-800      // 背景と同化

// アクセントカラー（明るいバリエーションを使用）
text-cyan-400      // プライマリアクション
text-green-400     // 成功・完了
text-red-400       // エラー・警告
text-purple-400    // セカンダリ
```

### 5. セレクトボックスの視認性（v3.6新規）

```typescript
// ❌ 間違い：デフォルトのままだと見えない
<select className="bg-white/5 text-white">
  <option>選択肢1</option>  // 背景が白/青で読めない！
</select>

// ✅ 正解：ドロップダウンの背景と文字色を指定
<select 
  className="bg-white/5 text-white 
    [&>option]:bg-gray-800   // オプションの背景をダークグレーに
    [&>option]:text-white"    // オプションの文字を白に
>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>

// 代替案：個別にスタイル指定
<select className="bg-white/5 text-white">
  <option className="bg-gray-800 text-white">Option 1</option>
  <option className="bg-gray-800 text-white">Option 2</option>
</select>
```

### 6. レイアウト階層の理解

```
app/
├── layout.tsx          # サイト全体のヘッダー・フッター
├── tools/
│   ├── layout.tsx      # ツール共通のパンくず・タイトル・ガイド表示
│   └── [tool-name]/
│       ├── page.tsx    # メタデータのみ（サーバーコンポーネント）
│       ├── guide.tsx   # ツールガイドコンポーネント（NEW!）
│       └── components/
│           └── ToolClient.tsx  # 実際のツール（クライアントコンポーネント）
```

### 7. Tailwind動的クラスの制限

```typescript
// ❌ 間違い：動的クラス生成
const color = 'green';
<div className={`text-${color}-400`}>  // 本番で動作しない！

// ✅ 正解1：完全なクラス名を使う
const colorClass = color === 'green' ? 'text-green-400' : 'text-red-400';

// ✅ 正解2：safelist に追加
// tailwind.config.js
safelist: ['text-green-400', 'text-red-400']
```

---

## 🆕 ツールガイドシステム（v3.5新機能）

### 実装方法

#### 1. 各ツールにguide.tsxを作成

```typescript
// app/tools/[tool-name]/guide.tsx
import { HelpCircle } from 'lucide-react'

export const toolGuide = {
  title: 'How to use [Tool Name]',
  steps: [
    { icon: '1', text: 'First step description' },
    { icon: '2', text: 'Second step description' },
    { icon: '3', text: 'Third step description' }
  ],
  tips: [
    'Tip 1: Keep it simple',
    'Tip 2: Max file size 10MB'
  ],
  troubleshooting: [
    { problem: 'File not uploading', solution: 'Check file format' }
  ]
}

export default function ToolGuide() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">{toolGuide.title}</h3>
      {/* ガイドコンテンツ */}
    </div>
  )
}
```

#### 2. tools/layout.tsxを拡張

```typescript
// app/tools/layout.tsx
'use client'
import { useState, useEffect, Suspense } from 'react'
import { HelpCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showGuide, setShowGuide] = useState(false)
  const [ToolGuide, setToolGuide] = useState<any>(null)
  
  // 動的にガイドをインポート
  useEffect(() => {
    const loadGuide = async () => {
      try {
        const toolName = pathname.split('/').pop()
        const guide = await import(`@/app/tools/${toolName}/guide`)
        setToolGuide(() => guide.default)
      } catch {
        setToolGuide(null)
      }
    }
    loadGuide()
  }, [pathname])

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        {/* パンくず + タイトル + ヘルプアイコン */}
        {pathname !== '/tools' && (
          <nav className="container mx-auto px-4 pt-6 pb-4">
            <div className="relative flex items-center">
              <div className="absolute left-0 text-xs text-gray-500">
                <Link href="/">Home</Link>
                <span className="mx-2">›</span>
                <Link href="/tools">Tools</Link>
              </div>
              
              <h1 className="text-xl font-medium text-white mx-auto">
                {getToolTitle(pathname)}
              </h1>
              
              {/* ツールガイドボタン（存在する場合のみ表示） */}
              {ToolGuide && (
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className="absolute right-0 text-gray-400 hover:text-cyan-400"
                  title="Help"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </nav>
        )}

        {/* ガイドモーダル */}
        {showGuide && ToolGuide && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-[100000]"
              onClick={() => setShowGuide(false)}
            />
            <div className="fixed inset-0 z-[100001] overflow-y-auto">
              <div className="flex min-h-screen pt-24 px-4 pb-20 justify-center">
                <div onClick={(e) => e.stopPropagation()}>
                  <Suspense fallback={<div>Loading guide...</div>}>
                    <ToolGuide />
                  </Suspense>
                </div>
              </div>
            </div>
          </>
        )}

        <main className="relative z-10">{children}</main>
      </div>

      <Footer />
    </>
  )
}
```

#### 3. 利点

- **一貫性**: すべてのツールで同じ場所にヘルプ
- **オプショナル**: guide.tsxがなければヘルプアイコン非表示
- **保守性**: 各ツールで独自のガイド管理
- **UX向上**: 必要な時だけガイドを参照

---

## 🚀 新規ツール作成の4ステップ（v3.5改訂）

### Step 1: 最小構成で作る

```bash
# フォルダ作成
mkdir app/tools/[tool-name]
mkdir app/tools/[tool-name]/components
touch app/tools/[tool-name]/page.tsx
touch app/tools/[tool-name]/guide.tsx  # NEW!
touch app/tools/[tool-name]/components/[ToolName]Client.tsx
```

### Step 2: page.tsxとクライアントコンポーネントを分離

```typescript
// app/tools/[tool-name]/page.tsx
import { Metadata } from 'next'
import ToolNameClient from './components/ToolNameClient'

export const metadata: Metadata = {
  title: '[Tool Name] - Free Online Tool | AI AutoSite',
  description: '[50-60文字の説明]',
}

export default function ToolPage() {
  return <ToolNameClient />
}
```

### Step 3: guide.tsxを作成（オプション）

```typescript
// app/tools/[tool-name]/guide.tsx
export default function ToolGuide() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md">
      <button className="absolute top-2 right-2">
        <X className="w-5 h-5 text-gray-400" />
      </button>
      <h3 className="text-xl font-bold text-white mb-4">Quick Guide</h3>
      {/* Simple steps */}
    </div>
  )
}
```

### Step 4: 2箇所に登録

```typescript
### 3. 分割ファイルの実装例
## カテゴリー割り当てルール
- 無効なカテゴリーにツールを割り当てない
- creative, ai-powered, securityは現在無効
- 無効カテゴリーのツールは有効なカテゴリーに移動
## ステータスとバッジの対応
- live → なし or NEW or HOT
- coming → COMING SOON
- maintenance → MAINTENANCE
#### app/lib/categories/types.ts
```typescript
import { LucideIcon } from 'lucide-react'

export interface Tool {
  id: string
  name: string
  description: string  // Max 15 words (per guidelines)
  category: string
  icon: string
  emoji?: string
  color: string
  status: 'live' | 'coming' | 'maintenance'
  url: string
  tags: string[]
  difficulty: 'Instant' | 'Simple' | 'Intermediate' | 'Advanced'
  timeToUse: string
  featured?: boolean
  new?: boolean
  badge?: 'NEW' | 'HOT' | 'BETA' | 'COMING SOON' | 'MAINTENANCE'
  apiRequired?: boolean
  pricing?: 'free' | 'freemium' | 'paid'
  lastUpdated?: string  // YYYY-MM format
  dataProcessing?: 'local' | 'server' | 'hybrid'
  dependencies?: string[]
}

export interface Category {
  id: string
  title: string
  tagline: string  // 3-4 words max
  icon: string
  iconComponent?: LucideIcon
  emoji: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  benefits: string[]
  enabled: boolean
  order: number
  badge?: 'NEW' | 'COMING SOON' | 'BETA' | 'HOT' | 'POPULAR'
  path?: string
}
```
# status.md に追加するセクション

## 🎯 ユーザー体験の必須要件（v3.8新規）

### 1. ファイル容量の明示

```typescript
// ❌ 間違い：容量制限が不明
<input type="file" onChange={handleFileUpload} />

// ✅ 正解：容量を明確に表示
<div className="space-y-2">
  <label className="text-white font-medium">
    Upload File
    <span className="text-gray-400 text-sm ml-2">(Max: 10MB)</span>
  </label>
  <input 
    type="file" 
    accept=".pdf,.jpg,.png"
    onChange={handleFileUpload}
    className="..."
  />
  <p className="text-xs text-gray-400">
    Supported: PDF, JPG, PNG • Max size: 10MB
  </p>
</div>

// ファイルサイズチェック
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  const MAX_SIZE = 10 * 1024 * 1024  // 10MB
  
  if (file.size > MAX_SIZE) {
    setError(`File too large. Maximum size is 10MB, your file is ${(file.size / 1024 / 1024).toFixed(1)}MB`)
    return
  }
  
  // 処理続行
}
```

### 2. 進捗状況の可視化（必須）

```typescript
// ✅ 完璧な進捗表示の実装
'use client'

import { useState } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ProcessStatus {
  stage: 'idle' | 'uploading' | 'processing' | 'completing' | 'done' | 'error'
  progress: number  // 0-100
  message: string
}

export default function FileProcessor() {
  const [status, setStatus] = useState<ProcessStatus>({
    stage: 'idle',
    progress: 0,
    message: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = async (file: File) => {
    setIsProcessing(true)
    
    try {
      // Stage 1: アップロード
      setStatus({
        stage: 'uploading',
        progress: 0,
        message: 'Uploading file...'
      })
      
      // アップロード進捗のシミュレーション
      const uploadProgress = async () => {
        for (let i = 0; i <= 100; i += 10) {
          setStatus(prev => ({ ...prev, progress: i * 0.3 }))  // 30%まで
          await new Promise(r => setTimeout(r, 100))
        }
      }
      await uploadProgress()
      
      // Stage 2: 処理
      setStatus({
        stage: 'processing',
        progress: 30,
        message: 'Processing your file...'
      })
      
      // API呼び出し
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData
      })
      
      // 処理進捗（30% → 90%）
      for (let i = 30; i <= 90; i += 10) {
        setStatus(prev => ({ 
          ...prev, 
          progress: i,
          message: i < 60 ? 'Analyzing content...' : 'Finalizing results...'
        }))
        await new Promise(r => setTimeout(r, 200))
      }
      
      // Stage 3: 完了処理
      setStatus({
        stage: 'completing',
        progress: 95,
        message: 'Almost done...'
      })
      
      const result = await response.json()
      
      // Stage 4: 完了
      setStatus({
        stage: 'done',
        progress: 100,
        message: 'Complete!'
      })
      
    } catch (error) {
      setStatus({
        stage: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Processing failed'
      })
    } finally {
      // 3秒後にリセット
      setTimeout(() => {
        setIsProcessing(false)
        setStatus({ stage: 'idle', progress: 0, message: '' })
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* ファイルアップロードエリア */}
      <div 
        className={`
          relative p-8 border-2 border-dashed rounded-xl transition-all
          ${isProcessing 
            ? 'bg-gray-800/50 border-gray-600 cursor-not-allowed' 
            : 'bg-white/5 border-white/20 hover:border-cyan-400/50 cursor-pointer'
          }
        `}
      >
        <input
          type="file"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="text-center">
          {status.stage === 'idle' && (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium">Drop file here or click to upload</p>
              <p className="text-gray-400 text-sm mt-2">PDF, JPG, PNG • Max 10MB</p>
            </>
          )}
          
          {status.stage === 'uploading' && (
            <>
              <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium">{status.message}</p>
            </>
          )}
          
          {status.stage === 'processing' && (
            <>
              <div className="relative w-12 h-12 mx-auto mb-4">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              </div>
              <p className="text-white font-medium">{status.message}</p>
            </>
          )}
          
          {status.stage === 'done' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-white font-medium">{status.message}</p>
            </>
          )}
          
          {status.stage === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 font-medium">{status.message}</p>
            </>
          )}
        </div>
      </div>

      {/* プログレスバー */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{status.message}</span>
            <span className="text-cyan-400">{status.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 処理中のグレイアウト表示 */}
      {isProcessing && (
        <div className="grid grid-cols-2 gap-4">
          <button 
            disabled
            className="py-3 bg-gray-700/50 text-gray-500 rounded-xl cursor-not-allowed
                       opacity-50 transition-all"
          >
            Clear (Disabled)
          </button>
          <button 
            disabled
            className="py-3 bg-gray-700/50 text-gray-500 rounded-xl cursor-not-allowed
                       opacity-50 transition-all"
          >
            Download (Disabled)
          </button>
        </div>
      )}
    </div>
  )
}
```

### 3. 処理中の操作無効化パターン

```typescript
// パターン1: フォーム全体を無効化
<form className={isProcessing ? 'pointer-events-none opacity-50' : ''}>
  {/* フォーム要素 */}
</form>

// パターン2: オーバーレイで覆う
{isProcessing && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 
                  flex items-center justify-center">
    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
      <p className="text-white">Processing... Please wait</p>
    </div>
  </div>
)}

// パターン3: 個別要素の無効化
<button
  onClick={handleSubmit}
  disabled={isProcessing || !isValid}
  className={`
    px-6 py-3 rounded-xl font-medium transition-all
    ${isProcessing || !isValid
      ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90'
    }
  `}
>
  {isProcessing ? (
    <span className="flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      Processing...
    </span>
  ) : (
    'Submit'
  )}
</button>
```

### 4. リアルタイムフィードバック

```typescript
// ファイルドロップのビジュアルフィードバック
const [isDragging, setIsDragging] = useState(false)

<div
  onDragEnter={() => setIsDragging(true)}
  onDragLeave={() => setIsDragging(false)}
  onDrop={() => setIsDragging(false)}
  className={`
    border-2 border-dashed rounded-xl transition-all duration-200
    ${isDragging 
      ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02]' 
      : 'border-white/20 bg-white/5'
    }
  `}
>
  {/* ドロップエリア */}
</div>

// 入力検証のリアルタイム表示
const [errors, setErrors] = useState<Record<string, string>>({})

<input
  type="text"
  onChange={(e) => {
    const value = e.target.value
    if (value.length > 100) {
      setErrors({ ...errors, name: 'Maximum 100 characters' })
    } else {
      const { name, ...rest } = errors
      setErrors(rest)
    }
  }}
  className={errors.name ? 'border-red-400' : 'border-white/20'}
/>
{errors.name && (
  <p className="text-xs text-red-400 mt-1">{errors.name}</p>
)}
```

### 5. 処理時間の見積もり表示

```typescript
// 予想処理時間を表示
const getEstimatedTime = (fileSize: number): string => {
  const mbSize = fileSize / (1024 * 1024)
  
  if (mbSize < 1) return 'Less than 5 seconds'
  if (mbSize < 5) return 'About 10-20 seconds'
  if (mbSize < 10) return 'About 30-45 seconds'
  return 'About 1 minute'
}

// 使用例
<div className="text-sm text-gray-400">
  Estimated processing time: {getEstimatedTime(file.size)}
</div>
```

### 容量制限の推奨値

| ファイルタイプ | 推奨最大サイズ | 理由 |
|---------------|--------------|------|
| 画像（JPG/PNG） | 10MB | 処理速度とクオリティのバランス |
| PDF | 20MB | 複数ページ対応 |
| 動画 | 100MB | Vercel制限内 |
| テキスト | 1MB | 十分な文章量 |
| CSV/Excel | 5MB | 数万行のデータ |

### チェックリスト

- [ ] ファイル容量を明記（アップロード前に確認可能）
- [ ] アップロード進捗を表示
- [ ] 処理段階を可視化（uploading → processing → done）
- [ ] プログレスバー実装
- [ ] 処理中は全ボタンをdisabled
- [ ] エラー時の明確なメッセージ
- [ ] 処理時間の見積もり表示
- [ ] ドラッグ&ドロップのビジュアルフィードバック

---

## 外部API利用時の注意

外部AI APIを使用する場合は、必ず **api-usage-guide.md** を参照してください。
特に以下の項目は必須実装です：

- BOT対策・いたずら防止
- レート制限
- フォールバック戦略（Claude → Cohere → Local）
- reCAPTCHA統合（本番環境）

---

## 🔄 更新履歴に追加

| Ver | 日付 | 内容 |
|-----|------|------|
| 3.8 | 2025-01-24 | ユーザー体験必須要件追加（容量明示・進捗可視化・グレイアウト） |
| 3.7 | 2025-01-24 | API利用ガイドを別ファイル化（api-usage-guide.md） |

---

## 📁 ディレクトリ構造（v3.5推奨）

```
app/tools/[tool-name]/
  ├── page.tsx                    # メタデータのみ
  ├── guide.tsx                   # ツールガイド（オプション）
  ├── components/
  │   ├── [ToolName]Client.tsx   # メインコンポーネント
  │   ├── FileUploader.tsx       # 必要に応じて
  │   └── ResultDisplay.tsx      # 必要に応じて
  ├── hooks/                      # カスタムフック
  │   └── useToolLogic.ts
  ├── utils/                      # ユーティリティ
  │   └── helpers.ts
  └── constants/                  # 定数
      └── index.ts
```

---

## ✅ Claudeとの共有チェックリスト（v3.6改訂）

### 初回共有時

```markdown
【環境】
- Next.js 14 (15は使わない)
- Tailwind CSS v3 (v4は使わない)
- TypeScript
- Windows/Vercel

【既存のレイアウト構造】
- app/tools/layout.tsx が既にパンくずとタイトルを処理
- ヘッダーは app/components/Header.tsx で実装済み
- 個別ツールでは重複実装しない
- guide.tsxでツールガイドを提供可能

【モーダル実装の必須要件】
- 必ず×ボタンを右上に配置
- 背景クリックで閉じる機能必須
- e.stopPropagation()で内側クリックは閉じない
- z-index: 100000以上を使用
- ESCキーで閉じる（推奨）

【文字色ルール（ダークテーマ）】
- メインテキスト: text-white or text-gray-300
- 補助テキスト: text-gray-400（限界）
- 禁止: text-gray-500以下（読めない）

【セレクトボックスの視認性（重要）】
- ドロップダウンの背景: [&>option]:bg-gray-800
- ドロップダウンの文字: [&>option]:text-white
- これを忘れるとオプションが読めない

【ターゲット】
- English-speaking users (Global)
- UI text: Elementary school level English (Grade 5-6)
- No technical jargon
- Short sentences (max 15 words)

【参考にする世界標準】
- Google Search (3秒ルール)
- TinyPNG (ドラッグ&ドロップ)
- Remove.bg (自動化)
- Fast.com (ゼロクリック)

【作りたいツール】
名前: [Tool Name in English]
機能: [What it does - simple words]
入力: [File/Text/etc]
出力: [Result/Download/etc]
ガイド: [必要なら guide.tsx も作成]

【重要な要件】
- tools/layout.tsxにツール名を追加する必要あり
- 'use client'とmetadataを混在させない
- モーダルは必ず閉じる方法を複数用意
- 文字色は必ず読めるコントラストを確保
- セレクトボックスのオプションも視認性確保
- 説明不要なUI（見た瞬間使える）
- ツールファースト（すぐ操作可能）
- エラーを起こさせない設計
- Simple English only
- TinyPNGレベルのシンプルさ
```

### 必須共有ファイル（v3.5更新）

```
- package.json
- app/tools/layout.tsx        # 重要！
- app/lib/categories.config.ts
- tailwind.config.js
- このガイドファイル（最新版）
```

---

## 💡 開発の心得

### やるべきこと

```
✅ まず動くものを作る
✅ 視覚的ヒントを活用
✅ 即座のフィードバック
✅ モバイルファースト
✅ tools/layout.tsxとの整合性確認
✅ モーダルは必ず複数の閉じる方法を実装
✅ 文字色は必ずtext-gray-400以上
✅ セレクトボックスのオプションも見やすく
✅ guide.tsxでヘルプ提供（必要なら）
✅ TinyPNG/Remove.bgレベルのシンプルさを目指す
```

### やってはいけないこと

```
❌ 長い説明文
❌ 複雑な階層構造  
❌ 多すぎるオプション
❌ 実験的機能の使用
❌ パンくず・タイトルの重複実装
❌ 'use client'とmetadataの混在
❌ 閉じ方が不明なモーダル
❌ text-gray-500以下の重要テキスト
❌ 読めないセレクトボックスのオプション
❌ Google/TinyPNGより複雑なUI
```

---

## 🔄 更新履歴

| Ver | 日付 | 内容 |
|-----|------|------|
| 3.6 | 2025-01-24 | セレクトボックスの視認性ガイドライン追加 |
| 3.5 | 2025-01-XX | ツールガイドシステム追加・モーダル/文字色ガイドライン強化 |
| 3.4 | 2025-01-XX | レイアウト整合性・モーダル実装の注意点追加 |
| 3.3 | 2025-01-XX | PDF to Dataリファクタリング完了・レイアウト最適化 |
| 3.2 | 2025-01-XX | 世界標準の参考サイト追加（Google/TinyPNG/Remove.bg） |
| 3.1 | 2025-01-XX | 英語圏ターゲット明記・Simple English追加 |
| 3.0 | 2025-01-XX | 完全リファクタリング・シンプル化 |

---

## 最重要メッセージ

**「説明が必要 = 設計の失敗」**
**「レイアウトの重複 = 構造の理解不足」**
**「閉じ方不明のモーダル = UXの失敗」**
**「読めない文字 = デザインの失敗」**
**「見えないセレクトボックス = 基本の見落とし」**

このガイドを守れば、本当に誰でも使えるツールが作れます。
複雑さは開発者側で吸収し、ユーザーには究極のシンプルさを。

---

*このガイドをClaudeと共有して、効率的にツールを作成してください*