'use client'

import React from 'react'
import { useEditor } from '../../contexts/EditorContext'
import { Tool } from '../../types'

const tools: { id: Tool; icon: string; label: string; shortcut?: string }[] = [
  { id: 'select', icon: '⬚', label: 'Select', shortcut: 'V' },
  { id: 'move', icon: '✥', label: 'Move', shortcut: 'M' },
  { id: 'crop', icon: '⬛', label: 'Crop', shortcut: 'C' },
  { id: 'brush', icon: '✏', label: 'Brush', shortcut: 'B' },
  { id: 'eraser', icon: '⬜', label: 'Eraser', shortcut: 'E' },
  { id: 'text', icon: 'T', label: 'Text', shortcut: 'T' },
  { id: 'shape', icon: '○', label: 'Shape', shortcut: 'U' },
  { id: 'eyedropper', icon: '💧', label: 'Eyedropper', shortcut: 'I' },
  { id: 'zoom', icon: '🔍', label: 'Zoom', shortcut: 'Z' },
  { id: 'hand', icon: '✋', label: 'Hand', shortcut: 'H' },
]

export default function Toolbar() {
  const { state, setActiveTool, undo, redo, setCanvas } = useEditor()

  const handleZoomIn = () => {
    const newZoom = Math.min(state.canvas.zoom * 1.2, 5)
    setCanvas({ zoom: newZoom })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(state.canvas.zoom / 1.2, 0.1)
    setCanvas({ zoom: newZoom })
  }

  const handleZoomReset = () => {
    setCanvas({ zoom: 1, panX: 0, panY: 0 })
  }

  const handleRotateLeft = () => {
    setCanvas({ rotation: state.canvas.rotation - 90 })
  }

  const handleRotateRight = () => {
    setCanvas({ rotation: state.canvas.rotation + 90 })
  }

  const handleFlipX = () => {
    setCanvas({ flipX: !state.canvas.flipX })
  }

  const handleFlipY = () => {
    setCanvas({ flipY: !state.canvas.flipY })
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
      {/* Tools */}
      <div className="flex items-center space-x-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group relative px-3 py-2 rounded transition-all ${
              state.activeTool === tool.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <span className="text-lg">{tool.icon}</span>
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {tool.label} ({tool.shortcut})
            </span>
          </button>
        ))}

        <div className="w-px h-8 bg-gray-700 mx-2" />

        {/* History controls */}
        <button
          onClick={undo}
          disabled={state.historyIndex <= 0}
          className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          onClick={redo}
          disabled={state.historyIndex >= state.history.length - 1}
          className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Redo (Ctrl+Y)"
        >
          ↷
        </button>

        <div className="w-px h-8 bg-gray-700 mx-2" />

        {/* Transform controls */}
        <button
          onClick={handleRotateLeft}
          className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-all"
          title="Rotate Left"
        >
          ↺
        </button>
        <button
          onClick={handleRotateRight}
          className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-all"
          title="Rotate Right"
        >
          ↻
        </button>
        <button
          onClick={handleFlipX}
          className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-all"
          title="Flip Horizontal"
        >
          ⇄
        </button>
        <button
          onClick={handleFlipY}
          className="px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-all"
          title="Flip Vertical"
        >
          ⇅
        </button>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZoomOut}
          className="px-2 py-1 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-all"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={handleZoomReset}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-all min-w-[80px]"
        >
          {Math.round(state.canvas.zoom * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="px-2 py-1 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-all"
          title="Zoom In"
        >
          +
        </button>

        <div className="w-px h-8 bg-gray-700 mx-2" />

        {/* Quick actions */}
        <button
          onClick={() => document.getElementById('batch-processor-btn')?.click()}
          className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-all"
        >
          Batch Process
        </button>
        <button className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-all">
          New Layer
        </button>
        <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-all">
          Export
        </button>
      </div>
    </div>
  )
}