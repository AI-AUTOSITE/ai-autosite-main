import { SummaryConfig, ErrorCode } from '../types'

// File validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_FILE_TYPE = 'application/pdf'
export const ACCEPTED_FILE_EXTENSION = '.pdf'

// Rate limiting
export const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  WARNING_THRESHOLD: 2, // Show warning when 2 requests remaining
} as const

// Summary configurations with UI enhancements
export const SUMMARY_CONFIGS: Record<string, SummaryConfig> = {
  short: {
    instruction:
      'Create a concise bullet-point summary (100-200 words) of the following document. Focus only on the most critical points and main findings.',
    maxTokens: 500,
    maxChars: 10000,
    description: 'Key points only',
    estimatedTime: '10-15 sec',
  },
  medium: {
    instruction:
      'Create an executive summary (300-500 words) of the following document. Include main sections, key findings, methodology, and recommendations.',
    maxTokens: 1000,
    maxChars: 15000,
    description: 'Balanced overview',
    estimatedTime: '20-30 sec',
  },
  long: {
    instruction:
      'Create a comprehensive summary (800+ words) of the following document. Include detailed analysis of all sections, findings, methodology, implications, and recommendations.',
    maxTokens: 2000,
    maxChars: 20000,
    description: 'Detailed analysis',
    estimatedTime: '30-45 sec',
  },
} as const

// User-friendly error messages
export const ERROR_MESSAGES: Record<
  ErrorCode,
  { title: string; message: string; suggestion?: string }
> = {
  NO_FILE: {
    title: 'No file',
    message: 'Select a PDF file',
    suggestion: 'Tap to browse files',
  },
  FILE_TOO_LARGE: {
    title: 'File too large',
    message: 'Max size is 10MB',
    suggestion: 'Try a smaller file',
  },
  INVALID_FILE_TYPE: {
    title: 'Wrong file type',
    message: 'PDF files only',
    suggestion: 'Choose a .pdf file',
  },
  EMPTY_PDF: {
    title: 'Empty PDF',
    message: 'No text found',
    suggestion: 'Use a PDF with text',
  },
  CORRUPTED_PDF: {
    title: 'Cannot read',
    message: 'PDF is corrupted',
    suggestion: 'Try another file',
  },
  EXTRACTION_FAILED: {
    title: 'Failed',
    message: 'Cannot extract text',
    suggestion: 'Try again',
  },
  API_ERROR: {
    title: 'Service error',
    message: 'Try again later',
    suggestion: 'Wait a moment',
  },
  RATE_LIMIT_EXCEEDED: {
    title: 'Too many',
    message: 'Limit reached',
    suggestion: 'Wait before retry',
  },
} as const

// UI text constants
export const UI_TEXT = {
  uploadZone: {
    empty: 'Drop PDF or click',
    maxSize: 'Max 10MB',
    dragActive: 'Drop here',
  },
  buttons: {
    summarize: 'Summarize',
    processing: 'Processing',
    clear: 'Clear',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Save',
  },
  summary: {
    placeholder: 'Summary will appear here',
    processing: 'Analyzing PDF...',
  },
} as const

// Processing stage messages for better UX
export const STAGE_MESSAGES = {
  uploading: 'Uploading...',
  processing: 'Analyzing...',
  done: 'Complete!',
  error: 'Error occurred',
} as const