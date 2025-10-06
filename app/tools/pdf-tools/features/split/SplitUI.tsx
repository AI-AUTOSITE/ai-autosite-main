import { useState } from 'react'
import { Scissors } from 'lucide-react'

interface SplitUIProps {
  totalPages: number
  selectedPages: Set<string>
  onSplit: (mode: 'extract' | 'range' | 'single') => void
}

export function SplitUI({ totalPages, selectedPages, onSplit }: SplitUIProps) {
  const [range, setRange] = useState('')

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center mb-4">
        <Scissors className="w-5 h-5 text-orange-400 mr-2" />
        <h3 className="font-semibold">Split PDF</h3>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onSplit('extract')}
          disabled={selectedPages.size === 0}
          className="w-full p-3 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 transition text-left"
        >
          <div className="font-medium">Extract Selected</div>
          <div className="text-sm text-gray-400">
            {selectedPages.size > 0
              ? `Extract ${selectedPages.size} selected pages`
              : 'Select pages first'}
          </div>
        </button>

        <button
          onClick={() => onSplit('single')}
          className="w-full p-3 bg-gray-700 rounded hover:bg-gray-600 transition text-left"
        >
          <div className="font-medium">Split All Pages</div>
          <div className="text-sm text-gray-400">Create {totalPages} individual PDFs</div>
        </button>

        <div>
          <input
            type="text"
            placeholder="e.g., 1-3, 5, 7-10"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white placeholder-gray-400"
          />
          <button
            onClick={() => onSplit('range')}
            className="mt-2 w-full py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          >
            Extract Range
          </button>
        </div>
      </div>
    </div>
  )
}
