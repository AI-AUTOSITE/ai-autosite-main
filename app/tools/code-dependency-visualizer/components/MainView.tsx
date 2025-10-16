// app/tools/code-dependency-visualizer/components/MainView.tsx
// Mobile optimized version

'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Copy,
  Download,
  FileCode,
  Layers,
  Package,
  CheckCircle,
  AlertCircle,
  Zap,
  Trash2,
  Plus,
  Loader2,
  X,
} from 'lucide-react'
import { ProjectAnalysis, CompressedFile } from '../types'
import { analyzeProject, formatBytes, extractDependencies } from '../lib/analyzer'
import { compressProject, generateCompressedBundle } from '../lib/compressor'

interface MainViewProps {
  files: File[]
  onReset: () => void
  onAddFiles: (newFiles: File[]) => void
}

export default function MainView({ files, onReset, onAddFiles }: MainViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'compress' | 'dependencies'>('overview')
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null)
  const [compressed, setCompressed] = useState<CompressedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [displayedDeps, setDisplayedDeps] = useState(100)
  const [searchQuery, setSearchQuery] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    analyzeFiles()
  }, [files])

  const analyzeFiles = async () => {
    setIsProcessing(true)
    setErrors([])
    const failedFiles: string[] = []

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
          try {
            // Add timeout to prevent hanging
            const content = await Promise.race([
              file.text(),
              new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 5000)
              ),
            ])

            fileContents.push({ path, content })

            // Extract dependencies
            const deps = extractDependencies(content, path)
            projectAnalysis.dependencies.push(...deps)
          } catch (error) {
            console.warn(`Failed to read file: ${path}`, error)
            failedFiles.push(path)
          }
        }
      }

      // Show warning if some files failed
      if (failedFiles.length > 0) {
        setErrors([`${failedFiles.length} file(s) could not be read and were skipped`])
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
      setErrors(['Failed to analyze project. Please try again.'])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    if (newFiles.length > 0) {
      onAddFiles(newFiles)
    }
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
      <div className="relative">
        <div className="text-center py-8">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400 text-sm sm:text-base">Analyzing project...</p>
        </div>
      </div>
    )
  }

  const filteredDependencies =
    analysis?.dependencies.filter((dep) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return dep.source.toLowerCase().includes(query) || dep.target.toLowerCase().includes(query)
    }) || []

  const visibleDeps = filteredDependencies.slice(0, displayedDeps)
  const hasMoreDeps = filteredDependencies.length > displayedDeps

  return (
    <div className="space-y-4 sm:space-y-6 relative">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center cursor-wait">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 mx-4">
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
            <p className="text-white font-medium text-base sm:text-lg">Processing files...</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">This may take a moment</p>
          </div>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".ts,.tsx,.js,.jsx,.json,.css,.md"
            onChange={handleAddFiles}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 sm:flex-initial px-4 py-2 min-h-[48px] bg-cyan-500/20 text-cyan-400 rounded-lg 
                     hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Add Files
          </button>
        </div>

        <button
          onClick={onReset}
          disabled={isProcessing}
          className="px-4 py-2 min-h-[48px] bg-red-500/20 text-red-400 rounded-lg 
                   hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <Trash2 className="w-4 h-4" />
          Delete All
        </button>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4 animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              {errors.map((error, index) => (
                <p key={index} className="text-xs sm:text-sm text-yellow-400">
                  {error}
                </p>
              ))}
              <p className="text-xs text-yellow-400/70 mt-1">
                Analysis completed with remaining files
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <FileCode className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Total Files</span>
            <span className="sm:hidden">Files</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{analysis.stats.totalFiles}</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Total Size</span>
            <span className="sm:hidden">Size</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {formatBytes(analysis.stats.totalSize)}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Dependencies</span>
            <span className="sm:hidden">Deps</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{analysis.dependencies.length}</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 sm:p-4 border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-1">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Compression</span>
            <span className="sm:hidden">Comp</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400">
            {analysis.stats.compressionRate || 0}%
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 sm:gap-2 p-1 bg-white/5 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          disabled={isProcessing}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 min-h-[44px] rounded-md font-medium transition-colors disabled:cursor-not-allowed text-xs sm:text-base ${
            activeTab === 'overview'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('compress')}
          disabled={isProcessing}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 min-h-[44px] rounded-md font-medium transition-colors disabled:cursor-not-allowed text-xs sm:text-base ${
            activeTab === 'compress'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="hidden sm:inline">AI Compress</span>
          <span className="sm:hidden">Compress</span>
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          disabled={isProcessing}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 min-h-[44px] rounded-md font-medium transition-colors disabled:cursor-not-allowed text-xs sm:text-base ${
            activeTab === 'dependencies'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="hidden sm:inline">Dependencies</span>
          <span className="sm:hidden">Deps</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/10 min-h-[300px] sm:min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Project Structure</h3>

            {/* File Type Distribution */}
            <div className="space-y-2">
              {Object.entries(analysis.stats.fileTypes).map(([ext, count]) => (
                <div key={ext} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-cyan-400 font-mono text-xs sm:text-sm w-12 sm:w-16">{ext}</span>
                  <div className="flex-1 h-5 sm:h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300"
                      style={{
                        width: `${(count / analysis.stats.totalFiles) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm w-8 sm:w-12 text-right">{count}</span>
                </div>
              ))}
            </div>

            {/* Tree Markdown */}
            {analysis.treeMarkdown && (
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                  <h4 className="text-white font-medium text-sm sm:text-base">File Tree</h4>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => copyToClipboard(analysis.treeMarkdown!)}
                      className="flex-1 sm:flex-initial px-3 py-2 min-h-[44px] bg-cyan-500/20 text-cyan-400 rounded-lg
                               hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => downloadAsFile(analysis.treeMarkdown!, 'project-tree.md')}
                      className="flex-1 sm:flex-initial px-3 py-2 min-h-[44px] bg-purple-500/20 text-purple-400 rounded-lg
                               hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
                <pre className="bg-gray-800/50 rounded-lg p-3 sm:p-4 overflow-x-auto max-h-64 sm:max-h-96 text-gray-300 text-xs sm:text-sm custom-scrollbar">
                  {analysis.treeMarkdown}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compress' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">AI-Optimized Compression</h3>

            {compressed.length > 0 ? (
              <>
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-3 sm:p-4 border border-cyan-400/30">
                  <p className="text-cyan-400 font-medium mb-2 text-sm sm:text-base">Compression Complete!</p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Reduced from{' '}
                    {compressed.reduce((sum, f) => sum + f.originalTokens, 0).toLocaleString()} to{' '}
                    {compressed.reduce((sum, f) => sum + f.compressedTokens, 0).toLocaleString()}{' '}
                    tokens ({analysis.stats.compressionRate}% reduction)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      const bundle = generateCompressedBundle(compressed)
                      copyToClipboard(bundle)
                    }}
                    className="flex-1 px-4 py-3 min-h-[48px] bg-cyan-500/20 text-cyan-400 rounded-lg
                             hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Copy className="w-4 h-4" />
                    Copy for AI
                  </button>
                  <button
                    onClick={() => {
                      const bundle = generateCompressedBundle(compressed)
                      downloadAsFile(bundle, 'compressed-for-ai.md')
                    }}
                    className="flex-1 px-4 py-3 min-h-[48px] bg-purple-500/20 text-purple-400 rounded-lg
                             hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download Bundle</span>
                    <span className="sm:hidden">Download</span>
                  </button>
                </div>

                {/* File List */}
                <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                  {compressed.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-800/30 rounded"
                    >
                      <span className="text-gray-300 text-xs sm:text-sm font-mono truncate flex-1">
                        {file.path}
                      </span>
                      <span className="text-cyan-400 text-xs sm:text-sm ml-2 sm:ml-4">-{file.compressionRate}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">No compressible files found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-white">Dependencies Graph</h3>
              <div className="text-xs sm:text-sm text-gray-400">
                {filteredDependencies.length.toLocaleString()} total
              </div>
            </div>

            {analysis.dependencies.length > 0 ? (
              <>
                {/* Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search dependencies..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setDisplayedDeps(100)
                    }}
                    className="w-full px-3 sm:px-4 py-2 min-h-[44px] bg-gray-800/50 border border-white/10 rounded-lg
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white min-w-[32px] min-h-[32px] flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dependencies List */}
                <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto custom-scrollbar">
                  {visibleDeps.map((dep, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 bg-gray-800/30 rounded hover:bg-gray-800/50 transition-colors"
                    >
                      <span
                        className={`text-xs uppercase px-2 py-0.5 rounded flex-shrink-0 ${
                          dep.type === 'import'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : dep.type === 'require'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {dep.type}
                      </span>
                      <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
                        <span className="text-gray-300 text-xs sm:text-sm font-mono truncate flex-1">
                          {dep.source}
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm flex-shrink-0">→</span>
                        <span className="text-cyan-400 text-xs sm:text-sm font-mono truncate flex-1">
                          {dep.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMoreDeps && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setDisplayedDeps((prev) => prev + 100)}
                      className="px-4 sm:px-6 py-2 sm:py-3 min-h-[44px] bg-cyan-500/20 text-cyan-400 rounded-lg
                               hover:bg-cyan-500/30 transition-colors text-xs sm:text-sm"
                    >
                      Load More ({filteredDependencies.length - displayedDeps} remaining)
                    </button>
                  </div>
                )}

                {filteredDependencies.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm sm:text-base">No dependencies match your search</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">No dependencies found</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  Upload JavaScript/TypeScript files to see imports
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}