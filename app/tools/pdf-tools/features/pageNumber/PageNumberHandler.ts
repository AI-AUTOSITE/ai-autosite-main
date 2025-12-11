// app/tools/pdf-tools/features/pageNumber/PageNumberHandler.ts
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib'

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type PageNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center-left'
  | 'center-right'

export type NumberStyle = 
  | 'arabic'           // 1, 2, 3...
  | 'roman-lower'      // i, ii, iii, iv...
  | 'roman-upper'      // I, II, III, IV...
  | 'alpha-lower'      // a, b, c...
  | 'alpha-upper'      // A, B, C...

export type PageNumberFormat = 
  | 'number-only'      // 1
  | 'page-x'           // Page 1
  | 'x-of-y'           // 1 of 10
  | 'page-x-of-y'      // Page 1 of 10
  | 'dashed'           // - 1 -
  | 'bracketed'        // [1]
  | 'parentheses'      // (1)
  | 'custom'           // Custom template

export interface PageNumberOptions {
  position: PageNumberPosition
  format: PageNumberFormat
  numberStyle: NumberStyle
  startFrom: number
  fontSize?: number
  margin?: number
  color?: { r: number; g: number; b: number }
  skipFirst?: boolean
  customTemplate?: string  // e.g., "Page {n} of {total}" or "Chapter 1 - {n}"
  prefix?: string          // e.g., "SEC-" for section numbering
  suffix?: string          // e.g., "-A" for appendix
  pageRanges?: PageRange[] // For section-based numbering
}

export interface PageRange {
  start: number      // 1-indexed
  end: number        // 1-indexed, inclusive
  style: NumberStyle
  prefix?: string
  startFrom?: number // Restart numbering from this value
}

// Bates Numbering Options
export interface BatesOptions {
  prefix: string           // e.g., "ABC"
  startNumber: number      // e.g., 1
  numberOfDigits: number   // e.g., 6 → "ABC000001"
  suffix?: string          // e.g., "-CONF"
  position: PageNumberPosition
  fontSize?: number
  margin?: number
  color?: { r: number; g: number; b: number }
  dateStamp?: boolean      // Add date to Bates number
  dateFormat?: 'MMDDYYYY' | 'DDMMYYYY' | 'YYYYMMDD'
}

// Default options
export const DEFAULT_PAGE_NUMBER_OPTIONS: PageNumberOptions = {
  position: 'bottom-center',
  format: 'number-only',
  numberStyle: 'arabic',
  startFrom: 1,
  fontSize: 12,
  margin: 30,
  color: { r: 0, g: 0, b: 0 },
  skipFirst: false,
}

export const DEFAULT_BATES_OPTIONS: BatesOptions = {
  prefix: '',
  startNumber: 1,
  numberOfDigits: 6,
  position: 'bottom-right',
  fontSize: 10,
  margin: 30,
  color: { r: 0, g: 0, b: 0 },
  dateStamp: false,
  dateFormat: 'MMDDYYYY',
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Convert Arabic number to Roman numeral
 */
function toRomanNumeral(num: number, lowercase: boolean = false): string {
  if (num <= 0 || num > 3999) return String(num) // Roman numerals only work 1-3999
  
  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]
  
  let result = ''
  let remaining = num
  
  for (const [value, numeral] of romanNumerals) {
    while (remaining >= value) {
      result += numeral
      remaining -= value
    }
  }
  
  return lowercase ? result.toLowerCase() : result
}

/**
 * Convert number to alphabetic (a, b, c... or A, B, C...)
 */
function toAlpha(num: number, lowercase: boolean = false): string {
  if (num <= 0) return String(num)
  
  let result = ''
  let remaining = num
  
  while (remaining > 0) {
    remaining-- // Adjust for 1-based indexing
    result = String.fromCharCode(65 + (remaining % 26)) + result
    remaining = Math.floor(remaining / 26)
  }
  
  return lowercase ? result.toLowerCase() : result
}

/**
 * Format number according to style
 */
function formatNumber(num: number, style: NumberStyle): string {
  switch (style) {
    case 'roman-lower':
      return toRomanNumeral(num, true)
    case 'roman-upper':
      return toRomanNumeral(num, false)
    case 'alpha-lower':
      return toAlpha(num, true)
    case 'alpha-upper':
      return toAlpha(num, false)
    case 'arabic':
    default:
      return String(num)
  }
}

/**
 * Format the complete page number text
 */
function formatPageNumber(
  pageNum: number,
  totalPages: number,
  format: PageNumberFormat,
  style: NumberStyle,
  customTemplate?: string,
  prefix?: string,
  suffix?: string
): string {
  const formattedNum = formatNumber(pageNum, style)
  const formattedTotal = formatNumber(totalPages, style)
  const pre = prefix || ''
  const suf = suffix || ''
  
  if (format === 'custom' && customTemplate) {
    return customTemplate
      .replace(/{n}/g, formattedNum)
      .replace(/{total}/g, formattedTotal)
      .replace(/{prefix}/g, pre)
      .replace(/{suffix}/g, suf)
  }
  
  let text = ''
  switch (format) {
    case 'page-x':
      text = `Page ${formattedNum}`
      break
    case 'x-of-y':
      text = `${formattedNum} of ${formattedTotal}`
      break
    case 'page-x-of-y':
      text = `Page ${formattedNum} of ${formattedTotal}`
      break
    case 'dashed':
      text = `- ${formattedNum} -`
      break
    case 'bracketed':
      text = `[${formattedNum}]`
      break
    case 'parentheses':
      text = `(${formattedNum})`
      break
    case 'number-only':
    default:
      text = formattedNum
  }
  
  return `${pre}${text}${suf}`
}

/**
 * Format Bates number
 */
function formatBatesNumber(
  index: number,
  options: BatesOptions
): string {
  const { prefix, startNumber, numberOfDigits, suffix, dateStamp, dateFormat } = options
  
  const number = startNumber + index
  const paddedNumber = String(number).padStart(numberOfDigits, '0')
  
  let result = `${prefix}${paddedNumber}`
  
  if (suffix) {
    result += suffix
  }
  
  if (dateStamp) {
    const now = new Date()
    let dateStr = ''
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const yyyy = String(now.getFullYear())
    
    switch (dateFormat) {
      case 'DDMMYYYY':
        dateStr = `${dd}${mm}${yyyy}`
        break
      case 'YYYYMMDD':
        dateStr = `${yyyy}${mm}${dd}`
        break
      case 'MMDDYYYY':
      default:
        dateStr = `${mm}${dd}${yyyy}`
    }
    
    result += `-${dateStr}`
  }
  
  return result
}

/**
 * Calculate text position based on page dimensions and position setting
 */
function calculatePosition(
  position: PageNumberPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  fontSize: number,
  margin: number
): { x: number; y: number } {
  let x = margin
  let y = margin
  
  // Horizontal position
  if (position.includes('center') && !position.includes('left') && !position.includes('right')) {
    x = pageWidth / 2 - textWidth / 2
  } else if (position.includes('right')) {
    x = pageWidth - margin - textWidth
  } else if (position.includes('center-left')) {
    x = margin
  } else if (position.includes('center-right')) {
    x = pageWidth - margin - textWidth
  }
  
  // Vertical position
  if (position.includes('top')) {
    y = pageHeight - margin - fontSize
  } else if (position.startsWith('center')) {
    y = pageHeight / 2 - fontSize / 2
  }
  // 'bottom' is default (y = margin)
  
  return { x, y }
}

// ============================================================
// MAIN HANDLER CLASS
// ============================================================

export class PageNumberHandler {
  /**
   * Add page numbers to PDF with full customization
   */
  static async addPageNumbers(
    file: File, 
    options: Partial<PageNumberOptions> = {}
  ): Promise<Uint8Array> {
    const opts: PageNumberOptions = { ...DEFAULT_PAGE_NUMBER_OPTIONS, ...options }
    const {
      position,
      format,
      numberStyle,
      startFrom,
      fontSize = 12,
      margin = 30,
      color = { r: 0, g: 0, b: 0 },
      skipFirst,
      customTemplate,
      prefix,
      suffix,
      pageRanges,
    } = opts

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const totalPages = pages.length

    pages.forEach((page, index) => {
      // Skip first page if requested
      if (skipFirst && index === 0) return

      // Determine numbering style and start for this page (section-based)
      let currentStyle = numberStyle
      let currentPrefix = prefix
      let pageNumber = index + startFrom

      if (pageRanges && pageRanges.length > 0) {
        const pageIndex = index + 1 // 1-indexed
        const range = pageRanges.find(r => pageIndex >= r.start && pageIndex <= r.end)
        
        if (range) {
          currentStyle = range.style
          currentPrefix = range.prefix || prefix
          if (range.startFrom !== undefined) {
            pageNumber = range.startFrom + (pageIndex - range.start)
          }
        }
      }

      // Format the text
      const text = formatPageNumber(
        pageNumber,
        totalPages,
        format,
        currentStyle,
        customTemplate,
        currentPrefix,
        suffix
      )

      const textWidth = font.widthOfTextAtSize(text, fontSize)
      const { width, height } = page.getSize()

      // Calculate position
      const { x, y } = calculatePosition(position, width, height, textWidth, fontSize, margin)

      // Draw the page number
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
      })
    })

    return await pdfDoc.save()
  }

  /**
   * Add Bates numbering to PDF (legal/eDiscovery standard)
   */
  static async addBatesNumbers(
    file: File,
    options: Partial<BatesOptions> = {}
  ): Promise<Uint8Array> {
    const opts: BatesOptions = { ...DEFAULT_BATES_OPTIONS, ...options }
    const {
      position,
      fontSize = 10,
      margin = 30,
      color = { r: 0, g: 0, b: 0 },
    } = opts

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Courier) // Monospace for Bates

    pages.forEach((page, index) => {
      const batesNumber = formatBatesNumber(index, opts)
      const textWidth = font.widthOfTextAtSize(batesNumber, fontSize)
      const { width, height } = page.getSize()

      const { x, y } = calculatePosition(position, width, height, textWidth, fontSize, margin)

      page.drawText(batesNumber, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
      })
    })

    return await pdfDoc.save()
  }

  /**
   * Add section-based numbering (different styles for different sections)
   * Example: Front matter (i, ii, iii), Body (1, 2, 3), Appendix (A-1, A-2)
   */
  static async addSectionNumbering(
    file: File,
    sections: PageRange[],
    options: Partial<PageNumberOptions> = {}
  ): Promise<Uint8Array> {
    return this.addPageNumbers(file, {
      ...options,
      pageRanges: sections,
    })
  }

  /**
   * Preview page numbers (returns array of what will be added)
   */
  static previewPageNumbers(
    totalPages: number,
    options: Partial<PageNumberOptions> = {}
  ): string[] {
    const opts: PageNumberOptions = { ...DEFAULT_PAGE_NUMBER_OPTIONS, ...options }
    const { format, numberStyle, startFrom, customTemplate, prefix, suffix, skipFirst, pageRanges } = opts

    const result: string[] = []

    for (let i = 0; i < totalPages; i++) {
      if (skipFirst && i === 0) {
        result.push('')
        continue
      }

      let currentStyle = numberStyle
      let currentPrefix = prefix
      let pageNumber = i + startFrom

      if (pageRanges && pageRanges.length > 0) {
        const pageIndex = i + 1
        const range = pageRanges.find(r => pageIndex >= r.start && pageIndex <= r.end)
        
        if (range) {
          currentStyle = range.style
          currentPrefix = range.prefix || prefix
          if (range.startFrom !== undefined) {
            pageNumber = range.startFrom + (pageIndex - range.start)
          }
        }
      }

      result.push(formatPageNumber(
        pageNumber,
        totalPages,
        format,
        currentStyle,
        customTemplate,
        currentPrefix,
        suffix
      ))
    }

    return result
  }

  /**
   * Preview Bates numbers
   */
  static previewBatesNumbers(
    totalPages: number,
    options: Partial<BatesOptions> = {}
  ): string[] {
    const opts: BatesOptions = { ...DEFAULT_BATES_OPTIONS, ...options }
    return Array.from({ length: totalPages }, (_, i) => formatBatesNumber(i, opts))
  }
}

// Export utility functions for external use
export { toRomanNumeral, toAlpha, formatNumber }
