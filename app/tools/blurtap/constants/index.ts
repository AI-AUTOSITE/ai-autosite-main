// constants/index.ts

import { MaskSize } from '../types'

export const MASK_SIZE_MAP: Record<MaskSize, { w: number; h: number }> = {
  xs: { w: 80, h: 22 },
  small: { w: 100, h: 30 },
  medium: { w: 160, h: 40 },
  large: { w: 240, h: 60 },
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const MAX_HISTORY_LENGTH = 25

export const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/bmp',
  'image/webp',
]

export const IMAGE_FORMAT_MIME_MAP = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
} as const

export const DEFAULT_SETTINGS = {
  mode: 'click' as const,
  maskSize: 'medium' as const,
  format: 'png' as const,
}

export const MESSAGE_DURATION = {
  success: 2000,
  error: 3000,
}
