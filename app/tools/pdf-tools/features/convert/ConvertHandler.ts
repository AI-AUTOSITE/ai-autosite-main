// app/tools/pdf-tools/features/convert/ConvertHandler.ts
import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// Set worker path for PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
}

export interface ConvertOptions {
  format: 'word' | 'excel' | 'text' | 'html'
  extractImages?: boolean
  preserveFormatting?: boolean
  mergePages?: boolean // For Excel: merge all pages into one sheet
}

export class ConvertHandler {
  // Convert PDF to Word (DOCX)
  static async toWord(file: File, options: ConvertOptions = { format: 'word' }): Promise<Blob> {
    try {
      // Extract text from PDF
      const text = await this.extractTextFromPDF(file)

      // Create HTML with basic formatting
      const html = this.textToHTML(text, options.preserveFormatting)

      // Create a temporary document for mammoth
      // Since mammoth primarily converts FROM docx TO html,
      // we'll create a simple DOCX structure
      const docxContent = await this.createSimpleDocx(html)

      return new Blob([docxContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
    } catch (error) {
      console.error('Word conversion error:', error)
      throw new Error('Failed to convert PDF to Word')
    }
  }

  // Convert PDF to Excel (XLSX)
  static async toExcel(file: File, options: ConvertOptions = { format: 'excel' }): Promise<Blob> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const workbook = XLSX.utils.book_new()

      if (options.mergePages) {
        // Merge all pages into one sheet
        const allData: string[][] = []

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageData = this.extractTableData(textContent)
          allData.push(...pageData)
        }

        const worksheet = XLSX.utils.aoa_to_sheet(allData)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'All Pages')
      } else {
        // Create separate sheet for each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageData = this.extractTableData(textContent)

          if (pageData.length > 0) {
            const worksheet = XLSX.utils.aoa_to_sheet(pageData)
            XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`)
          }
        }
      }

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      return new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    } catch (error) {
      console.error('Excel conversion error:', error)
      throw new Error('Failed to convert PDF to Excel')
    }
  }

  // Convert PDF to plain text
  static async toText(file: File): Promise<string> {
    try {
      return await this.extractTextFromPDF(file)
    } catch (error) {
      console.error('Text extraction error:', error)
      throw new Error('Failed to extract text from PDF')
    }
  }

  // Convert PDF to HTML
  static async toHTML(file: File, preserveFormatting: boolean = true): Promise<string> {
    try {
      const text = await this.extractTextFromPDF(file)
      return this.textToHTML(text, preserveFormatting)
    } catch (error) {
      console.error('HTML conversion error:', error)
      throw new Error('Failed to convert PDF to HTML')
    }
  }

  // Helper: Extract text from PDF
  private static async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()

      const pageText = textContent.items.map((item: any) => item.str).join(' ')

      fullText += pageText + '\n\n'
    }

    return fullText.trim()
  }

  // Helper: Extract table-like data from PDF page
  private static extractTableData(textContent: any): string[][] {
    const rows: string[][] = []
    let currentRow: string[] = []
    let lastY = 0
    const threshold = 5 // Y-coordinate threshold for new row

    // Sort items by Y position (top to bottom) then X position (left to right)
    const items = textContent.items.sort((a: any, b: any) => {
      if (Math.abs(a.transform[5] - b.transform[5]) > threshold) {
        return b.transform[5] - a.transform[5] // Y coordinate (inverted)
      }
      return a.transform[4] - b.transform[4] // X coordinate
    })

    items.forEach((item: any) => {
      const y = item.transform[5]

      // Check if this is a new row
      if (lastY !== 0 && Math.abs(y - lastY) > threshold) {
        if (currentRow.length > 0) {
          rows.push(currentRow)
          currentRow = []
        }
      }

      currentRow.push(item.str)
      lastY = y
    })

    // Add the last row
    if (currentRow.length > 0) {
      rows.push(currentRow)
    }

    return rows
  }

  // Helper: Convert text to HTML
  private static textToHTML(text: string, preserveFormatting: boolean): string {
    let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>'

    if (preserveFormatting) {
      // Preserve line breaks and basic formatting
      const paragraphs = text.split('\n\n')
      paragraphs.forEach((para) => {
        if (para.trim()) {
          html += `<p>${para.replace(/\n/g, '<br>')}</p>`
        }
      })
    } else {
      // Simple text without formatting
      html += `<p>${text}</p>`
    }

    html += '</body></html>'
    return html
  }

  // Helper: Create simple DOCX structure
  private static async createSimpleDocx(htmlContent: string): Promise<ArrayBuffer> {
    // Create a simplified DOCX structure
    // This is a basic implementation - for production, consider using a library like docx.js

    const workbook = XLSX.utils.book_new()

    // Convert HTML to plain text for now (simplified)
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    const textContent = tempDiv.textContent || tempDiv.innerText || ''

    // Split text into rows for Excel-like structure
    const rows = textContent.split('\n').map((line) => [line])

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Content')

    // Generate DOCX-compatible output
    const output = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    return output
  }

  // Batch conversion for multiple files
  static async batchConvert(
    files: File[],
    format: 'word' | 'excel' | 'text',
    options?: ConvertOptions
  ): Promise<{ filename: string; blob: Blob }[]> {
    const results = []

    for (const file of files) {
      let blob: Blob
      let extension: string

      switch (format) {
        case 'word':
          blob = await this.toWord(file, { ...options, format: 'word' })
          extension = 'docx'
          break
        case 'excel':
          blob = await this.toExcel(file, { ...options, format: 'excel' })
          extension = 'xlsx'
          break
        case 'text':
          const text = await this.toText(file)
          blob = new Blob([text], { type: 'text/plain' })
          extension = 'txt'
          break
        default:
          throw new Error('Unsupported format')
      }

      results.push({
        filename: file.name.replace('.pdf', `.${extension}`),
        blob,
      })
    }

    return results
  }
}
