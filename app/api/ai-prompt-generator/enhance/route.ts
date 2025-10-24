// app/api/prompt/enhance/route.ts
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
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: `You are an expert prompt engineer. Transform this basic AI prompt into a more effective, detailed version.

CRITICAL: You MUST improve the prompt significantly. Do NOT return the original unchanged.

Original prompt:
${prompt}

Create an enhanced version that:
1. Adds specific context and constraints
2. Includes expected output format details
3. Provides concrete examples or criteria
4. Makes the request more actionable
5. Removes generic phrases and adds specifics

Return ONLY the improved prompt with no explanation or preamble.`,
        },
      ],
    })

    const enhancedPrompt = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ enhancedPrompt })
  } catch (error) {
    console.error('Enhance API error:', error)
    return NextResponse.json({ error: 'Failed to enhance prompt' }, { status: 500 })
  }
}