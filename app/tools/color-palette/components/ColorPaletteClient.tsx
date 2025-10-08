'use client'

import { useState, useCallback, useEffect } from 'react'
import { RefreshCw, Copy, Lock, Unlock, Check } from 'lucide-react'

interface Color {
  id: string
  hex: string
  locked: boolean
}

export default function ColorPaletteClient() {
  const [colors, setColors] = useState<Color[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  // Generate harmonious palette
  const generatePalette = useCallback(() => {
    const baseHue = Math.floor(Math.random() * 360)
    const paletteTypes = ['analogous', 'complementary', 'triadic', 'monochromatic']
    const type = paletteTypes[Math.floor(Math.random() * paletteTypes.length)]

    const newColors: Color[] = []

    for (let i = 0; i < 5; i++) {
      let hue = baseHue

      switch (type) {
        case 'analogous':
          hue = (baseHue + i * 30) % 360
          break
        case 'complementary':
          hue = i < 3 ? baseHue : (baseHue + 180) % 360
          hue += (i % 3) * 20
          break
        case 'triadic':
          hue = (baseHue + i * 120) % 360
          break
        case 'monochromatic':
          hue = baseHue
          break
      }

      const saturation = type === 'monochromatic' ? 60 + i * 8 : Math.floor(Math.random() * 30) + 50
      const lightness = 30 + i * 12

      // Convert HSL to HEX
      const hslToHex = (h: number, s: number, l: number): string => {
        l /= 100
        const a = (s * Math.min(l, 1 - l)) / 100
        const f = (n: number) => {
          const k = (n + h / 30) % 12
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
          return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
      }

      const existingColor = colors[i]

      newColors.push({
        id: Math.random().toString(36).substr(2, 9),
        hex: existingColor?.locked ? existingColor.hex : hslToHex(hue, saturation, lightness),
        locked: existingColor?.locked || false,
      })
    }

    setColors(newColors)
  }, [colors])

  // Initialize palette on mount
  useEffect(() => {
    if (colors.length === 0) {
      generatePalette()
    }
  }, [])

  // Copy single color
  const copyColor = async (color: Color) => {
    try {
      await navigator.clipboard.writeText(color.hex)
      setCopiedId(color.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  // Copy all colors
  const copyAllColors = async () => {
    const allColors = colors.map((c) => c.hex).join(', ')
    try {
      await navigator.clipboard.writeText(allColors)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  // Toggle lock on color
  const toggleLock = (colorId: string) => {
    setColors((prev) =>
      prev.map((color) => (color.id === colorId ? { ...color, locked: !color.locked } : color))
    )
  }

  // Get text color based on background
  const getTextColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  // Handle spacebar for new palette
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        generatePalette()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [generatePalette])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        {/* Color Display - Large and Prominent */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
          {colors.map((color) => (
            <div key={color.id} className="relative group">
              <div
                onClick={() => copyColor(color)}
                className="aspect-square rounded-xl cursor-pointer transform transition-all 
                         hover:scale-105 hover:shadow-xl relative overflow-hidden"
                style={{ backgroundColor: color.hex }}
              >
                {/* Lock button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLock(color.id)
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/20 backdrop-blur rounded-lg 
                           opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: getTextColor(color.hex) }}
                >
                  {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>

                {/* Copied indicator */}
                {copiedId === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur animate-fadeIn">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* HEX code on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur
                              opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <code className="text-white text-xs font-mono block text-center">
                    {color.hex}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HEX codes display */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {colors.map((color) => (
            <code
              key={color.id}
              onClick={() => copyColor(color)}
              className="text-white text-xs font-mono bg-black/20 px-3 py-2 rounded cursor-pointer
                       hover:bg-black/30 transition-all whitespace-nowrap"
            >
              {color.hex}
            </code>
          ))}
        </div>

        {/* Action Buttons - Simplified */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={generatePalette}
            className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                     rounded-xl font-medium hover:opacity-90 transition-all 
                     flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="hidden sm:inline">New Colors</span>
            <span className="sm:hidden">Generate</span>
          </button>
          <button
            onClick={copyAllColors}
            className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              copiedAll ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {copiedAll ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Preview - Simplified */}
      <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Simple gradient preview */}
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-2">Gradient</p>
            <div
              className="h-12 rounded-lg"
              style={{
                background: `linear-gradient(90deg, ${colors.map((c) => c.hex).join(', ')})`,
              }}
            />
          </div>

          {/* Color blocks preview */}
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-2">Preview</p>
            <div className="flex gap-1">
              {colors.slice(0, 3).map((color, i) => (
                <div
                  key={i}
                  className="h-12 flex-1 rounded"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 Lock colors • Press space to generate
      </p>
    </div>
  )
}