'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { 
  Plus, Eye, X, Zap, Download, Grid3X3, 
  ChevronDown, ChevronUp, Palette, Square, 
  RectangleHorizontal, Smartphone, ShoppingBag
} from 'lucide-react'

const MAX_CELLS = 64

type CellImage = {
  file: File
  url: string
} | null

type AspectRatio = 'square' | '4:3' | '16:9' | '3:4' | 'free'
type ExportFormat = 'png' | 'jpeg' | 'webp'

interface GridTemplate {
  name: string
  icon: React.ReactNode
  rows: number
  cols: number
  description: string
}

// ============================================
// Preset Templates
// ============================================
const TEMPLATES: GridTemplate[] = [
  { name: '2×2', icon: <Grid3X3 className="w-4 h-4" />, rows: 2, cols: 2, description: 'Basic 4 images' },
  { name: '3×3', icon: <Grid3X3 className="w-4 h-4" />, rows: 3, cols: 3, description: 'Instagram style' },
  { name: '1×3', icon: <RectangleHorizontal className="w-4 h-4" />, rows: 1, cols: 3, description: 'Horizontal strip' },
  { name: '3×1', icon: <RectangleHorizontal className="w-4 h-4 rotate-90" />, rows: 3, cols: 1, description: 'Vertical strip' },
  { name: '2×4', icon: <Smartphone className="w-4 h-4" />, rows: 2, cols: 4, description: 'Wide banner' },
  { name: '4×2', icon: <ShoppingBag className="w-4 h-4" />, rows: 4, cols: 2, description: 'Product compare' },
]

// ============================================
// Color Presets
// ============================================
const BG_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#f5f5f5' },
  { name: 'Dark', value: '#1a1a1a' },
  { name: 'Black', value: '#000000' },
  { name: 'Transparent', value: 'transparent' },
]

const BORDER_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#e5e5e5' },
  { name: 'Dark Gray', value: '#333333' },
  { name: 'Black', value: '#000000' },
]

// ============================================
// Main Component
// ============================================
export default function ImageGrid() {
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(4)
  const [showNumbers, setShowNumbers] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // New settings
  const [gap, setGap] = useState(0)
  const [bgColor, setBgColor] = useState('#f5f5f5')
  const [borderWidth, setBorderWidth] = useState(0)
  const [borderColor, setBorderColor] = useState('#ffffff')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const [jpegQuality, setJpegQuality] = useState(92)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const total = useMemo(() => Math.min(rows * cols, MAX_CELLS), [rows, cols])
  const [cells, setCells] = useState<CellImage[]>(Array(total).fill(null))

  // Sync cells array with grid size
  useEffect(() => {
    const nextLen = Math.min(rows * cols, MAX_CELLS)
    setCells((prev) => {
      const next = prev.slice(0, nextLen)
      while (next.length < nextLen) next.push(null)
      return next
    })
  }, [rows, cols])

  const filledCount = cells.filter(Boolean).length

  // Get aspect ratio value
  const getAspectRatioValue = (ratio: AspectRatio): number | null => {
    switch (ratio) {
      case 'square': return 1
      case '4:3': return 4 / 3
      case '16:9': return 16 / 9
      case '3:4': return 3 / 4
      default: return null
    }
  }

  // Generate preview when cells change
  useEffect(() => {
    if (filledCount === 0) {
      setPreviewUrl(null)
      return
    }

    const generatePreview = async () => {
      const bitmaps = await Promise.all(
        cells.map((ci) => (ci ? createImageBitmap(ci.file) : Promise.resolve(null)))
      )

      const arValue = getAspectRatioValue(aspectRatio)
      const rowHeights: number[] = []
      const colWidths: number[] = []

      // Calculate row heights and column widths
      for (let r = 0; r < rows; r++) {
        let maxH = 0
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          if (idx >= bitmaps.length) break
          const bm = bitmaps[idx]
          if (bm) {
            if (arValue) {
              const h = bm.width / arValue
              maxH = Math.max(maxH, h)
            } else {
              maxH = Math.max(maxH, bm.height)
            }
          }
        }
        rowHeights.push(maxH || 200)
      }

      for (let c = 0; c < cols; c++) {
        let maxW = 0
        for (let r = 0; r < rows; r++) {
          const idx = r * cols + c
          if (idx >= bitmaps.length) break
          const bm = bitmaps[idx]
          if (bm) {
            if (arValue) {
              maxW = Math.max(maxW, rowHeights[r] * arValue)
            } else {
              maxW = Math.max(maxW, bm.width)
            }
          }
        }
        colWidths.push(maxW || 200)
      }

      const scale = 0.25
      const gapPx = gap * scale
      const borderPx = borderWidth * scale
      const totalGapX = (cols - 1) * gapPx + (borderPx * 2)
      const totalGapY = (rows - 1) * gapPx + (borderPx * 2)
      const totalW = colWidths.reduce((a, b) => a + b, 0) * scale + totalGapX
      const totalH = rowHeights.reduce((a, b) => a + b, 0) * scale + totalGapY

      const cvs = document.createElement('canvas')
      cvs.width = totalW
      cvs.height = totalH
      const ctx = cvs.getContext('2d')!

      // Background
      if (bgColor === 'transparent') {
        ctx.clearRect(0, 0, totalW, totalH)
      } else {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, totalW, totalH)
      }

      // Border
      if (borderWidth > 0) {
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderPx
        ctx.strokeRect(borderPx / 2, borderPx / 2, totalW - borderPx, totalH - borderPx)
      }

      let y = borderPx
      for (let r = 0; r < rows; r++) {
        let x = borderPx
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const bm = bitmaps[idx]
          const cellW = colWidths[c] * scale
          const cellH = rowHeights[r] * scale

          if (bm) {
            // Draw image to fit cell
            const imgRatio = bm.width / bm.height
            const cellRatio = cellW / cellH
            let drawW, drawH, drawX, drawY

            if (imgRatio > cellRatio) {
              drawH = cellH
              drawW = cellH * imgRatio
              drawX = x + (cellW - drawW) / 2
              drawY = y
            } else {
              drawW = cellW
              drawH = cellW / imgRatio
              drawX = x
              drawY = y + (cellH - drawH) / 2
            }

            // Clip to cell bounds
            ctx.save()
            ctx.beginPath()
            ctx.rect(x, y, cellW, cellH)
            ctx.clip()
            ctx.drawImage(bm, drawX, drawY, drawW, drawH)
            ctx.restore()

            if (showNumbers) {
              const fontSize = Math.max(10, 20 * scale)
              ctx.fillStyle = 'rgba(0,0,0,.7)'
              ctx.fillRect(x, y, 45 * scale, 32 * scale)
              ctx.fillStyle = '#fff'
              ctx.font = `bold ${fontSize}px system-ui`
              ctx.fillText(String(idx + 1), x + 12 * scale, y + 22 * scale)
            }
          }

          x += cellW + gapPx
        }
        y += rowHeights[r] * scale + gapPx
      }

      cvs.toBlob((blob) => {
        if (blob) {
          if (previewUrl) URL.revokeObjectURL(previewUrl)
          setPreviewUrl(URL.createObjectURL(blob))
        }
      }, 'image/png')
    }

    generatePreview()
  }, [cells, rows, cols, showNumbers, filledCount, gap, bgColor, borderWidth, borderColor, aspectRatio])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    setCells((prev) => {
      const next = [...prev]
      let i = 0

      while (i < next.length && next[i]) i++

      for (const f of Array.from(files)) {
        while (i < next.length && next[i]) i++
        if (i >= next.length) break
        if (!f.type.startsWith('image/')) continue

        const old = next[i]
        if (old?.url) URL.revokeObjectURL(old.url)
        next[i] = { file: f, url: URL.createObjectURL(f) }
        i++
      }

      return next
    })
  }, [])

  const applyTemplate = (template: GridTemplate) => {
    setRows(template.rows)
    setCols(template.cols)
  }

  const clearAll = () => {
    setCells(prev => {
      prev.forEach(cell => {
        if (cell?.url) URL.revokeObjectURL(cell.url)
      })
      return Array(total).fill(null)
    })
  }

  const merge = async () => {
    const bitmaps = await Promise.all(
      cells.map((ci) => (ci ? createImageBitmap(ci.file) : Promise.resolve(null)))
    )

    const arValue = getAspectRatioValue(aspectRatio)
    const rowHeights: number[] = []
    const colWidths: number[] = []

    // Calculate dimensions
    for (let r = 0; r < rows; r++) {
      let maxH = 0
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c
        if (idx >= bitmaps.length) break
        const bm = bitmaps[idx]
        if (bm) {
          if (arValue) {
            maxH = Math.max(maxH, bm.width / arValue)
          } else {
            maxH = Math.max(maxH, bm.height)
          }
        }
      }
      rowHeights.push(maxH || 400)
    }

    for (let c = 0; c < cols; c++) {
      let maxW = 0
      for (let r = 0; r < rows; r++) {
        const idx = r * cols + c
        if (idx >= bitmaps.length) break
        const bm = bitmaps[idx]
        if (bm) {
          if (arValue) {
            maxW = Math.max(maxW, rowHeights[r] * arValue)
          } else {
            maxW = Math.max(maxW, bm.width)
          }
        }
      }
      colWidths.push(maxW || 400)
    }

    const totalGapX = (cols - 1) * gap + (borderWidth * 2)
    const totalGapY = (rows - 1) * gap + (borderWidth * 2)
    const totalW = colWidths.reduce((a, b) => a + b, 0) + totalGapX
    const totalH = rowHeights.reduce((a, b) => a + b, 0) + totalGapY

    const cvs = document.createElement('canvas')
    cvs.width = totalW
    cvs.height = totalH
    const ctx = cvs.getContext('2d')!

    // Background
    if (bgColor === 'transparent' && exportFormat === 'png') {
      ctx.clearRect(0, 0, totalW, totalH)
    } else {
      ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor
      ctx.fillRect(0, 0, totalW, totalH)
    }

    // Border
    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, totalW - borderWidth, totalH - borderWidth)
    }

    let y = borderWidth
    for (let r = 0; r < rows; r++) {
      let x = borderWidth
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c
        const bm = bitmaps[idx]
        const cellW = colWidths[c]
        const cellH = rowHeights[r]

        if (bm) {
          const imgRatio = bm.width / bm.height
          const cellRatio = cellW / cellH
          let drawW, drawH, drawX, drawY

          if (imgRatio > cellRatio) {
            drawH = cellH
            drawW = cellH * imgRatio
            drawX = x + (cellW - drawW) / 2
            drawY = y
          } else {
            drawW = cellW
            drawH = cellW / imgRatio
            drawX = x
            drawY = y + (cellH - drawH) / 2
          }

          ctx.save()
          ctx.beginPath()
          ctx.rect(x, y, cellW, cellH)
          ctx.clip()
          ctx.drawImage(bm, drawX, drawY, drawW, drawH)
          ctx.restore()

          if (showNumbers) {
            ctx.fillStyle = 'rgba(0,0,0,.7)'
            ctx.fillRect(x, y, 60, 42)
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 26px system-ui'
            ctx.fillText(String(idx + 1), x + 18, y + 32)
          }
        }

        x += cellW + gap
      }
      y += rowHeights[r] + gap
    }

    const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png'
    const quality = exportFormat === 'jpeg' || exportFormat === 'webp' ? jpegQuality / 100 : undefined

    cvs.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `grid_${rows}x${cols}.${exportFormat}`
      a.click()
      URL.revokeObjectURL(url)
    }, mimeType, quality)
  }

  return (
    <div className="space-y-6">
      {/* Privacy Badge */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-white text-sm font-medium mb-3">Quick Templates</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                rows === template.rows && cols === template.cols
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {template.icon}
              <span>{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Row Input */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Rows</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={8}
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(8, Number(e.target.value))))}
              className="w-full px-4 py-3 min-h-[48px] rounded-lg bg-white/10 border border-white/20 text-white text-center text-lg font-semibold focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Column Input */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Columns</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={8}
              value={cols}
              onChange={(e) => setCols(Math.max(1, Math.min(8, Number(e.target.value))))}
              className="w-full px-4 py-3 min-h-[48px] rounded-lg bg-white/10 border border-white/20 text-white text-center text-lg font-semibold focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Gap */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Gap: {gap}px</label>
            <input
              type="range"
              min={0}
              max={40}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full h-[48px] bg-white/10 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 
                       [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Show Numbers Toggle */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Display</label>
            <label className="flex items-center justify-center gap-3 min-h-[48px] px-4 py-3 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors">
              <input
                type="checkbox"
                checked={showNumbers}
                onChange={(e) => setShowNumbers(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-white font-medium">Numbers</span>
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white/5 rounded-xl border border-white/10">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 flex justify-between items-center"
        >
          <span className="text-white font-medium flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            Style & Export Options
          </span>
          {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        
        {showAdvanced && (
          <div className="px-4 pb-4 space-y-4">
            {/* Background Color */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Background Color</label>
              <div className="flex flex-wrap gap-2">
                {BG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBgColor(color.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                      bgColor === color.value
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded border border-white/30"
                      style={{ 
                        backgroundColor: color.value === 'transparent' ? 'transparent' : color.value,
                        backgroundImage: color.value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
                        backgroundSize: '8px 8px',
                        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                      }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Border */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Border Width: {borderWidth}px</label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 
                           [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">Border Color</label>
                <div className="flex gap-2">
                  {BORDER_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBorderColor(color.value)}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        borderColor === color.value ? 'border-cyan-400 scale-110' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Cell Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'free', label: 'Free', icon: <Square className="w-3 h-3" /> },
                  { value: 'square', label: '1:1', icon: <Square className="w-3 h-3" /> },
                  { value: '4:3', label: '4:3', icon: <RectangleHorizontal className="w-3 h-3" /> },
                  { value: '16:9', label: '16:9', icon: <RectangleHorizontal className="w-3 h-3" /> },
                  { value: '3:4', label: '3:4', icon: <RectangleHorizontal className="w-3 h-3 rotate-90" /> },
                ].map((ar) => (
                  <button
                    key={ar.value}
                    onClick={() => setAspectRatio(ar.value as AspectRatio)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      aspectRatio === ar.value
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {ar.icon}
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Export Format</label>
                <div className="flex gap-2">
                  {(['png', 'jpeg', 'webp'] as ExportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium uppercase transition-all ${
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
              {(exportFormat === 'jpeg' || exportFormat === 'webp') && (
                <div>
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
      <Dropzone onFiles={handleFiles} />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 px-4 py-3 min-h-[48px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={filledCount < 1}
          onClick={merge}
        >
          <Download className="w-5 h-5" />
          <span>Download Grid</span>
          <span className="text-xs opacity-75">({filledCount}/{total})</span>
        </button>
        <button
          onClick={clearAll}
          disabled={filledCount === 0}
          className="px-4 py-3 min-h-[48px] bg-white/5 text-gray-300 rounded-lg font-medium hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Clear All
        </button>
      </div>

      {/* Grid */}
      <div
        className="grid rounded-2xl bg-black/20 p-3"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: `${Math.max(gap / 4, 8)}px`
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <Cell
            key={i}
            image={cells[i]}
            index={i}
            showNumbers={showNumbers}
            aspectRatio={aspectRatio}
            onPick={(file) =>
              setCells((prev) => {
                const next = [...prev]
                const old = next[i]
                if (old?.url) URL.revokeObjectURL(old.url)
                next[i] = { file, url: URL.createObjectURL(file) }
                return next
              })
            }
            onRemove={() =>
              setCells((prev) => {
                const next = [...prev]
                if (next[i]?.url) URL.revokeObjectURL(next[i]!.url)
                next[i] = null
                return next
              })
            }
          />
        ))}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="bg-black/20 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span>Preview</span>
            <span className="text-xs text-gray-500 font-normal">({exportFormat.toUpperCase()})</span>
          </h3>
          <div className="flex justify-center">
            <img
              src={previewUrl}
              alt="Grid preview"
              className="max-w-full rounded-lg shadow-lg"
              style={{ maxHeight: '300px' }}
            />
          </div>
          <p className="text-gray-300 text-xs text-center mt-2">
            Preview only - Download for full resolution
          </p>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📐</div>
          <div className="text-xs text-gray-400">6 templates</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">🎨</div>
          <div className="text-xs text-gray-400">Custom colors</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📏</div>
          <div className="text-xs text-gray-400">Gap control</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">💾</div>
          <div className="text-xs text-gray-400">PNG/JPEG/WebP</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Sub Components
// ============================================
function Dropzone({ onFiles }: { onFiles: (files: FileList | null) => void }) {
  const fileInput = React.useRef<HTMLInputElement>(null)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInput.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' ? fileInput.current?.click() : null)}
        onDragOver={(e) => {
          e.preventDefault()
          e.currentTarget.classList.add('border-cyan-400', 'bg-cyan-500/10')
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-500/10')
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-500/10')
          onFiles(e.dataTransfer.files)
        }}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-white/30 text-gray-300 text-center py-8 min-h-[100px] hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
      >
        <div className="text-lg font-medium mb-2">Drop images here</div>
        <div className="text-sm">or click to select multiple files</div>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </>
  )
}

function Cell({
  image,
  index,
  showNumbers,
  aspectRatio,
  onPick,
  onRemove,
}: {
  image: CellImage
  index: number
  showNumbers: boolean
  aspectRatio: AspectRatio
  onPick: (file: File) => void
  onRemove: () => void
}) {
  const pick = () => {
    const inp = document.createElement('input')
    inp.type = 'file'
    inp.accept = 'image/*'
    inp.onchange = (e: any) => {
      const f: File | undefined = e.target.files?.[0]
      if (!f || !f.type.startsWith('image/')) return
      onPick(f)
    }
    inp.click()
  }

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square'
      case '4:3': return 'aspect-[4/3]'
      case '16:9': return 'aspect-video'
      case '3:4': return 'aspect-[3/4]'
      default: return 'aspect-square'
    }
  }

  return (
    <div
      className={`relative ${getAspectClass()} rounded-xl bg-black/30 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-black/40 transition-all`}
      onClick={!image ? pick : undefined}
    >
      {image ? (
        <>
          <img src={image.url} alt={`Cell ${index + 1}`} className="h-full w-full object-cover" />
          {showNumbers && (
            <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded-md text-white text-sm font-bold">
              {index + 1}
            </div>
          )}
          <button
            aria-label={`Remove image ${index + 1}`}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute bottom-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </>
      ) : (
        <div className="text-center">
          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <span className="text-gray-400 text-sm">Add image</span>
        </div>
      )}
    </div>
  )
}