'use client'

import React, { useState, useMemo, lazy, Suspense } from 'react'
import { 
  GitBranch, 
  Package, 
  FileCode, 
  AlertCircle,
  TrendingUp,
  Share2,
  Layers,
  FileText,
  Settings
} from 'lucide-react'

// Dynamic import for the graph component
const InteractiveDependencyGraph = lazy(() => import('./InteractiveDependencyGraph'))

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

interface DependencyStats {
  totalDependencies: number
  localDependencies: number
  externalDependencies: number
  mostUsedFiles: { path: string; count: number }[]
  circularDependencies: string[][]
  dependencyDepth: number
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
  const [viewMode, setViewMode] = useState<'graph' | 'list' | 'matrix'>('graph')

  // Calculate dependency statistics
  const dependencyStats = useMemo(() => {
    const stats: DependencyStats = {
      totalDependencies: 0,
      localDependencies: 0,
      externalDependencies: 0,
      mostUsedFiles: [],
      circularDependencies: [],
      dependencyDepth: 0
    }

    if (!fileStructure || Object.keys(fileStructure).length === 0) {
      return stats
    }

    // Count dependencies
    const dependencyCount: Record<string, number> = {}
    const allFilesFlat = Object.values(fileStructure).flat()
    
    allFilesFlat.forEach(file => {
      stats.localDependencies += file.analysis.localImports.length
      stats.externalDependencies += file.analysis.externalImports.length
      
      // Count which files are imported most
      file.analysis.localImports.forEach(imp => {
        // Try to match import path with actual files
        const matchedFile = allFilesFlat.find(f => {
          const importName = imp.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
          const fileName = f.name.replace(/\.(tsx?|jsx?)$/, '')
          return fileName === importName || f.path.includes(imp.replace(/^\.\//, ''))
        })
        
        if (matchedFile) {
          dependencyCount[matchedFile.path] = (dependencyCount[matchedFile.path] || 0) + 1
        }
      })
    })

    stats.totalDependencies = stats.localDependencies + stats.externalDependencies
    
    // Get most used files
    stats.mostUsedFiles = Object.entries(dependencyCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }))

    return stats
  }, [fileStructure])

  const getFileTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'page': 'text-purple-400',
      'component': 'text-blue-400',
      'util': 'text-green-400',
      'type': 'text-yellow-400',
      'other': 'text-gray-400'
    }
    return colors[type] || 'text-gray-400'
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
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

  return (
    <div className="space-y-4">
      {/* Statistics Dashboard */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-cyan-400" />
          Dependency Analytics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-cyan-400">
              {dependencyStats.totalDependencies}
            </div>
            <div className="text-xs text-gray-400">Total Dependencies</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">
              {dependencyStats.localDependencies}
            </div>
            <div className="text-xs text-gray-400">Internal</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">
              {dependencyStats.externalDependencies}
            </div>
            <div className="text-xs text-gray-400">External</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-400">
              {dependencyStats.mostUsedFiles.length}
            </div>
            <div className="text-xs text-gray-400">Hot Spots</div>
          </div>
        </div>
      </div>

      {/* Most Imported Files */}
      {dependencyStats.mostUsedFiles.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Share2 size={16} className="text-yellow-400" />
            Most Imported Files (Hot Spots)
          </h3>
          <div className="space-y-2">
            {dependencyStats.mostUsedFiles.map((file, i) => {
              const fileName = file.path.split('/').pop() || file.path
              return (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 truncate flex-1">
                    {fileName}
                  </span>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    {file.count} imports
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b border-white/10">
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

      {/* Graph View */}
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

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* File selector */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">Select a file to view dependencies:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {Object.values(fileStructure).flat().map((file: any) => {
                // Calculate dependencies count
                const localImportsCount = file.analysis.localImports?.length || 0
                const externalImportsCount = file.analysis.externalImports?.length || 0
                const totalImports = localImportsCount + externalImportsCount
                
                // Calculate how many files import this file
                const importedByCount = Object.values(fileStructure).flat().filter((f: any) => 
                  f.analysis.localImports?.some((imp: string) => {
                    const targetName = file.name.replace(/\.(tsx?|jsx?)$/, '')
                    const importName = imp.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
                    return importName === targetName || imp.includes(targetName)
                  })
                ).length
                
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file.path)}
                    className={`px-3 py-2 text-xs rounded-lg text-left transition-all ${
                      selectedFile === file.path
                        ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium truncate">{file.name}</div>
                      {/* Badges - horizontal layout */}
                      <div className="flex gap-1 flex-shrink-0">
                        {totalImports > 0 && (
                          <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs" title={`Imports ${totalImports} files`}>
                            →{totalImports}
                          </span>
                        )}
                        {importedByCount > 0 && (
                          <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-xs" title={`Imported by ${importedByCount} files`}>
                            ←{importedByCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs opacity-70">{file.analysis.fileType}</div>
                    <div className="text-xs opacity-50 mt-1 truncate">{file.path}</div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Dependencies display */}
          {selectedFile && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-400 mb-3 flex items-center justify-between">
                <span>Dependencies for: {selectedFile.split('/').pop()}</span>
                <span className="text-xs font-normal opacity-70">{selectedFile}</span>
              </h3>
              
              {(() => {
                const file = Object.values(fileStructure).flat().find((f: any) => f.path === selectedFile)
                if (!file) return <p className="text-gray-400">File not found</p>
                
                return (
                  <div className="space-y-3">
                    {file.analysis.localImports.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2">
                          Local Imports ({file.analysis.localImports.length})
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                            Internal Dependencies
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {file.analysis.localImports.map((imp: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-blue-300 hover:bg-white/20 transition-colors cursor-pointer" title={imp}>
                              {imp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {file.analysis.externalImports.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2">
                          External Libraries ({file.analysis.externalImports.length})
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                            NPM Packages
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {file.analysis.externalImports.map((imp: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-purple-300 hover:bg-white/20 transition-colors cursor-pointer" title={imp}>
                              {imp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show files that import this file */}
                    {(() => {
                      const importedBy = Object.values(fileStructure).flat().filter((f: any) => 
                        f.analysis.localImports?.some((imp: string) => {
                          const targetName = file.name.replace(/\.(tsx?|jsx?)$/, '')
                          const importName = imp.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '')
                          return importName === targetName || imp.includes(targetName)
                        })
                      )
                      
                      if (importedBy.length > 0) {
                        return (
                          <div>
                            <h4 className="text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2">
                              Imported By ({importedBy.length})
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                Dependent Files
                              </span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {importedBy.map((f: any, i: number) => (
                                <button
                                  key={i}
                                  onClick={() => setSelectedFile(f.path)}
                                  className="px-2 py-1 bg-white/10 rounded text-xs text-green-300 hover:bg-green-500/20 transition-colors flex items-center gap-1"
                                  title={f.path}
                                >
                                  <span>{f.name}</span>
                                  <span className="opacity-50">({f.analysis.fileType})</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}
                    
                    {file.analysis.localImports.length === 0 && file.analysis.externalImports.length === 0 && (
                      <p className="text-gray-400 text-sm">No dependencies found in this file</p>
                    )}
                  </div>
                )
              })()}
            </div>
          )}
          
          {!selectedFile && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <FileCode size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">Select a file from above to view its dependencies</p>
              <p className="text-xs text-gray-500 mt-2">
                Files with <span className="text-blue-400">→</span> import other files, 
                files with <span className="text-green-400">←</span> are imported by other files
              </p>
            </div>
          )}
        </div>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm pb-2 -mt-4 -mx-4 px-4 pt-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white mb-2">
              Dependency Matrix
            </h3>
            
            {/* Legend */}
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-blue-400">→</span>
                <span className="text-gray-400">Files this imports</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">←</span>
                <span className="text-gray-400">Files importing this</span>
              </div>
            </div>
          </div>
          
          {(!fileStructure || Object.keys(fileStructure).length === 0) ? (
            <p className="text-gray-400 mt-4">No files to display</p>
          ) : (
            <div className="text-xs mt-2">
              <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
                <table className="w-full relative">
                  <thead className="sticky top-0 z-20 bg-slate-800/95 backdrop-blur-sm">
                    <tr className="border-b border-white/20">
                      <th className="text-left p-2 text-gray-400 bg-slate-800/95">
                        <div className="flex items-center gap-2">
                          <FileCode size={14} />
                          File
                        </div>
                      </th>
                      <th className="text-center p-2 text-gray-400 bg-slate-800/95">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-blue-400">→</span>
                          <span className="hidden sm:inline">Dependencies</span>
                          <span className="sm:hidden">Deps</span>
                        </div>
                      </th>
                      <th className="text-center p-2 text-gray-400 bg-slate-800/95">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-green-400">←</span>
                          <span className="hidden sm:inline">Imported By</span>
                          <span className="sm:hidden">Imports</span>
                        </div>
                      </th>
                      <th className="text-center p-2 text-gray-400 bg-slate-800/95">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(fileStructure).flat().map((file: any) => {
                      const importedByCount = dependencyStats.mostUsedFiles.find(
                        f => f.path === file.path
                      )?.count || 0
                      
                      const hasAnyDependency = file.analysis.localImports.length > 0 || importedByCount > 0
                      
                      return (
                        <tr 
                          key={file.path} 
                          className={`border-t border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${hasAnyDependency ? '' : 'opacity-50'}`}
                          onClick={() => setSelectedFile(file.path)}
                        >
                          <td className="p-2 text-gray-300">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.analysis.fileType)}
                              <div>
                                <span className={`${hasAnyDependency ? 'font-medium' : ''} block`}>{file.name}</span>
                                <span className="text-xs text-gray-500 block">{file.path}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            {file.analysis.localImports.length > 0 ? (
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-semibold">
                                {file.analysis.localImports.length}
                              </span>
                            ) : (
                              <span className="text-gray-600">0</span>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            {importedByCount > 0 ? (
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded font-semibold">
                                {importedByCount}
                              </span>
                            ) : (
                              <span className="text-gray-600">0</span>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            <span className={`${getFileTypeColor(file.analysis.fileType)} ${hasAnyDependency ? '' : 'opacity-50'}`}>
                              {file.analysis.fileType}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Statistics - Outside scrollable area */}
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-gray-400">
                <span>Total Files: {Object.values(fileStructure).flat().length}</span>
                <span>
                  Active Dependencies: {
                    Object.values(fileStructure).flat().filter((f: any) => 
                      f.analysis.localImports.length > 0 || 
                      dependencyStats.mostUsedFiles.some(mf => mf.path === f.path)
                    ).length
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}