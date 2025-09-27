'use client'

import React, { useState, useEffect } from 'react'
import { useFilter } from './../../contexts/FilterContext'
import { useSlots } from './../../contexts/SlotContext'
import { CustomFilter } from './../../types'
import { showToast } from './../UI/Toast'

interface MarketplaceFilter extends CustomFilter {
  price: number
  downloads: number
  rating: number
  reviews: number
  authorRevenue: number
  preview?: string
}

interface Props {
  onClose: () => void
}

export default function FilterMarketplace({ onClose }: Props) {
  const { addCustomFilter } = useFilter()
  const { addFilterToSlot, canAddMoreFilters, slotState } = useSlots()
  const [selectedCategory, setSelectedCategory] = useState<'trending' | 'new' | 'top' | 'my-filters'>('trending')
  const [filters, setFilters] = useState<MarketplaceFilter[]>([])
  const [selectedFilter, setSelectedFilter] = useState<MarketplaceFilter | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userBalance, setUserBalance] = useState(0)
  const [purchasedFilters, setPurchasedFilters] = useState<string[]>([])

  // Mock marketplace filters
  const mockFilters: MarketplaceFilter[] = [
    {
      id: 'market-1',
      name: 'Cinematic Pro',
      category: 'custom',
      params: [{ name: 'intensity', type: 'number', default: 50, min: 0, max: 100 }],
      code: '',
      author: 'ProEditor',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isPublic: true,
      price: 2.99,
      downloads: 1250,
      rating: 4.8,
      reviews: 234,
      authorRevenue: 2500,
      apply: () => new ImageData(1, 1),
    },
    {
      id: 'market-2',
      name: 'Instagram Pack',
      category: 'custom',
      params: [{ name: 'style', type: 'select', default: 'valencia', options: [
        { label: 'Valencia', value: 'valencia' },
        { label: 'Nashville', value: 'nashville' },
        { label: 'Hudson', value: 'hudson' },
      ]}],
      code: '',
      author: 'SocialFilters',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      isPublic: true,
      price: 4.99,
      downloads: 3400,
      rating: 4.9,
      reviews: 567,
      authorRevenue: 12000,
      apply: () => new ImageData(1, 1),
    },
    {
      id: 'market-3',
      name: 'Portrait Enhancer',
      category: 'custom',
      params: [{ name: 'smoothness', type: 'number', default: 30, min: 0, max: 100 }],
      code: '',
      author: 'BeautyTech',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      isPublic: true,
      price: 3.49,
      downloads: 890,
      rating: 4.6,
      reviews: 123,
      authorRevenue: 2100,
      apply: () => new ImageData(1, 1),
    },
    {
      id: 'market-4',
      name: 'Anime Style',
      category: 'custom',
      params: [{ name: 'strength', type: 'number', default: 70, min: 0, max: 100 }],
      code: '',
      author: 'OtakuFilters',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      isPublic: true,
      price: 1.99,
      downloads: 2100,
      rating: 4.7,
      reviews: 345,
      authorRevenue: 3200,
      apply: () => new ImageData(1, 1),
    },
    {
      id: 'market-5',
      name: 'Film Noir',
      category: 'custom',
      params: [{ name: 'contrast', type: 'number', default: 80, min: 0, max: 100 }],
      code: '',
      author: 'ClassicFilms',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
      isPublic: true,
      price: 0.99,
      downloads: 5600,
      rating: 4.5,
      reviews: 789,
      authorRevenue: 4200,
      apply: () => new ImageData(1, 1),
    },
  ]

  useEffect(() => {
    // Load filters based on category
    let filteredFilters = [...mockFilters]
    
    switch (selectedCategory) {
      case 'trending':
        filteredFilters.sort((a, b) => b.downloads - a.downloads)
        break
      case 'new':
        filteredFilters.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'top':
        filteredFilters.sort((a, b) => b.rating - a.rating)
        break
      case 'my-filters':
        filteredFilters = filteredFilters.filter(f => purchasedFilters.includes(f.id))
        break
    }

    if (searchQuery) {
      filteredFilters = filteredFilters.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilters(filteredFilters)
  }, [selectedCategory, searchQuery, purchasedFilters])

  const handlePurchase = (filter: MarketplaceFilter) => {
    if (!canAddMoreFilters()) {
      showToast('No slots available. Please upgrade your plan.', 'warning')
      return
    }

    // Check if user has enough balance (mock)
    if (userBalance < filter.price) {
      showToast('Insufficient balance. Add funds to your account.', 'error')
      return
    }

    // Add to purchased filters
    setPurchasedFilters(prev => [...prev, filter.id])
    setUserBalance(prev => prev - filter.price)
    
    // Add filter to user's collection
    addCustomFilter(filter)
    addFilterToSlot(filter)
    
    showToast(`Successfully purchased "${filter.name}"!`, 'success')
    setSelectedFilter(null)
  }

  const handlePublishFilter = () => {
    showToast('Publishing feature coming soon!', 'info')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold">Filter Marketplace</h2>
            <p className="text-sm text-gray-400 mt-1">
              Discover and sell professional filters
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Balance Display */}
            <div className="px-3 py-1 bg-gray-800 rounded">
              <span className="text-xs text-gray-400">Balance:</span>
              <span className="ml-2 font-medium">${userBalance.toFixed(2)}</span>
            </div>
            
            {/* Publish Button */}
            <button
              onClick={handlePublishFilter}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              Publish Filter
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-gray-800 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('trending')}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedCategory === 'trending'
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                🔥 Trending
              </button>
              <button
                onClick={() => setSelectedCategory('new')}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedCategory === 'new'
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                ✨ New Arrivals
              </button>
              <button
                onClick={() => setSelectedCategory('top')}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedCategory === 'top'
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                ⭐ Top Rated
              </button>
              <button
                onClick={() => setSelectedCategory('my-filters')}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedCategory === 'my-filters'
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                💼 My Filters
              </button>
            </div>

            {/* Stats */}
            <div className="mt-8 p-3 bg-gray-700 rounded">
              <h4 className="text-xs font-medium mb-2">Your Stats</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Filters Published: 0</div>
                <div>Total Sales: 0</div>
                <div>Revenue: $0.00</div>
              </div>
            </div>
          </div>

          {/* Filter Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div
                  key={filter.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {/* Preview Image */}
                  <div className="h-32 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-4xl">🎨</span>
                  </div>
                  
                  {/* Filter Info */}
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{filter.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">by {filter.author}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm">{filter.rating}</span>
                        <span className="text-xs text-gray-500">({filter.reviews})</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {filter.downloads} downloads
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-400">
                        ${filter.price}
                      </span>
                      {purchasedFilters.includes(filter.id) ? (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                          Owned
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePurchase(filter)
                          }}
                          className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No filters found</p>
              </div>
            )}
          </div>
        </div>

        {/* Filter Detail Modal */}
        {selectedFilter && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedFilter.name}</h3>
                  <p className="text-sm text-gray-400">by {selectedFilter.author}</p>
                </div>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Preview */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg h-48 flex items-center justify-center">
                  <span className="text-6xl">🎨</span>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Rating</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= Math.floor(selectedFilter.rating) ? 'text-yellow-400' : 'text-gray-600'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm">{selectedFilter.rating} ({selectedFilter.reviews} reviews)</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Downloads</h4>
                    <p className="text-sm text-gray-400">{selectedFilter.downloads.toLocaleString()}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Parameters</h4>
                    <div className="space-y-1">
                      {selectedFilter.params.map((param) => (
                        <div key={param.name} className="text-xs text-gray-400">
                          • {param.name} ({param.type})
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">
                        ${selectedFilter.price}
                      </span>
                      {purchasedFilters.includes(selectedFilter.id) ? (
                        <button
                          disabled
                          className="px-6 py-2 bg-gray-700 text-gray-400 rounded cursor-not-allowed"
                        >
                          Already Owned
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(selectedFilter)}
                          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                          Purchase Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}