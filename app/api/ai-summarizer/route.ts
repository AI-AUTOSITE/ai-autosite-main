// app/api/ai-summarizer/route.ts
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

type SummaryLength = 'brief' | 'standard' | 'detailed'

const SUMMARY_CONFIGS = {
  brief: {
    instruction: 'Summarize this text in 2-3 sentences. Be concise and capture only the most essential points.',
    maxTokens: 300,
  },
  standard: {
    instruction: 'Summarize this text in 4-5 sentences. Include the main ideas and key supporting details.',
    maxTokens: 500,
  },
  detailed: {
    instruction: 'Summarize this text in 6-8 sentences. Provide a comprehensive overview with important details and context.',
    maxTokens: 800,
  },
}

export async function POST(request: Request) {
  try {
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }

    // Parse request body
    const { text, length, tone } = await request.json()

    // Validation
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (text.length < 100) {
      return NextResponse.json(
        { error: 'Text too short (minimum 100 characters)' },
        { status: 400 }
      )
    }

    const summaryLength = (length as SummaryLength) || 'standard'
    const config = SUMMARY_CONFIGS[summaryLength]

    // Limit text length to prevent token overflow
    const maxInputChars = 40000
    const truncatedText = text.length > maxInputChars 
      ? text.substring(0, maxInputChars) + '...'
      : text

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: config.maxTokens,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `${config.instruction}

Text to summarize:
${truncatedText}

Provide a clear, well-structured summary.`,
        },
      ],
    })

    const summary = message.content[0].type === 'text' ? message.content[0].text : ''

    if (!summary) {
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
      reductionPercentage: Math.round(((text.length - summary.length) / text.length) * 100),
    })
  } catch (error: any) {
    console.error('Summarization error:', error.message)

    // Handle specific API errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'API authentication failed' },
        { status: 500 }
      )
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process text. Please try again.' },
      { status: 500 }
    )
  }
}