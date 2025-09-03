// Updated types.ts - add these to your existing types file

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

// New types for Smart Analyzer
export interface SmartDependency {
  id: string
  name: string
  path: string
  type: 'page' | 'component' | 'util' | 'type' | 'other'
  imports: string[]
  importedBy: string[]
  score: number
  risk: 'low' | 'medium' | 'high'
}

export interface ProjectStats {
  totalFiles: number
  totalDependencies: number
  averageImportsPerFile: number
  reuseabilityScore: number
  complexityScore: number
  maintainabilityScore: number
}

export interface DependencyInsight {
  hotspots: SmartDependency[]
  orphans: SmartDependency[]
  cycles: string[][]
  depth: number
  suggestions: string[]
  stats: ProjectStats
}
// lib/types.ts

export interface CodeError {
  type: 'unresolved_import' | 'circular_dependency' | 'missing_export' | 'unused_file' | 'type_error'
  severity: 'error' | 'warning' | 'info'
  file: string
  line?: number
  message: string
  details?: string
  quickFix?: string
}

export interface DependencyInsight {
  hotspots: SmartDependency[]
  orphans: SmartDependency[]
  cycles: string[][]
  depth: number
  suggestions: string[]
  stats: ProjectStats
  errors?: CodeError[]  // <- この行を追加
}