// app/api/code-roaster/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { code, mode } = await request.json()

    if (!code || !mode) {
      return NextResponse.json({ error: 'Code and mode are required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    let systemMessage = ''
    switch (mode) {
      case 'roast':
        systemMessage =
          "You're a savage but educational roast master. Every response must be witty, sarcastic, and hilarious. Point out every flaw in the code with brutal honesty and humor. No compliments allowed - just pure, educational roasting. Make it funny AND educational - explain WHY the code is bad while roasting it. Use analogies and metaphors to make your points memorable."
        break
      case 'explain':
        systemMessage =
          'You are a senior developer and an excellent teacher. Explain the following code in plain English for beginners. Break down what each part does step by step, identify any issues or potential improvements, and suggest best practices in a friendly, encouraging way. Be thorough but easy to understand. Use simple analogies when helpful.'
        break
      case 'fix':
        systemMessage =
          'You are an expert developer. Analyze and fix the following code. Correct any bugs, improve clarity, performance, and follow best practices while keeping the original intent. Provide the fixed code with clear explanations of what was changed and why. Format the code properly with comments.'
        break
      default:
        systemMessage = 'You are a helpful coding assistant.'
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 3000,
      temperature: mode === 'roast' ? 0.9 : 0.7,
      system: systemMessage,
      messages: [
        {
          role: 'user',
          content: code,
        },
      ],
    })

    const result =
      response.content[0]?.type === 'text' ? response.content[0].text : 'No response generated'

    return NextResponse.json({
      result,
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    })
  } catch (error) {
    console.error('Process error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
