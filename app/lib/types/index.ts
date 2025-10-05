// Summary length options
export type SummaryLength = 'short' | 'medium' | 'long'

// Processing stages
export type ProcessingStage = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

// API Response types
export interface SummarizeResponse {
  summary?: string
  error?: ErrorCode
  message?: string
}

// Error codes
export type ErrorCode = 
  | 'NO_FILE'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'EMPTY_PDF'
  | 'CORRUPTED_PDF'
  | 'EXTRACTION_FAILED'
  | 'API_ERROR'
  | 'RATE_LIMIT_EXCEEDED'

// Error details for UI
export interface ErrorDetail {
  code: ErrorCode
  userMessage: string
  technicalMessage?: string
}

// Summary configuration
export interface SummaryConfig {
  instruction: string
  maxTokens: number
  maxChars: number
  description: string // For UI tooltip
  estimatedTime: string // Expected processing time
}

// Rate limit info
export interface RateLimitInfo {
  allowed: boolean
  resetIn?: number
  remaining?: number
}