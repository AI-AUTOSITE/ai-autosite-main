// app/tools/voice-transcription/lib/device-detection.ts

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  hasLowMemory: boolean
  browserSupported: boolean
  supportsMediaRecorder: boolean
  supportsWebAssembly: boolean
}

/**
 * Detect device type and capabilities
 */
export function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    // SSR fallback
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      hasLowMemory: false,
      browserSupported: true,
      supportsMediaRecorder: true,
      supportsWebAssembly: true,
    }
  }

  const ua = navigator.userAgent.toLowerCase()
  
  // Mobile detection
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
  const isTabletUA = /ipad|android(?!.*mobile)/i.test(ua)
  
  // Screen size based detection
  const screenWidth = window.screen.width
  const isMobileScreen = screenWidth < 768
  const isTabletScreen = screenWidth >= 768 && screenWidth < 1024
  
  const isMobile = isMobileUA || (isMobileScreen && !isTabletUA)
  const isTablet = isTabletUA || isTabletScreen
  const isDesktop = !isMobile && !isTablet
  
  // Touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Memory check (if available)
  const deviceMemory = (navigator as any).deviceMemory || 8
  const hasLowMemory = deviceMemory < 4
  
  // Browser support
  const supportsWebAssembly = typeof WebAssembly !== 'undefined'
  const supportsMediaRecorder = typeof MediaRecorder !== 'undefined'
  
  // Check browser type
  const isChrome = /chrome/i.test(ua) && !/edge/i.test(ua)
  const isFirefox = /firefox/i.test(ua)
  const isEdge = /edg/i.test(ua)
  const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua)
  
  // Safari has some WASM limitations
  const browserSupported = isChrome || isFirefox || isEdge || (isSafari && !isMobile)

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    hasLowMemory,
    browserSupported,
    supportsMediaRecorder,
    supportsWebAssembly,
  }
}

/**
 * Get recommended model based on device
 */
export function getRecommendedModel(deviceInfo: DeviceInfo): string {
  if (deviceInfo.isMobile || deviceInfo.hasLowMemory) {
    return 'Xenova/whisper-tiny'
  }
  return 'Xenova/whisper-base'
}

/**
 * Get device-specific warnings
 */
export function getDeviceWarnings(deviceInfo: DeviceInfo): string[] {
  const warnings: string[] = []
  
  if (!deviceInfo.supportsWebAssembly) {
    warnings.push('Your browser does not support WebAssembly. Transcription may not work.')
  }
  
  if (!deviceInfo.browserSupported) {
    warnings.push('For best results, use Chrome, Edge, or Firefox.')
  }
  
  if (deviceInfo.isMobile) {
    warnings.push('Mobile detected: Using smaller model for better performance. Transcription may be slower.')
  }
  
  if (deviceInfo.hasLowMemory) {
    warnings.push('Low memory detected: Large files may cause issues.')
  }
  
  if (!deviceInfo.supportsMediaRecorder) {
    warnings.push('Recording not supported on this browser.')
  }
  
  return warnings
}

/**
 * Get max file size for device
 */
export function getMaxFileSize(deviceInfo: DeviceInfo): number {
  if (deviceInfo.isMobile) return 50 * 1024 * 1024 // 50MB
  if (deviceInfo.isTablet) return 100 * 1024 * 1024 // 100MB
  return 500 * 1024 * 1024 // 500MB
}
