'use client'

import { CheckCircle } from 'lucide-react'

export default function PrivacyNotice() {
  return (
    <div className="mt-8 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
        <div>
          <p className="text-sm text-green-400 font-semibold">100% Secure & Private</p>
          <p className="text-xs text-gray-400 mt-1">
            Your files are processed in real-time and never stored. All data is deleted immediately
            after processing.
          </p>
        </div>
      </div>
    </div>
  )
}
