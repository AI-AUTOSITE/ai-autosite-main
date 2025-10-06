// app/tools/code-dependency-visualizer/lib/compressor.ts

import { CompressedFile } from '../types'

// Token counting approximation
export function countTokens(text: string): number {
  // Simple approximation: ~4 characters per token
  return Math.ceil(text.length / 4)
}

export function compressCode(content: string, filePath: string): CompressedFile {
  const originalTokens = countTokens(content)

  // Apply compression techniques
  let compressed = content

  // 1. Remove comments
  compressed = removeComments(compressed, filePath)

  // 2. Remove excessive whitespace
  compressed = removeExcessiveWhitespace(compressed)

  // 3. Minify if appropriate
  if (shouldMinify(filePath)) {
    compressed = minifyCode(compressed)
  }

  // 4. Remove console logs and debug code
  compressed = removeDebugCode(compressed)

  const compressedTokens = countTokens(compressed)
  const compressionRate = Math.round((1 - compressedTokens / originalTokens) * 100)

  return {
    path: filePath,
    original: content,
    compressed,
    originalTokens,
    compressedTokens,
    compressionRate,
  }
}

function removeComments(code: string, filePath: string): string {
  const ext = filePath.split('.').pop()

  if (['ts', 'tsx', 'js', 'jsx'].includes(ext || '')) {
    // Remove single-line comments
    code = code.replace(/\/\/.*$/gm, '')

    // Remove multi-line comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, '')

    // Remove JSDoc comments
    code = code.replace(/\/\*\*[\s\S]*?\*\//g, '')
  }

  if (ext === 'css') {
    // Remove CSS comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, '')
  }

  return code
}

function removeExcessiveWhitespace(code: string): string {
  // Remove multiple blank lines
  code = code.replace(/\n\s*\n\s*\n/g, '\n\n')

  // Remove trailing whitespace
  code = code.replace(/[ \t]+$/gm, '')

  // Remove leading whitespace (careful not to break indentation)
  code = code.replace(/^\s+/gm, (match) => {
    // Keep indentation but reduce it
    const spaces = match.length
    return ' '.repeat(Math.floor(spaces / 2))
  })

  return code
}

function minifyCode(code: string): string {
  // Simple minification (preserve readability)

  // Remove unnecessary spaces around operators
  code = code.replace(/\s*([=+\-*/<>!&|,;:{}()\[\]])\s*/g, '$1')

  // Restore necessary spaces
  code = code.replace(/([a-zA-Z_$])([=+\-*/<>!&|])/g, '$1 $2')
  code = code.replace(/([=+\-*/<>!&|])([a-zA-Z_$])/g, '$1 $2')

  // Remove empty lines
  code = code.replace(/^\s*$/gm, '')

  // Join lines where possible
  code = code.replace(/\n+/g, '\n')

  return code
}

function removeDebugCode(code: string): string {
  // Remove console statements
  code = code.replace(/console\.(log|debug|info|warn|error)\([^)]*\);?/g, '')

  // Remove debugger statements
  code = code.replace(/debugger;?/g, '')

  // Remove TODO comments
  code = code.replace(/\/\/\s*(TODO|FIXME|HACK|XXX|NOTE).*$/gm, '')

  return code
}

function shouldMinify(filePath: string): boolean {
  const ext = filePath.split('.').pop()
  return ['js', 'jsx', 'ts', 'tsx', 'css'].includes(ext || '')
}

export function compressProject(files: Array<{ path: string; content: string }>): {
  compressed: CompressedFile[]
  totalOriginalTokens: number
  totalCompressedTokens: number
  averageCompressionRate: number
} {
  const compressed = files.map((file) => compressCode(file.content, file.path))

  const totalOriginalTokens = compressed.reduce((sum, file) => sum + file.originalTokens, 0)
  const totalCompressedTokens = compressed.reduce((sum, file) => sum + file.compressedTokens, 0)
  const averageCompressionRate = Math.round((1 - totalCompressedTokens / totalOriginalTokens) * 100)

  return {
    compressed,
    totalOriginalTokens,
    totalCompressedTokens,
    averageCompressionRate,
  }
}

export function generateCompressedBundle(compressed: CompressedFile[]): string {
  let bundle = '# Compressed Files for AI Sharing\n\n'

  bundle += '## Summary\n\n'
  bundle += `- Total Files: ${compressed.length}\n`

  const totalOriginal = compressed.reduce((sum, f) => sum + f.originalTokens, 0)
  const totalCompressed = compressed.reduce((sum, f) => sum + f.compressedTokens, 0)
  const avgRate = Math.round((1 - totalCompressed / totalOriginal) * 100)

  bundle += `- Compression Rate: ${avgRate}%\n`
  bundle += `- Total Tokens Saved: ${totalOriginal - totalCompressed}\n\n`

  compressed.forEach((file) => {
    bundle += `## ${file.path}\n\n`
    bundle += `- Original Tokens: ${file.originalTokens.toLocaleString()}\n`
    bundle += `- Compressed Tokens: ${file.compressedTokens.toLocaleString()}\n`
    bundle += `- Type: ${file.path.split('.').pop()}\n\n`
    bundle += '```\n'
    bundle += file.compressed
    bundle += '\n```\n\n'
    bundle += '---\n\n'
  })

  return bundle
}
