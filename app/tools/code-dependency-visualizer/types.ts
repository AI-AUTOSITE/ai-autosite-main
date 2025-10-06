// app/tools/code-dependency-visualizer/types.ts

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  size?: number
  content?: string
  children?: FileNode[]
  extension?: string
}

export interface Dependency {
  source: string
  target: string
  type: 'import' | 'export' | 'require'
}

export interface CompressedFile {
  path: string
  original: string
  compressed: string
  originalTokens: number
  compressedTokens: number
  compressionRate: number
}

export interface ProjectAnalysis {
  files: FileNode[]
  dependencies: Dependency[]
  stats: {
    totalFiles: number
    totalSize: number
    totalLines: number
    fileTypes: Record<string, number>
    compressionRate?: number
  }
  compressed?: CompressedFile[]
  treeMarkdown?: string
}
