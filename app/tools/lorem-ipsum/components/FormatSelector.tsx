'use client'

import { FileText, Code, FileCode, Braces } from 'lucide-react'
import { type OutputFormat, getFormatDisplayName } from '../lib/formatters'

interface FormatSelectorProps {
  selected: OutputFormat
  onChange: (format: OutputFormat) => void
  onVibrate?: () => void
}

const FORMATS: Array<{
  value: OutputFormat
  icon: typeof FileText
  color: string
}> = [
  { value: 'text', icon: FileText, color: 'text-gray-400' },
  { value: 'html', icon: Code, color: 'text-orange-400' },
  { value: 'markdown', icon: FileCode, color: 'text-blue-400' },
  { value: 'json', icon: Braces, color: 'text-green-400' },
]

export function FormatSelector({ selected, onChange, onVibrate }: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-white font-medium mb-2">Output Format</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FORMATS.map(({ value, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => {
              onChange(value)
              onVibrate?.()
            }}
            className={`min-h-[44px] px-3 py-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
              selected === value
                ? 'bg-gray-600 text-white border-2 border-gray-400'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <Icon className={`w-5 h-5 ${selected === value ? 'text-white' : color}`} />
            <span className="text-xs font-medium">{getFormatDisplayName(value)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}