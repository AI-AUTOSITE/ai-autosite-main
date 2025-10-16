// app/tools/test-file-generator/components/TestFileGeneratorClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { Download, FileText, Image, Sliders, Eye, EyeOff, Loader2, ChevronLeft, ChevronRight, Monitor } from 'lucide-react'
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
  const [showPreview, setShowPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // Always disable preview on mobile
      if (mobile) {
        setShowPreview(false)
      } else {
        setShowPreview(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update estimated size when settings change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const estimated = estimateFileSize(settings)
      setEstimatedSize(estimated)
    }, 300)

    return () => clearTimeout(timer)
  }, [settings])

  // Generate preview (debounced) - only on desktop
  useEffect(() => {
    if (isMobile || !showPreview) return

    const timer = setTimeout(() => {
      generatePreview()
    }, 500)

    return () => clearTimeout(timer)
  }, [settings, showPreview, isMobile])

  const generatePreview = () => {
    try {
      const pdf = generatePDF(settings)
      const pdfOutput = pdf.output('dataurlstring')
      setPreviewUrl(pdfOutput)
      setTotalPages(pdf.internal.pages.length - 1)
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

  // Mobile size limit warning
  const sizeWarning = isMobile && settings.targetSizeMB > 3

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Settings Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Text Settings */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <FileText className="text-cyan-400" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-white">Text</h2>
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value as Language })}
                className="w-full min-h-[48px] px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm sm:text-base
                           [&>option]:bg-gray-800 [&>option]:text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="english">English (Lorem Ipsum)</option>
                <option value="japanese">Japanese (Dummy Text)</option>
                <option value="mixed">Mixed (Both)</option>
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
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Image Settings */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Image className="text-purple-400" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-white">Images</h2>
            </div>

            {/* Image Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Image Type</label>
              <select
                value={settings.imageType}
                onChange={(e) => setSettings({ ...settings, imageType: e.target.value as ImageType })}
                className="w-full min-h-[48px] px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm sm:text-base
                           [&>option]:bg-gray-800 [&>option]:text-white focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="hard">Complex Patterns</option>
                <option value="easy">Simple Shapes</option>
              </select>
            </div>

            {/* Image Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSettings({ ...settings, imageSize: size.value as ImageSize })}
                    className={`min-h-[48px] py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                      settings.imageSize === size.value
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Images Per Page */}
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Per Page</span>
                <span className="text-purple-400 font-medium">{settings.imagesPerPage}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={settings.imagesPerPage}
                onChange={(e) => setSettings({ ...settings, imagesPerPage: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* File Size Settings */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Sliders className="text-orange-400" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-white">File Size</h2>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Target Size</span>
                <span className="text-orange-400 font-medium">{settings.targetSizeMB.toFixed(1)} MB</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={settings.targetSizeMB}
                onChange={(e) => setSettings({ ...settings, targetSizeMB: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.1 MB</span>
                <span>10 MB</span>
              </div>
            </div>

            {/* Size Warning for Mobile */}
            {sizeWarning && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-400">
                  Large files may cause slowdowns on mobile. 3MB or less recommended.
                </p>
              </div>
            )}

            {/* Estimated Size */}
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-gray-300">
                Estimated: <span className="text-orange-400 font-medium">{estimatedSize.toFixed(2)} MB</span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3">
              <p className="text-xs text-gray-400">Size</p>
              <p className="text-lg font-bold text-cyan-400">{estimatedSize.toFixed(2)} MB</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
              <p className="text-xs text-gray-400">Pages</p>
              <p className="text-lg font-bold text-purple-400">{totalPages}</p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full min-h-[56px] py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 
                       hover:to-purple-600 text-white font-semibold text-base sm:text-lg rounded-xl transition-all 
                       transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed 
                       disabled:transform-none flex items-center justify-center gap-2"
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

        {/* Preview Panel - Desktop Only */}
        {!isMobile && showPreview && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Eye className="text-cyan-400" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-white">Preview</h2>
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Live</div>
            </div>

            {/* Preview Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <p className="text-sm text-gray-400">Size</p>
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
                    className="min-h-[48px] px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="text-sm text-gray-400">
                    {currentPreviewPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPreviewPage(Math.min(totalPages, currentPreviewPage + 1))}
                    disabled={currentPreviewPage === totalPages}
                    className="min-h-[48px] px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white/5 rounded-lg border border-dashed border-white/20">
                <div className="text-center">
                  <Loader2 className="animate-spin mx-auto mb-2 text-cyan-400" size={28} />
                  <p className="text-sm text-gray-400">Loading preview...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Preview Notice */}
        {isMobile && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="text-center space-y-4">
              <Monitor className="mx-auto text-gray-400" size={48} />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Preview on Desktop</h3>
                <p className="text-sm text-gray-400">
                  Live preview is available on desktop browsers for the best experience.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  Your file will download immediately after generation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}