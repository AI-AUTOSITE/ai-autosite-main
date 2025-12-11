// app/tools/pdf-tools/features/merge/MergeHandler.ts
import { PDFDocument } from 'pdf-lib'

export interface PageOrder {
  sourceFileIndex: number  // -1 for current file, 0+ for added files
  originalPageNumber: number  // 1-indexed
}

export class MergeHandler {
  /**
   * Merge multiple PDF files into one
   * @param files Array of PDF files to merge
   * @returns Merged PDF as Uint8Array
   */
  static async mergeFiles(files: File[]): Promise<Uint8Array> {
    if (files.length === 0) {
      throw new Error('No files to merge')
    }

    if (files.length === 1) {
      const arrayBuffer = await files[0].arrayBuffer()
      return new Uint8Array(arrayBuffer)
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer, { 
          ignoreEncryption: true 
        })
        const pageIndices = pdf.getPageIndices()
        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      } catch (error) {
        console.error(`Failed to process file: ${file.name}`, error)
        throw new Error(`Failed to process file: ${file.name}`)
      }
    }

    return await mergedPdf.save()
  }

  /**
   * Merge PDFs with custom page order
   * @param currentFile The currently loaded PDF file
   * @param addedFiles Additional PDF files to merge
   * @param pageOrder Array of page orders specifying the final order
   * @returns Merged PDF as Uint8Array
   */
  static async mergeWithCustomOrder(
    currentFile: File,
    addedFiles: File[],
    pageOrder: PageOrder[]
  ): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create()
    
    // Load all PDFs into memory
    const currentBuffer = await currentFile.arrayBuffer()
    const currentPdf = await PDFDocument.load(currentBuffer, { ignoreEncryption: true })
    
    const addedPdfs: PDFDocument[] = []
    for (const file of addedFiles) {
      const buffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
      addedPdfs.push(pdf)
    }
    
    // Copy pages in the specified order
    for (const order of pageOrder) {
      const pageIndex = order.originalPageNumber - 1  // Convert to 0-indexed
      
      if (order.sourceFileIndex === -1) {
        // From current file
        if (pageIndex >= 0 && pageIndex < currentPdf.getPageCount()) {
          const [page] = await mergedPdf.copyPages(currentPdf, [pageIndex])
          mergedPdf.addPage(page)
        }
      } else {
        // From added files
        const sourcePdf = addedPdfs[order.sourceFileIndex]
        if (sourcePdf && pageIndex >= 0 && pageIndex < sourcePdf.getPageCount()) {
          const [page] = await mergedPdf.copyPages(sourcePdf, [pageIndex])
          mergedPdf.addPage(page)
        }
      }
    }
    
    return await mergedPdf.save()
  }

  /**
   * Insert pages from one PDF into another at a specific position
   * @param baseFile The main PDF file
   * @param insertFile The PDF file to insert
   * @param insertAfterPage Page number after which to insert (0 = at beginning)
   * @returns Merged PDF as Uint8Array
   */
  static async insertPages(
    baseFile: File,
    insertFile: File,
    insertAfterPage: number
  ): Promise<Uint8Array> {
    const baseBuffer = await baseFile.arrayBuffer()
    const insertBuffer = await insertFile.arrayBuffer()

    const basePdf = await PDFDocument.load(baseBuffer, { ignoreEncryption: true })
    const insertPdf = await PDFDocument.load(insertBuffer, { ignoreEncryption: true })

    const resultPdf = await PDFDocument.create()

    const basePageCount = basePdf.getPageCount()
    const insertPageIndices = insertPdf.getPageIndices()

    // Validate insertAfterPage
    const actualInsertAfter = Math.max(0, Math.min(insertAfterPage, basePageCount))

    // Copy pages before insertion point
    if (actualInsertAfter > 0) {
      const beforePages = await resultPdf.copyPages(
        basePdf,
        Array.from({ length: actualInsertAfter }, (_, i) => i)
      )
      beforePages.forEach((page) => resultPdf.addPage(page))
    }

    // Copy inserted pages
    const insertedPages = await resultPdf.copyPages(insertPdf, insertPageIndices)
    insertedPages.forEach((page) => resultPdf.addPage(page))

    // Copy pages after insertion point
    if (actualInsertAfter < basePageCount) {
      const afterPages = await resultPdf.copyPages(
        basePdf,
        Array.from({ length: basePageCount - actualInsertAfter }, (_, i) => i + actualInsertAfter)
      )
      afterPages.forEach((page) => resultPdf.addPage(page))
    }

    return await resultPdf.save()
  }

  /**
   * Merge PDFs with specific page ranges
   * @param configs Array of file configs with page ranges
   * @returns Merged PDF as Uint8Array
   */
  static async mergeWithRanges(
    configs: Array<{
      file: File
      pageRanges?: Array<{ start: number; end: number }>
    }>
  ): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create()

    for (const config of configs) {
      const arrayBuffer = await config.file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const totalPages = pdf.getPageCount()

      // If no page ranges specified, copy all pages
      if (!config.pageRanges || config.pageRanges.length === 0) {
        const allPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        allPages.forEach((page) => mergedPdf.addPage(page))
        continue
      }

      // Copy specified page ranges
      for (const range of config.pageRanges) {
        const start = Math.max(0, range.start - 1) // Convert to 0-indexed
        const end = Math.min(totalPages, range.end) // Keep 1-indexed for end
        
        if (start >= end) continue

        const pageIndices = Array.from({ length: end - start }, (_, i) => start + i)
        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
    }

    return await mergedPdf.save()
  }

  /**
   * Interleave pages from two PDFs (useful for double-sided scanning)
   * @param fileA First PDF (e.g., front pages)
   * @param fileB Second PDF (e.g., back pages)
   * @param reverseB Whether to reverse the order of fileB pages
   * @returns Interleaved PDF as Uint8Array
   */
  static async interleavePages(
    fileA: File,
    fileB: File,
    reverseB: boolean = false
  ): Promise<Uint8Array> {
    const bufferA = await fileA.arrayBuffer()
    const bufferB = await fileB.arrayBuffer()

    const pdfA = await PDFDocument.load(bufferA, { ignoreEncryption: true })
    const pdfB = await PDFDocument.load(bufferB, { ignoreEncryption: true })

    const resultPdf = await PDFDocument.create()

    const pagesA = pdfA.getPageCount()
    const pagesB = pdfB.getPageCount()
    const maxPages = Math.max(pagesA, pagesB)

    // Get page indices for B (optionally reversed)
    const bIndices = Array.from({ length: pagesB }, (_, i) => i)
    if (reverseB) {
      bIndices.reverse()
    }

    for (let i = 0; i < maxPages; i++) {
      // Add page from A
      if (i < pagesA) {
        const [pageA] = await resultPdf.copyPages(pdfA, [i])
        resultPdf.addPage(pageA)
      }

      // Add page from B
      if (i < pagesB) {
        const bIndex = bIndices[i]
        const [pageB] = await resultPdf.copyPages(pdfB, [bIndex])
        resultPdf.addPage(pageB)
      }
    }

    return await resultPdf.save()
  }

  /**
   * Get page count of a PDF file
   * @param file PDF file
   * @returns Number of pages
   */
  static async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    return pdf.getPageCount()
  }
}