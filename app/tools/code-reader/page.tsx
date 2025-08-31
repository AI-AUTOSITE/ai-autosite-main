'use client'

import { useState } from 'react'
import Link from 'next/link'
import GitHubFetcher from './components/GitHubFetcher'
import FileTree from './components/FileTree'
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
  GitBranch
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

  const stats = {
    totalFiles: Object.keys(allFiles).filter(path => !excludedFiles.has(path)).length,
    excludedFiles: excludedFiles.size,
    totalSize: Object.keys(allFiles)
      .filter(path => !excludedFiles.has(path))
      .reduce((sum, path) => sum + (allFiles[path] || '').length, 0)
  }

  // Clear all data when switching tabs
  const handleTabChange = (tab: 'github' | 'local') => {
    if (tab !== activeTab) {
      // Clear all data
      setAllFiles({})
      setFileStructure({})
      setExcludedFiles(new Set())
      setError(null)
      setIsLoading(false)
      setProgress(0)
      // Set the new active tab
      setActiveTab(tab)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsLoading(true)
    setProgress(0)
    setError(null)

    try {
      // Process files locally
      const processedFiles: Record<string, string> = {}
      const structure: FileStructure = {}

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const path = (file as any).webkitRelativePath || file.name
        
        setProgress((i / files.length) * 100)
        
        // Skip ignored folders
        if (IGNORED_FOLDERS.some(folder => path.includes(folder))) continue
        
        // Check file extension
        const ext = path.split('.').pop()?.toLowerCase()
        if (!ALLOWED_EXTENSIONS.some(allowed => allowed.substring(1) === ext)) continue
        
        try {
          // Read file content
          const content = await file.text()
          processedFiles[path] = content
          
          // Build structure
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
      }

      if (Object.keys(processedFiles).length === 0) {
        setError('No valid code files found in the selected folder')
      } else {
        setAllFiles(processedFiles)
        setFileStructure(structure)
      }
    } catch (err) {
      setError('Failed to process files. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeFile = (path: string, content: string): FileAnalysis => {
    // Simplified analysis
    const imports = content.match(/import .* from ['"](.+)['"]/g) || []
    const localImports = imports.filter(imp => imp.includes('./') || imp.includes('../'))
    const externalImports = imports.filter(imp => !imp.includes('./') && !imp.includes('../'))
    
    return {
      fileName: path.split('/').pop() || '',
      fullPath: path,
      fileType: determineFileType(path),
      localImports: localImports.map(imp => imp.match(/['"](.+)['"]/)?.[1] || ''),
      externalImports: externalImports.map(imp => imp.match(/['"](.+)['"]/)?.[1] || ''),
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

  const handleFilesProcessed = (files: Record<string, string>, structure: FileStructure) => {
    setAllFiles(files)
    setFileStructure(structure)
    setExcludedFiles(new Set())
    setError(null)
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

  const handleDownloadResults = () => {
    const data = {
      files: Object.keys(allFiles).filter(path => !excludedFiles.has(path)),
      structure: fileStructure,
      stats: {
        totalFiles: stats.totalFiles,
        excludedFiles: stats.excludedFiles,
        totalSizeKB: (stats.totalSize / 1024).toFixed(1)
      },
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setAllFiles({})
    setFileStructure({})
    setExcludedFiles(new Set())
    setError(null)
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
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

        {/* Main Tool Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          {/* Help Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-400 hover:text-cyan-400 transition-colors bg-white/5 rounded-lg hover:bg-white/10"
            >
              <HelpCircle size={20} />
            </button>
          </div>

          {/* Tabs - Updated with handleTabChange */}
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

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Stats */}
          {Object.keys(allFiles).length > 0 && (
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
          )}

          {/* Actions for Results */}
          {Object.keys(allFiles).length > 0 && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleDownloadResults}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2 border border-cyan-500/30"
              >
                <Download size={16} />
                Download Analysis
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Clear All
              </button>
            </div>
          )}

          {/* GitHub Tab */}
          {activeTab === 'github' && (
            <GitHubFetcher 
              onFilesProcessed={handleFilesProcessed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {/* Local Upload Tab */}
          {activeTab === 'local' && (
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
            </div>
          )}

          {/* Loading Progress */}
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

          {/* Results */}
          {Object.keys(fileStructure).length > 0 && (
            <FileTree
              fileStructure={fileStructure}
              allFiles={allFiles}
              excludedFiles={excludedFiles}
              onExcludeFile={handleExcludeFile}
              onIncludeFile={handleIncludeFile}
            />
          )}
        </div>

        {/* Help Modal */}
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
                <div>
                  <h3 className="font-semibold mb-2 text-green-400 flex items-center gap-2">
                    <Shield size={18} />
                    Security
                  </h3>
                  <p className="text-sm">All processing happens in your browser. No files are uploaded to any server.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-yellow-400 flex items-center gap-2">
                    <GitBranch size={18} />
                    Features
                  </h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Visualize file dependencies</li>
                    <li>Analyze project structure</li>
                    <li>Export results for Claude AI</li>
                    <li>Filter and exclude files</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}