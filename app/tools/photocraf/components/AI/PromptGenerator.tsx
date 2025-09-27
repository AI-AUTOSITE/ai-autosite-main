'use client'

import React, { useState } from 'react'
import { useFilter } from '../../contexts/FilterContext'
import { useSlots } from '../../contexts/SlotContext'
import { CustomFilter } from '../../types'
import { generateFilterCode } from '../../lib/ai/filterGenerator'
import { showToast } from '../UI/Toast'

interface Props {
  onClose: () => void
}

export default function AIPromptGenerator({ onClose }: Props) {
  const { addCustomFilter } = useFilter()
  const { addFilterToSlot, canAddMoreFilters, slotState } = useSlots()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [filterName, setFilterName] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Sample prompts for quick access
  const samplePrompts = [
    'Make it look like a vintage film photo',
    'Create a dreamy soft glow effect',
    'Add dramatic shadows and highlights',
    'Make colors more vibrant and tropical',
    'Create a cyberpunk neon effect',
    'Apply a watercolor painting style',
    'Make it look like golden hour lighting',
    'Add film grain and nostalgia',
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt', 'warning')
      return
    }

    // Check if user has Pro plan or higher for AI features
    if (slotState.plan === 'free' || slotState.plan === 'starter') {
      showToast('AI features require Pro plan or higher', 'warning')
      return
    }

    setIsGenerating(true)
    
    try {
      // Generate filter code from prompt
      const result = await generateFilterCode(prompt)
      setGeneratedCode(result.code)
      setFilterName(result.name)
      setShowAdvanced(true)
      showToast('Filter generated successfully!', 'success')
    } catch (error) {
      showToast('Failed to generate filter. Please try again.', 'error')
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (!filterName.trim()) {
      showToast('Please enter a filter name', 'warning')
      return
    }

    if (!canAddMoreFilters()) {
      showToast('No slots available. Please upgrade your plan.', 'warning')
      return
    }

    const newFilter: CustomFilter = {
      id: `ai-${Date.now()}`,
      name: filterName,
      category: 'custom',
      params: [
        {
          name: 'intensity',
          type: 'number',
          default: 100,
          min: 0,
          max: 100,
          step: 1,
        }
      ],
      code: generatedCode,
      author: 'AI Generated',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      apply: (imageData: ImageData, userParams: Record<string, any>) => {
        try {
          const func = new Function('imageData', 'params', generatedCode)
          return func(imageData, userParams)
        } catch (error) {
          console.error('Filter execution error:', error)
          return imageData
        }
      },
    }

    addCustomFilter(newFilter)
    addFilterToSlot(newFilter)
    showToast(`Filter "${filterName}" added to your collection!`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold">AI Filter Generator</h2>
            <p className="text-sm text-gray-400 mt-1">
              Describe the effect you want, and AI will create it
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Prompt Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your filter effect
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Make the image look like it was taken during sunset with warm orange tones..."
                className="w-full px-4 py-3 bg-gray-800 rounded-lg resize-none h-24 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={isGenerating}
              />
            </div>

            {/* Sample Prompts */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(sample)}
                    className="px-3 py-1 bg-gray-800 text-xs rounded-full hover:bg-gray-700 transition-colors"
                    disabled={isGenerating}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                isGenerating
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                '✨ Generate Filter'
              )}
            </button>

            {/* Generated Code Section */}
            {showAdvanced && generatedCode && (
              <div className="space-y-4 mt-6 p-4 bg-gray-800 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Filter Name
                  </label>
                  <input
                    type="text"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Generated Code
                  </label>
                  <div className="relative">
                    <textarea
                      value={generatedCode}
                      onChange={(e) => setGeneratedCode(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 rounded font-mono text-xs h-48"
                      spellCheck={false}
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedCode)}
                      className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-xs rounded hover:bg-gray-500"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded p-3">
                  <p className="text-xs text-yellow-400">
                    ⚠️ Always review generated code before saving. AI may occasionally produce unexpected results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            {slotState.plan === 'free' || slotState.plan === 'starter' ? (
              <span className="text-yellow-400">
                🔒 Upgrade to Pro to use AI features
              </span>
            ) : (
              <span className="text-green-400">
                ✓ AI features enabled
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {generatedCode && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Save to Slot
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}