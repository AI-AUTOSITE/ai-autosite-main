// app/tools/code-dependency-visualizer/components/MainView.tsx

'use client'

import { useState, useEffect } from 'react'
import { 
  Copy, Download, FileCode, Layers, Package, 
  CheckCircle, AlertCircle, Zap 
} from 'lucide-react'
import { ProjectAnalysis, CompressedFile } from '../types'
import { analyzeProject, formatBytes, extractDependencies } from '../lib/analyzer'
import { compressProject, generateCompressedBundle } from '../lib/compressor'

interface MainViewProps {
  files: File[]
  onReset: () => void
}

export default function MainView({ files, onReset }: MainViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'compress' | 'dependencies'>('overview')
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null)
  const [compressed, setCompressed] = useState<CompressedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  useEffect(() => {
    analyzeFiles()
  }, [files])
  
  const analyzeFiles = async () => {
    setIsProcessing(true)
    try {
      // Basic analysis
      const projectAnalysis = analyzeProject(files)
      
      // Read file contents for compression
      const fileContents: Array<{ path: string; content: string }> = []
      
      for (const file of files) {
        const path = file.webkitRelativePath || file.name
        const extension = path.split('.').pop()
        
        // Only read text files
        if (['ts', 'tsx', 'js', 'jsx', 'json', 'css', 'md'].includes(extension || '')) {
          const content = await file.text()
          fileContents.push({ path, content })
          
          // Extract dependencies
          const deps = extractDependencies(content, path)
          projectAnalysis.dependencies.push(...deps)
        }
      }
      
      // Compress files
      if (fileContents.length > 0) {
        const compressionResult = compressProject(fileContents)
        setCompressed(compressionResult.compressed)
        projectAnalysis.stats.compressionRate = compressionResult.averageCompressionRate
      }
      
      setAnalysis(projectAnalysis)
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }
  
  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  
  if (!analysis) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Analyzing project...</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <FileCode className="w-4 h-4" />
            Total Files
          </div>
          <div className="text-2xl font-bold text-white">
            {analysis.stats.totalFiles}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Package className="w-4 h-4" />
            Total Size
          </div>
          <div className="text-2xl font-bold text-white">
            {formatBytes(analysis.stats.totalSize)}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Layers className="w-4 h-4" />
            Dependencies
          </div>
          <div className="text-2xl font-bold text-white">
            {analysis.dependencies.length}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Zap className="w-4 h-4" />
            Compression
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {analysis.stats.compressionRate || 0}%
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('compress')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'compress'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          AI Compress
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'dependencies'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Dependencies
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Project Structure</h3>
            
            {/* File Type Distribution */}
            <div className="space-y-2">
              {Object.entries(analysis.stats.fileTypes).map(([ext, count]) => (
                <div key={ext} className="flex items-center gap-3">
                  <span className="text-cyan-400 font-mono text-sm w-16">{ext}</span>
                  <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                      style={{ 
                        width: `${(count / analysis.stats.totalFiles) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
            
            {/* Tree Markdown */}
            {analysis.treeMarkdown && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-medium">File Tree</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(analysis.treeMarkdown!)}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg
                               hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Tree
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => downloadAsFile(analysis.treeMarkdown!, 'project-tree.md')}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg
                               hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                <pre className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto max-h-96 text-gray-300 text-sm">
                  {analysis.treeMarkdown}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'compress' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">AI-Optimized Compression</h3>
            
            {compressed.length > 0 ? (
              <>
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-4 border border-cyan-400/30">
                  <p className="text-cyan-400 font-medium mb-2">
                    🎉 Compression Complete!
                  </p>
                  <p className="text-gray-300 text-sm">
                    Reduced from {compressed.reduce((sum, f) => sum + f.originalTokens, 0).toLocaleString()} to{' '}
                    {compressed.reduce((sum, f) => sum + f.compressedTokens, 0).toLocaleString()} tokens
                    ({analysis.stats.compressionRate}% reduction)
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const bundle = generateCompressedBundle(compressed)
                      copyToClipboard(bundle)
                    }}
                    className="flex-1 px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg
                             hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy for AI
                  </button>
                  <button
                    onClick={() => {
                      const bundle = generateCompressedBundle(compressed)
                      downloadAsFile(bundle, 'compressed-for-ai.md')
                    }}
                    className="flex-1 px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg
                             hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Bundle
                  </button>
                </div>
                
                {/* File List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {compressed.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                      <span className="text-gray-300 text-sm font-mono truncate flex-1">
                        {file.path}
                      </span>
                      <span className="text-cyan-400 text-sm ml-4">
                        -{file.compressionRate}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No compressible files found</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'dependencies' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Dependencies Graph</h3>
            
            {analysis.dependencies.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {analysis.dependencies.map((dep, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-400 text-xs uppercase">{dep.type}</span>
                    <span className="text-gray-300 text-sm font-mono truncate flex-1">
                      {dep.source}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-cyan-400 text-sm font-mono truncate flex-1">
                      {dep.target}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No dependencies found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Upload JavaScript/TypeScript files to see imports
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg
                   hover:bg-gray-700 transition-colors"
        >
          Analyze Another Project
        </button>
      </div>
    </div>
  )
}