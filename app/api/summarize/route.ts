import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

type SummaryLength = 'brief' | 'standard' | 'detailed'
type SummaryTone = 'professional' | 'casual' | 'technical'

interface SummarizeRequest {
  text: string
  length?: SummaryLength
  tone?: SummaryTone
}

function buildPrompt(text: string, length: SummaryLength, tone: SummaryTone): string {
  const lengthInstructions = {
    brief: 'Provide a very brief summary in 2-3 sentences.',
    standard: 'Provide a standard summary in 4-5 sentences.',
    detailed: 'Provide a detailed summary in 6-8 sentences.',
  }

  const toneInstructions = {
    professional: 'Use a professional and formal tone.',
    casual: 'Use a casual and conversational tone.',
    technical: 'Use a technical tone with precise terminology.',
  }

  return `Please summarize the following text. ${lengthInstructions[length]} ${toneInstructions[tone]}

Text to summarize:
${text}

Summary:`
}

export async function POST(request: NextRequest) {
  try {
    const body: SummarizeRequest = await request.json()
    const { text, length = 'standard', tone = 'professional' } = body

    // Validation
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Text must be at least 50 characters long' },
        { status: 400 }
      )
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Text must not exceed 50,000 characters' },
        { status: 400 }
      )
    }

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API configuration error. Please set ANTHROPIC_API_KEY in .env.local' },
        { status: 500 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const prompt = buildPrompt(text, length, tone)

    // Call API with correct model name
    // 利用可能なモデル:
    // - claude-3-opus-20240229
    // - claude-3-sonnet-20240229 
    // - claude-3-haiku-20240307
    // - claude-3-5-sonnet-20241022 (最新)
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',  // 最新のSonnetモデルを使用
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    // Extract text from response
    const summary = response.content[0].type === 'text' 
      ? response.content[0].text.trim() 
      : 'Unable to generate summary'

    return NextResponse.json({
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
      reductionPercentage: Math.round(
        ((text.length - summary.length) / text.length) * 100
      ),
    }, { status: 200 })

  } catch (error) {
    console.error('Error in summarize API:', error)
    
    if (error instanceof Error) {
      // モデルが見つからない場合
      if (error.message.includes('not_found_error') || error.message.includes('model')) {
        return NextResponse.json(
          { error: 'Invalid model specified. Please check the model name.' },
          { status: 500 }
        )
      }
      
      // APIキーが無効な場合
      if (error.message.includes('401') || error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your ANTHROPIC_API_KEY.' },
          { status: 500 }
        )
      }
      
      // レート制限
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    )
  }
}