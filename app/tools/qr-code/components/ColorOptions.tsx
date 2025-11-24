// ============================================
// Color Options Component (Accordion)
// ============================================

'use client'

import { useState } from 'react'
import { Palette, ChevronDown, Check, AlertCircle } from 'lucide-react'
import { PRESET_COLORS } from '../lib/constants'
import { getContrastRatio } from '../lib/utils'

interface ColorOptionsProps {
  colorTab: 'preset' | 'custom'
  selectedPreset: number
  customForeground: string
  customBackground: string
  onColorTabChange: (tab: 'preset' | 'custom') => void
  onPresetChange: (index: number) => void
  onForegroundChange: (color: string) => void
  onBackgroundChange: (color: string) => void
}

export function ColorOptions({
  colorTab,
  selectedPreset,
  customForeground,
  customBackground,
  onColorTabChange,
  onPresetChange,
  onForegroundChange,
  onBackgroundChange,
}: ColorOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get current colors
  const currentColors = colorTab === 'preset'
    ? PRESET_COLORS[selectedPreset]
    : { foreground: customForeground, background: customBackground }

  // Check contrast
  const contrastRatio = getContrastRatio(currentColors.foreground, currentColors.background)
  const isContrastOk = contrastRatio >= 4.5

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header (Clickable) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium text-sm">Colors</span>
          {/* Color preview */}
          <div className="flex items-center gap-1 ml-2">
            <div
              className="w-4 h-4 rounded border border-white/20"
              style={{ backgroundColor: currentColors.foreground }}
            />
            <div
              className="w-4 h-4 rounded border border-white/20"
              style={{ backgroundColor: currentColors.background }}
            />
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Content (Collapsible) */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* Color Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => onColorTabChange('preset')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                colorTab === 'preset'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => onColorTabChange('custom')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                colorTab === 'custom'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Preset Colors */}
          {colorTab === 'preset' && (
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((preset, index) => (
                <button
                  key={preset.name}
                  onClick={() => onPresetChange(index)}
                  className={`relative p-2 rounded-lg transition-all ${
                    selectedPreset === index
                      ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900'
                      : 'hover:bg-white/5'
                  }`}
                  title={preset.name}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-lg border border-white/20 overflow-hidden flex items-center justify-center"
                      style={{ background: preset.background }}
                    >
                      <div
                        className="w-4 h-4 rounded-sm"
                        style={{ background: preset.foreground }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400">{preset.name}</span>
                  </div>
                  {selectedPreset === index && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Custom Colors */}
          {colorTab === 'custom' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Foreground</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={customForeground}
                    onChange={(e) => onForegroundChange(e.target.value)}
                    className="w-10 h-9 rounded-lg cursor-pointer border border-white/10"
                  />
                  <input
                    type="text"
                    value={customForeground}
                    onChange={(e) => onForegroundChange(e.target.value)}
                    className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white 
                             font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={customBackground}
                    onChange={(e) => onBackgroundChange(e.target.value)}
                    className="w-10 h-9 rounded-lg cursor-pointer border border-white/10"
                  />
                  <input
                    type="text"
                    value={customBackground}
                    onChange={(e) => onBackgroundChange(e.target.value)}
                    className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white 
                             font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contrast Warning */}
          {!isContrastOk && (
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-400 text-xs">
                Low contrast ({contrastRatio.toFixed(1)}:1). May be hard to scan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
