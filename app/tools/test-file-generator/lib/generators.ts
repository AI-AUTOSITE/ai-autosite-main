// app/tools/test-file-generator/lib/generators.ts

import jsPDF from 'jspdf'
import { GeneratorSettings } from './types'
import { generateText, calculateWordCount } from './textGenerator'
import { generateImage } from './imageGenerator'

/**
 * Generate PDF based on settings
 */
export function generatePDF(settings: GeneratorSettings): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20

  // Calculate actual page count based on target size
  const estimatedPages = estimatePageCount(settings)
  const finalPageCount = Math.max(1, Math.min(estimatedPages, 50)) // Max 50 pages

  for (let pageNum = 0; pageNum < finalPageCount; pageNum++) {
    if (pageNum > 0) pdf.addPage()

    // Random placement for this page
    const placement = getRandomPlacement()

    if (placement === 'full') {
      // Full page image
      const imageData = generateImage(settings.imageType, 'large')
      pdf.addImage(imageData, 'JPEG', 0, 0, pageWidth, pageHeight)
    } else {
      // Mixed text and images
      let yPosition = margin

      // Add text
      if (settings.textAmount > 0) {
        const wordCount = calculateWordCount(settings.textAmount)
        const text = generateText(settings.language, wordCount)

        pdf.setFontSize(11)
        pdf.setTextColor(0, 0, 0)

        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
        const textHeight = lines.length * 5 // Approximate line height

        if (placement === 'top' || placement === 'mixed') {
          pdf.text(lines, margin, yPosition)
          yPosition += textHeight + 10
        }

        // Add images
        for (let i = 0; i < settings.imagesPerPage; i++) {
          if (yPosition + 100 > pageHeight - margin) break // Not enough space

          const imageData = generateImage(settings.imageType, settings.imageSize)
          const imgWidth = pageWidth - 2 * margin
          const imgHeight = 80 // Fixed height for consistency

          pdf.addImage(imageData, 'JPEG', margin, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 10
        }

        // Add remaining text at bottom if placement is 'bottom' or 'mixed'
        if (
          (placement === 'bottom' || placement === 'mixed') &&
          yPosition < pageHeight - margin - 20
        ) {
          const remainingLines = pdf.splitTextToSize(text.substring(0, 200), pageWidth - 2 * margin)
          pdf.text(remainingLines, margin, yPosition)
        }
      }
    }
  }

  return pdf
}

/**
 * Get random placement for page content
 */
function getRandomPlacement(): 'top' | 'bottom' | 'mixed' | 'full' {
  const rand = Math.random()
  if (rand < 0.15) return 'full' // 15% full page images
  if (rand < 0.4) return 'top' // 25% images at top
  if (rand < 0.65) return 'bottom' // 25% images at bottom
  return 'mixed' // 35% mixed layout
}

/**
 * Estimate page count based on target file size
 */
function estimatePageCount(settings: GeneratorSettings): number {
  // Rough estimation: 1 page ≈ 50-200KB depending on content
  const baseKBPerPage = 100
  const imageMultiplier =
    settings.imageSize === 'large' ? 1.5 : settings.imageSize === 'medium' ? 1.2 : 1
  const estimatedKBPerPage = baseKBPerPage * imageMultiplier

  const targetKB = settings.targetSizeMB * 1024
  const estimatedPages = Math.round(targetKB / estimatedKBPerPage)

  return estimatedPages
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `test-file-${year}${month}${day}-${hours}${minutes}${seconds}.pdf`
}

/**
 * Estimate file size in MB
 */
export function estimateFileSize(settings: GeneratorSettings): number {
  const baseKBPerPage = 100
  const imageMultiplier =
    settings.imageSize === 'large' ? 1.5 : settings.imageSize === 'medium' ? 1.2 : 1
  const estimatedKBPerPage = baseKBPerPage * imageMultiplier
  const estimatedPages = estimatePageCount(settings)

  return (estimatedPages * estimatedKBPerPage) / 1024 // Convert to MB
}
