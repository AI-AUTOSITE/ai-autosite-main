// ============================================
// Advanced Options Component (Accordion)
// ============================================

'use client'

import { useState } from 'react'
import { Sliders, ChevronDown, Image as ImageIcon, X } from 'lucide-react'
import { QRSize, OutputFormat, ErrorCorrectionLevel, DotStyle } from '../lib/types'
import { DOT_STYLES, ERROR_LEVELS, MAX_LOGO_SIZE } from '../lib/constants'
import { getSizeLabel } from '../lib/utils'

interface AdvancedOptionsProps {
  size: QRSize
  outputFormat: OutputFormat
  errorLevel: ErrorCorrectionLevel
  dotStyle: DotStyle
  logo: string | null
  onSizeChange: (size: QRSize) => void
  onFormatChange: (format: OutputFormat) => void
  onErrorLevelChange: (level: ErrorCorrectionLevel) => void
  onDotStyleChange: (style: DotStyle) => void
  onLogoChange: (logo: string | null) => void
  onError: (error: string) => void
}

export function AdvancedOptions({
  size,
  outputFormat,
  errorLevel,
  dotStyle,
  logo,
  onSizeChange,
  onFormatChange,
  onErrorLevelChange,
  onDotStyleChange,
  onLogoChange,
  onError,
}: AdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file')
      return
    }

    if (file.size > MAX_LOGO_SIZE) {
      onError('Logo must be under 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      onLogoChange(event.target?.result as string)
      // Auto-switch to higher error correction for logos
      if (errorLevel === 'L' || errorLevel === 'M') {
        onErrorLevelChange('Q')
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header (Clickable) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium text-sm">Options</span>
          {/* Current settings preview */}
          <span className="text-xs text-gray-400 ml-2">
            {getSizeLabel(size)} • {dotStyle} • {outputFormat.toUpperCase()}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Content (Collapsible) */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* Size */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Size</label>
            <div className="flex gap-2">
              {([256, 512, 1024] as QRSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onSizeChange(s)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    size === s
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {getSizeLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Dot Style */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Style</label>
            <div className="grid grid-cols-3 gap-2">
              {DOT_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => onDotStyleChange(style.value)}
                  className={`py-2 px-2 rounded-lg text-[10px] font-medium transition-all ${
                    dotStyle === style.value
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Correction */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Error Correction
              {logo && <span className="text-cyan-400 ml-1">(Q+ for logos)</span>}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ERROR_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => onErrorLevelChange(level.value)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    errorLevel === level.value
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={level.desc}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Format</label>
            <div className="flex gap-2">
              {(['png', 'svg', 'jpeg'] as OutputFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => onFormatChange(format)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium uppercase transition-all ${
                    outputFormat === format
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Logo
              <span className="text-emerald-400 ml-1">✨ Free</span>
            </label>
            {logo ? (
              <div className="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-lg">
                <img src={logo} alt="Logo" className="w-8 h-8 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-xs text-white">Logo added</p>
                </div>
                <button
                  onClick={() => onLogoChange(null)}
                  className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-cyan-400/50 hover:bg-white/5 transition-all">
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Upload logo (max 2MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
