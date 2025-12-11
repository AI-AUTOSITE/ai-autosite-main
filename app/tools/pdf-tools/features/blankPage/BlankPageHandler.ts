// app/tools/pdf-tools/features/blankPage/BlankPageHandler.ts
import { PDFDocument, rgb, PDFPage, StandardFonts } from 'pdf-lib'
import { PageData } from '../../types'

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type PageSizePreset = 
  | 'a4'
  | 'letter'
  | 'legal'
  | 'a3'
  | 'a5'
  | 'b5'
  | 'tabloid'
  | 'match-document'  // Match existing document's page size
  | 'custom'

export type PageTemplate = 
  | 'blank'
  | 'lined'           // Horizontal lines (notebook style)
  | 'grid'            // Square grid
  | 'dot-grid'        // Dot grid pattern
  | 'graph'           // Graph paper (smaller squares)
  | 'music-staff'     // Music notation staff
  | 'manuscript'      // Writing practice (wider spacing)
  | 'cornell-notes'   // Cornell note-taking format
  | 'checklist'       // Checkbox lines
  | 'calendar-month'  // Monthly calendar grid

export type PageOrientation = 'portrait' | 'landscape'

export interface PageSize {
  width: number   // in points (1 inch = 72 points)
  height: number  // in points
}

export interface BlankPageOptions {
  pageSize: PageSizePreset
  customSize?: PageSize
  orientation: PageOrientation
  template: PageTemplate
  backgroundColor?: { r: number; g: number; b: number }
  lineColor?: { r: number; g: number; b: number }
  lineOpacity?: number
  lineSpacing?: number    // in points
  margin?: number         // in points
  insertPosition: 'after' | 'before' | 'at-end' | 'at-start'
  count?: number          // Number of pages to insert
}

export const DEFAULT_BLANK_PAGE_OPTIONS: BlankPageOptions = {
  pageSize: 'match-document',
  orientation: 'portrait',
  template: 'blank',
  backgroundColor: { r: 255, g: 255, b: 255 },
  lineColor: { r: 200, g: 200, b: 200 },
  lineOpacity: 1,
  lineSpacing: 24, // ~8.5mm
  margin: 50,
  insertPosition: 'after',
  count: 1,
}

// Standard page sizes in points (72 points = 1 inch)
export const PAGE_SIZES: Record<Exclude<PageSizePreset, 'match-document' | 'custom'>, PageSize> = {
  a4: { width: 595.276, height: 841.890 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 },
  a3: { width: 841.890, height: 1190.551 },
  a5: { width: 419.528, height: 595.276 },
  b5: { width: 498.898, height: 708.661 },
  tabloid: { width: 792, height: 1224 },
}

// ============================================================
// TEMPLATE DRAWING FUNCTIONS
// ============================================================

function drawLinedTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 50
  const spacing = options.lineSpacing || 24
  const color = options.lineColor || { r: 200, g: 200, b: 200 }
  const opacity = options.lineOpacity || 1

  // Draw horizontal lines
  for (let y = height - margin; y >= margin; y -= spacing) {
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }
}

function drawGridTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 50
  const spacing = options.lineSpacing || 24
  const color = options.lineColor || { r: 200, g: 200, b: 200 }
  const opacity = options.lineOpacity || 1

  // Draw horizontal lines
  for (let y = height - margin; y >= margin; y -= spacing) {
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }

  // Draw vertical lines
  for (let x = margin; x <= width - margin; x += spacing) {
    page.drawLine({
      start: { x, y: margin },
      end: { x, y: height - margin },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }
}

function drawDotGridTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 50
  const spacing = options.lineSpacing || 20
  const color = options.lineColor || { r: 180, g: 180, b: 180 }
  const opacity = options.lineOpacity || 1

  // Draw dots
  for (let y = height - margin; y >= margin; y -= spacing) {
    for (let x = margin; x <= width - margin; x += spacing) {
      page.drawCircle({
        x,
        y,
        size: 1,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        opacity,
      })
    }
  }
}

function drawGraphTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 30
  const smallSpacing = 5 // Small grid (~2mm)
  const largeSpacing = 25 // Large grid (~1cm)
  const color = options.lineColor || { r: 200, g: 200, b: 200 }
  const opacity = options.lineOpacity || 1

  // Draw small grid
  for (let y = height - margin; y >= margin; y -= smallSpacing) {
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.25,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity: opacity * 0.5,
    })
  }
  for (let x = margin; x <= width - margin; x += smallSpacing) {
    page.drawLine({
      start: { x, y: margin },
      end: { x, y: height - margin },
      thickness: 0.25,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity: opacity * 0.5,
    })
  }

  // Draw large grid
  for (let y = height - margin; y >= margin; y -= largeSpacing) {
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }
  for (let x = margin; x <= width - margin; x += largeSpacing) {
    page.drawLine({
      start: { x, y: margin },
      end: { x, y: height - margin },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }
}

function drawMusicStaffTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 50
  const staffSpacing = 8 // Space between lines in a staff
  const staffGap = 60 // Space between staves
  const color = options.lineColor || { r: 0, g: 0, b: 0 }
  const opacity = options.lineOpacity || 1

  let y = height - margin - 20

  while (y > margin + staffSpacing * 5) {
    // Draw 5 lines for each staff
    for (let line = 0; line < 5; line++) {
      page.drawLine({
        start: { x: margin, y: y - (line * staffSpacing) },
        end: { x: width - margin, y: y - (line * staffSpacing) },
        thickness: 0.75,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        opacity,
      })
    }
    y -= (staffSpacing * 4) + staffGap
  }
}

function drawManuscriptTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 60
  const spacing = options.lineSpacing || 36 // Wider spacing for writing
  const color = options.lineColor || { r: 180, g: 180, b: 180 }
  const opacity = options.lineOpacity || 1

  // Draw main lines
  for (let y = height - margin; y >= margin; y -= spacing) {
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.75,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }

  // Draw margin line
  page.drawLine({
    start: { x: margin + 30, y: margin },
    end: { x: margin + 30, y: height - margin },
    thickness: 0.5,
    color: rgb(255 / 255, 100 / 255, 100 / 255), // Red margin line
    opacity,
  })
}

function drawCornellNotesTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 40
  const color = options.lineColor || { r: 150, g: 150, b: 150 }
  const opacity = options.lineOpacity || 1

  const cueColumnWidth = 150
  const summaryHeight = 100

  // Main note-taking area lines
  const lineSpacing = 24
  for (let y = height - margin - 50; y >= margin + summaryHeight; y -= lineSpacing) {
    page.drawLine({
      start: { x: margin + cueColumnWidth, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }

  // Cue column vertical line
  page.drawLine({
    start: { x: margin + cueColumnWidth, y: margin + summaryHeight },
    end: { x: margin + cueColumnWidth, y: height - margin },
    thickness: 1,
    color: rgb(color.r / 255, color.g / 255, color.b / 255),
    opacity,
  })

  // Summary section horizontal line
  page.drawLine({
    start: { x: margin, y: margin + summaryHeight },
    end: { x: width - margin, y: margin + summaryHeight },
    thickness: 1,
    color: rgb(color.r / 255, color.g / 255, color.b / 255),
    opacity,
  })
}

function drawChecklistTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 50
  const spacing = options.lineSpacing || 30
  const color = options.lineColor || { r: 200, g: 200, b: 200 }
  const opacity = options.lineOpacity || 1

  const checkboxSize = 12
  const checkboxMargin = 30

  for (let y = height - margin - 20; y >= margin; y -= spacing) {
    // Draw checkbox
    page.drawRectangle({
      x: margin,
      y: y - checkboxSize / 2,
      width: checkboxSize,
      height: checkboxSize,
      borderColor: rgb(color.r / 255, color.g / 255, color.b / 255),
      borderWidth: 1,
      opacity,
    })

    // Draw line
    page.drawLine({
      start: { x: margin + checkboxSize + checkboxMargin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }
}

function drawCalendarMonthTemplate(
  page: PDFPage, 
  options: BlankPageOptions
): void {
  const { width, height } = page.getSize()
  const margin = options.margin || 40
  const color = options.lineColor || { r: 150, g: 150, b: 150 }
  const opacity = options.lineOpacity || 1

  const headerHeight = 60
  const cellWidth = (width - 2 * margin) / 7
  const rows = 6
  const cellHeight = (height - 2 * margin - headerHeight) / rows

  // Draw grid
  for (let row = 0; row <= rows; row++) {
    const y = height - margin - headerHeight - (row * cellHeight)
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }

  for (let col = 0; col <= 7; col++) {
    const x = margin + (col * cellWidth)
    page.drawLine({
      start: { x, y: margin },
      end: { x, y: height - margin - headerHeight },
      thickness: 0.5,
      color: rgb(color.r / 255, color.g / 255, color.b / 255),
      opacity,
    })
  }

  // Draw header divider
  page.drawLine({
    start: { x: margin, y: height - margin - headerHeight },
    end: { x: width - margin, y: height - margin - headerHeight },
    thickness: 1,
    color: rgb(color.r / 255, color.g / 255, color.b / 255),
    opacity,
  })
}

function applyTemplate(page: PDFPage, options: BlankPageOptions): void {
  switch (options.template) {
    case 'lined':
      drawLinedTemplate(page, options)
      break
    case 'grid':
      drawGridTemplate(page, options)
      break
    case 'dot-grid':
      drawDotGridTemplate(page, options)
      break
    case 'graph':
      drawGraphTemplate(page, options)
      break
    case 'music-staff':
      drawMusicStaffTemplate(page, options)
      break
    case 'manuscript':
      drawManuscriptTemplate(page, options)
      break
    case 'cornell-notes':
      drawCornellNotesTemplate(page, options)
      break
    case 'checklist':
      drawChecklistTemplate(page, options)
      break
    case 'calendar-month':
      drawCalendarMonthTemplate(page, options)
      break
    case 'blank':
    default:
      // No template - just blank page
      break
  }
}

// ============================================================
// MAIN HANDLER CLASS
// ============================================================

export class BlankPageHandler {
  /**
   * Get page size in points
   */
  static getPageSize(
    preset: PageSizePreset, 
    orientation: PageOrientation,
    customSize?: PageSize,
    existingPageSize?: PageSize
  ): PageSize {
    let size: PageSize

    if (preset === 'match-document' && existingPageSize) {
      size = { ...existingPageSize }
    } else if (preset === 'custom' && customSize) {
      size = { ...customSize }
    } else if (preset !== 'match-document' && preset !== 'custom') {
      size = { ...PAGE_SIZES[preset] }
    } else {
      size = { ...PAGE_SIZES.a4 } // Default fallback
    }

    // Apply orientation
    if (orientation === 'landscape' && size.width < size.height) {
      return { width: size.height, height: size.width }
    } else if (orientation === 'portrait' && size.width > size.height) {
      return { width: size.height, height: size.width }
    }

    return size
  }

  /**
   * Insert blank pages with templates into PDF
   */
  static async insertBlankPagesInPDF(
    file: File, 
    insertAfterPages: number[],
    options: Partial<BlankPageOptions> = {}
  ): Promise<Uint8Array> {
    const opts: BlankPageOptions = { ...DEFAULT_BLANK_PAGE_OPTIONS, ...options }
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const newPdfDoc = await PDFDocument.create()
    const totalPages = pdfDoc.getPageCount()

    // Get reference page size (first page)
    const refPage = pdfDoc.getPage(0)
    const refSize = refPage.getSize()

    const pageSize = this.getPageSize(
      opts.pageSize, 
      opts.orientation,
      opts.customSize,
      refSize
    )

    // Handle insert at start
    if (opts.insertPosition === 'at-start') {
      for (let i = 0; i < (opts.count || 1); i++) {
        const blankPage = newPdfDoc.addPage([pageSize.width, pageSize.height])
        
        // Apply background color
        if (opts.backgroundColor && (opts.backgroundColor.r !== 255 || opts.backgroundColor.g !== 255 || opts.backgroundColor.b !== 255)) {
          blankPage.drawRectangle({
            x: 0,
            y: 0,
            width: pageSize.width,
            height: pageSize.height,
            color: rgb(opts.backgroundColor.r / 255, opts.backgroundColor.g / 255, opts.backgroundColor.b / 255),
          })
        }
        
        applyTemplate(blankPage, opts)
      }
    }

    // Process existing pages
    for (let i = 0; i < totalPages; i++) {
      // Copy existing page
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
      newPdfDoc.addPage(copiedPage)

      // Check if we should insert blank pages after this page
      if (insertAfterPages.includes(i + 1) && opts.insertPosition !== 'at-start' && opts.insertPosition !== 'at-end') {
        for (let j = 0; j < (opts.count || 1); j++) {
          const blankPage = newPdfDoc.addPage([pageSize.width, pageSize.height])
          
          if (opts.backgroundColor && (opts.backgroundColor.r !== 255 || opts.backgroundColor.g !== 255 || opts.backgroundColor.b !== 255)) {
            blankPage.drawRectangle({
              x: 0,
              y: 0,
              width: pageSize.width,
              height: pageSize.height,
              color: rgb(opts.backgroundColor.r / 255, opts.backgroundColor.g / 255, opts.backgroundColor.b / 255),
            })
          }
          
          applyTemplate(blankPage, opts)
        }
      }
    }

    // Handle insert at end
    if (opts.insertPosition === 'at-end') {
      for (let i = 0; i < (opts.count || 1); i++) {
        const blankPage = newPdfDoc.addPage([pageSize.width, pageSize.height])
        
        if (opts.backgroundColor && (opts.backgroundColor.r !== 255 || opts.backgroundColor.g !== 255 || opts.backgroundColor.b !== 255)) {
          blankPage.drawRectangle({
            x: 0,
            y: 0,
            width: pageSize.width,
            height: pageSize.height,
            color: rgb(opts.backgroundColor.r / 255, opts.backgroundColor.g / 255, opts.backgroundColor.b / 255),
          })
        }
        
        applyTemplate(blankPage, opts)
      }
    }

    return await newPdfDoc.save()
  }

  /**
   * Auto-insert blank pages for duplex printing
   * (ensures each section starts on a right-hand page)
   */
  static async insertForDuplexPrinting(
    file: File,
    sectionStartPages: number[], // Pages that should start on right-hand (odd) pages
    options: Partial<BlankPageOptions> = {}
  ): Promise<Uint8Array> {
    const opts: BlankPageOptions = { ...DEFAULT_BLANK_PAGE_OPTIONS, ...options }
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const newPdfDoc = await PDFDocument.create()
    const totalPages = pdfDoc.getPageCount()

    const refPage = pdfDoc.getPage(0)
    const refSize = refPage.getSize()
    const pageSize = this.getPageSize(opts.pageSize, opts.orientation, opts.customSize, refSize)

    let currentOutputPage = 0

    for (let i = 0; i < totalPages; i++) {
      const sourcePageNum = i + 1

      // Check if this is a section start that should be on an odd page
      if (sectionStartPages.includes(sourcePageNum)) {
        // If current output position is even (0-indexed), we're at an odd page number (1-indexed)
        // If we need to be on an odd page (right-hand), and we're currently at an even position,
        // we need to insert a blank page
        if (currentOutputPage % 2 !== 0) {
          // Insert blank page
          const blankPage = newPdfDoc.addPage([pageSize.width, pageSize.height])
          
          if (opts.backgroundColor && (opts.backgroundColor.r !== 255 || opts.backgroundColor.g !== 255 || opts.backgroundColor.b !== 255)) {
            blankPage.drawRectangle({
              x: 0,
              y: 0,
              width: pageSize.width,
              height: pageSize.height,
              color: rgb(opts.backgroundColor.r / 255, opts.backgroundColor.g / 255, opts.backgroundColor.b / 255),
            })
          }
          
          applyTemplate(blankPage, opts)
          currentOutputPage++
        }
      }

      // Copy the current page
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
      newPdfDoc.addPage(copiedPage)
      currentOutputPage++
    }

    return await newPdfDoc.save()
  }

  /**
   * Create a standalone template page PDF
   */
  static async createTemplatePDF(
    options: Partial<BlankPageOptions> = {},
    pageCount: number = 1
  ): Promise<Uint8Array> {
    const opts: BlankPageOptions = { ...DEFAULT_BLANK_PAGE_OPTIONS, ...options }
    const pdfDoc = await PDFDocument.create()

    const pageSize = this.getPageSize(
      opts.pageSize === 'match-document' ? 'a4' : opts.pageSize,
      opts.orientation,
      opts.customSize
    )

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.addPage([pageSize.width, pageSize.height])
      
      if (opts.backgroundColor && (opts.backgroundColor.r !== 255 || opts.backgroundColor.g !== 255 || opts.backgroundColor.b !== 255)) {
        page.drawRectangle({
          x: 0,
          y: 0,
          width: pageSize.width,
          height: pageSize.height,
          color: rgb(opts.backgroundColor.r / 255, opts.backgroundColor.g / 255, opts.backgroundColor.b / 255),
        })
      }
      
      applyTemplate(page, opts)
    }

    return await pdfDoc.save()
  }

  /**
   * Insert blank pages in memory (for UI preview)
   * Note: Templates are not rendered in memory preview, only in actual PDF
   */
  static insertBlankPagesInMemory(
    pages: PageData[], 
    insertAfterPages: number[],
    options: Partial<BlankPageOptions> = {}
  ): PageData[] {
    const opts: BlankPageOptions = { ...DEFAULT_BLANK_PAGE_OPTIONS, ...options }
    const result: PageData[] = []
    let insertedCount = 0
    const count = opts.count || 1

    // Handle insert at start
    if (opts.insertPosition === 'at-start') {
      for (let i = 0; i < count; i++) {
        insertedCount++
        result.push({
          id: `blank-${Date.now()}-${insertedCount}`,
          pageNumber: insertedCount,
          rotation: 0,
          thumbnail: this.getTemplateThumbnail(opts.template),
        })
      }
    }

    pages.forEach((page) => {
      result.push(page)

      // Check if we should insert blank pages after this page
      if (insertAfterPages.includes(page.pageNumber) && opts.insertPosition !== 'at-start' && opts.insertPosition !== 'at-end') {
        for (let i = 0; i < count; i++) {
          insertedCount++
          result.push({
            id: `blank-${Date.now()}-${insertedCount}`,
            pageNumber: page.pageNumber + 1,
            rotation: 0,
            thumbnail: this.getTemplateThumbnail(opts.template),
          })
        }
      }
    })

    // Handle insert at end
    if (opts.insertPosition === 'at-end') {
      for (let i = 0; i < count; i++) {
        insertedCount++
        result.push({
          id: `blank-${Date.now()}-${insertedCount}`,
          pageNumber: result.length + 1,
          rotation: 0,
          thumbnail: this.getTemplateThumbnail(opts.template),
        })
      }
    }

    // Renumber all pages
    return result.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }))
  }

  /**
   * Get a simple thumbnail representation for templates
   */
  private static getTemplateThumbnail(template: PageTemplate): string {
    // Base64 encoded simple thumbnails for different templates
    // These are just placeholder 1x1 pixels - in a real implementation, 
    // you'd generate actual preview images
    const thumbnails: Record<PageTemplate, string> = {
      'blank': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
      'lined': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP4/58BAwAH/AL+Sd4E2AAAAABJRU5ErkJggg==',
      'grid': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'dot-grid': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW1lCoAAAAASUVORK5CYII=',
      'graph': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAIFAQkYqt8AAAAASUVORK5CYII=',
      'music-staff': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'manuscript': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AAAgAC/wHkqHuRAAAAABJRU5ErkJggg==',
      'cornell-notes': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkMAIAAFEAId8sJ6IAAAAASUVORK5CYII=',
      'checklist': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP4DwQACfsC/Wj6HN4AAAAASUVORK5CYII=',
      'calendar-month': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkyAMAAKMA7tQK3ZQAAAAASUVORK5CYII=',
    }
    return thumbnails[template] || thumbnails.blank
  }
}
