'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FileText, Download, Scissors } from 'lucide-react'

// Paper sizes in mm (width x height)
const PAPER_SIZES = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  B5: { width: 182, height: 257 },
}

const DPI_OPTIONS = [72, 96, 150, 300]

export default function ImageSplitterClient() {
  const [mode, setMode] = useState<'paper' | 'height' | 'count' | 'manual'>('paper')
  const [paperSize, setPaperSize] = useState<'A4' | 'A5' | 'B5'>('A4')
  const [dpi, setDpi] = useState(96)
  const [heightPx, setHeightPx] = useState(900)
  const [count, setCount] = useState(3)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [splitParts, setSplitParts] = useState<string[]>([])
  const [manualSplits, setManualSplits] = useState<number[]>([])
  const [downloadType, setDownloadType] = useState<'merged' | 'separate'>('merged')
  const imageRef = useRef<HTMLImageElement>(null)

  // Calculate paper height in pixels
  const getPaperHeightPx = () => {
    const paper = PAPER_SIZES[paperSize]
    return Math.round((paper.height / 25.4) * dpi)
  }

  const onFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return

    const im = new Image()
    im.onload = () => {
      setImg(im)
      setPreview(im.src)
      if (mode === 'manual') {
        const defaultSplits = []
        for (let i = 1; i < 3; i++) {
          defaultSplits.push(Math.floor((im.height * i) / 3))
        }
        setManualSplits(defaultSplits)
      }
    }
    im.src = URL.createObjectURL(file)
  }

  useEffect(() => {
    if (!img) return

    let splitLines: number[] = []

    if (mode === 'paper') {
      const paperHeight = getPaperHeightPx()
      splitLines = []
      let y = paperHeight
      while (y < img.height) {
        splitLines.push(y)
        y += paperHeight
      }
    } else if (mode === 'height') {
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

    generateSplitPreviews(splitLines)
  }, [img, mode, paperSize, dpi, heightPx, count, manualSplits])

  const generateSplitPreviews = (splitLines: number[]) => {
    if (!img) return

    const parts: string[] = []
    const w = img.width
    let lastY = 0

    const createPart = (startY: number, height: number) => {
      const c = document.createElement('canvas')
      c.width = w
      c.height = height
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, startY, w, height, 0, 0, w, height)
      return c
    }

    splitLines.forEach((y) => {
      const h = y - lastY
      const canvas = createPart(lastY, h)
      parts.push(canvas.toDataURL('image/png'))
      lastY = y
    })

    if (lastY < img.height) {
      const h = img.height - lastY
      const canvas = createPart(lastY, h)
      parts.push(canvas.toDataURL('image/png'))
    }

    setSplitParts(parts)
  }

  const downloadMerged = () => {
    if (!img || splitParts.length === 0) return

    let splitLines: number[] = []

    if (mode === 'paper') {
      const paperHeight = getPaperHeightPx()
      splitLines = []
      let y = paperHeight
      while (y < img.height) {
        splitLines.push(y)
        y += paperHeight
      }
    } else if (mode === 'height') {
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

    // Merge horizontally
    const totalW = w * parts.length
    const maxH = parts.reduce((m, c) => Math.max(m, c.height), 0)

    const m = document.createElement('canvas')
    m.width = totalW
    m.height = maxH
    const ctx = m.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, m.width, m.height)

    parts.forEach((c, i) => ctx.drawImage(c, i * w, 0))

    m.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `split-${mode === 'paper' ? paperSize : mode}-merged.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const downloadSeparate = () => {
    splitParts.forEach((dataUrl, index) => {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `split-part-${(index + 1).toString().padStart(2, '0')}.png`
      a.click()
    })
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-500/10')
    onFile(e.dataTransfer.files?.[0] ?? null)
  }

  const addSplitLine = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !img || mode !== 'manual') return
    const rect = imageRef.current.getBoundingClientRect()
    const scale = imageRef.current.offsetHeight / img.height
    const y = Math.round((e.clientY - rect.top) / scale)

    if (y > 10 && y < img.height - 10) {
      setManualSplits((prev) => [...prev, y].sort((a, b) => a - b))
    }
  }

  const removeSplitLine = (index: number) => {
    setManualSplits((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto px-4 pt-2 pb-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <label className="relative">
              <input
                type="radio"
                name="splitMode"
                checked={mode === 'paper'}
                onChange={() => setMode('paper')}
                className="peer sr-only"
              />
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 cursor-pointer text-center transition-all">
                <FileText className="w-4 h-4 inline-block mb-1 text-cyan-400" />
                <div className="text-xs text-white">Paper Size</div>
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="splitMode"
                checked={mode === 'height'}
                onChange={() => setMode('height')}
                className="peer sr-only"
              />
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 cursor-pointer text-center transition-all">
                <div className="text-xs text-white">By Height</div>
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="splitMode"
                checked={mode === 'count'}
                onChange={() => setMode('count')}
                className="peer sr-only"
              />
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 cursor-pointer text-center transition-all">
                <div className="text-xs text-white">By Count</div>
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="splitMode"
                checked={mode === 'manual'}
                onChange={() => {
                  setMode('manual')
                  if (img && manualSplits.length === 0) {
                    const defaultSplits = []
                    for (let i = 1; i < 3; i++) {
                      defaultSplits.push(Math.floor((img.height * i) / 3))
                    }
                    setManualSplits(defaultSplits)
                  }
                }}
                className="peer sr-only"
              />
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 peer-checked:bg-cyan-500/20 peer-checked:border-cyan-500 cursor-pointer text-center transition-all">
                <div className="text-xs text-white">Manual</div>
              </div>
            </label>
          </div>

          {/* Mode-specific Options */}
          <div className="flex flex-wrap items-center gap-4">
            {mode === 'paper' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300">Size:</label>
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value as 'A4' | 'A5' | 'B5')}
                    className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white text-sm"
                  >
                    <option value="A4">A4 (210×297mm)</option>
                    <option value="A5">A5 (148×210mm)</option>
                    <option value="B5">B5 (182×257mm)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300">DPI:</label>
                  <select
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value))}
                    className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white text-sm"
                  >
                    {DPI_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-cyan-400">= {getPaperHeightPx()}px per page</div>
              </>
            )}

            {mode === 'height' && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Height (px):</label>
                <input
                  type="number"
                  className="w-24 px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
                  min={100}
                  max={5000}
                  value={heightPx}
                  onChange={(e) => setHeightPx(Number(e.target.value))}
                />
              </div>
            )}

            {mode === 'count' && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Parts:</label>
                <input
                  type="number"
                  className="w-20 px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
                  min={2}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
              </div>
            )}

            {/* Download Options */}
            {splitParts.length > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <select
                  value={downloadType}
                  onChange={(e) => setDownloadType(e.target.value as 'merged' | 'separate')}
                  className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white text-sm"
                >
                  <option value="merged">Merged (Side by side)</option>
                  <option value="separate">Separate files</option>
                </select>
                <button
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  onClick={downloadType === 'merged' ? downloadMerged : downloadSeparate}
                >
                  <Download className="inline-block w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            )}
          </div>

          {/* Drop Zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => document.getElementById('split-file')?.click()}
            onKeyDown={(e) =>
              e.key === 'Enter' ? document.getElementById('split-file')?.click() : null
            }
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('border-cyan-400', 'bg-cyan-500/10')
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-500/10')
            }}
            onDrop={handleDrop}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-white/30 text-gray-300 text-center py-12 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            <Scissors className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">Drop a long image here</div>
            <div className="text-sm">or click to select</div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-6">
              {/* Original with Split Lines */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Original Image</h3>
                  {mode === 'manual' && (
                    <span className="text-cyan-400 text-xs">Click to add split line</span>
                  )}
                </div>
                <div className="max-h-96 overflow-auto">
                  <div className="relative inline-block">
                    <img
                      ref={imageRef}
                      src={preview}
                      alt="original"
                      className="max-w-full cursor-crosshair"
                      style={{ maxHeight: '400px' }}
                      onClick={mode === 'manual' ? addSplitLine : undefined}
                    />

                    {/* Manual split lines */}
                    {mode === 'manual' && (
                      <div className="absolute inset-0 pointer-events-none">
                        {manualSplits.map((y, index) => (
                          <div
                            key={index}
                            className="absolute w-full"
                            style={{ top: `${(y / img!.height) * 100}%` }}
                          >
                            <div className="w-full h-0.5 bg-cyan-400" />
                            <span className="absolute left-2 -mt-5 bg-black/80 text-cyan-400 text-xs rounded px-2 py-1">
                              {y}px
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeSplitLine(index)
                              }}
                              className="absolute right-2 -mt-8 bg-red-500 hover:bg-red-600 text-white text-xs rounded px-2 py-1 pointer-events-auto"
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

              {/* Split Parts Preview */}
              {splitParts.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">
                    Split Result ({splitParts.length} parts)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {splitParts.map((part, index) => (
                      <div key={index} className="bg-black/20 rounded-lg p-2">
                        <div className="text-xs text-cyan-400 mb-1 text-center">
                          Part {index + 1}
                        </div>
                        <img
                          src={part}
                          alt={`Part ${index + 1}`}
                          className="w-full h-auto rounded"
                        />
                      </div>
                    ))}
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
      </div>
    </div>
  )
}
