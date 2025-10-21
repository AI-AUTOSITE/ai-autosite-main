// app/api/haiku/generate/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { generateLocalHaiku } from '../../../tools/haiku-generator/lib/haiku-generator'
import type { Season } from '../../../tools/haiku-generator/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = {
  maxRequests: 10,
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
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }
    
    const { theme, season, useAI } = await request.json()
    
    if (!theme || theme.trim().length === 0) {
      return NextResponse.json(
        { error: 'Theme is required' },
        { status: 400 }
      )
    }
    
    if (theme.length > 100) {
      return NextResponse.json(
        { error: 'Theme is too long (max 100 characters)' },
        { status: 400 }
      )
    }
    
    if (!useAI) {
      const localHaiku = generateLocalHaiku(theme, season)
      return NextResponse.json({
        haiku: localHaiku,
        method: 'local',
        message: 'Generated using local templates'
      })
    }
    
    try {
      const prompt = buildClaudePrompt(theme, season)
      
      const message = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      })
      
      const textContent = message.content[0]
      const responseText = textContent.type === 'text' ? textContent.text : ''
      
      const lines = responseText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 3)
      
      const haiku = {
        lines: lines.map(text => ({
          text,
          syllables: 0,
          words: text.split(' ')
        })),
        season: season || 'spring',
        seasonWord: '',
        theme,
        generationMethod: 'claude',
        timestamp: new Date().toISOString()
      }
      
      return NextResponse.json({
        haiku,
        method: 'claude',
        model: 'claude-3-5-haiku-20241022'
      })
      
    } catch (claudeError) {
      console.error('Claude API failed:', claudeError)
      
      const localHaiku = generateLocalHaiku(theme, season)
      return NextResponse.json({
        haiku: localHaiku,
        method: 'local',
        message: 'AI unavailable, using local generation'
      })
    }
    
  } catch (error) {
    console.error('Haiku generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate haiku' },
      { status: 500 }
    )
  }
}

function buildClaudePrompt(theme: string, season?: Season): string {
  const seasonInfo = season ? `Season: ${season}` : 'Any season'
  
  return `Create a haiku about "${theme}".

Requirements:
- EXACTLY 5-7-5 syllables (Line 1: 5, Line 2: 7, Line 3: 5)
- ${seasonInfo}
- Natural, evocative English
- Follow traditional haiku principles (nature, moment, imagery)

Output ONLY the three lines of the haiku, one per line. No explanations.

Example format:
Cherry blossoms fall
Soft petals dance in spring breeze
Fleeting beauty fades`
}

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    providers: {
      claude: !!process.env.ANTHROPIC_API_KEY,
      local: true
    },
    rateLimit: RATE_LIMIT
  })
}