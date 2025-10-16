// app/tools/ai-dev-dictionary/components/AIDevDictionaryClient.tsx
'use client'

import { Suspense, lazy, useState } from 'react'
import CategoryGrid from './layout/CategoryGrid'
import TermGrid from './layout/TermGrid'
import LoadingSpinner from './common/LoadingSpinner'
import { ChevronLeft } from 'lucide-react'
import { categories } from '../lib/terms/categories'
import { getTermsByCategory } from '../lib/terms'

const DemoModal = lazy(() => import('./modals/DemoModal'))

export default function AIDevDictionaryClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categoryTerms = selectedCategory ? getTermsByCategory(selectedCategory) : []

  const filteredTerms = searchQuery
    ? categoryTerms.filter(
        (term) =>
          term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryTerms

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <section className="relative z-10 px-4 py-6 sm:py-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {!selectedCategory ? (
            <CategoryGrid categories={categories} onSelectCategory={setSelectedCategory} />
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 space-y-4">
                {/* Back Button */}
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2 min-h-[48px] px-4 py-3 text-gray-400 hover:text-white 
                             bg-white/5 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Back to Categories</span>
                </button>

                {/* Category Title */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <span className="text-sm text-gray-400">{filteredTerms.length} terms</span>
                </div>

                {/* Search Bar */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${categories.find((c) => c.id === selectedCategory)?.name}...`}
                  className="w-full min-h-[48px] px-4 py-4 bg-white/10 border border-white/20 rounded-xl 
                             text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none 
                             focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Term Grid */}
              <TermGrid terms={filteredTerms} onSelectTerm={setSelectedTerm} />
            </>
          )}
        </div>
      </section>

      {/* Demo Modal */}
      {selectedTerm && (
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <DemoModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
        </Suspense>
      )}
    </div>
  )
}