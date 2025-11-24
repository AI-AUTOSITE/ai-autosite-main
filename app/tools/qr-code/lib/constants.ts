// ============================================
// QR Code Generator - Constants
// ============================================

import { PresetColor, DotStyle, ErrorCorrectionLevel } from './types'

// Preset color schemes
export const PRESET_COLORS: PresetColor[] = [
  { name: 'Classic', foreground: '#000000', background: '#FFFFFF' },
  { name: 'Midnight', foreground: '#1a1a2e', background: '#eef2f7' },
  { name: 'Ocean', foreground: '#006994', background: '#e0f7fa' },
  { name: 'Forest', foreground: '#1b4332', background: '#d8f3dc' },
  { name: 'Berry', foreground: '#7b2869', background: '#fce4ec' },
  { name: 'Sunset', foreground: '#c2410c', background: '#fff7ed' },
  { name: 'Royal', foreground: '#4c1d95', background: '#ede9fe' },
  { name: 'Slate', foreground: '#334155', background: '#f1f5f9' },
]

// Dot style options
export const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Pill' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Elegant' },
]

// Error correction levels
export const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; desc: string }[] = [
  { value: 'L', label: 'L', desc: '7% - Smallest' },
  { value: 'M', label: 'M', desc: '15% - Default' },
  { value: 'Q', label: 'Q', desc: '25% - Good for logos' },
  { value: 'H', label: 'H', desc: '30% - Best for logos' },
]

// Default values
export const DEFAULT_SIZE = 512
export const DEFAULT_ERROR_LEVEL: ErrorCorrectionLevel = 'M'
export const DEFAULT_DOT_STYLE: DotStyle = 'square'
export const DEFAULT_OUTPUT_FORMAT = 'png'
export const MAX_TEXT_LENGTH = 2000
export const MAX_LOGO_SIZE = 2 * 1024 * 1024 // 2MB
