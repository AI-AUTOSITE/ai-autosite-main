// app/tools/test-file-generator/lib/imageGenerator.ts

import { ImageType, ImageSize, IMAGE_DIMENSIONS } from './types'

/**
 * Generate image data URL based on type and size
 */
export function generateImage(type: ImageType, size: ImageSize): string {
  const dimensions = IMAGE_DIMENSIONS[size]
  const canvas = document.createElement('canvas')
  canvas.width = dimensions.width
  canvas.height = dimensions.height
  const ctx = canvas.getContext('2d')!

  if (type === 'hard') {
    generateHardToProcessImage(ctx, dimensions.width, dimensions.height)
  } else {
    generateEasyToProcessImage(ctx, dimensions.width, dimensions.height)
  }

  return canvas.toDataURL('image/jpeg', 0.8)
}

/**
 * Generate hard-to-process image (complex patterns)
 */
function generateHardToProcessImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // Complex gradient background
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) / 2
  )
  gradient.addColorStop(0, `hsl(${Math.random() * 360}, 70%, 50%)`)
  gradient.addColorStop(0.5, `hsl(${Math.random() * 360}, 70%, 40%)`)
  gradient.addColorStop(1, `hsl(${Math.random() * 360}, 70%, 30%)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Add lighter noise pattern (optimized)
  const imageData = ctx.getImageData(0, 0, width, height)
  const pixelSkip = 4 // Only add noise to every 4th pixel for performance
  for (let i = 0; i < imageData.data.length; i += 16 * pixelSkip) {
    const noise = Math.random() * 30 - 15
    imageData.data[i] += noise // R
    imageData.data[i + 1] += noise // G
    imageData.data[i + 2] += noise // B
  }
  ctx.putImageData(imageData, 0, 0)

  // Irregular overlapping shapes
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = `hsla(${Math.random() * 360}, 60%, 50%, 0.3)`
    ctx.beginPath()
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 100 + 20
    const sides = Math.floor(Math.random() * 5) + 3

    for (let j = 0; j < sides; j++) {
      const angle = (j / sides) * Math.PI * 2
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius
      if (j === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  // High-frequency details (lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1
  for (let i = 0; i < 100; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }
}

/**
 * Generate easy-to-process image (simple patterns)
 */
function generateEasyToProcessImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // Solid color blocks
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
  ]

  const blockCount = Math.floor(Math.random() * 3) + 2
  const blockWidth = width / blockCount

  for (let i = 0; i < blockCount; i++) {
    ctx.fillStyle = colors[i % colors.length]
    ctx.fillRect(i * blockWidth, 0, blockWidth, height)
  }

  // Simple geometric shapes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'

  // Circle
  ctx.beginPath()
  ctx.arc(width / 4, height / 2, Math.min(width, height) / 8, 0, Math.PI * 2)
  ctx.fill()

  // Square
  const squareSize = Math.min(width, height) / 6
  ctx.fillRect(width / 2 - squareSize / 2, height / 2 - squareSize / 2, squareSize, squareSize)

  // Triangle
  ctx.beginPath()
  ctx.moveTo((3 * width) / 4, height / 2 - Math.min(width, height) / 8)
  ctx.lineTo(
    (3 * width) / 4 + Math.min(width, height) / 8,
    height / 2 + Math.min(width, height) / 8
  )
  ctx.lineTo(
    (3 * width) / 4 - Math.min(width, height) / 8,
    height / 2 + Math.min(width, height) / 8
  )
  ctx.closePath()
  ctx.fill()
}
