// app/tools/code-reader/lib/types.ts

// File analysis types
export interface FileAnalysis {
  fileName: string
  fullPath: string
  fileType: 'page' | 'component' | 'util' | 'type' | 'other'
  localImports: string[]
  externalImports: string[]
  linesOfCode: number
}

// File data structure
export interface FileData {
  name: string
  path: string
  size: number
  content?: string
  analysis?: FileAnalysis
}

// Project structure (directory -> files mapping)
export interface ProjectStructure {
  [directory: string]: FileData[]
}

// Code error types
export interface CodeError {
  type: 'unresolved_import' | 'circular_dependency' | 'missing_export' | 'unused_file' | 'type_error'
  severity: 'error' | 'warning' | 'info'
  file: string
  line?: number
  message: string
  details?: string
  quickFix?: string
}

// Smart Dependency Analysis Types (新規追加)
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
  errors: CodeError[]
}

// Dependency analysis
export interface DependencyNode {
  id: string
  name: string
  type: 'file' | 'external' | 'internal'
  dependencies: string[]
  dependents: string[]
}

export interface DependencyGraph {
  nodes: Record<string, DependencyNode>
  edges: Array<{
    source: string
    target: string
    type: 'import' | 'export' | 'require'
  }>
}

// Analysis results
export interface AnalysisResult {
  stats: {
    totalFiles: number
    totalDependencies: number
    totalLines: number
    circularDependencies: number
    orphanedFiles: number
  }
  dependencies: DependencyGraph
  errors: CodeError[]
  suggestions: string[]
  hotspots: Array<{
    name: string
    dependencyCount: number
    type: string
  }>
}

// Auto-save data structure
export interface AutoSaveData {
  id: string
  timestamp: number
  projectName: string
  files: FileData[]
  structure: ProjectStructure | null
  githubUrl?: string
  selectedFiles?: string[]
  compressionSettings?: {
    enabled: boolean
    level?: number
  }
  lastAction: string
}

// Export options
export interface ExportOptions {
  format: 'json' | 'markdown' | 'mermaid' | 'compressed'
  includeContent: boolean
  includeAnalysis: boolean
  includeDependencies: boolean
}

// Configuration
export interface AppConfig {
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  features: {
    aiAnalysis: boolean
    autoSave: boolean
    compression: boolean
    sharing: boolean
  }
  tokenLimit: number
  compactMode: boolean
  showTips: boolean
}

// Smart file selection
export interface FileSelectionContext {
  targetFile: string | null
  purpose: 'refactor' | 'debug' | 'optimize' | 'explain' | 'review'
  maxTokens: number
  selectedFiles: string[]
  tokenCount: number
}