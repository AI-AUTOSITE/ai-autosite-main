// app/tools/code-dependency-visualizer/lib/analyzer.ts

import { FileNode, Dependency, ProjectAnalysis } from '../types'

// Skip these folders for performance
const SKIP_FOLDERS = ['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage']
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md']

export function analyzeProject(files: File[]): ProjectAnalysis {
  const fileNodes: FileNode[] = []
  const dependencies: Dependency[] = []
  const stats = {
    totalFiles: 0,
    totalSize: 0,
    totalLines: 0,
    fileTypes: {} as Record<string, number>
  }

  // Process files
  files.forEach(file => {
    const path = file.webkitRelativePath || file.name
    const parts = path.split('/')
    
    // Skip unwanted folders
    if (parts.some(part => SKIP_FOLDERS.includes(part))) {
      return
    }

    const extension = getFileExtension(file.name)
    
    // Skip unwanted file types
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return
    }

    stats.totalFiles++
    stats.totalSize += file.size
    
    // Count file types
    stats.fileTypes[extension] = (stats.fileTypes[extension] || 0) + 1
    
    // Add to file nodes
    addFileNode(fileNodes, path, file)
  })

  // Generate tree markdown
  const treeMarkdown = generateTreeMarkdown(fileNodes)

  // Remove duplicate dependencies
  const uniqueDeps = Array.from(
    new Map(
      dependencies.map(dep => [
        `${dep.source}:${dep.target}:${dep.type}`,
        dep
      ])
    ).values()
  )

  return {
    files: fileNodes,
    dependencies: uniqueDeps,
    stats,
    treeMarkdown
  }
}

function addFileNode(nodes: FileNode[], path: string, file: File) {
  const parts = path.split('/')
  let current = nodes
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const isLast = i === parts.length - 1
    
    let node = current.find(n => n.name === part)
    
    if (!node) {
      node = {
        name: part,
        path: parts.slice(0, i + 1).join('/'),
        type: isLast ? 'file' : 'folder',
        size: isLast ? file.size : undefined,
        extension: isLast ? getFileExtension(part) : undefined,
        children: isLast ? undefined : []
      }
      current.push(node)
    }
    
    if (!isLast && node.children) {
      current = node.children
    }
  }
}

export function getFileExtension(filename: string): string {
  const match = filename.match(/\.[^.]+$/)
  return match ? match[0] : ''
}

export function generateTreeMarkdown(nodes: FileNode[], prefix = ''): string {
  let markdown = ''
  
  // Sort: folders first, then files
  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
  
  sorted.forEach((node, index) => {
    const isLast = index === sorted.length - 1
    const connector = isLast ? '└── ' : '├── '
    const icon = node.type === 'folder' ? '📁' : getFileIcon(node.extension || '')
    
    markdown += `${prefix}${connector}${icon} ${node.name}\n`
    
    if (node.children) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ')
      markdown += generateTreeMarkdown(node.children, newPrefix)
    }
  })
  
  return markdown
}

function getFileIcon(extension: string): string {
  const icons: Record<string, string> = {
    '.ts': '📘',
    '.tsx': '⚛️',
    '.js': '📄',
    '.jsx': '⚛️',
    '.json': '📋',
    '.css': '🎨',
    '.md': '📝',
    '.html': '🌐',
    '.svg': '🖼️',
    '.png': '🖼️',
    '.jpg': '🖼️'
  }
  return icons[extension] || '📄'
}

export function extractDependencies(content: string, filePath: string): Dependency[] {
  const dependencies: Dependency[] = []
  
  // Simple import detection
  const importRegex = /import\s+(?:[\w{},\s*]+\s+from\s+)?['"]([^'"]+)['"]/g
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g
  const exportRegex = /export\s+(?:default\s+)?(?:[\w{},\s*]+\s+from\s+)?['"]([^'"]+)['"]/g
  
  let match
  
  while ((match = importRegex.exec(content)) !== null) {
    dependencies.push({
      source: filePath,
      target: match[1],
      type: 'import'
    })
  }
  
  while ((match = requireRegex.exec(content)) !== null) {
    dependencies.push({
      source: filePath,
      target: match[1],
      type: 'require'
    })
  }
  
  while ((match = exportRegex.exec(content)) !== null) {
    dependencies.push({
      source: filePath,
      target: match[1],
      type: 'export'
    })
  }
  
  return dependencies
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}