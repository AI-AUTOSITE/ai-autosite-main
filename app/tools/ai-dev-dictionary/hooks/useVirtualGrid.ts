// app/tools/ai-dev-dictionary/hooks/useVirtualGrid.ts
import { useState, useEffect, useRef, useCallback } from 'react'

interface VirtualGridOptions {
  itemHeight: number
  itemsPerRow: number
  gap: number
}

export function useVirtualGrid<T>(items: T[], options: VirtualGridOptions) {
  const { itemHeight, itemsPerRow, gap } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollTop = container.scrollTop
    const containerHeight = container.clientHeight

    const rowHeight = itemHeight + gap
    const startRow = Math.floor(scrollTop / rowHeight)
    const endRow = Math.ceil((scrollTop + containerHeight) / rowHeight)

    const start = startRow * itemsPerRow
    const end = Math.min(endRow * itemsPerRow, items.length)

    setVisibleRange({ start, end })
  }, [itemHeight, itemsPerRow, gap, items.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    handleScroll() // 初期計算

    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const totalRows = Math.ceil(items.length / itemsPerRow)
  const totalHeight = totalRows * (itemHeight + gap)
  const offsetY = Math.floor(visibleRange.start / itemsPerRow) * (itemHeight + gap)

  return {
    containerRef,
    visibleItems: items.slice(visibleRange.start, visibleRange.end),
    totalHeight,
    offsetY,
  }
}
