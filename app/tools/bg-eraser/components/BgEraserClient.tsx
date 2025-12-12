'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { 
  Upload, 
  Download, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  CheckCircle,
  Info,
  Eraser,
  Paintbrush,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Move,
  Settings,
  Smartphone,
  X,
  Check
} from 'lucide-react'

// Types
type Status = 'idle' | 'loading-model' | 'processing' | 'done' | 'editing' | 'error'
type OutputFormat = 'png' | 'webp' | 'jpg' | 'svg'
type EditTool = 'eraser' | 'restore' | 'pan'

interface ProcessedImage {
  originalUrl: string
  resultUrl: string
  originalFile: File
  resultBlob: Blob | null
  width: number
  height: number
}

interface HistoryState {
  imageData: ImageData
}

// Store the initial state of the edited image for restore brush
let initialEditImageData: ImageData | null = null

// Custom cursor SVGs (desktop only)
const createEraserCursor = (size: number) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="none" stroke="white" stroke-width="2"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="none" stroke="black" stroke-width="1"/>
  </svg>`
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, crosshair`
}

const createRestoreCursor = (size: number) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="rgba(139,92,246,0.3)" stroke="white" stroke-width="2"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="none" stroke="#8B5CF6" stroke-width="1"/>
  </svg>`
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, crosshair`
}

// Background color presets
const BG_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Purple', value: '#A855F7' },
]

// Output size presets
const SIZE_PRESETS = [
  { name: 'Original', value: 'original' },
  { name: '1920×1080', value: '1920x1080' },
  { name: '1280×720', value: '1280x720' },
  { name: '1080×1080', value: '1080x1080' },
  { name: '800×600', value: '800x600' },
  { name: 'Custom', value: 'custom' },
]

// HEIC/HEIF support for iPhone photos
const isHeicFile = (file: File): boolean => {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  return type === 'image/heic' || type === 'image/heif' || 
         name.endsWith('.heic') || name.endsWith('.heif')
}

const isValidImageFile = (file: File): boolean => {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  
  // Standard image types
  if (type.startsWith('image/')) return true
  
  // HEIC/HEIF (iPhone) - type might be empty in some browsers
  if (name.endsWith('.heic') || name.endsWith('.heif')) return true
  
  // Common image extensions as fallback
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']
  if (imageExtensions.some(ext => name.endsWith(ext))) return true
  
  return false
}

// Convert HEIC to JPEG using heic2any library
const convertHeicToJpeg = async (file: File): Promise<File> => {
  try {
    // Dynamic import of heic2any
    const heic2any = (await import('heic2any')).default
    
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    })
    
    // heic2any can return array or single blob
    const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
    
    const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
    return new File([resultBlob], newName, { type: 'image/jpeg' })
    
  } catch (heicError) {
    console.warn('heic2any failed, trying canvas fallback:', heicError)
    
    // Fallback: Try native browser decoding (works on some iOS versions)
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(url)
        reject(new Error('Image loading timeout'))
      }, 10000)
      
      img.onload = () => {
        clearTimeout(timeout)
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            URL.revokeObjectURL(url)
            reject(new Error('Failed to create canvas context'))
            return
          }
          
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url)
              if (blob) {
                const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
                resolve(new File([blob], newName, { type: 'image/jpeg' }))
              } else {
                reject(new Error('Failed to convert image'))
              }
            },
            'image/jpeg',
            0.92
          )
        } catch (err) {
          URL.revokeObjectURL(url)
          reject(err)
        }
      }
      
      img.onerror = () => {
        clearTimeout(timeout)
        URL.revokeObjectURL(url)
        reject(new Error('Browser cannot decode this image format'))
      }
      
      img.src = url
    })
  }
}

export default function BgEraserClient() {
  // State
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [selectedBgColor, setSelectedBgColor] = useState('transparent')
  const [modelLoaded, setModelLoaded] = useState(false)
  const [showMobileWarning, setShowMobileWarning] = useState(false)
  const [lowMemoryMode, setLowMemoryMode] = useState(false)
  
  // Edit mode state
  const [editTool, setEditTool] = useState<EditTool>('eraser')
  const [brushSize, setBrushSize] = useState(30)  // Larger default for mobile
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  
  // Pinch zoom state
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)
  const [initialZoom, setInitialZoom] = useState(1)
  
  // Output options
  const [outputSizePreset, setOutputSizePreset] = useState('original')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<any>(null)
  const processorRef = useRef<any>(null)
  const editCanvasRef = useRef<HTMLCanvasElement>(null)
  const lastDrawPoint = useRef<{ x: number; y: number } | null>(null)

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  // Get loading message based on progress
  const getLoadingMessage = (p: number): string => {
    if (p < 15) return "Initializing..."
    if (p < 50) return "Loading AI model..."
    if (p < 70) return "Preparing processor..."
    if (p < 80) return "Analyzing image..."
    if (p < 90) return "Working some magic... ✨"
    if (p < 95) return "Applying mask..."
    return "Almost done!"
  }

  // Dismiss mobile warning
  const dismissMobileWarning = () => {
    setShowMobileWarning(false)
    sessionStorage.setItem('mobileWarningShown', 'true')
  }

  // Load AI model
  const loadModel = async () => {
    if (modelRef.current && processorRef.current) {
      return
    }

    setStatus('loading-model')
    setProgress(5)

    try {
      const { AutoModel, AutoProcessor, env } = await import('@huggingface/transformers')
      env.allowLocalModels = false
      
      setProgress(10)

      const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
        progress_callback: (progressInfo: any) => {
          if (progressInfo.status === 'progress') {
            const pct = Math.round(10 + (progressInfo.progress * 0.4))
            setProgress(pct)
          }
        }
      })
      
      setProgress(50)
      
      const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
        progress_callback: (progressInfo: any) => {
          if (progressInfo.status === 'progress') {
            const pct = Math.round(50 + (progressInfo.progress * 0.2))
            setProgress(pct)
          }
        }
      })

      modelRef.current = model
      processorRef.current = processor
      setProgress(70)
      setModelLoaded(true)
      
    } catch (err) {
      console.error('Model loading error:', err)
      throw new Error("Couldn't load the AI model. Please try again.")
    }
  }

  // Remove background
  const removeBackground = async (file: File): Promise<{ blob: Blob; width: number; height: number }> => {
    await loadModel()

    const { RawImage } = await import('@huggingface/transformers')

    setStatus('processing')
    setProgress(72)

    const imageUrl = URL.createObjectURL(file)
    
    try {
      const image = await RawImage.fromURL(imageUrl)
      
      let processImage = image
      if (image.width > MAX_DIMENSION || image.height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(image.width, image.height)
        const newWidth = Math.round(image.width * scale)
        const newHeight = Math.round(image.height * scale)
        processImage = await image.resize(newWidth, newHeight)
      }

      setProgress(75)

      const { pixel_values } = await processorRef.current(processImage)
      
      setProgress(80)
      
      const { output } = await modelRef.current({ input: pixel_values })

      setProgress(88)

      const maskTensor = output[0]
      const maskImage = await RawImage.fromTensor(
        maskTensor.mul(255).clamp(0, 255).to('uint8')
      )
      const resizedMask = await maskImage.resize(processImage.width, processImage.height)

      setProgress(92)

      const canvas = document.createElement('canvas')
      canvas.width = processImage.width
      canvas.height = processImage.height
      const ctx = canvas.getContext('2d')!
      
      const origCanvas = processImage.toCanvas()
      ctx.drawImage(origCanvas, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      
      const maskData = resizedMask.data
      const maskChannels = maskData.length / (canvas.width * canvas.height)
      
      for (let i = 0; i < canvas.width * canvas.height; i++) {
        let maskValue: number
        if (maskChannels === 1) {
          maskValue = maskData[i]
        } else {
          maskValue = maskData[i * maskChannels]
        }
        pixels[i * 4 + 3] = maskValue
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      setProgress(98)
      
      const resultBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      })
      
      setProgress(100)
      
      return { 
        blob: resultBlob, 
        width: processImage.width,
        height: processImage.height
      }

    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    // Check if valid image file (including HEIC/HEIF)
    if (!isValidImageFile(file)) {
      setError("Please select an image file (PNG, JPG, WebP, or HEIC)")
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
    setHistory([])
    setHistoryIndex(-1)
    setZoom(1)
    setPan({ x: 0, y: 0 })

    // Convert HEIC to JPEG if needed (for iPhone photos)
    let processFile = file
    if (isHeicFile(file)) {
      try {
        setProgress(1)
        processFile = await convertHeicToJpeg(file)
        setProgress(3)
      } catch (err) {
        console.error('HEIC conversion error:', err)
        setError("Couldn't process this photo format. Try taking a screenshot of the photo and using that instead.")
        setStatus('error')
        return
      }
    }

    const originalUrl = URL.createObjectURL(processFile)

    setProcessedImage({
      originalUrl,
      resultUrl: '',
      originalFile: processFile,
      resultBlob: null,
      width: 0,
      height: 0
    })

    try {
      const { blob, width, height } = await removeBackground(processFile)
      const resultUrl = URL.createObjectURL(blob)

      setProcessedImage({
        originalUrl,
        resultUrl,
        originalFile: processFile,
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
  }, [MAX_FILE_SIZE])

  // Initialize edit canvas
  const initEditCanvas = useCallback(async () => {
    if (!processedImage?.resultBlob || !editCanvasRef.current) return

    const canvas = editCanvasRef.current
    const ctx = canvas.getContext('2d')!
    
    const img = await createImageBitmap(processedImage.resultBlob)
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    
    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    initialEditImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([{ imageData: initialState }])
    setHistoryIndex(0)
  }, [processedImage?.resultBlob])

  // Enter edit mode
  const enterEditMode = useCallback(() => {
    setStatus('editing')
    setTimeout(() => {
      initEditCanvas()
    }, 100)
  }, [initEditCanvas])

  // Save to history
  const saveToHistory = useCallback(() => {
    if (!editCanvasRef.current) return
    
    const ctx = editCanvasRef.current.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, editCanvasRef.current.width, editCanvasRef.current.height)
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ imageData })
    
    // Limit history (less on mobile to save memory)
    const maxHistory = isMobile ? 10 : 20
    if (newHistory.length > maxHistory) {
      newHistory.shift()
    }
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex, isMobile])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0 || !editCanvasRef.current) return
    
    const newIndex = historyIndex - 1
    const ctx = editCanvasRef.current.getContext('2d')!
    ctx.putImageData(history[newIndex].imageData, 0, 0)
    setHistoryIndex(newIndex)
  }, [history, historyIndex])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !editCanvasRef.current) return
    
    const newIndex = historyIndex + 1
    const ctx = editCanvasRef.current.getContext('2d')!
    ctx.putImageData(history[newIndex].imageData, 0, 0)
    setHistoryIndex(newIndex)
  }, [history, historyIndex])

  // Get canvas coordinates from mouse/touch event
  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!editCanvasRef.current) return null
    
    const canvas = editCanvasRef.current
    const rect = canvas.getBoundingClientRect()
    
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
    
    const canvasX = (cssX / rect.width) * canvas.width
    const canvasY = (cssY / rect.height) * canvas.height
    
    return { x: canvasX, y: canvasY }
  }, [])

  // Calculate pinch distance
  const getPinchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Draw line between two points
  const drawLine = useCallback((ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dist = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2)
    const steps = Math.max(1, Math.floor(dist / 2))
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = from.x + (to.x - from.x) * t
      const y = from.y + (to.y - from.y) * t
      
      if (editTool === 'eraser') {
        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      } else if (editTool === 'restore' && initialEditImageData) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
        ctx.clip()
        
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = initialEditImageData.width
        tempCanvas.height = initialEditImageData.height
        const tempCtx = tempCanvas.getContext('2d')!
        tempCtx.putImageData(initialEditImageData, 0, 0)
        
        ctx.drawImage(tempCanvas, 0, 0)
        ctx.restore()
      }
    }
  }, [editTool, brushSize])

  // Handle pointer down
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    
    // Check for pinch zoom (2 fingers)
    if ('touches' in e && e.touches.length === 2) {
      const distance = getPinchDistance(e.touches)
      if (distance) {
        setInitialPinchDistance(distance)
        setInitialZoom(zoom)
      }
      return
    }
    
    if (editTool === 'pan') {
      setIsPanning(true)
      let clientX: number, clientY: number
      if ('touches' in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      setLastPanPoint({ x: clientX, y: clientY })
    } else {
      const coords = getCanvasCoords(e)
      if (!coords || !editCanvasRef.current) return
      
      setIsDrawing(true)
      lastDrawPoint.current = coords
      
      const ctx = editCanvasRef.current.getContext('2d')!
      drawLine(ctx, coords, coords)
    }
  }, [editTool, getCanvasCoords, drawLine, zoom])

  // Handle pointer move
  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    
    // Handle pinch zoom
    if ('touches' in e && e.touches.length === 2 && initialPinchDistance) {
      const newDistance = getPinchDistance(e.touches)
      if (newDistance) {
        const scale = newDistance / initialPinchDistance
        const newZoom = Math.max(0.5, Math.min(3, initialZoom * scale))
        setZoom(newZoom)
      }
      return
    }
    
    if (editTool === 'pan' && isPanning) {
      let clientX: number, clientY: number
      if ('touches' in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      
      const dx = clientX - lastPanPoint.x
      const dy = clientY - lastPanPoint.y
      
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
      setLastPanPoint({ x: clientX, y: clientY })
    } else if (isDrawing && editCanvasRef.current) {
      const coords = getCanvasCoords(e)
      if (!coords) return
      
      const ctx = editCanvasRef.current.getContext('2d')!
      
      if (lastDrawPoint.current) {
        drawLine(ctx, lastDrawPoint.current, coords)
      }
      
      lastDrawPoint.current = coords
    }
  }, [editTool, isPanning, isDrawing, lastPanPoint, getCanvasCoords, drawLine, initialPinchDistance, initialZoom])

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    if (isDrawing) {
      saveToHistory()
    }
    setIsDrawing(false)
    setIsPanning(false)
    setInitialPinchDistance(null)
    lastDrawPoint.current = null
  }, [isDrawing, saveToHistory])

  // Finish editing
  const finishEditing = useCallback(async () => {
    if (!editCanvasRef.current) return
    
    const canvas = editCanvasRef.current
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png')
    })
    
    const resultUrl = URL.createObjectURL(blob)
    
    if (processedImage) {
      URL.revokeObjectURL(processedImage.resultUrl)
      setProcessedImage({
        ...processedImage,
        resultUrl,
        resultBlob: blob
      })
    }
    
    setStatus('done')
  }, [processedImage])

  // Calculate output dimensions
  const getOutputDimensions = useCallback(() => {
    if (!processedImage) return { width: 0, height: 0 }
    
    const origWidth = processedImage.width
    const origHeight = processedImage.height
    const aspectRatio = origWidth / origHeight
    
    if (outputSizePreset === 'original') {
      return { width: origWidth, height: origHeight }
    }
    
    if (outputSizePreset === 'custom') {
      let w = parseInt(customWidth) || origWidth
      let h = parseInt(customHeight) || origHeight
      
      if (maintainAspectRatio) {
        if (customWidth && !customHeight) {
          h = Math.round(w / aspectRatio)
        } else if (customHeight && !customWidth) {
          w = Math.round(h * aspectRatio)
        }
      }
      
      return { width: w, height: h }
    }
    
    const [w, h] = outputSizePreset.split('x').map(Number)
    return { width: w, height: h }
  }, [processedImage, outputSizePreset, customWidth, customHeight, maintainAspectRatio])

  // Download
  const handleDownload = useCallback(async (format: OutputFormat) => {
    if (!processedImage?.resultBlob) return

    const { width, height } = getOutputDimensions()
    
    const img = await createImageBitmap(processedImage.resultBlob)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    if (format === 'jpg') {
      ctx.fillStyle = selectedBgColor === 'transparent' ? '#FFFFFF' : selectedBgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.drawImage(img, 0, 0, width, height)
    
    let blob: Blob
    let extension: string
    
    if (format === 'svg') {
      const dataUrl = canvas.toDataURL('image/png')
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" xlink:href="${dataUrl}"/>
</svg>`
      blob = new Blob([svgContent], { type: 'image/svg+xml' })
      extension = 'svg'
    } else {
      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png'
      blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), mimeType, 0.92)
      })
      extension = format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png'
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const baseName = processedImage.originalFile.name.replace(/\.[^/.]+$/, '')
    a.download = `${baseName}-no-bg-${width}x${height}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [processedImage, selectedBgColor, getOutputDimensions])

  // Drag and drop handlers
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
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

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
    setHistory([])
    setHistoryIndex(-1)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    initialEditImageData = null
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processedImage])

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

  // Mobile/Tablet detection for UI
  const isTouchDevice = isMobile || isTablet

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
      {/* Mobile Warning Modal */}
      {showMobileWarning && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-violet-400" />
              <h3 className="text-lg font-bold text-white">Mobile Device Detected</h3>
            </div>
            <div className="text-gray-300 text-sm space-y-2">
              <p>This tool works on mobile, but please note:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>AI model is ~176MB (use WiFi)</li>
                <li>Processing may be slower</li>
                <li>Max image size: {formatFileSize(MAX_FILE_SIZE)}</li>
              </ul>
            </div>
            <button
              onClick={dismissMobileWarning}
              className="w-full py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Got it, continue
            </button>
          </div>
        </div>
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

              <p className="text-xs md:text-sm text-gray-500">PNG, JPG, WebP • Max {formatFileSize(MAX_FILE_SIZE)}</p>
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
        )}

        {/* Processing State */}
        {(status === 'loading-model' || status === 'processing') && (
          <div className="space-y-4 md:space-y-6">
            {processedImage?.originalUrl && (
              <div className="relative rounded-2xl overflow-hidden bg-gray-800 max-h-60 md:max-h-80 flex items-center justify-center">
                <img 
                  src={processedImage.originalUrl} 
                  alt="Your image" 
                  className="max-w-full max-h-60 md:max-h-80 object-contain opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                </div>
              </div>
            )}

            <div className="w-full max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                <span className="text-white font-medium text-sm md:text-base">{getLoadingMessage(progress)}</span>
              </div>
              
              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <p className="text-center text-sm text-gray-400">{progress}% complete</p>

              {!modelLoaded && progress < 70 && (
                <p className="text-center text-xs text-gray-500">
                  {isTouchDevice 
                    ? 'First time? Model will be cached for next time.'
                    : 'First time? The AI model (~176MB) will be cached for faster use next time.'
                  }
                </p>
              )}
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {status === 'editing' && processedImage && (
          <div className="space-y-3 md:space-y-4">
            {/* Desktop Toolbar */}
            {!isTouchDevice && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditTool('eraser')}
                    className={`p-2 rounded-lg transition-colors ${editTool === 'eraser' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    title="Eraser"
                  >
                    <Eraser className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditTool('restore')}
                    className={`p-2 rounded-lg transition-colors ${editTool === 'restore' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    title="Restore"
                  >
                    <Paintbrush className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditTool('pan')}
                    className={`p-2 rounded-lg transition-colors ${editTool === 'pan' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    title="Pan"
                  >
                    <Move className="w-5 h-5" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-600 mx-2" />
                  
                  <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Undo2 className="w-5 h-5" />
                  </button>
                  <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Redo2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Size:</span>
                    <input type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 accent-violet-500" />
                    <span className="text-sm text-white w-8">{brushSize}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-white w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Canvas */}
            <div 
              className="relative overflow-auto rounded-2xl bg-gray-900 flex items-center justify-center"
              style={{ 
                height: isTouchDevice ? '50vh' : '400px',
                minHeight: '250px',
                backgroundImage: 'linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            >
              <canvas
                ref={editCanvasRef}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  cursor: isTouchDevice 
                    ? 'default'
                    : editTool === 'pan' 
                      ? (isPanning ? 'grabbing' : 'grab')
                      : editTool === 'eraser'
                        ? createEraserCursor(Math.max(16, Math.min(brushSize, 64)))
                        : createRestoreCursor(Math.max(16, Math.min(brushSize, 64))),
                  maxWidth: '100%',
                  maxHeight: '100%',
                  touchAction: 'none',
                }}
              />
            </div>

            {/* Mobile Toolbar - Bottom Fixed */}
            {isTouchDevice && (
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 p-3 z-40">
                <div className="max-w-lg mx-auto space-y-3">
                  {/* Tool buttons */}
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setEditTool('eraser')}
                      className={`flex-1 max-w-[100px] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                        editTool === 'eraser' ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      <Eraser className="w-6 h-6" />
                      <span className="text-xs">Eraser</span>
                    </button>
                    <button
                      onClick={() => setEditTool('restore')}
                      className={`flex-1 max-w-[100px] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                        editTool === 'restore' ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      <Paintbrush className="w-6 h-6" />
                      <span className="text-xs">Restore</span>
                    </button>
                    <button
                      onClick={() => setEditTool('pan')}
                      className={`flex-1 max-w-[100px] py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                        editTool === 'pan' ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      <Move className="w-6 h-6" />
                      <span className="text-xs">Move</span>
                    </button>
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="flex-1 max-w-[80px] py-3 rounded-xl flex flex-col items-center gap-1 bg-gray-800 text-gray-300 disabled:opacity-40"
                    >
                      <Undo2 className="w-6 h-6" />
                      <span className="text-xs">Undo</span>
                    </button>
                  </div>
                  
                  {/* Brush size slider */}
                  <div className="flex items-center gap-3 px-2">
                    <span className="text-xs text-gray-400 w-8">Size</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={brushSize} 
                      onChange={(e) => setBrushSize(Number(e.target.value))} 
                      className="flex-1 accent-violet-500 h-2"
                    />
                    <span className="text-sm text-white w-8 text-right">{brushSize}</span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStatus('done')}
                      className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={finishEditing}
                      className="flex-1 py-3 bg-violet-500 text-white rounded-xl font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop hint and buttons */}
            {!isTouchDevice && (
              <>
                <p className="text-xs text-gray-500 text-center">
                  💡 Use Eraser to remove unwanted areas, Restore to bring back parts
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setStatus('done')} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                    Cancel
                  </button>
                  <button onClick={finishEditing} className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 font-semibold">
                    Done Editing
                  </button>
                </div>
              </>
            )}
            
            {/* Spacer for mobile toolbar */}
            {isTouchDevice && <div className="h-48" />}
          </div>
        )}

        {/* Result State */}
        {status === 'done' && processedImage && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm font-medium text-gray-400 text-center">Original</p>
                <div className="rounded-xl md:rounded-2xl overflow-hidden bg-gray-800 aspect-square flex items-center justify-center p-2 md:p-4">
                  <img src={processedImage.originalUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
              
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm font-medium text-gray-400 text-center">Result ✨</p>
                <div 
                  className="rounded-xl md:rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-2 md:p-4"
                  style={{
                    backgroundColor: selectedBgColor === 'transparent' ? undefined : selectedBgColor,
                    backgroundImage: selectedBgColor === 'transparent' 
                      ? 'linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)'
                      : undefined,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                >
                  <img src={processedImage.resultUrl} alt="Result" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-green-400 font-medium flex items-center justify-center gap-2 text-sm md:text-base">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                Done! Your image is ready.
              </p>
            </div>

            {/* Edit Button */}
            <div className="flex justify-center">
              <button
                onClick={enterEditMode}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm md:text-base"
              >
                <Eraser className="w-4 h-4" />
                Manual Edit
              </button>
            </div>

            {/* Background Color Picker */}
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-gray-400 text-center">Preview background:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {BG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedBgColor(color.value)}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 transition-all ${
                      selectedBgColor === color.value ? 'border-violet-500 scale-110' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    style={{ 
                      backgroundColor: color.value !== 'transparent' ? color.value : undefined,
                      backgroundImage: color.value === 'transparent' 
                        ? 'linear-gradient(45deg,#374151 25%,transparent 25%),linear-gradient(-45deg,#374151 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#374151 75%),linear-gradient(-45deg,transparent 75%,#374151 75%)'
                        : undefined,
                      backgroundSize: '10px 10px'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Output Options */}
            <div className="p-3 md:p-4 bg-gray-800 rounded-xl space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs md:text-sm font-medium text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-violet-400" />
                  Output Size
                </label>
                <p className="text-xs text-violet-400">
                  {getOutputDimensions().width} × {getOutputDimensions().height} px
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setOutputSizePreset(preset.value)}
                    className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-lg transition-colors ${
                      outputSizePreset === preset.value 
                        ? 'bg-violet-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {outputSizePreset === 'custom' && (
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <input
                    type="number"
                    placeholder="Width"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="w-20 md:w-24 px-2 md:px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  />
                  <span className="text-gray-400">×</span>
                  <input
                    type="number"
                    placeholder="Height"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="w-20 md:w-24 px-2 md:px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="accent-violet-500"
                    />
                    Keep ratio
                  </label>
                </div>
              )}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              <button onClick={() => handleDownload('png')} className="inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/25 text-sm md:text-base">
                <Download className="w-4 h-4 md:w-5 md:h-5" />PNG
              </button>
              <button onClick={() => handleDownload('webp')} className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2.5 md:py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors text-sm md:text-base">
                <Download className="w-4 h-4 md:w-5 md:h-5" />WebP
              </button>
              <button onClick={() => handleDownload('jpg')} className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2.5 md:py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors text-sm md:text-base">
                <Download className="w-4 h-4 md:w-5 md:h-5" />JPG
              </button>
              {!isTouchDevice && (
                <button onClick={() => handleDownload('svg')} className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2.5 md:py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors text-sm md:text-base">
                  <Download className="w-4 h-4 md:w-5 md:h-5" />SVG
                </button>
              )}
            </div>

            <div className="text-center">
              <button onClick={handleReset} className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors text-sm md:text-base">
                <RefreshCw className="w-4 h-4" />Try another image
              </button>
            </div>
          </div>
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