// app/tools/pdf-tools/features/signature/SignatureUI.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Edit2, Type, Image, Stamp, Trash2 } from 'lucide-react'

interface SignatureUIProps {
  onApply: (options: any) => void
  onCancel: () => void
  totalPages: number
}

export const SignatureUI: React.FC<SignatureUIProps> = ({ onApply, onCancel, totalPages }) => {
  const [mode, setMode] = useState<'signature' | 'stamp'>('signature')
  const [signatureType, setSignatureType] = useState<'draw' | 'text' | 'image'>('draw')
  const [stampType, setStampType] = useState('approved')
  const [customStampText, setCustomStampText] = useState('')

  // Signature states
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureText, setSignatureText] = useState('')
  const [signatureImage, setSignatureImage] = useState<Uint8Array | null>(null)
  const [imageName, setImageName] = useState('')
  const [selectedPage, setSelectedPage] = useState(1)
  const [includeDate, setIncludeDate] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')

  // Stamp states
  const [stampPages, setStampPages] = useState<number[]>([1])
  const [stampPosition, setStampPosition] = useState('top-right')
  const [stampColor, setStampColor] = useState('#FF0000')

  useEffect(() => {
    if (signatureType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [signatureType])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x =
      'touches' in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left
    const y =
      'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x =
      'touches' in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left
    const y =
      'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('image')) {
      alert('Please upload an image file')
      return
    }

    const buffer = await file.arrayBuffer()
    setSignatureImage(new Uint8Array(buffer))
    setImageName(file.name)
  }

  const handleApply = () => {
    if (mode === 'signature') {
      let signatureData: string | Uint8Array = ''

      if (signatureType === 'draw') {
        const canvas = canvasRef.current
        if (!canvas) {
          alert('Please draw your signature')
          return
        }
        signatureData = canvas.toDataURL('image/png')
      } else if (signatureType === 'text') {
        if (!signatureText) {
          alert('Please enter your signature text')
          return
        }
        signatureData = signatureText
      } else if (signatureType === 'image') {
        if (!signatureImage) {
          alert('Please upload a signature image')
          return
        }
        signatureData = signatureImage
      }

      onApply({
        type: 'signature',
        options: {
          type: signatureType,
          signatureData,
          pageNumber: selectedPage,
          x: 100,
          y: 100,
          width: 200,
          height: 50,
          includeDate,
          name: name || undefined,
          title: title || undefined,
        },
      })
    } else {
      // Stamp mode
      if (stampType === 'custom' && !customStampText) {
        alert('Please enter custom stamp text')
        return
      }

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
            }
          : { r: 1, g: 0, b: 0 }
      }

      onApply({
        type: 'stamp',
        options: {
          type: stampType,
          customText: customStampText || undefined,
          pageNumbers: stampPages,
          position: stampPosition,
          color: hexToRgb(stampColor),
          includeDate,
        },
      })
    }
  }

  const toggleStampPage = (page: number) => {
    if (stampPages.includes(page)) {
      setStampPages(stampPages.filter((p) => p !== page))
    } else {
      setStampPages([...stampPages, page].sort((a, b) => a - b))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium">Signature & Stamps</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('signature')}
            className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 ${
              mode === 'signature' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            Signature
          </button>
          <button
            onClick={() => setMode('stamp')}
            className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 ${
              mode === 'stamp' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Stamp className="w-4 h-4" />
            Stamp
          </button>
        </div>

        {mode === 'signature' ? (
          <div className="space-y-4">
            {/* Signature Type */}
            <div className="flex gap-2">
              <button
                onClick={() => setSignatureType('draw')}
                className={`flex-1 py-1 px-2 rounded text-sm ${
                  signatureType === 'draw' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Draw
              </button>
              <button
                onClick={() => setSignatureType('text')}
                className={`flex-1 py-1 px-2 rounded text-sm ${
                  signatureType === 'text' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Type
              </button>
              <button
                onClick={() => setSignatureType('image')}
                className={`flex-1 py-1 px-2 rounded text-sm ${
                  signatureType === 'image' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Upload
              </button>
            </div>

            {/* Signature Input */}
            {signatureType === 'draw' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-300">Draw Signature</label>
                  <button
                    onClick={clearCanvas}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={100}
                  className="w-full bg-white rounded cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            )}

            {signatureType === 'text' && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Type Signature</label>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                  placeholder="Your signature"
                />
              </div>
            )}

            {signatureType === 'image' && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Upload Signature</label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-gray-300 rounded cursor-pointer hover:bg-gray-600">
                  <Image className="w-4 h-4" />
                  {imageName || 'Choose signature image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Additional Info */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                placeholder="Manager"
              />
            </div>

            {/* Page Selection */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Page Number</label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={selectedPage}
                onChange={(e) => setSelectedPage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stamp Type */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Stamp Type</label>
              <select
                value={stampType}
                onChange={(e) => setStampType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
              >
                <option value="approved">APPROVED</option>
                <option value="rejected">REJECTED</option>
                <option value="reviewed">REVIEWED</option>
                <option value="confidential">CONFIDENTIAL</option>
                <option value="draft">DRAFT</option>
                <option value="final">FINAL</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {stampType === 'custom' && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Custom Text</label>
                <input
                  type="text"
                  value={customStampText}
                  onChange={(e) => setCustomStampText(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                  placeholder="CUSTOM STAMP"
                />
              </div>
            )}

            {/* Position */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Position</label>
              <select
                value={stampPosition}
                onChange={(e) => setStampPosition(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
              >
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="center">Center</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={stampColor}
                  onChange={(e) => setStampColor(e.target.value)}
                  className="h-10 w-20 bg-gray-700 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={stampColor}
                  onChange={(e) => setStampColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Page Selection */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Apply to Pages</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStampPages(Array.from({ length: totalPages }, (_, i) => i + 1))}
                  className="px-2 py-1 bg-gray-700 text-cyan-400 rounded text-sm hover:bg-gray-600"
                >
                  All
                </button>
                <button
                  onClick={() => setStampPages([])}
                  className="px-2 py-1 bg-gray-700 text-red-400 rounded text-sm hover:bg-gray-600"
                >
                  None
                </button>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => toggleStampPage(page)}
                    className={`px-2 py-1 rounded text-sm ${
                      stampPages.includes(page)
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 10 && <span className="text-gray-400 text-sm">...</span>}
              </div>
            </div>
          </div>
        )}

        {/* Include Date Option */}
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={includeDate}
              onChange={(e) => setIncludeDate(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
            />
            Include date
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
