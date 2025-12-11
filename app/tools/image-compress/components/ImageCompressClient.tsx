'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Upload, Download, X, AlertCircle, Lock, Settings, Eye, Archive, Trash2, RotateCcw, CheckCircle } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface CompressedImage {
  id: string
  name: string
  originalFile: File
  originalSize: number
  compressedFile: File | null
  compressedSize: number
  status: 'processing' | 'done' | 'error'
  originalUrl: string
  compressedUrl: string
  error?: string
  progress?: number
}

type OutputFormat = 'original' | 'webp' | 'jpeg' | 'png'

export default function ImageCompressClient() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  // Settings
  const [quality, setQuality] = useState(80)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original')
  const [removeExif, setRemoveExif] = useState(true)
  const [maxDimension, setMaxDimension] = useState(2048)
  const [showSettings, setShowSettings] = useState(false)
  
  // Before/After comparison
  const [compareImage, setCompareImage] = useState<CompressedImage | null>(null)
  const [comparePosition, setComparePosition] = useState(50)
  const compareRef = useRef<HTMLDivElement>(null)

  // Device detection
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

  const MAX_FILE_SIZE = isMobile ? 10 * 1024 * 1024 : 50 * 1024 * 1024
  const MAX_FILES = isMobile ? 10 : 30
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  const getOutputMimeType = (format: OutputFormat, originalType: string): string => {
    switch (format) {
      case 'webp': return 'image/webp'
      case 'jpeg': return 'image/jpeg'
      case 'png': return 'image/png'
      default: return originalType
    }
  }

  const getOutputExtension = (format: OutputFormat, originalName: string): string => {
    const baseName = originalName.replace(/\.[^/.]+$/, '')
    switch (format) {
      case 'webp': return `${baseName}.webp`
      case 'jpeg': return `${baseName}.jpg`
      case 'png': return `${baseName}.png`
      default: return originalName
    }
  }

  const compressImage = async (file: File, imageId: string) => {
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: maxDimension,
        useWebWorker: true,
        initialQuality: quality / 100,
        fileType: outputFormat === 'original' ? undefined : getOutputMimeType(outputFormat, file.type),
        preserveExif: !removeExif,
        onProgress: (progress: number) => {
          setImages(prev => prev.map(img => 
            img.id === imageId ? { ...img, progress: Math.round(progress) } : img
          ))
        }
      }

      const compressedFile = await imageCompression(file, options)
      const compressedUrl = URL.createObjectURL(compressedFile)
      
      // Rename file if format changed
      const newName = getOutputExtension(outputFormat, file.name)
      const renamedFile = new File([compressedFile], newName, { type: compressedFile.type })
      
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? {
              ...img,
              compressedFile: renamedFile,
              compressedSize: renamedFile.size,
              compressedUrl,
              status: 'done',
              progress: 100
            }
          : img
      ))
    } catch (error) {
      console.error('Compression failed:', error)
      const errorMsg = error instanceof Error ? error.message : 'Compression failed'
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, status: 'error', error: errorMsg } : img
      ))
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    setErrorMessage('')

    const currentCount = images.length
    const newCount = files.length
    
    if (currentCount + newCount > MAX_FILES) {
      setErrorMessage(`Maximum ${MAX_FILES} images allowed. Please remove some images first.`)
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Not an image file`)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
        return
      }
      if (file.size === 0) {
        errors.push(`${file.name}: Empty file`)
        return
      }
      validFiles.push(file)
    })

    if (errors.length > 0) setErrorMessage(errors.join('\n'))
    if (validFiles.length === 0) return

    const newImages: CompressedImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      originalFile: file,
      originalSize: file.size,
      compressedFile: null,
      compressedSize: 0,
      status: 'processing',
      originalUrl: URL.createObjectURL(file),
      compressedUrl: '',
      progress: 0
    }))

    setImages(prev => [...prev, ...newImages])
    newImages.forEach(img => compressImage(img.originalFile, img.id))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [images.length, quality, outputFormat, maxDimension, removeExif])

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
    link.href = image.compressedUrl
    link.download = `compressed-${image.compressedFile.name}`
    link.click()
  }

  const downloadAllAsZip = async () => {
    const completedImages = images.filter(img => img.compressedFile && img.status === 'done')
    if (completedImages.length === 0) return

    // Dynamic import JSZip
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    completedImages.forEach(img => {
      if (img.compressedFile) {
        zip.file(`compressed-${img.compressedFile.name}`, img.compressedFile)
      }
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `compressed-images-${Date.now()}.zip`
    link.click()
  }

  const removeImage = (id: string) => {
    const image = images.find(img => img.id === id)
    if (image) {
      URL.revokeObjectURL(image.originalUrl)
      if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl)
    }
    setImages(prev => prev.filter(img => img.id !== id))
    if (compareImage?.id === id) setCompareImage(null)
  }

  const clearAll = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalUrl)
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl)
    })
    setImages([])
    setErrorMessage('')
    setCompareImage(null)
  }

  const recompressAll = () => {
    images.forEach(img => {
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl)
      setImages(prev => prev.map(i => 
        i.id === img.id ? { ...i, status: 'processing', progress: 0, compressedFile: null, compressedUrl: '' } : i
      ))
      compressImage(img.originalFile, img.id)
    })
  }

  // Compare slider handler
  const handleCompareMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!compareRef.current) return
    const rect = compareRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setComparePosition(percentage)
  }

  const totalSaved = images.reduce((acc, img) => {
    if (img.status === 'done') return acc + (img.originalSize - img.compressedSize)
    return acc
  }, 0)

  const processingCount = images.filter(img => img.status === 'processing').length
  const doneCount = images.filter(img => img.status === 'done').length
  const errorCount = images.filter(img => img.status === 'error').length

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
        <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-green-300 font-medium">100% Private - Images Never Leave Your Device</p>
          <p className="text-green-400/70 text-xs mt-1">
            All compression happens in your browser • No upload • No server processing
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <Settings className="w-4 h-4" />
          <span>Compression Settings</span>
          <span className={`transition-transform ${showSettings ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {showSettings && (
          <div className="mt-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 space-y-4">
            {/* Quality Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-medium">Quality</label>
                <span className="text-cyan-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
                         [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 
                         [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className="text-white text-sm font-medium block mb-2">Output Format</label>
              <div className="grid grid-cols-4 gap-2">
                {(['original', 'webp', 'jpeg', 'png'] as OutputFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => setOutputFormat(format)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      outputFormat === format
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {format === 'original' ? 'Original' : format.toUpperCase()}
                  </button>
                ))}
              </div>
              {outputFormat === 'webp' && (
                <p className="text-xs text-green-400 mt-2">✓ WebP typically saves 25-35% more than JPEG</p>
              )}
            </div>

            {/* Max Dimension */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm font-medium">Max Dimension</label>
                <span className="text-cyan-400 font-bold">{maxDimension}px</span>
              </div>
              <input
                type="range"
                min="800"
                max="4096"
                step="256"
                value={maxDimension}
                onChange={(e) => setMaxDimension(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
                         [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 
                         [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* EXIF Toggle */}
            <button
              onClick={() => setRemoveExif(!removeExif)}
              className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                removeExif
                  ? 'bg-green-600/20 border-green-600/50 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-sm">Remove EXIF Data</div>
                <div className="text-xs opacity-70">Strip location, camera info, etc.</div>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors ${removeExif ? 'bg-green-500' : 'bg-white/20'}`}>
                <div className="w-5 h-5 rounded-full bg-white shadow mt-0.5" 
                  style={{ transform: removeExif ? 'translateX(18px)' : 'translateX(2px)' }} />
              </div>
            </button>

            {/* Recompress Button */}
            {images.length > 0 && (
              <button
                onClick={recompressAll}
                className="w-full py-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Apply new settings to all images
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <pre className="text-red-400 text-sm whitespace-pre-wrap">{errorMessage}</pre>
        </div>
      )}

      {/* Compare Modal */}
      {compareImage && compareImage.compressedUrl && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setCompareImage(null)}>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Before / After Comparison</h3>
              <button onClick={() => setCompareImage(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div 
              ref={compareRef}
              className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-ew-resize select-none"
              onMouseMove={handleCompareMove}
              onTouchMove={handleCompareMove}
            >
              {/* Original (background) */}
              <img 
                src={compareImage.originalUrl} 
                alt="Original" 
                className="absolute inset-0 w-full h-full object-contain"
              />
              
              {/* Compressed (clipped) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${comparePosition}%` }}
              >
                <img 
                  src={compareImage.compressedUrl} 
                  alt="Compressed" 
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ width: `${100 / (comparePosition / 100)}%`, maxWidth: 'none' }}
                />
              </div>
              
              {/* Slider line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${comparePosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-gray-800 text-xs font-bold">↔</span>
                </div>
              </div>
              
              {/* Labels */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                Compressed ({formatFileSize(compareImage.compressedSize)})
              </div>
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                Original ({formatFileSize(compareImage.originalSize)})
              </div>
            </div>
            
            <p className="text-center text-gray-400 text-sm mt-3">
              Drag the slider to compare • Saved {Math.round((1 - compareImage.compressedSize / compareImage.originalSize) * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        {/* Drop Zone */}
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
            {isMobile ? 'Tap to select images' : 'Drop your images here or click to browse'}
          </p>
          <p className="text-gray-400 text-xs">
            Up to {MAX_FILES} images • Max {MAX_FILE_SIZE / (1024 * 1024)}MB each • JPEG, PNG, WebP, GIF
          </p>
          
          {images.length > 0 && (
            <p className="text-gray-500 text-xs mt-2">
              {images.length} / {MAX_FILES} images uploaded
            </p>
          )}
        </div>

        {/* Status Bar */}
        {images.length > 0 && (
          <div className="mt-4 p-3 bg-black/20 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              {processingCount > 0 && <span className="text-cyan-400">⚙️ Working: {processingCount}</span>}
              {doneCount > 0 && <span className="text-green-400">✓ Ready: {doneCount}</span>}
              {errorCount > 0 && <span className="text-red-400">✗ Error: {errorCount}</span>}
            </div>
            {totalSaved > 0 && (
              <span className="text-green-400 font-medium">
                Saved: {formatFileSize(totalSaved)}
              </span>
            )}
          </div>
        )}

        {/* Image List */}
        {images.length > 0 && (
          <>
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {images.map(image => (
                <div key={image.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img 
                      src={image.originalUrl} 
                      alt={image.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm truncate mb-1">{image.name}</p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">{formatFileSize(image.originalSize)}</span>
                        {image.status === 'done' && (
                          <>
                            <span className="text-gray-500">→</span>
                            <span className="text-green-400 font-medium">{formatFileSize(image.compressedSize)}</span>
                            <span className="text-green-400 font-bold">
                              -{Math.round((1 - image.compressedSize / image.originalSize) * 100)}%
                            </span>
                          </>
                        )}
                        {image.status === 'processing' && (
                          <span className="text-cyan-400">Compressing... {image.progress}%</span>
                        )}
                        {image.status === 'error' && (
                          <span className="text-red-400 truncate">Error: {image.error}</span>
                        )}
                      </div>
                      
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
                      <>
                        <button
                          onClick={() => setCompareImage(image)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Compare before/after"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => downloadImage(image)}
                          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
              {doneCount > 1 && (
                <button
                  onClick={downloadAllAsZip}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                           rounded-lg font-medium hover:opacity-90 transition-all flex items-center 
                           justify-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Download ZIP ({doneCount})</span>
                </button>
              )}
              {doneCount === 1 && (
                <button
                  onClick={() => {
                    const img = images.find(i => i.status === 'done')
                    if (img) downloadImage(img)
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                           rounded-lg font-medium hover:opacity-90 transition-all flex items-center 
                           justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
              <button
                onClick={clearAll}
                className="px-5 py-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                         hover:text-white transition-all text-sm font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-white font-medium mb-2 text-sm">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          Tips for Best Results
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>WebP format saves 25-35% more than JPEG</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>80% quality is visually lossless for most images</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>Removing EXIF data protects your privacy</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>Use Compare to verify quality before saving</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2 text-sm text-green-400">
          <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Your images are processed entirely in your browser and are never uploaded to any server.</span>
        </div>
      </div>
    </div>
  )
}