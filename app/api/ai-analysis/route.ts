// app/api/ai-analysis/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  try {
    const { feature, context } = await request.json()
    
    // Build prompt based on feature
    const prompt = buildPrompt(feature, context)
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })
    
    // Extract text from content block
    const textContent = message.content[0]
    const responseText = textContent.type === 'text' ? textContent.text : ''
    
    // Return result with correct usage properties
    return NextResponse.json({
      result: responseText,
      tokens: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
        total: message.usage.input_tokens + message.usage.output_tokens
      }
    })
  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI analysis' },
      { status: 500 }
    )
  }
}

function buildPrompt(feature: string, context: string): string {
  const prompts: Record<string, string> = {
    refactor: `Based on this code analysis:\n${context}\n\nProvide specific refactoring suggestions...`,
    architecture: `Generate a comprehensive architecture document...`,
    chat: `You are a code review expert. Based on this analysis:\n${context}\n\nLet's discuss...`
  }
  
  return prompts[feature] || 'Please provide analysis for the given context.'
}