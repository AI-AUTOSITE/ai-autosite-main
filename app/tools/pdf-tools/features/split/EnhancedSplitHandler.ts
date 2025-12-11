import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

export interface Bookmark {
  title: string
  pageNumber: number
  level: number
  children?: Bookmark[]
}

export interface SplitResult {
  name: string
  data: Uint8Array
  pageCount: number
  startPage: number
  endPage: number
}

export interface BlankPageInfo {
  pageNumber: number
  whiteRatio: number
  isBlank: boolean
}

export class EnhancedSplitHandler {
  // ============================================
  // BASIC SPLIT FUNCTIONS
  // ============================================

  /**
   * Extract specific pages from PDF
   */
  static async extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const newPdf = await PDFDocument.create()

    const pages = await newPdf.copyPages(
      srcPdf,
      pageNumbers.map((n) => n - 1)
    )

    pages.forEach((page) => newPdf.addPage(page))
    return await newPdf.save()
  }

  /**
   * Split into individual pages
   */
  static async splitIntoSingle(file: File): Promise<SplitResult[]> {
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pageCount = srcPdf.getPageCount()
    const baseName = file.name.replace(/\.pdf$/i, '')
    const results: SplitResult[] = []

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(srcPdf, [i])
      newPdf.addPage(page)
      
      results.push({
        name: `${baseName}_page_${i + 1}.pdf`,
        data: await newPdf.save(),
        pageCount: 1,
        startPage: i + 1,
        endPage: i + 1
      })
    }

    return results
  }

  /**
   * Split by page ranges (e.g., "1-3, 5, 7-10")
   */
  static async splitByRanges(file: File, rangeString: string): Promise<SplitResult[]> {
    const ranges = this.parseRanges(rangeString)
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = srcPdf.getPageCount()
    const baseName = file.name.replace(/\.pdf$/i, '')
    const results: SplitResult[] = []

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      const validPages = range.filter(p => p >= 1 && p <= totalPages)
      
      if (validPages.length === 0) continue

      const newPdf = await PDFDocument.create()
      const pages = await newPdf.copyPages(srcPdf, validPages.map(p => p - 1))
      pages.forEach(page => newPdf.addPage(page))

      const startPage = Math.min(...validPages)
      const endPage = Math.max(...validPages)

      results.push({
        name: `${baseName}_pages_${startPage}-${endPage}.pdf`,
        data: await newPdf.save(),
        pageCount: validPages.length,
        startPage,
        endPage
      })
    }

    return results
  }

  /**
   * Split every N pages
   */
  static async splitEveryNPages(file: File, n: number): Promise<SplitResult[]> {
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = srcPdf.getPageCount()
    const baseName = file.name.replace(/\.pdf$/i, '')
    const results: SplitResult[] = []

    for (let start = 0; start < totalPages; start += n) {
      const end = Math.min(start + n, totalPages)
      const pageIndices = Array.from({ length: end - start }, (_, i) => start + i)

      const newPdf = await PDFDocument.create()
      const pages = await newPdf.copyPages(srcPdf, pageIndices)
      pages.forEach(page => newPdf.addPage(page))

      results.push({
        name: `${baseName}_${start + 1}-${end}.pdf`,
        data: await newPdf.save(),
        pageCount: pageIndices.length,
        startPage: start + 1,
        endPage: end
      })
    }

    return results
  }

  // ============================================
  // EVEN/ODD PAGE EXTRACTION (PDF24 feature)
  // ============================================

  /**
   * Extract even pages only
   */
  static async extractEvenPages(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = srcPdf.getPageCount()
    
    const evenPages: number[] = []
    for (let i = 2; i <= totalPages; i += 2) {
      evenPages.push(i - 1) // 0-based index
    }

    const newPdf = await PDFDocument.create()
    const pages = await newPdf.copyPages(srcPdf, evenPages)
    pages.forEach(page => newPdf.addPage(page))

    return await newPdf.save()
  }

  /**
   * Extract odd pages only
   */
  static async extractOddPages(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = srcPdf.getPageCount()
    
    const oddPages: number[] = []
    for (let i = 1; i <= totalPages; i += 2) {
      oddPages.push(i - 1) // 0-based index
    }

    const newPdf = await PDFDocument.create()
    const pages = await newPdf.copyPages(srcPdf, oddPages)
    pages.forEach(page => newPdf.addPage(page))

    return await newPdf.save()
  }

  // ============================================
  // BOOKMARK/TOC SPLIT (Unique! No competitor offers this for free)
  // ============================================

  /**
   * Extract bookmarks/outline from PDF using PDF.js
   */
  static async getBookmarks(file: File): Promise<Bookmark[]> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    const outline = await pdf.getOutline()

    if (!outline || outline.length === 0) {
      return []
    }

    const bookmarks: Bookmark[] = []

    const processOutlineItem = async (
      item: any,
      level: number
    ): Promise<Bookmark | null> => {
      try {
        let pageNumber = 1

        if (item.dest) {
          let dest = item.dest
          if (typeof dest === 'string') {
            dest = await pdf.getDestination(dest)
          }

          if (dest && dest[0]) {
            const ref = dest[0]
            pageNumber = (await pdf.getPageIndex(ref)) + 1
          }
        }

        const bookmark: Bookmark = {
          title: item.title || 'Untitled',
          pageNumber,
          level,
          children: []
        }

        if (item.items && item.items.length > 0) {
          for (const child of item.items) {
            const childBookmark = await processOutlineItem(child, level + 1)
            if (childBookmark) {
              bookmark.children!.push(childBookmark)
            }
          }
        }

        return bookmark
      } catch (error) {
        console.warn('Error processing outline item:', error)
        return null
      }
    }

    for (const item of outline) {
      const bookmark = await processOutlineItem(item, 0)
      if (bookmark) {
        bookmarks.push(bookmark)
      }
    }

    return bookmarks
  }

  /**
   * Split PDF by bookmarks (chapters/sections)
   * Each top-level bookmark becomes a separate PDF
   */
  static async splitByBookmarks(file: File, level: number = 0): Promise<SplitResult[]> {
    const bookmarks = await this.getBookmarks(file)
    
    if (bookmarks.length === 0) {
      throw new Error('No bookmarks found in this PDF')
    }

    // Flatten bookmarks to specified level
    const flatBookmarks = this.flattenBookmarks(bookmarks, level)
    
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = srcPdf.getPageCount()
    const baseName = file.name.replace(/\.pdf$/i, '')
    const results: SplitResult[] = []

    for (let i = 0; i < flatBookmarks.length; i++) {
      const bookmark = flatBookmarks[i]
      const startPage = bookmark.pageNumber
      const endPage = i < flatBookmarks.length - 1 
        ? flatBookmarks[i + 1].pageNumber - 1 
        : totalPages

      if (startPage > totalPages) continue

      const pageIndices = Array.from(
        { length: endPage - startPage + 1 },
        (_, idx) => startPage - 1 + idx
      ).filter(idx => idx >= 0 && idx < totalPages)

      if (pageIndices.length === 0) continue

      const newPdf = await PDFDocument.create()
      const pages = await newPdf.copyPages(srcPdf, pageIndices)
      pages.forEach(page => newPdf.addPage(page))

      // Sanitize title for filename
      const safeTitle = bookmark.title
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\s+/g, '_')
        .substring(0, 50)

      results.push({
        name: `${baseName}_${String(i + 1).padStart(2, '0')}_${safeTitle}.pdf`,
        data: await newPdf.save(),
        pageCount: pageIndices.length,
        startPage,
        endPage: Math.min(endPage, totalPages)
      })
    }

    return results
  }

  /**
   * Flatten bookmark hierarchy to specified level
   */
  private static flattenBookmarks(bookmarks: Bookmark[], targetLevel: number): Bookmark[] {
    const result: Bookmark[] = []

    const traverse = (items: Bookmark[], currentLevel: number) => {
      for (const item of items) {
        if (currentLevel <= targetLevel) {
          result.push(item)
        }
        if (item.children && item.children.length > 0 && currentLevel < targetLevel) {
          traverse(item.children, currentLevel + 1)
        }
      }
    }

    traverse(bookmarks, 0)
    return result.sort((a, b) => a.pageNumber - b.pageNumber)
  }

  // ============================================
  // BLANK PAGE DETECTION (Unique! No competitor has this!)
  // ============================================

  /**
   * Detect blank pages in PDF
   * Uses canvas rendering and pixel analysis
   */
  static async detectBlankPages(
    file: File,
    threshold: number = 0.98 // 98% white = blank
  ): Promise<BlankPageInfo[]> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    const totalPages = pdf.numPages
    const results: BlankPageInfo[] = []

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i)
      
      // Render at low resolution for faster analysis
      const scale = 0.2
      const viewport = page.getViewport({ scale })
      
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!

      await page.render({
        canvasContext: ctx,
        viewport
      }).promise

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const whiteRatio = this.calculateWhiteRatio(imageData)

      results.push({
        pageNumber: i,
        whiteRatio,
        isBlank: whiteRatio >= threshold
      })

      // Clean up
      canvas.width = 0
      canvas.height = 0
    }

    return results
  }

  /**
   * Calculate ratio of white/near-white pixels
   */
  private static calculateWhiteRatio(imageData: ImageData): number {
    const data = imageData.data
    let whitePixels = 0
    const totalPixels = imageData.width * imageData.height

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Check if pixel is white or near-white (threshold: 250)
      if (r > 250 && g > 250 && b > 250) {
        whitePixels++
      }
    }

    return whitePixels / totalPixels
  }

  /**
   * Remove blank pages from PDF
   */
  static async removeBlankPages(
    file: File,
    threshold: number = 0.98
  ): Promise<{ data: Uint8Array; removedPages: number[] }> {
    const blankInfo = await this.detectBlankPages(file, threshold)
    const blankPageNumbers = blankInfo
      .filter(info => info.isBlank)
      .map(info => info.pageNumber)

    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = srcPdf.getPageCount()

    // Get non-blank pages
    const nonBlankIndices: number[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (!blankPageNumbers.includes(i)) {
        nonBlankIndices.push(i - 1)
      }
    }

    if (nonBlankIndices.length === 0) {
      throw new Error('All pages are blank! Cannot create empty PDF.')
    }

    const newPdf = await PDFDocument.create()
    const pages = await newPdf.copyPages(srcPdf, nonBlankIndices)
    pages.forEach(page => newPdf.addPage(page))

    return {
      data: await newPdf.save(),
      removedPages: blankPageNumbers
    }
  }

  /**
   * Extract only non-blank pages
   */
  static async extractNonBlankPages(
    file: File,
    pageNumbers: number[],
    threshold: number = 0.98
  ): Promise<{ data: Uint8Array; skippedBlankPages: number[] }> {
    const blankInfo = await this.detectBlankPages(file, threshold)
    const blankSet = new Set(
      blankInfo.filter(info => info.isBlank).map(info => info.pageNumber)
    )

    const nonBlankPageNumbers = pageNumbers.filter(p => !blankSet.has(p))
    const skippedBlankPages = pageNumbers.filter(p => blankSet.has(p))

    if (nonBlankPageNumbers.length === 0) {
      throw new Error('All selected pages are blank!')
    }

    const data = await this.extractPages(file, nonBlankPageNumbers)

    return {
      data,
      skippedBlankPages
    }
  }

  // ============================================
  // FILE SIZE BASED SPLIT (iLovePDF feature)
  // ============================================

  /**
   * Split PDF to fit target file size (approximate)
   */
  static async splitByFileSize(
    file: File,
    targetSizeMB: number
  ): Promise<SplitResult[]> {
    const targetSizeBytes = targetSizeMB * 1024 * 1024
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const totalPages = srcPdf.getPageCount()
    const baseName = file.name.replace(/\.pdf$/i, '')
    
    // Estimate average page size
    const avgPageSize = arrayBuffer.byteLength / totalPages
    const pagesPerChunk = Math.max(1, Math.floor(targetSizeBytes / avgPageSize))
    
    const results: SplitResult[] = []
    let partNumber = 1

    for (let start = 0; start < totalPages; start += pagesPerChunk) {
      const end = Math.min(start + pagesPerChunk, totalPages)
      const pageIndices = Array.from({ length: end - start }, (_, i) => start + i)

      const newPdf = await PDFDocument.create()
      const pages = await newPdf.copyPages(srcPdf, pageIndices)
      pages.forEach(page => newPdf.addPage(page))

      const data = await newPdf.save()
      
      results.push({
        name: `${baseName}_part${partNumber}.pdf`,
        data,
        pageCount: pageIndices.length,
        startPage: start + 1,
        endPage: end
      })
      
      partNumber++
    }

    return results
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Parse range string like "1-3, 5, 7-10" into arrays of page numbers
   */
  static parseRanges(rangeString: string): number[][] {
    const ranges: number[][] = []
    const parts = rangeString.split(',').map(s => s.trim()).filter(Boolean)

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim())
        const start = parseInt(startStr, 10)
        const end = parseInt(endStr, 10)

        if (!isNaN(start) && !isNaN(end) && start <= end) {
          const pages: number[] = []
          for (let i = start; i <= end; i++) {
            pages.push(i)
          }
          ranges.push(pages)
        }
      } else {
        const page = parseInt(part, 10)
        if (!isNaN(page)) {
          ranges.push([page])
        }
      }
    }

    return ranges
  }

  /**
   * Parse a single range string into page numbers array
   */
  static parseRangeToPages(rangeString: string, totalPages: number): number[] {
    const pages: number[] = []
    const ranges = this.parseRanges(rangeString)
    
    for (const range of ranges) {
      for (const page of range) {
        if (page >= 1 && page <= totalPages && !pages.includes(page)) {
          pages.push(page)
        }
      }
    }

    return pages.sort((a, b) => a - b)
  }

  /**
   * Get page count of PDF
   */
  static async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer()
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    return srcPdf.getPageCount()
  }

  /**
   * Create ZIP archive of multiple PDFs (for download)
   */
  static async createZipArchive(results: SplitResult[]): Promise<Blob> {
    // Dynamic import of JSZip
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    for (const result of results) {
      zip.file(result.name, result.data)
    }

    return await zip.generateAsync({ type: 'blob' })
  }
}
