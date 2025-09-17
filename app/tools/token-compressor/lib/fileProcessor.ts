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
    const isPDF = file.type === 'application/pdf'
    
    let content = ''
    let imageData = ''
    
    if (isImage) {
      // Convert image to base64
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
      imageData = `data:${file.type};base64,${base64}`
      content = `[Image: ${file.name}]` // Placeholder for token counting
    } else if (isPDF) {
      // For PDF, we would need a PDF parsing library
      // For now, just extract text if possible or use placeholder
      content = `[PDF Document: ${file.name}]`
      // In production, use pdf.js or similar to extract text
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
      path: file.webkitRelativePath || file.name
    }
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error)
    return null
  }
}

function detectFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()
  
  const typeMap: Record<string, string> = {
    'js': 'application/javascript',
    'jsx': 'application/javascript',
    'ts': 'application/typescript',
    'tsx': 'application/typescript',
    'py': 'text/x-python',
    'java': 'text/x-java',
    'cpp': 'text/x-c++',
    'c': 'text/x-c',
    'h': 'text/x-c',
    'cs': 'text/x-csharp',
    'php': 'text/x-php',
    'rb': 'text/x-ruby',
    'go': 'text/x-go',
    'rs': 'text/x-rust',
    'kt': 'text/x-kotlin',
    'swift': 'text/x-swift',
    'json': 'application/json',
    'xml': 'application/xml',
    'yaml': 'text/yaml',
    'yml': 'text/yaml',
    'md': 'text/markdown',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'html': 'text/html',
    'css': 'text/css',
    'scss': 'text/x-scss',
    'sass': 'text/x-sass',
    'less': 'text/x-less',
    'sql': 'text/x-sql',
    'sh': 'text/x-sh',
    'bash': 'text/x-sh',
    'zsh': 'text/x-sh',
    'fish': 'text/x-sh',
    'dockerfile': 'text/x-dockerfile',
    'makefile': 'text/x-makefile',
    'gitignore': 'text/plain',
    'env': 'text/plain',
    'ini': 'text/plain',
    'cfg': 'text/plain',
    'conf': 'text/plain',
  }
  
  return typeMap[extension || ''] || 'text/plain'
}

export function combineFiles(files: ProcessedFile[]): string {
  return files.map(file => {
    return `### ${file.name}\n\n${file.content}\n\n`
  }).join('---\n\n')
}