'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, CheckCircle, Lock, Sparkles, Smartphone } from 'lucide-react'
import { formatFileSize } from '../constants'

interface UploadAreaProps {
  maxFileSize: number
  isTouchDevice: boolean
  onFileSelect: (file: File) => void
}

export function UploadArea({ maxFileSize, isTouchDevice, onFileSelect }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }, [onFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }, [onFileSelect])

  return (
    <>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative min-h-[200px] md:min-h-[320px] p-6 md:p-12
          border-2 border-dashed rounded-2xl
          flex flex-col items-center justify-center gap-3 md:gap-4
          cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-violet-500 bg-violet-500/10' 
            : 'border-gray-600 bg-gray-800/50 hover:border-violet-400 hover:bg-violet-500/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg,image/heic,image/heif,.heic,.heif"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className={`p-3 md:p-4 rounded-full transition-colors ${isDragging ? 'bg-violet-500/20' : 'bg-gray-700'}`}>
          <Upload className={`w-8 h-8 md:w-12 md:h-12 transition-colors ${isDragging ? 'text-violet-400' : 'text-gray-400'}`} />
        </div>

        <div className="text-center">
          <p className="text-base md:text-lg font-semibold text-white">
            {isTouchDevice ? 'Tap to choose image' : 'Drop your image here'}
          </p>
          <p className="text-gray-400 text-sm">{isTouchDevice ? 'or take a photo' : 'or click to choose'}</p>
        </div>

        <p className="text-xs md:text-sm text-gray-500">PNG, JPG, WebP, HEIC • Max {formatFileSize(maxFileSize)}</p>
      </div>

      <div className="flex items-start gap-3 p-3 md:p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
        <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm text-gray-300">
          <strong className="text-white">Works with any image!</strong> People, animals, products, and more.
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
        <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" />100% Free</span>
        <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" />No signup</span>
        <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-green-500" />Private</span>
      </div>

      {isTouchDevice && (
        <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <Smartphone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-300">
            <strong className="text-white">Mobile tip:</strong> Use WiFi for faster model loading. Processing happens on your device.
          </div>
        </div>
      )}
    </>
  )
}
