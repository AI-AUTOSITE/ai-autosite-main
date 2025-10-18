// app/api/spam-email-checker/route.ts
import { NextRequest, NextResponse } from 'next/server'

// ==========================================
// 型定義
// ==========================================
interface APIError extends Error {
  status?: number
  provider?: string
}

interface RiskIssue {
  type: string
  severity: 'high' | 'medium' | 'low'
  message: string
  detail: string
}

interface AIAnalysisResponse {
  riskLevel: 'safe' | 'caution' | 'danger'
  issues: RiskIssue[]
  recommendation: string
  safetyScore: number
  confidence: number
}

// ==========================================
// レート制限
// ==========================================
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

// ==========================================
// キャッシュ管理
// ==========================================
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3600 * 1000 // 1 hour

function createHash(input: string): string {
  return Buffer.from(input).toString('base64').substring(0, 32)
}

// ==========================================
// Claude API - メイン処理
// ==========================================
async function analyzeWithClaude(emailAddress: string): Promise<AIAnalysisResponse> {
  const prompt = `You are an email security expert. Analyze this email address for potential phishing or spam indicators.

Email Address: ${emailAddress}

Analyze the following aspects:
1. Domain reputation and legitimacy
2. Sender patterns (suspicious keywords, character substitutions)
3. Domain age indicators (if detectable from format)
4. Business email vs free email service usage
5. Any other red flags

Respond ONLY with valid JSON in this exact format:
{
  "riskLevel": "safe" | "caution" | "danger",
  "safetyScore": 0-100,
  "confidence": 0-100,
  "issues": [
    {
      "type": "string",
      "severity": "high" | "medium" | "low",
      "message": "Brief message",
      "detail": "Detailed explanation"
    }
  ],
  "recommendation": "What the user should do"
}

CRITICAL: Output ONLY the JSON object. No markdown, no backticks, no additional text.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
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
    let responseText = data.content[0].text

    // Strip markdown formatting if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const result = JSON.parse(responseText)
    return result

  } catch (error) {
    console.error('Claude API error:', error)
    throw error
  }
}

// ==========================================
// ローカルフォールバック処理
// ==========================================
function localAnalysis(emailAddress: string): AIAnalysisResponse {
  console.warn('⚠️ Using local fallback analysis')

  // 簡易的なルールベース分析
  const domain = emailAddress.toLowerCase().split('@')[1] || ''
  const issues: RiskIssue[] = []
  let safetyScore = 50 // デフォルトは中程度

  // 基本的なパターンチェック
  if (domain.includes('secure') || domain.includes('verify')) {
    issues.push({
      type: 'suspicious-keywords',
      severity: 'medium',
      message: 'Suspicious keywords in domain',
      detail: 'Domain contains words often used in phishing attempts'
    })
    safetyScore -= 20
  }

  return {
    riskLevel: safetyScore >= 60 ? 'caution' : 'danger',
    issues,
    recommendation: 'AI analysis unavailable. Exercise caution and verify sender through alternative channels.',
    safetyScore,
    confidence: 40 // 低信頼度
  }
}

// ==========================================
// リトライロジック
// ==========================================
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
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
// 入力検証
// ==========================================
function validateInput(emailAddress: string): { valid: boolean; error?: string } {
  // 長さチェック
  if (emailAddress.length > 320) {
    return { valid: false, error: 'Email address too long' }
  }

  // 基本的なフォーマットチェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailAddress)) {
    return { valid: false, error: 'Invalid email format' }
  }

  // 危険な文字チェック
  const dangerousChars = ['<', '>', '"', '\\', '{', '}', '|', '^', '`']
  if (dangerousChars.some(char => emailAddress.includes(char))) {
    return { valid: false, error: 'Invalid characters detected' }
  }

  return { valid: true }
}

// ==========================================
// BOT検出
// ==========================================
function detectBot(request: NextRequest): boolean {
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

// ==========================================
// メールアドレスマスキング関数（追加）
// ==========================================
function maskEmail(email: string): string {
  try {
    const [local, domain] = email.split('@')
    if (!domain) return '***@***'
    
    // ローカル部分のマスキング
    const maskedLocal = local.length > 3 
      ? local.substring(0, 3) + '***'
      : '***'
    
    // ドメイン部分のマスキング（最初の3文字のみ表示）
    const domainParts = domain.split('.')
    const maskedDomain = domainParts.length > 1
      ? domainParts[0].substring(0, 3) + '***.' + domainParts.slice(1).join('.')
      : domain.substring(0, 3) + '***'
    
    return `${maskedLocal}@${maskedDomain}`
  } catch {
    return '***@***'
  }
}


// ==========================================
// メインハンドラー
// ==========================================
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // IPアドレス取得
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // BOT検出
    if (detectBot(request)) {
      return NextResponse.json(
        { error: 'Automated requests are not allowed' },
        { status: 403 }
      )
    }

    // レート制限チェック
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

    // リクエストボディ取得
    const body = await request.json()
    const { emailAddress } = body

    // 入力検証
    const validation = validateInput(emailAddress)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // キャッシュチェック
    const cacheKey = createHash(emailAddress)
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
  console.log('✅ Cache hit for:', maskEmail(emailAddress))
  return NextResponse.json({
    ...cached.data,
    cached: true,
    processingTime: Date.now() - startTime
  })
}

    let result: AIAnalysisResponse
    let method: 'claude' | 'local' = 'claude'

    // ==========================================
    // AI分析実行
    // ==========================================

    // Claude API
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        result = await retryWithBackoff(
          () => analyzeWithClaude(emailAddress),
          2
        )
        method = 'claude'
        console.log('✅ Claude API analysis succeeded')
      } catch (error) {
        console.error('❌ Claude API failed:', error)
        // フォールバック
        result = localAnalysis(emailAddress)
        method = 'local'
      }
    } else {
      // APIキーがない場合
      console.warn('⚠️ No API key configured, using local analysis')
      result = localAnalysis(emailAddress)
      method = 'local'
    }

    // レスポンスデータ
    const responseData = {
      ...result,
      method,
      cached: false,
      processingTime: Date.now() - startTime
    }

    // キャッシュ保存
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    })

    // ログ記録
    console.log('📊 Analysis completed:', {
  email: maskEmail(emailAddress),
  method,
  riskLevel: result.riskLevel,
  confidence: result.confidence,
  processingTime: responseData.processingTime
})

    return NextResponse.json(responseData, {
      headers: {
        'X-Tool-Type': 'AI',
        'X-AI-Provider': method,
        'X-Processing-Method': method === 'claude' ? 'ai' : 'local',
        'X-Processing-Time': `${responseData.processingTime}ms`,
        'Cache-Control': 'private, max-age=3600'
      }
    })

  } catch (error) {
    console.error('Fatal error in spam checker API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to analyze email address. Please try again.'
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
      model: 'claude-3-haiku-20240307'
    },
    local: {
      configured: true,
      model: 'rules-based'
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