'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Upload, Download, RotateCcw, Undo2, Zap, Circle, Square, 
  RectangleHorizontal, Sliders, ChevronDown, ChevronUp,
  Eye, EyeOff, Grid3X3
} from 'lucide-react'

// ============================================
// Types
// ============================================
interface MaskRegion {
  x: number
  y: number
  w: number
  h: number
  id: string
  shape: MaskShape
}

type MaskMode = 'click' | 'drag'
type MaskSize = 'xs' | 'small' | 'medium' | 'large'
type MaskShape = 'rectangle' | 'circle' | 'rounded'
type EffectType = 'blur' | 'pixelate' | 'solid'
type ImageFormat = 'png' | 'jpeg' | 'webp'

interface GuideBox {
  x: number
  y: number
  w: number
  h: number
}

// ============================================
// Constants
// ============================================
const MASK_SIZE_MAP: Record<MaskSize, { w: number; h: number }> = {
  xs: { w: 80, h: 80 },
  small: { w: 120, h: 120 },
  medium: { w: 180, h: 180 },
  large: { w: 260, h: 260 },
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/bmp',
  'image/webp',
]

// ============================================
// Simple Stack Blur Algorithm
// ============================================
function stackBlur(imageData: ImageData, radius: number): ImageData {
  const pixels = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  if (radius < 1) return imageData
  
  const wm = width - 1
  const hm = height - 1
  const div = radius + radius + 1
  
  const r: number[] = []
  const g: number[] = []
  const b: number[] = []
  
  let rsum, gsum, bsum, x, y, i, p, yp, yi, yw
  const vmin: number[] = []
  const vmax: number[] = []
  
  // First pass - horizontal
  yw = yi = 0
  for (y = 0; y < height; y++) {
    rsum = gsum = bsum = 0
    
    for (i = -radius; i <= radius; i++) {
      p = (yi + Math.min(wm, Math.max(i, 0))) * 4
      rsum += pixels[p]
      gsum += pixels[p + 1]
      bsum += pixels[p + 2]
    }
    
    for (x = 0; x < width; x++) {
      r[yi] = rsum / div
      g[yi] = gsum / div
      b[yi] = bsum / div
      
      if (y === 0) {
        vmin[x] = Math.min(x + radius + 1, wm)
        vmax[x] = Math.max(x - radius, 0)
      }
      
      p = (yw + vmin[x]) * 4
      const p2 = (yw + vmax[x]) * 4
      
      rsum += pixels[p] - pixels[p2]
      gsum += pixels[p + 1] - pixels[p2 + 1]
      bsum += pixels[p + 2] - pixels[p2 + 2]
      
      yi++
    }
    yw += width
  }
  
  // Second pass - vertical
  for (x = 0; x < width; x++) {
    rsum = gsum = bsum = 0
    yp = -radius * width
    
    for (i = -radius; i <= radius; i++) {
      yi = Math.max(0, yp) + x
      rsum += r[yi]
      gsum += g[yi]
      bsum += b[yi]
      yp += width
    }
    
    yi = x
    for (y = 0; y < height; y++) {
      pixels[yi * 4] = Math.round(rsum / div)
      pixels[yi * 4 + 1] = Math.round(gsum / div)
      pixels[yi * 4 + 2] = Math.round(bsum / div)
      
      if (x === 0) {
        vmin[y] = Math.min(y + radius + 1, hm) * width
        vmax[y] = Math.max(y - radius, 0) * width
      }
      
      const p1 = x + vmin[y]
      const p2 = x + vmax[y]
      
      rsum += r[p1] - r[p2]
      gsum += g[p1] - g[p2]
      bsum += b[p1] - b[p2]
      
      yi += width
    }
  }
  
  return imageData
}

// ============================================
// Pixelate Function
// ============================================
function pixelate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pixelSize: number): void {
  const imageData = ctx.getImageData(x, y, w, h)
  const pixels = imageData.data
  
  for (let py = 0; py < h; py += pixelSize) {
    for (let px = 0; px < w; px += pixelSize) {
      let r = 0, g = 0, b = 0, count = 0
      
      // Average color in block
      for (let by = 0; by < pixelSize && py + by < h; by++) {
        for (let bx = 0; bx < pixelSize && px + bx < w; bx++) {
          const i = ((py + by) * w + (px + bx)) * 4
          r += pixels[i]
          g += pixels[i + 1]
          b += pixels[i + 2]
          count++
        }
      }
      
      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)
      
      // Fill block with average color
      for (let by = 0; by < pixelSize && py + by < h; by++) {
        for (let bx = 0; bx < pixelSize && px + bx < w; bx++) {
          const i = ((py + by) * w + (px + bx)) * 4
          pixels[i] = r
          pixels[i + 1] = g
          pixels[i + 2] = b
        }
      }
    }
  }
  
  ctx.putImageData(imageData, x, y)
}

// ============================================
// Canvas Drawing Functions
// ============================================
function applyMaskEffect(
  ctx: CanvasRenderingContext2D,
  mask: MaskRegion,
  effectType: EffectType,
  blurIntensity: number
): void {
  const { x, y, w, h, shape } = mask
  
  // Clamp values to canvas bounds
  const cx = Math.max(0, Math.floor(x))
  const cy = Math.max(0, Math.floor(y))
  const cw = Math.min(ctx.canvas.width - cx, Math.ceil(w))
  const ch = Math.min(ctx.canvas.height - cy, Math.ceil(h))
  
  if (cw <= 0 || ch <= 0) return
  
  ctx.save()
  
  // Create clipping path based on shape
  ctx.beginPath()
  if (shape === 'circle') {
    ctx.ellipse(cx + cw / 2, cy + ch / 2, cw / 2, ch / 2, 0, 0, Math.PI * 2)
  } else if (shape === 'rounded') {
    const radius = Math.min(cw, ch) * 0.2
    ctx.moveTo(cx + radius, cy)
    ctx.lineTo(cx + cw - radius, cy)
    ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + radius)
    ctx.lineTo(cx + cw, cy + ch - radius)
    ctx.quadraticCurveTo(cx + cw, cy + ch, cx + cw - radius, cy + ch)
    ctx.lineTo(cx + radius, cy + ch)
    ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - radius)
    ctx.lineTo(cx, cy + radius)
    ctx.quadraticCurveTo(cx, cy, cx + radius, cy)
  } else {
    ctx.rect(cx, cy, cw, ch)
  }
  ctx.clip()
  
  if (effectType === 'solid') {
    ctx.fillStyle = 'black'
    ctx.fillRect(cx, cy, cw, ch)
  } else if (effectType === 'pixelate') {
    const pixelSize = Math.max(4, Math.floor(blurIntensity / 3))
    pixelate(ctx, cx, cy, cw, ch, pixelSize)
  } else {
    // Blur effect
    const imageData = ctx.getImageData(cx, cy, cw, ch)
    const blurred = stackBlur(imageData, Math.floor(blurIntensity / 2))
    ctx.putImageData(blurred, cx, cy)
  }
  
  ctx.restore()
}

function redrawCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  masks: MaskRegion[],
  displayScale: number,
  effectType: EffectType,
  blurIntensity: number
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = image.width
  canvas.height = image.height
  canvas.style.width = `${image.width * displayScale}px`
  canvas.style.height = `${image.height * displayScale}px`

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0)

  masks.forEach((mask) => {
    applyMaskEffect(ctx, mask, effectType, blurIntensity)
  })
}

function calculateDisplayScale(
  imageWidth: number,
  imageHeight: number
): number {
  const maxWidth = window.innerWidth * 0.6
  const maxHeight = window.innerHeight * 0.6
  const scaleX = maxWidth / imageWidth
  const scaleY = maxHeight / imageHeight
  return Math.min(scaleX, scaleY, 1.2)
}

// ============================================
// Main Component
// ============================================
export default function BlurTapClient() {
  // File state
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [displayScale, setDisplayScale] = useState(1)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [error, setError] = useState('')
  
  // Mask state
  const [masks, setMasks] = useState<MaskRegion[]>([])
  const [history, setHistory] = useState<MaskRegion[][]>([])
  
  // Settings
  const [mode, setMode] = useState<MaskMode>('click')
  const [maskSize, setMaskSize] = useState<MaskSize>('medium')
  const [maskShape, setMaskShape] = useState<MaskShape>('rectangle')
  const [effectType, setEffectType] = useState<EffectType>('blur')
  const [blurIntensity, setBlurIntensity] = useState(30)
  const [format, setFormat] = useState<ImageFormat>('png')
  const [showSettings, setShowSettings] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showGuide, setShowGuide] = useState(false)
  const [currentGuide, setCurrentGuide] = useState<GuideBox>({ x: 0, y: 0, w: 0, h: 0 })
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastTapTime = useRef<number>(0)

  // Clear error after delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Redraw canvas when dependencies change
  useEffect(() => {
    if (originalImage && canvasRef.current) {
      redrawCanvas(canvasRef.current, originalImage, masks, displayScale, effectType, blurIntensity)
    }
  }, [displayScale, originalImage, masks, effectType, blurIntensity])

  // File handling
  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!SUPPORTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setError('Please select an image file (PNG, JPEG, WebP, GIF, BMP)')
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File must be under 10MB')
      return
    }

    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setImageUrl(url)

    const img = new Image()
    img.onload = () => {
      setOriginalImage(img)
      setDisplayScale(calculateDisplayScale(img.width, img.height))
      setMasks([])
      setHistory([])
    }
    img.src = url
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingFile(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }, [handleFileSelect])

  const resetFile = useCallback(() => {
    setFile(null)
    setImageUrl(null)
    setOriginalImage(null)
    setMasks([])
    setHistory([])
    if (imageUrl) URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  // Mask operations
  const addMask = useCallback((mask: MaskRegion) => {
    setHistory(prev => [...prev, masks])
    setMasks(prev => [...prev, mask])
  }, [masks])

  const undoMask = useCallback(() => {
    if (history.length > 0) {
      const previous = history[history.length - 1]
      setMasks(previous)
      setHistory(prev => prev.slice(0, -1))
    }
  }, [history])

  const resetMasks = useCallback(() => {
    if (masks.length > 0) {
      setHistory(prev => [...prev, masks])
      setMasks([])
    }
  }, [masks])

  // Canvas interaction
  const getPosition = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null

    const rect = canvasRef.current.getBoundingClientRect()
    let clientX: number, clientY: number

    if ('touches' in e) {
      const touch = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0]
      if (!touch) return null
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
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
  }, [])

  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!originalImage || !canvasRef.current) return

    const pos = getPosition(e)
    if (!pos) return

    if (mode === 'click') {
      const size = MASK_SIZE_MAP[maskSize]
      setCurrentGuide({
        x: pos.wrapperX - (size.w * displayScale) / 2,
        y: pos.wrapperY - (size.h * displayScale) / 2,
        w: size.w * displayScale,
        h: size.h * displayScale,
      })
      setShowGuide(true)
    } else if (mode === 'drag' && isDragging) {
      setCurrentGuide({
        x: Math.min(dragStart.x, pos.wrapperX),
        y: Math.min(dragStart.y, pos.wrapperY),
        w: Math.abs(pos.wrapperX - dragStart.x),
        h: Math.abs(pos.wrapperY - dragStart.y),
      })
      setShowGuide(true)
    }
  }, [originalImage, mode, maskSize, displayScale, isDragging, dragStart, getPosition])

  const handleStart = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!originalImage || !canvasRef.current) return

    const pos = getPosition(e)
    if (!pos) return

    // Double-tap detection
    const currentTime = Date.now()
    if (currentTime - lastTapTime.current < 300) {
      const size = MASK_SIZE_MAP.large
      addMask({
        x: pos.canvasX - size.w / 2,
        y: pos.canvasY - size.h / 2,
        w: size.w,
        h: size.h,
        id: `mask-${Date.now()}`,
        shape: maskShape,
      })
      lastTapTime.current = 0
      return
    }
    lastTapTime.current = currentTime

    if (mode === 'click') {
      const size = MASK_SIZE_MAP[maskSize]
      addMask({
        x: pos.canvasX - size.w / 2,
        y: pos.canvasY - size.h / 2,
        w: size.w,
        h: size.h,
        id: `mask-${Date.now()}`,
        shape: maskShape,
      })
    } else if (mode === 'drag') {
      setIsDragging(true)
      setDragStart({ x: pos.wrapperX, y: pos.wrapperY })
    }
  }, [originalImage, mode, maskSize, maskShape, addMask, getPosition])

  const handleEnd = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!originalImage || mode !== 'drag' || !isDragging || !canvasRef.current) return

    const pos = getPosition(e)
    if (!pos) return

    const wrapperElement = canvasRef.current.parentElement
    if (!wrapperElement) return

    const wrapperRect = wrapperElement.getBoundingClientRect()
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const canvasOffsetX = canvasRect.left - wrapperRect.left
    const canvasOffsetY = canvasRect.top - wrapperRect.top

    const startCanvasX = ((dragStart.x - canvasOffsetX) / canvasRect.width) * canvasRef.current.width
    const startCanvasY = ((dragStart.y - canvasOffsetY) / canvasRect.height) * canvasRef.current.height

    const bx = Math.min(startCanvasX, pos.canvasX)
    const by = Math.min(startCanvasY, pos.canvasY)
    const bw = Math.abs(pos.canvasX - startCanvasX)
    const bh = Math.abs(pos.canvasY - startCanvasY)

    if (bw > 5 && bh > 5) {
      addMask({
        x: bx,
        y: by,
        w: bw,
        h: bh,
        id: `mask-${Date.now()}`,
        shape: maskShape,
      })
    }

    setIsDragging(false)
    setShowGuide(false)
  }, [originalImage, mode, isDragging, dragStart, maskShape, addMask, getPosition])

  const handleLeave = useCallback(() => {
    if (!isDragging) setShowGuide(false)
  }, [isDragging])

  // Download
  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png'
    canvasRef.current.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `blurred-${Date.now()}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    }, mime, 0.93)
  }, [format])

  // Get guide shape style
  const getGuideStyle = () => {
    const base = {
      left: `${currentGuide.x}px`,
      top: `${currentGuide.y}px`,
      width: `${currentGuide.w}px`,
      height: `${currentGuide.h}px`,
      border: '3px dashed',
      borderColor: effectType === 'blur' ? '#1a9dff' : effectType === 'pixelate' ? '#ff9d1a' : '#333',
      backgroundColor: effectType === 'blur' ? 'rgba(26,157,255,0.15)' : effectType === 'pixelate' ? 'rgba(255,157,26,0.15)' : 'rgba(0,0,0,0.3)',
    }
    
    if (maskShape === 'circle') {
      return { ...base, borderRadius: '50%' }
    } else if (maskShape === 'rounded') {
      return { ...base, borderRadius: '20%' }
    }
    return base
  }

  // ============================================
  // Render
  // ============================================
  if (!imageUrl) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Privacy Badge */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
            <Zap className="w-3 h-3 text-green-400" />
            <span>100% Browser-based • No Data Upload</span>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true) }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                     ${isDraggingFile ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/20 hover:border-white/40'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-white text-lg font-medium mb-2">Drop image here or click to upload</p>
          <p className="text-gray-400 text-sm">PNG, JPEG, WebP up to 10MB</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">✨</div>
            <div className="text-xs text-gray-400">Real blur effect</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">⬜</div>
            <div className="text-xs text-gray-400">Multiple shapes</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">🎚️</div>
            <div className="text-xs text-gray-400">Adjustable intensity</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">📱</div>
            <div className="text-xs text-gray-400">Touch support</div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      {/* Privacy Badge */}
      <div className="flex justify-end mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Canvas Area */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="overflow-auto" style={{ maxHeight: '70vh', minHeight: '300px' }}>
              <div className="inline-block relative min-w-full">
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMove}
                  onMouseDown={handleStart}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleLeave}
                  onTouchStart={(e) => { e.preventDefault(); handleStart(e) }}
                  onTouchMove={(e) => { e.preventDefault(); handleMove(e) }}
                  onTouchEnd={(e) => { e.preventDefault(); handleEnd(e) }}
                  style={{
                    maxWidth: '100%',
                    cursor: 'crosshair',
                    border: '2px solid #444',
                    borderRadius: '8px',
                    display: 'block',
                    touchAction: 'none',
                  }}
                  className="bg-white mx-auto"
                />
                {showGuide && (
                  <div className="absolute pointer-events-none" style={getGuideStyle()} />
                )}
              </div>
            </div>
            <p className="text-xs text-cyan-400 text-center mt-3">
              💡 Double-tap for quick large mask • Drag to draw custom area
            </p>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-full lg:w-80 order-1 lg:order-2">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            {/* Effect Type */}
            <div className="mb-4">
              <label className="text-xs text-gray-300 block mb-2">Effect Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'blur', label: 'Blur', icon: <Eye className="w-4 h-4" /> },
                  { value: 'pixelate', label: 'Pixelate', icon: <Grid3X3 className="w-4 h-4" /> },
                  { value: 'solid', label: 'Solid', icon: <EyeOff className="w-4 h-4" /> },
                ].map(e => (
                  <button
                    key={e.value}
                    onClick={() => setEffectType(e.value as EffectType)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                      effectType === e.value
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {e.icon}
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            {effectType !== 'solid' && (
              <div className="mb-4">
                <label className="text-xs text-gray-300 block mb-2">
                  Intensity: <span className="text-cyan-400">{blurIntensity}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={blurIntensity}
                  onChange={(e) => setBlurIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 
                           [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            )}

            {/* Mask Shape */}
            <div className="mb-4">
              <label className="text-xs text-gray-300 block mb-2">Shape</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'rectangle', icon: <Square className="w-4 h-4" /> },
                  { value: 'circle', icon: <Circle className="w-4 h-4" /> },
                  { value: 'rounded', icon: <RectangleHorizontal className="w-4 h-4" /> },
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => setMaskShape(s.value as MaskShape)}
                    className={`p-2.5 rounded-lg transition-all ${
                      maskShape === s.value
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="border-t border-white/10 pt-4 mb-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full flex justify-between items-center text-sm text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  More Options
                </span>
                {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showSettings && (
                <div className="mt-3 space-y-3">
                  {/* Mode */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['click', 'drag'].map(m => (
                        <button
                          key={m}
                          onClick={() => setMode(m as MaskMode)}
                          className={`px-3 py-2 rounded-lg text-xs capitalize ${
                            mode === m
                              ? 'bg-cyan-600 text-white'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size (only for click mode) */}
                  {mode === 'click' && (
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Size</label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['xs', 'small', 'medium', 'large'] as MaskSize[]).map(s => (
                          <button
                            key={s}
                            onClick={() => setMaskSize(s)}
                            className={`px-2 py-1.5 rounded text-xs capitalize ${
                              maskSize === s
                                ? 'bg-cyan-600 text-white'
                                : 'bg-white/5 text-gray-400'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Format */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Export Format</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['png', 'jpeg', 'webp'].map(f => (
                        <button
                          key={f}
                          onClick={() => setFormat(f as ImageFormat)}
                          className={`px-2 py-1.5 rounded text-xs uppercase ${
                            format === f
                              ? 'bg-cyan-600 text-white'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-center">
                <div className="text-lg font-bold text-cyan-400">{masks.length}</div>
                <div className="text-[10px] text-gray-400">Masks</div>
              </div>
              <div className="flex-1 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
                <div className="text-lg font-bold text-green-400">{history.length}</div>
                <div className="text-[10px] text-gray-400">History</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={undoMask}
                disabled={history.length === 0}
                className="w-full px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Undo2 className="w-4 h-4" />
                Undo
              </button>
              <button
                onClick={resetMasks}
                disabled={masks.length === 0}
                className="w-full px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All
              </button>
              <button
                onClick={handleDownload}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={resetFile}
                className="w-full px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}