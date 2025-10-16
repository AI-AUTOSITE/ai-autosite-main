'use client'

import { CheckCircle } from 'lucide-react'

export default function PrivacyNotice() {
  return (
    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/20">
      <div className="flex items-start gap-2 sm:gap-3">
        <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-green-400 font-semibold">100% Private</p>
          <p className="text-xs text-gray-400 mt-1">
            Files processed locally • No storage • Instant deletion
          </p>
        </div>
      </div>
    </div>
  )
}