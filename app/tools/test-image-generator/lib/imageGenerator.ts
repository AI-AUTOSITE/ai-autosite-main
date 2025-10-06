// app/tools/test-image-generator/lib/imageGenerator.ts

import { ImageSettings } from './types'

/**
 * Generate test image based on settings
 */
export function generateTestImage(settings: ImageSettings): string {
  const canvas = document.createElement('canvas')
  canvas.width = settings.width
  canvas.height = settings.height
  const ctx = canvas.getContext('2d')!

  if (settings.complexity === 'hard') {
    generateComplexImage(ctx, settings)
  } else {
    generateSimpleImage(ctx, settings)
  }

  // Convert to data URL
  const mimeType = getMimeType(settings.format)
  return canvas.toDataURL(mimeType, settings.quality)
}

/**
 * Generate simple, easy-to-compress image
 */
function generateSimpleImage(ctx: CanvasRenderingContext2D, settings: ImageSettings): void {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  switch (settings.colorMode) {
    case 'solid':
      // Solid color
      ctx.fillStyle = getRandomColor()
      ctx.fillRect(0, 0, width, height)
      break

    case 'gradient':
      // Simple linear gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, getRandomColor())
      gradient.addColorStop(1, getRandomColor())
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      break

    case 'pattern':
      // Geometric pattern
      ctx.fillStyle = getRandomColor()
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = getRandomColor()
      const blockSize = Math.min(width, height) / 10
      for (let x = 0; x < width; x += blockSize * 2) {
        for (let y = 0; y < height; y += blockSize * 2) {
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      }
      break

    case 'noise':
      // Light noise (still compressible)
      const solidGradient = ctx.createLinearGradient(0, 0, width, height)
      solidGradient.addColorStop(0, getRandomColor())
      solidGradient.addColorStop(1, getRandomColor())
      ctx.fillStyle = solidGradient
      ctx.fillRect(0, 0, width, height)

      addLightNoise(ctx, width, height)
      break
  }

  // Add simple shapes
  addSimpleShapes(ctx, width, height)
}

/**
 * Generate complex, hard-to-compress image
 */
function generateComplexImage(ctx: CanvasRenderingContext2D, settings: ImageSettings): void {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  switch (settings.colorMode) {
    case 'solid':
      // Even solid gets complexity
      ctx.fillStyle = getRandomColor()
      ctx.fillRect(0, 0, width, height)
      addHeavyNoise(ctx, width, height)
      break

    case 'gradient':
      // Complex radial gradients
      for (let i = 0; i < 5; i++) {
        const gradient = ctx.createRadialGradient(
          Math.random() * width,
          Math.random() * height,
          0,
          Math.random() * width,
          Math.random() * height,
          Math.max(width, height) / 2
        )
        gradient.addColorStop(0, getRandomColor(0.3))
        gradient.addColorStop(1, getRandomColor(0.3))
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }
      addHeavyNoise(ctx, width, height)
      break

    case 'pattern':
      // Complex overlapping patterns
      ctx.fillStyle = getRandomColor()
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = getRandomColor(0.3)
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 200 + 50
        ctx.fillRect(x, y, size, size)
      }
      addHeavyNoise(ctx, width, height)
      break

    case 'noise':
      // Maximum noise
      ctx.fillStyle = getRandomColor()
      ctx.fillRect(0, 0, width, height)
      addHeavyNoise(ctx, width, height)
      break
  }

  // Add complex details
  addComplexShapes(ctx, width, height)
}

/**
 * Add simple geometric shapes
 */
function addSimpleShapes(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'

  // Circle
  ctx.beginPath()
  ctx.arc(width / 4, height / 2, Math.min(width, height) / 10, 0, Math.PI * 2)
  ctx.fill()

  // Square
  const squareSize = Math.min(width, height) / 8
  ctx.fillRect(width / 2 - squareSize / 2, height / 2 - squareSize / 2, squareSize, squareSize)
}

/**
 * Add complex overlapping shapes
 */
function addComplexShapes(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  for (let i = 0; i < 100; i++) {
    ctx.strokeStyle = getRandomColor(0.5)
    ctx.lineWidth = Math.random() * 3 + 1
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }
}

/**
 * Add light noise (compressible)
 */
function addLightNoise(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height)
  const pixelSkip = 8 // Only every 8th pixel

  for (let i = 0; i < imageData.data.length; i += 16 * pixelSkip) {
    const noise = Math.random() * 20 - 10
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Add heavy noise (hard to compress)
 */
function addHeavyNoise(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height)
  const pixelSkip = 2 // Every other pixel

  for (let i = 0; i < imageData.data.length; i += 4 * pixelSkip) {
    const noise = Math.random() * 50 - 25
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Get random color
 */
function getRandomColor(alpha: number = 1): string {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 40) + 60 // 60-100%
  const l = Math.floor(Math.random() * 30) + 35 // 35-65%
  return `hsla(${h}, ${s}%, ${l}%, ${alpha})`
}

/**
 * Get MIME type from format
 */
function getMimeType(format: string): string {
  switch (format) {
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'jpeg':
    default:
      return 'image/jpeg'
  }
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(format: string, index: number = 1): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const ext = format === 'jpeg' ? 'jpg' : format
  return `test-image-${year}${month}${day}-${hours}${minutes}${seconds}-${index}.${ext}`
}

/**
 * Estimate file size (rough approximation)
 */
export function estimateFileSize(settings: ImageSettings): number {
  const pixels = settings.width * settings.height
  let bytesPerPixel = 3 // Base estimate

  // Adjust based on format
  if (settings.format === 'png') {
    bytesPerPixel = 4
  } else if (settings.format === 'webp') {
    bytesPerPixel = 2
  }

  // Adjust based on complexity
  const complexityMultiplier = settings.complexity === 'hard' ? 1.5 : 0.8

  // Adjust based on quality
  const qualityMultiplier = settings.quality

  const estimatedBytes = pixels * bytesPerPixel * complexityMultiplier * qualityMultiplier
  return estimatedBytes / (1024 * 1024) // Convert to MB
}
