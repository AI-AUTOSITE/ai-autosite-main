// app/tools/code-dependency-visualizer/components/FileUpload.tsx
// Mobile optimized with flickering fix

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

  const handleButtonClick = (type: 'file' | 'folder') => {
    setError('')
    // ✅ Remove immediate loading state - let file selection trigger it
    if (type === 'file') {
      fileInputRef.current?.click()
    } else {
      folderInputRef.current?.click()
    }
  }

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
          const fileWithPath = new File([file], path + file.name, {
            type: file.type,
            lastModified: file.lastModified,
          })
          Object.defineProperty(fileWithPath, 'webkitRelativePath', {
            value: path + file.name,
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
    setError('')
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelect(files)
    }
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
          relative p-6 sm:p-8 border-2 border-dashed rounded-xl transition-all duration-200
          ${
            isDragging
              ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02]'
              : 'border-white/20 bg-white/5 hover:border-cyan-400/50'
          }
          ${isProcessing ? 'opacity-50' : ''}
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
          // @ts-ignore
          webkitdirectory=""
          multiple
          onChange={handleFileInput}
          disabled={isProcessing}
          className="hidden"
        />

        <div className="text-center">
          {isProcessing ? (
            <>
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium text-sm sm:text-base">Processing files...</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">Please wait</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-3 text-sm sm:text-base">
                Drop files or folder here
              </p>

              {/* Mobile Warning */}
              <div className="sm:hidden bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2 mb-3">
                <p className="text-yellow-300 text-xs">
                  Recommended: Max 50 files, 10MB total
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleButtonClick('file')}
                  disabled={isProcessing}
                  className="px-4 py-3 min-h-[48px] bg-cyan-500/20 text-cyan-400 rounded-lg 
                           hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Select Files
                </button>

                <button
                  onClick={() => handleButtonClick('folder')}
                  disabled={isProcessing}
                  className="px-4 py-3 min-h-[48px] bg-purple-500/20 text-purple-400 rounded-lg 
                           hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Folder className="w-4 h-4 sm:w-5 sm:h-5" />
                  Select Folder
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Limits Info */}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-400 text-center">
        <span>Max total size: 100MB</span>
        <span className="hidden sm:inline">•</span>
        <span>Max files: 1000</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm text-red-400">{error}</p>
              <p className="text-xs text-red-400/70 mt-1">
                Supported formats: TS, TSX, JS, JSX, JSON, CSS, MD
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}