// lib/code-compressor.ts

interface CompressionOptions {
  removeComments: boolean
  removeEmptyLines: boolean
  removeIndentation: boolean
  minifySpaces: boolean
  preserveImportantComments: boolean
}

interface CompressionResult {
  original: string
  compressed: string
  originalSize: number
  compressedSize: number
  reduction: number
  tokenSaved: number // Approximate token count saved
}

export class CodeCompressor {
  private defaultOptions: CompressionOptions = {
    removeComments: true,
    removeEmptyLines: true,
    removeIndentation: true,
    minifySpaces: true,
    preserveImportantComments: true // Keep TODO, FIXME, etc.
  }

  /**
   * Compress code for AI sharing
   */
  compressCode(code: string, fileExtension: string, options?: Partial<CompressionOptions>): CompressionResult {
    const opts = { ...this.defaultOptions, ...options }
    let compressed = code

    // Store original for comparison
    const original = code
    
    // Apply compression based on file type
    if (this.isJavaScriptLike(fileExtension)) {
      compressed = this.compressJavaScriptLike(compressed, opts)
    } else if (this.isCSSLike(fileExtension)) {
      compressed = this.compressCSSLike(compressed, opts)
    } else if (this.isMarkdown(fileExtension)) {
      compressed = this.compressMarkdown(compressed, opts)
    } else {
      // Generic compression for other files
      compressed = this.genericCompress(compressed, opts)
    }

    // Calculate results
    const originalSize = new Blob([original]).size
    const compressedSize = new Blob([compressed]).size
    const reduction = Math.round(((originalSize - compressedSize) / originalSize) * 100)
    
    // Approximate token count (1 token ≈ 4 characters)
    const tokenSaved = Math.round((originalSize - compressedSize) / 4)

    return {
      original,
      compressed,
      originalSize,
      compressedSize,
      reduction,
      tokenSaved
    }
  }

  /**
   * Compress multiple files at once
   */
  compressFiles(files: Record<string, string>, options?: Partial<CompressionOptions>): Record<string, CompressionResult> {
    const results: Record<string, CompressionResult> = {}
    
    for (const [path, content] of Object.entries(files)) {
      const extension = path.split('.').pop() || ''
      results[path] = this.compressCode(content, extension, options)
    }
    
    return results
  }

  /**
   * JavaScript/TypeScript/JSX/TSX compression
   */
  private compressJavaScriptLike(code: string, opts: CompressionOptions): string {
    let result = code

    // Preserve strings and template literals
    const stringMap = new Map<string, string>()
    let stringIndex = 0
    
    // Replace strings temporarily to preserve their content
    result = result.replace(/(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
      const key = `__STRING_${stringIndex++}__`
      stringMap.set(key, match)
      return key
    })

    // Remove comments
    if (opts.removeComments) {
      // Single-line comments
      result = result.replace(/\/\/(?!.*(__STRING_)).*$/gm, '')
      
      // Multi-line comments (preserve important ones)
      if (opts.preserveImportantComments) {
        result = result.replace(/\/\*(?!.*?(TODO|FIXME|IMPORTANT|NOTE|HACK|BUG|XXX))[\s\S]*?\*\//g, '')
      } else {
        result = result.replace(/\/\*[\s\S]*?\*\//g, '')
      }
    }

    // Remove empty lines
    if (opts.removeEmptyLines) {
      result = result.replace(/^\s*[\r\n]/gm, '')
    }

    // Remove indentation
    if (opts.removeIndentation) {
      result = result.split('\n').map(line => line.trimStart()).join('\n')
    }

    // Minify spaces
    if (opts.minifySpaces) {
      // Remove spaces around operators (careful with edge cases)
      result = result.replace(/\s*([=+\-*/%<>!&|,;:{}()\[\]])\s*/g, '$1')
      
      // Fix cases where spaces are needed
      result = result.replace(/(const|let|var|function|class|return|export|import|if|else|for|while|do|switch|case|break|continue|throw|try|catch|finally|async|await|yield|typeof|instanceof|in|of|new|delete|void)([{(<])/g, '$1 $2')
      
      // Remove multiple spaces
      result = result.replace(/\s+/g, ' ')
    }

    // Restore strings
    stringMap.forEach((value, key) => {
      result = result.replace(key, value)
    })

    // Final cleanup - remove trailing spaces
    result = result.split('\n').map(line => line.trimEnd()).join('\n')
    
    // Remove multiple consecutive newlines
    result = result.replace(/\n{3,}/g, '\n\n')

    return result
  }

  /**
   * CSS/SCSS/LESS compression
   */
  private compressCSSLike(code: string, opts: CompressionOptions): string {
    let result = code

    if (opts.removeComments) {
      result = result.replace(/\/\*[\s\S]*?\*\//g, '')
    }

    if (opts.removeEmptyLines) {
      result = result.replace(/^\s*[\r\n]/gm, '')
    }

    if (opts.minifySpaces) {
      // Remove spaces around CSS syntax
      result = result.replace(/\s*([{}:;,])\s*/g, '$1')
      result = result.replace(/\s+/g, ' ')
    }

    if (opts.removeIndentation) {
      result = result.split('\n').map(line => line.trim()).join('\n')
    }

    return result
  }

  /**
   * Markdown compression (minimal)
   */
  private compressMarkdown(code: string, opts: CompressionOptions): string {
    let result = code

    if (opts.removeEmptyLines) {
      // Keep only one empty line between sections
      result = result.replace(/\n{3,}/g, '\n\n')
    }

    return result
  }

  /**
   * Generic compression for other file types
   */
  private genericCompress(code: string, opts: CompressionOptions): string {
    let result = code

    if (opts.removeEmptyLines) {
      result = result.replace(/^\s*[\r\n]/gm, '')
    }

    if (opts.removeIndentation) {
      result = result.split('\n').map(line => line.trimStart()).join('\n')
    }

    if (opts.minifySpaces) {
      result = result.replace(/\s+/g, ' ')
    }

    return result
  }

  /**
   * Check file type helpers
   */
  private isJavaScriptLike(ext: string): boolean {
    return ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(ext.toLowerCase())
  }

  private isCSSLike(ext: string): boolean {
    return ['css', 'scss', 'sass', 'less'].includes(ext.toLowerCase())
  }

  private isMarkdown(ext: string): boolean {
    return ['md', 'mdx'].includes(ext.toLowerCase())
  }

  /**
   * Format bytes to human readable
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Estimate token count
   */
  static estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }
}