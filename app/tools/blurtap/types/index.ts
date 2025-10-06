// types/index.ts

export interface MaskRegion {
  x: number
  y: number
  w: number
  h: number
  id: string
}

export interface ImageSize {
  width: number
  height: number
}

export interface MousePosition {
  x: number
  y: number
  canvasX?: number
  canvasY?: number
}

export interface GuideBox {
  x: number
  y: number
  w: number
  h: number
}

export type MaskMode = 'click' | 'drag'
export type MaskSize = 'xs' | 'small' | 'medium' | 'large'
export type ImageFormat = 'png' | 'jpeg' | 'webp'

export interface EditorSettings {
  mode: MaskMode
  maskSize: MaskSize
  format: ImageFormat
}

export interface CanvasPosition {
  x: number
  y: number
  canvasX: number
  canvasY: number
}
