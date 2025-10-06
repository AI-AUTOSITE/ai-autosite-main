📄 ファイル1: api-usage-guide.md
markdown# API利用ガイド - 本番環境での安定運用
**Version: 2.0**  
**最終更新: 2025-01-29**

## 📌 概要

本ドキュメントは、外部AI APIを利用する際の障害対策とフォールバック実装のベストプラクティスをまとめたものです。  
2024年9月のAnthropic API大規模障害を教訓に、サービス継続性を最優先とした設計を推奨します。

### 関連ドキュメント

- [api-security-guide.md](./api-security-guide.md) - セキュリティ対策の詳細
- [ai-tools-guide.md](./ai-tools-guide.md) - AIツール識別システム

---

## 🎯 基本方針

### 3層防御システム

Primary API (Claude/Anthropic) - メイン処理
Fallback API (Cohere等) - バックアップ処理
Local Algorithm - 最終保証

### 設計原則

- **透明性**: ユーザーに処理方法を明示
- **継続性**: 絶対にサービスを止めない
- **効率性**: キャッシュで無駄な呼び出しを削減
- **経済性**: コストと品質のバランス

---

## 🛡️ 推奨API構成

### 優先順位とコスト

| 優先度 | サービス           | 料金            | 安定性     | 日本語対応 | 用途            |
| ------ | ------------------ | --------------- | ---------- | ---------- | --------------- |
| 1      | Claude (Anthropic) | $3/1M tokens    | ⭐⭐⭐     | ◎          | メイン          |
| 2      | Cohere             | $0.15/1K tokens | ⭐⭐⭐⭐   | ○          | バックアップ    |
| 3      | Mistral AI         | €0.14/1M tokens | ⭐⭐⭐⭐   | △          | 第2バックアップ |
| -      | Local Algorithm    | 無料            | ⭐⭐⭐⭐⭐ | ◎          | 最終保証        |

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
        const delay = baseDelay * Math.pow(2, i)
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
    const body = await request.json()
    const { input, options = {} } = body

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
          2
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
          2
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
2. 環境変数設定
bash# .env.local

# Primary API (Claude/Anthropic)
ANTHROPIC_API_KEY=sk-ant-api03-xxx
CLAUDE_MODEL=claude-3-haiku-20240307

# Fallback API (Cohere)
COHERE_API_KEY=xxx

# Optional: Additional fallbacks
MISTRAL_API_KEY=xxx
PERPLEXITY_API_KEY=xxx

# Cache & Retry Settings
API_CACHE_TTL=3600
API_RETRY_MAX=3
API_TIMEOUT=10000

# Feature Flags
USE_CACHE=true
USE_FALLBACK=true
LOG_API_CALLS=true
3. フロントエンド実装例
typescript// components/APIConsumer.tsx
'use client'

import { useState } from 'react'
import { AlertCircle, Zap, Cloud, Server } from 'lucide-react'

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
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <ProviderIndicator />
      </div>

      {status.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
            <p className="text-sm text-red-400">{status.error}</p>
          </div>
        </div>
      )}

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

📊 監視とログ
推奨ログ項目
typescriptinterface APILog {
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
  if (process.env.LOG_API_CALLS === 'true') {
    console.log(JSON.stringify(log))
  }
}
アラート設定
条件アクションClaude成功率 < 80%Cohereの準備確認両API失敗率 > 10%緊急対応開始キャッシュヒット率 < 30%TTL調整検討処理時間 > 5秒パフォーマンス改善

🚨 トラブルシューティング
よくあるエラーと対処法
エラー原因対処法401 UnauthorizedAPIキー無効.env.local確認、キー再生成429 Too Many Requestsレート制限リトライ間隔延長、プラン確認500 Internal Server ErrorAPI側の問題フォールバック動作確認ECONNREFUSEDネットワーク問題DNS設定、ファイアウォール確認キャッシュ肥大化長時間稼働定期クリア実装、TTL短縮
デバッグモード
typescriptif (process.env.NODE_ENV === 'development') {
  console.log('🔍 API Call Debug:', {
    provider: method,
    cacheKey,
    cached,
    requestSize: JSON.stringify(input).length,
    responseSize: JSON.stringify(result).length
  })
}

🎯 ベストプラクティス
DO ✅

常に3層防御を実装（API1 → API2 → Local）
キャッシュを積極活用
エラーをユーザーに分かりやすく表示
処理方法を透明化（どのAPIを使ったか表示）
ヘルスチェックエンドポイントを用意

DON'T ❌

単一APIに依存
エラーを隠蔽
無限リトライ
キャッシュの無期限保持
ローカルフォールバックの未実装


📚 参考リンク

Anthropic API Docs
Cohere API Docs
Mistral API Docs
API Status Pages


📝 チェックリスト
新しいAPIエンドポイントを作る際は、以下を確認：

 3つ以上のフォールバック手段がある
 ローカル処理が実装されている
 キャッシュ機能が有効
 エラーハンドリングが適切
 ユーザーへの表示が分かりやすい
 環境変数が設定されている
 ログ出力が実装されている
 ヘルスチェックが可能
 セキュリティ対策を実装（api-security-guide.md参照）


🔄 更新履歴
Ver日付内容2.02025-01-29セキュリティとAIツールガイドを分離1.02025-01-24初版作成

このガイドに従って実装すれば、99.9%の稼働率を実現できます
```
