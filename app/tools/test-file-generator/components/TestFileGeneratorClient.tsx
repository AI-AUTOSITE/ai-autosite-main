// app/tools/test-file-generator/components/TestFileGeneratorClient.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Download,
  FileText,
  Image,
  Sliders,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { saveAs } from 'file-saver'
import {
  DEFAULT_SETTINGS,
  type GeneratorSettings,
  type Language,
  type ImageType,
  type ImageSize,
} from '../lib/types'
import { generatePDF, generateFilename, estimateFileSize } from '../lib/generators'

export default function TestFileGeneratorClient() {
  const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentPreviewPage, setCurrentPreviewPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [estimatedSize, setEstimatedSize] = useState(2.5)

  // Update estimated size when settings change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const estimated = estimateFileSize(settings)
      setEstimatedSize(estimated)
    }, 300)

    return () => clearTimeout(timer)
  }, [settings])

  // Generate preview (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      generatePreview()
    }, 500)

    return () => clearTimeout(timer)
  }, [settings])

  const generatePreview = () => {
    try {
      const pdf = generatePDF(settings)
      const pdfOutput = pdf.output('dataurlstring')
      setPreviewUrl(pdfOutput)
      setTotalPages(pdf.internal.pages.length - 1) // -1 because jsPDF counts from 1
      setCurrentPreviewPage(1)
    } catch (error) {
      console.error('Preview generation failed:', error)
      setPreviewUrl(null)
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    try {
      const pdf = generatePDF(settings)
      const blob = pdf.output('blob')
      const filename = generateFilename()
      saveAs(blob, filename)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Text Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold">Text Settings</h2>
              </div>

              {/* Language Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value as Language })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="english">English (Lorem Ipsum)</option>
                  <option value="japanese">Japanese (Dummy Text)</option>
                  <option value="mixed">Mixed (English + Japanese)</option>
                </select>
              </div>

              {/* Text Amount Slider */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Text Amount</span>
                  <span className="text-cyan-400 font-medium">{settings.textAmount}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.textAmount}
                  onChange={(e) => setSettings({ ...settings, textAmount: Number(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
                />
              </div>
            </div>

            {/* Image Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Image className="text-purple-400" size={24} />
                <h2 className="text-2xl font-bold">Image Settings</h2>
              </div>

              {/* Image Type */}
              <div className="mb-6 relative z-30">
                <label className="block text-sm font-medium text-gray-300 mb-2">Image Type</label>
                <select
                  value={settings.imageType}
                  onChange={(e) =>
                    setSettings({ ...settings, imageType: e.target.value as ImageType })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="hard">Hard to Process (Complex patterns)</option>
                  <option value="easy">Easy to Process (Simple shapes)</option>
                </select>
              </div>

              {/* Image Size */}
              <div className="mb-4 relative z-10">
                <label className="block text-sm font-medium text-gray-300 mb-2">Image Size</label>
                <select
                  value={settings.imageSize}
                  onChange={(e) =>
                    setSettings({ ...settings, imageSize: e.target.value as ImageSize })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="small">Small (200x200px)</option>
                  <option value="medium">Medium (400x400px)</option>
                  <option value="large">Large (600x600px)</option>
                </select>
              </div>

              {/* Images Per Page */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Images Per Page</span>
                  <span className="text-purple-400 font-medium">{settings.imagesPerPage}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={settings.imagesPerPage}
                  onChange={(e) =>
                    setSettings({ ...settings, imagesPerPage: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                />
              </div>
            </div>

            {/* File Size Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Sliders className="text-orange-400" size={24} />
                <h2 className="text-2xl font-bold">File Size</h2>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Target Size</span>
                  <span className="text-orange-400 font-medium">
                    {settings.targetSizeMB.toFixed(1)} MB
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={settings.targetSizeMB}
                  onChange={(e) =>
                    setSettings({ ...settings, targetSizeMB: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.1 MB</span>
                  <span>10 MB</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  Estimated:{' '}
                  <span className="text-orange-400 font-medium">{estimatedSize.toFixed(2)} MB</span>
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Generate & Download
                </>
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Eye className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold">Live Preview</h2>
              </div>
              <div className="text-sm text-gray-400">Updates in real-time</div>
            </div>

            {/* Preview Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <p className="text-sm text-gray-400">Estimated Size</p>
                <p className="text-xl font-bold text-cyan-400">{estimatedSize.toFixed(2)} MB</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="text-sm text-gray-400">Pages</p>
                <p className="text-xl font-bold text-purple-400">{totalPages}</p>
              </div>
            </div>

            {/* PDF Preview */}
            {previewUrl ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  <iframe
                    src={`${previewUrl}#page=${currentPreviewPage}`}
                    className="w-full h-full border-0"
                    title="PDF Preview"
                  />
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPreviewPage(Math.max(1, currentPreviewPage - 1))}
                    disabled={currentPreviewPage === 1}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="text-sm text-gray-400">
                    Page {currentPreviewPage} / {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPreviewPage(Math.min(totalPages, currentPreviewPage + 1))
                    }
                    disabled={currentPreviewPage === totalPages}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white/5 rounded-lg border border-dashed border-white/20">
                <div className="text-center">
                  <Loader2 className="animate-spin mx-auto mb-2 text-cyan-400" size={32} />
                  <p className="text-gray-400">Generating preview...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
