'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, AlertCircle, X, Shield, Info, CheckCircle } from 'lucide-react'
import { ProjectStructure, FileData } from '../lib/types'
import { IGNORED_FOLDERS, ALLOWED_EXTENSIONS, performSecurityCheck } from '../lib/constants'
import { analyzeFileContent } from '../lib/utils'

interface FileUploaderProps {
  onFilesProcessed: (files: Record<string, string>, structure: ProjectStructure) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// File processing limits
const FILE_LIMITS = {
  maxFiles: 500,
  maxFileSize: 10, // MB
  maxTotalSize: 50, // MB
  supportedExtensions: ALLOWED_EXTENSIONS
}

export default function FileUploader({ onFilesProcessed, isLoading, setIsLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [securityExcluded, setSecurityExcluded] = useState(0)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cancelled, setCancelled] = useState(false)
  const [filesProcessed, setFilesProcessed] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [skippedFolders, setSkippedFolders] = useState<Set<string>>(new Set())

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const items = Array.from(e.dataTransfer.items)
    const files: File[] = []
    
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry) {
          await traverseFileTree(entry, files)
        }
      }
    }
    
    if (files.length > 0) {
      // Show security modal before processing
      setPendingFiles(files)
      setShowSecurityModal(true)
    }
  }

  const traverseFileTree = async (entry: any, filesList: File[], path: string = ''): Promise<void> => {
    // OPTIMIZATION: Skip ignored folders IMMEDIATELY during traversal
    if (entry.isDirectory) {
      const dirName = entry.name.toLowerCase()
      
      // Skip ignored folders completely - don't even enter them
      if (IGNORED_FOLDERS.includes(dirName)) {
        // Track skipped folders for user feedback
        setSkippedFolders(prev => new Set(prev).add(dirName))
        console.log(`Skipping folder: ${dirName}`)
        return // Exit early - don't process this directory at all
      }
      
      const dirReader = entry.createReader()
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries: any[]) => {
          // Process entries in batches to prevent UI freeze
          const batchSize = 10
          for (let i = 0; i < entries.length; i += batchSize) {
            const batch = entries.slice(i, i + batchSize)
            
            for (const subEntry of batch) {
              if (cancelled) {
                resolve()
                return
              }
              await traverseFileTree(subEntry, filesList, path + '/' + entry.name)
            }
            
            // Yield to main thread between batches
            if (i + batchSize < entries.length) {
              await new Promise(r => setTimeout(r, 0))
            }
          }
          resolve()
        })
      })
    } else if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file((file: File) => {
          // Only add allowed files
          if (isAllowedFile(file.name)) {
            filesList.push(file)
          }
          resolve()
        })
      })
    }
  }

  const isAllowedFile = (filename: string): boolean => {
    const name = filename.toLowerCase()
    const nameOnly = name.split('/').pop() || ''
    
    // Skip .env files (except .example)
    if (nameOnly.startsWith('.env') && !nameOnly.includes('.example')) {
      return false
    }
    
    // Allow specific config files
    if (['dockerfile', '.gitignore', '.dockerignore', '.prettierrc', '.eslintrc'].includes(nameOnly)) {
      return true
    }
    
    // Check file extension
    return ALLOWED_EXTENSIONS.some(ext => name.endsWith(ext))
  }

  const shouldIgnorePath = (path: string): boolean => {
    const parts = path.split('/')
    return parts.some(part => IGNORED_FOLDERS.includes(part.toLowerCase()))
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const processFiles = async (files: File[]) => {
    // Initialize processing state
    initializeProcessing(files.length)
    
    const results = {
      allFiles: {} as Record<string, string>,
      fileStructure: {} as ProjectStructure,
      processedCount: 0,
      securityExcludedCount: 0
    }
    
    // Filter out files from ignored paths BEFORE processing
    const validFiles = files.filter(file => {
      const filePath = getFilePath(file)
      return !shouldIgnorePath(filePath)
    })
    
    console.log(`Processing ${validFiles.length} files (filtered from ${files.length})`)
    setTotalFiles(validFiles.length)
    
    // Process each valid file
    for (let i = 0; i < validFiles.length; i++) {
      if (cancelled) {
        cancelProcessing()
        return
      }
      
      await processFile(validFiles[i], i, validFiles.length, results)
      setFilesProcessed(i + 1)
      
      // Yield to prevent UI freeze
      if (i % 5 === 0) {
        await yieldToMain()
      }
    }
    
    // Finalize processing
    finalizeProcessing(results)
  }

  // Helper functions for better organization
  const initializeProcessing = (totalFileCount: number) => {
    setCancelled(false)
    setIsLoading(true)
    setProgress(5)
    setCurrentFile('Scanning files...')
    setFilesProcessed(0)
    setSkippedFolders(new Set())
  }

  const cancelProcessing = () => {
    setIsLoading(false)
    setProgress(0)
    setCurrentFile('')
    setFilesProcessed(0)
    setTotalFiles(0)
  }

  const processFile = async (
    file: File,
    index: number,
    totalFiles: number,
    results: {
      allFiles: Record<string, string>
      fileStructure: ProjectStructure
      processedCount: number
      securityExcludedCount: number
    }
  ) => {
    const filePath = getFilePath(file)
    
    // Update progress
    updateProgress(index, totalFiles, filePath)
    
    try {
      const fileContent = await readFileContent(file)
      
      // Security check
      if (!passesSecurityCheck(filePath, fileContent)) {
        results.securityExcludedCount++
        return
      }
      
      // Process valid file
      await addFileToResults(file, filePath, fileContent, results)
      results.processedCount++
      
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err)
    }
  }

  const getFilePath = (file: File): string => {
    return (file as any).webkitRelativePath || file.name
  }

  const updateProgress = (index: number, total: number, filePath: string) => {
    const progressPercent = 10 + ((index / total) * 85)
    setProgress(progressPercent)
    setCurrentFile(getFileName(filePath))
  }

  const getFileName = (path: string): string => {
    return path.split('/').pop() || ''
  }

  const passesSecurityCheck = (path: string, content: string): boolean => {
    const securityCheck = performSecurityCheck(path, content)
    return securityCheck.errors.length === 0
  }

  const addFileToResults = async (
    file: File,
    filePath: string,
    fileContent: string,
    results: {
      allFiles: Record<string, string>
      fileStructure: ProjectStructure
      processedCount: number
      securityExcludedCount: number
    }
  ) => {
    // Analyze file
    const analysis = analyzeFileContent(file, fileContent)
    
    // Store content
    results.allFiles[filePath] = fileContent
    
    // Create file data with proper type
    const fileData: FileData = createFileData(file, filePath, fileContent, analysis)
    
    // Add to structure
    const directory = getDirectory(filePath)
    if (!results.fileStructure[directory]) {
      results.fileStructure[directory] = []
    }
    results.fileStructure[directory].push(fileData)
  }

  const createFileData = (
    file: File,
    path: string,
    content: string,
    analysis: any
  ): FileData => {
    return {
      name: getFileName(path),
      path: path,
      size: file.size || 0,
      content: content,
      analysis: analysis
    }
  }

  const getDirectory = (path: string): string => {
    const parts = path.split('/')
    return parts.length > 1 ? parts.slice(0, -1).join('/') : '/'
  }

  const yieldToMain = (): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 0))
  }

  const finalizeProcessing = (results: {
    allFiles: Record<string, string>
    fileStructure: ProjectStructure
    processedCount: number
    securityExcludedCount: number
  }) => {
    setSecurityExcluded(results.securityExcludedCount)
    setIsLoading(false)
    setProgress(100)
    setCurrentFile('')
    
    if (results.processedCount > 0) {
      onFilesProcessed(results.allFiles, results.fileStructure)
    }
    
    // Reset state
    setFilesProcessed(0)
    setTotalFiles(0)
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Show security modal before processing
      setPendingFiles(files)
      setShowSecurityModal(true)
    }
  }

  const cancelUpload = () => {
    setCancelled(true)
    setIsLoading(false)
    setProgress(0)
    setCurrentFile('')
    setFilesProcessed(0)
    setTotalFiles(0)
  }

  const handleSecurityModalContinue = () => {
    setShowSecurityModal(false)
    if (pendingFiles.length > 0) {
      processFiles(pendingFiles)
    }
  }

  const handleSecurityModalCancel = () => {
    setShowSecurityModal(false)
    setPendingFiles([])
  }

  return (
    <div>
      {/* Security Check Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Shield className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Security Filter Active</h3>
                <p className="text-gray-600 text-sm mt-1">
                  We'll automatically exclude sensitive data and skip common folders like node_modules.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Auto-skipped folders:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  node_modules (package dependencies)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  .git, .next, dist, build folders
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  API keys and .env files
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  Other sensitive configuration files
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSecurityModalCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSecurityModalContinue}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload Area */}
      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-3 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging ? 'border-purple-500 bg-purple-50 scale-105' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'}
          ${isLoading ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        {!isLoading ? (
          <>
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <div className="text-xl font-semibold text-gray-700 mb-2">
              Drag & Drop Project Folder Here
            </div>
            <div className="text-gray-500 mb-6">
              or <span className="text-purple-600 font-semibold">Click to Select Project Folder</span>
            </div>
            
            {/* File Processing Info */}
            <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start gap-2">
                <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                <div className="text-left">
                  <div className="font-medium text-blue-900 text-sm mb-1">Smart Processing</div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>✓ Auto-skips node_modules & build folders</div>
                    <div>✓ Processes only code files</div>
                    <div>✓ Max {FILE_LIMITS.maxFiles} files, {FILE_LIMITS.maxTotalSize}MB total</div>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      Supported: {FILE_LIMITS.supportedExtensions.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto" />
            <div className="text-lg font-medium text-gray-700">
              {progress < 10 ? 'Scanning folders...' : 'Processing files...'}
            </div>
            {currentFile && (
              <div className="text-sm text-gray-500">
                Current: {currentFile}
                {filesProcessed > 0 && totalFiles > 0 && (
                  <span className="ml-2">({filesProcessed}/{totalFiles})</span>
                )}
              </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              onClick={cancelUpload}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <X size={16} />
              Cancel Upload
            </button>
          </div>
        )}
      </div>

      {/* Skipped Folders Notice */}
      {skippedFolders.size > 0 && !isLoading && (
        <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Info className="text-blue-600" size={18} />
            <span className="text-sm text-blue-800">
              Skipped folders: {Array.from(skippedFolders).join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Security Excluded Files Notice */}
      {securityExcluded > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-300 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-orange-600" size={18} />
            <span className="text-sm text-orange-800">
              {securityExcluded} files with sensitive data were excluded for security
            </span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        // @ts-ignore
        webkitdirectory=""
        onChange={handleFileSelect}
        className="hidden"
        accept=".ts,.tsx,.js,.jsx"
      />
    </div>
  )
}