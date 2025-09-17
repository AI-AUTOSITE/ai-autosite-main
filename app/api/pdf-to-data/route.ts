import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // APIキーのチェック
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    // フォームデータからPDFファイルを取得
    const formData = await request.formData()
    const file = formData.get('pdf') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'PDF file missing' },
        { status: 400 }
      )
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // PDFファイルを処理
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 簡易的なテキスト抽出（PDFから基本的なテキストパターンを取得）
    let extractedText = ''
    const pdfString = buffer.toString('utf8', 0, Math.min(buffer.length, 50000))
    
    // PDFから基本的なテキストパターンを抽出
    const textPatterns = [
      /\((.*?)\)/g,  // 括弧内のテキスト
      /BT\s*(.*?)\s*ET/g,  // PDFテキストブロック
    ]
    
    for (const pattern of textPatterns) {
      const matches = pdfString.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          extractedText += match[1] + ' '
        }
      }
    }

    // テキストが取得できなかった場合の処理
    if (!extractedText || extractedText.trim().length < 10) {
      extractedText = `File: ${file.name}, Size: ${file.size} bytes. Note: This PDF might be image-based or encrypted. For better results, please use a text-based PDF.`
    }

    // テキストが長すぎる場合は制限（Claudeのコンテキストウィンドウに合わせて調整）
    const maxLength = 8000
    if (extractedText.length > maxLength) {
      extractedText = extractedText.substring(0, maxLength)
    }

    // Claude APIでCSVに変換
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      temperature: 0,
      system: 'You are a data extraction expert. Extract structured data from PDF content and output ONLY valid CSV format. No explanations, no markdown code blocks, just pure CSV data.',
      messages: [
        {
          role: 'user',
          content: `Extract structured data from the following PDF content and output as valid CSV format. If you find tables, convert them to CSV. If you find key-value pairs, structure them as CSV. Output ONLY the CSV data, nothing else:\n\n${extractedText}`
        }
      ]
    })

    // ClaudeのレスポンスからCSVコンテンツを取得
    const csvContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Column1,Column2\nNo data,extracted'

    // CSVをレスポンスとして返す
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
      },
    })
  } catch (error: any) {
    console.error('Server error:', error)
    
    // Anthropic特有のエラー処理
    if (error.error?.type === 'invalid_request_error') {
      return NextResponse.json(
        { error: 'Invalid request to Claude API' },
        { status: 400 }
      )
    } else if (error.error?.type === 'authentication_error') {
      return NextResponse.json(
        { error: 'Invalid Anthropic API key' },
        { status: 401 }
      )
    } else if (error.error?.type === 'rate_limit_error') {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}