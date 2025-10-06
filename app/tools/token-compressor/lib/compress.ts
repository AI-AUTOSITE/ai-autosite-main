// app/tools/token-compressor/lib/compress.ts
import { ProcessedFile, CompressionOptions } from './types'

export async function compressFiles(
  files: ProcessedFile[],
  options: CompressionOptions = {
    level: 'aggressive', // デフォルトをaggressiveに変更
    removeComments: true,
    removeWhitespace: true,
    minifyCode: true,
    preserveStructure: false, // 可読性無視
  }
): Promise<ProcessedFile[]> {
  return files.map((file) => ({
    ...file,
    content: compressText(file.content, file.type, options),
  }))
}

export function compressText(text: string, fileType: string, options: CompressionOptions): string {
  let compressed = text

  // Detect programming language
  const isJavaScript = /javascript|typescript/.test(fileType)
  const isTSX = /tsx/.test(fileType)
  const isPython = /python/.test(fileType)
  const isCSS = /css|scss|sass|less/.test(fileType)
  const isHTML = /html/.test(fileType)
  const isJSON = /json/.test(fileType)
  const isMarkdown = /markdown/.test(fileType)
  const isCode =
    isJavaScript ||
    isTSX ||
    isPython ||
    /java|cpp|c\+\+|csharp|php|ruby|go|rust|kotlin|swift/.test(fileType)

  // Aggressive compression for TSX/TypeScript
  if ((isJavaScript || isTSX) && options.level === 'aggressive') {
    compressed = aggressiveJSCompression(compressed)
  } else if (options.removeComments) {
    // Standard comment removal
    if (isJavaScript || isCSS) {
      compressed = compressed.replace(/\/\/.*$/gm, '')
      compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '')
    }

    if (isPython) {
      const lines = compressed.split('\n')
      compressed = lines
        .map((line) => {
          const commentIndex = line.indexOf('#')
          if (commentIndex !== -1) {
            const beforeComment = line.substring(0, commentIndex)
            const singleQuotes = (beforeComment.match(/'/g) || []).length
            const doubleQuotes = (beforeComment.match(/"/g) || []).length

            if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
              return line.substring(0, commentIndex).trimEnd()
            }
          }
          return line
        })
        .join('\n')
    }

    if (isHTML) {
      compressed = compressed.replace(/<!--[\s\S]*?-->/g, '')
    }
  }

  if (options.removeWhitespace) {
    // Remove all blank lines
    compressed = compressed
      .split('\n')
      .filter((line) => line.trim())
      .join('\n')

    if (options.level === 'aggressive' && isCode) {
      // Aggressive whitespace removal for code
      compressed = compressed
        // Remove spaces around operators
        .replace(/\s*([=+\-*/&|<>!?:,;{}()\[\]])\s*/g, '$1')
        // Add back necessary spaces
        .replace(/([a-zA-Z0-9_])([=+\-*/&|<>!?:])([a-zA-Z0-9_])/g, '$1 $2 $3')
        .replace(
          /(const|let|var|function|class|export|import|return|if|else|for|while|switch|case|break|continue|throw|try|catch|finally|new|typeof|instanceof|in|of)([a-zA-Z0-9_\(\{])/g,
          '$1 $2'
        )
        // Fix common patterns
        .replace(/\)\{/g, ') {')
        .replace(/\}else/g, '} else')
        .replace(/else\{/g, 'else {')
    }

    // Minify JSON completely
    if (isJSON) {
      try {
        const parsed = JSON.parse(compressed)
        compressed = JSON.stringify(parsed)
      } catch {
        // If parsing fails, keep original
      }
    }
  }

  // Additional aggressive optimizations
  if (options.level === 'aggressive') {
    if (isJavaScript || isTSX) {
      // Remove unnecessary semicolons (ASI will handle it)
      compressed = compressed.replace(/;(\s*[}\)])/g, '$1')

      // Remove quotes from object keys where possible
      compressed = compressed.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, '$1:')
      compressed = compressed.replace(/'([a-zA-Z_][a-zA-Z0-9_]*)':/g, '$1:')

      // Shorten boolean values in certain contexts
      compressed = compressed
        .replace(/:\s*true/g, ':!0')
        .replace(/:\s*false/g, ':!1')
        .replace(/===\s*true/g, '===!0')
        .replace(/===\s*false/g, '===!1')
        .replace(/!==\s*true/g, '!==!0')
        .replace(/!==\s*false/g, '!==!1')
    }
  }

  return compressed.trim()
}

// Specialized aggressive compression for JS/TSX
function aggressiveJSCompression(code: string): string {
  let compressed = code

  // Remove all comments first
  compressed = compressed.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')

  // Remove JSDoc comments
  compressed = compressed.replace(/\/\*\*[\s\S]*?\*\//g, '')

  // Remove type annotations in TypeScript (for AI, types are less important)
  compressed = compressed
    // Remove type declarations
    .replace(/:\s*[A-Z][a-zA-Z0-9<>,\[\]\s|&]*(\s*[=;,\)])/g, '$1')
    // Remove interface and type definitions
    .replace(/^(export\s+)?(interface|type)\s+[A-Za-z0-9_]+\s*=?[\s\S]*?^}/gm, '')
    // Remove generic type parameters
    .replace(/<[A-Za-z0-9,\s]+>/g, '')

  // Compress imports/exports
  compressed = compressed
    .replace(/import\s+{\s*/g, 'import{')
    .replace(/\s*}\s+from/g, '}from')
    .replace(/export\s+{\s*/g, 'export{')
    .replace(/\s*}/g, '}')

  // Remove all unnecessary whitespace
  const lines = compressed.split('\n')
  compressed = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')

  // Single-line simple functions where possible
  compressed = compressed.replace(/\{[\s]*return\s+([^;]+);?[\s]*\}/g, '{return $1}')

  // Compress object and array literals
  compressed = compressed
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .replace(/\{\s+/g, '{')
    .replace(/\s+\}/g, '}')
    .replace(/,\s+/g, ',')

  // Remove spaces around operators
  compressed = compressed
    .replace(/\s*([=+\-*/&|<>!?:;])\s*/g, '$1')
    // Add back necessary spaces for keywords
    .replace(
      /(const|let|var|function|class|export|import|return|if|else|for|while|new|typeof|instanceof)([a-zA-Z(])/g,
      '$1 $2'
    )

  // Join lines where possible
  compressed = compressed
    .replace(/\n{/g, '{')
    .replace(/}\n/g, '}')
    .replace(/;\n/g, ';')
    .replace(/,\n/g, ',')

  // Final cleanup - remove ALL newlines for maximum compression
  compressed = compressed
    .replace(/\n/g, ' ') // Replace all newlines with single space
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()

  return compressed
}

// Super aggressive compression (experimental)
export function ultraCompress(text: string, fileType: string): string {
  if (!/javascript|typescript|tsx/.test(fileType)) {
    return compressText(text, fileType, {
      level: 'aggressive',
      removeComments: true,
      removeWhitespace: true,
      minifyCode: true,
      preserveStructure: false,
    })
  }

  let compressed = aggressiveJSCompression(text)

  // Even more aggressive optimizations
  compressed = compressed
    // Remove all newlines except after imports/exports
    .replace(/\n(?!(import|export))/g, '')
    // Add minimal newlines for AI parsing
    .replace(/(import[^;]+;)/g, '$1\n')
    .replace(/(export[^;]+;)/g, '$1\n')
    .replace(/({|})/g, '$1')

  return compressed
}

// Calculate actual compression ratio
export function getCompressionStats(original: string, compressed: string) {
  const originalSize = new Blob([original]).size
  const compressedSize = new Blob([compressed]).size
  const ratio = Math.round((1 - compressedSize / originalSize) * 100)

  return {
    originalSize,
    compressedSize,
    ratio,
    bytesSaved: originalSize - compressedSize,
  }
}
