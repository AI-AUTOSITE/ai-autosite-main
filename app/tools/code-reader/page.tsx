'use client'

import GitHubFetcher from '@/app/tools/code-reader/components/GitHubFetcher'
import FileTree from '@/app/tools/code-reader/components/FileTree'
import { useState } from 'react'
import Link from 'next/link'
import { 
  Upload, 
  Folder, 
  AlertCircle, 
  X, 
  FileCode,
  GitBranch,
  Shield,
  Download,
  Copy,
  HelpCircle,
  ChevronRight,
  ExternalLink
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

  const stats = {
    totalFiles: Object.keys(allFiles).filter(path => !excludedFiles.has(path)).length,
    excludedFiles: excludedFiles.size,
    totalSize: Object.keys(allFiles)
      .filter(path => !excludedFiles.has(path))
      .reduce((sum, path) => sum + (allFiles[path] || '').length, 0)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsLoading(true)
    setProgress(0)

    // Process files locally
    const processedFiles: Record<string, string> = {}
    const structure: FileStructure = {}

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const path = (file as any).webkitRelativePath || file.name
      
      setProgress((i / files.length) * 100)
      
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
    }

    setAllFiles(processedFiles)
    setFileStructure(structure)
    setIsLoading(false)
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

  const copyToClipboard = () => {
    const activeFiles = Object.keys(allFiles).filter(path => !excludedFiles.has(path))
    const output = activeFiles.map(path => `// ${path}\n${allFiles[path]}`).join('\n\n')
    navigator.clipboard.writeText(output)
  }

  const handleFilesProcessed = (files: Record<string, string>, structure: FileStructure) => {
    setAllFiles(files)
    setFileStructure(structure)
    setExcludedFiles(new Set())
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/tools" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            ← Back to Tools
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <HelpCircle size={20} />
            </button>
            <Link 
              href="https://github.com/AI-AUTOSITE" 
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github size={16} />
              View Source
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Code Dependency Visualizer
          </h1>
          <p className="text-gray-600">
            Analyze your project structure and visualize file dependencies
          </p>
        </div>

        {/* Main Tool Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('github')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'github' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Github size={18} />
                GitHub Repository
              </div>
            </button>
            <button
              onClick={() => setActiveTab('local')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'local' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder size={18} />
                Local Folder
              </div>
            </button>
          </div>

          {/* Stats */}
          {Object.keys(allFiles).length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalFiles}</div>
                <div className="text-sm text-gray-600">Active Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.excludedFiles}</div>
                <div className="text-sm text-gray-600">Excluded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(stats.totalSize / 1024).toFixed(1)} KB
                </div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
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
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Shield className="text-yellow-600 mt-0.5" size={20} />
                  <div>
                    <div className="font-semibold text-yellow-900">Security Filter Active</div>
                    <div className="text-sm text-yellow-700">
                      Sensitive files (API keys, .env, etc.) are automatically excluded for your security
                    </div>
                  </div>
                </div>
              </div>

              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <div className="text-lg font-medium text-gray-700 mb-2">
                    Click to Select Project Folder
                  </div>
                  <div className="text-sm text-gray-500">
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
                <span className="text-sm text-gray-600">Processing files...</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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

          {/* Help Modal */}
          {showHelp && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">How to Use</h2>
                  <button onClick={() => setShowHelp(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-2">GitHub Repository</h3>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Enter repository in format: owner/repository</li>
                      <li>Select branch (main, master, or develop)</li>
                      <li>Click "Fetch Repository"</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Local Folder</h3>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Click the upload area or drag folder</li>
                      <li>Select your project folder</li>
                      <li>Wait for analysis to complete</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Security</h3>
                    <p>All processing happens in your browser. No files are uploaded to any server.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}