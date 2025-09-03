'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, AlertCircle, X } from 'lucide-react'
import { FileStructure } from '../lib/types'
import { IGNORED_FOLDERS, ALLOWED_EXTENSIONS, performSecurityCheck } from '../lib/constants'
import { analyzeFileContent } from '../lib/utils'

interface FileUploaderProps {
  onFilesProcessed: (files: Record<string, string>, structure: FileStructure) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function FileUploader({ onFilesProcessed, isLoading, setIsLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [securityExcluded, setSecurityExcluded] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cancelled, setCancelled] = useState(false)

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
      await processFiles(files)
    }
  }

  const traverseFileTree = async (entry: any, filesList: File[]): Promise<void> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file((file: File) => {
          if (isAllowedFile(file.name)) {
            filesList.push(file)
          }
          resolve()
        })
      })
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader()
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries: any[]) => {
          for (const subEntry of entries) {
            await traverseFileTree(subEntry, filesList)
          }
          resolve()
        })
      })
    }
  }

  const isAllowedFile = (filename: string): boolean => {
    const name = filename.toLowerCase()
    const nameOnly = name.split('/').pop() || ''
    
    if (nameOnly.startsWith('.env') && !nameOnly.includes('.example')) {
      return false
    }
    
    if (['dockerfile', '.gitignore', '.dockerignore', '.prettierrc', '.eslintrc'].includes(nameOnly)) {
      return true
    }
    
    return ALLOWED_EXTENSIONS.some(ext => name.endsWith(ext))
  }

  const shouldIgnorePath = (path: string): boolean => {
    const parts = path.split('/')
    return parts.some(part => IGNORED_FOLDERS.includes(part))
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
    setCancelled(false)
    setIsLoading(true)
    setProgress(5)
    setCurrentFile('Scanning for security...')
    
    const allFiles: Record<string, string> = {}
    const fileStructure: FileStructure = {}
    let processedCount = 0
    let securityExcludedCount = 0
    
    for (let i = 0; i < files.length; i++) {
      if (cancelled) {
        setIsLoading(false)
        return
      }
      
      const file = files[i]
      const path = (file as any).webkitRelativePath || file.name
      const progressPercent = 15 + ((i / files.length) * 60)
      
      setProgress(progressPercent)
      setCurrentFile(path.split('/').pop() || '')
      
      if (shouldIgnorePath(path) || !isAllowedFile(file.name)) {
        continue
      }
      
      try {
        const content = await readFileContent(file)
        const securityCheck = performSecurityCheck(path, content)
        
        if (securityCheck.errors.length > 0) {
          securityExcludedCount++
          continue
        }
        
        const analysis = analyzeFileContent(file, content)
        allFiles[path] = content
        
        const parts = path.split('/')
        const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '/'
        
        if (!fileStructure[dir]) fileStructure[dir] = []
        fileStructure[dir].push({
          name: parts[parts.length - 1],
          path: path,
          size: file.size || 0,
          analysis: analysis
        })
        
        processedCount++
      } catch (err) {
        console.error(`Error reading ${path}:`, err)
      }
      
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1))
      }
    }
    
    setSecurityExcluded(securityExcludedCount)
    setIsLoading(false)
    setProgress(100)
    
    if (processedCount > 0) {
      onFilesProcessed(allFiles, fileStructure)
    }
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      await processFiles(files)
    }
  }

  const cancelUpload = () => {
    setCancelled(true)
    setIsLoading(false)
    setProgress(0)
    setCurrentFile('')
  }

  return (
    <div>
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
          <div>
            <div className="font-semibold text-yellow-900">Security Filter Active</div>
            <div className="text-sm text-yellow-700">
              Files containing sensitive data (API keys, passwords, etc.) will be automatically excluded before upload for your security.
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-3 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
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
            <div className="text-gray-500">
              or <span className="text-purple-600 font-semibold">Click to Select Project Folder</span>
              <br />
              <span className="text-sm">(Only safe code files will be processed)</span>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto" />
            <div className="text-lg font-medium text-gray-700">
              {progress < 10 ? 'Scanning for security...' : `Processing files... ${Math.round(progress)}%`}
            </div>
            {currentFile && (
              <div className="text-sm text-gray-500">Current: {currentFile}</div>
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

      {securityExcluded > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-300 rounded-lg p-3">
          <div className="text-sm text-orange-800">
            {securityExcluded} files with sensitive data were excluded for security
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