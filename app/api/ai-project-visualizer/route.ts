// app/api/ai-project-visualizer/route.ts 
import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  try {
    const { action, projectStructure, question } = await request.json()

    if (!projectStructure) {
      return NextResponse.json({ error: 'Project structure is required' }, { status: 400 })
    }

    const prompt = buildPrompt(action, projectStructure, question)

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const textContent = message.content[0]
    const responseText = textContent.type === 'text' ? textContent.text : ''

    return NextResponse.json({
      result: responseText,
      tokens: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
        total: message.usage.input_tokens + message.usage.output_tokens,
      },
    })
  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json({ error: 'Failed to process AI analysis' }, { status: 500 })
  }
}

function buildPrompt(action: string, structure: string, question?: string): string {
  const prompts: Record<string, string> = {
    analyze: `You are a software architect. Analyze this project structure and provide insights.

Project Structure:
\`\`\`
${structure}
\`\`\`

Provide a concise analysis with:

**Project Type**: Identify the framework/technology (e.g., Next.js, React, Python)

**Structure Quality**: Rate as Good / Fair / Needs Improvement

**Key Observations**: 
- Notable patterns or conventions
- Potential issues or concerns

**Recommendations**: 
1. [First specific improvement]
2. [Second specific improvement]
3. [Optional third improvement]

Keep it actionable and under 300 words.`,

    readme: `Generate a README.md for this project based on its structure.

Project Structure:
\`\`\`
${structure}
\`\`\`

Create a professional README with:

# Project Name

Brief description of what this project does.

## Directory Structure

Explain the main folders and their purpose.

## Key Files

List important files and what they do.

## Getting Started

Basic setup instructions (if structure suggests it).

Use clear markdown formatting.`,

    chat: `You are a project structure expert. Answer questions about this project based on its file structure.

Project Structure:
\`\`\`
${structure}
\`\`\`

User Question: ${question}

Provide a clear, helpful answer based only on what you can see in the structure. If you cannot determine something from the structure alone, say so.`,
  }

  return prompts[action] || prompts.analyze
}
