// hooks/useImageEditor.ts

import { useState, useCallback, useEffect } from 'react'
import { MaskRegion, EditorSettings, MaskMode, MaskSize, ImageFormat } from '../types'
import { MAX_HISTORY_LENGTH, DEFAULT_SETTINGS, MESSAGE_DURATION } from '../constants'

interface UseImageEditorReturn {
  masks: MaskRegion[]
  history: string[]
  settings: EditorSettings
  successMessage: string
  setMode: (mode: MaskMode) => void
  setMaskSize: (size: MaskSize) => void
  setFormat: (format: ImageFormat) => void
  addMask: (mask: MaskRegion) => void
  undoMask: () => void
  resetMasks: () => void
  setSuccessMessage: (message: string) => void
}

export const useImageEditor = (): UseImageEditorReturn => {
  const [masks, setMasks] = useState<MaskRegion[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState('')
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS)

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('')
      }, MESSAGE_DURATION.success)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const saveHistory = useCallback(() => {
    const newHistory = [...history, JSON.stringify(masks)]
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory.shift()
    }
    setHistory(newHistory)
  }, [history, masks])

  const addMask = useCallback((mask: MaskRegion) => {
    saveHistory()
    setMasks(prev => [...prev, mask])
    setSuccessMessage('Mask added!')
  }, [saveHistory])

  const undoMask = useCallback(() => {
    if (history.length === 0) return

    const lastState = history[history.length - 1]
    const restoredMasks = JSON.parse(lastState)
    setMasks(restoredMasks)
    setHistory(prev => prev.slice(0, -1))
    setSuccessMessage('Undone!')
  }, [history])

  const resetMasks = useCallback(() => {
    setMasks([])
    setHistory([])
    setSuccessMessage('All masks cleared!')
  }, [])

  const setMode = useCallback((mode: MaskMode) => {
    setSettings(prev => ({ ...prev, mode }))
  }, [])

  const setMaskSize = useCallback((maskSize: MaskSize) => {
    setSettings(prev => ({ ...prev, maskSize }))
  }, [])

  const setFormat = useCallback((format: ImageFormat) => {
    setSettings(prev => ({ ...prev, format }))
  }, [])

  return {
    masks,
    history,
    settings,
    successMessage,
    setMode,
    setMaskSize,
    setFormat,
    addMask,
    undoMask,
    resetMasks,
    setSuccessMessage
  }
}