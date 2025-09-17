'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { AlertCircle, CheckCircle, Upload, Download, RotateCcw, Undo2, Info } from 'lucide-react'

// Import types and constants
import { MaskRegion, GuideBox } from './types'
import { MASK_SIZE_MAP } from './constants'

// Import hooks
import { useFileHandler } from './hooks/useFileHandler'
import { useImageEditor } from './hooks/useImageEditor'

// Import components
import { ImageUploader } from './components/ImageUploader'
import { ControlPanel } from './components/ControlPanel'
import { InfoModal } from './components/InfoModal'

// Import utilities
import { redrawCanvas, getCanvasPosition, downloadCanvas, calculateDisplayScale } from './utils/canvas'

export default function BlurTapPage() {
  // File handling
  const {
    file,
    imageUrl,
    displayScale,
    setDisplayScale,
    originalImage,
    isDraggingFile,
    fileInputRef,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetFile,
    error,
    setError
  } = useFileHandler()

  // Image editing
  const {
    masks,
    history,
    settings,
    successMessage,
    setMode,
    setMaskSize,
    setFormat,
    addMask,
    undoMask,
    resetMasks,
    setSuccessMessage
  } = useImageEditor()

  // UI state
  const [showInfo, setShowInfo] = useState(false)
  
  // Mouse operations
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showGuide, setShowGuide] = useState(false)
  const [currentGuide, setCurrentGuide] = useState<GuideBox>({ x: 0, y: 0, w: 0, h: 0 })
  
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-hide error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, setError])

  // Redraw canvas when masks or scale changes
  useEffect(() => {
    if (originalImage && canvasRef.current) {
      redrawCanvas(canvasRef.current, originalImage, masks, displayScale)
    }
  }, [displayScale, originalImage, masks])

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalImage || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const cssX = e.clientX - rect.left
    const cssY = e.clientY - rect.top
    
    const wrapperElement = canvasRef.current.parentElement
    if (!wrapperElement) return
    
    const wrapperRect = wrapperElement.getBoundingClientRect()
    const canvasRect = canvasRef.current.getBoundingClientRect()
    
    const canvasOffsetX = canvasRect.left - wrapperRect.left
    const canvasOffsetY = canvasRect.top - wrapperRect.top
    
    const wrapperX = canvasOffsetX + cssX
    const wrapperY = canvasOffsetY + cssY
    
    if (settings.mode === 'click') {
      const size = MASK_SIZE_MAP[settings.maskSize]
      setCurrentGuide({
        x: wrapperX - (size.w * displayScale) / 2,
        y: wrapperY - (size.h * displayScale) / 2,
        w: size.w * displayScale,
        h: size.h * displayScale
      })
      setShowGuide(true)
    } else if (settings.mode === 'drag' && isDragging) {
      const startX = dragStart.x
      const startY = dragStart.y
      setCurrentGuide({
        x: Math.min(startX, wrapperX),
        y: Math.min(startY, wrapperY),
        w: Math.abs(wrapperX - startX),
        h: Math.abs(wrapperY - startY)
      })
      setShowGuide(true)
    }
  }, [originalImage, settings.mode, settings.maskSize, displayScale, isDragging, dragStart])

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalImage || !canvasRef.current) return
    
    const pos = getCanvasPosition(e, canvasRef.current)
    
    if (settings.mode === 'click') {
      const size = MASK_SIZE_MAP[settings.maskSize]
      const newMask: MaskRegion = {
        x: pos.canvasX - size.w / 2,
        y: pos.canvasY - size.h / 2,
        w: size.w,
        h: size.h,
        id: `mask-${Date.now()}`
      }
      
      addMask(newMask)
    } else if (settings.mode === 'drag') {
      setIsDragging(true)
      
      const wrapperElement = canvasRef.current.parentElement
      if (!wrapperElement) return
      
      const wrapperRect = wrapperElement.getBoundingClientRect()
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const canvasOffsetX = canvasRect.left - wrapperRect.left
      const canvasOffsetY = canvasRect.top - wrapperRect.top
      
      setDragStart({ 
        x: canvasOffsetX + pos.x, 
        y: canvasOffsetY + pos.y 
      })
    }
  }, [originalImage, settings.mode, settings.maskSize, addMask])

  // Handle mouse up
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalImage || settings.mode !== 'drag' || !isDragging || !canvasRef.current) return
    
    const pos = getCanvasPosition(e, canvasRef.current)
    
    const wrapperElement = canvasRef.current.parentElement
    if (!wrapperElement) return
    
    const wrapperRect = wrapperElement.getBoundingClientRect()
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const canvasOffsetX = canvasRect.left - wrapperRect.left
    const canvasOffsetY = canvasRect.top - wrapperRect.top
    
    const startCanvasX = ((dragStart.x - canvasOffsetX) / canvasRect.width) * canvasRef.current.width
    const startCanvasY = ((dragStart.y - canvasOffsetY) / canvasRect.height) * canvasRef.current.height
    
    const x1 = startCanvasX
    const y1 = startCanvasY
    const x2 = pos.canvasX
    const y2 = pos.canvasY
    
    const bx = Math.min(x1, x2)
    const by = Math.min(y1, y2)
    const bw = Math.abs(x2 - x1)
    const bh = Math.abs(y2 - y1)
    
    if (bw > 2 && bh > 2) {
      const newMask: MaskRegion = {
        x: bx,
        y: by,
        w: bw,
        h: bh,
        id: `mask-${Date.now()}`
      }
      
      addMask(newMask)
    }
    
    setIsDragging(false)
    setShowGuide(false)
  }, [originalImage, settings.mode, isDragging, dragStart, addMask])

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setShowGuide(false)
    if (isDragging) {
      setIsDragging(false)
    }
  }, [isDragging])

  // Handle download
  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    downloadCanvas(canvasRef.current, settings.format)
    setSuccessMessage('Image downloaded!')
  }, [settings.format, setSuccessMessage])

  // Handle new image
  const handleNewImage = useCallback(() => {
    resetFile()
    resetMasks()
    fileInputRef.current?.click()
  }, [resetFile, resetMasks, fileInputRef])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tool Description */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-4">
          Privacy Masking Tool
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-4">
          Click or drag to add black masks to hide sensitive information.
          100% browser-based, no data uploaded.
        </p>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 text-gray-400"
        >
          <Info className="w-4 h-4" />
          <span>How to use</span>
        </button>
      </div>

      {/* Info modal */}
      {showInfo && (
        <InfoModal onClose={() => setShowInfo(false)} />
      )}

      {/* Main content */}
      {!imageUrl ? (
        <ImageUploader
          isDraggingFile={isDraggingFile}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      ) : (
        <div className="space-y-4">
          {/* Control panel */}
          <ControlPanel
            mode={settings.mode}
            maskSize={settings.maskSize}
            format={settings.format}
            maskCount={masks.length}
            fileName={file?.name}
            onModeChange={setMode}
            onMaskSizeChange={setMaskSize}
            onFormatChange={setFormat}
          />

          {/* Messages */}
          <MessageArea error={error} successMessage={successMessage} />

          {/* Editor area */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Canvas area */}
            <div className="flex-1 order-2 lg:order-1">
              {/* Scale control */}
              <div className="mb-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-3 flex items-center gap-4">
                <span className="text-sm text-gray-400">Zoom:</span>
                <input
                  type="range"
                  min="0.3"
                  max="1.5"
                  step="0.1"
                  value={displayScale}
                  onChange={(e) => {
                    const newScale = parseFloat(e.target.value)
                    setDisplayScale(newScale)
                  }}
                  className="flex-1 accent-cyan-400"
                />
                <span className="text-sm text-white font-medium min-w-[50px]">
                  {Math.round(displayScale * 100)}%
                </span>
                <button
                  onClick={() => {
                    if (originalImage) {
                      const autoScale = calculateDisplayScale(originalImage.width, originalImage.height, 0.7, 0.65)
                      setDisplayScale(autoScale)
                    }
                  }}
                  className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors"
                >
                  Auto
                </button>
              </div>
              
              <CanvasArea
                canvasRef={canvasRef}
                showGuide={showGuide}
                currentGuide={currentGuide}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
            </div>

            {/* Action panel */}
            <ActionPanel
              historyLength={history.length}
              maskCount={masks.length}
              mode={settings.mode}
              onUndo={undoMask}
              onReset={resetMasks}
              onDownload={handleDownload}
              onNewImage={handleNewImage}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Message area component
const MessageArea: React.FC<{ error: string; successMessage: string }> = ({ error, successMessage }) => (
  <div className="h-16">
    {error && (
      <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl p-4 flex items-start space-x-3 animate-fade-in">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
        <p className="text-red-400">{error}</p>
      </div>
    )}
    
    {successMessage && (
      <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-4 flex items-start space-x-3 animate-fade-in">
        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
        <p className="text-green-400">{successMessage}</p>
      </div>
    )}
  </div>
)

// Canvas area component
interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  showGuide: boolean
  currentGuide: GuideBox
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseLeave: () => void
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  showGuide,
  currentGuide,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseLeave
}) => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
    <div className="overflow-auto" style={{ maxHeight: '75vh', minHeight: '500px' }}>
      <div className="inline-block relative min-w-full">
        <canvas
          ref={canvasRef}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          style={{
            maxWidth: '100%',
            cursor: 'crosshair',
            border: '2px solid #444',
            borderRadius: '8px',
            display: 'block'
          }}
          className="bg-white mx-auto"
        />
        
        {showGuide && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${currentGuide.x}px`,
              top: `${currentGuide.y}px`,
              width: `${currentGuide.w}px`,
              height: `${currentGuide.h}px`,
              border: '3px dashed #1a9dff',
              backgroundColor: 'rgba(26,157,255,0.11)',
              boxShadow: '0 0 0 3px rgba(26,157,255,0.24)'
            }}
          />
        )}
      </div>
    </div>
  </div>
)

// Action panel component
interface ActionPanelProps {
  historyLength: number
  maskCount: number
  mode: 'click' | 'drag'
  onUndo: () => void
  onReset: () => void
  onDownload: () => void
  onNewImage: () => void
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  historyLength,
  maskCount,
  mode,
  onUndo,
  onReset,
  onDownload,
  onNewImage
}) => (
  <div className="w-full lg:w-80 order-1 lg:order-2 flex flex-col gap-4">
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
      <h4 className="text-sm font-semibold text-gray-400 mb-3">Actions</h4>
      <div className="space-y-2">
        <button
          onClick={onUndo}
          disabled={historyLength === 0}
          className="w-full px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Undo2 className="w-4 h-4" />
          <span>Undo</span>
        </button>
        
        <button
          onClick={onReset}
          disabled={maskCount === 0}
          className="w-full px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        
        <button
          onClick={onDownload}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        
        <button
          onClick={onNewImage}
          className="w-full px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>New Image</span>
        </button>
      </div>
    </div>

    <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-4">
      <h4 className="text-sm font-semibold text-purple-400 mb-2">Quick Guide</h4>
      <ul className="text-xs text-gray-300 space-y-1">
        <li>• {mode === 'click' ? 'Click to add fixed-size masks' : 'Drag to select area'}</li>
        <li>• Use Undo to remove last mask</li>
        <li>• Reset clears all masks</li>
        <li>• Download saves the result</li>
      </ul>
    </div>
  </div>
)