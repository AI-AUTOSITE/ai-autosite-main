export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File too big. Max 10MB',
  INVALID_FILE_TYPE: 'Please use PDF files only',
  EXTRACTION_FAILED: 'Failed to extract data. Please try another PDF.',
  GENERAL_ERROR: 'Something went wrong. Try again.',

  // New detailed error messages
  EMPTY_PDF: 'This PDF appears to be empty or has no extractable text.',
  IMAGE_BASED_PDF:
    'This PDF contains only images. Please use a text-based PDF or try OCR software first.',
  CORRUPTED_PDF:
    'The PDF file appears to be corrupted. Please try re-downloading or using a different file.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment and try again.',
  API_ERROR: 'Service temporarily unavailable. Please try again in a few minutes.',
  NO_PREVIEW_DATA: 'Could not generate preview. Please try downloading the file directly.',
} as const

export const ERROR_DISPLAY_DURATION = 3000 // 3 seconds
export const LONG_ERROR_DISPLAY_DURATION = 5000 // 5 seconds

export const ACCEPTED_FILE_TYPE = 'application/pdf'

export const API_ENDPOINT = '/api/pdf-to-data'

// Rate limit settings (matching Debate Trainer pattern)
export const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
} as const

// History settings
export const HISTORY_CONFIG = {
  STORAGE_KEY: 'pdf_to_data_history',
  MAX_ENTRIES: 10,
} as const

// Default extraction fields
export const DEFAULT_FIELDS = ['Title', 'Authors', 'Date', 'Keywords', 'Summary'] as const

// Field suggestions by document type
export const FIELD_SUGGESTIONS = {
  academic: ['Title', 'Authors', 'Institution', 'Year', 'Keywords', 'Methods', 'Findings'],
  manual: ['Title', 'Version', 'Manufacturer', 'Model', 'Date', 'Category'],
  report: ['Title', 'Date', 'Author', 'Organization', 'Summary', 'Key_Points'],
  invoice: ['Invoice_Number', 'Date', 'Vendor', 'Amount', 'Items', 'Status'],
  general: ['Title', 'Date', 'Author', 'Category', 'Summary', 'Key_Information'],
} as const
