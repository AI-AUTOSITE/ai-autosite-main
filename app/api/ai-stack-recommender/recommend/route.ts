// app/api/ai-stack-recommender/recommend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface RecommendationRequest {
  projectDescription: string
  budget: string
  timeline: string
  experience: string
}

export async function POST(request: NextRequest) {
  try {
    const { projectDescription, budget, timeline, experience }: RecommendationRequest =
      await request.json()

    if (!projectDescription) {
      return NextResponse.json({ error: 'Project description is required' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `You are a senior tech stack consultant. Based on the project requirements, recommend the most suitable tech stack.

PROJECT DETAILS:
Description: ${projectDescription}
Budget: ${budget}
Timeline: ${timeline}
Developer Experience: ${experience}

Provide a detailed recommendation in the following JSON format (return ONLY valid JSON, no markdown):

{
  "primaryStack": ["framework", "language", "styling"],
  "database": ["database choice"],
  "hosting": ["hosting platform"],
  "additionalTools": ["tool1", "tool2"],
  "estimatedCost": "cost range",
  "learningTime": "time estimate",
  "reasoning": "brief explanation of choices",
  "setupCommands": ["command1", "command2", "command3"],
  "keyConsiderations": ["consideration1", "consideration2", "consideration3"]
}

IMPORTANT RULES:
- For free budgets, prioritize Vercel, Supabase free tier, open-source tools
- For AI projects, recommend Claude/OpenAI API
- For e-commerce, include Stripe
- For beginners, recommend Next.js + Supabase
- For quick MVPs, suggest lightweight stacks
- Keep setup commands practical and copy-pasteable
- Provide 3 key considerations specific to this project`,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON response
    const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const recommendation = JSON.parse(cleanedResponse)

    return NextResponse.json({ recommendation })
  } catch (error) {
    console.error('AI Stack Recommender API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    )
  }
}