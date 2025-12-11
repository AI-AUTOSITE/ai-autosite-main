/**
 * Convert Handler - 100% Browser-based PDF Conversion
 * 
 * Supports:
 * - PDF → Text (excellent quality)
 * - PDF → Images (PNG/JPEG, excellent quality)
 * - PDF → HTML (good quality)
 * 
 * All processing is done locally in the browser.
 */

import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

export type OutputFormat = 
  | 'text' 
  | 'png' 
  | 'jpeg' 
  | 'webp'
  | 'html'
  | 'markdown'

export interface ConvertOptions {
  format: OutputFormat
  quality?: number // 0-1 for image formats
  dpi?: number // Resolution for images
  pageRange?: number[] // Specific pages to convert
  includeImages?: boolean // For HTML/Markdown
  preserveFormatting?: boolean
}

export interface ConvertResult {
  format: OutputFormat
  data: string | Blob | Blob[]
  filename: string
  pageCount: number
  mimeType: string
}

export interface PageImage {
  pageNumber: number
  blob: Blob
  dataUrl: string
  width: number
  height: number
}

export interface ConvertProgress {
  status: 'loading' | 'converting' | 'complete' | 'error'
  progress: number
  message: string
  currentPage?: number
  totalPages?: number
}

const DEFAULT_OPTIONS: ConvertOptions = {
  format: 'text',
  quality: 0.92,
  dpi: 150,
  includeImages: false,
  preserveFormatting: true
}

export class ConvertHandler {
  // ============================================
  // PDF → TEXT (Excellent quality)
  // ============================================

  /**
   * Extract text from PDF
   */
  static async toText(
    file: File,
    options: Partial<ConvertOptions> = {},
    onProgress?: (progress: ConvertProgress) => void
  ): Promise<string> {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    
    onProgress?.({
      status: 'loading',
      progress: 0,
      message: 'Loading PDF...'
    })

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    const totalPages = pdf.numPages
    const textParts: string[] = []

    const pagesToProcess = opts.pageRange || 
      Array.from({ length: totalPages }, (_, i) => i + 1)

    for (let i = 0; i < pagesToProcess.length; i++) {
      const pageNum = pagesToProcess[i]
      
      onProgress?.({
        status: 'converting',
        progress: Math.round((i / pagesToProcess.length) * 100),
        message: `Extracting text from page ${pageNum}...`,
        currentPage: pageNum,
        totalPages
      })

      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      let pageText = ''
      let lastY = -1
      
      for (const item of textContent.items) {
        if ('str' in item) {
          // Check for line break (Y position change)
          const currentY = (item as any).transform?.[5] || 0
          if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
            pageText += '\n'
          }
          pageText += item.str
          lastY = currentY
        }
      }

      if (opts.preserveFormatting) {
        textParts.push(`=== Page ${pageNum} ===\n${pageText}`)
      } else {
        textParts.push(pageText)
      }
    }

    onProgress?.({
      status: 'complete',
      progress: 100,
      message: 'Text extraction complete'
    })

    return textParts.join('\n\n')
  }

  // ============================================
  // PDF → IMAGES (Excellent quality)
  // ============================================

  /**
   * Convert PDF pages to images
   */
  static async toImages(
    file: File,
    options: Partial<ConvertOptions> = {},
    onProgress?: (progress: ConvertProgress) => void
  ): Promise<PageImage[]> {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const format = opts.format as 'png' | 'jpeg' | 'webp'
    
    onProgress?.({
      status: 'loading',
      progress: 0,
      message: 'Loading PDF...'
    })

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    const totalPages = pdf.numPages
    const images: PageImage[] = []

    const pagesToProcess = opts.pageRange || 
      Array.from({ length: totalPages }, (_, i) => i + 1)

    for (let i = 0; i < pagesToProcess.length; i++) {
      const pageNum = pagesToProcess[i]
      
      onProgress?.({
        status: 'converting',
        progress: Math.round((i / pagesToProcess.length) * 100),
        message: `Converting page ${pageNum} to ${format.toUpperCase()}...`,
        currentPage: pageNum,
        totalPages
      })

      const page = await pdf.getPage(pageNum)
      const scale = (opts.dpi || 150) / 72 // PDF default is 72 DPI
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      
      const ctx = canvas.getContext('2d')!
      await page.render({
        canvasContext: ctx,
        viewport
      }).promise

      // Convert canvas to blob
      const mimeType = format === 'png' ? 'image/png' : 
                       format === 'webp' ? 'image/webp' : 'image/jpeg'
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b!),
          mimeType,
          opts.quality
        )
      })

      const dataUrl = canvas.toDataURL(mimeType, opts.quality)

      images.push({
        pageNumber: pageNum,
        blob,
        dataUrl,
        width: viewport.width,
        height: viewport.height
      })

      // Cleanup
      canvas.width = 0
      canvas.height = 0
    }

    onProgress?.({
      status: 'complete',
      progress: 100,
      message: 'Image conversion complete'
    })

    return images
  }

  /**
   * Convert single page to image
   */
  static async pageToImage(
    file: File,
    pageNumber: number,
    format: 'png' | 'jpeg' | 'webp' = 'png',
    dpi: number = 150,
    quality: number = 0.92
  ): Promise<PageImage> {
    const images = await this.toImages(file, {
      format,
      dpi,
      quality,
      pageRange: [pageNumber]
    })
    return images[0]
  }

  // ============================================
  // PDF → HTML (Good quality)
  // ============================================

  /**
   * Convert PDF to HTML
   */
  static async toHTML(
    file: File,
    options: Partial<ConvertOptions> = {},
    onProgress?: (progress: ConvertProgress) => void
  ): Promise<string> {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    
    onProgress?.({
      status: 'loading',
      progress: 0,
      message: 'Loading PDF...'
    })

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    const totalPages = pdf.numPages
    const htmlParts: string[] = []

    // HTML header
    htmlParts.push(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.name.replace(/\.pdf$/i, '')}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
    }
    .page {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    .page-number {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    .text-block {
      margin-bottom: 1rem;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
`)

    const pagesToProcess = opts.pageRange || 
      Array.from({ length: totalPages }, (_, i) => i + 1)

    for (let i = 0; i < pagesToProcess.length; i++) {
      const pageNum = pagesToProcess[i]
      
      onProgress?.({
        status: 'converting',
        progress: Math.round((i / pagesToProcess.length) * 100),
        message: `Converting page ${pageNum} to HTML...`,
        currentPage: pageNum,
        totalPages
      })

      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      let pageHtml = `<div class="page" data-page="${pageNum}">\n`
      pageHtml += `<div class="page-number">Page ${pageNum}</div>\n`

      // Group text by approximate Y position for paragraphs
      const lines: { y: number; text: string }[] = []
      
      for (const item of textContent.items) {
        if ('str' in item && item.str.trim()) {
          const y = Math.round((item as any).transform?.[5] || 0)
          const existingLine = lines.find(l => Math.abs(l.y - y) < 5)
          if (existingLine) {
            existingLine.text += ' ' + item.str
          } else {
            lines.push({ y, text: item.str })
          }
        }
      }

      // Sort by Y position (top to bottom)
      lines.sort((a, b) => b.y - a.y)

      // Convert to HTML paragraphs
      let currentParagraph = ''
      let lastY = lines[0]?.y || 0

      for (const line of lines) {
        if (lastY - line.y > 20) {
          // New paragraph
          if (currentParagraph) {
            pageHtml += `<div class="text-block"><p>${this.escapeHtml(currentParagraph.trim())}</p></div>\n`
          }
          currentParagraph = line.text
        } else {
          currentParagraph += ' ' + line.text
        }
        lastY = line.y
      }

      // Add remaining paragraph
      if (currentParagraph) {
        pageHtml += `<div class="text-block"><p>${this.escapeHtml(currentParagraph.trim())}</p></div>\n`
      }

      // Include page image if requested
      if (opts.includeImages) {
        const image = await this.pageToImage(file, pageNum, 'jpeg', 100, 0.8)
        pageHtml += `<img src="${image.dataUrl}" alt="Page ${pageNum}">\n`
      }

      pageHtml += `</div>\n`
      htmlParts.push(pageHtml)
    }

    // HTML footer
    htmlParts.push(`</body>\n</html>`)

    onProgress?.({
      status: 'complete',
      progress: 100,
      message: 'HTML conversion complete'
    })

    return htmlParts.join('')
  }

  // ============================================
  // PDF → MARKDOWN
  // ============================================

  /**
   * Convert PDF to Markdown
   */
  static async toMarkdown(
    file: File,
    options: Partial<ConvertOptions> = {},
    onProgress?: (progress: ConvertProgress) => void
  ): Promise<string> {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    
    onProgress?.({
      status: 'loading',
      progress: 0,
      message: 'Loading PDF...'
    })

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    const totalPages = pdf.numPages
    const mdParts: string[] = []

    // Title
    mdParts.push(`# ${file.name.replace(/\.pdf$/i, '')}\n`)

    const pagesToProcess = opts.pageRange || 
      Array.from({ length: totalPages }, (_, i) => i + 1)

    for (let i = 0; i < pagesToProcess.length; i++) {
      const pageNum = pagesToProcess[i]
      
      onProgress?.({
        status: 'converting',
        progress: Math.round((i / pagesToProcess.length) * 100),
        message: `Converting page ${pageNum} to Markdown...`,
        currentPage: pageNum,
        totalPages
      })

      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      mdParts.push(`\n## Page ${pageNum}\n`)

      // Extract and format text
      let currentText = ''
      let lastY = -1
      let lastFontSize = -1

      for (const item of textContent.items) {
        if ('str' in item && item.str.trim()) {
          const y = (item as any).transform?.[5] || 0
          const fontSize = (item as any).height || 12

          // Detect headers by font size
          if (lastFontSize > 0 && fontSize > lastFontSize * 1.2) {
            if (currentText) {
              mdParts.push(currentText.trim() + '\n')
              currentText = ''
            }
            mdParts.push(`\n### ${item.str.trim()}\n`)
            lastY = y
            lastFontSize = fontSize
            continue
          }

          // Line break detection
          if (lastY !== -1 && Math.abs(y - lastY) > 5) {
            currentText += '\n'
          } else if (currentText && !currentText.endsWith(' ')) {
            currentText += ' '
          }

          currentText += item.str
          lastY = y
          lastFontSize = fontSize
        }
      }

      if (currentText.trim()) {
        mdParts.push(currentText.trim() + '\n')
      }
    }

    onProgress?.({
      status: 'complete',
      progress: 100,
      message: 'Markdown conversion complete'
    })

    return mdParts.join('')
  }

  // ============================================
  // DOWNLOAD HELPERS
  // ============================================

  /**
   * Download text content
   */
  static downloadText(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    this.downloadBlob(blob, filename)
  }

  /**
   * Download HTML content
   */
  static downloadHTML(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
    this.downloadBlob(blob, filename)
  }

  /**
   * Download Markdown content
   */
  static downloadMarkdown(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    this.downloadBlob(blob, filename)
  }

  /**
   * Download single image
   */
  static downloadImage(image: PageImage, filename: string): void {
    this.downloadBlob(image.blob, filename)
  }

  /**
   * Download multiple images as ZIP
   */
  static async downloadImagesAsZip(
    images: PageImage[],
    baseName: string,
    format: 'png' | 'jpeg' | 'webp' = 'png'
  ): Promise<void> {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    const ext = format === 'jpeg' ? 'jpg' : format
    
    for (const image of images) {
      zip.file(`${baseName}_page_${image.pageNumber}.${ext}`, image.blob)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    this.downloadBlob(zipBlob, `${baseName}_images.zip`)
  }

  /**
   * Generic blob download
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ============================================
  // UTILITIES
  // ============================================

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, m => map[m])
  }

  /**
   * Get supported output formats
   */
  static getSupportedFormats(): { format: OutputFormat; name: string; quality: string }[] {
    return [
      { format: 'text', name: 'Plain Text', quality: '⭐⭐⭐⭐⭐ Excellent' },
      { format: 'png', name: 'PNG Images', quality: '⭐⭐⭐⭐⭐ Excellent' },
      { format: 'jpeg', name: 'JPEG Images', quality: '⭐⭐⭐⭐ Very Good' },
      { format: 'webp', name: 'WebP Images', quality: '⭐⭐⭐⭐ Very Good' },
      { format: 'html', name: 'HTML Document', quality: '⭐⭐⭐ Good' },
      { format: 'markdown', name: 'Markdown', quality: '⭐⭐⭐ Good' }
    ]
  }

  /**
   * Get page count
   */
  static async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    return pdf.numPages
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }
}

export default ConvertHandler
