'use client'
import React, { useState, useEffect, useRef } from 'react'

export default function SplitMerger() {
  const [mode, setMode] = useState<'height' | 'count' | 'manual'>('height')
  const [heightPx, setHeightPx] = useState(900)
  const [count, setCount] = useState(3)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [splitPreview, setSplitPreview] = useState<string | null>(null)
  const [manualSplits, setManualSplits] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState<number | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  

  const onFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return
    const im = new Image()
    im.onload = () => {
      setImg(im)
      setPreview(im.src)
      // 初期分割線を設定
      if (mode === 'manual') {
        const defaultSplits = []
        for (let i = 1; i < 3; i++) {
          defaultSplits.push(Math.floor(im.height * i / 3))
        }
        setManualSplits(defaultSplits)
      }
    }
    im.src = URL.createObjectURL(file)
  }

  // プレビュー生成
  useEffect(() => {
    if (!img) return
    
    let splitLines: number[] = []
    
    if (mode === 'height') {
      splitLines = []
      let y = heightPx
      while (y < img.height) {
        splitLines.push(y)
        y += heightPx
      }
    } else if (mode === 'count') {
      splitLines = []
      const hUnit = Math.ceil(img.height / count)
      for (let i = 1; i < count; i++) {
        splitLines.push(hUnit * i)
      }
    } else if (mode === 'manual') {
      splitLines = manualSplits
    }

    generateSplitPreview(splitLines)
  }, [img, mode, heightPx, count, manualSplits])

  const generateSplitPreview = (splitLines: number[]) => {
    if (!img) return

    const parts: HTMLCanvasElement[] = []
    const w = img.width
    let lastY = 0

    // 各パーツを作成
    splitLines.forEach((y) => {
      const h = y - lastY
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      c.getContext('2d')!.drawImage(img, 0, lastY, w, h, 0, 0, w, h)
      parts.push(c)
      lastY = y
    })

    // 最後のパーツ
    if (lastY < img.height) {
      const h = img.height - lastY
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      c.getContext('2d')!.drawImage(img, 0, lastY, w, h, 0, 0, w, h)
      parts.push(c)
    }

    // マージプレビュー作成
    const scale = Math.min(0.5, 800 / img.width)
    const totalW = w * parts.length * scale
    const maxH = parts.reduce((m, c) => Math.max(m, c.height), 0) * scale
    
    const m = document.createElement('canvas')
    m.width = totalW
    m.height = maxH
    const ctx = m.getContext('2d')!
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, m.width, m.height)
    
    parts.forEach((c, i) => {
      ctx.drawImage(c, i * w * scale, 0, w * scale, c.height * scale)
      // 分割線を描画
      if (i > 0) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(i * w * scale, 0)
        ctx.lineTo(i * w * scale, maxH)
        ctx.stroke()
      }
    })

    m.toBlob((blob) => {
      if (blob) {
        if (splitPreview) URL.revokeObjectURL(splitPreview)
        setSplitPreview(URL.createObjectURL(blob))
      }
    }, 'image/png')
  }

  const process = () => {
    if (!img) return
    
    let splitLines: number[] = []
    
    if (mode === 'height') {
      splitLines = []
      let y = heightPx
      while (y < img.height) {
        splitLines.push(y)
        y += heightPx
      }
    } else if (mode === 'count') {
      splitLines = []
      const hUnit = Math.ceil(img.height / count)
      for (let i = 1; i < count; i++) {
        splitLines.push(hUnit * i)
      }
    } else if (mode === 'manual') {
      splitLines = manualSplits
    }

    const parts: HTMLCanvasElement[] = []
    const w = img.width
    let lastY = 0

    splitLines.forEach((y) => {
      const h = y - lastY
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      c.getContext('2d')!.drawImage(img, 0, lastY, w, h, 0, 0, w, h)
      parts.push(c)
      lastY = y
    })

    if (lastY < img.height) {
      const h = img.height - lastY
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      c.getContext('2d')!.drawImage(img, 0, lastY, w, h, 0, 0, w, h)
      parts.push(c)
    }

    merge(parts, w)
  }

  const merge = (parts: HTMLCanvasElement[], partWidth: number) => {
    const totalW = partWidth * parts.length
    const maxH = parts.reduce((m, c) => Math.max(m, c.height), 0)
    const m = document.createElement('canvas')
    m.width = totalW
    m.height = maxH
    const ctx = m.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, m.width, m.height)
    parts.forEach((c, i) => ctx.drawImage(c, i * partWidth, 0))
    
    m.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'split-merged.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-500/10')
    onFile(e.dataTransfer.files?.[0] ?? null)
  }

  // ドラッグ処理の改良
  const startDrag = (index: number) => {
    setIsDragging(index)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current || !img) return
      
      const rect = imageRef.current.getBoundingClientRect()
      const scale = imageRef.current.offsetHeight / img.height
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top)) / scale

      setManualSplits(prev => {
        const next = [...prev]
        next[index] = Math.max(10, Math.min(img.height - 10, Math.round(y)))
        return next.sort((a, b) => a - b)
      })
    }

    const handleMouseUp = () => {
      setIsDragging(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const addSplitLine = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !img || mode !== 'manual') return
    
    const rect = imageRef.current.getBoundingClientRect()
    const scale = imageRef.current.offsetHeight / img.height
    const y = Math.round((e.clientY - rect.top) / scale)
    
    if (y > 10 && y < img.height - 10) {
      setManualSplits(prev => [...prev, y].sort((a, b) => a - b))
    }
  }

  const removeSplitLine = (index: number) => {
    setManualSplits(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-white cursor-pointer">
          <input
            type="radio"
            name="splitMode"
            checked={mode === 'height'}
            onChange={() => setMode('height')}
            className="w-4 h-4"
          />
          <span>Split by Height (px)</span>
        </label>
        {mode === 'height' && (
          <input
            type="number"
            className="w-24 px-2 py-1 rounded bg-black/30 border border-white/20 text-white"
            min={100}
            max={5000}
            value={heightPx}
            onChange={(e) => setHeightPx(Number(e.target.value))}
          />
        )}

        <label className="inline-flex items-center gap-2 text-white cursor-pointer">
          <input
            type="radio"
            name="splitMode"
            checked={mode === 'count'}
            onChange={() => setMode('count')}
            className="w-4 h-4"
          />
          <span>Split by Count</span>
        </label>
        {mode === 'count' && (
          <input
            type="number"
            className="w-20 px-2 py-1 rounded bg-black/30 border border-white/20 text-white"
            min={2}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        )}

        <label className="inline-flex items-center gap-2 text-white cursor-pointer">
          <input
            type="radio"
            name="splitMode"
            checked={mode === 'manual'}
            onChange={() => {
              setMode('manual')
              if (img && manualSplits.length === 0) {
                const defaultSplits = []
                for (let i = 1; i < 3; i++) {
                  defaultSplits.push(Math.floor(img.height * i / 3))
                }
                setManualSplits(defaultSplits)
              }
            }}
            className="w-4 h-4"
          />
          <span>Manual Split</span>
        </label>

        <button
          className="ml-auto px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={process}
          disabled={!img}
        >
          Split & Merge & Download
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => document.getElementById('split-file')?.click()}
        onKeyDown={(e) => (e.key === 'Enter' ? document.getElementById('split-file')?.click() : null)}
        onDragOver={(e) => {
          e.preventDefault()
          e.currentTarget.classList.add('border-cyan-400', 'bg-cyan-500/10')
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-500/10')
        }}
        onDrop={handleDrop}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-white/30 text-gray-400 text-center py-8 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
      >
        <div className="text-lg font-medium mb-2">Drag & drop a long image here</div>
        <div className="text-sm">or click to select file</div>
      </div>

      {preview && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original with split lines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Original with Split Lines:</h3>
              {mode === 'manual' && (
                <span className="text-cyan-400 text-sm">
                  Click image to add line • Drag lines to move
                </span>
              )}
            </div>
            <div 
              ref={previewRef}
              className="bg-white/5 rounded-xl p-4 max-h-96 overflow-auto relative"
            >
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  ref={imageRef}
                  src={preview} 
                  alt="original" 
                  className="max-w-full cursor-crosshair" 
                  style={{ maxHeight: '400px' }}
                  onClick={mode === 'manual' ? addSplitLine : undefined}
                />
                
                {/* 分割線オーバーレイ */}
                {mode === 'manual' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {manualSplits.map((y, index) => (
                      <div
                        key={index}
                        className="absolute w-full pointer-events-auto"
                        style={{ 
                          top: `${(y / img!.height) * 100}%`,
                        }}
                      >
                        {/* 分割線 */}
                        <div 
                          className="absolute w-full h-4 -mt-2 cursor-ns-resize group"
                          onMouseDown={() => startDrag(index)}
                        >
                          <div className="w-full h-0.5 bg-cyan-400 group-hover:h-1 transition-all mt-2" />
                        </div>
                        
                        {/* ピクセル表示 - 左側に配置 */}
                        <span className="absolute left-2 -mt-5 bg-black/80 text-cyan-400 text-xs rounded px-2 py-1 pointer-events-none">
                          {y}px
                        </span>
                        
                        {/* Removeボタン - 右側に配置、ピクセル表示より上 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSplitLine(index)
                          }}
                          className="absolute right-2 -mt-8 bg-red-500 hover:bg-red-600 text-white text-xs rounded px-2 py-1 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Merged preview */}
          {splitPreview && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Merged Preview:</h3>
              <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={splitPreview} alt="merged preview" className="max-w-full" />
              </div>
            </div>
          )}
        </div>
      )}

      <input
        id="split-file"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </div>
  )
}