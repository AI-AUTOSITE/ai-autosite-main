import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Claude API初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const { code, mode } = await request.json()

    // 入力検証
    if (!code || !mode) {
      return NextResponse.json(
        { error: 'Code and mode are required' },
        { status: 400 }
      )
    }

    // APIキーチェック
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

    // モードごとのシステムメッセージ設定
    let systemMessage = ''
    switch (mode) {
      case 'roast':
        systemMessage = "You're a savage roast master. Every response must be witty, sarcastic, and hilarious. Point out every flaw in the code with brutal honesty and humor. No compliments allowed - just pure, educational roasting. Make it funny but also educational - explain WHY the code is bad while roasting it."
        break
      case 'explain':
        systemMessage = "You are a senior developer and an excellent teacher. Explain the following code in plain English for beginners. Break down what each part does, identify any issues, and suggest improvements in a friendly, encouraging way. Be thorough but easy to understand."
        break
      case 'fix':
        systemMessage = "You are an expert developer. Fix the following code. Correct any bugs, improve clarity and performance while keeping the original intent. Provide the fixed code with brief explanations of what was changed and why. Format the code nicely."
        break
      default:
        systemMessage = "You are a helpful coding assistant."
    }

    // Claude APIにリクエスト
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',  // 正しいモデル名
      max_tokens: 1024,
      temperature: mode === 'roast' ? 0.85 : 0.7,
      system: systemMessage,
      messages: [
        {
          role: 'user',
          content: code
        }
      ]
    })

    // レスポンス処理
    const result = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : 'No response generated'

    return NextResponse.json({ result })

  } catch (error) {
    console.error('Process error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}