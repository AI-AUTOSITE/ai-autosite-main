// app/tools/ai-dev-dictionary/components/core/SearchHeader.tsx
'use client'

import { Search, X } from 'lucide-react'
import { categories } from '../../lib/terms/categories'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  resultCount: number
}

export default function SearchHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  resultCount
}: SearchHeaderProps) {
  return (
    <div className="space-y-4">
      {/* 検索バー */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search terms..."
          className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* カテゴリーフィルター（簡素化） */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedCategory === category.id
                ? 'bg-cyan-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* 結果数 */}
      {searchQuery && (
        <p className="text-center text-sm text-gray-400">
          Found <span className="text-cyan-400">{resultCount}</span> terms
        </p>
      )}
    </div>
  )
}