# 📄 ファイル2: api-security-guide.md

````markdown
# API セキュリティガイド

**Version: 1.0**  
**最終更新: 2025-01-29**

## 📌 概要

本ドキュメントは、API実装時のセキュリティ対策をまとめたものです。
BOT対策、レート制限、入力検証など、本番環境で必須の実装を網羅しています。

### 関連ドキュメント

- [api-usage-guide.md](./api-usage-guide.md) - 基本実装ガイド
- [ai-tools-guide.md](./ai-tools-guide.md) - AIツール固有のセキュリティ

---

## 🔒 セキュリティ対策（必須実装）

### 1. レート制限の実装

```typescript
// app/api/[your-api]/route.ts に追加

// IPベースのレート制限
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60 * 1000,
  blockDuration: 5 * 60 * 1000
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
    userLimit.resetTime = now + RATE_LIMIT.blockDuration
    return false
  }

  userLimit.count++
  return true
}

// ハンドラー内で使用
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '300',
          'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': '0'
        }
      }
    )
  }

  // 通常処理...
}
2. ファイルサイズ制限
typescriptconst FILE_LIMITS = {
  maxSize: 10 * 1024 * 1024,  // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFiles: 5
}

// Vercel設定（vercel.json）
{
  "functions": {
    "app/api/*/route.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "api": {
    "bodyParser": {
      "sizeLimit": "10mb"
    }
  }
}
3. reCAPTCHA v3 実装
typescript// フロントエンド
'use client'
import Script from 'next/script'

export default function ToolWithCaptcha() {
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
    const token = await executeRecaptcha()
    if (!token) {
      alert('Security verification failed. Please refresh and try again.')
      return
    }

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
  return data.success && data.score > 0.5
}
4. 一時的なブロックリスト
typescriptconst blacklist = new Set<string>()
const BLACKLIST_DURATION = 60 * 60 * 1000  // 1時間

function isBlacklisted(ip: string): boolean {
  return blacklist.has(ip)
}

function addToBlacklist(ip: string) {
  blacklist.add(ip)
  setTimeout(() => blacklist.delete(ip), BLACKLIST_DURATION)
}

function detectAbnormalBehavior(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''

  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /axios/i
  ]

  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
  ]

  const isBot = botPatterns.some(p => p.test(userAgent))
  const isAllowedBot = allowedBots.some(p => p.test(userAgent))

  return isBot && !isAllowedBot
}
5. CORS設定
typescript// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_BASE_URL,
      'https://yourdomain.com'
    ]

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
6. 使用量制限（無料ユーザー向け）
typescriptinterface UsageTracker {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const dailyUsage: UsageTracker = {}
const DAILY_LIMIT = 50

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

🔐 環境変数（セキュリティ用）
bash# .env.local に追加

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

✅ セキュリティチェックリスト
本番デプロイ前の確認事項：

 レート制限実装
 ファイルサイズ制限
 reCAPTCHA統合（本番環境）
 CORS設定
 BOT検出
 日次使用量制限
 IPブロックリスト
 エラーメッセージの抽象化（詳細を隠す）
 ログ記録（異常な活動の監視）
 環境変数の暗号化
 HTTPS強制
 CSP（Content Security Policy）設定


🎯 脅威モデル
想定される攻撃
攻撃種類対策優先度DDoS攻撃レート制限、Vercel保護高BOT攻撃User-Agent検証、reCAPTCHA高API悪用使用量制限、IP制限高XSS攻撃入力サニタイゼーション中CSRF攻撃トークン検証中データ漏洩HTTPS、適切なCORS高

📊 モニタリング
セキュリティログ
typescriptinterface SecurityLog {
  timestamp: string
  ip: string
  userAgent: string
  endpoint: string
  blocked: boolean
  reason?: string
}

function logSecurityEvent(log: SecurityLog) {
  console.warn('🔒 Security Event:', JSON.stringify(log))

  // 本番環境では外部サービスに送信
  if (process.env.NODE_ENV === 'production') {
    // Datadog, Sentry等に送信
  }
}
アラート設定
条件アクション同一IPから100req/min自動ブロックreCAPTCHAスコア < 0.3手動確認不正なUser-Agent検出ログ記録異常なファイルサイズリクエスト拒否

🔄 更新履歴
Ver日付内容1.02025-01-29初版作成（api-usage-guideから分離）

セキュリティは継続的な改善が必要です。定期的にこのガイドを見直してください。
```
````
