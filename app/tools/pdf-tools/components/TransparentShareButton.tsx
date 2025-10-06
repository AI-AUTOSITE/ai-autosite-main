// pdf-tools/components/TransparentShareButton.tsx

import React, { useState } from 'react'
import { ShareDestination } from '../types/privacy'

interface TransparentShareButtonProps {
  destination: ShareDestination
  onClick: () => void
  disabled?: boolean
}

export const TransparentShareButton: React.FC<TransparentShareButtonProps> = ({
  destination,
  onClick,
  disabled = false,
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const [showUrlTooltip, setShowUrlTooltip] = useState(false)

  // Show URL tooltip with delay for better UX
  const handleMouseEnter = () => {
    setIsHovering(true)
    setTimeout(() => {
      setShowUrlTooltip(true)
    }, 500) // 500ms delay before showing URL
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowUrlTooltip(false)
  }

  const getPrivacyColor = (score: number) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 5) return 'text-yellow-500'
    return 'text-orange-500'
  }

  const getPrivacyBadge = (score: number) => {
    if (score >= 8) return '🟢 Highly Private'
    if (score >= 5) return '🟡 Moderate Privacy'
    return '🟠 External Service'
  }

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-200
          ${
            disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-md'
          }
        `}
      >
        <span className="text-xl">{destination.icon}</span>
        <span className="font-medium">{destination.name}</span>
        {isHovering && (
          <span className={`text-xs ${getPrivacyColor(destination.privacyScore)}`}>●</span>
        )}
      </button>

      {/* URL Tooltip with privacy information */}
      {showUrlTooltip && isHovering && (
        <div className="absolute bottom-full left-0 mb-2 z-50 min-w-[300px] animate-fadeIn">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 text-sm">
            {/* Arrow pointer */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gray-900 transform rotate-45"></div>

            {/* URL Display */}
            <div className="mb-2">
              <span className="text-gray-400">Destination:</span>
              <div className="font-mono text-xs bg-black bg-opacity-30 rounded px-2 py-1 mt-1">
                {destination.url}
              </div>
            </div>

            {/* Privacy Score */}
            <div className="mb-2">
              <span className="text-gray-400">Privacy Level:</span>
              <div className={`font-medium ${getPrivacyColor(destination.privacyScore)}`}>
                {getPrivacyBadge(destination.privacyScore)}
              </div>
            </div>

            {/* Data Flow */}
            <div className="mb-2">
              <span className="text-gray-400">Data Flow:</span>
              <div className="text-xs mt-1">
                {destination.url.startsWith('local://') ? (
                  <span className="text-green-400">✓ Stays on your device</span>
                ) : (
                  <span className="text-yellow-400">
                    ⚠ Leaves your device → {destination.name}
                  </span>
                )}
              </div>
            </div>

            {/* Server involvement */}
            <div>
              <span className="text-gray-400">Our server involved:</span>
              <div className="text-green-400 font-medium">✗ No - Direct connection only</div>
            </div>

            {/* Warning if exists */}
            {destination.warning && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-yellow-400 text-xs">⚠ {destination.warning}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
