'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Zap, Code, BookOpen, Search, ChevronRight, Lock, Globe, Star, Clock, Users, TrendingUp, Sparkles } from 'lucide-react'

// Persona definitions
const personas = [
  {
    id: 'quick-tools',
    title: 'Quick Tools',
    tagline: 'One-click solutions',
    icon: '⚡',
    iconComponent: Zap,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/20',
    description: 'Instant tools for everyday tasks. No setup, no account needed.',
    benefits: ['10-second solutions', 'Zero learning curve', 'Works offline'],
    toolCount: 0 // Will be calculated
  },
  {
    id: 'dev-tools',
    title: 'Developer Tools',
    tagline: 'Debug & analyze code',
    icon: '🔧',
    iconComponent: Code,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-500/10 to-indigo-500/10',
    borderColor: 'border-purple-500/20',
    description: 'Professional tools for debugging, analyzing, and optimizing code.',
    benefits: ['Deep code analysis', 'Dependency mapping', 'Tech stack insights'],
    toolCount: 0
  },
  {
    id: 'learning',
    title: 'Learning Hub',
    tagline: 'Understand concepts',
    icon: '📚',
    iconComponent: BookOpen,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/20',
    description: 'Learn and understand technical concepts with interactive examples.',
    benefits: ['Visual explanations', 'Interactive demos', 'Beginner-friendly'],
    toolCount: 0
  }
]

// Updated tool data with persona mapping
const tools = [
{
  id: 'pc-optimizer',
  name: 'PC Optimizer Advisor',
  description: 'Free up storage space! Analyze Program Files to identify removal candidates. 100% local processing for privacy.',
  persona: 'quick-tools',
  icon: '💻',
  color: 'from-blue-500 to-cyan-500',
  status: 'live',
  url: '/tools/pc-optimizer',
  tags: ['Windows', 'Performance', 'Cleanup'],
  difficulty: 'Beginner',
  timeToUse: '3 minutes',
  users: 'New',
  featured: true
},
  {
    id: 'blurtap',
    name: 'BlurTap',
    description: 'Mask sensitive information in images with one click. Perfect for screenshots and documents.',
    persona: 'quick-tools',
    icon: '🔒',
    color: 'from-cyan-500 to-purple-500',
    status: 'live',
    url: '/tools/blurtap',
    tags: ['Privacy', 'Images', 'Security'],
    difficulty: 'Beginner',
    timeToUse: '10 seconds',
    users: '2.5k',
    featured: true
  },
  {
    id: 'json-format',
    name: 'JSON Beautify',
    description: 'Format, validate, and minify JSON data instantly. Perfect for API testing.',
    persona: 'quick-tools',
    icon: '{ }',
    color: 'from-green-500 to-emerald-500',
    status: 'live',
    url: '/tools/json-format',
    tags: ['Data', 'Format', 'Quick'],
    difficulty: 'Beginner',
    timeToUse: '5 seconds',
    users: 'Soon',
    featured: false
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merge',
    description: 'Combine multiple PDF files into one. No upload needed, works in browser.',
    persona: 'quick-tools',
    icon: '📄',
    color: 'from-blue-500 to-indigo-500',
    status: 'coming',
    url: '/tools/pdf-merge',
    tags: ['PDF', 'Documents', 'Merge'],
    difficulty: 'Beginner',
    timeToUse: '30 seconds',
    users: 'Soon',
    featured: false
  },
  {
    id: 'text-case',
    name: 'Text Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, and more formats instantly.',
    persona: 'quick-tools',
    icon: '📝',
    color: 'from-pink-500 to-rose-500',
    status: 'live',
    url: '/tools/text-case',
    tags: ['Text', 'Format', 'Convert'],
    difficulty: 'Beginner',
    timeToUse: '3 seconds',
    users: 'Soon',
    featured: false
  },
  {
    id: 'color-picker',
    name: 'Color Palette Extractor',
    description: 'Extract dominant colors from any image and generate beautiful color palettes.',
    persona: 'quick-tools',
    icon: '🎨',
    color: 'from-violet-500 to-purple-500',
    status: 'coming',
    url: '/tools/color-picker',
    tags: ['Design', 'Colors', 'Images'],
    difficulty: 'Beginner',
    timeToUse: '15 seconds',
    users: 'Soon',
    featured: false
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for URLs, text, WiFi, and more. Customize colors and download as PNG.',
    persona: 'quick-tools',
    icon: '📱',
    color: 'from-gray-600 to-gray-800',
    status: 'coming',
    url: '/tools/qr-generator',
    tags: ['QR Code', 'Generate', 'Share'],
    difficulty: 'Beginner',
    timeToUse: '10 seconds',
    users: 'Soon',
    featured: false
  },
  
  // Developer Tools - Code and technical tools
  {
    id: 'code-reader',
    name: 'Code Dependency Visualizer',
    description: 'Analyze project structure and visualize file dependencies. Understand any codebase.',
    persona: 'dev-tools',
    icon: '🔍',
    color: 'from-blue-500 to-indigo-600',
    status: 'live',
    url: '/tools/code-reader',
    tags: ['Code Analysis', 'Dependencies', 'Visualization'],
    difficulty: 'Intermediate',
    timeToUse: '2 minutes',
    users: '850',
    featured: true
  },
  {
    id: 'tech-stack-analyzer',
    name: 'Tech Stack Analyzer',
    description: 'Compare frameworks and get AI-powered recommendations for your project.',
    persona: 'dev-tools',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-600',
    status: 'live',
    url: '/tools/tech-stack-analyzer',
    tags: ['Frameworks', 'Planning', 'AI Analysis'],
    difficulty: 'Advanced',
    timeToUse: '5 minutes',
    users: '1.2k',
    featured: true
  },
  {
    id: 'regex-builder',
    name: 'Regex Builder & Tester',
    description: 'Build and test regular expressions with real-time matching and explanation.',
    persona: 'dev-tools',
    icon: '🔤',
    color: 'from-red-500 to-orange-500',
    status: 'coming',
    url: '/tools/regex-builder',
    tags: ['Regex', 'Testing', 'Pattern'],
    difficulty: 'Intermediate',
    timeToUse: '1 minute',
    users: 'Soon',
    featured: false
  },
  {
    id: 'api-tester',
    name: 'API Request Builder',
    description: 'Test REST APIs with custom headers, body, and authentication. See formatted responses.',
    persona: 'dev-tools',
    icon: '🔌',
    color: 'from-teal-500 to-cyan-500',
    status: 'coming',
    url: '/tools/api-tester',
    tags: ['API', 'Testing', 'HTTP'],
    difficulty: 'Intermediate',
    timeToUse: '30 seconds',
    users: 'Soon',
    featured: false
  },
  {
    id: 'sql-formatter',
    name: 'SQL Query Formatter',
    description: 'Format and beautify SQL queries. Support for multiple SQL dialects.',
    persona: 'dev-tools',
    icon: '🗄️',
    color: 'from-indigo-500 to-blue-500',
    status: 'coming',
    url: '/tools/sql-formatter',
    tags: ['SQL', 'Database', 'Format'],
    difficulty: 'Beginner',
    timeToUse: '5 seconds',
    users: 'Soon',
    featured: false
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Token Decoder',
    description: 'Decode and validate JWT tokens. View header, payload, and verify signatures.',
    persona: 'dev-tools',
    icon: '🔐',
    color: 'from-purple-500 to-pink-500',
    status: 'coming',
    url: '/tools/jwt-decoder',
    tags: ['JWT', 'Security', 'Authentication'],
    difficulty: 'Intermediate',
    timeToUse: '10 seconds',
    users: 'Soon',
    featured: false
  },
  
  // Learning Hub - Educational tools
  {
    id: 'ai-dev-dictionary',
    name: 'AI Dev Dictionary',
    description: 'Comprehensive glossary with interactive examples and visual demonstrations.',
    persona: 'learning',
    icon: '📖',
    color: 'from-amber-500 to-orange-600',
    status: 'live',
    url: '/tools/ai-dev-dictionary',
    tags: ['Learning', 'AI Terms', 'Reference'],
    difficulty: 'Beginner',
    timeToUse: '1 minute',
    users: '500',
    featured: true
  },
  {
    id: 'error-explainer',
    name: 'Error Message Explainer',
    description: 'Paste any error message and get a plain English explanation with solutions.',
    persona: 'learning',
    icon: '❌',
    color: 'from-red-500 to-rose-500',
    status: 'coming',
    url: '/tools/error-explainer',
    tags: ['Debugging', 'Learning', 'Errors'],
    difficulty: 'Beginner',
    timeToUse: '30 seconds',
    users: 'Soon',
    featured: false
  },
  {
    id: 'code-concepts',
    name: 'Code Concepts Visualizer',
    description: 'Visual explanations of programming concepts like recursion, algorithms, and data structures.',
    persona: 'learning',
    icon: '🎓',
    color: 'from-blue-500 to-purple-500',
    status: 'coming',
    url: '/tools/code-concepts',
    tags: ['Education', 'Visualization', 'Concepts'],
    difficulty: 'Beginner',
    timeToUse: '2 minutes',
    users: 'Soon',
    featured: false
  },
  {
    id: 'git-commands',
    name: 'Git Command Helper',
    description: 'Interactive guide for Git commands with examples and common scenarios.',
    persona: 'learning',
    icon: '🌳',
    color: 'from-green-500 to-teal-500',
    status: 'coming',
    url: '/tools/git-commands',
    tags: ['Git', 'Reference', 'Commands'],
    difficulty: 'Beginner',
    timeToUse: '1 minute',
    users: 'Soon',
    featured: false
  },
  {
    id: 'big-o-calculator',
    name: 'Big O Complexity Calculator',
    description: 'Analyze code complexity and understand Big O notation with visual graphs.',
    persona: 'learning',
    icon: '📊',
    color: 'from-yellow-500 to-orange-500',
    status: 'coming',
    url: '/tools/big-o-calculator',
    tags: ['Algorithm', 'Performance', 'Learning'],
    difficulty: 'Intermediate',
    timeToUse: '3 minutes',
    users: 'Soon',
    featured: false
  }
]

// Calculate tool counts for each persona
personas.forEach(persona => {
  persona.toolCount = tools.filter(tool => tool.persona === persona.id && tool.status === 'live').length
})

// Difficulty badge component
const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors = {
    'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </span>
  )
}

export default function HomePageContent() {
  const searchParams = useSearchParams()
  const [selectedPersona, setSelectedPersona] = useState('all') // Default to show all
  const [searchQuery, setSearchQuery] = useState('')

  // Handle URL params
  useEffect(() => {
    const personaParam = searchParams.get('persona')
    if (personaParam && personas.some(p => p.id === personaParam)) {
      setSelectedPersona(personaParam)
    }
  }, [searchParams])

  const filteredTools = tools.filter(tool => {
    const matchesPersona = selectedPersona === 'all' || tool.persona === selectedPersona
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesPersona && matchesSearch
  })

  const liveTools = tools.filter(tool => tool.status === 'live')
  const featuredTools = tools.filter(tool => tool.featured && tool.status === 'live')

  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400">Free Tools for Developers & Creators</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
          What do you need
          <span className="block text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            to get done today?
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mt-4 max-w-3xl mx-auto">
          Choose your path: Quick fixes, developer tools, or learning resources.
          All tools work instantly in your browser. No signup required.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Lock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">100% Private</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Instant Use</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">5k+ Users</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Free Forever</p>
          </div>
        </div>
      </section>

      {/* Persona Cards Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Choose Your Path</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona.id)}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-105 ${
                selectedPersona === persona.id 
                  ? 'ring-2 ring-cyan-400' 
                  : ''
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${persona.bgColor} opacity-50`}></div>
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${persona.color} rounded-xl flex items-center justify-center text-3xl mb-4`}>
                  {persona.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{persona.title}</h3>
                <p className="text-sm text-cyan-400 mb-3">{persona.tagline}</p>
                <p className="text-gray-400 text-sm mb-4">{persona.description}</p>
                
                <div className="space-y-2 mb-4">
                  {persona.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-300">
                      <ChevronRight className="w-3 h-3 mr-1 text-cyan-400" />
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {persona.toolCount} tools available
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Search and Filter */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col gap-4">
          {/* Search - Full width on mobile */}
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors text-base"
            />
          </div>

          {/* Persona Filter Pills - Horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              <button
                onClick={() => setSelectedPersona('all')}
                className={`px-3 sm:px-4 py-2 rounded-lg border transition-all whitespace-nowrap text-sm sm:text-base ${
                  selectedPersona === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="inline sm:hidden">All ({liveTools.length})</span>
                <span className="hidden sm:inline">All Tools ({liveTools.length})</span>
              </button>
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg border transition-all whitespace-nowrap flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base ${
                    selectedPersona === persona.id
                      ? `bg-gradient-to-r ${persona.color} text-white border-transparent`
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base sm:text-lg">{persona.icon}</span>
                  <span className="hidden sm:inline">{persona.title}</span>
                  <span className="inline sm:hidden">{persona.title.split(' ')[0]}</span>
                  <span className="text-xs opacity-70">({persona.toolCount})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools (when showing all) */}
      {selectedPersona === 'all' && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  ⭐ Featured Tools
                </h2>
                <p className="text-gray-400">
                  Our most popular tools, handpicked for you
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool) => {
                const persona = personas.find(p => p.id === tool.persona)
                return (
                  <Link key={tool.id} href={tool.url} className="group">
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-2xl`}>
                          {tool.icon}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <DifficultyBadge difficulty={tool.difficulty} />
                          <span className="text-xs text-gray-500">{tool.timeToUse}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 flex-1">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${persona?.bgColor} ${persona?.borderColor} border`}>
                            {persona?.icon} {persona?.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{tool.users} users</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tools Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
          {selectedPersona === 'all' 
            ? 'All Available Tools' 
            : `${personas.find(p => p.id === selectedPersona)?.title} Collection`}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTools.map((tool) => {
            const persona = personas.find(p => p.id === tool.persona)
            return (
              <Link
                key={tool.id}
                href={tool.status === 'live' ? tool.url : '#'}
                className={`group ${tool.status !== 'live' ? 'cursor-not-allowed' : ''}`}
              >
                <div className={`bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 transition-all hover:bg-white/10 hover:scale-105 h-full flex flex-col ${
                  tool.status !== 'live' ? 'opacity-60' : ''
                }`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${tool.color} rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl`}>
                      {tool.icon}
                    </div>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs rounded-full ${
                      tool.status === 'live' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tool.status === 'live' ? 'LIVE' : 'SOON'}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-1">
                    {tool.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between">
                      <DifficultyBadge difficulty={tool.difficulty} />
                      <span className="text-xs text-gray-500">{tool.timeToUse}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className={`px-2 py-0.5 sm:py-1 rounded bg-gradient-to-r ${persona?.bgColor}`}>
                        <span className="inline sm:hidden">{persona?.icon}</span>
                        <span className="hidden sm:inline">{persona?.icon} {persona?.title}</span>
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                    <span className="text-xs text-gray-500">
                      {tool.users} users
                    </span>
                    {tool.status === 'live' && (
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No tools found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedPersona('all')
                setSearchQuery('')
              }}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 px-4 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Can't find what you need?
          </h3>
          <p className="text-gray-400 mb-8">
            We're constantly adding new tools based on user feedback. 
            Tell us what would make your work easier.
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
    </>
  )
}