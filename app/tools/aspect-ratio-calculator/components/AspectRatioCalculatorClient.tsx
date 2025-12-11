'use client'

import { useState, useCallback, useMemo } from 'react'
import { Copy, Check, Lock, Image, Monitor, Smartphone, Film, Ratio, RefreshCw } from 'lucide-react'

// ===== TYPES & CONSTANTS =====
interface Preset {
  name: string
  ratio: string
  width: number
  height: number
  icon: 'monitor' | 'smartphone' | 'film' | 'image'
  category: string
}

const PRESETS: Preset[] = [
  // Social Media - Horizontal
  { name: 'YouTube Video', ratio: '16:9', width: 1920, height: 1080, icon: 'monitor', category: 'Video' },
  { name: 'YouTube Thumbnail', ratio: '16:9', width: 1280, height: 720, icon: 'monitor', category: 'Video' },
  { name: 'Facebook Video', ratio: '16:9', width: 1920, height: 1080, icon: 'monitor', category: 'Social' },
  { name: 'Twitter/X Header', ratio: '3:1', width: 1500, height: 500, icon: 'monitor', category: 'Social' },
  { name: 'LinkedIn Banner', ratio: '4:1', width: 1584, height: 396, icon: 'monitor', category: 'Social' },
  
  // Social Media - Square & Vertical
  { name: 'Instagram Post', ratio: '1:1', width: 1080, height: 1080, icon: 'image', category: 'Social' },
  { name: 'Instagram Portrait', ratio: '4:5', width: 1080, height: 1350, icon: 'smartphone', category: 'Social' },
  { name: 'Instagram/TikTok Story', ratio: '9:16', width: 1080, height: 1920, icon: 'smartphone', category: 'Social' },
  { name: 'YouTube Shorts', ratio: '9:16', width: 1080, height: 1920, icon: 'smartphone', category: 'Video' },
  { name: 'Pinterest Pin', ratio: '2:3', width: 1000, height: 1500, icon: 'smartphone', category: 'Social' },
  
  // Display
  { name: 'HD 720p', ratio: '16:9', width: 1280, height: 720, icon: 'monitor', category: 'Display' },
  { name: 'Full HD 1080p', ratio: '16:9', width: 1920, height: 1080, icon: 'monitor', category: 'Display' },
  { name: '4K UHD', ratio: '16:9', width: 3840, height: 2160, icon: 'monitor', category: 'Display' },
  { name: 'Ultrawide', ratio: '21:9', width: 2560, height: 1080, icon: 'monitor', category: 'Display' },
  
  // Photo & Print
  { name: 'Photo 4x6', ratio: '3:2', width: 1800, height: 1200, icon: 'image', category: 'Photo' },
  { name: 'Photo 5x7', ratio: '7:5', width: 2100, height: 1500, icon: 'image', category: 'Photo' },
  { name: 'Photo 8x10', ratio: '5:4', width: 2400, height: 1920, icon: 'image', category: 'Photo' },
  { name: 'A4 Paper', ratio: '√2:1', width: 2480, height: 3508, icon: 'image', category: 'Print' },
  
  // Cinema
  { name: 'Cinema Widescreen', ratio: '2.39:1', width: 2048, height: 858, icon: 'film', category: 'Cinema' },
  { name: 'IMAX', ratio: '1.43:1', width: 1430, height: 1000, icon: 'film', category: 'Cinema' },
]

const COMMON_RATIOS = ['16:9', '4:3', '1:1', '9:16', '4:5', '3:2', '21:9', '2:3']

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function calculateRatio(width: number, height: number): string {
  if (!width || !height) return '-'
  const divisor = gcd(width, height)
  return `${width / divisor}:${height / divisor}`
}

function calculateHeight(width: number, ratioW: number, ratioH: number): number {
  return Math.round((width / ratioW) * ratioH)
}

function calculateWidth(height: number, ratioW: number, ratioH: number): number {
  return Math.round((height / ratioH) * ratioW)
}

// ===== MAIN COMPONENT =====
export default function AspectRatioCalculatorClient() {
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [lockedRatio, setLockedRatio] = useState<{ w: number; h: number } | null>({ w: 16, h: 9 })
  const [copied, setCopied] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('Video')
  
  // Calculate current ratio
  const currentRatio = useMemo(() => calculateRatio(width, height), [width, height])
  
  // Handle width change
  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth)
    if (lockedRatio) {
      setHeight(calculateHeight(newWidth, lockedRatio.w, lockedRatio.h))
    }
  }, [lockedRatio])
  
  // Handle height change
  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight)
    if (lockedRatio) {
      setWidth(calculateWidth(newHeight, lockedRatio.w, lockedRatio.h))
    }
  }, [lockedRatio])
  
  // Apply preset
  const applyPreset = useCallback((preset: Preset) => {
    setWidth(preset.width)
    setHeight(preset.height)
    const [rw, rh] = preset.ratio.includes('√') ? [16, 9] : preset.ratio.split(':').map(Number)
    setLockedRatio({ w: rw || 16, h: rh || 9 })
    if (navigator.vibrate) navigator.vibrate(30)
  }, [])
  
  // Apply common ratio
  const applyRatio = useCallback((ratio: string) => {
    const [rw, rh] = ratio.split(':').map(Number)
    setLockedRatio({ w: rw, h: rh })
    setHeight(calculateHeight(width, rw, rh))
    if (navigator.vibrate) navigator.vibrate(30)
  }, [width])
  
  // Toggle lock
  const toggleLock = useCallback(() => {
    if (lockedRatio) {
      setLockedRatio(null)
    } else {
      const [rw, rh] = currentRatio.split(':').map(Number)
      setLockedRatio({ w: rw || width, h: rh || height })
    }
  }, [lockedRatio, currentRatio, width, height])
  
  // Swap dimensions
  const swapDimensions = useCallback(() => {
    setWidth(height)
    setHeight(width)
    if (lockedRatio) {
      setLockedRatio({ w: lockedRatio.h, h: lockedRatio.w })
    }
    if (navigator.vibrate) navigator.vibrate(30)
  }, [width, height, lockedRatio])
  
  // Copy
  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(null), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }, [])
  
  // Filter presets by category
  const filteredPresets = useMemo(() => {
    return PRESETS.filter(p => p.category === activeCategory)
  }, [activeCategory])
  
  const categories = useMemo(() => [...new Set(PRESETS.map(p => p.category))], [])
  
  // Preview aspect ratio
  const previewStyle = useMemo(() => {
    const maxWidth = 300
    const maxHeight = 200
    const ratio = width / height
    
    let previewW, previewH
    if (ratio > maxWidth / maxHeight) {
      previewW = maxWidth
      previewH = maxWidth / ratio
    } else {
      previewH = maxHeight
      previewW = maxHeight * ratio
    }
    
    return { width: previewW, height: previewH }
  }, [width, height])

  const PresetIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'monitor': return <Monitor className="w-4 h-4" />
      case 'smartphone': return <Smartphone className="w-4 h-4" />
      case 'film': return <Film className="w-4 h-4" />
      default: return <Image className="w-4 h-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All calculations done locally in your browser
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator Section */}
        <div className="space-y-4">
          {/* Main Calculator */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-gray-300">Dimensions</h3>
              <button
                onClick={toggleLock}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    lockedRatio ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400' : 'bg-white/5 border border-white/10 text-gray-400'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">{lockedRatio ? `${lockedRatio.w}:${lockedRatio.h} Locked` : 'Unlocked'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3 font-mono text-xl outline-none focus:border-pink-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3 font-mono text-xl outline-none focus:border-pink-500/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center my-4">
                <button
                  onClick={swapDimensions}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                  title="Swap width and height"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              
              {/* Result */}
              <div className="p-4 bg-pink-500/10 rounded-xl border border-pink-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Aspect Ratio</div>
                    <div className="text-3xl font-bold text-pink-400">{currentRatio}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${width}x${height}`, 'dims')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {copied === 'dims' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{width}×{height}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Common Ratios */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Common Ratios</h3>
              <div className="flex flex-wrap gap-2">
                {COMMON_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => applyRatio(ratio)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      lockedRatio && `${lockedRatio.w}:${lockedRatio.h}` === ratio
                        ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Visual Preview */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Preview</h3>
              <div className="flex items-center justify-center h-52">
                <div
                  className="bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-lg border-2 border-pink-500/50 flex items-center justify-center"
                  style={{ width: previewStyle.width, height: previewStyle.height }}
                >
                  <span className="text-pink-400 font-mono text-sm">{currentRatio}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Presets Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="font-medium text-gray-300 mb-4">Platform Presets</h3>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeCategory === cat
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Preset List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredPresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(preset)}
                  className="w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-left transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <PresetIcon type={preset.icon} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.width}×{preset.height}</div>
                    </div>
                  </div>
                  <span className="text-pink-400 font-mono text-sm">{preset.ratio}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}
