export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File too big. Max 10MB',
  INVALID_FILE_TYPE: 'Please use PDF files only',
  EXTRACTION_FAILED: 'Failed to extract data. Please try another PDF.',
  GENERAL_ERROR: 'Something went wrong. Try again.'
} as const

export const ERROR_DISPLAY_DURATION = 3000 // 3 seconds
export const LONG_ERROR_DISPLAY_DURATION = 5000 // 5 seconds

export const ACCEPTED_FILE_TYPE = 'application/pdf'

export const API_ENDPOINT = '/api/pdf-to-data'