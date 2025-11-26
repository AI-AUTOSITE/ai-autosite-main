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
  lightColor: string
}> = [
  { value: 'text', icon: FileText, color: 'text-gray-400', lightColor: 'text-gray-500' },
  { value: 'html', icon: Code, color: 'text-orange-400', lightColor: 'text-orange-500' },
  { value: 'markdown', icon: FileCode, color: 'text-blue-400', lightColor: 'text-blue-500' },
  { value: 'json', icon: Braces, color: 'text-green-400', lightColor: 'text-green-500' },
]

export function FormatSelector({ selected, onChange, onVibrate }: FormatSelectorProps) {
  return (
    <div>
      <label className="block text-gray-900 dark:text-white font-medium mb-2">Output Format</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FORMATS.map(({ value, icon: Icon, color, lightColor }) => (
          <button
            key={value}
            onClick={() => {
              onChange(value)
              onVibrate?.()
            }}
            className={`min-h-[44px] px-3 py-2 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
              selected === value
                ? 'bg-purple-600 dark:bg-gray-600 text-white border-2 border-purple-400 dark:border-gray-400'
                : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <Icon className={`w-5 h-5 ${selected === value ? 'text-white' : `${lightColor} dark:${color}`}`} />
            <span className="text-xs font-medium">{getFormatDisplayName(value)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}