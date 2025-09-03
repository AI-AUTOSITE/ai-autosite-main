// app/tools/ai-dev-dictionary/page.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, 
  BookOpen, 
  Code2, 
  Sparkles,
  ChevronRight,
  Filter,
  X,
  Copy,
  Check,
  ExternalLink,
  Zap,
  MousePointer,
  Layout,
  Component,
  FormInput,
  MessageSquare,
  Loader2,
  Link as LinkIcon,
  Grid3x3,
  List,
  Bot,
  User
} from 'lucide-react'

// Import from the new structure
import { techTerms, categories, type TechTerm } from './lib/terms'

// Chat-style components
import ChatStyleDemoCard from './components/ChatStyleDemoCard'
import ChatDemoModal from './components/ChatDemoModal'
import TermListItem from './components/TermListItem'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'

export default function AIDevDictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTerm, setSelectedTerm] = useState<TechTerm | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [demoStates, setDemoStates] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    let filtered = techTerms

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(query) ||
        term.aiSynonyms.some(syn => syn.toLowerCase().includes(query)) ||
        term.aiPhrases.some(phrase => phrase.toLowerCase().includes(query)) ||
        term.description.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const handleCopyCode = (code: string, termId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(termId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Chat Theme */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6 border border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            AI × Individual Developer
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            AI Dev
            <span className="block text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Dictionary
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover "So this is what a Modal is!" moments. 
            A terminology dictionary for individual developers to give precise instructions to AI.
          </p>

          {/* Chat Style Preview */}
          <div className="max-w-2xl mx-auto mb-12 bg-slate-900 rounded-xl border border-white/10 p-4">
            <div className="flex gap-3 mb-3">
              <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <div className="bg-gray-800 rounded-lg rounded-tl-none px-3 py-2">
                <p className="text-sm text-gray-300">
                  I want to create something like a popup
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg rounded-tl-none px-3 py-2 border border-cyan-500/20">
                <p className="text-sm text-gray-300">
                  That's called a <span className="text-cyan-400 font-semibold">Modal</span> UI pattern
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">{techTerms.length}</div>
              <div className="text-sm text-gray-400">Terms Explained</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400">Interactive</div>
              <div className="text-sm text-gray-400">Live Demos</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400">AI-Ready</div>
              <div className="text-sm text-gray-400">Copy & Paste Prompts</div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto space-y-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by term, AI phrase, or description..."
            />
            
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              termCounts={techTerms.reduce((acc, term) => {
                acc[term.category] = (acc[term.category] || 0) + 1
                return acc
              }, {} as Record<string, number>)}
            />
          </div>
        </div>
      </section>

      {/* Terms Grid - Chat Style Layout */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Results Count and View Toggle */}
          {filteredTerms.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Found <span className="text-cyan-400 font-semibold">{filteredTerms.length}</span> terms
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  title="Grid view"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {filteredTerms.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No terms found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            }>
              {filteredTerms.map((term) => (
                viewMode === 'grid' ? (
                  <ChatStyleDemoCard
                    key={term.id}
                    term={term}
                    onViewDemo={() => setSelectedTerm(term)}
                  />
                ) : (
                  <TermListItem
                    key={term.id}
                    term={term}
                    onViewDetails={() => setSelectedTerm(term)}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Chat Demo Modal */}
      {selectedTerm && (
        <ChatDemoModal
          term={selectedTerm}
          onClose={() => setSelectedTerm(null)}
        />
      )}

      {/* Related Tools Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Complete Your Learning Journey</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Link 
              href="/tools/tech-stack-analyzer"
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Tech Stack Analyzer
              </h3>
              <p className="text-gray-400 mb-4">
                Now that you understand the terms, choose the right tech stack for your project with AI-powered recommendations.
              </p>
              <div className="inline-flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span>Analyze Tech Stack</span>
                <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/tools/code-reader"
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                Code Dependency Visualizer
              </h3>
              <p className="text-gray-400 mb-4">
                Understand how components work together by visualizing your project's structure and dependencies.
              </p>
              <div className="inline-flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <span>Visualize Dependencies</span>
                <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper functions
function getCategoryIcon(category: string) {
  const icons: Record<string, JSX.Element> = {
    'ui-components': <Component className="w-5 h-5 text-cyan-400" />,
    'data-display': <Layout className="w-5 h-5 text-blue-400" />,
    'layout': <Layout className="w-5 h-5 text-purple-400" />,
    'navigation': <MousePointer className="w-5 h-5 text-green-400" />,
    'forms': <FormInput className="w-5 h-5 text-yellow-400" />,
    'feedback': <MessageSquare className="w-5 h-5 text-pink-400" />,
    'advanced': <Zap className="w-5 h-5 text-orange-400" />
  }
  return icons[category] || <Component className="w-5 h-5 text-gray-400" />
}

function getCategoryColor(category: string) {
  const colors: Record<string, { bg: string, text: string }> = {
    'ui-components': { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
    'data-display': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    'layout': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    'navigation': { bg: 'bg-green-500/20', text: 'text-green-400' },
    'forms': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    'feedback': { bg: 'bg-pink-500/20', text: 'text-pink-400' },
    'advanced': { bg: 'bg-orange-500/20', text: 'text-orange-400' }
  }
  return colors[category] || { bg: 'bg-gray-500/20', text: 'text-gray-400' }
}