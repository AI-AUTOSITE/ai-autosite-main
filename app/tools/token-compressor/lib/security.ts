// app/tools/token-compressor/lib/security.ts
import { ProcessedFile, SecurityIssue } from './types'

const SENSITIVE_PATTERNS = {
  api_key: [
    /sk-[A-Za-z0-9]{48}/g,  // OpenAI
    /AIza[0-9A-Za-z\-_]{35}/g,  // Google
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,  // UUID
    /Bearer [A-Za-z0-9\-._~+\/]+=*/g,  // Bearer tokens
    /ghp_[A-Za-z0-9]{36}/g,  // GitHub Personal Access Token
    /ghs_[A-Za-z0-9]{36}/g,  // GitHub Secret
    /key[-_]?[A-Za-z0-9]{32,}/gi,  // Generic API key pattern
  ],
  email: [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  ],
  phone: [
    /\+?[1-9]\d{1,14}/g,  // International format
    /\(\d{3}\)\s?\d{3}-\d{4}/g,  // US format
  ],
  ssn: [
    /\d{3}-\d{2}-\d{4}/g
  ],
  credit_card: [
    /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g
  ],
  private_key: [
    /-----BEGIN [A-Z ]+ PRIVATE KEY-----/g,
    /-----BEGIN RSA PRIVATE KEY-----/g,
    /-----BEGIN EC PRIVATE KEY-----/g,
    /-----BEGIN OPENSSH PRIVATE KEY-----/g,
  ]
}

export async function checkSecurity(files: ProcessedFile[]): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = []
  
  for (const file of files) {
    // Skip binary files
    if (file.isImage) continue
    
    const content = file.content
    
    // Check for API keys
    for (const pattern of SENSITIVE_PATTERNS.api_key) {
      const matches = content.match(pattern)
      if (matches && matches.length > 0) {
        issues.push({
          type: 'api_key',
          severity: 'high',
          description: `Potential API key detected in ${file.name}`,
          location: file.name,
          count: matches.length
        })
        break // Only report once per file for API keys
      }
    }
    
    // Check for emails
    const emailMatches = content.match(SENSITIVE_PATTERNS.email[0])
    if (emailMatches && emailMatches.length > 0) {
      issues.push({
        type: 'email',
        severity: 'medium',
        description: `Email addresses detected in ${file.name}`,
        location: file.name,
        count: emailMatches.length
      })
    }
    
    // Check for private keys
    for (const pattern of SENSITIVE_PATTERNS.private_key) {
      const matches = content.match(pattern)
      if (matches && matches.length > 0) {
        issues.push({
          type: 'private_key',
          severity: 'high',
          description: `Private key detected in ${file.name}`,
          location: file.name,
          count: matches.length
        })
        break
      }
    }
    
    // Check for credit card patterns
    const creditCardMatches = content.match(SENSITIVE_PATTERNS.credit_card[0])
    if (creditCardMatches && creditCardMatches.length > 0) {
      // Additional validation to reduce false positives
      const validCards = creditCardMatches.filter(match => {
        const digits = match.replace(/[\s-]/g, '')
        return digits.length === 16 && /^\d+$/.test(digits)
      })
      
      if (validCards.length > 0) {
        issues.push({
          type: 'credit_card',
          severity: 'high',
          description: `Credit card numbers detected in ${file.name}`,
          location: file.name,
          count: validCards.length
        })
      }
    }
  }
  
  return issues
}

export function removeSensitiveData(content: string): string {
  let cleaned = content
  
  // Replace all sensitive patterns
  for (const patterns of Object.values(SENSITIVE_PATTERNS)) {
    for (const pattern of patterns) {
      cleaned = cleaned.replace(pattern, '[REDACTED]')
    }
  }
  
  // Additional generic patterns
  cleaned = cleaned
    .replace(/password[\s]*[:=][\s]*["']?[^"'\s]+["']?/gi, 'password: [REDACTED]')
    .replace(/secret[\s]*[:=][\s]*["']?[^"'\s]+["']?/gi, 'secret: [REDACTED]')
    .replace(/token[\s]*[:=][\s]*["']?[^"'\s]+["']?/gi, 'token: [REDACTED]')
  
  return cleaned
}