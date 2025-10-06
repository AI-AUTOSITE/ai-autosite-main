// app/tools/test-file-generator/lib/types.ts

export type Language = 'english' | 'japanese' | 'mixed'
export type ImageType = 'hard' | 'easy'
export type ImageSize = 'small' | 'medium' | 'large'

export interface GeneratorSettings {
  // Text settings
  language: Language
  textAmount: number // 0-100 percentage

  // Image settings
  imageType: ImageType
  imageSize: ImageSize
  imagesPerPage: number

  // File settings
  targetSizeMB: number // 0.1 - 10
  pageCount: number
}

export interface PreviewData {
  estimatedSize: number // in MB
  pageCount: number
  currentPage: number
  pdfDataUrl: string
}

export const IMAGE_DIMENSIONS = {
  small: { width: 200, height: 200 },
  medium: { width: 400, height: 400 },
  large: { width: 600, height: 600 },
} as const

export const DEFAULT_SETTINGS: GeneratorSettings = {
  language: 'english',
  textAmount: 50,
  imageType: 'easy',
  imageSize: 'medium',
  imagesPerPage: 2,
  targetSizeMB: 2.5,
  pageCount: 5,
}
