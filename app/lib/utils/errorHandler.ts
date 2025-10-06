import { ErrorCode, ErrorDetail } from '../types'
import { ERROR_MESSAGES } from '../constants'

/**
 * Convert error code to user-friendly error detail
 */
export function getErrorDetail(code: ErrorCode, additionalInfo?: string): ErrorDetail {
  const errorConfig = ERROR_MESSAGES[code]

  return {
    code,
    userMessage: additionalInfo ? `${errorConfig.message}. ${additionalInfo}` : errorConfig.message,
    technicalMessage: errorConfig.suggestion,
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: ErrorDetail } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  // Check file extension
  const fileName = file.name.toLowerCase()
  if (!fileName.endsWith('.pdf')) {
    return {
      valid: false,
      error: getErrorDetail('INVALID_FILE_TYPE', 'File must have .pdf extension'),
    }
  }

  // Check MIME type
  if (file.type !== 'application/pdf') {
    return {
      valid: false,
      error: getErrorDetail('INVALID_FILE_TYPE', 'Invalid MIME type'),
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const fileSize = formatFileSize(file.size)
    return {
      valid: false,
      error: getErrorDetail('FILE_TOO_LARGE', `Your file is ${fileSize}`),
    }
  }

  return { valid: true }
}

/**
 * Parse API error response
 */
export function parseApiError(error: any): ErrorDetail {
  // Handle network errors
  if (!error.response) {
    return getErrorDetail('API_ERROR', 'Network connection failed')
  }

  // Handle API error codes
  const errorCode = error.response?.error as ErrorCode
  const message = error.response?.message

  if (errorCode && ERROR_MESSAGES[errorCode]) {
    return getErrorDetail(errorCode, message)
  }

  // Default error
  return getErrorDetail('API_ERROR', 'An unexpected error occurred')
}
