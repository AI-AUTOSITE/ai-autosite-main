// app/tools/token-compressor/utils/tokenUtils.ts

export interface ProcessedFile {
  name: string
  type: string
  size: number
  content: string
  compressedContent?: string
  originalTokens?: number
  compressedTokens?: number
  path?: string
}

export interface SecurityIssue {
  type: 'api_key' | 'email' | 'phone' | 'private_key'
  severity: 'high' | 'medium' | 'low'
  description: string
  count: number
}

// Enhanced compression function
export function compressText(text: string): string {
  // Remove comments
  let compressed = text
    .replace(/\/\/.*$/gm, '') // Single line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
    .replace(/<!--[\s\S]*?-->/g, '') // HTML comments
    .replace(/#.*$/gm, '') // Python/Shell comments
  
  // Remove whitespace
  compressed = compressed
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
  
  // Remove unnecessary whitespace around operators
  compressed = compressed
    .replace(/\s*([{}()\[\];,:])\s*/g, '$1')
    .replace(/\s*([=+\-*/&|<>!?])\s*/g, '$1')
  
  // Final cleanup
  compressed = compressed
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join(' ')
    .trim()
  
  return compressed
}

// Simple token counter (4 chars = 1 token approximation)
export async function countTokens(text: string): Promise<number> {
  return Math.ceil(text.length / 4)
}

// Security check
export async function checkSecurity(files: ProcessedFile[]): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = []
  
  for (const file of files) {
    const content = file.content
    
    // Check for API keys
    const apiKeyPatterns = [
      /(?:api[_\-]?key|apikey|api_token)[\s:=]+["']?([a-zA-Z0-9\-_]{20,})["']?/gi,
      /sk-[a-zA-Z0-9]{48}/g, // OpenAI
      /AIza[a-zA-Z0-9\-_]{35}/g, // Google
    ]
    
    for (const pattern of apiKeyPatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: 'api_key',
          severity: 'high',
          description: 'Potential API keys detected',
          count: 1
        })
        break
      }
    }
    
    // Check for emails
    const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
    if (emailMatches && emailMatches.length > 0) {
      issues.push({
        type: 'email',
        severity: 'medium',
        description: `${emailMatches.length} email address(es) found`,
        count: emailMatches.length
      })
    }
    
    // Check for phone numbers
    const phoneMatches = content.match(/(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g)
    if (phoneMatches && phoneMatches.length > 0) {
      issues.push({
        type: 'phone',
        severity: 'medium',
        description: `${phoneMatches.length} phone number(s) found`,
        count: phoneMatches.length
      })
    }
    
    // Check for private keys
    if (/-----BEGIN (RSA |EC )?PRIVATE KEY-----/.test(content)) {
      issues.push({
        type: 'private_key',
        severity: 'high',
        description: 'Private key detected',
        count: 1
      })
    }
  }
  
  return issues
}

// Remove sensitive data
export function removeSensitiveData(content: string): string {
  let cleaned = content
  
  // Remove API keys
  cleaned = cleaned.replace(/(?:api[_\-]?key|apikey|api_token)[\s:=]+["']?([a-zA-Z0-9\-_]{20,})["']?/gi, '[REDACTED_API_KEY]')
  cleaned = cleaned.replace(/sk-[a-zA-Z0-9]{48}/g, '[REDACTED_OPENAI_KEY]')
  cleaned = cleaned.replace(/AIza[a-zA-Z0-9\-_]{35}/g, '[REDACTED_GOOGLE_KEY]')
  
  // Remove emails
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
  
  // Remove phone numbers
  cleaned = cleaned.replace(/(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, '[REDACTED_PHONE]')
  
  // Remove private keys
  cleaned = cleaned.replace(/-----BEGIN (RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC )?PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]')
  
  return cleaned
}

// Process files
export async function processFiles(files: File[]): Promise<ProcessedFile[]> {
  const processedFiles: ProcessedFile[] = []
  
  for (const file of files) {
    try {
      const content = await file.text()
      
      processedFiles.push({
        name: file.name,
        type: file.type || 'text/plain',
        size: file.size,
        content: content,
        path: file.name
      })
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error)
    }
  }
  
  return processedFiles
}

// Generate output formats
export const outputGenerators = {
  markdown: (files: ProcessedFile[], stats: any): string => {
    let markdown = '# Compressed Files for AI\n\n'
    markdown += `## Summary\n\n`
    markdown += `- Files: ${files.length}\n`
    markdown += `- Original: ${stats.originalTokens.toLocaleString()} tokens\n`
    markdown += `- Compressed: ${stats.compressedTokens.toLocaleString()} tokens\n`
    markdown += `- Saved: ${stats.compressionRate}%\n\n`
    
    files.forEach(file => {
      markdown += `## ${file.name}\n\n`
      markdown += '```\n'
      markdown += file.compressedContent || file.content
      markdown += '\n```\n\n'
    })
    
    return markdown
  },
  
  json: (files: ProcessedFile[], stats: any): string => {
    return JSON.stringify({
      metadata: {
        totalFiles: files.length,
        ...stats,
        timestamp: new Date().toISOString()
      },
      files: files.map(f => ({
        name: f.name,
        type: f.type,
        originalTokens: f.originalTokens,
        compressedTokens: f.compressedTokens,
        content: f.compressedContent || f.content
      }))
    }, null, 2)
  },
  
  text: (files: ProcessedFile[]): string => {
    let text = 'COMPRESSED FILES\n'
    text += '='.repeat(50) + '\n\n'
    
    files.forEach(file => {
      text += `FILE: ${file.name}\n`
      text += '-'.repeat(30) + '\n'
      text += file.compressedContent || file.content
      text += '\n\n'
    })
    
    return text
  }
}