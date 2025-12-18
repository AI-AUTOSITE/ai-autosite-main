// app/tools/voice-transcription/components/FileUploader.tsx
'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Upload, FileAudio, X, Loader2 } from 'lucide-react'
import { SUPPORTED_FORMATS, validateAudioFile, formatFileSize } from '../lib/audio-utils'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClear: () => void
  disabled?: boolean
  isMobile?: boolean
  isTablet?: boolean
  isModelLoading?: boolean
  modelLoadingProgress?: number
}

export default function FileUploader({
  onFileSelect,
  selectedFile,
  onClear,
  disabled = false,
  isMobile = false,
  isTablet = false,
  isModelLoading = false,
  modelLoadingProgress = 0,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate max file size based on device
  const maxFileSizeMB = isMobile ? 50 : isTablet ? 100 : 500

  const handleFileSelect = useCallback((file: File) => {
    setError(null)
    const validationError = validateAudioFile(file, isMobile || isTablet)
    
    if (validationError) {
      setError(validationError)
      return
    }
    
    onFileSelect(file)
  }, [onFileSelect, isMobile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isModelLoading) {
      setIsDragging(true)
    }
  }, [disabled, isModelLoading])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled || isModelLoading) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [disabled, isModelLoading, handleFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleClick = useCallback(() => {
    if (!disabled && !isModelLoading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled, isModelLoading])

  if (selectedFile) {
    return (
      <div className="p-4 bg-gray-700/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <FileAudio className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-gray-400 text-sm">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            disabled={disabled}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    )
  }

  // Model Loading State
  if (isModelLoading) {
    return (
      <div className="space-y-3">
        <div className="relative p-8 border-2 border-dashed border-cyan-500/50 rounded-xl bg-cyan-500/5">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-cyan-500/20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Loading AI Model...</p>
              <p className="text-gray-400 text-sm mt-1">
                Please wait while the transcription model loads
              </p>
              {modelLoadingProgress > 0 && (
                <p className="text-cyan-400 text-sm mt-2">
                  {modelLoadingProgress}%
                </p>
              )}
            </div>
            {/* Progress bar */}
            <div className="w-full max-w-xs h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${modelLoadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative p-8 border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-500/10' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_FORMATS.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`} />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">
              {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              MP3, WAV, M4A, MP4, WebM • Max {maxFileSizeMB}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  )
}
