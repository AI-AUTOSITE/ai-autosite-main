// app/tools/code-reader/components/UnifiedViewer.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import AIPromptBuilder from './AIPromptBuilder'
import MermaidDiagramGenerator from './MermaidDiagramGenerator'
import InteractiveDependencyGraph from './InteractiveDependencyGraph'
import DependencyViewer from './DependencyViewer'
import AIPricingCalculator from './AIPricingCalculator'
import AIShareMode from './AIShareMode'
import SmartFileSelector from './SmartFileSelector'
import CodeQualityMeter from './CodeQualityMeter'
import { SmartDependencyAnalyzer } from '../lib/smart-dependency-analyzer'
import { CodeCompressor } from '../lib/code-compressor'
import type { 
  ProjectStructure, 
  FileData, 
  FileAnalysis, 
  CodeError,
  DependencyNode,
  DependencyInsight 
} from '../lib/types'
import { 
  FileText, 
  FolderOpen, 
  GitBranch, 
  Network,
  FileCode,
  DollarSign,
  Download,
  Copy,
  Check,
  Sparkles,
  Package,
  BarChart,
  Share2,
  Zap,
  Archive
} from 'lucide-react'

interface UnifiedViewerProps {
  fileStructure: ProjectStructure
  allFiles: Record<string, string>
  selectedFile: string | null
  setSelectedFile: (file: string | null) => void
  errors?: CodeError[]
  onSelectedFilesChange?: (files: string[]) => void
  selectedFiles?: string[]
}

// Updated TabType to include 'compress'
type TabType = 'overview' | 'compress' | 'dependencies' | 'ai-export' | 'cost-analysis' | 'quality'

// Convert ProjectStructure to DependencyViewer's expected FileStructure format
interface DependencyFileData {
  name: string
  path: string
  size: number
  analysis: FileAnalysis
}

interface DependencyFileStructure {
  [directory: string]: DependencyFileData[]
}

// Extended type for dependency graph data (for future use)
interface DependencyGraphData {
  nodes: Record<string, DependencyNode>
  edges?: Array<{
    source: string
    target: string
    type?: string
  }>
}

export default function UnifiedViewer({
  fileStructure,
  allFiles,
  selectedFile,
  setSelectedFile,
  errors = [],
  onSelectedFilesChange,
  selectedFiles: externalSelectedFiles = []
}: UnifiedViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [internalSelectedFiles, setInternalSelectedFiles] = useState<string[]>([])
  const [compressionEnabled, setCompressionEnabled] = useState(true)
  const [markdownContent, setMarkdownContent] = useState('')
  const [mermaidDiagram, setMermaidDiagram] = useState('')
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  
  const selectedFiles = externalSelectedFiles.length > 0 ? externalSelectedFiles : internalSelectedFiles

  // CodeCompressor instance
  const compressor = new CodeCompressor()

  // Convert ProjectStructure to DependencyFileStructure
  const dependencyFileStructure = useMemo((): DependencyFileStructure => {
    const converted: DependencyFileStructure = {}
    
    Object.entries(fileStructure).forEach(([dir, files]) => {
      converted[dir] = files.map(file => ({
        name: file.name,
        path: file.path,
        size: file.size,
        analysis: file.analysis || {
          fileName: file.name,
          fullPath: file.path,
          fileType: 'other' as const,
          localImports: [],
          externalImports: [],
          linesOfCode: 0
        }
      }))
    })
    
    return converted
  }, [fileStructure])

  // Analyze dependencies
  const analysis = useMemo(() => {
    if (Object.keys(fileStructure).length === 0) return null
    const analyzer = new SmartDependencyAnalyzer()
    return analyzer.analyze(fileStructure, allFiles)
  }, [fileStructure, allFiles])

  // Calculate token counts for selected files
  const selectedFilesTokenCount = useMemo(() => {
    let totalTokens = 0
    selectedFiles.forEach(filePath => {
      const content = allFiles[filePath] || ''
      let processedContent = content
      
      if (compressionEnabled) {
        const extension = filePath.split('.').pop() || ''
        const result = compressor.compressCode(content, extension)
        processedContent = result.compressed
      }
      
      // Rough token estimation (1 token ≈ 4 characters)
      totalTokens += Math.ceil(processedContent.length / 4)
    })
    return totalTokens
  }, [selectedFiles, allFiles, compressionEnabled, compressor])

  // Generate markdown tree structure
  const generateMarkdownTree = () => {
    let markdown = '# Project Structure\n\n'
    markdown += '```\n'
    
    Object.entries(fileStructure).forEach(([folder, files]) => {
      markdown += `📁 ${folder}/\n`
      files.forEach((file, index) => {
        const isLast = index === files.length - 1
        const prefix = isLast ? '└── ' : '├── '
        markdown += `  ${prefix}${file.name}\n`
      })
    })
    
    markdown += '```\n\n'
    
    // Add statistics
    markdown += '## Statistics\n\n'
    const totalFiles = Object.values(fileStructure).flat().length
    const totalSize = Object.values(fileStructure).flat().reduce((acc, file) => acc + file.size, 0)
    const totalLines = Object.values(fileStructure).flat().reduce((acc, file) => 
      acc + (file.analysis?.linesOfCode || 0), 0)
    
    markdown += `- **Total Files**: ${totalFiles}\n`
    markdown += `- **Total Lines**: ${totalLines.toLocaleString()}\n`
    markdown += `- **Total Size**: ${(totalSize / 1024).toFixed(2)} KB\n`
    
    setMarkdownContent(markdown)
    return markdown
  }

  /**
   * Generate Mermaid diagram from dependency analysis
   * Handles multiple possible data structures for extensibility
   */
  const generateMermaidDiagram = () => {
    let mermaid = 'graph TD\n'
    
    if (analysis) {
      // Use any type for maximum flexibility
      const analysisAny = analysis as any
      
      // Check for different possible dependency data structures
      // Option 1: Direct dependency graph (future structure)
      if (analysisAny.dependencyGraph && typeof analysisAny.dependencyGraph === 'object') {
        const graph = analysisAny.dependencyGraph
        
        // Add nodes
        if (graph.nodes && typeof graph.nodes === 'object') {
          Object.entries(graph.nodes).forEach(([id, node]: [string, any]) => {
            const fileName = node?.name ? String(node.name).split('/').pop() : id
            mermaid += `  ${id.replace(/[^a-zA-Z0-9]/g, '_')}["${fileName}"]\n`
          })
        }
        
        // Add edges
        if (Array.isArray(graph.edges)) {
          graph.edges.forEach((edge: any) => {
            if (edge?.source && edge?.target) {
              const sourceId = String(edge.source).replace(/[^a-zA-Z0-9]/g, '_')
              const targetId = String(edge.target).replace(/[^a-zA-Z0-9]/g, '_')
              mermaid += `  ${sourceId} --> ${targetId}\n`
            }
          })
        }
      }
      // Option 2: Files with analysis (current structure)
      else if (analysisAny.files && Array.isArray(analysisAny.files)) {
        // Create dependency graph from file analysis
        const fileMap = new Map<string, Set<string>>()
        
        analysisAny.files.forEach((file: any) => {
          if (file && file.path && file.analysis) {
            const fileName = String(file.path).replace(/[^a-zA-Z0-9]/g, '_')
            
            // Initialize if not exists
            if (!fileMap.has(fileName)) {
              fileMap.set(fileName, new Set())
            }
            
            // Add local imports as dependencies
            if (Array.isArray(file.analysis.localImports)) {
              file.analysis.localImports.forEach((importPath: any) => {
                const targetName = String(importPath).replace(/[^a-zA-Z0-9]/g, '_')
                fileMap.get(fileName)?.add(targetName)
              })
            }
          }
        })
        
        // Generate mermaid from fileMap
        fileMap.forEach((imports, fileName) => {
          const displayName = fileName.replace(/_/g, '.')
          mermaid += `  ${fileName}["${displayName}"]\n`
          
          imports.forEach((importFile) => {
            mermaid += `  ${fileName} --> ${importFile}\n`
          })
        })
      }
      // Option 3: Raw dependencies (backward compatibility)
      else if (analysisAny.dependencies && typeof analysisAny.dependencies === 'object') {
        const dependencies = analysisAny.dependencies
        
        if (dependencies.nodes && typeof dependencies.nodes === 'object') {
          Object.entries(dependencies.nodes).forEach(([id, node]: [string, any]) => {
            const fileName = node?.name ? String(node.name).split('/').pop() : id
            mermaid += `  ${id.replace(/[^a-zA-Z0-9]/g, '_')}["${fileName}"]\n`
          })
        }
        
        if (Array.isArray(dependencies.edges)) {
          dependencies.edges.forEach((edge: any) => {
            if (edge?.source && edge?.target) {
              const sourceId = String(edge.source).replace(/[^a-zA-Z0-9]/g, '_')
              const targetId = String(edge.target).replace(/[^a-zA-Z0-9]/g, '_')
              mermaid += `  ${sourceId} --> ${targetId}\n`
            }
          })
        }
      }
      
      // If no dependencies found, create a simple structure diagram
      if (mermaid === 'graph TD\n') {
        mermaid += '  Root["Project Root"]\n'
        Object.keys(fileStructure).forEach((folder, index) => {
          const folderId = `folder_${index}`
          mermaid += `  Root --> ${folderId}["${folder}"]\n`
        })
      }
    }
    
    setMermaidDiagram(mermaid)
    return mermaid
  }

  // Download markdown tree as .md file
  const downloadMarkdownTree = () => {
    setDownloading(true)
    try {
      // Generate fresh markdown content
      const markdown = generateMarkdownTree()
      
      // Create blob and download
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `project-structure-${Date.now()}.md`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download markdown:', error)
    } finally {
      setDownloading(false)
    }
  }

  // Download as ZIP (kept for future use if needed in other tabs)
  const downloadAsZip = async () => {
    setDownloading(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      
      // Add all files to ZIP
      Object.entries(allFiles).forEach(([path, content]) => {
        let processedContent = content
        if (compressionEnabled) {
          const extension = path.split('.').pop() || ''
          const result = compressor.compressCode(content, extension)
          processedContent = result.compressed
        }
        zip.file(path, processedContent)
      })
      
      // Add markdown documentation
      zip.file('PROJECT_STRUCTURE.md', generateMarkdownTree())
      zip.file('DEPENDENCIES.mermaid', generateMermaidDiagram())
      
      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `project-export-${Date.now()}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to create ZIP:', error)
    } finally {
      setDownloading(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Handle file selection with proper token count
  const handleFileSelect = (files: string[], estimatedTokens: number) => {
    setInternalSelectedFiles(files)
    onSelectedFilesChange?.(files)
    console.log(`Selected ${files.length} files with ${estimatedTokens} estimated tokens`)
  }

  // Handle quality improvement
  const handleImprove = () => {
    console.log('Improve code quality')
    // Improvement functionality to be implemented
  }

  useEffect(() => {
    if (activeTab === 'overview') {
      generateMarkdownTree()
    } else if (activeTab === 'dependencies') {
      generateMermaidDiagram()
    }
  }, [activeTab, fileStructure])

  // Updated tabs with 'compress' tab
  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: FolderOpen, color: 'blue' },
    { id: 'compress' as TabType, label: 'AI Compress', icon: Archive, color: 'cyan' },
    { id: 'dependencies' as TabType, label: 'Dependencies', icon: Network, color: 'purple' },
    { id: 'ai-export' as TabType, label: 'AI Export', icon: Sparkles, color: 'green' },
    { id: 'cost-analysis' as TabType, label: 'Cost Analysis', icon: DollarSign, color: 'yellow' },
    { id: 'quality' as TabType, label: 'Quality', icon: BarChart, color: 'red' }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/50`
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-6 min-h-[600px]">
        {/* Overview Tab - MAP TREE FOCUSED */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Header with Premium Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 blur-xl"></div>
              <div className="relative bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                        <FolderOpen className="text-white" />
                      </div>
                      Map Tree - Quick Export
                    </h2>
                    <p className="text-gray-300 mt-2">
                      🌟 One-click export project structure • Perfect for documentation • AI-ready format
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(markdownContent)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center gap-2 font-semibold shadow-lg"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      Copy Tree
                    </button>
                    <button
                      onClick={downloadMarkdownTree}
                      disabled={downloading}
                      className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 font-medium"
                    >
                      <Download size={18} />
                      {downloading ? 'Creating...' : 'Download MD'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Markdown Preview with Enhanced Styling */}
            <div className="bg-gradient-to-br from-black/50 to-black/30 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-green-400">📝 Markdown Format</span>
                <span className="text-xs text-gray-400">Ready to paste anywhere</span>
              </div>
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                {markdownContent}
              </pre>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                <div className="text-blue-400 text-2xl mb-2">📁</div>
                <div className="text-2xl font-bold text-white">
                  {Object.values(fileStructure).flat().length}
                </div>
                <div className="text-sm text-gray-400">Total Files</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
                <div className="text-purple-400 text-2xl mb-2">📊</div>
                <div className="text-2xl font-bold text-white">
                  {Object.keys(fileStructure).length}
                </div>
                <div className="text-sm text-gray-400">Directories</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
                <div className="text-green-400 text-2xl mb-2">💾</div>
                <div className="text-2xl font-bold text-white">
                  {(Object.values(fileStructure).flat().reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(1)}KB
                </div>
                <div className="text-sm text-gray-400">Total Size</div>
              </div>
            </div>

            {/* File Distribution and Quality */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">File Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(fileStructure).slice(0, 5).map(([folder, files]) => (
                    <div key={folder} className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition-colors">
                      <span className="text-sm text-gray-300">{folder}</span>
                      <span className="text-sm text-green-400 font-medium">{files.length} files</span>
                    </div>
                  ))}
                  {Object.keys(fileStructure).length > 5 && (
                    <div className="text-center text-xs text-gray-500 pt-2">
                      +{Object.keys(fileStructure).length - 5} more directories
                    </div>
                  )}
                </div>
              </div>
              
              <CodeQualityMeter
                fileStructure={fileStructure}
                allFiles={allFiles}
                errors={errors}
                showDetails={false}
                variant="compact"
                onImprove={handleImprove}
              />
            </div>
          </div>
        )}

        {/* NEW: Compress Tab - AI SHARE FOCUSED */}
        {activeTab === 'compress' && (
          <div className="space-y-6">
            {/* Header with Premium Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 blur-xl"></div>
              <div className="relative bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                        <Archive className="text-white" />
                      </div>
                      AI Compress - Token Saver
                    </h2>
                    <p className="text-gray-300 mt-2">
                      ⚡ Reduce tokens by 60% • Save AI costs • Maintain code readability
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-lg border border-green-500/30 font-semibold">
                      60% Token Savings
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AIShareMode Component - Main compression feature */}
            <AIShareMode
              allFiles={allFiles}
              fileStructure={fileStructure}
            />

            {/* Compression Benefits */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-xl p-4 border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="text-cyan-400" size={24} />
                  <span className="text-lg font-bold text-white">Fast Processing</span>
                </div>
                <p className="text-sm text-gray-400">Compress entire codebase in seconds</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-green-400" size={24} />
                  <span className="text-lg font-bold text-white">Save Money</span>
                </div>
                <p className="text-sm text-gray-400">Reduce AI API costs by 60%</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-purple-400" size={24} />
                  <span className="text-lg font-bold text-white">AI Optimized</span>
                </div>
                <p className="text-sm text-gray-400">Perfect for ChatGPT & Claude</p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                💡 Pro Tips for Maximum Savings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm text-gray-300">Enable all compression options for best results</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm text-gray-300">Remove comments and empty lines</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm text-gray-300">Use JSON format for structured data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm text-gray-300">Compress before every AI interaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dependencies Tab */}
        {activeTab === 'dependencies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Network className="text-purple-400" />
                Dependency Graph
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(mermaidDiagram)}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  Copy Mermaid
                </button>
              </div>
            </div>
            
            {/* MermaidDiagramGenerator - correct props */}
            <MermaidDiagramGenerator
              fileStructure={fileStructure}
              allFiles={allFiles}
            />
            
            {/* InteractiveDependencyGraph - correct props */}
            <InteractiveDependencyGraph
              fileStructure={fileStructure}
              allFiles={allFiles}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              embedded={true}
            />
            
            {/* DependencyViewer - with converted fileStructure */}
            <DependencyViewer
              fileStructure={dependencyFileStructure}
              allFiles={allFiles}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
        )}

        {/* AI Export Tab */}
        {activeTab === 'ai-export' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-green-400" />
                AI Export & Optimization
              </h2>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={compressionEnabled}
                    onChange={(e) => setCompressionEnabled(e.target.checked)}
                    className="rounded text-green-500"
                  />
                  Enable Compression
                </label>
              </div>
            </div>
            
            {/* Smart File Selector - without analysis prop */}
            <SmartFileSelector
              fileStructure={fileStructure}
              allFiles={allFiles}
              targetFile={selectedFile}
              maxTokens={4000}
              onSelectionChange={handleFileSelect}
              purpose="refactor"
            />
            
            {/* AI Prompt Builder */}
            <AIPromptBuilder
              analysis={analysis}
              selectedFiles={selectedFiles}
              fileContent={selectedFiles.map(path => allFiles[path] || '').join('\n')}
              onPromptGenerated={(prompt) => console.log('Generated prompt:', prompt)}
            />
          </div>
        )}

        {/* Cost Analysis Tab */}
        {activeTab === 'cost-analysis' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="text-yellow-400" />
              Token Cost Analysis
            </h2>
            
            {/* AI Pricing Calculator - with correct props */}
            <AIPricingCalculator
              inputTokens={selectedFilesTokenCount}
              estimatedOutputTokens={Math.floor(selectedFilesTokenCount * 0.3)}
              onCostCalculated={(cost) => console.log('Estimated cost:', cost)}
            />
            
            {/* Token Optimization Tips */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <Zap />
                Optimization Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✔</span>
                  <span>Use the AI Compress tab for 60% token reduction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✔</span>
                  <span>Select only relevant files for your task</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✔</span>
                  <span>Remove comments and whitespace for maximum savings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✔</span>
                  <span>Use context-aware selection to include dependencies</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Quality Tab */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart className="text-red-400" />
              Code Quality Analysis
            </h2>
            
            {/* CodeQualityMeter with full view */}
            <CodeQualityMeter
              fileStructure={fileStructure}
              allFiles={allFiles}
              errors={errors}
              showDetails={true}
              variant="full"
              onImprove={handleImprove}
            />
            
            {/* Error Summary */}
            {errors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-red-400 mb-3">
                  Issues Found ({errors.length})
                </h3>
                <div className="space-y-2">
                  {errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="p-2 bg-black/30 rounded border border-red-500/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{error.file}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          error.severity === 'error' ? 'bg-red-500/20 text-red-400' :
                          error.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {error.severity}
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1">{error.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}