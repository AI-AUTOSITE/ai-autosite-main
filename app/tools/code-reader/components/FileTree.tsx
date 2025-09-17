'use client'

import { useState } from 'react'
import { 
  Folder, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Filter,
  Package,
  FileText,
  Settings,
  Eye,
  EyeOff,
  Search
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
  selectedFile: string | null
  setSelectedFile: (path: string | null) => void
}

export default function FileTree({ 
  fileStructure, 
  allFiles, 
  excludedFiles, 
  onExcludeFile, 
  onIncludeFile,
  selectedFile,
  setSelectedFile
}: FileTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)

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
        return <FileText className="text-purple-400" size={14} />
      case 'component':
        return <Package className="text-blue-400" size={14} />
      case 'util':
        return <Settings className="text-green-400" size={14} />
      case 'type':
        return <FileCode className="text-yellow-400" size={14} />
      default:
        return <FileCode className="text-gray-400" size={14} />
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

  // Expand all directories by default when searching
  const displayDirs = searchTerm ? Object.keys(filteredStructure) : expandedDirs

return (
    <div className="p-4 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            Files: <span className="font-bold text-cyan-400">{activeFiles}</span>/{totalFiles}
          </span>
          {excludedFiles.size > 0 && (
            <span className="text-orange-400">
              {excludedFiles.size} excluded
            </span>
          )}
        </div>
        
        {/* Search Toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-1.5 rounded transition-all ${
            showSearch ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <Search size={16} />
        </button>
      </div>

      {/* Search Bar (Collapsible) */}
      {showSearch && (
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter files..."
            className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            autoFocus
          />
        </div>
      )}

      {/* File Tree */}
      <div className="border border-white/10 rounded-lg max-h-[500px] overflow-y-auto bg-slate-900/50">
        {Object.keys(filteredStructure).length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {searchTerm ? 'No files match your search' : 'No files loaded'}
          </div>
        ) : (
          Object.entries(filteredStructure).map(([dir, files]) => {
            const isExpanded = searchTerm ? true : expandedDirs.has(dir)
            
            return (
              <div key={dir} className="border-b border-white/5 last:border-b-0">
                <button
                  onClick={() => toggleDir(dir)}
                  className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                  <Folder size={16} className="text-blue-400" />
                  <span className="font-medium text-white text-sm flex-1 text-left">
                    {dir === '/' ? 'root' : dir.split('/').pop()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {files.length}
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="pl-6 pb-1">
                    {files.map((file) => {
                      const isExcluded = excludedFiles.has(file.path)
                      const isSelected = selectedFile === file.path
                      
                      return (
                        <div
                          key={file.path}
                          className={`
                            flex items-center justify-between px-3 py-1.5 rounded mx-2 mb-0.5
                            ${isExcluded ? 'opacity-40' : 'hover:bg-white/5'}
                            ${isSelected ? 'bg-cyan-500/20 border border-cyan-500/30' : ''}
                            transition-all cursor-pointer group
                          `}
                          onClick={() => !isExcluded && setSelectedFile(file.path)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getFileIcon(file.analysis.fileType)}
                            <span className={`text-sm truncate ${
                              isExcluded ? 'line-through text-gray-500' : 'text-gray-300'
                            }`}>
                              {file.name}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-gray-500">
                              {file.analysis.linesOfCode}L
                            </span>
                          </div>
                          
                          {/* Include/Exclude button - only visible on hover */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              isExcluded ? onIncludeFile(file.path) : onExcludeFile(file.path)
                            }}
                            className={`
                              opacity-0 group-hover:opacity-100 transition-opacity
                              p-1 rounded text-xs
                              ${isExcluded 
                                ? 'text-green-400 hover:bg-green-500/20' 
                                : 'text-red-400 hover:bg-red-500/20'
                              }
                            `}
                            title={isExcluded ? 'Include file' : 'Exclude file'}
                          >
                            {isExcluded ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <div className="text-xs text-cyan-400 font-medium mb-1">Selected File</div>
          <div className="text-sm text-white">{selectedFile.split('/').pop()}</div>
          <div className="text-xs text-gray-400 mt-1">{selectedFile}</div>
        </div>
      )}
    </div>
  )
}