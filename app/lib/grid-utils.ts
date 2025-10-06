// Dynamic grid utilities for responsive category display

/**
 * Get responsive grid class based on item count
 */
export function getGridClassName(itemCount: number): string {
  if (itemCount <= 2) return 'grid-cols-1 sm:grid-cols-2'
  if (itemCount === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  if (itemCount === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  if (itemCount === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  if (itemCount === 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  if (itemCount === 7) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  if (itemCount === 8) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}

/**
 * Get card padding class based on item count
 */
export function getCardPaddingClass(itemCount: number): string {
  if (itemCount <= 3) return 'p-8'
  if (itemCount <= 6) return 'p-6'
  return 'p-5'
}

/**
 * Get icon size class based on item count
 */
export function getIconSizeClass(itemCount: number): string {
  if (itemCount <= 3) return 'w-12 h-12'
  if (itemCount <= 6) return 'w-10 h-10'
  return 'w-8 h-8'
}

/**
 * Get optimal columns for different breakpoints
 */
export function getOptimalColumns(itemCount: number) {
  return {
    mobile: 1,
    tablet: Math.min(2, itemCount),
    desktop: Math.min(3, itemCount),
    wide: Math.min(4, itemCount),
  }
}

/**
 * Calculate if horizontal scroll is needed on mobile
 */
export function needsMobileScroll(itemCount: number): boolean {
  return itemCount > 3
}

/**
 * Get container max width based on item count
 */
export function getContainerMaxWidth(itemCount: number): string {
  if (itemCount <= 2) return 'max-w-2xl'
  if (itemCount <= 4) return 'max-w-4xl'
  if (itemCount <= 6) return 'max-w-5xl'
  return 'max-w-6xl'
}
