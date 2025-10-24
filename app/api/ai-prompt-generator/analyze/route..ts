// app/api/prompt/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const message = await client.messages.create({
  model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: `Analyze this AI prompt and give 3 quick tips to improve it. Be concise.

Prompt:
${prompt}

Format:
1. [tip]
2. [tip]
3. [tip]`,
        },
      ],
    })

    const tips = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ tips })
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json({ error: 'Failed to analyze prompt' }, { status: 500 })
  }
}