import { PDFDocument, degrees } from 'pdf-lib'
import { PageData } from '../../types'

export class RotateHandler {
  static async rotatePages(
    file: File,
    pages: PageData[],
    selectedPageIds: Set<string>,
    angle: number = 90
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pdfPages = pdfDoc.getPages()

    pages.forEach((page) => {
      if (selectedPageIds.has(page.id)) {
        const pageIndex = page.pageNumber - 1
        const currentRotation = pdfPages[pageIndex].getRotation()
        pdfPages[pageIndex].setRotation(degrees(currentRotation.angle + angle))
      }
    })

    return await pdfDoc.save()
  }

  static rotateInMemory(
    pages: PageData[],
    selectedPageIds: Set<string>,
    angle: number = 90
  ): PageData[] {
    return pages.map((page) =>
      selectedPageIds.has(page.id) ? { ...page, rotation: (page.rotation + angle) % 360 } : page
    )
  }
}
