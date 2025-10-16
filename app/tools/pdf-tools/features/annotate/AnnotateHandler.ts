import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export interface AnnotationOptions {
  text: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  fontSize: number
  color: string  // Now accepts both hex codes (#FF0000) and named colors
  backgroundColor?: 'yellow' | 'pink' | 'blue' | 'none'
  pageRange: 'all' | 'selected'
  selectedPages?: number[]
}

// Helper function to convert hex color to RGB (0-1 range)
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '')
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  return { r, g, b }
}

const namedColorMap = {
  red: { r: 0.8, g: 0.1, b: 0.1 },
  blue: { r: 0.1, g: 0.3, b: 0.8 },
  green: { r: 0.1, g: 0.6, b: 0.1 },
  black: { r: 0, g: 0, b: 0 },
  orange: { r: 1, g: 0.5, b: 0 },
  white: { r: 1, g: 1, b: 1 },
  yellow: { r: 1, g: 1, b: 0 },
  purple: { r: 0.5, g: 0, b: 0.5 },
}

const bgColorMap = {
  yellow: { r: 1, g: 1, b: 0.7 },
  pink: { r: 1, g: 0.8, b: 0.9 },
  blue: { r: 0.8, g: 0.9, b: 1 },
  none: null,
}

export class AnnotateHandler {
  static async addAnnotations(
    pdfBytes: ArrayBuffer,
    options: AnnotationOptions
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    // Parse color - support both hex codes and named colors
    let textColor: { r: number; g: number; b: number }
    
    if (options.color.startsWith('#')) {
      // Hex color code
      textColor = hexToRgb(options.color)
    } else {
      // Named color
      textColor = namedColorMap[options.color.toLowerCase() as keyof typeof namedColorMap] || namedColorMap.black
    }

    // Determine which pages to annotate
    let pagesToAnnotate: number[] = []
    if (options.pageRange === 'all') {
      pagesToAnnotate = Array.from({ length: pages.length }, (_, i) => i)
    } else if (options.selectedPages && options.selectedPages.length > 0) {
      pagesToAnnotate = options.selectedPages.map((p) => p - 1)
    }

    // Add annotations to selected pages
    for (const pageIndex of pagesToAnnotate) {
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const page = pages[pageIndex]
        const { width, height } = page.getSize()
        
        const textWidth = font.widthOfTextAtSize(options.text, options.fontSize)
        const textHeight = options.fontSize
        const padding = 8

        // Calculate position
        let x: number, y: number
        switch (options.position) {
          case 'top-left':
            x = padding
            y = height - textHeight - padding
            break
          case 'top-right':
            x = width - textWidth - padding
            y = height - textHeight - padding
            break
          case 'bottom-left':
            x = padding
            y = padding
            break
          case 'bottom-right':
            x = width - textWidth - padding
            y = padding
            break
          case 'center':
            x = (width - textWidth) / 2
            y = (height - textHeight) / 2
            break
          default:
            x = padding
            y = height - textHeight - padding
        }

        // Draw background if specified
        if (options.backgroundColor && options.backgroundColor !== 'none') {
          const bgColor = bgColorMap[options.backgroundColor]
          if (bgColor) {
            page.drawRectangle({
              x: x - padding / 2,
              y: y - padding / 2,
              width: textWidth + padding,
              height: textHeight + padding,
              color: rgb(bgColor.r, bgColor.g, bgColor.b),
              opacity: 0.7,
            })
          }
        }

        // Draw text annotation
        page.drawText(options.text, {
          x,
          y,
          size: options.fontSize,
          font,
          color: rgb(textColor.r, textColor.g, textColor.b),
        })
      }
    }

    return await pdfDoc.save()
  }

  static validateOptions(options: AnnotationOptions): string | null {
    if (!options.text || options.text.trim() === '') {
      return 'Please enter annotation text'
    }

    if (options.text.length > 200) {
      return 'Annotation text is too long (max 200 characters)'
    }

    if (options.fontSize < 6 || options.fontSize > 72) {
      return 'Font size must be between 6 and 72'
    }

    if (options.pageRange === 'selected' && (!options.selectedPages || options.selectedPages.length === 0)) {
      return 'Please select at least one page to annotate'
    }

    return null
  }
}