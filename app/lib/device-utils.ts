// lib/device-utils.ts

/**
 * Device detection utilities - No personal data collection
 * Only uses screen size and touch capability
 */

export const DeviceType = {
  MOBILE: 'mobile',    // < 768px
  TABLET: 'tablet',    // 768px - 1024px
  DESKTOP: 'desktop'   // > 1024px
} as const

export type DeviceType = typeof DeviceType[keyof typeof DeviceType]

/**
 * Get device type based on screen width
 * No user agent or personal data used
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return DeviceType.DESKTOP
  
  const width = window.innerWidth
  
  if (width < 768) return DeviceType.MOBILE
  if (width < 1024) return DeviceType.TABLET
  return DeviceType.DESKTOP
}

/**
 * Check if device has touch capability
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Check if device can use a specific tool
 */
export function isToolMobileCompatible(toolId: string): boolean {
  // Tools that work well on mobile
  const mobileCompatibleTools = [
    'text-case',
    'json-format',
    'token-compressor',
    'ai-summarizer',
    'japanese-ocr',
    'ai-resume',
    'debate-trainer',
    'ai-dev-dictionary',
    'pdf-summarizer',
    'pdf-to-data'
  ]
  
  return mobileCompatibleTools.includes(toolId)
}

/**
 * Get mobile compatibility info for a tool
 */
export function getToolMobileInfo(toolId: string): {
  compatible: boolean
  reason?: string
  alternativeMessage?: string
} {
  const incompatibleTools: Record<string, { reason: string; alternative?: string }> = {
    'code-reader': {
      reason: 'Requires large screen for code viewing',
      alternative: 'Best experienced on desktop with larger display'
    },
    'pdf-tools': {
      reason: 'Advanced editing features need mouse precision',
      alternative: 'Basic PDF viewing is available, but editing works better on desktop'
    },
    'blurtap': {
      reason: 'Image editing requires precise mouse control',
      alternative: 'Please use a desktop for the best editing experience'
    },
    'image-grid-merger': {
      reason: 'Drag and drop works better with a mouse',
      alternative: 'Desktop recommended for easier image arrangement'
    },
    'pc-optimizer': {
      reason: 'This tool is designed for desktop systems',
      alternative: 'Please access from a Windows PC'
    },
    'competitive-analyzer': {
      reason: 'Complex data tables need more screen space',
      alternative: 'Use desktop for full analysis features'
    },
    'code-roaster': {
      reason: 'Code review interface needs larger display',
      alternative: 'Desktop provides better code viewing experience'
    },
    'tech-stack-analyzer': {
      reason: 'Comparison tables require wider screens',
      alternative: 'View on desktop for side-by-side comparisons'
    }
  }
  
  const info = incompatibleTools[toolId]
  
  if (info) {
    return {
      compatible: false,
      reason: info.reason,
      alternativeMessage: info.alternative
    }
  }
  
  return { compatible: true }
}

/**
 * Custom hook for device detection
 */
export function useDeviceDetection() {
  const [deviceType, setDeviceType] = useState<DeviceType>(DeviceType.DESKTOP)
  const [isTouch, setIsTouch] = useState(false)
  
  useEffect(() => {
    // Initial detection
    setDeviceType(getDeviceType())
    setIsTouch(isTouchDevice())
    
    // Update on resize
    const handleResize = () => {
      setDeviceType(getDeviceType())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return {
    deviceType,
    isTouch,
    isMobile: deviceType === DeviceType.MOBILE,
    isTablet: deviceType === DeviceType.TABLET,
    isDesktop: deviceType === DeviceType.DESKTOP
  }
}

// React hooks imports (add at top of file when using)
import { useState, useEffect } from 'react'