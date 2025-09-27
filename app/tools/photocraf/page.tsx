'use client'

import { useState } from 'react'
import { EditorProvider } from './contexts/EditorContext'
import { FilterProvider } from './contexts/FilterContext'
import { SlotProvider } from './contexts/SlotContext'
import { BatchProvider } from './contexts/BatchContext'
import Canvas from './components/Editor/Canvas'
import Toolbar from './components/Editor/Toolbar'
import LayerPanel from './components/Editor/LayerPanel'
import FilterPanel from './components/Editor/FilterPanel'
import CustomFilterEditor from './components/CustomFilter/Editor'
import SlotManager from './components/CustomFilter/SlotManager'
import AIPromptGenerator from './components/AI/PromptGenerator'
import BatchProcessor from './components/Batch/BatchProcessor'
import FilterMarketplace from './components/Marketplace/FilterMarketplace'
import CollaborationManager from './components/Collaboration/CollaborationManager'
import SmartCropTool from './components/Tools/SmartCrop'
import Toast from './components/UI/Toast'

export default function PhotoCraftPage() {
  const [activePanel, setActivePanel] = useState<'layers' | 'filters' | 'custom'>('filters')
  const [showCustomEditor, setShowCustomEditor] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [showMarketplace, setShowMarketplace] = useState(false)
  const [showBatchProcessor, setShowBatchProcessor] = useState(false)

  return (
    <EditorProvider>
      <FilterProvider>
        <SlotProvider>
          <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PhotoCraft
                </h1>
                <span className="text-xs text-gray-500">v0.1.0</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <SlotManager />
                <button
                  onClick={() => setShowMarketplace(true)}
                  className="px-3 py-1 text-sm bg-gradient-to-r from-green-600 to-blue-600 text-white rounded hover:from-green-700 hover:to-blue-700 transition-all"
                >
                  🛍️ Marketplace
                </button>
                <button className="px-3 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors">
                  File
                </button>
                <button className="px-3 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors">
                  View
                </button>
                <button className="px-3 py-1 text-sm bg-gray-800 rounded hover:bg-gray-700 transition-colors">
                  Help
                </button>
              </div>
            </header>

            {/* Toolbar */}
            <Toolbar />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel */}
              <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="flex border-b border-gray-800">
                  <button
                    onClick={() => setActivePanel('layers')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      activePanel === 'layers'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Layers
                  </button>
                  <button
                    onClick={() => setActivePanel('filters')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      activePanel === 'filters'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Filters
                  </button>
                  <button
                    onClick={() => setActivePanel('custom')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      activePanel === 'custom'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Custom
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {activePanel === 'layers' && <LayerPanel />}
                  {activePanel === 'filters' && <FilterPanel />}
                  {activePanel === 'custom' && (
                    <div className="p-4">
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowAIGenerator(true)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
                        >
                          <span>✨</span>
                          <span>AI Filter Generator</span>
                        </button>
                        <button
                          onClick={() => setShowCustomEditor(true)}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                          Create New Filter
                        </button>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-400">Saved Filters</p>
                        {/* Custom filters list will be here */}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 flex items-center justify-center bg-gray-950 p-8">
                <Canvas />
              </div>

              {/* Right Panel - Properties */}
              <div className="w-64 bg-gray-900 border-l border-gray-800">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-sm font-medium text-gray-300">Properties</h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Properties will be displayed here based on selected tool */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Width</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="1920"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Height</label>
                    <input
                      type="number"
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="1080"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-gray-900 border-t border-gray-800 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>100%</span>
                <span>1920 x 1080</span>
                <span>RGB/8</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Memory: 124MB</span>
                <span>Processing: 0.02s</span>
              </div>
            </div>
          </div>

          {/* Custom Filter Editor Modal */}
          {showCustomEditor && (
            <CustomFilterEditor onClose={() => setShowCustomEditor(false)} />
          )}

          {/* AI Filter Generator Modal */}
          {showAIGenerator && (
            <AIPromptGenerator onClose={() => setShowAIGenerator(false)} />
          )}

          {/* Filter Marketplace Modal */}
          {showMarketplace && (
            <FilterMarketplace onClose={() => setShowMarketplace(false)} />
          )}

          {/* Batch Processor Modal */}
          {showBatchProcessor && (
            <BatchProcessor onClose={() => setShowBatchProcessor(false)} />
          )}

          {/* Hidden button for batch processor */}
          <button
            id="batch-processor-btn"
            onClick={() => setShowBatchProcessor(true)}
            className="hidden"
          />

          {/* Collaboration Manager */}
          <CollaborationManager />

          <Toast />
        </SlotProvider>
      </FilterProvider>
    </EditorProvider>
  )
}