// app/tools/ai-project-visualizer/lib/types.ts

export interface TreeNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: TreeNode[]
  expanded?: boolean
  path?: string
  size?: number
  modified?: string
}

export interface ExportFormat {
  id: 'mermaid' | 'tree' | 'json' | 'markdown'
  name: string
  description: string
  example: string
  bestFor: string
  icon: string
}

export interface ProjectData {
  name: string
  totalFiles: number
  totalFolders: number
  structure: TreeNode
  createdAt: string
}

export interface ExportOptions {
  format: 'mermaid' | 'tree' | 'json' | 'markdown'
  includeHidden: boolean
  maxDepth: number
  sortAlphabetically: boolean
}