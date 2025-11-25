import { NextRequest, NextResponse } from 'next/server'
import { generateLoremIpsum, type GenerationType } from '../../tools/lorem-ipsum/lib/generator'
import { formatOutput, type OutputFormat } from '../../tools/lorem-ipsum/lib/formatters'

/**
 * GET /api/lorem
 * Generate Lorem Ipsum text
 * 
 * Protected by Cloudflare (Bot Fight Mode, DDoS Protection)
 * No server-side storage - truly privacy-first
 * 
 * Query Parameters:
 * - type: 'words' | 'sentences' | 'paragraphs' (default: 'paragraphs')
 * - amount: number (1-100, default: 3)
 * - format: 'text' | 'html' | 'markdown' | 'json' (default: 'text')
 * - start: 'true' | 'false' (default: 'true') - start with "Lorem ipsum..."
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const type = (searchParams.get('type') || 'paragraphs') as GenerationType
    const amount = Math.min(Math.max(parseInt(searchParams.get('amount') || '3'), 1), 100)
    const format = (searchParams.get('format') || 'text') as OutputFormat
    const startWithLorem = searchParams.get('start') !== 'false'

    // Validate type
    if (!['words', 'sentences', 'paragraphs'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type', message: 'Type must be: words, sentences, or paragraphs' },
        { status: 400 }
      )
    }

    // Validate format
    if (!['text', 'html', 'markdown', 'json'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format', message: 'Format must be: text, html, markdown, or json' },
        { status: 400 }
      )
    }

    // Generate Lorem Ipsum
    const result = generateLoremIpsum({
      type,
      amount,
      startWithLorem,
    })

    // Format output
    let formattedContent = result.content
    if (type === 'paragraphs' && result.paragraphs) {
      formattedContent = formatOutput(result.paragraphs, format)
    }

    // Prepare response
    const response = {
      content: formattedContent,
      metadata: {
        type,
        amount,
        format,
        startWithLorem,
        wordCount: result.wordCount,
        characterCount: result.characterCount,
        generatedAt: new Date().toISOString(),
      },
    }

    // Return response
    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to generate Lorem Ipsum' },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}