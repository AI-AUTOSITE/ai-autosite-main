import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SummaryLength, ErrorCode } from '@/lib/types'
import { 
  MAX_FILE_SIZE, 
  ACCEPTED_FILE_TYPE, 
  ACCEPTED_FILE_EXTENSION,
  SUMMARY_CONFIGS, 
  RATE_LIMIT 
} from '@/lib/constants'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function checkRateLimit(identifier: string): { allowed: boolean; resetIn?: number; remaining?: number } {
  const now = Date.now()
  const record = requestCounts.get(identifier)
  
  if (record && now > record.resetTime) {
    requestCounts.delete(identifier)
  }

  const current = requestCounts.get(identifier)
  
  if (!current) {
    requestCounts.set(identifier, { 
      count: 1, 
      resetTime: now + RATE_LIMIT.WINDOW_MS 
    })
    return { 
      allowed: true, 
      remaining: RATE_LIMIT.MAX_REQUESTS - 1 
    }
  }

  if (current.count >= RATE_LIMIT.MAX_REQUESTS) {
    const resetIn = Math.ceil((current.resetTime - now) / 1000 / 60)
    return { 
      allowed: false, 
      resetIn,
      remaining: 0
    }
  }

  current.count++
  return { 
    allowed: true, 
    remaining: RATE_LIMIT.MAX_REQUESTS - current.count 
  }
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(buffer: Buffer): Promise<{ 
  text: string
  error?: ErrorCode
}> {
  try {
    const pdfParse = require('pdf-parse')
    
    const data = await pdfParse(buffer, {
      max: 0, // Parse all pages
    })
    
    const text = data.text || ''
    
    // Check if PDF has readable text
    if (!text || text.trim().length === 0) {
      return { text: '', error: 'EMPTY_PDF' }
    }
    
    // Minimum text length check - allow very short text (10+ chars)
    if (text.trim().length < 10) {
      return { text: '', error: 'EMPTY_PDF' }
    }
    
    return { text }
  } catch (error: any) {
    console.error('PDF parsing error:', error.message)
    
    if (error.message?.includes('password') || error.message?.includes('encrypted')) {
      return { text: '', error: 'CORRUPTED_PDF' }
    }
    
    if (error.message?.includes('Invalid PDF')) {
      return { text: '', error: 'CORRUPTED_PDF' }
    }
    
    return { text: '', error: 'CORRUPTED_PDF' }
  }
}

function createErrorResponse(
  error: ErrorCode, 
  message: string, 
  status: number = 400
): NextResponse {
  return NextResponse.json(
    { error, message },
    { status }
  )
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return createErrorResponse(
        'API_ERROR',
        'Service configuration error',
        500
      )
    }

    const clientIp = getClientIp(request)
    const rateLimitCheck = checkRateLimit(clientIp)
    
    if (!rateLimitCheck.allowed) {
      return createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        `Too many requests. Please try again in ${rateLimitCheck.resetIn} minutes.`,
        429
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const summaryLength = (formData.get('summaryLength') as SummaryLength) || 'medium'

    if (!file) {
      return createErrorResponse('NO_FILE', 'No file provided')
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1)
      return createErrorResponse(
        'FILE_TOO_LARGE',
        `File size (${sizeMB}MB) exceeds 10MB limit`
      )
    }

    if (file.type !== ACCEPTED_FILE_TYPE) {
      return createErrorResponse(
        'INVALID_FILE_TYPE',
        'Invalid file type. Please upload a PDF file'
      )
    }

    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith(ACCEPTED_FILE_EXTENSION)) {
      return createErrorResponse(
        'INVALID_FILE_TYPE',
        'File must have .pdf extension'
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { text: pdfText, error: extractionError } = await extractTextFromPDF(buffer)

    if (extractionError) {
      let message = 'Failed to extract text from PDF'
      
      switch (extractionError) {
        case 'EMPTY_PDF':
          message = 'PDF appears to be empty or contains no readable text'
          break
        case 'CORRUPTED_PDF':
          message = 'Failed to read PDF. The file may be corrupted or password-protected'
          break
      }
      
      return createErrorResponse(extractionError, message)
    }

    const config = SUMMARY_CONFIGS[summaryLength]
    
    // Clean and prepare text for Claude
    const cleanedText = pdfText
      .trim() // Remove leading/trailing whitespace
      .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
      .replace(/[ \t]+/g, ' ') // Normalize spaces
    
    const truncatedText = cleanedText.substring(0, config.maxChars)

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: config.maxTokens,
      temperature: 0.3,
      system: 'You are a document summarization expert. Create clear, well-structured summaries in Markdown format with proper headings, bullet points, and formatting.',
      messages: [
        {
          role: 'user',
          content: `${config.instruction}

Document content:
${truncatedText}

Please provide a well-structured summary in Markdown format with:
- Clear headings (## for main sections)
- Bullet points for key information
- Bold text for important terms
- Proper spacing and formatting`
        }
      ]
    })

    const summary = message.content[0].type === 'text' 
      ? message.content[0].text 
      : ''

    if (!summary) {
      return createErrorResponse(
        'EXTRACTION_FAILED',
        'Failed to generate summary',
        500
      )
    }

    // Periodic cleanup of old rate limit entries
    if (Math.random() < 0.01) {
      const now = Date.now()
      for (const [key, value] of requestCounts.entries()) {
        if (now > value.resetTime) {
          requestCounts.delete(key)
        }
      }
    }

    return NextResponse.json({ 
      summary,
      meta: {
        remaining: rateLimitCheck.remaining,
        warning: rateLimitCheck.remaining! <= RATE_LIMIT.WARNING_THRESHOLD
      }
    })

  } catch (error: any) {
    console.error('Summarization error:', error.message)
    
    if (error.status === 401) {
      return createErrorResponse(
        'API_ERROR',
        'API authentication failed',
        500
      )
    }
    
    if (error.status === 429) {
      return createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'API rate limit exceeded. Please try again later.',
        429
      )
    }

    if (error.status === 529) {
      return createErrorResponse(
        'API_ERROR',
        'Service temporarily overloaded. Please try again in a moment.',
        503
      )
    }
    
    return createErrorResponse(
      'API_ERROR',
      'Failed to process PDF. Please try again.',
      500
    )
  }
}