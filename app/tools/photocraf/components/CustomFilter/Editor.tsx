'use client'

import React, { useState } from 'react'
import { useFilter } from '../../contexts/FilterContext'
import { useSlots } from '../../contexts/SlotContext'
import { CustomFilter } from '../../types'

interface Props {
  onClose: () => void
}

export default function CustomFilterEditor({ onClose }: Props) {
  const { addCustomFilter } = useFilter()
  const { addFilterToSlot, canAddMoreFilters } = useSlots()
  const [filterName, setFilterName] = useState('')
  const [filterCode, setFilterCode] = useState(`// Custom filter code
// Access pixel data via: data[i] (R), data[i+1] (G), data[i+2] (B), data[i+3] (A)
// Use params object for user inputs

const data = imageData.data;
const width = imageData.width;
const height = imageData.height;

for (let i = 0; i < data.length; i += 4) {
  // Example: Increase red channel
  data[i] = Math.min(255, data[i] * params.intensity);
  
  // Your custom logic here
}

return imageData;`)

  const [params, setParams] = useState<Array<{
    name: string
    type: 'number' | 'color' | 'boolean'
    default: any
    min?: number
    max?: number
  }>>([
    { name: 'intensity', type: 'number', default: 1.5, min: 0, max: 3 }
  ])

  const handleSave = () => {
    if (!filterName.trim()) {
      alert('Please enter a filter name')
      return
    }

    if (!canAddMoreFilters()) {
      alert('No slots available. Please upgrade your plan.')
      return
    }

    const newFilter: CustomFilter = {
      id: `custom-${Date.now()}`,
      name: filterName,
      category: 'custom',
      params: params.map(p => ({
        ...p,
        type: p.type as any,
        step: p.type === 'number' ? 0.1 : undefined,
      })),
      code: filterCode,
      author: 'You',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      apply: (imageData: ImageData, userParams: Record<string, any>) => {
        try {
          // Create sandboxed function
          const func = new Function('imageData', 'params', filterCode)
          return func(imageData, userParams)
        } catch (error) {
          console.error('Filter execution error:', error)
          return imageData
        }
      },
    }

    addCustomFilter(newFilter)
    addFilterToSlot(newFilter)
    onClose()
  }

  const addParam = () => {
    setParams([
      ...params,
      { name: `param${params.length + 1}`, type: 'number', default: 0, min: 0, max: 100 }
    ])
  }

  const updateParam = (index: number, updates: Partial<typeof params[0]>) => {
    setParams(params.map((p, i) => i === index ? { ...p, ...updates } : p))
  }

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Create Custom Filter</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Code editor */}
          <div className="flex-1 flex flex-col p-4">
            <input
              type="text"
              placeholder="Filter Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="px-3 py-2 bg-gray-800 rounded mb-4"
            />
            
            <div className="flex-1 flex flex-col">
              <label className="text-sm text-gray-400 mb-2">Filter Code:</label>
              <textarea
                value={filterCode}
                onChange={(e) => setFilterCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 rounded font-mono text-sm"
                spellCheck={false}
              />
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">
                Tip: Access the data array directly to modify pixel values.
                Use the params object to receive user inputs.
              </p>
            </div>
          </div>

          {/* Right: Parameters */}
          <div className="w-80 p-4 border-l border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Parameters</h3>
              <button
                onClick={addParam}
                className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-96">
              {params.map((param, index) => (
                <div key={index} className="bg-gray-800 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => updateParam(index, { name: e.target.value })}
                      className="px-2 py-1 bg-gray-700 rounded text-sm flex-1 mr-2"
                      placeholder="Parameter name"
                    />
                    <button
                      onClick={() => removeParam(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <select
                    value={param.type}
                    onChange={(e) => updateParam(index, { type: e.target.value as any })}
                    className="w-full px-2 py-1 bg-gray-700 rounded text-sm mb-2"
                  >
                    <option value="number">Number</option>
                    <option value="color">Color</option>
                    <option value="boolean">Boolean</option>
                  </select>

                  {param.type === 'number' && (
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={param.min}
                        onChange={(e) => updateParam(index, { min: Number(e.target.value) })}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={param.default}
                        onChange={(e) => updateParam(index, { default: Number(e.target.value) })}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                        placeholder="Default"
                      />
                      <input
                        type="number"
                        value={param.max}
                        onChange={(e) => updateParam(index, { max: Number(e.target.value) })}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                        placeholder="Max"
                      />
                    </div>
                  )}

                  {param.type === 'color' && (
                    <input
                      type="color"
                      value={param.default || '#000000'}
                      onChange={(e) => updateParam(index, { default: e.target.value })}
                      className="w-full h-8 bg-gray-700 rounded cursor-pointer"
                    />
                  )}

                  {param.type === 'boolean' && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={param.default || false}
                        onChange={(e) => updateParam(index, { default: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Default Value</span>
                    </label>
                  )}
                </div>
              ))}
            </div>

            {/* Code template */}
            <div className="mt-4 p-3 bg-gray-800 rounded">
              <p className="text-xs text-gray-400 mb-2">Available Variables:</p>
              <code className="text-xs text-green-400">
                imageData.data // Uint8ClampedArray<br/>
                imageData.width // Image width<br/>
                imageData.height // Image height<br/>
                params.{params[0]?.name || 'paramName'} // Parameter value
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Test Filter
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Save to Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}