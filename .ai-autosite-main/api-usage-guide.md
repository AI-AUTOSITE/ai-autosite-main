# API利用ガイド - 本番環境での安定運用
**Version: 1.0**  
**最終更新: 2025-01-24**

## 📌 概要

本ドキュメントは、外部AI APIを利用する際の障害対策とフォールバック実装のベストプラクティスをまとめたものです。  
2024年9月のAnthropic API大規模障害を教訓に、サービス継続性を最優先とした設計を推奨します。

---

## 🎯 基本方針

### 3層防御システム

```
1. Primary API (Claude/Anthropic) - メイン処理
2. Fallback API (Cohere等) - バックアップ処理  
3. Local Algorithm - 最終保証
```

### 設計原則

- **透明性**: ユーザーに処理方法を明示
- **継続性**: 絶対にサービスを止めない
- **効率性**: キャッシュで無駄な呼び出しを削減
- **経済性**: コストと品質のバランス

---

## 🛡️ 推奨API構成

### 優先順位とコスト

| 優先度 | サービス | 料金 | 安定性 | 日本語対応 | 用途 |
|--------|----------|------|--------|------------|------|
| 1 | Claude (Anthropic) | $3/1M tokens | ⭐⭐⭐ | ◎ | メイン |
| 2 | Cohere | $0.15/1K tokens | ⭐⭐⭐⭐ | ○ | バックアップ |
| 3 | Mistral AI | €0.14/1M tokens | ⭐⭐⭐⭐ | △ | 第2バックアップ |
| - | Local Algorithm | 無料 | ⭐⭐⭐⭐⭐ | ◎ | 最終保証 |

### GPTを使わない理由

- ユーザーの明確な要望
- 代替サービスが十分に存在
- コスト面でも他に選択肢あり

---

## 💻 実装テンプレート

### 1. 基本構造（TypeScript）

```typescript
// app/api/[your-api]/route.ts
import { NextRequest, NextResponse } from 'next/server'

// ==========================================
// 型定義
// ==========================================
interface APIError extends Error {
  status?: number
  provider?: string
}

interface APIResponse<T> {
  data: T
  method: 'claude' | 'cohere' | 'mistral' | 'local'
  cached?: boolean
  processingTime?: number
}

// ==========================================
// キャッシュ管理
// ==========================================
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = parseInt(process.env.API_CACHE_TTL || '3600') * 1000

function createHash(input: string): string {
  // 簡易ハッシュ生成
  return Buffer.from(input).toString('base64').substring(0, 32)
}

// ==========================================
// API実装（各サービス用）
// ==========================================

// Claude (Anthropic)
async function claudeProcess(input: any, options: any): Promise<any> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
      max_tokens: options.maxTokens || 1000,
      messages: [{
        role: 'user',
        content: input
      }]
    }),
  })

  if (!response.ok) {
    const error = new Error(`Claude API error: ${response.status}`) as APIError
    error.status = response.status
    error.provider = 'claude'
    throw error
  }

  const data = await response.json()
  return data.content[0].text
}

// Cohere
async function cohereProcess(input: any, options: any): Promise<any> {
  const response = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command',
      prompt: input,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.3,
    }),
  })

  if (!response.ok) {
    const error = new Error(`Cohere API error: ${response.status}`) as APIError
    error.status = response.status
    error.provider = 'cohere'
    throw error
  }

  const data = await response.json()
  return data.generations[0].text
}

// ローカル処理（必ず実装）
function localProcess(input: any, options: any): any {
  // ツールに応じた最低限の処理
  // 例: テキスト要約、画像リサイズ、データ変換など
  console.warn('⚠️ Using local fallback processing')
  return {
    result: 'Processed locally',
    warning: 'Limited functionality due to API unavailability'
  }
}

// ==========================================
// リトライロジック
// ==========================================
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.error(`Attempt ${i + 1}/${maxRetries} failed:`, {
        error: error instanceof Error ? error.message : error,
        provider: (error as APIError).provider
      })
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

// ==========================================
// メインハンドラー
// ==========================================
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // リクエスト解析
    const body = await request.json()
    const { input, options = {} } = body
    
    // バリデーション
    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      )
    }
    
    // キャッシュチェック
    const cacheKey = createHash(JSON.stringify({ input, options }))
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('✅ Cache hit')
      return NextResponse.json({
        ...cached.data,
        cached: true,
        processingTime: Date.now() - startTime
      } as APIResponse<any>)
    }
    
    let result: any
    let method: APIResponse<any>['method'] = 'claude'
    
    // ==========================================
    // フォールバックチェーン実行
    // ==========================================
    
    // 1. Claude (Anthropic)
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        result = await retryWithBackoff(
          () => claudeProcess(input, options),
          2 // Claudeは2回まで
        )
        method = 'claude'
        console.log('✅ Claude API succeeded')
      } catch (error) {
        console.error('❌ Claude API failed completely:', error)
      }
    }
    
    // 2. Cohere
    if (!result && process.env.COHERE_API_KEY) {
      try {
        result = await retryWithBackoff(
          () => cohereProcess(input, options),
          2 // Cohereも2回まで
        )
        method = 'cohere'
        console.log('✅ Cohere API succeeded (fallback)')
      } catch (error) {
        console.error('❌ Cohere API failed completely:', error)
      }
    }
    
    // 3. ローカル処理（最終手段）
    if (!result) {
      result = localProcess(input, options)
      method = 'local'
      console.log('⚠️ Using local processing (final fallback)')
    }
    
    // 成功結果をキャッシュ
    const responseData = {
      data: result,
      method,
      cached: false,
      processingTime: Date.now() - startTime
    }
    
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    })
    
    // レスポンス返却
    return NextResponse.json(responseData, {
      headers: {
        'X-Processing-Method': method,
        'X-Processing-Time': `${responseData.processingTime}ms`,
        'Cache-Control': 'private, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('Fatal error in API route:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// ==========================================
// ヘルスチェックエンドポイント
// ==========================================
export async function GET() {
  const providers = {
    claude: {
      configured: !!process.env.ANTHROPIC_API_KEY,
      model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307'
    },
    cohere: {
      configured: !!process.env.COHERE_API_KEY,
      model: 'command'
    },
    local: {
      configured: true,
      model: 'fallback'
    }
  }
  
  return NextResponse.json({
    status: 'operational',
    providers,
    cache: {
      size: cache.size,
      ttl: CACHE_TTL
    },
    timestamp: new Date().toISOString()
  })
}
```

### 2. 環境変数設定

```bash
# .env.local

# Primary API (Claude/Anthropic)
ANTHROPIC_API_KEY=sk-ant-api03-xxx
CLAUDE_MODEL=claude-3-haiku-20240307  # 最も安定

# Fallback API (Cohere)
COHERE_API_KEY=xxx

# Optional: Additional fallbacks
MISTRAL_API_KEY=xxx
PERPLEXITY_API_KEY=xxx

# Cache & Retry Settings
API_CACHE_TTL=3600        # キャッシュ有効期限（秒）
API_RETRY_MAX=3           # 最大リトライ回数
API_TIMEOUT=10000         # タイムアウト（ミリ秒）

# Feature Flags
USE_CACHE=true
USE_FALLBACK=true
LOG_API_CALLS=true
```

### 3. フロントエンド実装例

```typescript
// components/APIConsumer.tsx
'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Zap, Cloud, Server, CheckCircle } from 'lucide-react'

interface APIStatus {
  method: 'claude' | 'cohere' | 'local' | null
  isLoading: boolean
  error: string | null
  processingTime?: number
}

export default function APIConsumer() {
  const [status, setStatus] = useState<APIStatus>({
    method: null,
    isLoading: false,
    error: null
  })

  const callAPI = async (input: any) => {
    setStatus({ ...status, isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/your-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'API call failed')
      }
      
      setStatus({
        method: data.method,
        isLoading: false,
        error: null,
        processingTime: data.processingTime
      })
      
      return data
      
    } catch (error) {
      setStatus({
        method: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: undefined
      })
    }
  }

  // プロバイダー情報の表示
  const ProviderIndicator = () => {
    if (!status.method) return null
    
    const providers = {
      claude: {
        icon: <Zap className="w-4 h-4 text-cyan-400" />,
        label: 'Claude AI',
        color: 'text-cyan-400'
      },
      cohere: {
        icon: <Cloud className="w-4 h-4 text-purple-400" />,
        label: 'Cohere AI',
        color: 'text-purple-400'
      },
      local: {
        icon: <Server className="w-4 h-4 text-yellow-400" />,
        label: 'Local Processing',
        color: 'text-yellow-400'
      }
    }
    
    const provider = providers[status.method]
    
    return (
      <div className="flex items-center gap-2 text-sm">
        {provider.icon}
        <span className={provider.color}>{provider.label}</span>
        {status.processingTime && (
          <span className="text-gray-400">
            ({status.processingTime}ms)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* API Status */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <ProviderIndicator />
      </div>
      
      {/* Error Display */}
      {status.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
            <p className="text-sm text-red-400">{status.error}</p>
          </div>
        </div>
      )}
      
      {/* Local Fallback Warning */}
      {status.method === 'local' && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-400">
            Using simplified processing. Results may be limited.
          </p>
        </div>
      )}
    </div>
  )
}
```

---

## 🔒 セキュリティ対策（必須実装）

### BOT対策・いたずら防止

#### 1. レート制限の実装

```typescript
// app/api/[your-api]/route.ts に追加

// IPベースのレート制限
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = {
  maxRequests: 10,      // 最大リクエスト数
  windowMs: 60 * 1000,  // 時間窓（1分）
  blockDuration: 5 * 60 * 1000  // ブロック時間（5分）
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimiter.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    // ブロック期間を延長
    userLimit.resetTime = now + RATE_LIMIT.blockDuration
    return false
  }
  
  userLimit.count++
  return true
}

// ハンドラー内で使用
export async function POST(request: NextRequest) {
  // IPアドレス取得
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  // レート制限チェック
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': '300',  // 5分
          'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': '0'
        }
      }
    )
  }
  
  // 通常処理...
}
```

#### 2. ファイルサイズ制限

```typescript
// 共通設定
const FILE_LIMITS = {
  maxSize: 10 * 1024 * 1024,  // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFiles: 5
}

// Vercel設定（vercel.json）
{
  "functions": {
    "app/api/*/route.ts": {
      "maxDuration": 30,  // 最大実行時間30秒
      "memory": 1024      // メモリ1GB
    }
  },
  "api": {
    "bodyParser": {
      "sizeLimit": "10mb"
    }
  }
}
```

#### 3. reCAPTCHA v3 実装

```typescript
// フロントエンド
'use client'
import Script from 'next/script'

export default function ToolWithCaptcha() {
  const [recaptchaToken, setRecaptchaToken] = useState('')
  
  const executeRecaptcha = async () => {
    if (typeof window.grecaptcha === 'undefined') return null
    
    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: 'submit' }
      )
      return token
    } catch {
      return null
    }
  }
  
  const handleSubmit = async () => {
    // reCAPTCHA実行
    const token = await executeRecaptcha()
    if (!token) {
      alert('Security verification failed. Please refresh and try again.')
      return
    }
    
    // APIコール
    const response = await fetch('/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: formData,
        recaptchaToken: token
      })
    })
  }
  
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      {/* UIコンポーネント */}
    </>
  )
}

// バックエンド検証
async function verifyRecaptcha(token: string): Promise<boolean> {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token
    })
  })
  
  const data = await response.json()
  return data.success && data.score > 0.5  // スコア閾値
}
```

#### 4. 一時的なブロックリスト

```typescript
// 悪意のあるIPを一時的にブロック
const blacklist = new Set<string>()
const BLACKLIST_DURATION = 60 * 60 * 1000  // 1時間

function isBlacklisted(ip: string): boolean {
  return blacklist.has(ip)
}

function addToBlacklist(ip: string) {
  blacklist.add(ip)
  setTimeout(() => blacklist.delete(ip), BLACKLIST_DURATION)
}

// 異常なパターンを検知
function detectAbnormalBehavior(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  
  // 既知のBOT UserAgent
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /axios/i
  ]
  
  // 必要に応じてBOTを許可する場合
  const allowedBots = [
    /googlebot/i,  // Google
    /bingbot/i,    // Bing
  ]
  
  const isBot = botPatterns.some(p => p.test(userAgent))
  const isAllowedBot = allowedBots.some(p => p.test(userAgent))
  
  return isBot && !isAllowedBot
}
```

#### 5. CORS設定

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // APIルートのみ適用
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_BASE_URL,
      'https://yourdomain.com'
    ]
    
    // CORS チェック
    if (origin && !allowedOrigins.includes(origin)) {
      return new NextResponse(null, {
        status: 403,
        statusText: 'Forbidden'
      })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

#### 6. 使用量制限（無料ユーザー向け）

```typescript
// 日次制限の実装
interface UsageTracker {
  [key: string]: {  // IPまたはユーザーID
    count: number
    resetAt: number
  }
}

const dailyUsage: UsageTracker = {}
const DAILY_LIMIT = 50  // 1日50回まで

function checkDailyLimit(identifier: string): boolean {
  const now = Date.now()
  const today = new Date().setHours(0, 0, 0, 0)
  const tomorrow = today + 24 * 60 * 60 * 1000
  
  const usage = dailyUsage[identifier]
  
  if (!usage || now > usage.resetAt) {
    dailyUsage[identifier] = {
      count: 1,
      resetAt: tomorrow
    }
    return true
  }
  
  if (usage.count >= DAILY_LIMIT) {
    return false
  }
  
  usage.count++
  return true
}
```

### 環境変数（セキュリティ用）

```bash
# .env.local に追加

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_BLOCK_DURATION_MS=300000

# Usage Limits
DAILY_REQUEST_LIMIT=50
MAX_FILE_SIZE_MB=10

# Security
ALLOWED_ORIGINS=https://yourdomain.com
ENABLE_BOT_PROTECTION=true
ENABLE_RECAPTCHA=true
```

### セキュリティチェックリスト

- [ ] レート制限実装
- [ ] ファイルサイズ制限
- [ ] reCAPTCHA統合（本番環境）
- [ ] CORS設定
- [ ] BOT検出
- [ ] 日次使用量制限
- [ ] IPブロックリスト
- [ ] エラーメッセージの抽象化（詳細を隠す）
- [ ] ログ記録（異常な活動の監視）

---

## 📊 監視とログ

### 推奨ログ項目

```typescript
// ログ収集例
interface APILog {
  timestamp: string
  method: string
  success: boolean
  processingTime: number
  cacheHit: boolean
  inputSize: number
  outputSize: number
  error?: string
}

function logAPICall(log: APILog) {
  // 本番環境ではDatadog, New Relic等に送信
  if (process.env.LOG_API_CALLS === 'true') {
    console.log(JSON.stringify(log))
  }
}
```

### アラート設定

| 条件 | アクション |
|------|-----------|
| Claude成功率 < 80% | Cohereの準備確認 |
| 両API失敗率 > 10% | 緊急対応開始 |
| キャッシュヒット率 < 30% | TTL調整検討 |
| 処理時間 > 5秒 | パフォーマンス改善 |

---

## 🚨 トラブルシューティング

### よくあるエラーと対処法

| エラー | 原因 | 対処法 |
|--------|------|--------|
| `401 Unauthorized` | APIキー無効 | .env.local確認、キー再生成 |
| `429 Too Many Requests` | レート制限 | リトライ間隔延長、プラン確認 |
| `500 Internal Server Error` | API側の問題 | フォールバック動作確認 |
| `ECONNREFUSED` | ネットワーク問題 | DNS設定、ファイアウォール確認 |
| キャッシュ肥大化 | 長時間稼働 | 定期クリア実装、TTL短縮 |

### デバッグモード

```typescript
// 開発環境でのデバッグ
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 API Call Debug:', {
    provider: method,
    cacheKey,
    cached,
    requestSize: JSON.stringify(input).length,
    responseSize: JSON.stringify(result).length
  })
}
```

---

## 🎯 ベストプラクティス

### DO ✅

- 常に3層防御を実装（API1 → API2 → Local）
- キャッシュを積極活用
- エラーをユーザーに分かりやすく表示
- 処理方法を透明化（どのAPIを使ったか表示）
- ヘルスチェックエンドポイントを用意

### DON'T ❌

- 単一APIに依存
- エラーを隠蔽
- 無限リトライ
- キャッシュの無期限保持
- ローカルフォールバックの未実装

---

## 📚 参考リンク

- [Anthropic API Docs](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Cohere API Docs](https://docs.cohere.com/docs)
- [Mistral API Docs](https://docs.mistral.ai/)
- [API Status Pages](https://status.anthropic.com/)

---

## 📝 チェックリスト

新しいAPIエンドポイントを作る際は、以下を確認：

- [ ] 3つ以上のフォールバック手段がある
- [ ] ローカル処理が実装されている
- [ ] キャッシュ機能が有効
- [ ] エラーハンドリングが適切
- [ ] ユーザーへの表示が分かりやすい
- [ ] 環境変数が設定されている
- [ ] ログ出力が実装されている
- [ ] ヘルスチェックが可能

---

## 🔄 更新履歴

| Ver | 日付 | 内容 |
|-----|------|------|
| 1.0 | 2025-01-24 | 初版作成（Claude > Cohere > Local の優先順位） |

---

*このガイドに従って実装すれば、99.9%の稼働率を実現できます*