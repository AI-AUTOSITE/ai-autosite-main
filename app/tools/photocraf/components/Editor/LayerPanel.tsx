'use client'

import React from 'react'
import { useEditor } from '../../contexts/EditorContext'

export default function LayerPanel() {
  const { state, updateLayer, removeLayer, setActiveLayer: setActive } = useEditor()

  return (
    <div className="p-4">
      <div className="space-y-2">
        {state.layers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No layers yet
          </p>
        ) : (
          state.layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-3 bg-gray-800 rounded cursor-pointer transition-all ${
                state.activeLayerId === layer.id
                  ? 'ring-2 ring-purple-500'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => setActive(layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateLayer(layer.id, { visible: !layer.visible })
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    {layer.visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <span className="text-sm font-medium">{layer.name}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateLayer(layer.id, { locked: !layer.locked })
                    }}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {layer.locked ? '🔒' : '🔓'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeLayer(layer.id)
                    }}
                    className="text-gray-400 hover:text-red-400 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Opacity:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={layer.opacity}
                  onChange={(e) => {
                    updateLayer(layer.id, { opacity: Number(e.target.value) })
                  }}
                  className="flex-1 h-1"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-xs text-gray-400 w-8">{layer.opacity}%</span>
              </div>
              
              <div className="mt-2">
                <select
                  value={layer.blendMode}
                  onChange={(e) => {
                    updateLayer(layer.id, { blendMode: e.target.value as any })
                  }}
                  className="w-full px-2 py-1 bg-gray-700 text-xs rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="soft-light">Soft Light</option>
                  <option value="hard-light">Hard Light</option>
                  <option value="color-dodge">Color Dodge</option>
                  <option value="color-burn">Color Burn</option>
                  <option value="darken">Darken</option>
                  <option value="lighten">Lighten</option>
                  <option value="difference">Difference</option>
                  <option value="exclusion">Exclusion</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}