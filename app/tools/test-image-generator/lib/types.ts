// app/tools/test-image-generator/lib/types.ts

export type ImageFormat = 'jpeg' | 'png' | 'webp'
export type Complexity = 'easy' | 'hard'
export type ColorMode = 'solid' | 'gradient' | 'pattern' | 'noise'

export interface ImageSettings {
  width: number
  height: number
  format: ImageFormat
  complexity: Complexity
  colorMode: ColorMode
  quality: number // 0.1 - 1.0
  count: number // 1-10 for batch generation
}

export const DEFAULT_SETTINGS: ImageSettings = {
  width: 1920,
  height: 1080,
  format: 'jpeg',
  complexity: 'easy',
  colorMode: 'gradient',
  quality: 0.8,
  count: 1,
}

export const PRESET_SIZES = {
  HD: { width: 1920, height: 1080 },
  'Full HD': { width: 1920, height: 1080 },
  '4K': { width: 3840, height: 2160 },
  Square: { width: 1000, height: 1000 },
  Portrait: { width: 1080, height: 1920 },
  Thumbnail: { width: 300, height: 300 },
  Banner: { width: 1200, height: 630 },
  Custom: { width: 1920, height: 1080 },
} as const

export type PresetSize = keyof typeof PRESET_SIZES
