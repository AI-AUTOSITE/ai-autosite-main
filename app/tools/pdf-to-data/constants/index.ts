export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File too big. Max 10MB',
  INVALID_FILE_TYPE: 'PDF files only',
  EXTRACTION_FAILED: 'Failed to extract. Try another PDF',
  GENERAL_ERROR: 'Something went wrong. Try again',

  // Detailed error messages - mobile friendly
  EMPTY_PDF: 'PDF is empty or has no text',
  IMAGE_BASED_PDF: 'PDF has only images. Use text-based PDF',
  CORRUPTED_PDF: 'PDF is corrupted. Try another file',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Wait a moment',
  API_ERROR: 'Service unavailable. Try again later',
  NO_PREVIEW_DATA: 'Cannot preview. Download directly',
} as const

export const ERROR_DISPLAY_DURATION = 3000 // 3 seconds
export const LONG_ERROR_DISPLAY_DURATION = 5000 // 5 seconds

export const ACCEPTED_FILE_TYPE = 'application/pdf'

export const API_ENDPOINT = '/api/pdf-to-data'

// Rate limit settings
export const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
} as const

// Default extraction fields - simplified
export const DEFAULT_FIELDS = ['Title', 'Author', 'Date', 'Summary'] as const

// Field suggestions by document type - simplified for mobile
export const FIELD_SUGGESTIONS = {
  academic: ['Title', 'Authors', 'Year', 'Keywords', 'Methods', 'Findings'],
  manual: ['Title', 'Version', 'Model', 'Date', 'Category'],
  report: ['Title', 'Date', 'Author', 'Organization', 'Summary'],
  invoice: ['Invoice_No', 'Date', 'Vendor', 'Amount', 'Items'],
  general: ['Title', 'Date', 'Author', 'Category', 'Summary'],
} as const