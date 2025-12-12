'use client'

import { useState, useCallback, useEffect } from 'react'
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react'

// Types
import type { Status, ProcessedImage } from './types'

// Constants
import { formatFileSize } from './constants'

// Hooks
import { useBgRemoval } from './hooks/useBgRemoval'
import { useEditCanvas } from './hooks/useEditCanvas'

// Components
import { MobileWarningModal } from './components/MobileWarningModal'
import { UploadArea } from './components/UploadArea'
import { ProcessingState } from './components/ProcessingState'
import { EditingMode } from './EditingMode'
import { ResultState } from './components/ResultState'

export default function BgEraserClient() {
  // State
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [showMobileWarning, setShowMobileWarning] = useState(false)
  const [lowMemoryMode, setLowMemoryMode] = useState(false)

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent
      const mobile = /iPhone|iPod|Android.*Mobile/i.test(userAgent)
      const tablet = /iPad|Android(?!.*Mobile)/i.test(userAgent) || 
                     (window.innerWidth >= 768 && window.innerWidth <= 1024 && 'ontouchstart' in window)
      const smallScreen = window.innerWidth < 768
      
      setIsMobile(mobile || smallScreen)
      setIsTablet(tablet)
      
      // Show warning for mobile devices on first load
      if ((mobile || smallScreen) && !sessionStorage.getItem('mobileWarningShown')) {
        setShowMobileWarning(true)
      }
      
      // Check available memory (if supported)
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory
        if (memory && memory < 4) {
          setLowMemoryMode(true)
        }
      }
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // File size limits based on device
  const MAX_FILE_SIZE = isMobile ? 10 * 1024 * 1024 : 25 * 1024 * 1024
  const MAX_DIMENSION = lowMemoryMode ? 800 : (isMobile ? 1024 : 2048)
  const isTouchDevice = isMobile || isTablet

  // Dismiss mobile warning
  const dismissMobileWarning = () => {
    setShowMobileWarning(false)
    sessionStorage.setItem('mobileWarningShown', 'true')
  }

  // Background removal hook
  const { removeBackground, modelLoaded } = useBgRemoval({
    maxDimension: MAX_DIMENSION,
    onProgress: setProgress
  })

  // Edit canvas hook
  const editCanvas = useEditCanvas({
    resultBlob: processedImage?.resultBlob || null,
    isMobile,
    onFinish: useCallback((blob: Blob, url: string) => {
      if (processedImage) {
        URL.revokeObjectURL(processedImage.resultUrl)
        setProcessedImage({
          ...processedImage,
          resultUrl: url,
          resultBlob: blob
        })
      }
      setStatus('done')
    }, [processedImage])
  })

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file (PNG, JPG, or WebP)")
      setStatus('error')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`Image too large. Please use an image under ${formatFileSize(MAX_FILE_SIZE)}`)
      setStatus('error')
      return
    }

    setError(null)
    setStatus('loading-model')
    setProgress(0)
    editCanvas.reset()

    const originalUrl = URL.createObjectURL(file)

    setProcessedImage({
      originalUrl,
      resultUrl: '',
      originalFile: file,
      resultBlob: null,
      width: 0,
      height: 0
    })

    try {
      const { blob, width, height } = await removeBackground(file)
      const resultUrl = URL.createObjectURL(blob)

      setProcessedImage({
        originalUrl,
        resultUrl,
        originalFile: file,
        resultBlob: blob,
        width,
        height
      })
      setStatus('done')

    } catch (err) {
      console.error('Processing error:', err)
      setError("Something went wrong. Please try again with a different image.")
      setStatus('error')
      URL.revokeObjectURL(originalUrl)
    }
  }, [MAX_FILE_SIZE, removeBackground, editCanvas])

  // Enter edit mode
  const enterEditMode = useCallback(() => {
    setStatus('editing')
    setTimeout(() => {
      editCanvas.initEditCanvas()
    }, 100)
  }, [editCanvas])

  // Reset
  const handleReset = useCallback(() => {
    if (processedImage) {
      URL.revokeObjectURL(processedImage.originalUrl)
      if (processedImage.resultUrl) {
        URL.revokeObjectURL(processedImage.resultUrl)
      }
    }
    setProcessedImage(null)
    setStatus('idle')
    setProgress(0)
    setError(null)
    editCanvas.reset()
  }, [processedImage, editCanvas])

  // Cleanup
  useEffect(() => {
    return () => {
      if (processedImage) {
        URL.revokeObjectURL(processedImage.originalUrl)
        if (processedImage.resultUrl) {
          URL.revokeObjectURL(processedImage.resultUrl)
        }
      }
    }
  }, [processedImage])

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
      {/* Mobile Warning Modal */}
      {showMobileWarning && (
        <MobileWarningModal 
          maxFileSize={MAX_FILE_SIZE} 
          onDismiss={dismissMobileWarning} 
        />
      )}

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-violet-400" />
          Background Eraser
        </h1>
        <p className="text-gray-400 text-sm md:text-lg">
          Remove backgrounds like magic—free forever!
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        
        {/* Upload State */}
        {status === 'idle' && (
          <UploadArea 
            maxFileSize={MAX_FILE_SIZE}
            isTouchDevice={isTouchDevice}
            onFileSelect={handleFileSelect}
          />
        )}

        {/* Processing State */}
        {(status === 'loading-model' || status === 'processing') && (
          <ProcessingState 
            originalUrl={processedImage?.originalUrl}
            progress={progress}
            modelLoaded={modelLoaded}
            isTouchDevice={isTouchDevice}
          />
        )}

        {/* Edit Mode */}
        {status === 'editing' && processedImage && (
          <EditingMode
            editCanvasRef={editCanvas.editCanvasRef}
            editTool={editCanvas.editTool}
            setEditTool={editCanvas.setEditTool}
            brushSize={editCanvas.brushSize}
            setBrushSize={editCanvas.setBrushSize}
            zoom={editCanvas.zoom}
            setZoom={editCanvas.setZoom}
            pan={editCanvas.pan}
            history={editCanvas.history}
            historyIndex={editCanvas.historyIndex}
            isPanning={editCanvas.isPanning}
            isTouchDevice={isTouchDevice}
            onUndo={editCanvas.undo}
            onRedo={editCanvas.redo}
            onPointerDown={editCanvas.handlePointerDown}
            onPointerMove={editCanvas.handlePointerMove}
            onPointerUp={editCanvas.handlePointerUp}
            onCancel={() => setStatus('done')}
            onFinish={editCanvas.finishEditing}
          />
        )}

        {/* Result State */}
        {status === 'done' && processedImage && (
          <ResultState
            processedImage={processedImage}
            isTouchDevice={isTouchDevice}
            onEdit={enterEditMode}
            onReset={handleReset}
          />
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="space-y-4 md:space-y-6 text-center">
            <div className="p-4 md:p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 text-sm md:text-base">{error}</p>
            </div>
            <button onClick={handleReset} className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 transition-colors text-sm md:text-base">
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
