// utils/fileHandlers.ts

import { MAX_FILE_SIZE, isFileSizeValid } from './jsonProcessor'

// ========== Type Definitions ==========
export interface FileReadResult {
  success: boolean
  content?: string
  error?: string
}

export interface FileDownloadOptions {
  filename?: string
  mimeType?: string
  prettify?: boolean
  indentSize?: number
}

// ========== Constants ==========
export const ALLOWED_FILE_TYPES = ['.json', '.txt']
export const DEFAULT_FILENAME = 'data.json'

// ========== File Reading Functions ==========

/**
 * Read file content as text
 */
export function readFileAsText(file: File): Promise<FileReadResult> {
  return new Promise((resolve) => {
    // Validate file type
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'))
    if (!ALLOWED_FILE_TYPES.includes(fileExtension.toLowerCase())) {
      resolve({
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
      })
      return
    }

    // Validate file size
    if (!isFileSizeValid(file.size)) {
      resolve({
        success: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      })
      return
    }

    // Read file
    const reader = new FileReader()

    reader.onload = (event) => {
      const content = event.target?.result as string
      resolve({
        success: true,
        content,
      })
    }

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read file. Please try again.',
      })
    }

    reader.readAsText(file)
  })
}

/**
 * Handle file upload with validation
 */
export async function handleFileUpload(
  event: React.ChangeEvent<HTMLInputElement>
): Promise<FileReadResult> {
  const file = event.target.files?.[0]

  if (!file) {
    return {
      success: false,
      error: 'No file selected',
    }
  }

  return readFileAsText(file)
}

// ========== File Download Functions ==========

/**
 * Download JSON data as file
 */
export function downloadJson(data: any, options: FileDownloadOptions = {}): void {
  const {
    filename = DEFAULT_FILENAME,
    mimeType = 'application/json',
    prettify = false,
    indentSize = 2,
  } = options

  try {
    // Convert data to string if needed
    let content: string
    if (typeof data === 'string') {
      content = data
    } else {
      content = prettify ? JSON.stringify(data, null, indentSize) : JSON.stringify(data)
    }

    // Create blob and download
    const blob = new Blob([content], { type: mimeType })
    downloadBlob(blob, filename)
  } catch (error) {
    console.error('Download failed:', error)
    throw new Error('Failed to download file')
  }
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string = 'json', extension: string = '.json'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0]

  return `${prefix}_${timestamp}${extension}`
}

// ========== File Conversion Functions ==========

/**
 * Convert JSON to CSV format
 */
export function jsonToCsv(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return ''
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')

  // Convert data rows
  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header]

        // Handle different value types
        if (value === null || value === undefined) {
          return ''
        }

        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }

        // Quote values containing comma, quotes, or newlines
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }

        return stringValue
      })
      .join(',')
  })

  return [csvHeaders, ...csvRows].join('\n')
}

/**
 * Convert CSV to JSON format
 */
export function csvToJson(csvText: string): any[] {
  const lines = csvText.split('\n').filter((line) => line.trim())

  if (lines.length === 0) {
    return []
  }

  // Parse headers
  const headers = parseCSVLine(lines[0])

  // Parse data rows
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])

    if (values.length === headers.length) {
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = parseValue(values[index])
      })
      data.push(obj)
    }
  }

  return data
}

/**
 * Parse single CSV line handling quotes
 */
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

/**
 * Parse value from CSV string
 */
function parseValue(value: string): any {
  // Try to parse as JSON (for objects/arrays)
  if (value.startsWith('{') || value.startsWith('[')) {
    try {
      return JSON.parse(value)
    } catch {
      // Not valid JSON, return as string
    }
  }

  // Try to parse as number
  const num = Number(value)
  if (!isNaN(num) && value !== '') {
    return num
  }

  // Try to parse as boolean
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false

  // Return as string
  return value
}

// ========== Clipboard Functions ==========

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback method
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)
    textarea.select()

    const success = document.execCommand('copy')
    document.body.removeChild(textarea)

    return success
  } catch (error) {
    console.error('Copy to clipboard failed:', error)
    return false
  }
}

/**
 * Read from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText()
    }
    return null
  } catch (error) {
    console.error('Read from clipboard failed:', error)
    return null
  }
}
