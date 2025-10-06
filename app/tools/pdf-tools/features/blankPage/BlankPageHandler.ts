import { PageData } from '../../types'
import { PDFDocument } from 'pdf-lib'

export class BlankPageHandler {
  static insertBlankPagesInMemory(pages: PageData[], insertAfterPages: number[]): PageData[] {
    const result: PageData[] = []
    let insertedCount = 0

    pages.forEach((page) => {
      result.push(page)

      // Check if we should insert a blank page after this page
      if (insertAfterPages.includes(page.pageNumber)) {
        insertedCount++

        // Create a blank page with a white thumbnail
        result.push({
          id: `blank-${Date.now()}-${insertedCount}`,
          pageNumber: page.pageNumber + 1,
          rotation: 0,
          // Create a simple white thumbnail (1x1 white pixel as base64)
          thumbnail:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
        })
      }
    })

    // Renumber all pages
    return result.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }))
  }

  static async insertBlankPagesInPDF(file: File, insertAfterPages: number[]): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const newPdfDoc = await PDFDocument.create()

    const totalPages = pdfDoc.getPageCount()

    for (let i = 0; i < totalPages; i++) {
      // Copy existing page
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
      newPdfDoc.addPage(copiedPage)

      // Check if we should insert a blank page after this page
      if (insertAfterPages.includes(i + 1)) {
        // Add a blank page
        const blankPage = newPdfDoc.addPage()
        // Optionally set default size if needed
        // blankPage.setSize(595.276, 841.890); // A4 size in points
      }
    }

    return await newPdfDoc.save()
  }
}
