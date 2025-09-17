// utils/canvas.ts

import { MaskRegion, CanvasPosition } from '../types'

export const redrawCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  masks: MaskRegion[],
  displayScale: number
): void => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas internal size to original size
  canvas.width = image.width
  canvas.height = image.height

  // Apply display scale via CSS
  canvas.style.width = `${image.width * displayScale}px`
  canvas.style.height = `${image.height * displayScale}px`

  // Draw original image
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0)

  // Draw black masks
  ctx.fillStyle = 'black'
  masks.forEach(mask => {
    ctx.fillRect(mask.x, mask.y, mask.w, mask.h)
  })
}

export const getCanvasPosition = (
  event: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): CanvasPosition => {
  const rect = canvas.getBoundingClientRect()
  const cssX = event.clientX - rect.left
  const cssY = event.clientY - rect.top

  const canvasX = (cssX / rect.width) * canvas.width
  const canvasY = (cssY / rect.height) * canvas.height

  return { x: cssX, y: cssY, canvasX, canvasY }
}

export const calculateDisplayScale = (
  imageWidth: number,
  imageHeight: number,
  maxWidthRatio = 0.7,  // Changed from 0.5 to 0.7 for larger display
  maxHeightRatio = 0.65  // Changed from 0.5 to 0.65 for larger display
): number => {
  const maxWidth = window.innerWidth * maxWidthRatio
  const maxHeight = window.innerHeight * maxHeightRatio

  const scaleX = maxWidth / imageWidth
  const scaleY = maxHeight / imageHeight

  return Math.min(scaleX, scaleY, 1.5)  // Allow up to 1.5x scale for small images
}

export const downloadCanvas = (
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp',
  filename?: string
): void => {
  const mime = format === 'jpeg' ? 'image/jpeg' : 
               format === 'webp' ? 'image/webp' : 'image/png'
  
  canvas.toBlob((blob) => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `masked.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }, mime, 0.93)
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File must be under 10MB' }
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' }
  }

  return { valid: true }
}