'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useEditor } from '../../contexts/EditorContext'
import { Layer } from '../../types'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { state, addLayer } = useEditor()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = state.canvas.width
    canvas.height = state.canvas.height

    // Clear canvas
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw checkerboard pattern for transparency
    const patternSize = 10
    ctx.fillStyle = '#374151'
    for (let x = 0; x < canvas.width; x += patternSize * 2) {
      for (let y = 0; y < canvas.height; y += patternSize * 2) {
        ctx.fillRect(x, y, patternSize, patternSize)
        ctx.fillRect(x + patternSize, y + patternSize, patternSize, patternSize)
      }
    }

    // Render layers
    renderLayers()
  }, [state.canvas, state.layers])

  const renderLayers = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and redraw background
    ctx.save()
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw checkerboard
    const patternSize = 10
    ctx.fillStyle = '#374151'
    for (let x = 0; x < canvas.width; x += patternSize * 2) {
      for (let y = 0; y < canvas.height; y += patternSize * 2) {
        ctx.fillRect(x, y, patternSize, patternSize)
        ctx.fillRect(x + patternSize, y + patternSize, patternSize, patternSize)
      }
    }

    // Draw each visible layer
    state.layers.forEach(layer => {
      if (!layer.visible || !layer.data) return

      ctx.globalAlpha = layer.opacity / 100
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation

      // Create temporary canvas for layer
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = layer.size.width
      tempCanvas.height = layer.size.height
      const tempCtx = tempCanvas.getContext('2d')
      
      if (tempCtx && layer.data) {
        tempCtx.putImageData(layer.data, 0, 0)
        ctx.drawImage(tempCanvas, layer.position.x, layer.position.y)
      }
    })

    ctx.restore()
  }, [state.layers])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Create new layer from image
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = img.width
        tempCanvas.height = img.height
        const tempCtx = tempCanvas.getContext('2d')
        
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0)
          const imageData = tempCtx.getImageData(0, 0, img.width, img.height)

          const newLayer: Layer = {
            id: `layer-${Date.now()}`,
            name: file.name,
            type: 'image',
            visible: true,
            opacity: 100,
            blendMode: 'normal',
            locked: false,
            data: imageData,
            position: { x: 0, y: 0 },
            size: { width: img.width, height: img.height },
            filters: [],
          }

          addLayer(newLayer)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [addLayer])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = img.width
        tempCanvas.height = img.height
        const tempCtx = tempCanvas.getContext('2d')
        
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0)
          const imageData = tempCtx.getImageData(0, 0, img.width, img.height)

          const newLayer: Layer = {
            id: `layer-${Date.now()}`,
            name: file.name,
            type: 'image',
            visible: true,
            opacity: 100,
            blendMode: 'normal',
            locked: false,
            data: imageData,
            position: { x: 0, y: 0 },
            size: { width: img.width, height: img.height },
            filters: [],
          }

          addLayer(newLayer)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [addLayer])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const exportImage = useCallback((format: 'png' | 'jpeg' | 'webp' = 'png') => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image.${format}`
      a.click()
      URL.revokeObjectURL(url)
    }, `image/${format}`)
  }, [])

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Canvas container */}
      <div
        className={`relative bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all ${
          isDragging ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          transform: `scale(${state.canvas.zoom})`,
          transformOrigin: 'center',
        }}
      >
        <canvas
          ref={canvasRef}
          className="block"
          style={{
            transform: `
              rotate(${state.canvas.rotation}deg)
              scaleX(${state.canvas.flipX ? -1 : 1})
              scaleY(${state.canvas.flipY ? -1 : 1})
              translate(${state.canvas.panX}px, ${state.canvas.panY}px)
            `,
          }}
        />

        {/* Empty state */}
        {state.layers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-400 mb-2">Drop an image here or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors pointer-events-auto"
              >
                Choose File
              </button>
            </div>
          </div>
        )}

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-white text-lg font-medium">Drop to add</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick export buttons */}
      {state.layers.length > 0 && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => exportImage('png')}
            className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            PNG
          </button>
          <button
            onClick={() => exportImage('jpeg')}
            className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            JPEG
          </button>
          <button
            onClick={() => exportImage('webp')}
            className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            WebP
          </button>
        </div>
      )}
    </div>
  )
}