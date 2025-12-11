// app/tools/pdf-tools/features/rotate/RotateHandler.ts
import { PDFDocument, degrees, PDFPage } from 'pdf-lib'
import { PageData } from '../../types'

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type RotationTarget = 
  | 'selected'      // Only selected pages
  | 'all'           // All pages
  | 'odd'           // Odd pages (1, 3, 5...)
  | 'even'          // Even pages (2, 4, 6...)
  | 'portrait'      // Portrait orientation pages
  | 'landscape'     // Landscape orientation pages
  | 'first'         // First page only
  | 'last'          // Last page only

export interface RotateOptions {
  angle: number              // Rotation angle in degrees (can be any value)
  target: RotationTarget     // Which pages to rotate
  direction?: 'clockwise' | 'counterclockwise'  // Direction hint (angle sign takes priority)
  normalizeAngle?: boolean   // Normalize to 0-359 range
}

export const DEFAULT_ROTATE_OPTIONS: RotateOptions = {
  angle: 90,
  target: 'selected',
  direction: 'clockwise',
  normalizeAngle: true,
}

// Common rotation presets
export const ROTATION_PRESETS = {
  clockwise90: { angle: 90, direction: 'clockwise' as const },
  counterclockwise90: { angle: -90, direction: 'counterclockwise' as const },
  rotate180: { angle: 180, direction: 'clockwise' as const },
  straighten5: { angle: 5, direction: 'clockwise' as const },
  straightenMinus5: { angle: -5, direction: 'counterclockwise' as const },
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Normalize angle to 0-359 range
 */
function normalizeAngle(angle: number): number {
  let normalized = angle % 360
  if (normalized < 0) normalized += 360
  return normalized
}

/**
 * Check if a page is in portrait orientation
 */
function isPortrait(page: PDFPage): boolean {
  const { width, height } = page.getSize()
  const rotation = page.getRotation().angle
  
  // Account for rotation when determining orientation
  if (rotation === 90 || rotation === 270) {
    return width > height // Rotated, so swap comparison
  }
  return height > width
}

/**
 * Get page indices based on rotation target
 */
function getTargetPageIndices(
  totalPages: number,
  target: RotationTarget,
  selectedIndices: number[],
  pdfPages?: PDFPage[]
): number[] {
  switch (target) {
    case 'selected':
      return selectedIndices
    case 'all':
      return Array.from({ length: totalPages }, (_, i) => i)
    case 'odd':
      return Array.from({ length: totalPages }, (_, i) => i).filter(i => (i + 1) % 2 === 1)
    case 'even':
      return Array.from({ length: totalPages }, (_, i) => i).filter(i => (i + 1) % 2 === 0)
    case 'portrait':
      if (!pdfPages) return []
      return Array.from({ length: totalPages }, (_, i) => i).filter(i => isPortrait(pdfPages[i]))
    case 'landscape':
      if (!pdfPages) return []
      return Array.from({ length: totalPages }, (_, i) => i).filter(i => !isPortrait(pdfPages[i]))
    case 'first':
      return totalPages > 0 ? [0] : []
    case 'last':
      return totalPages > 0 ? [totalPages - 1] : []
    default:
      return selectedIndices
  }
}

// ============================================================
// MAIN HANDLER CLASS
// ============================================================

export class RotateHandler {
  /**
   * Rotate pages in PDF file with full options
   */
  static async rotatePages(
    file: File,
    pages: PageData[],
    selectedPageIds: Set<string>,
    options: Partial<RotateOptions> = {}
  ): Promise<Uint8Array> {
    const opts: RotateOptions = { ...DEFAULT_ROTATE_OPTIONS, ...options }
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pdfPages = pdfDoc.getPages()
    const totalPages = pdfPages.length

    // Get selected page indices (0-based)
    const selectedIndices = pages
      .filter(p => selectedPageIds.has(p.id))
      .map(p => p.pageNumber - 1)

    // Determine which pages to rotate
    const targetIndices = getTargetPageIndices(
      totalPages,
      opts.target,
      selectedIndices,
      pdfPages
    )

    // Apply rotation
    for (const index of targetIndices) {
      if (index >= 0 && index < totalPages) {
        const page = pdfPages[index]
        const currentRotation = page.getRotation().angle
        let newAngle = currentRotation + opts.angle
        
        if (opts.normalizeAngle) {
          newAngle = normalizeAngle(newAngle)
        }
        
        page.setRotation(degrees(newAngle))
      }
    }

    return await pdfDoc.save()
  }

  /**
   * Rotate pages with simple parameters (backwards compatible)
   */
  static async rotatePagesSimple(
    file: File,
    pages: PageData[],
    selectedPageIds: Set<string>,
    angle: number = 90
  ): Promise<Uint8Array> {
    return this.rotatePages(file, pages, selectedPageIds, {
      angle,
      target: 'selected',
    })
  }

  /**
   * Rotate odd pages only
   */
  static async rotateOddPages(
    file: File,
    angle: number = 90
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pdfPages = pdfDoc.getPages()

    pdfPages.forEach((page, index) => {
      if ((index + 1) % 2 === 1) { // Odd pages (1, 3, 5...)
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees(normalizeAngle(currentRotation + angle)))
      }
    })

    return await pdfDoc.save()
  }

  /**
   * Rotate even pages only
   */
  static async rotateEvenPages(
    file: File,
    angle: number = 90
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pdfPages = pdfDoc.getPages()

    pdfPages.forEach((page, index) => {
      if ((index + 1) % 2 === 0) { // Even pages (2, 4, 6...)
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees(normalizeAngle(currentRotation + angle)))
      }
    })

    return await pdfDoc.save()
  }

  /**
   * Rotate all portrait pages to landscape or vice versa
   */
  static async rotateByOrientation(
    file: File,
    targetOrientation: 'portrait' | 'landscape'
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pdfPages = pdfDoc.getPages()

    pdfPages.forEach((page) => {
      const portrait = isPortrait(page)
      const needsRotation = 
        (targetOrientation === 'landscape' && portrait) ||
        (targetOrientation === 'portrait' && !portrait)
      
      if (needsRotation) {
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees(normalizeAngle(currentRotation + 90)))
      }
    })

    return await pdfDoc.save()
  }

  /**
   * Rotate pages by arbitrary angle (for deskewing)
   * Note: This works by rotating the page coordinate system
   * For visual deskew of scanned content, consider using canvas-based approach
   */
  static async rotateArbitraryAngle(
    file: File,
    pageIndices: number[],
    angle: number
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pdfPages = pdfDoc.getPages()

    for (const index of pageIndices) {
      if (index >= 0 && index < pdfPages.length) {
        const page = pdfPages[index]
        const currentRotation = page.getRotation().angle
        // Note: pdf-lib only supports 90° increments for page rotation
        // For arbitrary angles, we'd need to transform the content
        // This applies the nearest 90° rotation
        const roundedAngle = Math.round(angle / 90) * 90
        page.setRotation(degrees(normalizeAngle(currentRotation + roundedAngle)))
      }
    }

    return await pdfDoc.save()
  }

  /**
   * Rotate pages in memory (for UI preview)
   * Supports both old signature (angle: number) and new signature (options: object)
   */
  static rotateInMemory(
    pages: PageData[],
    selectedPageIds: Set<string>,
    angleOrOptions: number | Partial<RotateOptions> = 90
  ): PageData[] {
    // Handle backwards compatibility: if number is passed, convert to options
    const opts: RotateOptions = typeof angleOrOptions === 'number'
      ? { ...DEFAULT_ROTATE_OPTIONS, angle: angleOrOptions, target: 'selected' }
      : { ...DEFAULT_ROTATE_OPTIONS, ...angleOrOptions }
    
    const totalPages = pages.length
    
    // Get selected page indices
    const selectedIndices = pages
      .filter(p => selectedPageIds.has(p.id))
      .map(p => p.pageNumber - 1)

    // Get target indices based on target type
    const targetIndices = new Set(
      getTargetPageIndices(totalPages, opts.target, selectedIndices)
    )

    return pages.map((page, index) => {
      if (targetIndices.has(index)) {
        let newRotation = page.rotation + opts.angle
        if (opts.normalizeAngle) {
          newRotation = normalizeAngle(newRotation)
        }
        return { ...page, rotation: newRotation }
      }
      return page
    })
  }

  /**
   * Rotate with full options (explicit method)
   */
  static rotateInMemoryWithOptions(
    pages: PageData[],
    selectedPageIds: Set<string>,
    options: Partial<RotateOptions>
  ): PageData[] {
    return this.rotateInMemory(pages, selectedPageIds, options)
  }

  /**
   * Preview rotation for odd/even pages
   */
  static previewOddEvenRotation(
    totalPages: number,
    target: 'odd' | 'even',
    angle: number
  ): Array<{ pageNumber: number; willRotate: boolean; newAngle: number }> {
    const result = []
    for (let i = 1; i <= totalPages; i++) {
      const isOdd = i % 2 === 1
      const willRotate = (target === 'odd' && isOdd) || (target === 'even' && !isOdd)
      result.push({
        pageNumber: i,
        willRotate,
        newAngle: willRotate ? normalizeAngle(angle) : 0,
      })
    }
    return result
  }

  /**
   * Get rotation target description
   */
  static getTargetDescription(target: RotationTarget, totalPages: number): string {
    const oddCount = Math.ceil(totalPages / 2)
    const evenCount = Math.floor(totalPages / 2)
    
    switch (target) {
      case 'all':
        return `All ${totalPages} pages`
      case 'odd':
        return `${oddCount} odd page${oddCount !== 1 ? 's' : ''} (1, 3, 5...)`
      case 'even':
        return `${evenCount} even page${evenCount !== 1 ? 's' : ''} (2, 4, 6...)`
      case 'portrait':
        return 'Portrait pages'
      case 'landscape':
        return 'Landscape pages'
      case 'first':
        return 'First page'
      case 'last':
        return 'Last page'
      case 'selected':
      default:
        return 'Selected pages'
    }
  }
}

// Export utility functions
export { normalizeAngle, isPortrait, getTargetPageIndices }
