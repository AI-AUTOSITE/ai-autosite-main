// app/tools/pdf-tools/features/pageNumber/PageNumberHandler.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export type PageNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type PageNumberFormat = 'Page X' | 'X of Y' | 'X' | '- X -'

interface PageNumberOptions {
  position: PageNumberPosition
  format: PageNumberFormat
  startFrom: number
  fontSize?: number
  margin?: number
  color?: { r: number; g: number; b: number }
  skipFirst?: boolean
}

export class PageNumberHandler {
  static async addPageNumbers(file: File, options: PageNumberOptions): Promise<Uint8Array> {
    const {
      position = 'bottom-center',
      format = 'X',
      startFrom = 1,
      fontSize = 12,
      margin = 30,
      color = { r: 0, g: 0, b: 0 },
      skipFirst = false,
    } = options

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const totalPages = pages.length

    pages.forEach((page, index) => {
      // Skip first page if requested
      if (skipFirst && index === 0) return

      const pageNumber = index + startFrom

      // Format the page number text
      let text = ''
      switch (format) {
        case 'Page X':
          text = `Page ${pageNumber}`
          break
        case 'X of Y':
          text = `${pageNumber} of ${totalPages}`
          break
        case '- X -':
          text = `- ${pageNumber} -`
          break
        default:
          text = `${pageNumber}`
      }

      const textWidth = font.widthOfTextAtSize(text, fontSize)
      const { width, height } = page.getSize()

      // Calculate position
      let x = margin
      let y = margin

      // Horizontal position
      if (position.includes('center')) {
        x = width / 2 - textWidth / 2
      } else if (position.includes('right')) {
        x = width - margin - textWidth
      }

      // Vertical position
      if (position.includes('top')) {
        y = height - margin - fontSize
      }

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
}
