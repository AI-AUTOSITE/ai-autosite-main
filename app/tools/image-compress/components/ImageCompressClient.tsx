'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Download, X, AlertCircle, Smartphone } from 'lucide-react'
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
  error?: string
  progress?: number
}

export default function ImageCompressClient() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Device detection on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile-specific limits
  const MAX_FILE_SIZE = isMobile ? 10 * 1024 * 1024 : 20 * 1024 * 1024 // 10MB mobile, 20MB desktop
  const MAX_FILES = isMobile ? 5 : 20 // 5 images mobile, 20 desktop
  const MAX_DIMENSION = isMobile ? 1920 : 2048 // Lower resolution for mobile

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
        maxSizeMB: isMobile ? 5 : 10,
        maxWidthOrHeight: MAX_DIMENSION,
        useWebWorker: true,
        quality: 0.8,
        onProgress: (progress: number) => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId ? { ...img, progress: Math.round(progress) } : img
            )
          )
        },
      }

      const compressedFile = await imageCompression(file, options)

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                compressedFile,
                compressedSize: compressedFile.size,
                status: 'done',
                progress: 100,
              }
            : img
        )
      )
    } catch (error) {
      console.error('Compression failed:', error)
      const errorMsg = error instanceof Error ? error.message : 'Compression failed'

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                status: 'error',
                error: errorMsg,
              }
            : img
        )
      )
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    setErrorMessage('')

    // Check total number of images
    const currentCount = images.length
    const newCount = files.length

    if (currentCount + newCount > MAX_FILES) {
      setErrorMessage(
        `Maximum ${MAX_FILES} images allowed${isMobile ? ' on mobile' : ''}. Please remove some images first.`
      )
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Not an image file`)
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024)
        errors.push(
          `${file.name}: File too large (max ${maxSizeMB}MB${isMobile ? ' on mobile' : ''})`
        )
        return
      }

      if (file.size === 0) {
        errors.push(`${file.name}: Empty file`)
        return
      }

      validFiles.push(file)
    })

    // Show errors if any
    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'))
    }

    if (validFiles.length === 0) return

    const newImages: CompressedImage[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      originalFile: file,
      originalSize: file.size,
      compressedFile: null,
      compressedSize: 0,
      status: 'processing',
      url: URL.createObjectURL(file),
      progress: 0,
    }))

    setImages((prev) => [...prev, ...newImages])

    // Start compression
    newImages.forEach((img) => {
      compressImage(img.originalFile, img.id)
    })
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [images.length, isMobile]
  )

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
    const compressedImages = images.filter((img) => img.compressedFile && img.status === 'done')
    compressedImages.forEach((img, index) => {
      setTimeout(() => downloadImage(img), index * 100)
    })
  }

  const removeImage = (id: string) => {
    const image = images.find((img) => img.id === id)
    if (image) {
      URL.revokeObjectURL(image.url)
    }
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url))
    setImages([])
    setErrorMessage('')
  }

  const retryFailed = () => {
    const failedImages = images.filter((img) => img.status === 'error')
    failedImages.forEach((img) => {
      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id ? { ...i, status: 'processing', error: undefined, progress: 0 } : i
        )
      )
      compressImage(img.originalFile, img.id)
    })
  }

  const totalSaved = images.reduce((acc, img) => {
    if (img.status === 'done') {
      return acc + (img.originalSize - img.compressedSize)
    }
    return acc
  }, 0)

  const processingCount = images.filter((img) => img.status === 'processing').length
  const doneCount = images.filter((img) => img.status === 'done').length
  const errorCount = images.filter((img) => img.status === 'error').length

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Mobile indicator */}
      {isMobile && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
          <Smartphone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Mobile Mode Active</p>
            <p className="text-blue-400/70 text-xs mt-1">
              Limits: {MAX_FILES} images max, {MAX_FILE_SIZE / (1024 * 1024)}MB per file
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-300 font-medium mb-1">Upload Error</p>
            <p className="text-red-400/80 text-sm whitespace-pre-line">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Drop Zone */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isMobile ? 'cursor-default' : 'cursor-pointer'
          } ${
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
            {isMobile ? 'Tap to select images' : 'Drop your images here or click to browse'}
          </p>
          <p className="text-gray-400 text-xs">
            {isMobile
              ? `Up to ${MAX_FILES} images • Max ${MAX_FILE_SIZE / (1024 * 1024)}MB each`
              : `Up to ${MAX_FILES} images • Max ${MAX_FILE_SIZE / (1024 * 1024)}MB each`}
          </p>

          {images.length > 0 && (
            <p className="text-gray-500 text-xs mt-2">
              {images.length} / {MAX_FILES} images uploaded
            </p>
          )}
        </div>

        {/* Status bar */}
        {images.length > 0 && (
          <div className="mt-4 p-3 bg-black/20 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              {processingCount > 0 && (
                <span className="text-cyan-400">⚙️ Processing: {processingCount}</span>
              )}
              {doneCount > 0 && <span className="text-green-400">✓ Done: {doneCount}</span>}
              {errorCount > 0 && <span className="text-red-400">✗ Failed: {errorCount}</span>}
            </div>

            {errorCount > 0 && (
              <button
                onClick={retryFailed}
                className="text-red-400 hover:text-red-300 underline text-xs"
              >
                Retry Failed
              </button>
            )}
          </div>
        )}

        {/* Image List */}
        {images.length > 0 && (
          <>
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {images.map((image) => (
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
                      <p className="text-white text-sm truncate">{image.name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">{formatFileSize(image.originalSize)}</span>
                        {image.status === 'done' && (
                          <>
                            <span className="text-gray-500">→</span>
                            <span className="text-green-400 font-medium">
                              {formatFileSize(image.compressedSize)}
                            </span>
                            <span className="text-green-400">
                              -{Math.round((1 - image.compressedSize / image.originalSize) * 100)}%
                            </span>
                          </>
                        )}
                        {image.status === 'processing' && (
                          <>
                            <span className="text-cyan-400">Compressing...</span>
                            {image.progress !== undefined && (
                              <span className="text-cyan-400">{image.progress}%</span>
                            )}
                          </>
                        )}
                        {image.status === 'error' && (
                          <span className="text-red-400 truncate">
                            Error: {image.error || 'Failed'}
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {image.status === 'processing' && image.progress !== undefined && (
                        <div className="mt-1.5 w-full bg-gray-700/50 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${image.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {image.status === 'done' && (
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        aria-label="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      aria-label="Remove image"
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
                  Total saved:{' '}
                  <span className="text-green-400 font-medium">{formatFileSize(totalSaved)}</span>
                </p>
              )}

              <div className="flex gap-2">
                {doneCount > 0 && (
                  <button
                    onClick={downloadAll}
                    className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                             rounded-lg font-medium hover:opacity-90 transition-all flex items-center 
                             justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download All ({doneCount})
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

      {/* Tips */}
      <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
        <p>💡 Smart compression • Keeps quality • Works offline</p>
        {isMobile && <p className="text-blue-400/60">📱 Optimized for mobile devices</p>}
      </div>
    </div>
  )
}
