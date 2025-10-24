// app/api/prompt/test/route.ts
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
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const result = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ error: 'Failed to test prompt' }, { status: 500 })
  }
}