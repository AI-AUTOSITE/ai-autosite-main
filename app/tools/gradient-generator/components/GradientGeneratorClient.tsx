'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw, Plus, Trash2, Lock } from 'lucide-react'

type GradientType = 'linear' | 'radial' | 'conic'
type OutputFormat = 'css' | 'tailwind'

interface ColorStop {
  color: string
  position: number
}

interface Preset {
  name: string
  colors: ColorStop[]
  angle: number
  type: GradientType
}

const PRESETS: Preset[] = [
  { name: 'Sunset', colors: [{ color: '#ff6b6b', position: 0 }, { color: '#ffd93d', position: 100 }], angle: 45, type: 'linear' },
  { name: 'Ocean', colors: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }], angle: 135, type: 'linear' },
  { name: 'Forest', colors: [{ color: '#38ef7d', position: 0 }, { color: '#11998e', position: 100 }], angle: 90, type: 'linear' },
  { name: 'Fire', colors: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }], angle: 45, type: 'linear' },
  { name: 'Purple', colors: [{ color: '#c471f5', position: 0 }, { color: '#fa71cd', position: 100 }], angle: 45, type: 'linear' },
  { name: 'Mint', colors: [{ color: '#00b09b', position: 0 }, { color: '#96c93d', position: 100 }], angle: 90, type: 'linear' },
  { name: 'Aurora', colors: [{ color: '#00d2ff', position: 0 }, { color: '#3a7bd5', position: 50 }, { color: '#00d2ff', position: 100 }], angle: 180, type: 'linear' },
  { name: 'Rainbow', colors: [{ color: '#ff0000', position: 0 }, { color: '#ff7f00', position: 17 }, { color: '#ffff00', position: 33 }, { color: '#00ff00', position: 50 }, { color: '#0000ff', position: 67 }, { color: '#8b00ff', position: 100 }], angle: 90, type: 'linear' },
  { name: 'Radial Glow', colors: [{ color: '#ffffff', position: 0 }, { color: '#6366f1', position: 100 }], angle: 0, type: 'radial' },
  { name: 'Conic Wheel', colors: [{ color: '#ff0000', position: 0 }, { color: '#00ff00', position: 33 }, { color: '#0000ff', position: 66 }, { color: '#ff0000', position: 100 }], angle: 0, type: 'conic' },
  { name: 'Neon', colors: [{ color: '#00f260', position: 0 }, { color: '#0575e6', position: 100 }], angle: 45, type: 'linear' },
  { name: 'Peach', colors: [{ color: '#ffb88c', position: 0 }, { color: '#de6262', position: 100 }], angle: 135, type: 'linear' },
]

const vibrate = (duration: number) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

export default function GradientGeneratorClient() {
  const [type, setType] = useState<GradientType>('linear')
  const [angle, setAngle] = useState(45)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ])
  const [copied, setCopied] = useState(false)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('css')

  const generateCSS = () => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(', ')

    switch (type) {
      case 'linear':
        return `background: linear-gradient(${angle}deg, ${stops});`
      case 'radial':
        return `background: radial-gradient(circle, ${stops});`
      case 'conic':
        return `background: conic-gradient(from ${angle}deg, ${stops});`
      default:
        return ''
    }
  }

  const generateTailwind = () => {
    // Tailwind doesn't support custom gradients directly, so we generate arbitrary value
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color}_${s.position}%`)
      .join(',')

    switch (type) {
      case 'linear':
        return `bg-[linear-gradient(${angle}deg,${stops.replace(/#/g, '%23')})]`
      case 'radial':
        return `bg-[radial-gradient(circle,${stops.replace(/#/g, '%23')})]`
      case 'conic':
        return `bg-[conic-gradient(from_${angle}deg,${stops.replace(/#/g, '%23')})]`
      default:
        return ''
    }
  }

  const getGradientStyle = () => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(', ')

    switch (type) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stops})`
      case 'radial':
        return `radial-gradient(circle, ${stops})`
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stops})`
      default:
        return ''
    }
  }

  const copyOutput = async () => {
    try {
      const text = outputFormat === 'css' ? generateCSS() : generateTailwind()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const applyPreset = (preset: Preset) => {
    setColorStops([...preset.colors])
    setAngle(preset.angle)
    setType(preset.type)
    vibrate(30)
  }

  const randomGradient = () => {
    const randomColor = () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    
    const numColors = Math.floor(Math.random() * 3) + 2 // 2-4 colors
    const newStops: ColorStop[] = []
    
    for (let i = 0; i < numColors; i++) {
      newStops.push({
        color: randomColor(),
        position: Math.round((i / (numColors - 1)) * 100),
      })
    }
    
    setColorStops(newStops)
    setAngle(Math.floor(Math.random() * 360))
    vibrate(30)
  }

  const addColorStop = () => {
    if (colorStops.length >= 6) return
    
    // Find middle position
    const positions = colorStops.map((s) => s.position).sort((a, b) => a - b)
    let newPosition = 50
    
    for (let i = 0; i < positions.length - 1; i++) {
      const gap = positions[i + 1] - positions[i]
      if (gap > 20) {
        newPosition = Math.round(positions[i] + gap / 2)
        break
      }
    }
    
    setColorStops([...colorStops, { color: '#888888', position: newPosition }])
    vibrate(30)
  }

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) return
    setColorStops(colorStops.filter((_, i) => i !== index))
    vibrate(30)
  }

  const updateColorStop = (index: number, field: 'color' | 'position', value: string | number) => {
    const updated = [...colorStops]
    if (field === 'color') {
      updated[index].color = value as string
    } else {
      updated[index].position = Math.max(0, Math.min(100, value as number))
    }
    setColorStops(updated)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All processing done locally
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        {/* Live Preview */}
        <div
          className="h-40 sm:h-48 rounded-xl mb-6 shadow-xl transition-all duration-300"
          style={{ background: getGradientStyle() }}
        />

        {/* Type Toggle */}
        <div className="flex gap-2 mb-6">
          {(['linear', 'radial', 'conic'] as GradientType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 min-h-[48px] py-3 rounded-lg font-medium transition-all capitalize ${
                type === t
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Angle Slider */}
        {(type === 'linear' || type === 'conic') && (
          <div className="mb-6">
            <label className="text-white text-sm mb-2 block">
              {type === 'conic' ? 'Start Angle' : 'Angle'}: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white 
                       [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        )}

        {/* Color Stops */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-white font-medium">Color Stops</label>
            {colorStops.length < 6 && (
              <button
                onClick={addColorStop}
                className="text-xs px-3 py-1.5 bg-white/10 text-gray-400 rounded-lg hover:text-white hover:bg-white/20 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {colorStops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                  maxLength={7}
                  className="flex-1 min-w-0 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm
                           focus:outline-none focus:border-purple-400"
                />
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                  <input
                    type="number"
                    value={stop.position}
                    onChange={(e) => updateColorStop(index, 'position', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="w-12 bg-transparent text-white text-sm text-center focus:outline-none"
                  />
                  <span className="text-gray-400 text-xs">%</span>
                </div>
                {colorStops.length > 2 && (
                  <button
                    onClick={() => removeColorStop(index)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Output Format Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOutputFormat('css')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              outputFormat === 'css'
                ? 'bg-cyan-500/30 text-cyan-300'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setOutputFormat('tailwind')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              outputFormat === 'tailwind'
                ? 'bg-cyan-500/30 text-cyan-300'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Tailwind
          </button>
        </div>

        {/* CSS Output */}
        <div className="bg-black/30 rounded-lg p-3 sm:p-4 mb-6 overflow-x-auto">
          <code className="text-purple-400 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all block">
            {outputFormat === 'css' ? generateCSS() : generateTailwind()}
          </code>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={copyOutput}
            className={`flex-1 min-h-[48px] py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy {outputFormat.toUpperCase()}</span>
              </>
            )}
          </button>

          <button
            onClick={randomGradient}
            className="min-h-[48px] min-w-[48px] px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all
                     flex items-center justify-center"
            title="Random gradient"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3">Quick Presets</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="h-12 rounded-lg relative overflow-hidden group hover:scale-105 transition-transform"
                style={{
                  background: preset.type === 'linear'
                    ? `linear-gradient(${preset.angle}deg, ${preset.colors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                    : preset.type === 'radial'
                    ? `radial-gradient(circle, ${preset.colors.map(c => `${c.color} ${c.position}%`).join(', ')})`
                    : `conic-gradient(from ${preset.angle}deg, ${preset.colors.map(c => `${c.color} ${c.position}%`).join(', ')})`,
                }}
                title={preset.name}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium bg-black/30 group-hover:bg-black/40 transition-colors">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 Add up to 6 color stops • Adjust positions for smooth transitions • Tailwind uses arbitrary values
        </p>
      </div>
    </div>
  )
}