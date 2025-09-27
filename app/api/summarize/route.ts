import { NextRequest, NextResponse } from 'next/server'

// レート制限用のメモリストレージ
const rateLimit = new Map<string, number[]>()
const MAX_REQUESTS_PER_HOUR = 10
const MAX_REQUESTS_PER_DAY = 50

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now()
  const userRequests = rateLimit.get(ip) || []
  
  // 1時間以内のリクエスト
  const hourRequests = userRequests.filter(time => now - time < 3600000)
  // 24時間以内のリクエスト
  const dayRequests = userRequests.filter(time => now - time < 86400000)
  
  if (hourRequests.length >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, message: 'Hourly limit exceeded. Try again later.' }
  }
  
  if (dayRequests.length >= MAX_REQUESTS_PER_DAY) {
    return { allowed: false, message: 'Daily limit exceeded. Try again tomorrow.' }
  }
  
  dayRequests.push(now)
  rateLimit.set(ip, dayRequests)
  return { allowed: true }
}

// PDFテキスト抽出用のヘルパー関数
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // pdf-parseライブラリを使用（動的インポート）
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js')
    const data = await pdfParse.default(buffer)
    return data.text
  } catch (error) {
    console.error('PDF parsing error:', error)
    // フォールバック：基本的なテキスト抽出
    return buffer.toString('utf-8').substring(0, 10000)
  }
}

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimitResult = checkRateLimit(ip)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      )
    }

    // リクエストデータの取得
    const formData = await request.formData()
    const file = formData.get('file') as File
    const summaryLength = formData.get('summaryLength') as string || 'medium'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // PDFをBufferに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // PDFからテキストを抽出
    let pdfText = ''
    try {
      pdfText = await extractTextFromPDF(buffer)
    } catch (error) {
      console.error('PDF extraction failed:', error)
      // PDFの読み取りに失敗した場合はエラーを返す
      return NextResponse.json(
        { error: 'Failed to read PDF. Please ensure the file is not corrupted or password-protected.' },
        { status: 400 }
      )
    }

    // テキストが空の場合
    if (!pdfText || pdfText.trim().length < 100) {
      return NextResponse.json(
        { error: 'PDF appears to be empty or contains no readable text.' },
        { status: 400 }
      )
    }

    // Claude APIキーの確認
    const claudeApiKey = process.env.CLAUDE_API_KEY
    
    if (!claudeApiKey) {
      console.warn('Claude API key not configured, using fallback')
      // APIキーがない場合は簡易的な要約を返す
      const simpleSummary = generateSimpleSummary(pdfText, summaryLength)
      return NextResponse.json({ summary: simpleSummary })
    }

    // プロンプトの準備
    const promptMap = {
      short: `Create a concise bullet-point summary (100-200 words) of the following document. 
              Focus only on the most critical points and main findings:`,
      medium: `Create an executive summary (300-500 words) of the following document. 
               Include main sections, key findings, methodology, and recommendations:`,
      long: `Create a comprehensive summary (800+ words) of the following document. 
             Include detailed analysis of all sections, findings, methodology, implications, and recommendations:`
    }

    // テキストを制限（Claude APIのトークン制限対策）
    const maxChars = summaryLength === 'long' ? 20000 : summaryLength === 'medium' ? 15000 : 10000
    const truncatedText = pdfText.substring(0, maxChars)

    // Claude APIを呼び出し
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: summaryLength === 'short' ? 500 : summaryLength === 'medium' ? 1000 : 2000,
          temperature: 0.3,
          messages: [{
            role: 'user',
            content: `${promptMap[summaryLength as keyof typeof promptMap]}

Document content:
${truncatedText}

Please provide a well-structured summary in Markdown format.`
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Claude API error:', errorData)
        throw new Error('Claude API request failed')
      }

      const data = await response.json()
      const summary = data.content[0].text

      return NextResponse.json({ summary })
      
    } catch (apiError) {
      console.error('Claude API call failed:', apiError)
      // Claude APIが失敗した場合はフォールバック
      const fallbackSummary = generateSimpleSummary(pdfText, summaryLength)
      return NextResponse.json({ summary: fallbackSummary })
    }
    
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to process document. Please try again.' },
      { status: 500 }
    )
  }
}

// シンプルな要約生成（フォールバック用）
function generateSimpleSummary(text: string, length: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []
  const words = text.split(/\s+/)
  
  const summaryLengths = {
    short: 5,
    medium: 10,
    long: 20
  }
  
  const numSentences = summaryLengths[length as keyof typeof summaryLengths] || 10
  const selectedSentences = sentences
    .filter(s => s.length > 30 && s.length < 300)
    .slice(0, numSentences)

  const summary = {
    short: `# Quick Summary

## Key Points
${selectedSentences.slice(0, 5).map(s => `• ${s.trim()}`).join('\n')}

*Note: This is an automated summary. For better results, please ensure Claude API is configured.*`,
    
    medium: `# Document Summary

## Overview
${selectedSentences.slice(0, 3).join(' ')}

## Main Points
${selectedSentences.slice(3, 8).map(s => `• ${s.trim()}`).join('\n')}

## Additional Information
${selectedSentences.slice(8, 10).join(' ')}

*Note: This is an automated summary. For better results, please ensure Claude API is configured.*`,
    
    long: `# Comprehensive Summary

## Introduction
${selectedSentences.slice(0, 3).join(' ')}

## Key Content
${selectedSentences.slice(3, 10).join(' ')}

## Detailed Points
${selectedSentences.slice(10, 15).map(s => `• ${s.trim()}`).join('\n')}

## Additional Context
${selectedSentences.slice(15, 20).join(' ')}

## Statistics
- Total words: ${words.length}
- Total sentences: ${sentences.length}
- Document pages: ~${Math.ceil(words.length / 250)}

*Note: This is an automated summary. For better results, please ensure Claude API is configured.*`
  }
  
  return summary[length as keyof typeof summary] || summary.medium
}