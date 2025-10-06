// app/tools/pdf-tools/features/watermark/WatermarkUI.tsx
import React, { useState } from 'react'
import { Droplets, Type, Image, Upload } from 'lucide-react'

interface WatermarkUIProps {
  onApply: (options: any) => void
  onCancel: () => void
}

export const WatermarkUI: React.FC<WatermarkUIProps> = ({ onApply, onCancel }) => {
  const [type, setType] = useState<'text' | 'image'>('text')
  const [text, setText] = useState('CONFIDENTIAL')
  const [imageData, setImageData] = useState<Uint8Array | null>(null)
  const [imageName, setImageName] = useState('')
  const [position, setPosition] = useState('center')
  const [opacity, setOpacity] = useState(30)
  const [fontSize, setFontSize] = useState(50)
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState('#808080')

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
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-500" />
            Add Watermark
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Type Selection */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType('text')}
            className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 ${
              type === 'text' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Type className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => setType('image')}
            className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-2 ${
              type === 'image' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Image className="w-4 h-4" />
            Image
          </button>
        </div>

        <div className="space-y-4">
          {/* Content Input */}
          {type === 'text' ? (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Watermark Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter watermark text"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Watermark Image</label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-gray-300 rounded cursor-pointer hover:bg-gray-600">
                <Upload className="w-4 h-4" />
                {imageName || 'Choose image file'}
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
            <label className="block text-sm text-gray-300 mb-1">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
            >
              <option value="center">Center</option>
              <option value="diagonal">Diagonal</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Opacity: {opacity}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Text-specific options */}
          {type === 'text' && (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-20 bg-gray-700 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                    placeholder="#808080"
                  />
                </div>
              </div>
            </>
          )}

          {/* Rotation (if not diagonal) */}
          {position !== 'diagonal' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rotation: {rotation}°</label>
              <input
                type="range"
                min="-90"
                max="90"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
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
            Apply Watermark
          </button>
        </div>
      </div>
    </div>
  )
}
