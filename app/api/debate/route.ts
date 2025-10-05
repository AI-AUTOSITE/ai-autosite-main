// app/api/debate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const requestCounts = new Map<string, { count: number; resetTime: number }>()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function checkRateLimit(identifier: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now()
  const limit = 10
  const window = 60 * 60 * 1000

  const record = requestCounts.get(identifier)
  
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
    const resetIn = Math.ceil((current.resetTime - now) / 1000 / 60)
    return { allowed: false, resetIn }
  }

  current.count++
  return { allowed: true }
}

const stylePrompts = {
  kind: `You are a supportive debate coach. Be encouraging, constructive, and positive while providing honest feedback. Focus on strengths first, then gently point out areas for improvement.`,
  teacher: `You are a logical debate professor. Be educational, analytical, and thorough. Provide detailed reasoning for your scores and help the debater understand logical principles.`,
  devil: `You are a sharp debate critic playing devil's advocate. Challenge arguments directly and rigorously, but remain respectful and educational. Your goal is to strengthen the debater's skills through tough but fair critique.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { theme, message, style, user_token, is_new_session } = body

    if (!theme || !message || !style) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    if (theme.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Input too long. Please keep your arguments concise.' },
        { status: 400 }
      )
    }

    const clientIp = getClientIp(request)
    const ipIdentifier = `ip:${clientIp}`
    const ipCheck = checkRateLimit(ipIdentifier)
    
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Please try again in ${ipCheck.resetIn} minutes.` },
        { status: 429 }
      )
    }

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

    const roleInstruction = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.teacher
    
const userPrompt = `Evaluate this debate argument CRITICALLY and provide honest scores.

Topic: "${theme}"
Argument: "${message}"

IMPORTANT: Be strict in your evaluation. Poor arguments should receive LOW scores (1-2/5).

Provide your response in this EXACT format:

RESPONSE: [Your 2-4 sentence counterargument]

SCORES:
Logical Consistency: x/5 - [Why this score]
Persuasiveness: x/5 - [Why this score]
Factual Accuracy: x/5 - [Why this score]
Structural Coherence: x/5 - [Why this score]
Rebuttal Resilience: x/5 - [Why this score]

FEEDBACK: [One specific improvement suggestion]

SCORING GUIDELINES:
1/5 = Severely flawed (major logical errors, unsupported claims, incoherent)
2/5 = Poor (multiple issues, weak reasoning, lacks evidence)
3/5 = Mediocre (some valid points but significant weaknesses)
4/5 = Good (solid argument with minor issues)
5/5 = Excellent (well-reasoned, supported, coherent)`

    const completion = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // 最新のHaiku
      max_tokens: 1500, // より詳細な評価用
      temperature: 0.7,
      system: roleInstruction,
      messages: [
        { 
          role: 'user', 
          content: userPrompt 
        }
      ]
    })

    const rawResponse = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : ''

    let scores = {
      "Logical Consistency": 3,
      "Persuasiveness": 3,
      "Factual Accuracy": 3,
      "Structural Coherence": 3,
      "Rebuttal Resilience": 3
    }
    
    let scoreExplanations: Record<string, string> = {}
    let feedback = "Keep practicing your argumentation skills!"

    // スコアと説明を抽出
// スコアを抽出（よりシンプルに）
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

// 説明を別途抽出
const explanationPattern = /(Logical Consistency|Persuasiveness|Factual Accuracy|Structural Coherence|Rebuttal Resilience):\s*\d\/5\s*-\s*([^\n]+)/g
const explanationMatches = Array.from(rawResponse.matchAll(explanationPattern))

for (const match of explanationMatches) {
  const key = match[1] as keyof typeof scores
  scoreExplanations[key] = match[2].trim()
}

    const feedbackMatch = rawResponse.match(/FEEDBACK:\s*([\s\S]+?)(?:\n\n|$)/)
    if (feedbackMatch) {
      feedback = feedbackMatch[1].trim().slice(0, 300)
    }

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
      scoreExplanations,
      feedback
    })

  } catch (error: any) {
    console.error('Debate API error:', error)
    
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