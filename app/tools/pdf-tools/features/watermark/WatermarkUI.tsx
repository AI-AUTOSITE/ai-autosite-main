// app/tools/pdf-tools/features/watermark/WatermarkUI.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { 
  Droplets, Type, Image, Upload, X, ChevronDown, ChevronUp, 
  Info, Grid3X3, Stamp, Calendar, Hash, Eye
} from 'lucide-react'
import { 
  WatermarkOptions, 
  WatermarkPreset, 
  WatermarkPosition,
  WatermarkHandler,
  WATERMARK_PRESETS 
} from './WatermarkHandler'

interface WatermarkUIProps {
  onApply: (options: Partial<WatermarkOptions>) => void
  onCancel: () => void
}

const POSITIONS: { value: WatermarkPosition; label: string; icon: string }[] = [
  { value: 'center', label: 'Center', icon: '◉' },
  { value: 'diagonal', label: 'Diagonal', icon: '⤢' },
  { value: 'tile', label: 'Tile Pattern', icon: '▦' },
  { value: 'top-left', label: 'Top Left', icon: '↖' },
  { value: 'top-center', label: 'Top Center', icon: '↑' },
  { value: 'top-right', label: 'Top Right', icon: '↗' },
  { value: 'bottom-left', label: 'Bottom Left', icon: '↙' },
  { value: 'bottom-center', label: 'Bottom Center', icon: '↓' },
  { value: 'bottom-right', label: 'Bottom Right', icon: '↘' },
]

const PRESETS: { value: WatermarkPreset; label: string; color: string }[] = [
  { value: 'custom', label: 'Custom', color: 'gray' },
  { value: 'confidential', label: 'CONFIDENTIAL', color: 'red' },
  { value: 'draft', label: 'DRAFT', color: 'gray' },
  { value: 'approved', label: 'APPROVED', color: 'green' },
  { value: 'sample', label: 'SAMPLE', color: 'gray' },
  { value: 'copy', label: 'COPY', color: 'gray' },
  { value: 'do-not-copy', label: 'DO NOT COPY', color: 'red' },
  { value: 'for-review', label: 'FOR REVIEW', color: 'orange' },
  { value: 'final', label: 'FINAL', color: 'blue' },
  { value: 'internal', label: 'INTERNAL', color: 'gray' },
]

const DYNAMIC_VARIABLES = [
  { var: '{date}', label: 'Date', example: '2025-12-07' },
  { var: '{time}', label: 'Time', example: '14:30' },
  { var: '{page}', label: 'Page #', example: '1' },
  { var: '{total}', label: 'Total', example: '10' },
]

export const WatermarkUI: React.FC<WatermarkUIProps> = ({ onApply, onCancel }) => {
  const [type, setType] = useState<'text' | 'image'>('text')
  const [preset, setPreset] = useState<WatermarkPreset>('custom')
  const [text, setText] = useState('CONFIDENTIAL')
  const [imageData, setImageData] = useState<Uint8Array | null>(null)
  const [imageName, setImageName] = useState('')
  const [position, setPosition] = useState<WatermarkPosition>('diagonal')
  const [opacity, setOpacity] = useState(25)
  const [fontSize, setFontSize] = useState(50)
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState('#cc3333')
  const [dynamicText, setDynamicText] = useState(false)
  const [tileRows, setTileRows] = useState(5)
  const [tileCols, setTileCols] = useState(3)
  const [tileSpacing, setTileSpacing] = useState(150)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Apply preset when changed
  const handlePresetChange = (newPreset: WatermarkPreset) => {
    setPreset(newPreset)
    if (newPreset !== 'custom') {
      const presetConfig = WATERMARK_PRESETS[newPreset]
      if (presetConfig.text) setText(presetConfig.text)
      if (presetConfig.fontSize) setFontSize(presetConfig.fontSize)
      if (presetConfig.opacity) setOpacity(Math.round(presetConfig.opacity * 100))
      if (presetConfig.position) setPosition(presetConfig.position)
      if (presetConfig.color) {
        const { r, g, b } = presetConfig.color
        setColor(`#${Math.round(r*255).toString(16).padStart(2,'0')}${Math.round(g*255).toString(16).padStart(2,'0')}${Math.round(b*255).toString(16).padStart(2,'0')}`)
      }
    }
  }

  // Insert dynamic variable
  const insertVariable = (varStr: string) => {
    setText(prev => prev + varStr)
    setDynamicText(true)
  }

  // Preview dynamic text
  const previewText = useMemo(() => {
    if (dynamicText) {
      return WatermarkHandler.previewDynamicText(text, 1, 10)
    }
    return text
  }, [text, dynamicText])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('image')) {
      alert('Please upload an image file (PNG or JPEG)')
      return
    }

    const buffer = await file.arrayBuffer()
    setImageData(new Uint8Array(buffer))
    setImageName(file.name)
  }

  const handleApply = () => {
    if (type === 'text' && !text) {
      alert('Please enter watermark text')
      return
    }
    if (type === 'image' && !imageData) {
      alert('Please upload an image')
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
        : { r: 0.5, g: 0.5, b: 0.5 }
    }

    onApply({
      type,
      text: type === 'text' ? text : undefined,
      imageData: type === 'image' ? imageData : undefined,
      position,
      opacity: opacity / 100,
      fontSize,
      rotation: position === 'diagonal' ? 45 : rotation,
      color: hexToRgb(color),
      scale: 0.2,
      preset,
      dynamicText,
      tileRows,
      tileCols,
      tileSpacing,
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Add Watermark</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Type Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setType('text')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition ${
                type === 'text' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Type className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => setType('image')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition ${
                type === 'image' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Image className="w-4 h-4" />
              Image
            </button>
          </div>

          {/* Text Watermark Options */}
          {type === 'text' && (
            <>
              {/* Presets */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Stamp className="w-4 h-4" />
                  Quick Presets
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => handlePresetChange(p.value)}
                      className={`px-2 py-1.5 text-xs rounded transition ${
                        preset === p.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      title={p.label}
                    >
                      {p.value === 'custom' ? 'Custom' : p.value.split('-')[0].toUpperCase().slice(0, 6)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    setPreset('custom')
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter watermark text"
                />
              </div>

              {/* Dynamic Text Variables */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Dynamic Variables
                  <span className="text-xs text-gray-500">(click to insert)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {DYNAMIC_VARIABLES.map((v) => (
                    <button
                      key={v.var}
                      onClick={() => insertVariable(v.var)}
                      className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition flex items-center gap-1"
                      title={`Inserts ${v.example}`}
                    >
                      <code className="text-purple-400">{v.var}</code>
                      <span className="text-gray-500">{v.label}</span>
                    </button>
                  ))}
                </div>
                {dynamicText && (
                  <div className="mt-2 p-2 bg-gray-700/50 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Preview:
                    </div>
                    <div className="text-sm text-white font-mono">{previewText}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Image Watermark */}
          {type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Watermark Image
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-4 bg-gray-700 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-600 border-2 border-dashed border-gray-600 transition">
                <Upload className="w-5 h-5" />
                {imageName || 'Choose image file (PNG/JPEG)'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {POSITIONS.slice(0, 3).map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  className={`py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition ${
                    position === p.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
            {position === 'tile' && (
              <div className="mt-3 p-3 bg-gray-700/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-xs text-purple-400">
                  <Grid3X3 className="w-4 h-4" />
                  Tile Pattern Settings
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={tileRows}
                      onChange={(e) => setTileRows(parseInt(e.target.value) || 5)}
                      className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={tileCols}
                      onChange={(e) => setTileCols(parseInt(e.target.value) || 3)}
                      className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Spacing</label>
                    <input
                      type="number"
                      min="50"
                      max="300"
                      value={tileSpacing}
                      onChange={(e) => setTileSpacing(parseInt(e.target.value) || 150)}
                      className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Opacity */}
          <div>
            <label className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Opacity</span>
              <span className="text-purple-400">{opacity}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Advanced Options */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced Options
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-700/30 rounded-lg">
              {type === 'text' && (
                <>
                  <div>
                    <label className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Font Size</span>
                      <span className="text-purple-400">{fontSize}px</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-16 bg-gray-700 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm font-mono"
                        placeholder="#808080"
                      />
                    </div>
                  </div>
                </>
              )}

              {position !== 'diagonal' && (
                <div>
                  <label className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Rotation</span>
                    <span className="text-purple-400">{rotation}°</span>
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-900/50 border-t border-gray-700 sticky bottom-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Droplets className="w-4 h-4" />
            Apply Watermark
          </button>
        </div>
      </div>
    </div>
  )
}

export default WatermarkUI
