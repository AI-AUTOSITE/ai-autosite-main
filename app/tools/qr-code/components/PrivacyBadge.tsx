// ============================================
// Privacy Badge Component
// ============================================

import { Shield, Infinity } from 'lucide-react'

export function PrivacyBadge() {
  return (
    <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-emerald-300 font-semibold text-sm sm:text-base flex items-center gap-2 flex-wrap">
            100% Private - No Server, No Tracking
            <span className="text-[10px] sm:text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </h3>
          <p className="text-emerald-400/70 text-xs sm:text-sm mt-1">
            Everything runs in your browser. Your data never leaves your device.
            <span className="hidden sm:inline">
              {' '}Press F12 → Network tab to verify zero requests.
            </span>
          </p>
          
          {/* No Expiration Notice */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-emerald-500/20">
            <Infinity className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <p className="text-cyan-400 text-xs sm:text-sm font-medium">
              No expiration - Your QR codes work forever
              <span className="hidden sm:inline text-cyan-400/70 font-normal">
                {' '}(Unlike QRMonkey&apos;s 14-day limit)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
