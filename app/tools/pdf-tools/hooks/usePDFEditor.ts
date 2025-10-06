// app/tools/pdf-tools/hooks/usePDFEditor.ts
import { useState, useCallback, useRef } from 'react'
import { PageData } from '../types'

interface HistoryState {
  pages: PageData[]
  timestamp: number
}

export function usePDFEditor(initialPages: PageData[] = []) {
  const [history, setHistory] = useState<HistoryState[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [pages, setPages] = useState<PageData[]>(initialPages)

  // Use ref to avoid dependency issues
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

  // Add state to history - no dependencies needed with ref
  const addToHistory = useCallback((newPages: PageData[]) => {
    const newState: HistoryState = {
      pages: [...newPages],
      timestamp: Date.now(),
    }

    setHistory((prev) => {
      // Use ref value instead of state
      const newHistory = prev.slice(0, currentIndexRef.current + 1)
      return [...newHistory, newState]
    })
    setCurrentIndex((prev) => prev + 1)
  }, []) // Empty dependency array - stable function

  // Update pages with history
  const updatePages = useCallback(
    (newPages: PageData[]) => {
      setPages(newPages)
      addToHistory(newPages)
    },
    [addToHistory]
  ) // Now addToHistory is stable

  // Undo function
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const previousState = history[currentIndex - 1]
      setPages(previousState.pages)
      setCurrentIndex(currentIndex - 1)
      return true
    }
    return false
  }, [history, currentIndex])

  // Redo function
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1]
      setPages(nextState.pages)
      setCurrentIndex(currentIndex + 1)
      return true
    }
    return false
  }, [history, currentIndex])

  // Check if undo/redo is available
  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])

  return {
    pages,
    setPages,
    updatePages,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historyLength: history.length,
  }
}
