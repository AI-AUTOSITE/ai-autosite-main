'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  FileText, Download, Scissors, X, Zap, ChevronDown, ChevronUp,
  Grid3X3, Smartphone, Printer, Instagram, Twitter, Hash
} from 'lucide-react'

// ============================================
// Types & Constants
// ============================================
type SplitMode = 'paper' | 'height' | 'count' | 'manual' | 'preset'
type PaperSize = 'A4' | 'A5' | 'B5' | 'Letter'
type PresetType = 'instagram' | 'twitter' | 'pinterest' | 'custom'
type ExportFormat = 'png' | 'jpeg'

interface Preset {
  name: string
  icon: React.ReactNode
  width: number
  height: number
  description: string
}

const PAPER_SIZES = {
  A4: { width: 210, height: 297, name: 'A4 (210×297mm)' },
  A5: { width: 148, height: 210, name: 'A5 (148×210mm)' },
  B5: { width: 182, height: 257, name: 'B5 (182×257mm)' },
  Letter: { width: 216, height: 279, name: 'US Letter' },
}

const DPI_OPTIONS = [72, 96, 150, 300]

const PRESETS: Record<PresetType, Preset> = {
  instagram: {
    name: 'Instagram Carousel',
    icon: <Instagram className="w-4 h-4" />,
    width: 1080,
    height: 1080,
    description: '1080×1080px squares'
  },
  twitter: {
    name: 'Twitter Header',
    icon: <Twitter className="w-4 h-4" />,
    width: 1500,
    height: 500,
    description: '1500×500px banner'
  },
  pinterest: {
    name: 'Pinterest Pin',
    icon: <Grid3X3 className="w-4 h-4" />,
    width: 1000,
    height: 1500,
    description: '1000×1500px vertical'
  },
  custom: {
    name: 'Custom Size',
    icon: <Scissors className="w-4 h-4" />,
    width: 800,
    height: 800,
    description: 'Custom dimensions'
  }
}

// ============================================
// Main Component
// ============================================
export default function ImageSplitterClient() {
  const [mode, setMode] = useState<SplitMode>('paper')
  const [paperSize, setPaperSize] = useState<PaperSize>('A4')
  const [dpi, setDpi] = useState(96)
  const [heightPx, setHeightPx] = useState(900)
  const [count, setCount] = useState(3)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [splitParts, setSplitParts] = useState<string[]>([])
  const [manualSplits, setManualSplits] = useState<number[]>([])
  const [downloadType, setDownloadType] = useState<'merged' | 'separate'>('separate')
  
  // New settings
  const [presetType, setPresetType] = useState<PresetType>('instagram')
  const [customWidth, setCustomWidth] = useState(800)
  const [customHeight, setCustomHeight] = useState(800)
  const [overlap, setOverlap] = useState(0)
  const [showNumbers, setShowNumbers] = useState(true)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [jpegQuality, setJpegQuality] = useState(92)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const imageRef = useRef<HTMLImageElement>(null)

  // Calculate paper height in pixels
  const getPaperHeightPx = useCallback(() => {
    const paper = PAPER_SIZES[paperSize]
    return Math.round((paper.height / 25.4) * dpi)
  }, [paperSize, dpi])

  // Get preset dimensions
  const getPresetHeight = useCallback(() => {
    if (presetType === 'custom') return customHeight
    return PRESETS[presetType].height
  }, [presetType, customHeight])

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

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setImg(null)
    setPreview(null)
    setSplitParts([])
    setManualSplits([])
  }

  // Generate split previews
  useEffect(() => {
    if (!img) return

    let splitLines: number[] = []
    let partHeight = 0

    if (mode === 'paper') {
      partHeight = getPaperHeightPx()
    } else if (mode === 'height') {
      partHeight = heightPx
    } else if (mode === 'preset') {
      partHeight = getPresetHeight()
    } else if (mode === 'count') {
      partHeight = Math.ceil(img.height / count)
    } else if (mode === 'manual') {
      splitLines = manualSplits
    }

    if (mode !== 'manual' && mode !== 'count') {
      let y = partHeight
      while (y < img.height) {
        splitLines.push(y)
        y += partHeight
      }
    } else if (mode === 'count') {
      for (let i = 1; i < count; i++) {
        splitLines.push(partHeight * i)
      }
    }

    generateSplitPreviews(splitLines)
  }, [img, mode, paperSize, dpi, heightPx, count, manualSplits, presetType, customHeight])

  const generateSplitPreviews = (splitLines: number[]) => {
    if (!img) return

    const parts: string[] = []
    const w = img.width
    let lastY = 0

    const createPart = (startY: number, height: number, index: number, total: number) => {
      // Adjust for overlap
      const adjustedStartY = Math.max(0, startY - (index > 0 ? overlap : 0))
      const adjustedHeight = Math.min(img.height - adjustedStartY, height + (index > 0 ? overlap : 0) + (index < total - 1 ? overlap : 0))
      
      const c = document.createElement('canvas')
      c.width = w
      c.height = adjustedHeight
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, adjustedStartY, w, adjustedHeight, 0, 0, w, adjustedHeight)
      
      // Add number overlay
      if (showNumbers) {
        const fontSize = Math.max(24, Math.min(w / 10, 60))
        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.fillRect(0, 0, fontSize * 2.5, fontSize * 1.8)
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${fontSize}px system-ui`
        ctx.fillText(String(index + 1), fontSize * 0.5, fontSize * 1.3)
      }
      
      return c
    }

    const totalParts = splitLines.length + 1
    
    splitLines.forEach((y, index) => {
      const h = y - lastY
      const canvas = createPart(lastY, h, index, totalParts)
      parts.push(canvas.toDataURL(exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png', jpegQuality / 100))
      lastY = y
    })

    if (lastY < img.height) {
      const h = img.height - lastY
      const canvas = createPart(lastY, h, splitLines.length, totalParts)
      parts.push(canvas.toDataURL(exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png', jpegQuality / 100))
    }

    setSplitParts(parts)
  }

  const downloadMerged = () => {
    if (!img || splitParts.length === 0) return

    // Recreate parts without preview scaling
    let splitLines: number[] = []
    let partHeight = 0

    if (mode === 'paper') {
      partHeight = getPaperHeightPx()
    } else if (mode === 'height') {
      partHeight = heightPx
    } else if (mode === 'preset') {
      partHeight = getPresetHeight()
    } else if (mode === 'count') {
      partHeight = Math.ceil(img.height / count)
    } else if (mode === 'manual') {
      splitLines = manualSplits
    }

    if (mode !== 'manual' && mode !== 'count') {
      let y = partHeight
      while (y < img.height) {
        splitLines.push(y)
        y += partHeight
      }
    } else if (mode === 'count') {
      for (let i = 1; i < count; i++) {
        splitLines.push(partHeight * i)
      }
    }

    const parts: HTMLCanvasElement[] = []
    const w = img.width
    let lastY = 0
    const totalParts = splitLines.length + 1

    const createPartFull = (startY: number, height: number, index: number) => {
      const adjustedStartY = Math.max(0, startY - (index > 0 ? overlap : 0))
      const adjustedHeight = Math.min(img.height - adjustedStartY, height + (index > 0 ? overlap : 0) + (index < totalParts - 1 ? overlap : 0))
      
      const c = document.createElement('canvas')
      c.width = w
      c.height = adjustedHeight
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, adjustedStartY, w, adjustedHeight, 0, 0, w, adjustedHeight)
      
      if (showNumbers) {
        const fontSize = Math.max(24, Math.min(w / 10, 60))
        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.fillRect(0, 0, fontSize * 2.5, fontSize * 1.8)
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${fontSize}px system-ui`
        ctx.fillText(String(index + 1), fontSize * 0.5, fontSize * 1.3)
      }
      
      return c
    }

    splitLines.forEach((y, index) => {
      const h = y - lastY
      parts.push(createPartFull(lastY, h, index))
      lastY = y
    })

    if (lastY < img.height) {
      const h = img.height - lastY
      parts.push(createPartFull(lastY, h, splitLines.length))
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

    const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png'
    m.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `split-${mode === 'paper' ? paperSize : mode}-merged.${exportFormat}`
      a.click()
      URL.revokeObjectURL(url)
    }, mimeType, jpegQuality / 100)
  }

  const downloadSeparate = () => {
    splitParts.forEach((dataUrl, index) => {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `split-part-${(index + 1).toString().padStart(2, '0')}.${exportFormat}`
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
    const scale = img.height / rect.height
    const y = Math.round((e.clientY - rect.top) * scale)
    
    if (y > 10 && y < img.height - 10) {
      setManualSplits((prev) => [...prev, y].sort((a, b) => a - b))
    }
  }

  const removeSplitLine = (index: number) => {
    setManualSplits((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Privacy Badge */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-white text-sm font-medium mb-3">Split Mode</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { value: 'paper', label: 'Paper Size', icon: <Printer className="w-4 h-4" /> },
              { value: 'preset', label: 'Presets', icon: <Smartphone className="w-4 h-4" /> },
              { value: 'height', label: 'By Height', icon: <FileText className="w-4 h-4" /> },
              { value: 'count', label: 'By Count', icon: <Hash className="w-4 h-4" /> },
              { value: 'manual', label: 'Manual', icon: <Scissors className="w-4 h-4" /> },
            ].map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value as SplitMode)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  mode === m.value
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode-specific Settings */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            {mode === 'paper' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300 font-medium">Size:</label>
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                    className="min-h-[44px] px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    {Object.entries(PAPER_SIZES).map(([key, val]) => (
                      <option key={key} value={key} className="bg-gray-800 text-white">
                        {val.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300 font-medium">DPI:</label>
                  <select
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value))}
                    className="min-h-[44px] px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    {DPI_OPTIONS.map((d) => (
                      <option key={d} value={d} className="bg-gray-800 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-cyan-400 font-medium">= {getPaperHeightPx()}px per page</div>
              </>
            )}

            {mode === 'preset' && (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setPresetType(key as PresetType)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                        presetType === key
                          ? 'bg-cyan-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {preset.icon}
                      <span className="text-xs">{preset.name}</span>
                    </button>
                  ))}
                </div>
                {presetType === 'custom' && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">W:</label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="w-20 min-h-[40px] px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">H:</label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="w-20 min-h-[40px] px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                      />
                    </div>
                  </div>
                )}
                {presetType !== 'custom' && (
                  <p className="text-xs text-gray-500">{PRESETS[presetType].description}</p>
                )}
              </div>
            )}

            {mode === 'height' && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300 font-medium">Height (px):</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-28 min-h-[44px] px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                  min={100}
                  max={5000}
                  value={heightPx}
                  onChange={(e) => setHeightPx(Number(e.target.value))}
                />
              </div>
            )}

            {mode === 'count' && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300 font-medium">Parts:</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-24 min-h-[44px] px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-400"
                  min={2}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
              </div>
            )}

            {mode === 'manual' && (
              <div className="text-sm text-cyan-400">
                Click on the image below to add split lines
              </div>
            )}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full p-4 flex justify-between items-center"
          >
            <span className="text-white font-medium flex items-center gap-2">
              <Scissors className="w-4 h-4 text-cyan-400" />
              Advanced Options
            </span>
            {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {showAdvanced && (
            <div className="px-4 pb-4 space-y-4">
              {/* Overlap */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Overlap (for printing): <span className="text-cyan-400">{overlap}px</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={overlap}
                  onChange={(e) => setOverlap(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 
                           [&::-webkit-slider-thumb]:rounded-full"
                />
                <p className="text-xs text-gray-500 mt-1">Add overlap between parts for seamless printing assembly</p>
              </div>

              {/* Show Numbers */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNumbers}
                  onChange={(e) => setShowNumbers(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Show part numbers on images</span>
              </label>

              {/* Export Format */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Format</label>
                  <div className="flex gap-2">
                    {(['png', 'jpeg'] as ExportFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium uppercase transition-all ${
                          exportFormat === fmt
                            ? 'bg-cyan-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
                {exportFormat === 'jpeg' && (
                  <div className="flex-1">
                    <label className="text-sm text-gray-300 block mb-2">Quality: {jpegQuality}%</label>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={jpegQuality}
                      onChange={(e) => setJpegQuality(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                               [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 
                               [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drop Zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById('split-file')?.click()}
          onKeyDown={(e) => e.key === 'Enter' ? document.getElementById('split-file')?.click() : null}
          onDragOver={(e) => {
            e.preventDefault()
            e.currentTarget.classList.add('border-cyan-400', 'bg-cyan-500/10')
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-500/10')
          }}
          onDrop={handleDrop}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-white/30 text-gray-300 text-center py-10 min-h-[150px] hover:border-cyan-400 hover:bg-cyan-500/10 transition-all flex flex-col items-center justify-center"
        >
          <Scissors className="w-10 h-10 text-cyan-400 mb-3" />
          <div className="text-lg font-medium mb-2">Drop a long image here</div>
          <div className="text-sm">or click to select</div>
        </div>

        {/* Download Options */}
        {splitParts.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={downloadType}
              onChange={(e) => setDownloadType(e.target.value as 'merged' | 'separate')}
              className="min-h-[44px] px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="separate" className="bg-gray-800 text-white">Separate files ({splitParts.length})</option>
              <option value="merged" className="bg-gray-800 text-white">Merged (side by side)</option>
            </select>
            <button
              className="min-h-[48px] px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              onClick={downloadType === 'merged' ? downloadMerged : downloadSeparate}
            >
              <Download className="w-4 h-4" />
              <span>Download {exportFormat.toUpperCase()}</span>
            </button>
            <button
              onClick={clearImage}
              className="min-h-[44px] px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
            >
              Clear
            </button>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="space-y-6">
            {/* Original with Split Lines */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  Original Image
                  {img && <span className="text-xs text-gray-500 font-normal">({img.width}×{img.height}px)</span>}
                </h3>
                {mode === 'manual' && (
                  <span className="text-cyan-400 text-xs sm:text-sm">Click to add split line</span>
                )}
              </div>
              <div className="max-h-96 overflow-auto rounded-lg bg-black/20 p-2">
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
                  {mode === 'manual' && img && (
                    <div className="absolute inset-0 pointer-events-none">
                      {manualSplits.map((y, index) => (
                        <div
                          key={index}
                          className="absolute w-full"
                          style={{ top: `${(y / img.height) * 100}%` }}
                        >
                          <div className="w-full h-0.5 bg-cyan-400 shadow-lg" />
                          <span className="absolute left-2 -mt-6 bg-black/90 text-cyan-400 text-xs rounded px-2 py-1">
                            {y}px
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSplitLine(index)
                            }}
                            className="absolute right-2 -mt-8 min-w-[44px] min-h-[32px] bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg px-3 py-1 pointer-events-auto transition-colors flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            <span className="hidden sm:inline">Remove</span>
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
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span>Split Result</span>
                  <span className="text-xs text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                    {splitParts.length} parts
                  </span>
                  {overlap > 0 && (
                    <span className="text-xs text-gray-500">+{overlap}px overlap</span>
                  )}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {splitParts.map((part, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-2 hover:bg-black/30 transition-colors">
                      <div className="text-xs text-cyan-400 font-medium mb-1 text-center">
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

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📄</div>
          <div className="text-xs text-gray-400">Paper sizes</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📱</div>
          <div className="text-xs text-gray-400">Social presets</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">✂️</div>
          <div className="text-xs text-gray-400">Manual split</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🔢</div>
          <div className="text-xs text-gray-400">Part numbers</div>
        </div>
      </div>
    </div>
  )
}