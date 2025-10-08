// app/lib/constants/index.ts

/**
 * Global Constants - Project-wide shared constants
 */

// UI Text
export * from './ui-text'

// File Size Limits
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,
  MAX_PDF_SIZE: 10 * 1024 * 1024,
  MAX_TOTAL_SIZE: 50 * 1024 * 1024,
} as const

// Supported Formats
export const SUPPORTED_FORMATS = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  DOCUMENTS: ['application/pdf', 'text/plain', 'text/markdown'] as const,
} as const

// Rate Limiting (共通)
export const RATE_LIMITS = {
  DEFAULT: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60 * 1000, // 1 minute
  },
  STRICT: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 60 * 1000,
  },
} as const