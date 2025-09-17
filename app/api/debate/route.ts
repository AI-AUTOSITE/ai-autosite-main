import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Anthropic APIクライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// シンプルなインメモリレート制限
const requestCounts = new Map<string, { count: number; resetTime: number }>()

// IPアドレスの取得
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

// レート制限チェック
function checkRateLimit(identifier: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now()
  const limit = 10 // 1時間あたり10回まで
  const window = 60 * 60 * 1000 // 1時間

  const record = requestCounts.get(identifier)
  
  // 古いレコードをクリーンアップ
  if (record && now > record.resetTime) {
    requestCounts.delete(identifier)
  }

  const current = requestCounts.get(identifier)
  
  if (!current) {
    requestCounts.set(identifier, { 
      count: 1, 
      resetTime: now + window 
    })
    return { allowed: true }
  }

  if (current.count >= limit) {
    const resetIn = Math.ceil((current.resetTime - now) / 1000 / 60) // 分単位
    return { allowed: false, resetIn }
  }

  current.count++
  return { allowed: true }
}

// スタイル別のプロンプト（簡略版）
const stylePrompts = {
  kind: `You are a supportive debate coach. Be encouraging and constructive.`,
  teacher: `You are a logical debate professor. Be educational and analytical.`,
  devil: `You are a sharp debate critic. Challenge arguments directly but respectfully.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { theme, message, style, user_token, is_new_session } = body

    // 基本的な入力検証
    if (!theme || !message || !style) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    // 入力サイズ制限
    if (theme.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Input too long. Please keep your arguments concise.' },
        { status: 400 }
      )
    }

    // IPベースのレート制限
    const clientIp = getClientIp(request)
    const ipIdentifier = `ip:${clientIp}`
    const ipCheck = checkRateLimit(ipIdentifier)
    
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Please try again in ${ipCheck.resetIn} minutes.` },
        { status: 429 }
      )
    }

    // ユーザートークンベースの追加制限（新セッション時）
    if (is_new_session && user_token) {
      const userIdentifier = `user:${user_token}`
      const userCheck = checkRateLimit(userIdentifier)
      
      if (!userCheck.allowed) {
        return NextResponse.json(
          { error: `You've started too many debates. Please try again later.` },
          { status: 429 }
        )
      }
    }

    // プロンプトの準備
    const roleInstruction = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.teacher
    
    const userPrompt = `Evaluate this debate argument and respond with:
1. A brief counterargument (2-3 sentences)
2. Scores (1-5) for each criterion
3. One constructive feedback point

Format your response exactly like this:
RESPONSE: [Your counterargument]
SCORES:
Logical Consistency: x/5
Persuasiveness: x/5
Factual Accuracy: x/5
Structural Coherence: x/5
Rebuttal Resilience: x/5
FEEDBACK: [One improvement suggestion]

Topic: "${theme}"
Argument: "${message}"`

    // Claude API呼び出し（Haikuモデル）
    const completion = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 800, // Haikuは短めでも十分
      temperature: 0.7,
      system: roleInstruction,
      messages: [
        { 
          role: 'user', 
          content: userPrompt 
        }
      ]
    })

    // レスポンスを取得
    const rawResponse = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : ''

    // レスポンスのパース
    let scores = {
      "Logical Consistency": 3,
      "Persuasiveness": 3,
      "Factual Accuracy": 3,
      "Structural Coherence": 3,
      "Rebuttal Resilience": 3
    }
    let feedback = "Keep practicing your argumentation skills!"

    // スコアを抽出
    const scoreMatches = Array.from(rawResponse.matchAll(
      /(Logical Consistency|Persuasiveness|Factual Accuracy|Structural Coherence|Rebuttal Resilience):\s*(\d)\/5/g
    ))
    for (const match of scoreMatches) {
      const key = match[1] as keyof typeof scores
      const value = parseInt(match[2], 10)
      if (value >= 1 && value <= 5) {
        scores[key] = value
      }
    }

    // フィードバックを抽出
    const feedbackMatch = rawResponse.match(/FEEDBACK:\s*([\s\S]+?)(?:\n|$)/)
    if (feedbackMatch) {
      feedback = feedbackMatch[1].trim().slice(0, 200) // 長さ制限
    }

    // 定期的にメモリをクリーンアップ（100リクエストごと）
    if (Math.random() < 0.01) {
      const now = Date.now()
      for (const [key, value] of requestCounts.entries()) {
        if (now > value.resetTime) {
          requestCounts.delete(key)
        }
      }
    }

    return NextResponse.json({
      reply: rawResponse,
      scores,
      feedback
    })

  } catch (error: any) {
    console.error('Debate API error:', error)
    
    // エラーメッセージの簡略化
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}