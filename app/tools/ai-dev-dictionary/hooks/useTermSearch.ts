// app/tools/ai-dev-dictionary/hooks/useTermSearch.ts
import { useState, useMemo, useCallback } from 'react'
import { techTerms } from '../lib/terms'
import { useDebounce } from './useDebounce'

export function useTermSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // 検索クエリをデバウンス（パフォーマンス向上）
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  const filteredTerms = useMemo(() => {
    let filtered = techTerms

    // カテゴリーフィルター
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory)
    }

    // 検索フィルター（デバウンス後）
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(query) ||
        term.aiSynonyms.some(syn => syn.toLowerCase().includes(query)) ||
        term.description.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [debouncedSearchQuery, selectedCategory])

  const isSearching = searchQuery !== debouncedSearchQuery

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTerms,
    isSearching
  }
}