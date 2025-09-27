'use client'

import React, { useState } from 'react'
import { useFilter } from '../../contexts/FilterContext'
import { useEditor } from '../../contexts/EditorContext'
import { Filter } from '../../types'

export default function FilterPanel() {
  const { filters, customFilters, applyFilter } = useFilter()
  const { state } = useEditor()
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'advanced' | 'custom'>('basic')
  const [filterParams, setFilterParams] = useState<Record<string, Record<string, any>>>({})

  const handleApplyFilter = (filter: Filter) => {
    if (!state.activeLayerId) {
      alert('Please select a layer first')
      return
    }

    const params = filterParams[filter.id] || {}
    applyFilter(filter.id, params)
  }

  const handleParamChange = (filterId: string, paramName: string, value: any) => {
    setFilterParams(prev => ({
      ...prev,
      [filterId]: {
        ...prev[filterId],
        [paramName]: value,
      },
    }))
  }

  const getFiltersByCategory = () => {
    if (selectedCategory === 'custom') {
      return customFilters
    }
    return filters.filter(f => f.category === selectedCategory)
  }

  const currentFilters = getFiltersByCategory()

  return (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setSelectedCategory('basic')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            selectedCategory === 'basic'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Basic
        </button>
        <button
          onClick={() => setSelectedCategory('advanced')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            selectedCategory === 'advanced'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Advanced
        </button>
        <button
          onClick={() => setSelectedCategory('custom')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            selectedCategory === 'custom'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Filter list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {currentFilters.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {selectedCategory === 'custom'
                ? 'No custom filters yet'
                : 'Loading filters...'}
            </p>
          ) : (
            currentFilters.map((filter) => (
              <div
                key={filter.id}
                className="bg-gray-800 rounded p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{filter.name}</h4>
                  <button
                    onClick={() => handleApplyFilter(filter)}
                    className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Filter parameters */}
                {filter.params.length > 0 && (
                  <div className="space-y-2">
                    {filter.params.map((param) => (
                      <div key={param.name} className="space-y-1">
                        <label className="text-xs text-gray-400 capitalize">
                          {param.name}
                        </label>
                        
                        {param.type === 'number' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min={param.min}
                              max={param.max}
                              step={param.step}
                              defaultValue={param.default}
                              onChange={(e) =>
                                handleParamChange(filter.id, param.name, Number(e.target.value))
                              }
                              className="flex-1 h-1"
                            />
                            <span className="text-xs text-gray-400 w-12 text-right">
                              {filterParams[filter.id]?.[param.name] ?? param.default}
                            </span>
                          </div>
                        )}

                        {param.type === 'color' && (
                          <input
                            type="color"
                            defaultValue={param.default}
                            onChange={(e) =>
                              handleParamChange(filter.id, param.name, e.target.value)
                            }
                            className="w-full h-8 bg-gray-700 rounded cursor-pointer"
                          />
                        )}

                        {param.type === 'select' && (
                          <select
                            defaultValue={param.default}
                            onChange={(e) =>
                              handleParamChange(filter.id, param.name, e.target.value)
                            }
                            className="w-full px-2 py-1 bg-gray-700 text-xs rounded"
                          >
                            {param.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {param.type === 'boolean' && (
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={param.default}
                              onChange={(e) =>
                                handleParamChange(filter.id, param.name, e.target.checked)
                              }
                              className="rounded"
                            />
                            <span className="text-xs">Enable</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick presets */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 mb-2">Quick Presets</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-2 py-1 bg-gray-800 text-xs rounded hover:bg-gray-700 transition-colors">
            Auto Enhance
          </button>
          <button className="px-2 py-1 bg-gray-800 text-xs rounded hover:bg-gray-700 transition-colors">
            Beauty
          </button>
          <button className="px-2 py-1 bg-gray-800 text-xs rounded hover:bg-gray-700 transition-colors">
            Landscape
          </button>
          <button className="px-2 py-1 bg-gray-800 text-xs rounded hover:bg-gray-700 transition-colors">
            Portrait
          </button>
        </div>
      </div>
    </div>
  )
}