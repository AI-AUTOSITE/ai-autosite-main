import { SummaryConfig, ErrorCode } from '../types'

// File validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_FILE_TYPE = 'application/pdf'
export const ACCEPTED_FILE_EXTENSION = '.pdf'

// Rate limiting
export const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  WARNING_THRESHOLD: 2 // Show warning when 2 requests remaining
} as const

// Summary configurations with UI enhancements
export const SUMMARY_CONFIGS: Record<string, SummaryConfig> = {
  short: {
    instruction: 'Create a concise bullet-point summary (100-200 words) of the following document. Focus only on the most critical points and main findings.',
    maxTokens: 500,
    maxChars: 10000,
    description: 'Quick overview of key points',
    estimatedTime: '10-15 sec'
  },
  medium: {
    instruction: 'Create an executive summary (300-500 words) of the following document. Include main sections, key findings, methodology, and recommendations.',
    maxTokens: 1000,
    maxChars: 15000,
    description: 'Balanced summary with main details',
    estimatedTime: '20-30 sec'
  },
  long: {
    instruction: 'Create a comprehensive summary (800+ words) of the following document. Include detailed analysis of all sections, findings, methodology, implications, and recommendations.',
    maxTokens: 2000,
    maxChars: 20000,
    description: 'In-depth analysis and insights',
    estimatedTime: '30-45 sec'
  }
} as const

// User-friendly error messages
export const ERROR_MESSAGES: Record<ErrorCode, { title: string; message: string; suggestion?: string }> = {
  NO_FILE: {
    title: 'No file selected',
    message: 'Please select a PDF file to summarize',
    suggestion: 'Drag and drop a PDF or click to browse'
  },
  FILE_TOO_LARGE: {
    title: 'File too large',
    message: 'File size exceeds 10MB limit',
    suggestion: 'Try compressing your PDF or use a smaller file'
  },
  INVALID_FILE_TYPE: {
    title: 'Invalid file type',
    message: 'Please upload a valid PDF file',
    suggestion: 'Only .pdf files are supported'
  },
  EMPTY_PDF: {
    title: 'Empty document',
    message: 'PDF appears to be empty or contains no readable text',
    suggestion: 'Make sure your PDF contains text content'
  },
  CORRUPTED_PDF: {
    title: 'Cannot read PDF',
    message: 'Failed to read PDF file',
    suggestion: 'File may be corrupted or password-protected. Try another file.'
  },
  EXTRACTION_FAILED: {
    title: 'Extraction failed',
    message: 'Failed to extract text from PDF',
    suggestion: 'Please try again or use a different PDF'
  },
  API_ERROR: {
    title: 'Service error',
    message: 'Service temporarily unavailable',
    suggestion: 'Please try again in a few moments'
  },
  RATE_LIMIT_EXCEEDED: {
    title: 'Too many requests',
    message: 'You have exceeded the request limit',
    suggestion: 'Please wait before trying again'
  }
} as const

// UI text constants
export const UI_TEXT = {
  uploadZone: {
    empty: 'Drop PDF here or click to upload',
    maxSize: 'Maximum file size: 10MB',
    dragActive: 'Drop your PDF here...'
  },
  buttons: {
    summarize: 'Summarize',
    processing: 'Processing...',
    clear: 'Clear',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download'
  },
  summary: {
    placeholder: 'Your summary will appear here',
    processing: 'Analyzing your document...'
  }
} as const

// Processing stage messages for better UX
export const STAGE_MESSAGES = {
  uploading: 'Uploading your PDF...',
  processing: 'AI is analyzing your document...',
  done: 'Summary complete!',
  error: 'Something went wrong'
} as const