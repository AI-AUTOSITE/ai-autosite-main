// app/tools/image-compress/guide.tsx

import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  AlertCircle,
  Image,
  Upload,
  Download,
  Zap,
  Shield,
  Sliders,
  Info,
  FileImage,
  ArrowDown,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function ImageCompressGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const qualitySettings = [
    {
      range: '80-90%',
      use: 'Photos',
      description: 'No visible difference, 60% smaller',
      color: 'text-green-400',
    },
    {
      range: '60-80%',
      use: 'Web Graphics',
      description: 'Slight quality loss, 70-80% smaller',
      color: 'text-yellow-400',
    },
    {
      range: 'Below 60%',
      use: 'Thumbnails',
      description: 'Visible quality loss, 85%+ smaller',
      color: 'text-orange-400',
    },
  ]

  const idealSizes = [
    { type: 'Hero images', size: '200-300KB', dimensions: '1920x1080px' },
    { type: 'Blog images', size: '100-150KB', dimensions: '800x600px' },
    { type: 'Thumbnails', size: '20-50KB', dimensions: '300x300px' },
    { type: 'Icons', size: '5-10KB', dimensions: '64x64px' },
  ]

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedExample(id)
    setTimeout(() => setCopiedExample(null), 2000)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Image className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Image Compress Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">Compress Images Without Quality Loss</p>
              <p>Reduce file sizes by 60-80% while keeping images looking perfect.</p>
              <p className="mt-2">Batch processing • Instant download • 100% private</p>
            </div>
          </div>
        </div>

        {/* Why Compress */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Why Compress Images?</p>
              <ul className="space-y-1 text-gray-300 mt-2">
                <li>• 3-5x faster page loading</li>
                <li>• Better SEO rankings</li>
                <li>• Save bandwidth for users</li>
                <li>• Reduce storage costs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h4 className="font-semibold text-white mb-3">3 Simple Steps</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Set Quality Level</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Sliders className="inline w-3 h-3 mr-1" />
                  Adjust the slider (80% recommended for photos)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Upload Images</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Upload className="inline w-3 h-3 mr-1" />
                  Drag & drop or click to select (JPG, PNG, WebP)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Download Results</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Download className="inline w-3 h-3 mr-1" />
                  Get individual files or download all at once
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Quality Settings Guide */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            Quality Settings Guide
          </h4>
          <div className="space-y-2">
            {qualitySettings.map((setting, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-sm font-medium ${setting.color}`}>{setting.range}</span>
                    <span className="text-white text-sm ml-2">for {setting.use}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{setting.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal Sizes Table */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-cyan-400" />
            Ideal Web Image Sizes
          </h4>
          <div className="bg-black/30 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left text-white px-3 py-2 text-xs">Use Case</th>
                  <th className="text-left text-white px-3 py-2 text-xs">Target Size</th>
                  <th className="text-left text-white px-3 py-2 text-xs">Dimensions</th>
                </tr>
              </thead>
              <tbody>
                {idealSizes.map((item, index) => (
                  <tr key={index} className="border-t border-white/5">
                    <td className="text-gray-300 px-3 py-2">{item.type}</td>
                    <td className="text-cyan-400 px-3 py-2">{item.size}</td>
                    <td className="text-gray-400 px-3 py-2">{item.dimensions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold text-white mb-3">Key Features</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <ArrowDown className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-white">Batch Processing</p>
                <p className="text-xs text-gray-400">Compress multiple images at once</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-white">100% Private</p>
                <p className="text-xs text-gray-400">All processing happens in your browser</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-white">Instant Results</p>
                <p className="text-xs text-gray-400">See savings percentage immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-300 mb-2">Pro Tips</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Keep originals as backup before compressing</li>
                <li>• Use JPG for photos, PNG for graphics with transparency</li>
                <li>• Resize images to display size first for best results</li>
                <li>• Test different quality levels to find your sweet spot</li>
                <li>• 80% quality is usually perfect for web use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-sm text-white font-medium mb-2">📊 Compression Facts</p>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Original 5MB photo → 200KB after compression</li>
            <li>• Supports JPG, PNG, WebP formats</li>
            <li>• Max file size: 20MB per image</li>
            <li>• Uses browser-native compression algorithms</li>
          </ul>
        </div>

        {/* Privacy Note */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">Your Images Stay Private</p>
              <p className="text-gray-300">
                All compression happens locally in your browser. Images are never uploaded to any
                server. Perfect for sensitive or confidential images.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Image Compress Guide',
  icon: '🖼️',
  available: true,
}
