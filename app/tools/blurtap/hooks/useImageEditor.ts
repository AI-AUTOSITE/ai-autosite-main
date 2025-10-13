// hooks/useImageEditor.ts

import { useState, useCallback } from 'react'
import { MaskRegion, EditorSettings, MaskMode, MaskSize, ImageFormat } from '../types'
import { MAX_HISTORY_LENGTH, DEFAULT_SETTINGS } from '../constants'

interface UseImageEditorReturn {
  masks: MaskRegion[]
  history: string[]
  settings: EditorSettings
  setMode: (mode: MaskMode) => void
  setMaskSize: (size: MaskSize) => void
  setFormat: (format: ImageFormat) => void
  addMask: (mask: MaskRegion) => void
  undoMask: () => void
  resetMasks: () => void
}

export const useImageEditor = (): UseImageEditorReturn => {
  const [masks, setMasks] = useState<MaskRegion[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS)

  const saveHistory = useCallback(() => {
    const newHistory = [...history, JSON.stringify(masks)]
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory.shift()
    }
    setHistory(newHistory)
  }, [history, masks])

  const addMask = useCallback(
    (mask: MaskRegion) => {
      saveHistory()
      setMasks((prev) => [...prev, mask])
    },
    [saveHistory]
  )

  const undoMask = useCallback(() => {
    if (history.length === 0) return

    const lastState = history[history.length - 1]
    const restoredMasks = JSON.parse(lastState)
    setMasks(restoredMasks)
    setHistory((prev) => prev.slice(0, -1))
  }, [history])

  const resetMasks = useCallback(() => {
    setMasks([])
    setHistory([])
  }, [])

  const setMode = useCallback((mode: MaskMode) => {
    setSettings((prev) => ({ ...prev, mode }))
  }, [])

  const setMaskSize = useCallback((maskSize: MaskSize) => {
    setSettings((prev) => ({ ...prev, maskSize }))
  }, [])

  const setFormat = useCallback((format: ImageFormat) => {
    setSettings((prev) => ({ ...prev, format }))
  }, [])

  return {
    masks,
    history,
    settings,
    setMode,
    setMaskSize,
    setFormat,
    addMask,
    undoMask,
    resetMasks,
  }
}