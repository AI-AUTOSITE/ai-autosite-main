// app/tools/code-dependency-visualizer/components/FileUpload.tsx

'use client'

import { useState, useRef, DragEvent, useEffect } from 'react'
import { Upload, Folder, AlertCircle, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void
  isProcessing: boolean
}

export default function FileUpload({ onFilesSelect, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>('')
  const [isWaitingForFiles, setIsWaitingForFiles] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  // Add global cursor style when waiting
  useEffect(() => {
    if (isWaitingForFiles) {
      document.body.style.cursor = 'wait'
      return () => {
        document.body.style.cursor = ''
      }
    }
  }, [isWaitingForFiles])

  const handleButtonClick = (type: 'file' | 'folder') => {
    setError('')
    setIsWaitingForFiles(true)

    // Trigger file input
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
    setIsWaitingForFiles(true)

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
    } else {
      setIsWaitingForFiles(false)
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
    } else {
      setIsWaitingForFiles(false)
    }
  }

  // Reset when dialog is cancelled
  const handleInputClick = () => {
    // User cancelled if no files selected after a delay
    setTimeout(() => {
      if (
        fileInputRef.current?.files?.length === 0 &&
        folderInputRef.current?.files?.length === 0
      ) {
        setIsWaitingForFiles(false)
      }
    }, 100)
  }

  const isLoading = isProcessing || isWaitingForFiles

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
          ${
            isDragging
              ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02]'
              : 'border-white/20 bg-white/5 hover:border-cyan-400/50'
          }
          ${isLoading ? 'opacity-50' : ''}
        `}
        style={{ cursor: isWaitingForFiles ? 'wait' : 'default' }}
      >
        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".ts,.tsx,.js,.jsx,.json,.css,.md"
          onChange={handleFileInput}
          onClick={handleInputClick}
          disabled={isLoading}
          className="hidden"
        />

        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          multiple
          onChange={handleFileInput}
          onClick={handleInputClick}
          disabled={isLoading}
          className="hidden"
        />

        <div className="text-center">
          {isLoading ? (
            <>
              <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium">
                {isWaitingForFiles ? 'Preparing files...' : 'Processing files...'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {isWaitingForFiles
                  ? 'This may take a few seconds for large folders'
                  : 'Please wait'}
              </p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Drop files or folder here</p>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleButtonClick('file')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg 
                           hover:bg-cyan-500/30 transition-colors flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-wait"
                >
                  <Upload className="w-4 h-4" />
                  Select Files
                </button>

                <button
                  onClick={() => handleButtonClick('folder')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg 
                           hover:bg-purple-500/30 transition-colors flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-wait"
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
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
            <div>
              <p className="text-sm text-red-400">{error}</p>
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
