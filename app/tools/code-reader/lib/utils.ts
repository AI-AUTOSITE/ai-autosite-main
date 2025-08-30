import { FileAnalysis } from './types'

export function analyzeFileContent(file: File, content: string): FileAnalysis {
  const fileName = (file as any).webkitRelativePath || file.name
  const relativePath = fileName.replace(/^[^\/]*\//, '')
  
  const importPatterns = {
    esImport: /import\s+(?:(?:\{[^}]*\})|(?:\*\s+as\s+\w+)|(?:\w+))?\s*(?:,\s*(?:\{[^}]*\}|\w+))?\s*from\s+['"`]([^'"`]+)['"`]/g,
    require: /(?:const|let|var)\s+(?:\{[^}]*\}|\w+|\[.*?\])\s*=\s*require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    dynamicImport: /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    tsImport: /import\s+type\s+(?:\{[^}]*\}|\w+)\s+from\s+['"`]([^'"`]+)['"`]/g,
    reexport: /export\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g
  }
  
  const imports = new Set<string>()
  Object.values(importPatterns).forEach(pattern => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      imports.add(match[1])
    }
  })
  
  const allImports = Array.from(imports)
  const localImports = allImports.filter(imp => 
    imp.startsWith('.') || imp.startsWith('/') || imp.startsWith('@/')
  )
  const externalImports = allImports.filter(imp => 
    !imp.startsWith('.') && !imp.startsWith('/') && !imp.startsWith('@/')
  )
  
  const fileType = determineFileType(fileName, content)
  
  return {
    fileName: fileName.split('/').pop() || '',
    fullPath: relativePath,
    fileType,
    localImports,
    externalImports,
    content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
    linesOfCode: content.split('\n').length,
    hasExports: /export\s+(default\s+)?(const|let|var|function|class|interface|type|enum)/g.test(content)
  }
}

export function determineFileType(fileName: string, content: string): FileAnalysis['fileType'] {
  if (fileName.includes('page.') || fileName.includes('layout.') || fileName.includes('app/')) {
    return 'page'
  }
  if (fileName.includes('component') || content.includes('export default function') || 
      (content.includes('const') && content.includes('= () =>'))) {
    return 'component'
  }
  if (fileName.includes('utils') || fileName.includes('lib') || fileName.includes('helper')) {
    return 'util'
  }
  if (fileName.includes('types') || fileName.includes('.d.ts') || 
      content.includes('interface') || content.includes('type ')) {
    return 'type'
  }
  return 'other'
}

export function getFileTypeLabel(type: FileAnalysis['fileType']): string {
  const labels = {
    'page': 'Page/App',
    'component': 'Component', 
    'util': 'Utils/Lib',
    'type': 'Types',
    'other': 'Other'
  }
  return labels[type] || 'Other'
}