import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Rate limiting (similar to Debate Trainer)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function checkRateLimit(identifier: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now()
  const limit = 5
  const window = 60 * 60 * 1000 // 1 hour

  const record = requestCounts.get(identifier)
  
  if (record && now > record.resetTime) {
    requestCounts.delete(identifier)
  }

  const current = requestCounts.get(identifier)
  
  if (!current) {
    requestCounts.set(identifier, { 
      count: 1, 
      resetTime: now + window 
    })
    return { allowed: true }
  }

  if (current.count >= limit) {
    const resetIn = Math.ceil((current.resetTime - now) / 1000 / 60)
    return { allowed: false, resetIn }
  }

  current.count++
  return { allowed: true }
}

// PDF text extraction with better error handling
async function extractTextFromPDF(buffer: Buffer): Promise<{ text: string; error?: string }> {
  try {
    const pdf = require('pdf-parse')
    const data = await pdf(buffer)
    const text = data.text || ''
    
    // Check if extraction was successful
    if (!text || text.trim().length === 0) {
      return { text: '', error: 'EMPTY_PDF' }
    }
    
    if (text.trim().length < 50) {
      return { text: '', error: 'IMAGE_BASED_PDF' }
    }
    
    return { text }
  } catch (error) {
    console.error('PDF parsing error:', error)
    
    // Try fallback extraction
    try {
      const pdfString = buffer.toString('latin1')
      let text = ''
      
      const patterns = [
        /\((.*?)\)/g,
        /BT\s*([\s\S]*?)\s*ET/g,
        /Tj\s*\((.*?)\)/g,
      ]
      
      for (const pattern of patterns) {
        const matches = pdfString.matchAll(pattern)
        for (const match of matches) {
          if (match[1]) {
            text += match[1] + ' '
          }
        }
      }
      
      const cleanedText = text.trim()
      
      if (!cleanedText || cleanedText.length < 50) {
        return { text: '', error: 'CORRUPTED_PDF' }
      }
      
      return { text: cleanedText }
    } catch (fallbackError) {
      return { text: '', error: 'CORRUPTED_PDF' }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API_ERROR', message: 'Service configuration error' },
        { status: 500 }
      )
    }

    // Rate limiting check
    const clientIp = getClientIp(request)
    const ipCheck = checkRateLimit(clientIp)
    
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'RATE_LIMIT_EXCEEDED', 
          message: `Too many requests. Please try again in ${ipCheck.resetIn} minutes.` 
        },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('pdf') as File
    let outputFormat = formData.get('format') as string || 'csv'
    const customFields = formData.get('customFields') as string || ''
    
    console.log('Processing PDF:', file?.name)
    console.log('Custom fields:', customFields)
    
    if (!file) {
      return NextResponse.json(
        { error: 'INVALID_FILE_TYPE', message: 'PDF file missing' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'FILE_TOO_LARGE', message: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Extract text from PDF
    const { text: extractedText, error: extractionError } = await extractTextFromPDF(buffer)
    
    // Handle extraction errors with specific messages
    if (extractionError) {
      let message = 'Failed to extract text from PDF'
      
      switch (extractionError) {
        case 'EMPTY_PDF':
          message = 'This PDF appears to be empty or has no extractable text.'
          break
        case 'IMAGE_BASED_PDF':
          message = 'This PDF contains only images. Please use a text-based PDF.'
          break
        case 'CORRUPTED_PDF':
          message = 'The PDF file appears to be corrupted. Please try a different file.'
          break
      }
      
      return NextResponse.json(
        { error: extractionError, message },
        { status: 400 }
      )
    }

    // Trim if too long
    let processedText = extractedText
    if (processedText.length > 10000) {
      processedText = processedText.substring(0, 10000)
    }

    console.log('Text extracted, length:', processedText.length)

    // Prepare custom fields instruction
    let fieldsInstruction = ''
    if (customFields) {
      const fields = customFields.split(',').map(f => f.trim()).filter(f => f)
      if (fields.length > 0) {
        fieldsInstruction = `\n\nIMPORTANT: Extract ONLY these specific fields: ${fields.join(', ')}\nCreate CSV columns exactly matching these field names.`
      }
    }

    // Convert to CSV using Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      temperature: 0,
      system: `You are a data extraction expert. Extract structured information from ANY document type (academic papers, manuals, reports, invoices, etc.) and convert to CSV format.

Rules:
1. Analyze the document type and extract the MOST RELEVANT fields
2. For academic papers: Title, Authors, Institution, Year, Keywords, Topic, Methods, Findings
3. For technical manuals: Title, Version, Date, Manufacturer, Model, Category, Description
4. For reports: Title, Date, Author, Organization, Summary, Key_Points
5. For invoices: Invoice_Number, Date, Vendor, Amount, Items, Status
6. If the document doesn't fit these categories, create appropriate columns based on the content
7. If information is missing, use "Not Available" instead of N/A
8. Output ONLY valid CSV format, no explanations or markdown`,
      messages: [
        {
          role: 'user',
          content: `Analyze this document and extract structured data into an appropriate CSV format.

First, determine the document type (academic paper, manual, report, invoice, etc.).
Then extract the most relevant information into a well-structured CSV table.${fieldsInstruction}

Document content:
${processedText}

Output pure CSV only. Choose appropriate column names based on the document type.`
        }
      ]
    })

    let csvContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : ''

    if (!csvContent) {
      return NextResponse.json(
        { error: 'EXTRACTION_FAILED', message: 'Failed to generate CSV data' },
        { status: 500 }
      )
    }

    // Remove markdown formatting
    csvContent = csvContent.replace(/```csv\n?/g, '').replace(/```\n?/g, '').trim()

    // Excel format conversion
    if (outputFormat === 'excel') {
      try {
        const XLSX = require('xlsx')
        const workbook = XLSX.read(csvContent, { type: 'string' })
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        
        return new NextResponse(excelBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="extracted_data.xlsx"',
          },
        })
      } catch (xlsxError) {
        console.error('Excel conversion error:', xlsxError)
        outputFormat = 'csv'
      }
    }

    // Cleanup old entries (memory management)
    if (Math.random() < 0.01) {
      const now = Date.now()
      for (const [key, value] of requestCounts.entries()) {
        if (now > value.resetTime) {
          requestCounts.delete(key)
        }
      }
    }

    // Return CSV
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="extracted_data.csv"',
      },
    })

  } catch (error: any) {
    console.error('Server error:', error)
    
    // Handle specific API errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'API_ERROR', message: 'API authentication failed. Please check configuration.' },
        { status: 500 }
      )
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: 'GENERAL_ERROR', message: 'Failed to process PDF. Please try again.' },
      { status: 500 }
    )
  }
}