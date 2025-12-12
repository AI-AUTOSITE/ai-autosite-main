// Background color presets
export const BG_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Purple', value: '#A855F7' },
]

// Output size presets
export const SIZE_PRESETS = [
  { name: 'Original', value: 'original' },
  { name: '1920×1080', value: '1920x1080' },
  { name: '1280×720', value: '1280x720' },
  { name: '1080×1080', value: '1080x1080' },
  { name: '800×600', value: '800x600' },
  { name: 'Custom', value: 'custom' },
]

// Custom cursor SVGs (desktop only)
export const createEraserCursor = (size: number): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="none" stroke="white" stroke-width="2"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="none" stroke="black" stroke-width="1"/>
  </svg>`
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, crosshair`
}

export const createRestoreCursor = (size: number): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="rgba(139,92,246,0.3)" stroke="white" stroke-width="2"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="none" stroke="#8B5CF6" stroke-width="1"/>
  </svg>`
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${size/2} ${size/2}, crosshair`
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export const getLoadingMessage = (p: number): string => {
  if (p < 15) return "Initializing..."
  if (p < 50) return "Loading AI model..."
  if (p < 70) return "Preparing processor..."
  if (p < 80) return "Analyzing image..."
  if (p < 90) return "Working some magic... ✨"
  if (p < 95) return "Applying mask..."
  return "Almost done!"
}
