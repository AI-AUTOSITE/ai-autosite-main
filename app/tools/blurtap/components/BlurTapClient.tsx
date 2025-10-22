'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Download, RotateCcw, Undo2 } from 'lucide-react'
import { MaskRegion, GuideBox, MaskMode, MaskSize, ImageFormat } from '../types'
import { MASK_SIZE_MAP } from '../constants'
import { useFileHandler } from '../hooks/useFileHandler'
import { useImageEditor } from '../hooks/useImageEditor'
import { ImageUploader } from './ImageUploader'
import {
  redrawCanvas,
  getCanvasPosition,
  downloadCanvas,
  calculateDisplayScale,
} from '../utils/canvas'

export default function BlurTapClient() {
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
    setError,
  } = useFileHandler()

  const {
    masks,
    history,
    settings,
    setMode,
    setMaskSize,
    setFormat,
    addMask,
    undoMask,
    resetMasks,
  } = useImageEditor()

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showGuide, setShowGuide] = useState(false)
  const [currentGuide, setCurrentGuide] = useState<GuideBox>({ x: 0, y: 0, w: 0, h: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // For double-click/double-tap detection
  const lastTapTime = useRef<number>(0)
  const DOUBLE_TAP_DELAY = 300 // ms

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, setError])

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      redrawCanvas(canvasRef.current, originalImage, masks, displayScale)
    }
  }, [displayScale, originalImage, masks])

  // Get position from mouse or touch event
  const getPosition = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return null

      const rect = canvasRef.current.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in e) {
        // Use touches for touchmove, changedTouches for touchend
        const touch = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0]
        if (!touch) return null
        clientX = touch.clientX
        clientY = touch.clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      } else {
        return null
      }

      const cssX = clientX - rect.left
      const cssY = clientY - rect.top

      const wrapperElement = canvasRef.current.parentElement
      if (!wrapperElement) return null

      const wrapperRect = wrapperElement.getBoundingClientRect()
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const canvasOffsetX = canvasRect.left - wrapperRect.left
      const canvasOffsetY = canvasRect.top - wrapperRect.top
      const wrapperX = canvasOffsetX + cssX
      const wrapperY = canvasOffsetY + cssY

      const canvasX = (cssX / rect.width) * canvasRef.current.width
      const canvasY = (cssY / rect.height) * canvasRef.current.height

      return { cssX, cssY, wrapperX, wrapperY, canvasX, canvasY }
    },
    []
  )

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!originalImage || !canvasRef.current) return

      const pos = getPosition(e)
      if (!pos) return

      if (settings.mode === 'click') {
        const size = MASK_SIZE_MAP[settings.maskSize]
        setCurrentGuide({
          x: pos.wrapperX - (size.w * displayScale) / 2,
          y: pos.wrapperY - (size.h * displayScale) / 2,
          w: size.w * displayScale,
          h: size.h * displayScale,
        })
        setShowGuide(true)
      } else if (settings.mode === 'drag' && isDragging) {
        const startX = dragStart.x
        const startY = dragStart.y
        setCurrentGuide({
          x: Math.min(startX, pos.wrapperX),
          y: Math.min(startY, pos.wrapperY),
          w: Math.abs(pos.wrapperX - startX),
          h: Math.abs(pos.wrapperY - startY),
        })
        setShowGuide(true)
      }
    },
    [originalImage, settings.mode, settings.maskSize, displayScale, isDragging, dragStart, getPosition]
  )

  const handleStart = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!originalImage || !canvasRef.current) return

      const pos = getPosition(e)
      if (!pos) return

      // Check for double-click/double-tap
      const currentTime = Date.now()
      const timeSinceLastTap = currentTime - lastTapTime.current
      
      if (timeSinceLastTap < DOUBLE_TAP_DELAY && timeSinceLastTap > 0) {
        // Double-click/double-tap detected!
        handleDoubleClick(pos)
        lastTapTime.current = 0 // Reset to prevent triple-click
        return
      }
      
      lastTapTime.current = currentTime

      // Normal single click/tap behavior
      if (settings.mode === 'click') {
        const size = MASK_SIZE_MAP[settings.maskSize]
        const newMask: MaskRegion = {
          x: pos.canvasX - size.w / 2,
          y: pos.canvasY - size.h / 2,
          w: size.w,
          h: size.h,
          id: `mask-${Date.now()}`,
        }
        addMask(newMask)
      } else if (settings.mode === 'drag') {
        setIsDragging(true)
        setDragStart({
          x: pos.wrapperX,
          y: pos.wrapperY,
        })
      }
    },
    [originalImage, settings.mode, settings.maskSize, addMask, getPosition]
  )

  // Handle double-click/double-tap - always use Large size
  const handleDoubleClick = useCallback(
    (pos: { canvasX: number; canvasY: number }) => {
      const size = MASK_SIZE_MAP.large // Always use Large size for double-click
      const newMask: MaskRegion = {
        x: pos.canvasX - size.w / 2,
        y: pos.canvasY - size.h / 2,
        w: size.w,
        h: size.h,
        id: `mask-${Date.now()}`,
      }
      addMask(newMask)

      // Visual feedback: brief flash
      setShowGuide(true)
      setTimeout(() => setShowGuide(false), 150)
    },
    [addMask]
  )

  const handleEnd = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!originalImage || settings.mode !== 'drag' || !isDragging || !canvasRef.current) return

      const pos = getPosition(e)
      if (!pos) return

      const wrapperElement = canvasRef.current.parentElement
      if (!wrapperElement) return

      const wrapperRect = wrapperElement.getBoundingClientRect()
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const canvasOffsetX = canvasRect.left - wrapperRect.left
      const canvasOffsetY = canvasRect.top - wrapperRect.top

      const startCanvasX =
        ((dragStart.x - canvasOffsetX) / canvasRect.width) * canvasRef.current.width
      const startCanvasY =
        ((dragStart.y - canvasOffsetY) / canvasRect.height) * canvasRef.current.height

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
          id: `mask-${Date.now()}`,
        }
        addMask(newMask)
      }

      setIsDragging(false)
      setShowGuide(false)
    },
    [originalImage, settings.mode, isDragging, dragStart, addMask, getPosition]
  )

  const handleLeave = useCallback(() => {
    setShowGuide(false)
    if (isDragging) {
      setIsDragging(false)
    }
  }, [isDragging])

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    downloadCanvas(canvasRef.current, settings.format)
  }, [settings.format])

  const handleNewImage = useCallback(() => {
    resetFile()
    resetMasks()
    fileInputRef.current?.click()
  }, [resetFile, resetMasks, fileInputRef])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Content */}
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
          {/* Canvas and Actions */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 order-2 lg:order-1">
              {/* Zoom controls */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-xs text-gray-400">Zoom:</span>
                <button
                  onClick={() => setDisplayScale((prev) => Math.max(0.1, prev - 0.1))}
                  className="min-h-[40px] px-3 py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  -
                </button>
                <span className="min-w-[60px] text-center text-sm text-white">
                  {Math.round(displayScale * 100)}%
                </span>
                <button
                  onClick={() => setDisplayScale((prev) => Math.min(3, prev + 0.1))}
                  className="min-h-[40px] px-3 py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    if (originalImage) {
                      const scale = calculateDisplayScale(originalImage.width, originalImage.height)
                      setDisplayScale(scale)
                    }
                  }}
                  className="min-h-[40px] px-3 py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  Auto
                </button>
              </div>

              <CanvasArea
                canvasRef={canvasRef}
                showGuide={showGuide}
                currentGuide={currentGuide}
                onMove={handleMove}
                onStart={handleStart}
                onEnd={handleEnd}
                onLeave={handleLeave}
              />
              
              {/* Double-click hint */}
              <div className="mt-3 text-center">
                <p className="text-xs text-cyan-400">
                  💡 Tip: Double-click/tap for quick Large mask
                </p>
              </div>
            </div>

            {/* Action Panel */}
            <ActionPanel
              historyLength={history.length}
              maskCount={masks.length}
              mode={settings.mode}
              maskSize={settings.maskSize}
              format={settings.format}
              fileName={file?.name}
              onModeChange={setMode}
              onMaskSizeChange={setMaskSize}
              onFormatChange={setFormat}
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

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  showGuide: boolean
  currentGuide: GuideBox
  onMove: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void
  onStart: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void
  onEnd: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void
  onLeave: () => void
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  showGuide,
  currentGuide,
  onMove,
  onStart,
  onEnd,
  onLeave,
}) => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
    <div className="overflow-auto" style={{ maxHeight: '75vh', minHeight: '400px' }}>
      <div className="inline-block relative min-w-full">
        <canvas
          ref={canvasRef}
          // Mouse events
          onMouseMove={onMove}
          onMouseDown={onStart}
          onMouseUp={onEnd}
          onMouseLeave={onLeave}
          // Touch events for mobile/tablet
          onTouchStart={(e) => {
            e.preventDefault()
            onStart(e)
          }}
          onTouchMove={(e) => {
            e.preventDefault()
            onMove(e)
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            onEnd(e)
          }}
          style={{
            maxWidth: '100%',
            cursor: 'crosshair',
            border: '2px solid #444',
            borderRadius: '8px',
            display: 'block',
            touchAction: 'none', // Prevent default touch behaviors
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
              boxShadow: '0 0 0 3px rgba(26,157,255,0.24)',
            }}
          />
        )}
      </div>
    </div>
  </div>
)

interface ActionPanelProps {
  historyLength: number
  maskCount: number
  mode: 'click' | 'drag'
  maskSize: MaskSize
  format: ImageFormat
  fileName?: string
  onModeChange: (mode: MaskMode) => void
  onMaskSizeChange: (size: MaskSize) => void
  onFormatChange: (format: ImageFormat) => void
  onUndo: () => void
  onReset: () => void
  onDownload: () => void
  onNewImage: () => void
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  historyLength,
  maskCount,
  mode,
  maskSize,
  format,
  fileName,
  onModeChange,
  onMaskSizeChange,
  onFormatChange,
  onUndo,
  onReset,
  onDownload,
  onNewImage,
}) => (
  <div className="w-full lg:w-80 order-1 lg:order-2">
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
      <h4 className="text-sm font-semibold text-white mb-4">Controls</h4>

      {/* Controls Section */}
      <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
        {/* Mode */}
        <div>
          <label className="text-xs text-gray-300 block mb-2">Mode</label>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as MaskMode)}
            className="w-full min-h-[48px] px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 [&>option]:bg-slate-800"
          >
            <option value="click">Click</option>
            <option value="drag">Drag</option>
          </select>
        </div>

        {/* Size */}
        <div className={mode === 'drag' ? 'opacity-50' : ''}>
          <label className="text-xs text-gray-300 block mb-2">Size</label>
          <select
            value={maskSize}
            onChange={(e) => onMaskSizeChange(e.target.value as MaskSize)}
            disabled={mode === 'drag'}
            className="w-full min-h-[48px] px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm disabled:opacity-50 focus:outline-none focus:border-cyan-400 [&>option]:bg-slate-800"
          >
            <option value="xs">XS (80x22)</option>
            <option value="small">Small (100x30)</option>
            <option value="medium">Medium (160x40)</option>
            <option value="large">Large (240x60)</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="text-xs text-gray-300 block mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value as ImageFormat)}
            className="w-full min-h-[48px] px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 [&>option]:bg-slate-800"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        {/* Status Info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Masks</label>
            <div className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-medium text-center">
              {maskCount}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-300 block mb-1">File</label>
            <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium truncate text-center">
              {fileName ? fileName.split('.')[0].substring(0, 8) : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onUndo}
          disabled={historyLength === 0}
          className="w-full min-h-[48px] px-4 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Undo2 className="w-4 h-4" />
          <span>Undo</span>
        </button>
        <button
          onClick={onReset}
          disabled={maskCount === 0}
          className="w-full min-h-[48px] px-4 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          onClick={onDownload}
          className="w-full min-h-[48px] px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          onClick={onNewImage}
          className="w-full min-h-[48px] px-4 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>New Image</span>
        </button>
      </div>
    </div>
  </div>
)