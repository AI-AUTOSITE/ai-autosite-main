export interface FileAnalysis {
  fileName: string
  fullPath: string
  fileType: 'page' | 'component' | 'util' | 'type' | 'other'
  localImports: string[]
  externalImports: string[]
  content?: string
  linesOfCode?: number
  hasExports?: boolean
}

export interface FileData {
  name: string
  path: string
  size: number
  analysis: FileAnalysis
}

export interface FileStructure {
  [directory: string]: FileData[]
}

export interface DependencyInfo {
  dependsOn: string[]
  dependedBy: string[]
  risk: 'low' | 'medium' | 'high'
  hasCircular?: boolean
}

export interface SecurityCheck {
  warnings: string[]
  errors: string[]
}