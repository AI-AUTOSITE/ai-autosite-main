'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { EditorState, Layer, Tool, HistoryState, CanvasState } from '../types'

type EditorAction =
  | { type: 'SET_CANVAS'; payload: Partial<CanvasState> }
  | { type: 'ADD_LAYER'; payload: Layer }
  | { type: 'REMOVE_LAYER'; payload: string }
  | { type: 'UPDATE_LAYER'; payload: { id: string; updates: Partial<Layer> } }
  | { type: 'SET_ACTIVE_LAYER'; payload: string | null }
  | { type: 'SET_ACTIVE_TOOL'; payload: Tool }
  | { type: 'SET_TOOL_SETTING'; payload: { tool: string; setting: string; value: any } }
  | { type: 'ADD_HISTORY'; payload: HistoryState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' }

const initialState: EditorState = {
  canvas: {
    width: 1920,
    height: 1080,
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    flipX: false,
    flipY: false,
  },
  layers: [],
  activeLayerId: null,
  activeTool: 'select',
  toolSettings: {
    brush: {
      size: 10,
      hardness: 100,
      opacity: 100,
      flow: 100,
      color: '#000000',
    },
    eraser: {
      size: 10,
      hardness: 100,
      opacity: 100,
    },
    text: {
      font: 'Arial',
      size: 24,
      color: '#000000',
      bold: false,
      italic: false,
      align: 'left',
    },
    shape: {
      type: 'rectangle',
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 1,
    },
  },
  history: [],
  historyIndex: -1,
  isProcessing: false,
  error: null,
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_CANVAS':
      return {
        ...state,
        canvas: { ...state.canvas, ...action.payload },
      }

    case 'ADD_LAYER':
      return {
        ...state,
        layers: [...state.layers, action.payload],
        activeLayerId: action.payload.id,
      }

    case 'REMOVE_LAYER':
      return {
        ...state,
        layers: state.layers.filter(layer => layer.id !== action.payload),
        activeLayerId:
          state.activeLayerId === action.payload
            ? state.layers[0]?.id || null
            : state.activeLayerId,
      }

    case 'UPDATE_LAYER':
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.payload.id
            ? { ...layer, ...action.payload.updates }
            : layer
        ),
      }

    case 'SET_ACTIVE_LAYER':
      return { ...state, activeLayerId: action.payload }

    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload }

    case 'SET_TOOL_SETTING':
      return {
        ...state,
        toolSettings: {
          ...state.toolSettings,
          [action.payload.tool]: {
            ...state.toolSettings[action.payload.tool as keyof typeof state.toolSettings],
            [action.payload.setting]: action.payload.value,
          },
        },
      }

    case 'ADD_HISTORY':
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(action.payload)
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }

    case 'UNDO':
      if (state.historyIndex > 0) {
        const prevState = state.history[state.historyIndex - 1]
        return {
          ...state,
          layers: prevState.layerStates,
          historyIndex: state.historyIndex - 1,
        }
      }
      return state

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1]
        return {
          ...state,
          layers: nextState.layerStates,
          historyIndex: state.historyIndex + 1,
        }
      }
      return state

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

interface EditorContextType {
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
  // Convenience methods
  addLayer: (layer: Layer) => void
  removeLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  setActiveTool: (tool: Tool) => void
  undo: () => void
  redo: () => void
  setCanvas: (canvas: Partial<CanvasState>) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  const addLayer = useCallback((layer: Layer) => {
    dispatch({ type: 'ADD_LAYER', payload: layer })
  }, [])

  const removeLayer = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_LAYER', payload: id })
  }, [])

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    dispatch({ type: 'UPDATE_LAYER', payload: { id, updates } })
  }, [])

  const setActiveTool = useCallback((tool: Tool) => {
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const setCanvas = useCallback((canvas: Partial<CanvasState>) => {
    dispatch({ type: 'SET_CANVAS', payload: canvas })
  }, [])

  const value = {
    state,
    dispatch,
    addLayer,
    removeLayer,
    updateLayer,
    setActiveTool,
    undo,
    redo,
    setCanvas,
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}