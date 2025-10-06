// utils/jsonProcessor.ts

// ========== Type Definitions ==========
export type ProcessMode = 'beautify' | 'minify'

export interface JsonStats {
  keys: number
  arrays: number
  objects: number
  size: number
}

export interface ProcessResult {
  success: boolean
  output: string
  error?: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  parsedData?: any
}

// ========== Constants ==========
export const DEFAULT_INDENT_SIZE = 2
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// ========== Core Processing Functions ==========

/**
 * Process JSON string with beautify or minify mode
 */
export function processJson(
  text: string,
  mode: ProcessMode = 'beautify',
  indentSize: number = DEFAULT_INDENT_SIZE
): ProcessResult {
  // Handle empty input
  if (!text.trim()) {
    return {
      success: true,
      output: '',
    }
  }

  // Validate and parse JSON
  const validation = validateJson(text)
  if (!validation.isValid) {
    return {
      success: false,
      output: '',
      error: validation.error,
    }
  }

  // Format based on mode
  try {
    const output =
      mode === 'beautify'
        ? JSON.stringify(validation.parsedData, null, indentSize)
        : JSON.stringify(validation.parsedData)

    return {
      success: true,
      output,
    }
  } catch (err) {
    return {
      success: false,
      output: '',
      error: `Formatting error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }
  }
}

/**
 * Validate JSON string
 */
export function validateJson(text: string): ValidationResult {
  try {
    const parsedData = JSON.parse(text)
    return {
      isValid: true,
      parsedData,
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Invalid JSON'
    // Improve error messages
    const improvedError = error
      .replace(/JSON\.parse: /, '')
      .replace(/at position (\d+)/, 'at character $1')

    return {
      isValid: false,
      error: `Invalid JSON: ${improvedError}`,
    }
  }
}

/**
 * Calculate statistics for JSON data
 */
export function calculateJsonStats(jsonString: string): JsonStats {
  try {
    if (!jsonString) {
      return { keys: 0, arrays: 0, objects: 0, size: 0 }
    }

    const parsed = JSON.parse(jsonString)
    const stats = analyzeJsonStructure(parsed)
    const size = new Blob([jsonString]).size

    return {
      ...stats,
      size,
    }
  } catch {
    return { keys: 0, arrays: 0, objects: 0, size: 0 }
  }
}

/**
 * Analyze JSON structure recursively
 */
function analyzeJsonStructure(data: any): Omit<JsonStats, 'size'> {
  let keys = 0
  let arrays = 0
  let objects = 0

  function traverse(obj: any): void {
    if (Array.isArray(obj)) {
      arrays++
      obj.forEach(traverse)
    } else if (obj !== null && typeof obj === 'object') {
      objects++
      Object.keys(obj).forEach((key) => {
        keys++
        traverse(obj[key])
      })
    }
  }

  traverse(data)
  return { keys, arrays, objects }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0B'

  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  if (i === 0) return `${bytes}${units[i]}`

  return `${(bytes / Math.pow(k, i)).toFixed(1)}${units[i]}`
}

/**
 * Check if file size is within limits
 */
export function isFileSizeValid(bytes: number): boolean {
  return bytes <= MAX_FILE_SIZE
}

/**
 * Get JSON path of a specific value
 */
export function getJsonPath(data: any, targetValue: any, currentPath: string = '$'): string | null {
  if (data === targetValue) {
    return currentPath
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const result = getJsonPath(data[i], targetValue, `${currentPath}[${i}]`)
      if (result) return result
    }
  } else if (data !== null && typeof data === 'object') {
    for (const key in data) {
      const safePath = key.includes('.') ? `["${key}"]` : `.${key}`
      const result = getJsonPath(data[key], targetValue, `${currentPath}${safePath}`)
      if (result) return result
    }
  }

  return null
}

/**
 * Compare two JSON objects and find differences
 */
export function compareJson(obj1: any, obj2: any, path: string = ''): string[] {
  const differences: string[] = []

  // Check if types are different
  if (typeof obj1 !== typeof obj2) {
    differences.push(`Type mismatch at ${path || 'root'}: ${typeof obj1} vs ${typeof obj2}`)
    return differences
  }

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLength = Math.max(obj1.length, obj2.length)
    for (let i = 0; i < maxLength; i++) {
      if (i >= obj1.length) {
        differences.push(`Missing element at ${path}[${i}] in first object`)
      } else if (i >= obj2.length) {
        differences.push(`Missing element at ${path}[${i}] in second object`)
      } else {
        differences.push(...compareJson(obj1[i], obj2[i], `${path}[${i}]`))
      }
    }
  }
  // Handle objects
  else if (obj1 !== null && typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    const allKeys = new Set([...keys1, ...keys2])

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key

      if (!(key in obj1)) {
        differences.push(`Missing key "${newPath}" in first object`)
      } else if (!(key in obj2)) {
        differences.push(`Missing key "${newPath}" in second object`)
      } else {
        differences.push(...compareJson(obj1[key], obj2[key], newPath))
      }
    }
  }
  // Handle primitives
  else if (obj1 !== obj2) {
    differences.push(
      `Value mismatch at ${path || 'root'}: ${JSON.stringify(obj1)} vs ${JSON.stringify(obj2)}`
    )
  }

  return differences
}

/**
 * Sort JSON object keys alphabetically
 */
export function sortJsonKeys(data: any): any {
  if (Array.isArray(data)) {
    return data.map(sortJsonKeys)
  }

  if (data !== null && typeof data === 'object') {
    const sorted: any = {}
    Object.keys(data)
      .sort()
      .forEach((key) => {
        sorted[key] = sortJsonKeys(data[key])
      })
    return sorted
  }

  return data
}

/**
 * Remove null/undefined values from JSON
 */
export function cleanJson(data: any, removeEmpty = false): any {
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== null && item !== undefined)
      .map((item) => cleanJson(item, removeEmpty))
  }

  if (data !== null && typeof data === 'object') {
    const cleaned: any = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (!removeEmpty || (value !== '' && !(Array.isArray(value) && value.length === 0))) {
          cleaned[key] = cleanJson(value, removeEmpty)
        }
      }
    })
    return cleaned
  }

  return data
}
