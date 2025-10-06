import { PDFDocument } from 'pdf-lib'

export class MergeHandler {
  static async mergeFiles(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    return await mergedPdf.save()
  }

  static async insertPages(
    mainFile: File,
    insertFile: File,
    afterPage: number
  ): Promise<Uint8Array> {
    const mainBuffer = await mainFile.arrayBuffer()
    const insertBuffer = await insertFile.arrayBuffer()

    const mainPdf = await PDFDocument.load(mainBuffer)
    const insertPdf = await PDFDocument.load(insertBuffer)
    const resultPdf = await PDFDocument.create()

    // Copy pages before insertion point
    const beforePages = await resultPdf.copyPages(
      mainPdf,
      Array.from({ length: afterPage }, (_, i) => i)
    )
    beforePages.forEach((page) => resultPdf.addPage(page))

    // Insert new pages
    const insertPages = await resultPdf.copyPages(insertPdf, insertPdf.getPageIndices())
    insertPages.forEach((page) => resultPdf.addPage(page))

    // Copy remaining pages
    const afterPages = await resultPdf.copyPages(
      mainPdf,
      Array.from({ length: mainPdf.getPageCount() - afterPage }, (_, i) => afterPage + i)
    )
    afterPages.forEach((page) => resultPdf.addPage(page))

    return await resultPdf.save()
  }
}
