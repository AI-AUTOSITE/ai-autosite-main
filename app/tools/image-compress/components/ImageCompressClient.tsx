'use client'

import { useState, useCallback } from 'react'
import { Upload, Download, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface CompressedImage {
  id: string
  name: string
  originalFile: File
  originalSize: number
  compressedFile: File | null
  compressedSize: number
  status: 'processing' | 'done' | 'error'
  url: string
}

export default function ImageCompressClient() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const compressImage = async (file: File, imageId: string) => {
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        quality: 0.8,
      }

      const compressedFile = await imageCompression(file, options)
      
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? {
              ...img,
              compressedFile,
              compressedSize: compressedFile.size,
              status: 'done'
            }
          : img
      ))
    } catch (error) {
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, status: 'error' }
          : img
      ))
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 20 * 1024 * 1024
      return isImage && isValidSize
    })

    const newImages: CompressedImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      originalFile: file,
      originalSize: file.size,
      compressedFile: null,
      compressedSize: 0,
      status: 'processing',
      url: URL.createObjectURL(file)
    }))

    setImages(prev => [...prev, ...newImages])

    // Start compression
    newImages.forEach(img => {
      compressImage(img.originalFile, img.id)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const downloadImage = (image: CompressedImage) => {
    if (!image.compressedFile) return
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(image.compressedFile)
    link.download = `compressed-${image.name}`
    link.click()
  }

  const downloadAll = () => {
    const compressedImages = images.filter(img => img.compressedFile && img.status === 'done')
    compressedImages.forEach((img, index) => {
      setTimeout(() => downloadImage(img), index * 100)
    })
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const clearAll = () => {
    setImages([])
  }

  const totalSaved = images.reduce((acc, img) => {
    if (img.status === 'done') {
      return acc + (img.originalSize - img.compressedSize)
    }
    return acc
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
     {/* Main Drop Zone */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-green-400 bg-green-400/10 scale-[1.02]'
              : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">
            Drop your images here!
          </p>
          <p className="text-gray-400 text-xs">
            Up to 20 images • Max 20MB each
          </p>
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <>
            <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
              {images.map(image => (
                <div
                  key={image.id}
                  className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm truncate">
                        {image.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">
                          {formatFileSize(image.originalSize)}
                        </span>
                        {image.status === 'done' && (
                          <>
                            <span className="text-gray-500">→</span>
                            <span className="text-green-400 font-medium">
                              {formatFileSize(image.compressedSize)}
                            </span>
                            <span className="text-green-400">
                              -{ Math.round((1 - image.compressedSize / image.originalSize) * 100)}%
                            </span>
                          </>
                        )}
                        {image.status === 'processing' && (
                          <span className="text-cyan-400">Compressing...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {image.status === 'done' && (
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary & Actions */}
            <div className="mt-4 pt-4 border-t border-white/10">
              {totalSaved > 0 && (
                <p className="text-center text-sm text-gray-400 mb-3">
                  Total saved: <span className="text-green-400 font-medium">{formatFileSize(totalSaved)}</span>
                </p>
              )}
              
              <div className="flex gap-2">
                {images.some(img => img.status === 'done') && (
                  <button
                    onClick={downloadAll}
                    className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                             rounded-lg font-medium hover:opacity-90 transition-all flex items-center 
                             justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download All
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="px-4 py-2.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                           hover:text-white transition-all text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 Smart compression • Keeps quality • Works offline
      </p>
    </div>
  )
}