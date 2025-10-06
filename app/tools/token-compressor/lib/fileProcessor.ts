// app/tools/token-compressor/lib/fileProcessor.ts
import { ProcessedFile } from './types'

export async function processFiles(files: File[]): Promise<ProcessedFile[]> {
  const processedFiles: ProcessedFile[] = []

  for (const file of files) {
    const processed = await processFile(file)
    if (processed) {
      processedFiles.push(processed)
    }
  }

  return processedFiles
}

async function processFile(file: File): Promise<ProcessedFile | null> {
  try {
    const isImage = file.type.startsWith('image/')
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf')

    let content = ''
    let imageData = ''
    let compressedImageData = ''

    if (isImage) {
      // Process image file
      const processedImage = await processImage(file)
      imageData = processedImage.original
      compressedImageData = processedImage.compressed
      content = `[Image: ${file.name}]` // Placeholder for token counting
    } else if (isPDF) {
      // Process PDF - extract text and images
      content = await processPDF(file)
    } else {
      // Text-based files
      content = await file.text()
    }

    return {
      name: file.name,
      type: file.type || detectFileType(file.name),
      size: file.size,
      content: content,
      isImage: isImage,
      imageData: imageData,
      compressedImageData: compressedImageData,
      path: file.webkitRelativePath || file.name,
    }
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error)
    return null
  }
}

// Image compression function with better quality settings
async function processImage(file: File): Promise<{ original: string; compressed: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve({
            original: e.target?.result as string,
            compressed: e.target?.result as string,
          })
          return
        }

        // Calculate new dimensions (max 800px for better compression)
        let { width, height } = img
        const maxSize = 800

        if (width > height && width > maxSize) {
          height = Math.round((height / width) * maxSize)
          width = maxSize
        } else if (height > maxSize) {
          width = Math.round((width / height) * maxSize)
          height = maxSize
        }

        canvas.width = width
        canvas.height = height

        // Apply image smoothing for better quality
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height)

        // Get original data URL
        const originalDataUrl = e.target?.result as string

        // Determine output format and quality based on original type
        let compressedDataUrl: string
        const originalType = file.type

        if (originalType === 'image/png' && originalDataUrl.length > 100000) {
          // Convert large PNGs to JPEG for better compression
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
        } else if (originalType === 'image/jpeg' || originalType === 'image/jpg') {
          // Compress JPEG with quality reduction
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75)
        } else if (originalType === 'image/webp') {
          // Use WebP with compression
          compressedDataUrl = canvas.toDataURL('image/webp', 0.8)
        } else {
          // For other formats, try JPEG conversion
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        }

        // If compressed is larger than original, keep original
        if (compressedDataUrl.length >= originalDataUrl.length * 0.9) {
          // Try more aggressive compression
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6)
        }

        console.log(`Image compression: ${file.name}`)
        console.log(`Original size: ${originalDataUrl.length} bytes`)
        console.log(`Compressed size: ${compressedDataUrl.length} bytes`)
        console.log(
          `Reduction: ${Math.round((1 - compressedDataUrl.length / originalDataUrl.length) * 100)}%`
        )

        resolve({
          original: originalDataUrl,
          compressed: compressedDataUrl,
        })
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}

// PDF processing function
async function processPDF(file: File): Promise<string> {
  try {
    // Check if pdf.js is available
    const pdfjsLib = (window as any).pdfjsLib || (await import('pdfjs-dist'))

    // Set worker if not already set
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''
    let imageDescriptions = []

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')

      fullText += pageText + ' '

      // Check for images in the page
      const ops = await page.getOperatorList()
      const imageCount = ops.fnArray.filter(
        (fn: number) =>
          fn === pdfjsLib.OPS.paintJpegXObject || fn === pdfjsLib.OPS.paintImageXObject
      ).length

      if (imageCount > 0) {
        imageDescriptions.push(`[Page ${i}: ${imageCount} image(s)]`)
      }
    }

    // Combine text and image descriptions
    const result =
      fullText.trim() + (imageDescriptions.length > 0 ? '\n\n' + imageDescriptions.join(' ') : '')

    return result || `[PDF: ${file.name} - Unable to extract text]`
  } catch (error) {
    console.error('PDF processing error:', error)
    // Fallback if pdf.js is not available
    return `[PDF Document: ${file.name} - ${file.size} bytes]`
  }
}

function detectFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()

  const typeMap: Record<string, string> = {
    js: 'application/javascript',
    jsx: 'application/javascript',
    ts: 'application/typescript',
    tsx: 'application/typescript',
    py: 'text/x-python',
    java: 'text/x-java',
    cpp: 'text/x-c++',
    c: 'text/x-c',
    h: 'text/x-c',
    cs: 'text/x-csharp',
    php: 'text/x-php',
    rb: 'text/x-ruby',
    go: 'text/x-go',
    rs: 'text/x-rust',
    kt: 'text/x-kotlin',
    swift: 'text/x-swift',
    json: 'application/json',
    xml: 'application/xml',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    md: 'text/markdown',
    txt: 'text/plain',
    csv: 'text/csv',
    html: 'text/html',
    css: 'text/css',
    scss: 'text/x-scss',
    sass: 'text/x-sass',
    less: 'text/x-less',
    sql: 'text/x-sql',
    sh: 'text/x-sh',
    bash: 'text/x-sh',
    zsh: 'text/x-sh',
    fish: 'text/x-sh',
    dockerfile: 'text/x-dockerfile',
    makefile: 'text/x-makefile',
    gitignore: 'text/plain',
    env: 'text/plain',
    ini: 'text/plain',
    cfg: 'text/plain',
    conf: 'text/plain',
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }

  return typeMap[extension || ''] || 'text/plain'
}

export function combineFiles(files: ProcessedFile[]): string {
  return files
    .map((file) => {
      if (file.isImage && file.compressedImageData) {
        return `### ${file.name}\n\n${file.compressedImageData}\n\n`
      }
      return `### ${file.name}\n\n${file.content}\n\n`
    })
    .join('---\n\n')
}
