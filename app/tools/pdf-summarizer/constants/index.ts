export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ERROR_MESSAGES = {
  NO_FILE: 'No file provided',
  FILE_TOO_LARGE: 'File too large. Maximum size is 10MB',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a PDF file',
  EMPTY_PDF: 'PDF appears to be empty or contains no readable text',
  CORRUPTED_PDF: 'Failed to read PDF. The file may be corrupted or password-protected',
  EXTRACTION_FAILED: 'Failed to extract text from PDF',
  API_ERROR: 'Service temporarily unavailable. Please try again later',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later'
} as const

export const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000 // 1 hour
} as const

export const SUMMARY_PROMPTS = {
  short: {
    instruction: 'Create a concise bullet-point summary (100-200 words) of the following document. Focus only on the most critical points and main findings.',
    maxTokens: 500,
    maxChars: 10000
  },
  medium: {
    instruction: 'Create an executive summary (300-500 words) of the following document. Include main sections, key findings, methodology, and recommendations.',
    maxTokens: 1000,
    maxChars: 15000
  },
  long: {
    instruction: 'Create a comprehensive summary (800+ words) of the following document. Include detailed analysis of all sections, findings, methodology, implications, and recommendations.',
    maxTokens: 2000,
    maxChars: 20000
  }
} as const

export type SummaryLength = keyof typeof SUMMARY_PROMPTS