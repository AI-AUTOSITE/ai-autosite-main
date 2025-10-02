'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

type GradientType = 'linear' | 'radial'

interface Preset {
  name: string
  colors: string[]
  angle: number
}

const PRESETS: Preset[] = [
  { name: 'Sunset', colors: ['#ff6b6b', '#ffd93d'], angle: 45 },
  { name: 'Ocean', colors: ['#667eea', '#764ba2'], angle: 135 },
  { name: 'Forest', colors: ['#38ef7d', '#11998e'], angle: 90 },
  { name: 'Fire', colors: ['#f12711', '#f5af19'], angle: 45 },
  { name: 'Purple', colors: ['#c471f5', '#fa71cd'], angle: 45 },
  { name: 'Mint', colors: ['#00b09b', '#96c93d'], angle: 90 },
]

export default function GradientGeneratorClient() {
  const [type, setType] = useState<GradientType>('linear')
  const [angle, setAngle] = useState(45)
  const [color1, setColor1] = useState('#667eea')
  const [color2, setColor2] = useState('#764ba2')
  const [copied, setCopied] = useState(false)

  const generateCSS = () => {
    if (type === 'linear') {
      return `background: linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%);`
    } else {
      return `background: radial-gradient(circle, ${color1} 0%, ${color2} 100%);`
    }
  }

  const getGradientStyle = () => {
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`
    } else {
      return `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`
    }
  }

  const copyCSS = async () => {
    await navigator.clipboard.writeText(generateCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applyPreset = (preset: Preset) => {
    setColor1(preset.colors[0])
    setColor2(preset.colors[1])
    setAngle(preset.angle)
    setType('linear')
  }

  const randomGradient = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    setColor1(randomColor())
    setColor2(randomColor())
    setAngle(Math.floor(Math.random() * 360))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
    {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* Live Preview - Large and Prominent */}
        <div 
          className="h-48 rounded-xl mb-6 shadow-xl transition-all duration-300"
          style={{ background: getGradientStyle() }}
        />

        {/* Simple Controls */}
        <div className="space-y-4 mb-6">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setType('linear')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                type === 'linear'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setType('radial')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                type === 'radial'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Radial
            </button>
          </div>

          {/* Colors - Side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white text-sm mb-1 block">Start Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                           hover:bg-white/15 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-white text-sm mb-1 block">End Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                           hover:bg-white/15 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Angle Slider (only for linear) */}
          {type === 'linear' && (
            <div>
              <label className="text-white text-sm mb-1 block">
                Angle: {angle}°
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
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* CSS Output */}
        <div className="bg-black/30 rounded-lg p-3 mb-6">
          <code className="text-purple-400 text-xs font-mono">
            {generateCSS()}
          </code>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={copyCSS}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy CSS
              </>
            )}
          </button>
          
          <button
            onClick={randomGradient}
            className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            title="Random gradient"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3">Quick Presets</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="h-12 rounded-lg relative overflow-hidden group hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`
                }}
                title={preset.name}
              >
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium bg-black/20">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 Click presets for quick start • Adjust angle for direction
      </p>
    </div>
  )
}