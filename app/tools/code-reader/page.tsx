'use client'

import { useState } from 'react'
import Link from 'next/link'
import GitHubFetcher from './components/GitHubFetcher'
import FileTree from './components/FileTree'
import DependencyViewer from './components/DependencyViewer'
import ErrorPanel from './components/ErrorPanel'
import { SmartDependencyAnalyzer } from './lib/smart-dependency-analyzer'
import { 
  Upload, 
  Github, 
  Folder, 
  Shield,
  HelpCircle,
  X,
  AlertCircle,
  Download,
  FileCode,
  GitBranch,
  TrendingUp,
  Eye,
  EyeOff,
  FileText,
  FileJson,
  Hash,
  Sparkles,
  Copy,
  FileWarning
} from 'lucide-react'

// Types
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

interface CodeError {
  type: 'unresolved_import' | 'circular_dependency' | 'missing_export' | 'unused_file' | 'type_error'
  severity: 'error' | 'warning' | 'info'
  file: string
  line?: number
  message: string
  details?: string
  quickFix?: string
}

// Output format types
type OutputFormat = 'markdown' | 'compact' | 'full'

// Constants
const IGNORED_FOLDERS = ['node_modules', '.git', '.next', 'dist', 'build']
const ALLOWED_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '.json', '.md']

export default function CodeReaderPage() {
  const [activeTab, setActiveTab] = useState<'github' | 'local'>('github')
  const [allFiles, setAllFiles] = useState<Record<string, string>>({})
  const [fileStructure, setFileStructure] = useState<FileStructure>({})
  const [excludedFiles, setExcludedFiles] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'analytics'>('tree')
  const [isCancelled, setIsCancelled] = useState(false)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('markdown')
  const [copiedFormat, setCopiedFormat] = useState<OutputFormat | null>(null)
  const [errors, setErrors] = useState<CodeError[]>([])
  const [showErrors, setShowErrors] = useState(true)

  const stats = {
    totalFiles: Object.keys(allFiles).filter(path => !excludedFiles.has(path)).length,
    excludedFiles: excludedFiles.size,
    totalSize: Object.keys(allFiles)
      .filter(path => !excludedFiles.has(path))
      .reduce((sum, path) => sum + (allFiles[path] || '').length, 0)
  }

  // Generate output based on selected format
  const generateOutput = (format: OutputFormat): string => {
    const activeFiles = Object.keys(allFiles).filter(path => !excludedFiles.has(path))
    const timestamp = new Date().toISOString()
    
    switch (format) {
      case 'markdown':
        return generateMarkdownOutput(activeFiles, timestamp)
      case 'compact':
        return generateCompactJSON(activeFiles, timestamp)
      case 'full':
        return generateFullJSON(activeFiles, timestamp)
      default:
        return ''
    }
  }

  // Generate Markdown output (AI-optimized)
  const generateMarkdownOutput = (activeFiles: string[], timestamp: string): string => {
    let output = '# Project Structure Analysis\n\n'
    output += `## Quick Overview\n`
    output += `- **Total Files**: ${stats.totalFiles}\n`
    output += `- **Total Size**: ${(stats.totalSize / 1024).toFixed(1)} KB\n`
    output += `- **Generated**: ${timestamp}\n\n`
    
    // Directory tree
    output += '## Directory Tree\n```\n'
    const dirTree = buildDirectoryTree(activeFiles)
    output += dirTree
    output += '```\n\n'
    
    // Dependencies summary
    output += '## Dependencies Summary\n\n'
    const externalDeps = new Set<string>()
    Object.values(fileStructure).flat().forEach(file => {
      file.analysis.externalImports.forEach(imp => externalDeps.add(imp))
    })
    
    output += '### External Libraries\n'
    Array.from(externalDeps).slice(0, 20).forEach(dep => {
      output += `- ${dep}\n`
    })
    
    if (externalDeps.size > 20) {
      output += `- ... and ${externalDeps.size - 20} more\n`
    }
    
    output += '\n### Key Files\n'
    const keyFiles = Object.values(fileStructure)
      .flat()
      .filter(f => f.analysis.fileType === 'page' || f.analysis.fileType === 'component')
      .slice(0, 10)
    
    keyFiles.forEach(file => {
      output += `- **${file.path}** (${file.analysis.linesOfCode} lines, ${file.analysis.fileType})\n`
    })
    
    return output
  }

  // Generate Compact JSON
  const generateCompactJSON = (activeFiles: string[], timestamp: string): string => {
    const compactData = {
      overview: {
        totalFiles: stats.totalFiles,
        totalSizeKB: (stats.totalSize / 1024).toFixed(1),
        timestamp
      },
      structure: Object.entries(fileStructure).reduce((acc, [dir, files]) => {
        acc[dir] = files
          .filter(f => !excludedFiles.has(f.path))
          .map(f => ({
            name: f.name,
            type: f.analysis.fileType,
            lines: f.analysis.linesOfCode
          }))
        return acc
      }, {} as any),
      dependencies: {
        external: Array.from(new Set(
          Object.values(fileStructure)
            .flat()
            .flatMap(f => f.analysis.externalImports)
        )).slice(0, 30)
      }
    }
    
    return JSON.stringify(compactData, null, 2)
  }

  // Generate Full JSON (current format)
  const generateFullJSON = (activeFiles: string[], timestamp: string): string => {
    const data = {
      files: activeFiles,
      structure: fileStructure,
      stats: {
        totalFiles: stats.totalFiles,
        excludedFiles: stats.excludedFiles,
        totalSizeKB: (stats.totalSize / 1024).toFixed(1)
      },
      timestamp
    }
    
    return JSON.stringify(data, null, 2)
  }

  // Build directory tree for markdown
  const buildDirectoryTree = (files: string[]): string => {
    const tree: any = {}
    
    files.forEach(path => {
      const parts = path.split('/')
      let current = tree
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = null
        } else {
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
      })
    })
    
    const renderTree = (obj: any, prefix = ''): string => {
      let result = ''
      const entries = Object.entries(obj)
      
      entries.forEach(([key, value], index) => {
        const isLast = index === entries.length - 1
        const connector = isLast ? '└── ' : '├── '
        const extension = isLast ? '    ' : '│   '
        
        result += prefix + connector + key + '\n'
        
        if (value && typeof value === 'object') {
          result += renderTree(value, prefix + extension)
        }
      })
      
      return result
    }
    
    return renderTree(tree)
  }

  // Get estimated output size
  const getEstimatedSize = (format: OutputFormat): string => {
    const activeFiles = Object.keys(allFiles).filter(path => !excludedFiles.has(path))
    const baseSize = activeFiles.length * 50 // Rough estimate
    
    switch (format) {
      case 'markdown':
        return `~${Math.round(baseSize * 0.15 / 1024)} KB`
      case 'compact':
        return `~${Math.round(baseSize * 0.3 / 1024)} KB`
      case 'full':
        return `~${Math.round(stats.totalSize / 1024)} KB`
      default:
        return 'Unknown'
    }
  }

  // Copy to clipboard with format
  const copyToClipboard = async (format: OutputFormat) => {
    const output = generateOutput(format)
    
    try {
      await navigator.clipboard.writeText(output)
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  // Download with format
  const downloadWithFormat = (format: OutputFormat) => {
    const output = generateOutput(format)
    const extension = format === 'markdown' ? 'md' : 'json'
    const mimeType = format === 'markdown' ? 'text/markdown' : 'application/json'
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-analysis-${new Date().toISOString().split('T')[0]}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Clear all data when switching tabs
  const handleTabChange = (tab: 'github' | 'local') => {
    if (tab !== activeTab) {
      setAllFiles({})
      setFileStructure({})
      setExcludedFiles(new Set())
      setError(null)
      setIsLoading(false)
      setProgress(0)
      setSelectedFile(null)
      setIsCancelled(false)
      setActiveTab(tab)
    }
  }

  // Analyze files for errors
  const analyzeFiles = (files: Record<string, string>, structure: FileStructure) => {
    // SmartDependencyAnalyzerを使用してエラー検出
    const analyzer = new SmartDependencyAnalyzer()
    const insight = analyzer.analyze(structure, files)
    
    if (insight.errors) {
      setErrors(insight.errors)
    }
  }

  const analyzeFile = (path: string, content: string): FileAnalysis => {
    const imports = content.match(/import .* from ['"](.+)['"]/g) || []
    const localImports = imports
      .filter((imp: string) => imp.includes('./') || imp.includes('../'))
      .map((imp: string) => imp.match(/['"](.+)['"]/)?.[1] || '')
    const externalImports = imports
      .filter((imp: string) => !imp.includes('./') && !imp.includes('../'))
      .map((imp: string) => imp.match(/['"](.+)['"]/)?.[1] || '')
    
    return {
      fileName: path.split('/').pop() || '',
      fullPath: path,
      fileType: determineFileType(path),
      localImports,
      externalImports,
      linesOfCode: content.split('\n').length
    }
  }

  const determineFileType = (path: string): FileAnalysis['fileType'] => {
    if (path.includes('page.') || path.includes('layout.')) return 'page'
    if (path.includes('component')) return 'component'
    if (path.includes('utils') || path.includes('lib')) return 'util'
    if (path.includes('types') || path.includes('.d.ts')) return 'type'
    return 'other'
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsLoading(true)
    setProgress(0)
    setError(null)
    setIsCancelled(false)

    try {
      const processedFiles: Record<string, string> = {}
      const structure: FileStructure = {}

      for (let i = 0; i < files.length; i++) {
        if (isCancelled) {
          setIsLoading(false)
          setProgress(0)
          return
        }
        
        const file = files[i]
        const path = (file as any).webkitRelativePath || file.name
        
        setProgress((i / files.length) * 100)
        
        if (IGNORED_FOLDERS.some(folder => path.includes(folder))) continue
        
        const ext = path.split('.').pop()?.toLowerCase()
        if (!ALLOWED_EXTENSIONS.some(allowed => allowed.substring(1) === ext)) continue
        
        try {
          const content = await file.text()
          processedFiles[path] = content
          
          const parts = path.split('/')
          const dir = parts.slice(0, -1).join('/') || '/'
          
          if (!structure[dir]) structure[dir] = []
          structure[dir].push({
            name: parts[parts.length - 1],
            path: path,
            size: file.size,
            analysis: analyzeFile(path, content)
          })
        } catch (err) {
          console.error(`Error reading ${path}:`, err)
        }
        
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1))
        }
      }

      if (!isCancelled && Object.keys(processedFiles).length === 0) {
        setError('No valid code files found in the selected folder')
      } else if (!isCancelled) {
        setAllFiles(processedFiles)
        setFileStructure(structure)
        // エラー分析を実行
        analyzeFiles(processedFiles, structure)
      }
    } catch (err) {
      setError('Failed to process files. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsCancelled(false)
    }
  }

  const handleFilesProcessed = (files: Record<string, string>, structure: FileStructure) => {
    setAllFiles(files)
    setFileStructure(structure)
    setExcludedFiles(new Set())
    setError(null)
    
    // エラー分析を実行
    analyzeFiles(files, structure)
  }

  // handleErrorFileClick関数を追加
  const handleErrorFileClick = (filePath: string) => {
    setSelectedFile(filePath)
    setViewMode('tree') // ツリービューに切り替え
  }

  const handleExcludeFile = (path: string) => {
    const newExcluded = new Set(excludedFiles)
    newExcluded.add(path)
    setExcludedFiles(newExcluded)
  }

  const handleIncludeFile = (path: string) => {
    const newExcluded = new Set(excludedFiles)
    newExcluded.delete(path)
    setExcludedFiles(newExcluded)
  }

  const clearAll = () => {
    setAllFiles({})
    setFileStructure({})
    setExcludedFiles(new Set())
    setError(null)
    setSelectedFile(null)
    setViewMode('tree')
    setErrors([])
  }

  const cancelProcessing = () => {
    setIsCancelled(true)
    setIsLoading(false)
    setProgress(0)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 bg-opacity-20">
              <FileCode className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Code Dependency Visualizer
          </h1>
          <p className="text-gray-400">
            Analyze your project structure and visualize file dependencies
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-400 hover:text-cyan-400 transition-colors bg-white/5 rounded-lg hover:bg-white/10"
            >
              <HelpCircle size={20} />
            </button>
          </div>

          <div className="flex gap-2 mb-6 border-b border-white/10">
            <button
              onClick={() => handleTabChange('github')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'github' 
                  ? 'text-cyan-400 border-b-2 border-cyan-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Github size={18} />
                GitHub Repository
              </div>
            </button>
            <button
              onClick={() => handleTabChange('local')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'local' 
                  ? 'text-cyan-400 border-b-2 border-cyan-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder size={18} />
                Local Folder
              </div>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {Object.keys(allFiles).length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{stats.totalFiles}</div>
                  <div className="text-sm text-gray-400">Active Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{stats.excludedFiles}</div>
                  <div className="text-sm text-gray-400">Excluded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {(stats.totalSize / 1024).toFixed(1)} KB
                  </div>
                  <div className="text-sm text-gray-400">Total Size</div>
                </div>
              </div>

              {/* New Export Format Selector */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    AI-Optimized Export
                  </h3>
                  <div className="group relative">
                    <button className="text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
                      <HelpCircle size={12} />
                      Tips
                    </button>
                    <div className="absolute right-0 top-6 w-64 p-3 bg-slate-800 rounded-lg shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="text-xs text-gray-300 space-y-2">
                        <p className="font-semibold text-cyan-400 mb-2">💡 Usage Tips:</p>
                        <p>• <strong className="text-green-400">Markdown:</strong> Best for ChatGPT, Claude, and Gemini conversations</p>
                        <p>• <strong className="text-blue-400">Compact JSON:</strong> For API integrations and structured analysis</p>
                        <p>• <strong className="text-purple-400">Full JSON:</strong> When you need complete dependency details</p>
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <p className="text-yellow-400">✨ Pro tip: Use Markdown to save 90% on AI tokens!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    onClick={() => setOutputFormat('markdown')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      outputFormat === 'markdown'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <FileText size={14} className="inline mr-1" />
                    Markdown
                    <span className="block text-xs opacity-70 mt-1">
                      {getEstimatedSize('markdown')}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setOutputFormat('compact')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      outputFormat === 'compact'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <FileJson size={14} className="inline mr-1" />
                    Compact JSON
                    <span className="block text-xs opacity-70 mt-1">
                      {getEstimatedSize('compact')}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setOutputFormat('full')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      outputFormat === 'full'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Hash size={14} className="inline mr-1" />
                    Full JSON
                    <span className="block text-xs opacity-70 mt-1">
                      {getEstimatedSize('full')}
                    </span>
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(outputFormat)}
                    className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 border border-cyan-500/30"
                  >
                    <Copy size={16} />
                    {copiedFormat === outputFormat ? 'Copied!' : 'Copy for AI'}
                  </button>
                  
                  <button
                    onClick={() => downloadWithFormat(outputFormat)}
                    className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 border border-green-500/30"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              {/* Error Panel Toggle & View Mode Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowErrors(!showErrors)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      showErrors 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    <FileWarning size={16} />
                    {showErrors ? 'Hide' : 'Show'} Code Analysis
                    {errors.filter(e => e.severity === 'error').length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-red-500/30 rounded-full text-xs">
                        {errors.filter(e => e.severity === 'error').length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                  >
                    Clear All
                  </button>
                </div>
                
                <button
                  onClick={() => setViewMode(viewMode === 'tree' ? 'analytics' : 'tree')}
                  className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors flex items-center gap-2 border border-indigo-500/30 whitespace-nowrap"
                >
                  {viewMode === 'tree' ? (
                    <>
                      <TrendingUp size={16} />
                      Show Analytics
                    </>
                  ) : (
                    <>
                      <GitBranch size={16} />
                      Show File Tree
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {activeTab === 'github' && !Object.keys(allFiles).length && (
            <GitHubFetcher 
              onFilesProcessed={handleFilesProcessed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onCancel={cancelProcessing}
            />
          )}

          {activeTab === 'local' && !Object.keys(allFiles).length && (
            <div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Shield className="text-yellow-400 mt-0.5" size={20} />
                  <div>
                    <div className="font-semibold text-yellow-400">Security Filter Active</div>
                    <div className="text-sm text-yellow-400/80">
                      Sensitive files (API keys, .env, etc.) are automatically excluded for your security
                    </div>
                  </div>
                </div>
              </div>

              {!isLoading ? (
                <label className="block">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-cyan-400/50 transition-colors cursor-pointer bg-white/5">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <div className="text-lg font-medium text-white mb-2">
                      Click to Select Project Folder
                    </div>
                    <div className="text-sm text-gray-400">
                      or drag and drop your folder here
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    // @ts-ignore
                    webkitdirectory=""
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center bg-white/5">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent mx-auto mb-4" />
                  <div className="text-lg font-medium text-white mb-2">
                    Processing files...
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    {Math.round(progress)}% complete
                  </div>
                  <button
                    onClick={cancelProcessing}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30 flex items-center gap-2 mx-auto"
                  >
                    <X size={16} />
                    Cancel Processing
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Processing files...</span>
                <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {Object.keys(fileStructure).length > 0 && (
            <>
              {/* Error Panel */}
              {showErrors && errors.length > 0 && (
                <div className="mb-6">
                  <ErrorPanel 
                    errors={errors}
                    onFileClick={handleErrorFileClick}
                  />
                </div>
              )}

              {/* File Tree or Dependency Viewer */}
              {viewMode === 'tree' ? (
                <FileTree
                  fileStructure={fileStructure}
                  allFiles={allFiles}
                  excludedFiles={excludedFiles}
                  onExcludeFile={handleExcludeFile}
                  onIncludeFile={handleIncludeFile}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                />
              ) : (
                <DependencyViewer
                  fileStructure={fileStructure}
                  allFiles={allFiles}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                />
              )}
            </>
          )}
        </div>

        {showHelp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">How to Use</h2>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400 flex items-center gap-2">
                    <Sparkles size={18} />
                    AI-Optimized Export
                  </h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li><strong>Markdown:</strong> Lightweight format perfect for AI conversations (~15KB)</li>
                    <li><strong>Compact JSON:</strong> Structured data with essential info (~50KB)</li>
                    <li><strong>Full JSON:</strong> Complete project analysis (original size)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400 flex items-center gap-2">
                    <Github size={18} />
                    GitHub Repository
                  </h3>
                  <ol className="list-decimal ml-5 space-y-1 text-sm">
                    <li>Enter repository in format: owner/repository</li>
                    <li>Select branch (main, master, or develop)</li>
                    <li>Click "Fetch Repository"</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-purple-400 flex items-center gap-2">
                    <Folder size={18} />
                    Local Folder
                  </h3>
                  <ol className="list-decimal ml-5 space-y-1 text-sm">
                    <li>Click the upload area or drag folder</li>
                    <li>Select your project folder</li>
                    <li>Wait for analysis to complete</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}