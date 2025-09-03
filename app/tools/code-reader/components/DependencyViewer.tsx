'use client'

import React, { useState, useMemo, lazy, Suspense } from 'react'
import { 
  GitBranch, 
  Package, 
  FileCode, 
  AlertTriangle,
  TrendingUp,
  Target,
  Layers,
  FileText,
  Settings,
  Copy,
  Download,
  MessageSquare,
  Sparkles,
  CheckCircle
} from 'lucide-react'

// Import the new Smart Analyzer
import { SmartDependencyAnalyzer } from '../lib/smart-dependency-analyzer'

// Dynamic import for the graph component (keep existing)
const InteractiveDependencyGraph = lazy(() => import('./InteractiveDependencyGraph'))

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
  
  const [viewMode, setViewMode] = useState<'smart' | 'graph' | 'list' | 'matrix'>('smart')
  const [exportFormat, setExportFormat] = useState<'ai-prompt' | 'markdown' | 'json'>('ai-prompt')
  const [copied, setCopied] = useState(false)
  const [exported, setExported] = useState(false)

  // Initialize Smart Analyzer and get insights
  const smartInsight = useMemo(() => {
    if (!fileStructure || Object.keys(fileStructure).length === 0) {
      return null
    }
    
    const analyzer = new SmartDependencyAnalyzer()
    return analyzer.analyze(fileStructure)
  }, [fileStructure])

  // Create analyzer instance for export functions
  const analyzer = useMemo(() => {
    const smartAnalyzer = new SmartDependencyAnalyzer()
    if (fileStructure && Object.keys(fileStructure).length > 0) {
      smartAnalyzer.analyze(fileStructure)
    }
    return smartAnalyzer
  }, [fileStructure])

  // Calculate health grade
  const healthGrade = useMemo(() => {
    if (!smartInsight) return { grade: 'N/A', color: 'text-gray-400', bgColor: 'bg-gray-500/20' }
    
    const score = smartInsight.stats.maintainabilityScore
    if (score >= 90) return { grade: 'A+', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    if (score >= 80) return { grade: 'A', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    if (score >= 70) return { grade: 'B+', color: 'text-blue-400', bgColor: 'bg-blue-500/20' }
    if (score >= 60) return { grade: 'B', color: 'text-blue-400', bgColor: 'bg-blue-500/20' }
    if (score >= 50) return { grade: 'C+', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
    return { grade: 'C', color: 'text-orange-400', bgColor: 'bg-orange-500/20' }
  }, [smartInsight])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="text-purple-400" size={16} />
      case 'component':
        return <Package className="text-blue-400" size={16} />
      case 'util':
        return <Settings className="text-green-400" size={16} />
      case 'type':
        return <FileCode className="text-yellow-400" size={16} />
      default:
        return <FileCode className="text-gray-400" size={16} />
    }
  }

  const getRiskColor = (risk: string) => {
    const colors = {
      'low': 'text-green-400 bg-green-500/20',
      'medium': 'text-yellow-400 bg-yellow-500/20', 
      'high': 'text-red-400 bg-red-500/20'
    }
    return colors[risk as keyof typeof colors] || colors.low
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-400' }
    if (score >= 60) return { text: 'Good', color: 'text-blue-400' }
    if (score >= 40) return { text: 'Fair', color: 'text-yellow-400' }
    return { text: 'Poor', color: 'text-red-400' }
  }

  const copyToClipboard = async (format: 'ai-prompt' | 'markdown' | 'json') => {
    try {
      let output = ''
      switch (format) {
        case 'ai-prompt':
          output = analyzer.generateAIPrompt()
          break
        case 'markdown':
          output = analyzer.generateMarkdownReport()
          break
        case 'json':
          output = analyzer.generateCompactJSON()
          break
      }
      
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const downloadFile = (format: 'ai-prompt' | 'markdown' | 'json') => {
    let output = ''
    switch (format) {
      case 'ai-prompt':
        output = analyzer.generateAIPrompt()
        break
      case 'markdown':
        output = analyzer.generateMarkdownReport()
        break
      case 'json':
        output = analyzer.generateCompactJSON()
        break
    }
    
    const extensions = { 'ai-prompt': 'md', 'markdown': 'md', 'json': 'json' }
    const mimeTypes = { 'ai-prompt': 'text/markdown', 'markdown': 'text/markdown', 'json': 'application/json' }
    
    const blob = new Blob([output], { type: mimeTypes[format] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dependency-analysis-${new Date().toISOString().split('T')[0]}.${extensions[format]}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  // Show loading if no data
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
      {/* Smart Analysis Header */}
      {viewMode === 'smart' && (
        <>
          {/* Health Score Card */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Project Health Analysis</h2>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${healthGrade.bgColor}`}>
                <div className={`text-2xl font-bold ${healthGrade.color}`}>{healthGrade.grade}</div>
                <div className="text-sm text-gray-400">Grade</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{smartInsight.hotspots.length}</div>
                <div className="text-xs text-gray-400">Critical Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{smartInsight.orphans.length}</div>
                <div className="text-xs text-gray-400">Unused Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{smartInsight.cycles.length}</div>
                <div className="text-xs text-gray-400">Circular Deps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{smartInsight.depth}</div>
                <div className="text-xs text-gray-400">Max Depth</div>
              </div>
            </div>
          </div>

          {/* AI Export Section */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-6 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-400" size={20} />
              <h3 className="text-lg font-semibold text-white">AI-Ready Export</h3>
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                Optimized for ChatGPT, Claude & Gemini
              </span>
            </div>
            
            <div className="grid md:grid-cols-5 gap-3 mb-4">
              <button
                onClick={() => setExportFormat('ai-prompt')}
                className={`p-3 rounded-lg text-left transition-all border text-sm ${
                  exportFormat === 'ai-prompt'
                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={14} />
                  <span className="font-medium">AI Prompt</span>
                </div>
                <div className="text-xs opacity-70">Consultation ready</div>
                <div className="text-xs mt-1 opacity-50">~{analyzer.estimateTokens('prompt')} tokens</div>
              </button>
              
              <button
                onClick={() => setExportFormat('relationship')}
                className={`p-3 rounded-lg text-left transition-all border text-sm ${
                  exportFormat === 'relationship'
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch size={14} />
                  <span className="font-medium">Relationship Map</span>
                </div>
                <div className="text-xs opacity-70">File connections</div>
                <div className="text-xs mt-1 opacity-50">~{analyzer.estimateTokens('relationship')} tokens</div>
              </button>
              
              <button
                onClick={() => setExportFormat('impact')}
                className={`p-3 rounded-lg text-left transition-all border text-sm ${
                  exportFormat === 'impact'
                    ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target size={14} />
                  <span className="font-medium">Impact Analysis</span>
                </div>
                <div className="text-xs opacity-70">Change effects</div>
                <div className="text-xs mt-1 opacity-50">Select file first</div>
              </button>
              
              <button
                onClick={() => setExportFormat('markdown')}
                className={`p-3 rounded-lg text-left transition-all border text-sm ${
                  exportFormat === 'markdown'
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} />
                  <span className="font-medium">Full Report</span>
                </div>
                <div className="text-xs opacity-70">Complete analysis</div>
                <div className="text-xs mt-1 opacity-50">~{analyzer.estimateTokens('markdown')} tokens</div>
              </button>
              
              <button
                onClick={() => setExportFormat('json')}
                className={`p-3 rounded-lg text-left transition-all border text-sm ${
                  exportFormat === 'json'
                    ? 'bg-green-500/20 border-green-500/30 text-green-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileCode size={14} />
                  <span className="font-medium">JSON Data</span>
                </div>
                <div className="text-xs opacity-70">Structured data</div>
                <div className="text-xs mt-1 opacity-50">~{analyzer.estimateTokens('json')} tokens</div>
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(exportFormat)}
                className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 border border-cyan-500/30"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy for AI'}
              </button>
              
              <button
                onClick={() => downloadFile(exportFormat)}
                className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 border border-green-500/30"
              >
                {exported ? <CheckCircle size={16} /> : <Download size={16} />}
                {exported ? 'Downloaded!' : 'Download'}
              </button>
            </div>
          </div>

          {/* Hotspots Section */}
          {smartInsight.hotspots.length > 0 && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target size={20} className="text-orange-400" />
                Critical Files (Hotspots)
              </h3>
              <div className="space-y-3">
                {smartInsight.hotspots.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium text-white">{file.name}</div>
                        <div className="text-xs text-gray-400">{file.path}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-300">
                        {file.importedBy.length} dependencies
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(file.risk)}`}>
                        {file.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Reusability', score: smartInsight.stats.reuseabilityScore, color: 'green' },
              { label: 'Complexity', score: smartInsight.stats.complexityScore, color: 'yellow' },
              { label: 'Maintainability', score: smartInsight.stats.maintainabilityScore, color: 'blue' }
            ].map((metric) => {
              const status = getScoreStatus(metric.score);
              const colorClass = `bg-${metric.color}-400`;
              return (
                <div key={metric.label} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{metric.label}</span>
                    <span className={`text-sm ${status.color}`}>{status.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${colorClass}`}
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">{metric.score}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Issues and Suggestions */}
          {smartInsight.suggestions.length > 0 && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-400" />
                Smart Recommendations
              </h3>
              <div className="space-y-3">
                {smartInsight.suggestions.map((suggestion, i) => (
                  <div key={i} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="text-yellow-400 text-sm">{suggestion}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setViewMode('smart')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'smart' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            Smart Analysis
          </div>
        </button>
        <button
          onClick={() => setViewMode('graph')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'graph' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <GitBranch size={16} />
            Graph View
          </div>
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'list' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package size={16} />
            List View
          </div>
        </button>
        <button
          onClick={() => setViewMode('matrix')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'matrix' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers size={16} />
            Matrix View
          </div>
        </button>
      </div>

      {/* Graph View (existing implementation) */}
      {viewMode === 'graph' && (
        <Suspense fallback={
          <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
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
      )}

      {/* List View (simplified version) */}
      {viewMode === 'list' && (
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">File Dependencies</h3>
          <div className="space-y-2">
            {Object.values(fileStructure).flat().map((file: any) => (
              <div key={file.path} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getFileIcon(file.analysis.fileType)}
                  <span className="font-medium text-white">{file.name}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Imports: {file.analysis.localImports?.length || 0} | 
                  External: {file.analysis.externalImports?.length || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matrix View (simplified version) */}
      {viewMode === 'matrix' && (
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Dependency Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2 text-gray-400">File</th>
                  <th className="text-center p-2 text-gray-400">Dependencies</th>
                  <th className="text-center p-2 text-gray-400">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(fileStructure).flat().map((file: any) => (
                  <tr key={file.path} className="border-t border-white/10">
                    <td className="p-2 text-gray-300">{file.name}</td>
                    <td className="p-2 text-center text-cyan-400">{file.analysis.localImports?.length || 0}</td>
                    <td className="p-2 text-center text-gray-400">{file.analysis.fileType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}