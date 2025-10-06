// app/tools/pc-optimizer/components/FileUploader.tsx

import React, { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'

interface FileUploaderProps {
  onFileUpload: (content: string) => void
  isAnalyzing: boolean
}

export default function FileUploader({ onFileUpload, isAnalyzing }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFile = (file: File) => {
    setError('')

    if (!file.name.endsWith('.csv')) {
      setError('CSV files only')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Max 10MB')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onFileUpload(content)
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsText(file, 'UTF-8')
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer
        ${
          isDragging
            ? 'border-cyan-500 bg-cyan-500/10'
            : 'border-gray-600 hover:border-cyan-400 hover:bg-white/5'
        }
        ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isAnalyzing}
      />

      <div className="space-y-4">
        {isAnalyzing ? (
          <>
            <div className="mx-auto w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-300">Analyzing...</p>
          </>
        ) : (
          <>
            <Upload className="mx-auto w-16 h-16 text-gray-500" />
            <div>
              <p className="text-2xl font-medium text-gray-300">Drop CSV file here</p>
              <p className="text-sm text-gray-500 mt-2">or click to select</p>
              <p className="text-xs text-gray-600 mt-4">Get CSV from PowerShell script</p>
            </div>
          </>
        )}

        {fileName && !isAnalyzing && (
          <div className="flex items-center justify-center space-x-2 text-sm text-green-400">
            <FileText className="w-4 h-4" />
            <span>{fileName}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center space-x-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
