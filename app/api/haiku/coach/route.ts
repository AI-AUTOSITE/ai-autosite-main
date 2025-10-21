// app/api/haiku/coach/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { countSyllablesInLine } from '../../../tools/haiku-generator/lib/syllable-counter'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 60 * 1000,
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
    return false
  }
  
  userLimit.count++
  return true
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many coaching requests. Please wait a minute.' },
        { status: 429 }
      )
    }
    
    const { lines, coachingType } = await request.json()
    
    if (!lines || lines.length !== 3) {
      return NextResponse.json(
        { error: 'Three lines required' },
        { status: 400 }
      )
    }
    
    const syllables = lines.map((line: string) => countSyllablesInLine(line))
    const isValid = syllables[0] === 5 && syllables[1] === 7 && syllables[2] === 5
    
    const suggestions: string[] = []
    if (!isValid) {
      if (syllables[0] !== 5) {
        const diff = 5 - syllables[0]
        suggestions.push(`Line 1: ${diff > 0 ? 'add' : 'remove'} ${Math.abs(diff)} syllable(s)`)
      }
      if (syllables[1] !== 7) {
        const diff = 7 - syllables[1]
        suggestions.push(`Line 2: ${diff > 0 ? 'add' : 'remove'} ${Math.abs(diff)} syllable(s)`)
      }
      if (syllables[2] !== 5) {
        const diff = 5 - syllables[2]
        suggestions.push(`Line 3: ${diff > 0 ? 'add' : 'remove'} ${Math.abs(diff)} syllable(s)`)
      }
    }
    
    const localAnalysis = {
      isValid,
      syllables,
      suggestions
    }
    
    if (coachingType === 'quick') {
      return NextResponse.json({
        analysis: localAnalysis,
        method: 'local'
      })
    }
    
    try {
      const prompt = `You are a haiku coach. Analyze this haiku and provide constructive feedback.

Haiku:
Line 1: "${lines[0]}" (${syllables[0]} syllables)
Line 2: "${lines[1]}" (${syllables[1]} syllables)
Line 3: "${lines[2]}" (${syllables[2]} syllables)

Provide feedback in this format:

**Structure**: [Comment on 5-7-5 syllable pattern]

**Imagery**: [Rate 1-5 and explain the visual/sensory impact]

**Season Word**: [Identify if present, suggest if missing]

**One Key Improvement**: [One specific, actionable suggestion]

Keep feedback encouraging and under 150 words.`

      const message = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 800,
        temperature: 0.5,
        messages: [{ role: 'user', content: prompt }],
      })
      
      const textContent = message.content[0]
      const responseText = textContent.type === 'text' ? textContent.text : ''
      
      return NextResponse.json({
        analysis: localAnalysis,
        coaching: {
          feedback: responseText
        },
        method: 'claude'
      })
      
    } catch (error) {
      console.error('AI coaching failed:', error)
      
      return NextResponse.json({
        analysis: localAnalysis,
        method: 'local',
        message: 'AI coaching unavailable, showing basic analysis'
      })
    }
    
  } catch (error) {
    console.error('Coaching error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze haiku' },
      { status: 500 }
    )
  }
}