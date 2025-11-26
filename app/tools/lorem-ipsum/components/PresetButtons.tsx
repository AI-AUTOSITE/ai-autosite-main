'use client'

import { Zap } from 'lucide-react'

export type GenerationType = 'words' | 'sentences' | 'paragraphs'

interface Preset {
  label: string
  type: GenerationType
  amount: number
}

interface PresetButtonsProps {
  onSelect: (type: GenerationType, amount: number) => void
  currentType: GenerationType
  currentAmount: number
  onVibrate?: () => void
}

const PRESETS: Preset[] = [
  { label: '1 Paragraph', type: 'paragraphs', amount: 1 },
  { label: '3 Paragraphs', type: 'paragraphs', amount: 3 },
  { label: '5 Paragraphs', type: 'paragraphs', amount: 5 },
  { label: '10 Sentences', type: 'sentences', amount: 10 },
  { label: '50 Words', type: 'words', amount: 50 },
  { label: '100 Words', type: 'words', amount: 100 },
]

export function PresetButtons({
  onSelect,
  currentType,
  currentAmount,
  onVibrate,
}: PresetButtonsProps) {
  const isActive = (preset: Preset) => {
    return preset.type === currentType && preset.amount === currentAmount
  }

  return (
    <div>
      <label className="block text-gray-900 dark:text-white font-medium mb-2 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
        Quick Presets
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={`${preset.type}-${preset.amount}`}
            onClick={() => {
              onSelect(preset.type, preset.amount)
              onVibrate?.()
            }}
            className={`min-h-[44px] px-3 py-2 rounded-lg transition-all text-sm font-medium ${
              isActive(preset)
                ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-400 dark:border-yellow-500/50'
                : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Click a preset to instantly generate that amount
      </p>
    </div>
  )
}