import { ProcessedFile, SecurityIssue } from './types'

// Security patterns for detection
const PATTERNS = {
  api_key: [
    /(?:api[_\-]?key|apikey|api_token|api[_\-]?secret)[\s:=]+["']?([a-zA-Z0-9\-_]{20,})["']?/gi,
    /sk_[a-zA-Z0-9]{32,}/g,
    /pk_[a-zA-Z0-9]{32,}/g,
    /[a-f0-9]{40}/g, // Generic hex string that could be API key
    /Bearer\s+[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g, // JWT tokens
  ],
  email: [/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g],
  phone: [/(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g],
  ssn: [/\b\d{3}-\d{2}-\d{4}\b/g, /\b\d{9}\b/g],
  credit_card: [/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, /\b\d{16}\b/g],
  private_key: [
    /-----BEGIN (RSA )?PRIVATE KEY-----/g,
    /-----BEGIN EC PRIVATE KEY-----/g,
    /-----BEGIN OPENSSH PRIVATE KEY-----/g,
  ],
}

export async function checkSecurity(files: ProcessedFile[]): Promise<SecurityIssue[]> {
  const issues: SecurityIssue[] = []
  const issueMap: Map<string, SecurityIssue> = new Map()

  for (const file of files) {
    // Skip image files
    if (file.isImage) continue

    const content = file.content

    // Check for API keys
    for (const pattern of PATTERNS.api_key) {
      const matches = content.match(pattern) || []
      if (matches.length > 0) {
        const key = 'api_key'
        if (issueMap.has(key)) {
          issueMap.get(key)!.count += matches.length
        } else {
          issueMap.set(key, {
            type: 'api_key',
            severity: 'high',
            description: 'Potential API keys or tokens detected',
            count: matches.length,
          })
        }
      }
    }

    // Check for emails
    for (const pattern of PATTERNS.email) {
      const matches = content.match(pattern) || []
      if (matches.length > 0) {
        const key = 'email'
        if (issueMap.has(key)) {
          issueMap.get(key)!.count += matches.length
        } else {
          issueMap.set(key, {
            type: 'email',
            severity: 'medium',
            description: 'Email addresses detected',
            count: matches.length,
          })
        }
      }
    }

    // Check for phone numbers
    for (const pattern of PATTERNS.phone) {
      const matches = content.match(pattern) || []
      if (matches.length > 0) {
        const key = 'phone'
        if (issueMap.has(key)) {
          issueMap.get(key)!.count += matches.length
        } else {
          issueMap.set(key, {
            type: 'phone',
            severity: 'medium',
            description: 'Phone numbers detected',
            count: matches.length,
          })
        }
      }
    }

    // Check for SSN
    for (const pattern of PATTERNS.ssn) {
      const matches = content.match(pattern) || []
      if (matches.length > 0) {
        const key = 'ssn'
        if (issueMap.has(key)) {
          issueMap.get(key)!.count += matches.length
        } else {
          issueMap.set(key, {
            type: 'ssn',
            severity: 'high',
            description: 'Potential SSN patterns detected',
            count: matches.length,
          })
        }
      }
    }

    // Check for credit cards
    for (const pattern of PATTERNS.credit_card) {
      const matches = content.match(pattern) || []
      const validCards = matches.filter((card: string) => {
        if (typeof card === 'string') {
          return luhnCheck(card.replace(/[-\s]/g, ''))
        }
        return false
      })
      if (validCards.length > 0) {
        const key = 'credit_card'
        if (issueMap.has(key)) {
          issueMap.get(key)!.count += validCards.length
        } else {
          issueMap.set(key, {
            type: 'credit_card',
            severity: 'high',
            description: 'Potential credit card numbers detected',
            count: validCards.length,
          })
        }
      }
    }

    // Check for private keys
    for (const pattern of PATTERNS.private_key) {
      const matches = content.match(pattern) || []
      if (matches.length > 0) {
        const key = 'private_key'
        if (issueMap.has(key)) {
          issueMap.get(key)!.count += matches.length
        } else {
          issueMap.set(key, {
            type: 'private_key',
            severity: 'high',
            description: 'Private keys detected',
            count: matches.length,
          })
        }
      }
    }
  }

  return Array.from(issueMap.values()).sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

export function removeSensitiveData(content: string): string {
  let cleaned = content

  // Remove API keys
  for (const pattern of PATTERNS.api_key) {
    cleaned = cleaned.replace(pattern, '[REDACTED_API_KEY]')
  }

  // Remove emails
  for (const pattern of PATTERNS.email) {
    cleaned = cleaned.replace(pattern, '[REDACTED_EMAIL]')
  }

  // Remove phone numbers
  for (const pattern of PATTERNS.phone) {
    cleaned = cleaned.replace(pattern, '[REDACTED_PHONE]')
  }

  // Remove SSN
  for (const pattern of PATTERNS.ssn) {
    cleaned = cleaned.replace(pattern, '[REDACTED_SSN]')
  }

  // Remove credit cards
  for (const pattern of PATTERNS.credit_card) {
    cleaned = cleaned.replace(pattern, (match) => {
      if (luhnCheck(match.replace(/[-\s]/g, ''))) {
        return '[REDACTED_CREDIT_CARD]'
      }
      return match
    })
  }

  // Remove private keys
  for (const pattern of PATTERNS.private_key) {
    cleaned = cleaned.replace(pattern, '[REDACTED_PRIVATE_KEY]')
  }

  // Remove JWT tokens
  cleaned = cleaned.replace(
    /Bearer\s+[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g,
    'Bearer [REDACTED_JWT_TOKEN]'
  )

  // Remove AWS keys
  cleaned = cleaned.replace(/AKIA[0-9A-Z]{16}/g, '[REDACTED_AWS_KEY]')

  // Remove GitHub tokens
  cleaned = cleaned.replace(/ghp_[a-zA-Z0-9]{36}/g, '[REDACTED_GITHUB_TOKEN]')
  cleaned = cleaned.replace(/gho_[a-zA-Z0-9]{36}/g, '[REDACTED_GITHUB_TOKEN]')

  return cleaned
}

// Luhn algorithm for credit card validation
function luhnCheck(cardNumber: string): boolean {
  if (!/^\d+$/.test(cardNumber)) return false

  let sum = 0
  let isEven = false

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i))

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}
