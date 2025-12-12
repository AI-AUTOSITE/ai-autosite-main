'use client'

import { useRef, useState, useCallback } from 'react'
import type { EditTool, HistoryState } from '../types'

// Store the initial state of the edited image for restore brush
let initialEditImageData: ImageData | null = null

interface UseEditCanvasOptions {
  resultBlob: Blob | null
  isMobile: boolean
  onFinish: (blob: Blob, url: string) => void
}

export function useEditCanvas({ resultBlob, isMobile, onFinish }: UseEditCanvasOptions) {
  const editCanvasRef = useRef<HTMLCanvasElement>(null)
  const lastDrawPoint = useRef<{ x: number; y: number } | null>(null)
  
  // Edit state
  const [editTool, setEditTool] = useState<EditTool>('eraser')
  const [brushSize, setBrushSize] = useState(30)
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

  // Initialize edit canvas
  const initEditCanvas = useCallback(async () => {
    if (!resultBlob || !editCanvasRef.current) return

    const canvas = editCanvasRef.current
    const ctx = canvas.getContext('2d')!
    
    const img = await createImageBitmap(resultBlob)
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    
    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    initialEditImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([{ imageData: initialState }])
    setHistoryIndex(0)
  }, [resultBlob])

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
    onFinish(blob, resultUrl)
  }, [onFinish])

  // Reset function for cleanup
  const reset = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    initialEditImageData = null
  }, [])

  return {
    editCanvasRef,
    initEditCanvas,
    saveToHistory,
    undo,
    redo,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    finishEditing,
    reset,
    history,
    historyIndex,
    isDrawing,
    isPanning,
    zoom,
    setZoom,
    pan,
    setPan,
    brushSize,
    setBrushSize,
    editTool,
    setEditTool,
  }
}
