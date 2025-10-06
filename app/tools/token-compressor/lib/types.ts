// app/tools/token-compressor/lib/types.ts

export interface ProcessedFile {
  name: string
  type: string
  size: number
  content: string
  compressedContent?: string
  originalTokens?: number
  compressedTokens?: number
  path?: string
  isImage?: boolean
  imageData?: string
  compressedImageData?: string
}

export interface SecurityIssue {
  type: 'api_key' | 'email' | 'phone' | 'ssn' | 'credit_card' | 'private_key'
  severity: 'high' | 'medium' | 'low'
  description: string
  location?: string
  count: number
}

export type OutputFormat = 'markdown' | 'json' | 'zip' | 'txt'

export interface CompressionOptions {
  level: 'normal' | 'aggressive' | 'minimal'
  removeComments: boolean
  removeWhitespace: boolean
  minifyCode: boolean
  preserveStructure: boolean
}

export interface TokenStats {
  original: number
  compressed: number
  saved: number
  percentage: number
}
