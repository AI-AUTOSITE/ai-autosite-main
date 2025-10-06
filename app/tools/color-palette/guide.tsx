// app/tools/color-palette/guide.tsx

import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  AlertCircle,
  Palette,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  Brush,
  Sparkles,
  Info,
  Monitor,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function ColorPaletteGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const examplePalette = ['#3b82f6', '#60a5fa', '#fbbf24', '#f59e0b', '#d97706']
  const colorHarmonies = [
    {
      name: 'Monochromatic',
      description: 'Different shades of the same color',
      colors: ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93bbfc'],
    },
    {
      name: 'Complementary',
      description: 'Opposite colors on the wheel',
      colors: ['#3b82f6', '#60a5fa', '#fbbf24', '#f59e0b', '#d97706'],
    },
    {
      name: 'Analogous',
      description: 'Neighboring colors',
      colors: ['#10b981', '#14b8a6', '#06b6d4', '#0284c7', '#0369a1'],
    },
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
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Color Palette Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">Beautiful Color Combinations</p>
              <p>Generate harmonious 5-color palettes for design projects.</p>
              <p className="mt-2">Perfect for websites, apps, and branding!</p>
            </div>
          </div>
        </div>

        {/* Sample Palette */}
        <div>
          <h4 className="font-semibold text-white mb-3">Example Palette</h4>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {examplePalette.map((color, index) => (
                <div key={index}>
                  <div className="aspect-square rounded-lg" style={{ backgroundColor: color }} />
                  <code className="text-xs text-gray-400 mt-1 block text-center">{color}</code>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleCopy(examplePalette.join(', '), 'palette')}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-gray-300 flex items-center justify-center gap-2 transition-colors"
            >
              {copiedExample === 'palette' ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Example Palette
                </>
              )}
            </button>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h4 className="font-semibold text-white mb-3">How to Use</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Generate Colors</p>
                <p className="text-sm text-gray-400 mt-1">
                  <RefreshCw className="inline w-3 h-3 mr-1" />
                  Click "New Colors" to generate a harmonious palette
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Lock Your Favorites</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Lock className="inline w-3 h-3 mr-1" />
                  Hover and click lock icon to keep colors you like
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Copy Colors</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Copy className="inline w-3 h-3 mr-1" />
                  Click any color to copy HEX, or copy all at once
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Preview in Context</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Eye className="inline w-3 h-3 mr-1" />
                  See how colors look in website and card designs
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Color Harmonies */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Brush className="w-5 h-5 text-pink-400" />
            Color Harmony Types
          </h4>
          <div className="space-y-3">
            {colorHarmonies.map((harmony, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{harmony.name}</p>
                    <p className="text-xs text-gray-400">{harmony.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {harmony.colors.map((color, i) => (
                    <div
                      key={i}
                      className="h-6 flex-1 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-blue-300 mb-2">Smart Features</p>
              <ul className="space-y-1 text-gray-300">
                <li>• AI-powered harmonious color generation</li>
                <li>• Lock system to keep colors you love</li>
                <li>• Live preview in real design contexts</li>
                <li>• One-click copy for individual or all colors</li>
                <li>• Mobile-friendly responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            Perfect For
          </h4>
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">Web Design:</span>
                <span className="text-gray-400 ml-1">Create cohesive website themes</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">Branding:</span>
                <span className="text-gray-400 ml-1">Develop brand color schemes</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">UI/UX:</span>
                <span className="text-gray-400 ml-1">Design app interfaces</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">Art & Design:</span>
                <span className="text-gray-400 ml-1">Create illustrations and graphics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Theory Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-300 mb-2">Pro Design Tips</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Use 60-30-10 rule: 60% dominant, 30% secondary, 10% accent</li>
                <li>• Limit to 3-5 colors for clean design</li>
                <li>• Test contrast for accessibility (WCAG standards)</li>
                <li>• Consider color psychology for your audience</li>
                <li>• Save palettes you like for future projects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-purple-500/10 rounded-lg p-4">
          <p className="text-sm text-white font-medium mb-2">💡 Quick Tips</p>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Generate multiple times to explore different harmonies</li>
            <li>• Lock 1-2 colors then generate to build around them</li>
            <li>• Use preview panels to test in real scenarios</li>
            <li>• Colors work great for gradients too!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Color Palette Generator Guide',
  icon: '🎨',
  available: true,
}
