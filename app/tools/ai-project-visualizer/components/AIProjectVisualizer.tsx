// app/tools/ai-project-visualizer/components/AIProjectVisualizer.tsx

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  FileText,
  FolderOpen,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Trash2,
  Shield,
  Download,
  FileUp,
  FolderPlus,
  Sparkles,
  Loader2,
  FileDown,
  AlertTriangle,
} from 'lucide-react'

// Import AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

// Types
interface TreeNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: TreeNode[]
}

interface ProjectData {
  name: string
  totalFiles: number
  totalFolders: number
  structure: TreeNode
}

type FormatType = 'tree' | 'mermaid' | 'json' | 'markdown'
type AIAction = 'analyze' | 'readme'

export default function AIProjectVisualizerClient() {
  // Router for redirect
  const router = useRouter()

  // AI Tool Warning Hook
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning() // ✅ isChecking 追加
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Custom disagree handler - redirect to home
  const handleCustomDisagree = () => {
    setIsRedirecting(true) 
    handleDisagree()
    router.push('/')
  }

  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [format, setFormat] = useState<FormatType>('tree')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  // AI state
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiError, setAiError] = useState('')
  const [showAiPanel, setShowAiPanel] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  // Security config
  const EXCLUDED = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '.env',
    '.env.local',
    'credentials.json',
    '.DS_Store',
  ])

  // Convert to Tree format
  const toTree = useCallback((node: TreeNode, prefix = '', isLast = true): string => {
    const lines: string[] = []
    const connector = isLast ? '└── ' : '├── '
    const name = node.type === 'folder' ? `${node.name}/` : node.name

    if (prefix === '') {
      lines.push(name)
    } else {
      lines.push(prefix + connector + name)
    }

    if (node.children?.length) {
      const extension = isLast ? '    ' : '│   '
      node.children.forEach((child, index) => {
        lines.push(toTree(child, prefix + extension, index === node.children!.length - 1))
      })
    }

    return lines.join('\n')
  }, [])

  // Convert to Mermaid
  const toMermaid = useCallback((node: TreeNode): string => {
    const lines: string[] = ['```mermaid', 'graph TD']
    let counter = 0

    const process = (n: TreeNode, parentId: string | null = null) => {
      const id = `N${counter++}`
      const label = n.type === 'folder' ? `[${n.name}/]` : `[${n.name}]`

      if (parentId) {
        lines.push(`    ${parentId} --> ${id}${label}`)
      } else {
        lines.push(`    ${id}${label}`)
      }

      n.children?.forEach((child) => process(child, id))
    }

    process(node)
    lines.push('```')
    return lines.join('\n')
  }, [])

  // Convert to JSON
  const toJSON = useCallback((node: TreeNode): string => {
    const clean = (n: TreeNode): any => ({
      name: n.name,
      type: n.type,
      ...(n.children && { children: n.children.map(clean) }),
    })
    return JSON.stringify(clean(node), null, 2)
  }, [])

  // Convert to Markdown
  const toMarkdown = useCallback((node: TreeNode): string => {
    const lines: string[] = [`# ${node.name} Structure\n`]

    const process = (n: TreeNode, depth = 0) => {
      const indent = '  '.repeat(depth)
      const bullet = depth === 0 ? '##' : '-'
      const name = n.type === 'folder' ? `**${n.name}/**` : n.name

      if (depth === 0) {
        lines.push(`## Directory Structure\n`)
      } else {
        lines.push(`${indent}${bullet} ${name}`)
      }

      n.children?.forEach((child) => process(child, depth + 1))
    }

    process(node)
    return lines.join('\n')
  }, [])

  // Export data
  const exportData = useCallback(
    (node: TreeNode, fmt: FormatType): string => {
      switch (fmt) {
        case 'tree':
          return toTree(node)
        case 'mermaid':
          return toMermaid(node)
        case 'json':
          return toJSON(node)
        case 'markdown':
          return toMarkdown(node)
        default:
          return ''
      }
    },
    [toTree, toMermaid, toJSON, toMarkdown]
  )

  // AI Analysis
  const handleAIAnalysis = async (action: AIAction) => {
    if (!projectData || !hasAgreed) return

    setIsAnalyzing(true)
    setAiError('')
    setShowAiPanel(true)

    try {
      const structureText = toTree(projectData.structure)

      const response = await fetch('/api/ai-project-visualizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          projectStructure: structureText,
        }),
      })

      if (!response.ok) {
        throw new Error('AI analysis failed')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setAiAnalysis(data.result)
    } catch (err) {
      console.error('AI Analysis error:', err)
      setAiError('Failed to analyze project. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Copy AI analysis
  const handleCopyAI = async () => {
    if (!aiAnalysis) return

    try {
      await navigator.clipboard.writeText(aiAnalysis)
      const originalText = aiAnalysis
      setAiAnalysis('✓ Copied to clipboard!')
      setTimeout(() => setAiAnalysis(originalText), 1500)
    } catch {
      setAiError('Failed to copy')
    }
  }

  // Process files
  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      setError('')
      setAiAnalysis('')
      setShowAiPanel(false)

      const fileTree: { [key: string]: any } = {}
      let fileCount = 0
      let folderCount = 0
      let skipped = 0

      for (const file of Array.from(files)) {
        const pathParts = file.webkitRelativePath
          ? file.webkitRelativePath.split('/')
          : file.name.split('/')

        // Security check
        if (pathParts.some((part) => EXCLUDED.has(part.toLowerCase()))) {
          skipped++
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          skipped++
          continue
        }

        // Build tree
        let current = fileTree
        pathParts.forEach((part, index) => {
          if (index === pathParts.length - 1) {
            current[part] = { type: 'file' }
            fileCount++
          } else {
            if (!current[part]) {
              current[part] = { type: 'folder', children: {} }
              folderCount++
            }
            current = current[part].children
          }
        })
      }

      if (fileCount === 0 && folderCount === 0) {
        setError('No valid files found')
        return
      }

      // Convert to TreeNode
      const convertToNode = (obj: any, name: string, id = 'root'): TreeNode => {
        if (obj.type === 'file') return { id, name, type: 'file' }

        const children = Object.keys(obj.children || {})
          .sort()
          .map((key, i) => convertToNode(obj.children[key], key, `${id}-${i}`))

        return { id, name, type: 'folder', children: children.length > 0 ? children : undefined }
      }

      const rootName = Object.keys(fileTree)[0] || 'project'
      const structure = convertToNode(
        fileTree[rootName] || { type: 'folder', children: fileTree },
        rootName
      )

      setProjectData({
        name: rootName,
        totalFiles: fileCount,
        totalFolders: folderCount,
        structure,
      })

      setExpandedNodes(new Set(['root']))

      if (skipped > 0) {
        setError(`Processed ${fileCount} files. ${skipped} files were excluded for security.`)
      }
    },
    [EXCLUDED]
  )

  // Update output when data or format changes
  useEffect(() => {
    if (projectData) {
      setOutput(exportData(projectData.structure, format))
    }
  }, [projectData, format, exportData])

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasAgreed) {
      processFiles(e.target.files)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (hasAgreed) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (!hasAgreed) return

    const items = e.dataTransfer.items
    const files: File[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }

    if (files.length > 0) {
      const dt = new DataTransfer()
      files.forEach((file) => dt.items.add(file))
      processFiles(dt.files)
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Failed to copy')
    }
  }

  // Download file
  const handleDownload = () => {
    if (!output || !projectData) return

    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${projectData.name}_${format}_${timestamp}.${
      format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt'
    }`

    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Clear all
  const handleClear = () => {
    setProjectData(null)
    setOutput('')
    setError('')
    setExpandedNodes(new Set())
    setAiAnalysis('')
    setShowAiPanel(false)
  }

  // Load sample
  const loadSample = () => {
    if (!hasAgreed) return

    const sample: ProjectData = {
      name: 'my-project',
      totalFiles: 5,
      totalFolders: 3,
      structure: {
        id: 'root',
        name: 'my-project',
        type: 'folder',
        children: [
          {
            id: '1',
            name: 'src',
            type: 'folder',
            children: [
              { id: '1-1', name: 'App.tsx', type: 'file' },
              { id: '1-2', name: 'index.tsx', type: 'file' },
            ],
          },
          {
            id: '2',
            name: 'public',
            type: 'folder',
            children: [{ id: '2-1', name: 'index.html', type: 'file' }],
          },
          { id: '3', name: 'package.json', type: 'file' },
          { id: '4', name: 'README.md', type: 'file' },
        ],
      },
    }

    setProjectData(sample)
    setExpandedNodes(new Set(['root', '1', '2']))
    setAiAnalysis('')
    setShowAiPanel(false)
  }

  // Toggle node expansion
  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  // Render tree node
  const renderNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id}>
        <div
          className={`
            flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-white/10 cursor-pointer
            transition-colors active:bg-white/20
            ${node.type === 'folder' ? 'text-cyan-400' : 'text-gray-300'}
          `}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <span className="text-gray-500 flex-shrink-0">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}

          {node.type === 'folder' ? (
            <FolderOpen size={16} className="text-yellow-400 flex-shrink-0" />
          ) : (
            <FileText size={16} className="text-blue-400 flex-shrink-0" />
          )}

          <span className="text-xs sm:text-sm truncate">{node.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  if (isChecking || isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {/* ドット表示（必須） */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="mt-6 text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* AI Tool Warning Modal */}
      <AIToolWarningModal
        isOpen={showWarning}
        onAgree={handleAgree}
        onDisagree={handleCustomDisagree}
      />

      {/* Show warning message if not agreed */}
      {!hasAgreed ? (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8">
              <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Agreement Required</h3>
              <p className="text-gray-400 text-sm mb-6">
                You must agree to the terms to use this AI-powered tool.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-semibold shadow-lg"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Content - Only show if agreed */
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore
            webkitdirectory=""
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="p-4 sm:p-5 bg-white/5 rounded-xl border border-cyan-500/20">
                <div className="mb-4">
                  <label className="text-white font-semibold text-sm sm:text-base flex items-center gap-2 mb-3">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    Import Project
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[48px] px-3 py-3 text-xs sm:text-sm bg-white/5 text-gray-400 
                                 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all font-medium 
                                 border border-white/10 hover:border-cyan-400/50 active:scale-95"
                    >
                      <FileUp className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Files
                    </button>
                    <button
                      onClick={() => folderInputRef.current?.click()}
                      className="min-h-[48px] px-3 py-3 text-xs sm:text-sm bg-white/5 text-gray-400 
                                 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg transition-all font-medium 
                                 border border-white/10 hover:border-cyan-400/50 active:scale-95"
                    >
                      <FolderPlus className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Folder
                    </button>
                    <button
                      onClick={loadSample}
                      className="min-h-[48px] px-3 py-3 text-xs sm:text-sm bg-white/5 text-gray-400 hover:bg-white/10 
                                 rounded-lg transition-all font-medium border border-white/10 active:scale-95"
                    >
                      Sample
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs sm:text-sm text-gray-400">
                      {projectData ? 'Project Structure' : 'Drop Zone'}
                    </label>
                    {projectData && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {projectData.totalFiles}f, {projectData.totalFolders}d
                        </span>
                        <button
                          onClick={handleClear}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center text-xs bg-red-500/20 text-red-400 
                                     hover:bg-red-500/30 rounded-lg transition-all active:scale-95"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {!projectData ? (
                    <div
                      className={`
                        h-48 sm:h-60 p-4 bg-black/20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center
                        transition-all cursor-pointer hover:bg-black/30
                        ${isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/20'}
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => folderInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 mb-3" />
                      <p className="text-gray-300 text-sm sm:text-base font-medium">
                        Drop files/folders here
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2">or click to browse</p>
                      <p className="text-gray-600 text-xs mt-3">
                        Auto-excludes: node_modules, .git, .env
                      </p>
                    </div>
                  ) : (
                    <div className="h-48 sm:h-60 p-3 bg-black/20 border border-white/10 rounded-xl overflow-y-auto">
                      {renderNode(projectData.structure)}
                    </div>
                  )}
                </div>

                {/* AI Analysis Section */}
                {projectData && (
                  <div className="mt-4 space-y-3">
                    {/* AI Analyze Button */}
                    <button
                      onClick={() => handleAIAnalysis('analyze')}
                      disabled={isAnalyzing}
                      className="w-full min-h-[56px] px-4 py-4 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 
                                 text-white hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all font-bold 
                                 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed 
                                 flex items-center justify-center gap-2 active:scale-95"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span>Analyzing with AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Analyze with AI</span>
                        </>
                      )}
                    </button>

                    {/* AI Analysis Panel */}
                    {showAiPanel && (
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                            AI Analysis
                          </label>
                          {aiAnalysis && !isAnalyzing && (
                            <button
                              onClick={handleCopyAI}
                              className="min-h-[40px] px-3 py-2 text-xs sm:text-sm bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 
                                         rounded-lg transition-all flex items-center gap-1 font-medium border border-purple-400/50 active:scale-95"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </button>
                          )}
                        </div>

                        {isAnalyzing ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
                              <p className="text-gray-400 text-sm">
                                Analyzing your project structure...
                              </p>
                              <p className="text-gray-500 text-xs mt-1">This may take a few seconds</p>
                            </div>
                          </div>
                        ) : aiError ? (
                          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm">{aiError}</p>
                          </div>
                        ) : aiAnalysis ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <div className="text-gray-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                              {aiAnalysis}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Secondary Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAIAnalysis('readme')}
                        disabled={isAnalyzing}
                        className="min-h-[48px] px-3 py-3 text-xs sm:text-sm bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 
                                   rounded-lg transition-all font-medium border border-blue-400/50 disabled:opacity-50 
                                   disabled:cursor-not-allowed flex items-center justify-center gap-1 active:scale-95"
                      >
                        <FileDown className="w-3 h-3" />
                        <span>Generate README</span>
                      </button>
                      <button
                        onClick={handleClear}
                        className="min-h-[48px] px-3 py-3 text-xs sm:text-sm bg-white/5 text-gray-400 hover:bg-white/10 
                                   rounded-lg transition-all font-medium border border-white/10 active:scale-95"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Output Section */}
              <div className="p-4 sm:p-5 bg-white/5 rounded-xl border border-purple-500/20">
                <div className="mb-4">
                  <label className="text-white font-semibold text-sm sm:text-base flex items-center gap-2 mb-3">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Export Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'tree', label: 'Tree' },
                      { id: 'mermaid', label: 'Mermaid' },
                      { id: 'json', label: 'JSON' },
                      { id: 'markdown', label: 'Markdown' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setFormat(fmt.id as FormatType)}
                        className={`min-h-[48px] px-3 py-3 text-xs sm:text-sm rounded-lg font-medium transition-all active:scale-95 ${
                          format === fmt.id
                            ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs sm:text-sm text-gray-400">Output Preview</label>
                    {output && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className={`min-h-[40px] px-3 py-2 text-xs sm:text-sm rounded-lg transition-all flex items-center gap-1 
                                      font-medium active:scale-95 ${
                            copied
                              ? 'bg-green-500 text-white'
                              : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-400/50'
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span className="hidden sm:inline">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="hidden sm:inline">Copy</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleDownload}
                          className="min-h-[40px] px-3 py-2 text-xs sm:text-sm bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 
                                     rounded-lg transition-all flex items-center gap-1 font-medium border border-purple-400/50 active:scale-95"
                        >
                          <Download className="w-3 h-3" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <textarea
                    value={output}
                    readOnly
                    placeholder={`${format} output will appear here...\n\nUpload your project to get started`}
                    className="w-full h-[200px] sm:h-[280px] p-3 sm:p-4 bg-black/20 border border-white/10 rounded-xl text-white 
                               placeholder-gray-500 resize-none font-mono text-xs sm:text-sm cursor-text"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className={`mt-6 p-3 sm:p-4 rounded-lg animate-fadeIn ${
                  error.includes('Processed')
                    ? 'bg-yellow-500/10 border border-yellow-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <p
                  className={`text-xs sm:text-sm ${
                    error.includes('Processed') ? 'text-yellow-400' : 'text-red-400'
                  }`}
                >
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}