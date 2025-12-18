// app/tools/voice-transcription/components/ModelSettings.tsx
'use client'

import React, { useState } from 'react'
import { Settings, ChevronDown, Languages, Zap } from 'lucide-react'
import { SUPPORTED_LANGUAGES, AVAILABLE_MODELS } from '../lib/types'

interface ModelSettingsProps {
  language: string
  modelId: string
  onLanguageChange: (language: string) => void
  onModelChange: (modelId: string) => void
  disabled?: boolean
  isMobile?: boolean
}

export default function ModelSettings({
  language,
  modelId,
  onLanguageChange,
  onModelChange,
  disabled = false,
  isMobile = false,
}: ModelSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedModel = AVAILABLE_MODELS.find(m => m.id === modelId)
  const selectedLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language)

  // Filter models for mobile
  const availableModels = isMobile 
    ? AVAILABLE_MODELS.filter(m => m.id.includes('tiny') || m.id.includes('base'))
    : AVAILABLE_MODELS

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm">Settings</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="p-4 bg-gray-800/50 rounded-xl space-y-4 border border-gray-700">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <Languages className="w-4 h-4" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              disabled={disabled}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                       text-white text-sm focus:border-cyan-500 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Auto-detect works best for most cases
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <Zap className="w-4 h-4" />
              Model
            </label>
            <select
              value={modelId}
              onChange={(e) => onModelChange(e.target.value)}
              disabled={disabled}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                       text-white text-sm focus:border-cyan-500 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.size})
                </option>
              ))}
            </select>
            {selectedModel && (
              <p className="text-xs text-gray-500">
                {selectedModel.description}
              </p>
            )}
            {isMobile && (
              <p className="text-xs text-yellow-500">
                Larger models are hidden on mobile for better performance.
              </p>
            )}
          </div>

          {/* Current Settings Display */}
          <div className="pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Current: {selectedModel?.name} • {selectedLanguage?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
