'use client'

import { useState } from 'react'
import { Grid3x3, Layers, Shield, Zap } from 'lucide-react'
import ImageGrid from './ImageGrid'
import SplitMerger from './SplitMerger'

export default function ImageGridMerger() {
  const [activeTab, setActiveTab] = useState<'grid' | 'split'>('grid')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tool Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Image Grid Merger
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Create numbered image grids instantly. No uploads, no sign-up, 100% local processing.
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">
          Privacy-First Image Processing
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <Shield className="w-12 h-12 text-cyan-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">100% Private</h3>
            <p className="text-gray-400 text-sm">Images never leave your device</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Zap className="w-12 h-12 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Instant Processing</h3>
            <p className="text-gray-400 text-sm">No waiting, no uploads</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Grid3x3 className="w-12 h-12 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Flexible Grids</h3>
            <p className="text-gray-400 text-sm">Up to 8x8 grid with numbering</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('grid')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'grid'
              ? 'bg-cyan-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <Grid3x3 className="inline-block w-4 h-4 mr-2" />
          Grid Merger
        </button>
        <button
          onClick={() => setActiveTab('split')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'split'
              ? 'bg-cyan-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <Layers className="inline-block w-4 h-4 mr-2" />
          Split & Rebuild
        </button>
      </div>

      {/* Main Tool Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
        {activeTab === 'grid' ? <ImageGrid /> : <SplitMerger />}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-black/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start">
            <span className="text-cyan-400 mr-2">•</span>
            <span>Drag & drop or click to add images to the grid</span>
          </li>
          <li className="flex items-start">
            <span className="text-cyan-400 mr-2">•</span>
            <span>Adjust rows and columns (up to 8x8)</span>
          </li>
          <li className="flex items-start">
            <span className="text-cyan-400 mr-2">•</span>
            <span>Toggle number overlay for easy reference</span>
          </li>
          <li className="flex items-start">
            <span className="text-cyan-400 mr-2">•</span>
            <span>Click merge to download the combined image</span>
          </li>
        </ul>
      </div>
    </div>
  )
}