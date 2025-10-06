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

  // カテゴリーが選択されたら、そのカテゴリーの用語を取得
  const categoryTerms = selectedCategory ? getTermsByCategory(selectedCategory) : []

  // 検索フィルター
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
      {/* メインコンテンツ */}
      <section className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {!selectedCategory ? (
            // カテゴリー選択画面
            <CategoryGrid categories={categories} onSelectCategory={setSelectedCategory} />
          ) : (
            // デモ一覧画面
            <>
              {/* 戻るボタンと検索バー */}
              <div className="mb-6 space-y-4">
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Categories
                </button>

                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <span className="text-gray-400">{filteredTerms.length} terms</span>
                </div>

                {/* 検索バー */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${categories.find((c) => c.id === selectedCategory)?.name}...`}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* デモ一覧 */}
              <TermGrid terms={filteredTerms} onSelectTerm={setSelectedTerm} />
            </>
          )}
        </div>
      </section>

      {/* デモモーダル */}
      {selectedTerm && (
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <DemoModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
        </Suspense>
      )}
    </div>
  )
}
