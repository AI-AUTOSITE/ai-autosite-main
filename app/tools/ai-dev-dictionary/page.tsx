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
  Loader2
} from 'lucide-react'
import { techTerms, categories } from './lib/terms-data'
import InteractiveDemo from './components/InteractiveDemo'
import SearchBar from './components/SearchBar'
import TermCard from './components/TermCard'
import CategoryFilter from './components/CategoryFilter'

export default function AIDevDictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTerm, setSelectedTerm] = useState<any>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [demoStates, setDemoStates] = useState<Record<string, boolean>>({})

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

  const triggerDemo = (termId: string) => {
    setDemoStates({ ...demoStates, [termId]: true })
    setTimeout(() => {
      setDemoStates({ ...demoStates, [termId]: false })
    }, 3000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6 border border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Interactive Dictionary
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            AI Dev
            <span className="block text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Dictionary
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Decode AI terminology with interactive examples. Understand what AI really means when it suggests UI components and development patterns.
          </p>

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
              <div className="text-2xl font-bold text-purple-400">AI-Focused</div>
              <div className="text-sm text-gray-400">Phrase Mapping</div>
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

      {/* Terms Grid */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No terms found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTerms.map((term) => (
                <TermCard
                  key={term.id}
                  term={term}
                  isActive={demoStates[term.id]}
                  onTriggerDemo={() => triggerDemo(term.id)}
                  onViewDetails={() => setSelectedTerm(term)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getCategoryColor(selectedTerm.category).bg}`}>
                      {getCategoryIcon(selectedTerm.category)}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{selectedTerm.term}</h2>
                  </div>
                  <p className="text-gray-400">{selectedTerm.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-6 space-y-6">
                {/* Interactive Demo */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Live Demo
                  </h3>
                  <InteractiveDemo term={selectedTerm} />
                </div>

                {/* AI Synonyms */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Synonyms & Variations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.aiSynonyms.map((synonym: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Common AI Phrases */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    Common AI Phrases
                  </h3>
                  <div className="space-y-2">
                    {selectedTerm.aiPhrases.map((phrase: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{phrase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Example */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-green-400" />
                    Code Example
                  </h3>
                  <div className="relative">
                    <pre className="bg-black/50 text-gray-300 p-4 rounded-lg overflow-x-auto border border-white/10">
                      <code className="text-sm">{selectedTerm.codeExample}</code>
                    </pre>
                    <button
                      onClick={() => handleCopyCode(selectedTerm.codeExample, selectedTerm.id)}
                      className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {copiedCode === selectedTerm.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Related Terms */}
                {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Link className="w-5 h-5 text-indigo-400" />
                      Related Terms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map((related: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            const relatedTerm = techTerms.find(t => t.term === related)
                            if (relatedTerm) setSelectedTerm(relatedTerm)
                          }}
                          className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
                        >
                          {related}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
    'layout': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    'navigation': { bg: 'bg-green-500/20', text: 'text-green-400' },
    'forms': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    'feedback': { bg: 'bg-pink-500/20', text: 'text-pink-400' },
    'advanced': { bg: 'bg-orange-500/20', text: 'text-orange-400' }
  }
  return colors[category] || { bg: 'bg-gray-500/20', text: 'text-gray-400' }
}