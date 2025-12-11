// app/tools/pdf-tools/features/watermark/WatermarkHandler.ts
import { PDFDocument, rgb, degrees, StandardFonts, PDFPage, PDFFont } from 'pdf-lib'

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type WatermarkPosition = 
  | 'center' 
  | 'top-left' 
  | 'top-center'
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center'
  | 'bottom-right' 
  | 'diagonal'
  | 'tile'          // Tile/mosaic pattern across entire page

export type WatermarkPreset = 
  | 'confidential'
  | 'draft'
  | 'approved'
  | 'sample'
  | 'copy'
  | 'do-not-copy'
  | 'for-review'
  | 'final'
  | 'internal'
  | 'custom'

export interface WatermarkOptions {
  type: 'text' | 'image'
  text?: string
  imageData?: Uint8Array
  position: WatermarkPosition
  opacity: number // 0-1
  fontSize?: number
  rotation?: number
  color?: { r: number; g: number; b: number }
  scale?: number // For images
  // New features
  preset?: WatermarkPreset
  dynamicText?: boolean      // Enable {date}, {page}, {total}, etc.
  tileSpacing?: number       // Spacing between tiles (for tile position)
  tileRows?: number          // Number of rows in tile pattern
  tileCols?: number          // Number of columns in tile pattern
}

export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  type: 'text',
  text: 'WATERMARK',
  position: 'center',
  opacity: 0.3,
  fontSize: 50,
  rotation: 0,
  color: { r: 0.5, g: 0.5, b: 0.5 },
  scale: 0.2,
  preset: 'custom',
  dynamicText: false,
  tileSpacing: 150,
  tileRows: 5,
  tileCols: 3,
}

// Preset configurations
export const WATERMARK_PRESETS: Record<WatermarkPreset, Partial<WatermarkOptions>> = {
  confidential: {
    text: 'CONFIDENTIAL',
    color: { r: 0.8, g: 0.1, b: 0.1 },
    fontSize: 60,
    position: 'diagonal',
    opacity: 0.25,
  },
  draft: {
    text: 'DRAFT',
    color: { r: 0.5, g: 0.5, b: 0.5 },
    fontSize: 70,
    position: 'diagonal',
    opacity: 0.2,
  },
  approved: {
    text: 'APPROVED',
    color: { r: 0.1, g: 0.6, b: 0.1 },
    fontSize: 55,
    position: 'diagonal',
    opacity: 0.25,
  },
  sample: {
    text: 'SAMPLE',
    color: { r: 0.5, g: 0.5, b: 0.5 },
    fontSize: 65,
    position: 'diagonal',
    opacity: 0.2,
  },
  copy: {
    text: 'COPY',
    color: { r: 0.5, g: 0.5, b: 0.5 },
    fontSize: 70,
    position: 'diagonal',
    opacity: 0.2,
  },
  'do-not-copy': {
    text: 'DO NOT COPY',
    color: { r: 0.8, g: 0.1, b: 0.1 },
    fontSize: 50,
    position: 'diagonal',
    opacity: 0.25,
  },
  'for-review': {
    text: 'FOR REVIEW ONLY',
    color: { r: 0.8, g: 0.5, b: 0.0 },
    fontSize: 45,
    position: 'diagonal',
    opacity: 0.25,
  },
  final: {
    text: 'FINAL',
    color: { r: 0.1, g: 0.3, b: 0.7 },
    fontSize: 70,
    position: 'diagonal',
    opacity: 0.2,
  },
  internal: {
    text: 'INTERNAL USE ONLY',
    color: { r: 0.5, g: 0.5, b: 0.5 },
    fontSize: 40,
    position: 'diagonal',
    opacity: 0.2,
  },
  custom: {},
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Parse dynamic text placeholders
 * Supported: {date}, {time}, {datetime}, {page}, {total}, {year}, {month}, {day}
 */
function parseDynamicText(
  text: string,
  pageNumber: number,
  totalPages: number
): string {
  const now = new Date()
  
  const year = now.getFullYear().toString()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  
  return text
    .replace(/{date}/gi, `${year}-${month}-${day}`)
    .replace(/{time}/gi, `${hours}:${minutes}`)
    .replace(/{datetime}/gi, `${year}-${month}-${day} ${hours}:${minutes}`)
    .replace(/{page}/gi, pageNumber.toString())
    .replace(/{total}/gi, totalPages.toString())
    .replace(/{year}/gi, year)
    .replace(/{month}/gi, month)
    .replace(/{day}/gi, day)
    .replace(/{n}/gi, pageNumber.toString())
}

/**
 * Calculate position coordinates
 */
function calculatePosition(
  position: WatermarkPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number,
  margin: number = 50
): { x: number; y: number } {
  let x: number, y: number

  switch (position) {
    case 'center':
    case 'diagonal':
    case 'tile':
      x = (pageWidth - textWidth) / 2
      y = (pageHeight - textHeight) / 2
      break
    case 'top-left':
      x = margin
      y = pageHeight - margin - textHeight
      break
    case 'top-center':
      x = (pageWidth - textWidth) / 2
      y = pageHeight - margin - textHeight
      break
    case 'top-right':
      x = pageWidth - textWidth - margin
      y = pageHeight - margin - textHeight
      break
    case 'bottom-left':
      x = margin
      y = margin
      break
    case 'bottom-center':
      x = (pageWidth - textWidth) / 2
      y = margin
      break
    case 'bottom-right':
      x = pageWidth - textWidth - margin
      y = margin
      break
    default:
      x = (pageWidth - textWidth) / 2
      y = (pageHeight - textHeight) / 2
  }

  return { x, y }
}

/**
 * Generate tile positions for mosaic pattern
 */
function generateTilePositions(
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number,
  rows: number,
  cols: number,
  spacing: number
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = []
  
  const totalWidth = (cols - 1) * spacing + textWidth
  const totalHeight = (rows - 1) * spacing + textHeight
  
  const startX = (pageWidth - totalWidth) / 2
  const startY = (pageHeight - totalHeight) / 2

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Offset alternate rows for better coverage
      const offsetX = row % 2 === 1 ? spacing / 2 : 0
      positions.push({
        x: startX + col * spacing + offsetX,
        y: startY + row * spacing,
      })
    }
  }

  return positions
}

// ============================================================
// MAIN HANDLER CLASS
// ============================================================

export class WatermarkHandler {
  /**
   * Add watermark to PDF with enhanced options
   */
  static async addWatermark(
    file: File, 
    options: Partial<WatermarkOptions> = {}
  ): Promise<Uint8Array> {
    // Apply preset if specified
    let opts: WatermarkOptions = { ...DEFAULT_WATERMARK_OPTIONS }
    
    if (options.preset && options.preset !== 'custom') {
      opts = { ...opts, ...WATERMARK_PRESETS[options.preset] }
    }
    opts = { ...opts, ...options }

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pages = pdfDoc.getPages()
    const totalPages = pages.length

    if (opts.type === 'text' && opts.text) {
      await this.addTextWatermark(pdfDoc, pages, totalPages, opts)
    } else if (opts.type === 'image' && opts.imageData) {
      await this.addImageWatermark(pdfDoc, pages, opts)
    }

    return await pdfDoc.save()
  }

  /**
   * Add text watermark with dynamic text and tile support
   */
  private static async addTextWatermark(
    pdfDoc: PDFDocument,
    pages: PDFPage[],
    totalPages: number,
    options: WatermarkOptions
  ): Promise<void> {
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = options.fontSize || 50
    const opacity = options.opacity || 0.3
    const rotation = options.position === 'diagonal' ? 45 : (options.rotation || 0)
    const color = options.color || { r: 0.5, g: 0.5, b: 0.5 }

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const page = pages[pageIndex]
      const { width, height } = page.getSize()
      const pageNumber = pageIndex + 1

      // Parse dynamic text if enabled
      let text = options.text || 'WATERMARK'
      if (options.dynamicText) {
        text = parseDynamicText(text, pageNumber, totalPages)
      }

      const textWidth = font.widthOfTextAtSize(text, fontSize)
      const textHeight = font.heightAtSize(fontSize)

      if (options.position === 'tile') {
        // Tile/mosaic pattern
        const positions = generateTilePositions(
          width,
          height,
          textWidth,
          textHeight,
          options.tileRows || 5,
          options.tileCols || 3,
          options.tileSpacing || 150
        )

        for (const pos of positions) {
          page.drawText(text, {
            x: pos.x,
            y: pos.y,
            size: fontSize,
            font,
            color: rgb(color.r, color.g, color.b),
            opacity,
            rotate: degrees(rotation),
          })
        }
      } else {
        // Single watermark
        const { x, y } = calculatePosition(
          options.position,
          width,
          height,
          textWidth,
          textHeight
        )

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(color.r, color.g, color.b),
          opacity,
          rotate: degrees(rotation),
        })
      }
    }
  }

  /**
   * Add image watermark with tile support
   */
  private static async addImageWatermark(
    pdfDoc: PDFDocument,
    pages: PDFPage[],
    options: WatermarkOptions
  ): Promise<void> {
    if (!options.imageData) return

    // Detect image type and embed
    let image
    try {
      image = await pdfDoc.embedPng(options.imageData)
    } catch {
      try {
        image = await pdfDoc.embedJpg(options.imageData)
      } catch (error) {
        throw new Error('Unsupported image format. Please use PNG or JPEG.')
      }
    }

    const scale = options.scale || 0.2
    const opacity = options.opacity || 0.3
    const rotation = options.rotation || 0
    const imgWidth = image.width * scale
    const imgHeight = image.height * scale

    for (const page of pages) {
      const { width, height } = page.getSize()

      if (options.position === 'tile') {
        // Tile pattern for images
        const positions = generateTilePositions(
          width,
          height,
          imgWidth,
          imgHeight,
          options.tileRows || 3,
          options.tileCols || 3,
          options.tileSpacing || 200
        )

        for (const pos of positions) {
          page.drawImage(image, {
            x: pos.x,
            y: pos.y,
            width: imgWidth,
            height: imgHeight,
            opacity,
            rotate: degrees(rotation),
          })
        }
      } else {
        // Single watermark
        const { x, y } = calculatePosition(
          options.position,
          width,
          height,
          imgWidth,
          imgHeight
        )

        page.drawImage(image, {
          x,
          y,
          width: imgWidth,
          height: imgHeight,
          opacity,
          rotate: degrees(rotation),
        })
      }
    }
  }

  /**
   * Add watermark with preset
   */
  static async addPresetWatermark(
    file: File,
    preset: WatermarkPreset,
    customOptions?: Partial<WatermarkOptions>
  ): Promise<Uint8Array> {
    return this.addWatermark(file, {
      preset,
      ...customOptions,
    })
  }

  /**
   * Add dynamic watermark with date/page number
   */
  static async addDynamicWatermark(
    file: File,
    text: string,
    options?: Partial<WatermarkOptions>
  ): Promise<Uint8Array> {
    return this.addWatermark(file, {
      text,
      dynamicText: true,
      ...options,
    })
  }

  /**
   * Add tile/mosaic watermark
   */
  static async addTileWatermark(
    file: File,
    text: string,
    options?: Partial<WatermarkOptions>
  ): Promise<Uint8Array> {
    return this.addWatermark(file, {
      text,
      position: 'tile',
      ...options,
    })
  }

  /**
   * Preview watermark text with dynamic variables
   */
  static previewDynamicText(
    text: string,
    pageNumber: number = 1,
    totalPages: number = 10
  ): string {
    return parseDynamicText(text, pageNumber, totalPages)
  }

  /**
   * Get available dynamic text variables
   */
  static getDynamicVariables(): Array<{ variable: string; description: string; example: string }> {
    const now = new Date()
    return [
      { variable: '{date}', description: 'Current date', example: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}` },
      { variable: '{time}', description: 'Current time', example: `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}` },
      { variable: '{datetime}', description: 'Date and time', example: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}` },
      { variable: '{page}', description: 'Page number', example: '1' },
      { variable: '{total}', description: 'Total pages', example: '10' },
      { variable: '{year}', description: 'Current year', example: now.getFullYear().toString() },
      { variable: '{month}', description: 'Current month', example: (now.getMonth()+1).toString().padStart(2,'0') },
      { variable: '{day}', description: 'Current day', example: now.getDate().toString().padStart(2,'0') },
    ]
  }

  /**
   * Batch processing for multiple files
   */
  static async batchAddWatermark(
    files: File[],
    options: Partial<WatermarkOptions>
  ): Promise<{ filename: string; data: Uint8Array }[]> {
    const results = []

    for (const file of files) {
      const watermarkedPdf = await this.addWatermark(file, options)
      results.push({
        filename: `watermarked_${file.name}`,
        data: watermarkedPdf,
      })
    }

    return results
  }
}

// Export utility functions and types
export { parseDynamicText }
