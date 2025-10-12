'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Plus, Eye, X } from 'lucide-react'

const MAX_CELLS = 64

type CellImage = {
  file: File
  url: string
} | null

export default function ImageGrid() {
  const [rows, setRows] = useState(2)
  const [cols, setCols] = useState(4)
  const [showNumbers, setShowNumbers] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const total = useMemo(() => Math.min(rows * cols, MAX_CELLS), [rows, cols])
  const [cells, setCells] = useState<CellImage[]>(Array(total).fill(null))

  // Sync cells array with grid size
  React.useEffect(() => {
    const nextLen = Math.min(rows * cols, MAX_CELLS)
    setCells((prev) => {
      const next = prev.slice(0, nextLen)
      while (next.length < nextLen) next.push(null)
      return next
    })
  }, [rows, cols])

  const filledCount = cells.filter(Boolean).length

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

      const rowHeights: number[] = []
      const colWidths: number[] = []

      // Calculate row heights
      for (let r = 0; r < rows; r++) {
        let maxH = 0
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          if (idx >= bitmaps.length) break
          const bm = bitmaps[idx]
          if (bm) maxH = Math.max(maxH, bm.height)
        }
        rowHeights.push(maxH || 200)
      }

      // Calculate column widths
      for (let c = 0; c < cols; c++) {
        let maxW = 0
        for (let r = 0; r < rows; r++) {
          const idx = r * cols + c
          if (idx >= bitmaps.length) break
          const bm = bitmaps[idx]
          if (bm) maxW = Math.max(maxW, bm.width)
        }
        colWidths.push(maxW || 200)
      }

      const scale = 0.3
      const totalW = colWidths.reduce((a, b) => a + b, 0) * scale
      const totalH = rowHeights.reduce((a, b) => a + b, 0) * scale

      const cvs = document.createElement('canvas')
      cvs.width = totalW
      cvs.height = totalH
      const ctx = cvs.getContext('2d')!

      // Dark background
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, totalW, totalH)

      let y = 0
      for (let r = 0; r < rows; r++) {
        let x = 0
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const bm = bitmaps[idx]

          if (bm) {
            ctx.drawImage(bm, x * scale, y * scale, bm.width * scale, bm.height * scale)

            if (showNumbers) {
              const fontSize = Math.max(12, 26 * scale)
              ctx.fillStyle = 'rgba(0,0,0,.7)'
              ctx.fillRect(x * scale, y * scale, 60 * scale, 42 * scale)
              ctx.fillStyle = '#fff'
              ctx.font = `bold ${fontSize}px system-ui`
              ctx.fillText(String(idx + 1), x * scale + 18 * scale, y * scale + 32 * scale)
            }
          } else {
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'
            ctx.strokeRect(x * scale, y * scale, colWidths[c] * scale, rowHeights[r] * scale)
          }

          x += colWidths[c]
        }
        y += rowHeights[r]
      }

      cvs.toBlob((blob) => {
        if (blob) {
          if (previewUrl) URL.revokeObjectURL(previewUrl)
          setPreviewUrl(URL.createObjectURL(blob))
        }
      }, 'image/png')
    }

    generatePreview()
  }, [cells, rows, cols, showNumbers, filledCount])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    setCells((prev) => {
      const next = [...prev]
      let i = 0

      // Find first empty cell
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
  }

  const merge = async () => {
    const bitmaps = await Promise.all(
      cells.map((ci) => (ci ? createImageBitmap(ci.file) : Promise.resolve(null)))
    )

    const rowHeights: number[] = []
    const colWidths: number[] = []

    // Calculate dimensions
    for (let r = 0; r < rows; r++) {
      let maxH = 0
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c
        if (idx >= bitmaps.length) break
        const bm = bitmaps[idx]
        if (bm) maxH = Math.max(maxH, bm.height)
      }
      rowHeights.push(maxH || 400)
    }

    for (let c = 0; c < cols; c++) {
      let maxW = 0
      for (let r = 0; r < rows; r++) {
        const idx = r * cols + c
        if (idx >= bitmaps.length) break
        const bm = bitmaps[idx]
        if (bm) maxW = Math.max(maxW, bm.width)
      }
      colWidths.push(maxW || 400)
    }

    const totalW = colWidths.reduce((a, b) => a + b, 0)
    const totalH = rowHeights.reduce((a, b) => a + b, 0)

    const cvs = document.createElement('canvas')
    cvs.width = totalW
    cvs.height = totalH
    const ctx = cvs.getContext('2d')!

    // White background
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, totalW, totalH)

    let y = 0
    for (let r = 0; r < rows; r++) {
      let x = 0
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c
        const bm = bitmaps[idx]

        if (bm) {
          ctx.drawImage(bm, x, y, bm.width, bm.height)

          if (showNumbers) {
            ctx.fillStyle = 'rgba(0,0,0,.7)'
            ctx.fillRect(x, y, 60, 42)
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 26px system-ui'
            ctx.fillText(String(idx + 1), x + 18, y + 32)
          }
        }

        x += colWidths[c]
      }
      y += rowHeights[r]
    }

    cvs.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `grid_${rows}x${cols}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="space-y-6">
      {/* Controls - Clean grid layout */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Download Button */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Action</label>
            <button
              className="w-full px-4 py-3 min-h-[48px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={filledCount < 1}
              onClick={merge}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Download</span>
                <span className="text-xs opacity-75">({filledCount}/{total})</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Drop Zone - Moved up */}
      <Dropzone onFiles={handleFiles} />

      {/* Grid */}
      <div
        className="grid gap-2 sm:gap-3 rounded-2xl bg-black/20 p-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <Cell
            key={i}
            image={cells[i]}
            index={i}
            showNumbers={showNumbers}
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

      {/* Preview - Moved to bottom */}
      {previewUrl && (
        <div className="bg-black/20 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span>Preview</span>
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
            Preview only - Download for full size
          </p>
        </div>
      )}
    </div>
  )
}

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
        className="cursor-pointer rounded-2xl border-2 border-dashed border-white/30 text-gray-300 text-center py-8 min-h-[120px] hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
      >
        <div className="text-lg font-medium mb-2">Drop images here</div>
        <div className="text-sm">or click to select files</div>
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
  onPick,
  onRemove,
}: {
  image: CellImage
  index: number
  showNumbers: boolean
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

  return (
    <div
      className="relative aspect-square rounded-xl bg-black/30 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-black/40 transition-all"
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
            className="absolute bottom-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
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