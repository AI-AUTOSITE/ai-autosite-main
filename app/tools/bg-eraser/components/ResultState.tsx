'use client'

import { useCallback, useState } from 'react'
import { Download, RefreshCw, CheckCircle, Settings, Eraser } from 'lucide-react'
import { BG_COLORS, SIZE_PRESETS } from '../constants'
import type { ProcessedImage, OutputFormat } from '../types'

interface ResultStateProps {
  processedImage: ProcessedImage
  isTouchDevice: boolean
  onEdit: () => void
  onReset: () => void
}

export function ResultState({ processedImage, isTouchDevice, onEdit, onReset }: ResultStateProps) {
  const [selectedBgColor, setSelectedBgColor] = useState('transparent')
  const [outputSizePreset, setOutputSizePreset] = useState('original')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)

  // Calculate output dimensions
  const getOutputDimensions = useCallback(() => {
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

  const dimensions = getOutputDimensions()

  return (
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
          onClick={onEdit}
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
            {dimensions.width} × {dimensions.height} px
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
        <button onClick={onReset} className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors text-sm md:text-base">
          <RefreshCw className="w-4 h-4" />Try another image
        </button>
      </div>
    </div>
  )
}
