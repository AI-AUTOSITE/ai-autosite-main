// app/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Zap, Palette, Code, Database, Clock, Search, ChevronRight, Sparkles, Lock, Globe, Star } from 'lucide-react'

// Tool data
const tools = [
  {
    id: 'blurtap',
    name: 'BlurTap',
    description: 'Mask sensitive information in images with one click. Perfect for screenshots and documents.',
    category: 'privacy',
    icon: '🔒',
    color: 'from-cyan-500 to-purple-500',
    status: 'live',
    url: '/tools/blurtap',
    tags: ['Privacy', 'Images', 'Security'],
    users: '2.5k'
  },
  {
    id: 'code-reader',
    name: 'Code Dependency Visualizer',
    description: 'Analyze project structure and visualize file dependencies. Perfect for understanding codebases.',
    category: 'developer',
    icon: '🔍',
    color: 'from-blue-500 to-indigo-600',
    status: 'coming',
    url: '/tools/code-reader',
    tags: ['Developer', 'Code Analysis', 'Dependencies'],
    users: 'Soon'
  },
  {
    id: 'tech-stack-analyzer',
    name: 'Tech Stack Analyzer',
    description: 'Compare frameworks and get AI-powered recommendations for your next project.',
    category: 'developer',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-600',
    status: 'live',
    url: '/tools/tech-stack-analyzer',
    tags: ['Developer', 'Frameworks', 'Planning'],
    users: '1.2k'
  },
  {
    id: 'json-format',
    name: 'JSON Beautify',
    description: 'Format, validate, and minify JSON data instantly. Perfect for developers and API testing.',
    category: 'developer',
    icon: '{ }',
    color: 'from-green-500 to-emerald-500',
    status: 'coming',
    url: '/tools/json-format',
    tags: ['Developer', 'Data', 'API'],
    users: 'Soon'
  },
  {
    id: 'color-picker',
    name: 'Color Palette',
    description: 'Extract colors from any image and generate beautiful palettes for your designs.',
    category: 'creative',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    status: 'coming',
    url: '/tools/color-picker',
    tags: ['Design', 'Colors', 'Creative'],
    users: 'Soon'
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merge',
    description: 'Combine multiple PDF files into one. No upload needed, works in your browser.',
    category: 'productivity',
    icon: '📄',
    color: 'from-blue-500 to-indigo-500',
    status: 'coming',
    url: '/tools/pdf-merge',
    tags: ['PDF', 'Documents', 'Office'],
    users: 'Soon'
  }
]

const categories = [
  { id: 'all', name: 'All Tools', icon: Globe, count: tools.length },
  { id: 'developer', name: 'Developer', icon: Code, count: tools.filter(t => t.category === 'developer').length },
  { id: 'privacy', name: 'Privacy', icon: Shield, count: tools.filter(t => t.category === 'privacy').length },
  { id: 'productivity', name: 'Productivity', icon: Zap, count: tools.filter(t => t.category === 'productivity').length },
  { id: 'creative', name: 'Creative', icon: Palette, count: tools.filter(t => t.category === 'creative').length },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="w-10 h-10 text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Instant Tools
                </h1>
                <p className="text-xs text-gray-400">No Sign-up, No Upload, Just Works</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/updates" className="text-gray-300 hover:text-white transition-colors">
                Updates
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-16 px-4">
        <h2 className="text-4xl sm:text-6xl font-bold text-white mb-4">
          Instant Tools for
          <span className="block text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Everything You Need
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
          Free online tools that work instantly in your browser. No account required, 
          no data uploaded, no quality limits. Just simple tools that work.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Lock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">100% Private</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Instant Use</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Globe className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">No Upload</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Free Forever</p>
          </div>
        </div>
      </section>

      {/* Featured Developer Tools Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              🚀 AI-Powered Developer Tools
            </h3>
            <p className="text-gray-400">
              Professional code analysis and tech stack guidance for modern developers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/tools/tech-stack-analyzer" className="group">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-content text-2xl">
                    ⚙️
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                    LIVE
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  Tech Stack Analyzer
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Compare frameworks, understand trade-offs, and get AI-powered recommendations for your project.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">1.2k users</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            <Link href="/tools/code-reader" className="group opacity-75">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl">
                    🔍
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                    SOON
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Code Dependency Visualizer
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Analyze project structure, visualize file dependencies, and understand complex codebases.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Coming Soon</span>
                  <div className="w-4 h-4"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <cat.icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-70">({cat.count})</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.status === 'live' ? tool.url : tool.url}
              className="group"
            >
              <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all hover:bg-white/10 hover:scale-105 ${
                tool.status !== 'live' ? 'opacity-60' : ''
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {tool.icon}
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    tool.status === 'live' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {tool.status === 'live' ? 'LIVE' : 'SOON'}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {tool.users} users
                  </span>
                  {(tool.status === 'live' || tool.id === 'code-reader') && (
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No tools found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 px-4 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Building Something Special?
          </h3>
          <p className="text-gray-400 mb-8">
            We're constantly adding new tools based on user feedback. 
            Have an idea for a tool you need? Let us know!
          </p>
          <Link
            href="/request"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            <span>Request a Tool</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Instant Tools by AI AutoSite • All tools are free and process data locally • No tracking, no ads
          </p>
        </div>
      </footer>
    </div>
  )
}