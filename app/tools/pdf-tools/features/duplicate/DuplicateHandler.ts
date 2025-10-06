// app/tools/pdf-tools/features/duplicate/DuplicateHandler.ts
import { PDFDocument } from 'pdf-lib'
import { PageData } from '../../types'

export class DuplicateHandler {
  static async duplicatePages(
    file: File,
    pageNumbers: number[], // Pages to duplicate
    insertAfterOriginal: boolean = true
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const newPdfDoc = await PDFDocument.create()
    const totalPages = pdfDoc.getPageCount()

    for (let i = 0; i < totalPages; i++) {
      // Copy original page
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
      newPdfDoc.addPage(copiedPage)

      // If this page should be duplicated
      if (pageNumbers.includes(i + 1)) {
        if (insertAfterOriginal) {
          // Duplicate immediately after
          const [duplicatedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
          newPdfDoc.addPage(duplicatedPage)
        }
      }
    }

    // If not inserting after original, add all duplicates at the end
    if (!insertAfterOriginal) {
      for (const pageNum of pageNumbers) {
        const [duplicatedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1])
        newPdfDoc.addPage(duplicatedPage)
      }
    }

    return await newPdfDoc.save()
  }

  static duplicatePagesInMemory(
    pages: PageData[],
    selectedPageIds: Set<string>,
    insertAfterOriginal: boolean = true
  ): PageData[] {
    const result: PageData[] = []
    let duplicateCount = 0

    if (insertAfterOriginal) {
      pages.forEach((page) => {
        result.push(page)

        if (selectedPageIds.has(page.id)) {
          duplicateCount++
          const duplicatedPage: PageData = {
            ...page,
            id: `${page.id}-copy-${duplicateCount}`,
            pageNumber: page.pageNumber + 1,
          }
          result.push(duplicatedPage)
        }
      })
    } else {
      // Add all original pages first
      result.push(...pages)

      // Then add duplicates at the end
      pages.forEach((page) => {
        if (selectedPageIds.has(page.id)) {
          duplicateCount++
          const duplicatedPage: PageData = {
            ...page,
            id: `${page.id}-copy-${duplicateCount}`,
            pageNumber: result.length + 1,
          }
          result.push(duplicatedPage)
        }
      })
    }

    // Update page numbers
    return result.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }))
  }
}
