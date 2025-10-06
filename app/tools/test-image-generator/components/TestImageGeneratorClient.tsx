// app/tools/test-image-generator/components/TestImageGeneratorClient.tsx
'use client'

import { useState } from 'react'
import { Download, Image as ImageIcon, Sliders, Settings, Loader2, ZapOff, Zap } from 'lucide-react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import {
  DEFAULT_SETTINGS,
  PRESET_SIZES,
  type ImageSettings,
  type ImageFormat,
  type Complexity,
  type ColorMode,
  type PresetSize,
} from '../lib/types'
import { generateTestImage, generateFilename, estimateFileSize } from '../lib/imageGenerator'

export default function TestImageGeneratorClient() {
  const [settings, setSettings] = useState<ImageSettings>(DEFAULT_SETTINGS)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<PresetSize>('Full HD')

  const handlePresetChange = (preset: PresetSize) => {
    setSelectedPreset(preset)
    if (preset !== 'Custom') {
      const size = PRESET_SIZES[preset]
      setSettings({ ...settings, width: size.width, height: size.height })
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      if (settings.count === 1) {
        // Single image download
        const dataUrl = generateTestImage(settings)
        const blob = await (await fetch(dataUrl)).blob()
        const filename = generateFilename(settings.format, 1)
        saveAs(blob, filename)
      } else {
        // Batch download as ZIP
        const zip = new JSZip()

        for (let i = 1; i <= settings.count; i++) {
          const dataUrl = generateTestImage(settings)
          const blob = await (await fetch(dataUrl)).blob()
          const filename = generateFilename(settings.format, i)
          zip.file(filename, blob)
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const now = new Date()
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
        saveAs(zipBlob, `test-images-${timestamp}.zip`)
      }
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Failed to generate images. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePreview = () => {
    try {
      const dataUrl = generateTestImage(settings)
      setPreviewUrl(dataUrl)
    } catch (error) {
      console.error('Preview generation failed:', error)
      setPreviewUrl(null)
    }
  }

  const estimatedSize = estimateFileSize(settings)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Size Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold">Size Settings</h2>
              </div>

              {/* Preset Sizes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Preset Size</label>
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value as PresetSize)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Full HD">Full HD (1920×1080)</option>
                  <option value="4K">4K (3840×2160)</option>
                  <option value="Square">Square (1000×1000)</option>
                  <option value="Portrait">Portrait (1080×1920)</option>
                  <option value="Thumbnail">Thumbnail (300×300)</option>
                  <option value="Banner">Banner (1200×630)</option>
                  <option value="Custom">Custom Size</option>
                </select>
              </div>

              {/* Custom Size Inputs */}
              {selectedPreset === 'Custom' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="7680"
                      value={settings.width}
                      onChange={(e) => setSettings({ ...settings, width: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="7680"
                      value={settings.height}
                      onChange={(e) => setSettings({ ...settings, height: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* Display actual dimensions */}
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  Dimensions:{' '}
                  <span className="text-cyan-400 font-medium">
                    {settings.width} × {settings.height}px
                  </span>
                </p>
              </div>
            </div>

            {/* Format & Quality Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="text-purple-400" size={24} />
                <h2 className="text-2xl font-bold">Format & Quality</h2>
              </div>

              {/* Format Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Image Format</label>
                <select
                  value={settings.format}
                  onChange={(e) =>
                    setSettings({ ...settings, format: e.target.value as ImageFormat })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="jpeg">JPEG (Best compatibility)</option>
                  <option value="png">PNG (Lossless)</option>
                  <option value="webp">WebP (Modern, smaller)</option>
                </select>
              </div>

              {/* Quality Slider */}
              {settings.format !== 'png' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Quality</span>
                    <span className="text-purple-400 font-medium">
                      {Math.round(settings.quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.quality}
                    onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                  />
                </div>
              )}

              {/* Complexity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Compression Difficulty
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSettings({ ...settings, complexity: 'easy' })}
                    className={`p-4 rounded-lg border transition-all ${
                      settings.complexity === 'easy'
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <ZapOff
                      className={`mx-auto mb-2 ${settings.complexity === 'easy' ? 'text-green-400' : 'text-gray-400'}`}
                      size={20}
                    />
                    <p className="text-sm font-medium">Easy</p>
                    <p className="text-xs text-gray-400 mt-1">Simple patterns</p>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, complexity: 'hard' })}
                    className={`p-4 rounded-lg border transition-all ${
                      settings.complexity === 'hard'
                        ? 'bg-orange-500/20 border-orange-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Zap
                      className={`mx-auto mb-2 ${settings.complexity === 'hard' ? 'text-orange-400' : 'text-gray-400'}`}
                      size={20}
                    />
                    <p className="text-sm font-medium">Hard</p>
                    <p className="text-xs text-gray-400 mt-1">Complex noise</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Color Mode Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Sliders className="text-orange-400" size={24} />
                <h2 className="text-2xl font-bold">Color Mode</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['solid', 'gradient', 'pattern', 'noise'] as ColorMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings({ ...settings, colorMode: mode })}
                    className={`p-3 rounded-lg border transition-all capitalize ${
                      settings.colorMode === mode
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Generation */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="text-pink-400" size={24} />
                <h2 className="text-2xl font-bold">Batch Generation</h2>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Number of Images</span>
                  <span className="text-pink-400 font-medium">{settings.count}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.count}
                  onChange={(e) => setSettings({ ...settings, count: Number(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 image</span>
                  <span>10 images</span>
                </div>
              </div>

              {settings.count > 1 && (
                <div className="mt-4 p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                  <p className="text-sm text-gray-300">Will be downloaded as ZIP file</p>
                </div>
              )}
            </div>

            {/* File Size Info */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-3">Estimated Size</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Per Image:</span>
                  <span className="text-cyan-400 font-medium">{estimatedSize.toFixed(2)} MB</span>
                </div>
                {settings.count > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total ({settings.count} images):</span>
                    <span className="text-purple-400 font-medium">
                      {(estimatedSize * settings.count).toFixed(2)} MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGeneratePreview}
                className="py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
              >
                Preview
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Download
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold">Preview</h2>
            </div>

            {previewUrl ? (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto"
                    style={{ maxHeight: '600px', objectFit: 'contain' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                    <p className="text-gray-400">Format</p>
                    <p className="text-cyan-400 font-bold uppercase">{settings.format}</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-gray-400">Size</p>
                    <p className="text-purple-400 font-bold">
                      {settings.width}×{settings.height}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-dashed border-white/20">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-4 text-gray-600" size={48} />
                  <p className="text-gray-400 mb-2">Click "Preview" to see your image</p>
                  <p className="text-sm text-gray-500">Settings update in real-time</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
