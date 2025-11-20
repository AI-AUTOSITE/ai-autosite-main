// app/components/automation/AutomationHeader.tsx

import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

export default function AutomationHeader() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
      <div className="container mx-auto px-4">
        <div className="py-4 flex items-center justify-between">
          {/* Back to main site */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AI AutoSite
          </Link>
          
          {/* Automation section badge */}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">
              Automation Consulting
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full">
              BETA
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}