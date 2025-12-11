// app/tools/pdf-tools/features/duplicate/DuplicateHandler.ts
import { PDFDocument } from 'pdf-lib'
import { PageData } from '../../types'

export type DuplicateMode = 'afterOriginal' | 'atEnd' | 'interleave'

export interface DuplicateOptions {
  copyCount: number           // How many copies to create (1-99)
  mode: DuplicateMode         // Where to insert duplicates
  // interleave mode: A,A,A,B,B,B vs A,B,A,B,A,B
  interleavePattern: 'consecutive' | 'alternating'
}

export const DEFAULT_DUPLICATE_OPTIONS: DuplicateOptions = {
  copyCount: 1,
  mode: 'afterOriginal',
  interleavePattern: 'consecutive',
}

export class DuplicateHandler {
  /**
   * Duplicate pages in PDF file with specified copy count
   * @param file - Source PDF file
   * @param pageNumbers - Pages to duplicate (1-indexed)
   * @param options - Duplicate options including copy count
   */
  static async duplicatePages(
    file: File,
    pageNumbers: number[],
    options: DuplicateOptions = DEFAULT_DUPLICATE_OPTIONS
  ): Promise<Uint8Array> {
    const { copyCount, mode, interleavePattern } = options
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const newPdfDoc = await PDFDocument.create()
    const totalPages = pdfDoc.getPageCount()
    const pageNumberSet = new Set(pageNumbers)

    if (mode === 'afterOriginal') {
      // Insert copies immediately after each selected page
      for (let i = 0; i < totalPages; i++) {
        // Copy original page
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
        newPdfDoc.addPage(copiedPage)

        // If this page should be duplicated, add N copies
        if (pageNumberSet.has(i + 1)) {
          for (let c = 0; c < copyCount; c++) {
            const [duplicatedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
            newPdfDoc.addPage(duplicatedPage)
          }
        }
      }
    } else if (mode === 'atEnd') {
      // First, copy all original pages
      for (let i = 0; i < totalPages; i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
        newPdfDoc.addPage(copiedPage)
      }

      // Then add all duplicates at the end
      if (interleavePattern === 'consecutive') {
        // A,A,A,B,B,B pattern
        for (const pageNum of pageNumbers) {
          for (let c = 0; c < copyCount; c++) {
            const [duplicatedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1])
            newPdfDoc.addPage(duplicatedPage)
          }
        }
      } else {
        // A,B,A,B,A,B pattern
        for (let c = 0; c < copyCount; c++) {
          for (const pageNum of pageNumbers) {
            const [duplicatedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1])
            newPdfDoc.addPage(duplicatedPage)
          }
        }
      }
    } else if (mode === 'interleave') {
      // Create interleaved duplicates (useful for printing)
      if (interleavePattern === 'consecutive') {
        // Each page repeated N+1 times consecutively
        for (let i = 0; i < totalPages; i++) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
          newPdfDoc.addPage(copiedPage)

          if (pageNumberSet.has(i + 1)) {
            for (let c = 0; c < copyCount; c++) {
              const [duplicatedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
              newPdfDoc.addPage(duplicatedPage)
            }
          }
        }
      } else {
        // Full document repeated N+1 times
        for (let round = 0; round <= copyCount; round++) {
          for (let i = 0; i < totalPages; i++) {
            if (round === 0 || pageNumberSet.has(i + 1)) {
              const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
              newPdfDoc.addPage(copiedPage)
            }
          }
        }
      }
    }

    return await newPdfDoc.save()
  }

  /**
   * Duplicate pages in memory (for UI preview) with copy count
   * @param pages - Current pages array
   * @param selectedPageIds - Set of selected page IDs
   * @param options - Duplicate options
   */
  static duplicatePagesInMemory(
    pages: PageData[],
    selectedPageIds: Set<string>,
    options: DuplicateOptions = DEFAULT_DUPLICATE_OPTIONS
  ): PageData[] {
    const { copyCount, mode, interleavePattern } = options
    const result: PageData[] = []
    let copyCounter = 0

    if (mode === 'afterOriginal') {
      // Insert copies immediately after each selected page
      pages.forEach((page) => {
        result.push(page)

        if (selectedPageIds.has(page.id)) {
          for (let c = 0; c < copyCount; c++) {
            copyCounter++
            const duplicatedPage: PageData = {
              ...page,
              id: `${page.id}-copy-${copyCounter}-${Date.now()}`,
              pageNumber: result.length + 1,
            }
            result.push(duplicatedPage)
          }
        }
      })
    } else if (mode === 'atEnd') {
      // Add all original pages first
      result.push(...pages)

      // Then add duplicates at the end
      if (interleavePattern === 'consecutive') {
        // A,A,A,B,B,B pattern
        pages.forEach((page) => {
          if (selectedPageIds.has(page.id)) {
            for (let c = 0; c < copyCount; c++) {
              copyCounter++
              const duplicatedPage: PageData = {
                ...page,
                id: `${page.id}-copy-${copyCounter}-${Date.now()}`,
                pageNumber: result.length + 1,
              }
              result.push(duplicatedPage)
            }
          }
        })
      } else {
        // A,B,A,B,A,B pattern
        for (let c = 0; c < copyCount; c++) {
          pages.forEach((page) => {
            if (selectedPageIds.has(page.id)) {
              copyCounter++
              const duplicatedPage: PageData = {
                ...page,
                id: `${page.id}-copy-${copyCounter}-${Date.now()}`,
                pageNumber: result.length + 1,
              }
              result.push(duplicatedPage)
            }
          })
        }
      }
    } else if (mode === 'interleave') {
      if (interleavePattern === 'consecutive') {
        // Each selected page repeated consecutively
        pages.forEach((page) => {
          result.push(page)

          if (selectedPageIds.has(page.id)) {
            for (let c = 0; c < copyCount; c++) {
              copyCounter++
              const duplicatedPage: PageData = {
                ...page,
                id: `${page.id}-copy-${copyCounter}-${Date.now()}`,
                pageNumber: result.length + 1,
              }
              result.push(duplicatedPage)
            }
          }
        })
      } else {
        // Full document repeated
        for (let round = 0; round <= copyCount; round++) {
          pages.forEach((page) => {
            if (round === 0 || selectedPageIds.has(page.id)) {
              if (round === 0) {
                result.push(page)
              } else {
                copyCounter++
                const duplicatedPage: PageData = {
                  ...page,
                  id: `${page.id}-copy-${copyCounter}-${Date.now()}`,
                  pageNumber: result.length + 1,
                }
                result.push(duplicatedPage)
              }
            }
          })
        }
      }
    }

    // Update page numbers
    return result.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }))
  }

  /**
   * Calculate the resulting page count after duplication
   */
  static calculateResultingPageCount(
    totalPages: number,
    selectedCount: number,
    options: DuplicateOptions
  ): number {
    const { copyCount, mode, interleavePattern } = options

    if (mode === 'afterOriginal' || mode === 'atEnd') {
      // Original pages + (selected pages × copy count)
      return totalPages + (selectedCount * copyCount)
    } else if (mode === 'interleave' && interleavePattern === 'alternating') {
      // More complex calculation for alternating interleave
      return totalPages + (selectedCount * copyCount)
    }

    return totalPages + (selectedCount * copyCount)
  }

  /**
   * Quick duplicate single page N times (utility method)
   */
  static async duplicateSinglePage(
    file: File,
    pageNumber: number,
    copyCount: number
  ): Promise<Uint8Array> {
    return this.duplicatePages(file, [pageNumber], {
      copyCount,
      mode: 'afterOriginal',
      interleavePattern: 'consecutive',
    })
  }

  /**
   * Create N copies of entire document (useful for printing)
   */
  static async duplicateEntireDocument(
    file: File,
    copyCount: number
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const newPdfDoc = await PDFDocument.create()
    const totalPages = pdfDoc.getPageCount()

    // Repeat entire document copyCount + 1 times
    for (let round = 0; round <= copyCount; round++) {
      for (let i = 0; i < totalPages; i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
        newPdfDoc.addPage(copiedPage)
      }
    }

    return await newPdfDoc.save()
  }
}
