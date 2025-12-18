// app/tools/voice-transcription/components/DeviceWarning.tsx
'use client'

import React from 'react'
import { AlertTriangle, Smartphone, X } from 'lucide-react'
import type { DeviceInfo } from '../lib/device-detection'
import { getDeviceWarnings } from '../lib/device-detection'

interface DeviceWarningProps {
  deviceInfo: DeviceInfo
  onDismiss?: () => void
  dismissible?: boolean
}

export default function DeviceWarning({
  deviceInfo,
  onDismiss,
  dismissible = true,
}: DeviceWarningProps) {
  const warnings = getDeviceWarnings(deviceInfo)

  if (warnings.length === 0) return null

  return (
    <div className="relative p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-yellow-500/20 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-yellow-500" />
        </button>
      )}
      
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {deviceInfo.isMobile ? (
            <Smartphone className="w-5 h-5 text-yellow-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-yellow-400 font-medium text-sm">
            {deviceInfo.isMobile ? 'Mobile Device Detected' : 'Performance Notice'}
          </p>
          <ul className="text-yellow-400/80 text-sm space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
          {deviceInfo.isMobile && (
            <p className="text-yellow-400/60 text-xs mt-2">
              For best results, use a desktop computer with Chrome, Edge, or Firefox.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
