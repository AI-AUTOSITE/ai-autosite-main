'use client'

import { Smartphone, Check } from 'lucide-react'
import { formatFileSize } from '../constants'

interface MobileWarningModalProps {
  maxFileSize: number
  onDismiss: () => void
}

export function MobileWarningModal({ maxFileSize, onDismiss }: MobileWarningModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-8 h-8 text-violet-400" />
          <h3 className="text-lg font-bold text-white">Mobile Device Detected</h3>
        </div>
        <div className="text-gray-300 text-sm space-y-2">
          <p>This tool works on mobile, but please note:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>AI model is ~176MB (use WiFi)</li>
            <li>Processing may be slower</li>
            <li>Max image size: {formatFileSize(maxFileSize)}</li>
          </ul>
        </div>
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Got it, continue
        </button>
      </div>
    </div>
  )
}
