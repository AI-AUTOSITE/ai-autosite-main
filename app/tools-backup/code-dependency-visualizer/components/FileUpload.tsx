// app/tools/code-dependency-visualizer/components/FileUpload.tsx

'use client'

import { useState, useRef, DragEvent } from 'react'
import { Upload, Folder, AlertCircle, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void
  isProcessing: boolean
}

export default function FileUpload({ onFilesSelect, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError('')
    
    const items = Array.from(e.dataTransfer.items)
    const files: File[] = []
    
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry) {
          await processEntry(entry, files)
        }
      }
    }
    
    if (files.length > 0) {
      onFilesSelect(files)
    }
  }
  
  const processEntry = async (entry: any, files: File[], path = ''): Promise<void> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file((file: File) => {
          // Create file with relative path
          const fileWithPath = new File([file], path + file.name, {
            type: file.type,
            lastModified: file.lastModified
          })
          Object.defineProperty(fileWithPath, 'webkitRelativePath', {
            value: path + file.name
          })
          files.push(fileWithPath)
          resolve()
        })
      })
    } else if (entry.isDirectory) {
      const reader = entry.createReader()
      const entries = await new Promise<any[]>((resolve) => {
        reader.readEntries((entries: any[]) => resolve(entries))
      })
      
      for (const childEntry of entries) {
        await processEntry(childEntry, files, path + entry.name + '/')
      }
    }
  }
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelect(files)
      setError('')
    }
  }
  
  const validateFiles = (files: File[]): boolean => {
    const MAX_SIZE = 100 * 1024 * 1024 // 100MB total
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    
    if (totalSize > MAX_SIZE) {
      setError(`Total size exceeds 100MB. Your files: ${(totalSize / 1024 / 1024).toFixed(1)}MB`)
      return false
    }
    
    if (files.length > 1000) {
      setError(`Too many files. Maximum: 1000, Your files: ${files.length}`)
      return false
    }
    
    return true
  }
  
  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative p-8 border-2 border-dashed rounded-xl transition-all duration-200
          ${isDragging ? 
            'border-cyan-400 bg-cyan-400/10 scale-[1.02]' : 
            'border-white/20 bg-white/5 hover:border-cyan-400/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".ts,.tsx,.js,.jsx,.json,.css,.md"
          onChange={handleFileInput}
          disabled={isProcessing}
          className="hidden"
        />
        
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore - webkitdirectory is not in the type definition
          webkitdirectory=""
          multiple
          onChange={handleFileInput}
          disabled={isProcessing}
          className="hidden"
        />
        
        <div className="text-center">
          {isProcessing ? (
            <>
              <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium">Processing files...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                Drop files or folder here
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Supports: TS, TSX, JS, JSX, JSON, CSS, MD
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg 
                           hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Select Files
                </button>
                
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg 
                           hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                >
                  <Folder className="w-4 h-4" />
                  Select Folder
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Limits Info */}
      <div className="flex justify-center gap-6 text-sm text-gray-400">
        <span>• Max total size: 100MB</span>
        <span>• Max files: 1000</span>
        <span>• Auto-skips: node_modules, .git</span>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}