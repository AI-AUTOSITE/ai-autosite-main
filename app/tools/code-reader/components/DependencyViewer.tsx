'use client'

import React, { useState, useMemo, Suspense } from 'react'
import { 
  GitBranch, 
  Copy,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  Download,
  FolderTree,
  Network
} from 'lucide-react'

// Import the Smart Analyzer
import { SmartDependencyAnalyzer } from '../lib/smart-dependency-analyzer'
import InteractiveDependencyGraph from './InteractiveDependencyGraph'

interface FileAnalysis {
  fileName: string
  fullPath: string
  fileType: 'page' | 'component' | 'util' | 'type' | 'other'
  localImports: string[]
  externalImports: string[]
  linesOfCode: number
}

interface FileData {
  name: string
  path: string
  size: number
  analysis: FileAnalysis
}

interface FileStructure {
  [directory: string]: FileData[]
}

interface DependencyViewerProps {
  fileStructure: FileStructure
  allFiles: Record<string, string>
  selectedFile: string | null
  setSelectedFile?: (path: string | null) => void
}

export default function DependencyViewer({ 
  fileStructure = {}, 
  selectedFile,
  allFiles = {},
  setSelectedFile = () => {}
}: DependencyViewerProps) {
  
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showRelationshipPreview, setShowRelationshipPreview] = useState(false)
  const [showMapTreePreview, setShowMapTreePreview] = useState(false)
  const [showInteractiveGraph, setShowInteractiveGraph] = useState(false)

  // Initialize Smart Analyzer and get insights
  const smartInsight = useMemo(() => {
    if (!fileStructure || Object.keys(fileStructure).length === 0) {
      return null
    }
    
    const analyzer = new SmartDependencyAnalyzer()
    return analyzer.analyze(fileStructure, allFiles)
  }, [fileStructure, allFiles])

  // Create analyzer instance for export functions
  const analyzer = useMemo(() => {
    const smartAnalyzer = new SmartDependencyAnalyzer()
    if (fileStructure && Object.keys(fileStructure).length > 0) {
      smartAnalyzer.analyze(fileStructure, allFiles)
    }
    return smartAnalyzer
  }, [fileStructure, allFiles])

  // Calculate health grade
  const healthGrade = useMemo(() => {
    if (!smartInsight) return { grade: 'N/A', color: 'text-gray-400' }
    
    const score = smartInsight.stats.maintainabilityScore
    if (score >= 90) return { grade: 'A+', color: 'text-green-400' }
    if (score >= 80) return { grade: 'A', color: 'text-green-400' }
    if (score >= 70) return { grade: 'B+', color: 'text-blue-400' }
    if (score >= 60) return { grade: 'B', color: 'text-blue-400' }
    if (score >= 50) return { grade: 'C+', color: 'text-yellow-400' }
    return { grade: 'C', color: 'text-orange-400' }
  }, [smartInsight])

  const copyToClipboard = async (format: 'maptree' | 'relationship' | 'graph' | 'impact' | 'markdown' | 'json') => {
    try {
      let output = ''
      switch (format) {
        case 'maptree':
          output = generateMapTree()
          break
        case 'relationship':
          output = analyzer.generateRelationshipMap()
          break
        case 'graph':
          output = analyzer.generateAIPrompt()
          break
        case 'impact':
          if (selectedFile) {
            output = analyzer.generateImpactReport(selectedFile)
          } else {
            alert('Please select a file first for impact analysis')
            return
          }
          break
        case 'markdown':
          output = analyzer.generateMarkdownReport()
          break
        case 'json':
          output = analyzer.generateCompactJSON()
          break
      }
      
      await navigator.clipboard.writeText(output)
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const downloadFile = (format: string) => {
    let output = ''
    let filename = ''
    let mimeType = ''
    
    switch (format) {
      case 'maptree':
        output = generateMapTree()
        filename = 'project-map-tree.md'
        mimeType = 'text/markdown'
        break
      case 'relationship':
        output = analyzer.generateRelationshipMap()
        filename = 'dependency-relationships.md'
        mimeType = 'text/markdown'
        break
      case 'graph':
        output = analyzer.generateAIPrompt()
        filename = 'dependency-graph.md'
        mimeType = 'text/markdown'
        break
      default:
        return
    }
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Generate Map Tree in MD format
  const generateMapTree = () => {
    let output = `# Project Map Tree\n\n`
    output += `**Generated**: ${new Date().toISOString()}\n`
    output += `**Total Files**: ${smartInsight?.stats.totalFiles || 0}\n\n`
    output += `## Directory Structure\n\n`
    output += '```\n'
    
    Object.entries(fileStructure).forEach(([dir, files]) => {
      const dirName = dir === '/' ? 'root' : dir
      output += `${dirName}\n`
      
      files.forEach((file, index) => {
        const isLast = index === files.length - 1
        const prefix = isLast ? '└── ' : '├── '
        output += `  ${prefix}${file.name} (${file.analysis.linesOfCode}L)\n`
        
        // Add import info
        if (file.analysis.localImports.length > 0) {
          const importPrefix = isLast ? '    ' : '│   '
          output += `${importPrefix}    imports: ${file.analysis.localImports.length} files\n`
        }
      })
      output += '\n'
    })
    
    output += '```\n\n'
    
    // Add summary
    output += `## Summary\n\n`
    output += `- **Pages**: ${Object.values(fileStructure).flat().filter(f => f.analysis.fileType === 'page').length}\n`
    output += `- **Components**: ${Object.values(fileStructure).flat().filter(f => f.analysis.fileType === 'component').length}\n`
    output += `- **Utilities**: ${Object.values(fileStructure).flat().filter(f => f.analysis.fileType === 'util').length}\n`
    output += `- **Types**: ${Object.values(fileStructure).flat().filter(f => f.analysis.fileType === 'type').length}\n`
    
    return output
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'page': return '📄'
      case 'component': return '🧩'
      case 'util': return '⚙️'
      case 'type': return '📝'
      default: return '📋'
    }
  }

  // Generate preview for map tree
  const getMapTreePreview = () => {
    const dirs = Object.keys(fileStructure).slice(0, 3)
    let preview = ''
    
    dirs.forEach(dir => {
      const files = fileStructure[dir].slice(0, 2)
      preview += `📁 ${dir === '/' ? 'root' : dir.split('/').pop()}\n`
      files.forEach(file => {
        preview += `  ├── ${getFileIcon(file.analysis.fileType)} ${file.name}\n`
      })
      if (fileStructure[dir].length > 2) {
        preview += `  └── ... +${fileStructure[dir].length - 2} more\n`
      }
      preview += '\n'
    })
    
    return preview || 'Loading...'
  }

  // Generate preview for relationship map
  const getRelationshipPreview = () => {
    const files = Object.values(fileStructure).flat()
    const preview = files.slice(0, 3).map(file => {
      const imports = file.analysis.localImports.length
      const fileName = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name
      return `${fileName}\n  ← ${imports} imports`
    }).join('\n\n')
    return preview || 'Loading...'
  }

  if (!smartInsight) {
    return (
      <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
        <div className="animate-pulse">
          <div className="text-gray-400">Analyzing project structure...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 🎯 PRIMARY FEATURES - Map Tree and Dependencies */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">🎯</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quick Export - 2 Click Features
          </h2>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="text-gray-400">Files: <span className="font-bold text-blue-400">{smartInsight.stats.totalFiles}</span></span>
            <span className="text-gray-400">Health: <span className={`font-bold ${healthGrade.color}`}>{healthGrade.grade}</span></span>
            {smartInsight.cycles.length > 0 && (
              <span className="text-yellow-400">⚠️ {smartInsight.cycles.length}</span>
            )}
            {smartInsight.errors && smartInsight.errors.filter(e => e.severity === 'error').length > 0 && (
              <span className="text-red-400">🔴 {smartInsight.errors.filter(e => e.severity === 'error').length}</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Tree Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-green-900/40 to-green-800/30 rounded-xl border-2 border-green-500/50 overflow-hidden hover:border-green-400/70 transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">🗂️</span>
                    Map Tree
                  </h3>
                  <span className="text-xs text-green-400 bg-green-400/20 px-3 py-1 rounded-full">
                    MD Format
                  </span>
                </div>
                
                {/* Visual Preview */}
                <div className="bg-slate-900/80 rounded-lg p-6 mb-4 h-56 overflow-hidden">
                  <pre className="text-xs text-gray-300 font-mono">
{getMapTreePreview()}
                  </pre>
                  
                  <button
                    onClick={() => setShowMapTreePreview(!showMapTreePreview)}
                    className="mt-3 text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                  >
                    <Eye size={12} />
                    Preview Full Tree
                  </button>
                </div>
                
                {/* Preview Content */}
                {showMapTreePreview && (
                  <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                    <pre className="text-xs text-gray-300 overflow-auto max-h-64">
{generateMapTree()}
                    </pre>
                  </div>
                )}
                
                {/* 1-Click Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => copyToClipboard('maptree')}
                    className="bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-all transform hover:scale-105 font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    {copiedFormat === 'maptree' ? (
                      <>
                        <CheckCircle size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy Tree
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => downloadFile('maptree')}
                    className="bg-slate-700 hover:bg-slate-600 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dependencies Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-purple-900/40 to-purple-800/30 rounded-xl border-2 border-purple-500/50 overflow-hidden hover:border-purple-400/70 transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">🔗</span>
                    Dependencies
                  </h3>
                  <span className="text-xs text-purple-400 bg-purple-400/20 px-3 py-1 rounded-full">
                    ~{analyzer.estimateTokens('relationship')} tokens
                  </span>
                </div>
                
                {/* Text Preview */}
                <div className="bg-slate-900/80 rounded-lg p-6 mb-4 h-56 overflow-hidden">
                  <pre className="text-xs text-gray-300 font-mono">
{getRelationshipPreview()}
                  </pre>
                  
                  <button
                    onClick={() => setShowRelationshipPreview(!showRelationshipPreview)}
                    className="mt-3 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Eye size={12} />
                    {showRelationshipPreview ? 'Hide' : 'Show'} Full Preview
                  </button>
                </div>
                
                {/* Full Preview */}
                {showRelationshipPreview && (
                  <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                    <pre className="text-xs text-gray-300 overflow-auto max-h-32">
{analyzer.generateRelationshipMap().substring(0, 500)}...
                    </pre>
                  </div>
                )}
                
                {/* 1-Click Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => copyToClipboard('relationship')}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 py-3 rounded-lg transition-all transform hover:scale-105 font-semibold flex items-center justify-center gap-2 shadow-xl text-white"
                  >
                    {copiedFormat === 'relationship' ? (
                      <>
                        <CheckCircle size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy Deps
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => downloadFile('relationship')}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 py-3 rounded-lg transition-all transform hover:scale-105 font-semibold flex items-center justify-center gap-2 shadow-lg text-white"
                  >
                    <Download size={18} />
                    Download MD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features (Collapsed by Default) */}
      <div className="space-y-4">
        {/* Advanced Analysis Options */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-4 flex justify-between items-center hover:bg-slate-700/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📤</span>
              <span className="font-semibold">Advanced Analysis Options</span>
              <span className="text-xs text-gray-400">
                (AI Graph, Impact Analysis, Full Reports)
              </span>
            </div>
            {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showAdvanced && (
            <div className="p-6 border-t border-slate-700 space-y-6">
              {/* Dependency Graph (now in advanced section) */}
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-xl">🕸️</span>
                    Dependency Graph (AI Analysis)
                  </h3>
                  <span className="text-xs text-blue-400 bg-blue-400/20 px-3 py-1 rounded-full">
                    ~{analyzer.estimateTokens('prompt')} tokens
                  </span>
                </div>
                
                <div className="text-sm text-gray-400 mb-4">
                  AI-ready analysis with project health score, critical files detection, and recommendations
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => copyToClipboard('graph')}
                    className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {copiedFormat === 'graph' ? (
                      <>
                        <CheckCircle size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy for AI
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => downloadFile('graph')}
                    className="bg-slate-600 hover:bg-slate-500 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{smartInsight.hotspots.length}</div>
                  <div className="text-xs text-gray-400">Critical Files</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{smartInsight.orphans.length}</div>
                  <div className="text-xs text-gray-400">Unused Files</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{smartInsight.cycles.length}</div>
                  <div className="text-xs text-gray-400">Circular Deps</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{smartInsight.depth}</div>
                  <div className="text-xs text-gray-400">Max Depth</div>
                </div>
              </div>

              {/* Additional Export Formats */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => copyToClipboard('impact')}
                  className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
                  disabled={!selectedFile}
                >
                  <div className="text-lg mb-1">🎯</div>
                  <div className="font-semibold">Impact Analysis</div>
                  <div className="text-xs text-gray-400">
                    {selectedFile ? 'Ready' : 'Select file first'}
                  </div>
                </button>
                
                <button
                  onClick={() => copyToClipboard('markdown')}
                  className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
                >
                  <div className="text-lg mb-1">📄</div>
                  <div className="font-semibold">Full Report</div>
                  <div className="text-xs text-gray-400">~800 tokens</div>
                </button>
                
                <button
                  onClick={() => copyToClipboard('json')}
                  className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
                >
                  <div className="text-lg mb-1">📊</div>
                  <div className="font-semibold">JSON Data</div>
                  <div className="text-xs text-gray-400">~1000 tokens</div>
                </button>
              </div>

              {/* Health Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Reusability</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full">
                      <div 
                        className="h-2 bg-green-400 rounded-full"
                        style={{ width: `${smartInsight.stats.reuseabilityScore}%` }}
                      />
                    </div>
                    <span className="text-sm text-green-400">{smartInsight.stats.reuseabilityScore}%</span>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Complexity</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full">
                      <div 
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{ width: `${smartInsight.stats.complexityScore}%` }}
                      />
                    </div>
                    <span className="text-sm text-yellow-400">{smartInsight.stats.complexityScore}%</span>
                  </div>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Maintainability</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full">
                      <div 
                        className="h-2 bg-blue-400 rounded-full"
                        style={{ width: `${smartInsight.stats.maintainabilityScore}%` }}
                      />
                    </div>
                    <span className="text-sm text-blue-400">{smartInsight.stats.maintainabilityScore}%</span>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {smartInsight.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-400" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {smartInsight.suggestions.map((suggestion, i) => (
                      <div key={i} className="p-2 bg-yellow-500/10 rounded text-sm text-yellow-400 border border-yellow-500/20">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Graph Modal */}
      {showInteractiveGraph && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setShowInteractiveGraph(false)}
              className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
            >
              ✕
            </button>
            <Suspense fallback={
              <div className="bg-slate-900 rounded-xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-400">Loading dependency graph...</p>
              </div>
            }>
              <InteractiveDependencyGraph
                fileStructure={fileStructure}
                allFiles={allFiles}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}