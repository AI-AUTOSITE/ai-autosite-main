'use client'

import { useState } from 'react'
import { 
  Folder, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Download,
  Filter,
  GitBranch,
  Package,
  FileText,
  Settings
} from 'lucide-react'

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

interface FileTreeProps {
  fileStructure: FileStructure
  allFiles: Record<string, string>
  excludedFiles: Set<string>
  onExcludeFile: (path: string) => void
  onIncludeFile: (path: string) => void
}

export default function FileTree({ 
  fileStructure, 
  allFiles, 
  excludedFiles, 
  onExcludeFile, 
  onIncludeFile 
}: FileTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [showDependencies, setShowDependencies] = useState(false)

  const toggleDir = (dir: string) => {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(dir)) {
      newExpanded.delete(dir)
    } else {
      newExpanded.add(dir)
    }
    setExpandedDirs(newExpanded)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'page':
        return <FileText className="text-purple-500" size={16} />
      case 'component':
        return <Package className="text-blue-500" size={16} />
      case 'util':
        return <Settings className="text-green-500" size={16} />
      case 'type':
        return <FileCode className="text-yellow-500" size={16} />
      default:
        return <FileCode className="text-gray-400" size={16} />
    }
  }

  const getFileTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'page': 'Page',
      'component': 'Component',
      'util': 'Utility',
      'type': 'Types',
      'other': 'Other'
    }
    return labels[type] || 'Other'
  }

  const copyAllFiles = () => {
    const activeFiles = Object.keys(allFiles).filter(path => !excludedFiles.has(path))
    const output = activeFiles.map(path => {
      return `// ========== ${path} ==========\n${allFiles[path]}`
    }).join('\n\n')
    
    navigator.clipboard.writeText(output)
      .then(() => alert('All active files copied to clipboard!'))
      .catch(() => alert('Failed to copy to clipboard'))
  }

  const downloadFiles = () => {
    const activeFiles = Object.keys(allFiles).filter(path => !excludedFiles.has(path))
    const output = activeFiles.map(path => {
      return `// ========== ${path} ==========\n${allFiles[path]}`
    }).join('\n\n')
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'project-files.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateTreeStructure = () => {
    let tree = 'Project Structure:\n'
    Object.entries(fileStructure).forEach(([dir, files]) => {
      tree += `\n📁 ${dir === '/' ? 'root' : dir}\n`
      files.forEach((file, index) => {
        const isLast = index === files.length - 1
        const prefix = isLast ? '└── ' : '├── '
        const icon = file.analysis.fileType === 'component' ? '⚛️' : '📄'
        tree += `   ${prefix}${icon} ${file.name} (${file.analysis.linesOfCode} lines)\n`
      })
    })
    
    navigator.clipboard.writeText(tree)
      .then(() => alert('Tree structure copied to clipboard!'))
      .catch(() => alert('Failed to copy to clipboard'))
  }

  const filteredStructure = Object.entries(fileStructure).reduce((acc, [dir, files]) => {
    const filteredFiles = files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filteredFiles.length > 0) {
      acc[dir] = filteredFiles
    }
    return acc
  }, {} as FileStructure)

  const totalFiles = Object.values(fileStructure).flat().length
  const activeFiles = totalFiles - excludedFiles.size

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copyAllFiles}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          <Copy size={16} />
          Copy All Code
        </button>
        <button
          onClick={downloadFiles}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          Download Files
        </button>
        <button
          onClick={generateTreeStructure}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
        >
          <GitBranch size={16} />
          Copy Tree
        </button>
        <button
          onClick={() => setShowDependencies(!showDependencies)}
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
        >
          <Package size={16} />
          {showDependencies ? 'Hide' : 'Show'} Dependencies
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter files..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* File Summary */}
      <div className="bg-gray-50 rounded-lg p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Files: {totalFiles}</span>
          <span className="text-green-600 font-medium">Active: {activeFiles}</span>
          <span className="text-orange-600">Excluded: {excludedFiles.size}</span>
        </div>
      </div>

      {/* File Tree */}
      <div className="border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
        {Object.entries(filteredStructure).map(([dir, files]) => (
          <div key={dir} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => toggleDir(dir)}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              {expandedDirs.has(dir) ? (
                <ChevronDown size={18} className="text-gray-500" />
              ) : (
                <ChevronRight size={18} className="text-gray-500" />
              )}
              <Folder size={18} className="text-blue-500" />
              <span className="font-medium text-gray-700 flex-1 text-left">
                {dir === '/' ? 'root' : dir}
              </span>
              <span className="text-xs text-gray-500">
                {files.length} files
              </span>
            </button>
            
            {expandedDirs.has(dir) && (
              <div className="pl-8 pb-2">
                {files.map((file) => {
                  const isExcluded = excludedFiles.has(file.path)
                  const isSelected = selectedFile === file.path
                  
                  return (
                    <div
                      key={file.path}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg mb-1 mx-2
                        ${isExcluded ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'}
                        ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}
                        transition-all cursor-pointer
                      `}
                      onClick={() => setSelectedFile(file.path)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {getFileIcon(file.analysis.fileType)}
                        <span className={`text-sm ${isExcluded ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {file.name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {getFileTypeLabel(file.analysis.fileType)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {file.analysis.linesOfCode} lines
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          isExcluded ? onIncludeFile(file.path) : onExcludeFile(file.path)
                        }}
                        className={`
                          px-3 py-1 text-xs rounded-md transition-colors
                          ${isExcluded 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }
                        `}
                      >
                        {isExcluded ? 'Include' : 'Exclude'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected File Details */}
      {selectedFile && showDependencies && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">
            Dependencies for: {selectedFile.split('/').pop()}
          </h3>
          
          {(() => {
            const file = Object.values(fileStructure).flat().find(f => f.path === selectedFile)
            if (!file) return null
            
            return (
              <div className="space-y-3">
                {file.analysis.localImports.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Local Imports:</h4>
                    <div className="flex flex-wrap gap-2">
                      {file.analysis.localImports.map((imp, i) => (
                        <span key={i} className="px-2 py-1 bg-white rounded text-xs text-blue-700">
                          {imp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {file.analysis.externalImports.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">External Libraries:</h4>
                    <div className="flex flex-wrap gap-2">
                      {file.analysis.externalImports.map((imp, i) => (
                        <span key={i} className="px-2 py-1 bg-white rounded text-xs text-purple-700">
                          {imp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}