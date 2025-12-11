'use client'

import { useState, useCallback, useEffect } from 'react'
import { RefreshCw, Copy, Lock, Unlock, Check, Download, Eye, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface Color {
  id: string
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  locked: boolean
}

interface ContrastResult {
  ratio: number
  aa: boolean
  aaa: boolean
  aaLarge: boolean
  aaaLarge: boolean
}

type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json'

export default function ColorPaletteClient() {
  const [colors, setColors] = useState<Color[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [showContrast, setShowContrast] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [contrastColor1, setContrastColor1] = useState(0)
  const [contrastColor2, setContrastColor2] = useState(1)

  // Color conversion utilities
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  // WCAG Contrast calculation
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c /= 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const getContrastRatio = (color1: Color, color2: Color): ContrastResult => {
    const l1 = getLuminance(color1.rgb.r, color1.rgb.g, color1.rgb.b)
    const l2 = getLuminance(color2.rgb.r, color2.rgb.g, color2.rgb.b)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return {
      ratio,
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3,
      aaaLarge: ratio >= 4.5
    }
  }

  // Generate harmonious palette
  const generatePalette = useCallback(() => {
    const baseHue = Math.floor(Math.random() * 360)
    const paletteTypes = ['analogous', 'complementary', 'triadic', 'monochromatic', 'split-complementary']
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
          hue = (baseHue + Math.floor(i / 2) * 120 + (i % 2) * 15) % 360
          break
        case 'monochromatic':
          hue = baseHue
          break
        case 'split-complementary':
          if (i === 0) hue = baseHue
          else if (i < 3) hue = (baseHue + 150 + (i - 1) * 60) % 360
          else hue = (baseHue + (i - 3) * 20) % 360
          break
      }

      const saturation = type === 'monochromatic' ? 60 + i * 8 : Math.floor(Math.random() * 30) + 50
      const lightness = 30 + i * 12

      const existingColor = colors[i]
      
      if (existingColor?.locked) {
        newColors.push(existingColor)
      } else {
        const hex = hslToHex(hue, saturation, lightness)
        const rgb = hexToRgb(hex)
        const hsl = { h: hue, s: saturation, l: lightness }
        
        newColors.push({
          id: Math.random().toString(36).substr(2, 9),
          hex,
          rgb,
          hsl,
          locked: false,
        })
      }
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
  const copyColor = async (color: Color, format: 'hex' | 'rgb' | 'hsl' = 'hex') => {
    let text = color.hex
    if (format === 'rgb') text = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
    if (format === 'hsl') text = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
    
    try {
      await navigator.clipboard.writeText(text)
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

  // Export palette
  const exportPalette = (format: ExportFormat) => {
    let content = ''
    const names = ['primary', 'secondary', 'accent', 'neutral', 'highlight']
    
    switch (format) {
      case 'css':
        content = `:root {\n${colors.map((c, i) => `  --color-${names[i]}: ${c.hex};`).join('\n')}\n}`
        break
      case 'scss':
        content = colors.map((c, i) => `$color-${names[i]}: ${c.hex};`).join('\n')
        break
      case 'tailwind':
        content = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        '${names[i]}': '${c.hex}',`).join('\n')}\n      }\n    }\n  }\n}`
        break
      case 'json':
        content = JSON.stringify(
          Object.fromEntries(colors.map((c, i) => [names[i], { hex: c.hex, rgb: c.rgb, hsl: c.hsl }])),
          null, 2
        )
        break
    }
    
    navigator.clipboard.writeText(content)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  // Toggle lock on color
  const toggleLock = (colorId: string) => {
    setColors((prev) =>
      prev.map((color) => (color.id === colorId ? { ...color, locked: !color.locked } : color))
    )
  }

  // Get text color based on background
  const getTextColor = (hex: string): string => {
    const { r, g, b } = hexToRgb(hex)
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

  // Contrast result between selected colors
  const contrastResult = colors.length >= 2 
    ? getContrastRatio(colors[contrastColor1], colors[contrastColor2])
    : null

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
        <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-green-300 font-medium">100% Private</p>
          <p className="text-green-400/70 text-xs mt-1">
            Colors generated locally • No data sent anywhere
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        {/* Color Display */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
          {colors.map((color, index) => (
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Color info on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur
                              opacity-0 group-hover:opacity-100 transition-opacity text-center"
                >
                  <code className="text-white text-xs font-mono block">{color.hex}</code>
                  <code className="text-gray-300 text-[10px] font-mono block mt-0.5">
                    RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                  </code>
                </div>
              </div>
              
              {/* Color number for contrast checker */}
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* HEX codes display */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={generatePalette}
            className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                     rounded-xl font-medium hover:opacity-90 transition-all 
                     flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>New Colors</span>
          </button>
          <button
            onClick={copyAllColors}
            className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              copiedAll ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {copiedAll ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copiedAll ? 'Copied!' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* WCAG Contrast Checker */}
      <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <button
          onClick={() => setShowContrast(!showContrast)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span className="font-medium">WCAG Contrast Checker</span>
          </div>
          {showContrast ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showContrast && colors.length >= 2 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Foreground</label>
                <select
                  value={contrastColor1}
                  onChange={(e) => setContrastColor1(Number(e.target.value))}
                  className="w-full bg-black/30 text-white p-2 rounded-lg border border-white/10"
                >
                  {colors.map((c, i) => (
                    <option key={c.id} value={i} className="bg-gray-900">Color {i + 1}: {c.hex}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Background</label>
                <select
                  value={contrastColor2}
                  onChange={(e) => setContrastColor2(Number(e.target.value))}
                  className="w-full bg-black/30 text-white p-2 rounded-lg border border-white/10"
                >
                  {colors.map((c, i) => (
                    <option key={c.id} value={i} className="bg-gray-900">Color {i + 1}: {c.hex}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview */}
            <div 
              className="p-4 rounded-lg mb-4 text-center"
              style={{ backgroundColor: colors[contrastColor2]?.hex }}
            >
              <p style={{ color: colors[contrastColor1]?.hex }} className="text-lg font-medium">
                Sample Text Preview
              </p>
              <p style={{ color: colors[contrastColor1]?.hex }} className="text-sm">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>

            {/* Results */}
            {contrastResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className={`p-3 rounded-lg text-center ${contrastResult.aa ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {contrastResult.aa ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                    <span className={`text-sm font-medium ${contrastResult.aa ? 'text-green-400' : 'text-red-400'}`}>AA</span>
                  </div>
                  <p className="text-xs text-gray-400">Normal Text</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${contrastResult.aaa ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {contrastResult.aaa ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                    <span className={`text-sm font-medium ${contrastResult.aaa ? 'text-green-400' : 'text-red-400'}`}>AAA</span>
                  </div>
                  <p className="text-xs text-gray-400">Normal Text</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${contrastResult.aaLarge ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {contrastResult.aaLarge ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                    <span className={`text-sm font-medium ${contrastResult.aaLarge ? 'text-green-400' : 'text-red-400'}`}>AA</span>
                  </div>
                  <p className="text-xs text-gray-400">Large Text</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${contrastResult.aaaLarge ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {contrastResult.aaaLarge ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                    <span className={`text-sm font-medium ${contrastResult.aaaLarge ? 'text-green-400' : 'text-red-400'}`}>AAA</span>
                  </div>
                  <p className="text-xs text-gray-400">Large Text</p>
                </div>
              </div>
            )}

            <p className="text-center mt-3 text-lg font-bold text-white">
              Contrast Ratio: {contrastResult?.ratio.toFixed(2)}:1
            </p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <button
          onClick={() => setShowExport(!showExport)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <span className="font-medium">Export Palette</span>
          </div>
          {showExport ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showExport && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['css', 'scss', 'tailwind', 'json'] as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => exportPalette(format)}
                className="py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all text-sm"
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Preview */}
      <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <p className="text-xs text-gray-400 mb-2">Gradient Preview</p>
        <div
          className="h-12 rounded-lg"
          style={{
            background: `linear-gradient(90deg, ${colors.map((c) => c.hex).join(', ')})`,
          }}
        />
      </div>

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 Lock colors you like • Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Space</kbd> to generate new palette
      </p>
    </div>
  )
}