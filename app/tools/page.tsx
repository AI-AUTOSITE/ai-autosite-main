'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Code2, Layers, Shield, Search, Github, 
  ExternalLink, Clock, Lock, Zap, Star,
  ArrowRight, CheckCircle, Sparkles
} from 'lucide-react'

// Tool data
const tools = [
  {
    id: 'code-reader',
    name: 'Code Dependency Visualizer',
    description: 'Analyze and visualize your project structure with dependency mapping and file relationships',
    icon: Code2,
    href: '/tools/code-reader',
    status: 'coming-soon',
    features: [
      'GitHub/Local file support',
      'Dependency tree visualization',
      'Export to Claude AI',
      'Real-time analysis'
    ],
    tags: ['Development', 'Analysis', 'AI-Ready'],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'tech-stack',
    name: 'Tech Stack Analyzer',
    description: 'Compare frontend frameworks and get AI-powered recommendations for your project',
    icon: Layers,
    href: '/tools/tech-stack-analyzer',
    status: 'live',
    features: [
      'Framework comparison',
      'Use-case recommendations',
      'Learning curve analysis',
      'Community insights'
    ],
    tags: ['Frameworks', 'Guide', 'Comparison'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'blurtap',
    name: 'BlurTap Privacy Tool',
    description: 'Mask sensitive information in images with complete privacy - all processing stays local',
    icon: Shield,
    href: '/tools/blurtap',
    status: 'live',
    features: [
      '100% local processing',
      'Click or drag masking',
      'Multiple export formats',
      'No data upload'
    ],
    tags: ['Privacy', 'Security', 'Local'],
    color: 'from-green-500 to-emerald-500'
  }
]

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // Get all unique tags
  const allTags = Array.from(new Set(tools.flatMap(tool => tool.tags)))
  
  // Filter tools based on search and tag
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || tool.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          AI-Powered Developer Tools
          <span className="block text-2xl sm:text-3xl mt-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Completely Free • No Limitations • Open Source
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
          Professional development tools built with transparency and privacy in mind. 
          No signup required, no data stored, just powerful tools that work.
        </p>
        
        {/* Key Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">100% Private</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">Instant Access</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
            <Github className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Open Source</span>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
          />
        </div>
        
        {/* Tag Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-lg transition-all ${
              !selectedTag 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            All Tools
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTag === tag 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTools.map((tool) => {
          const Icon = tool.icon
          return (
            <div
              key={tool.id}
              className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {tool.status === 'live' ? (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">Live</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">Coming Soon</span>
                  </span>
                )}
              </div>
              
              {/* Tool Content */}
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{tool.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{tool.description}</p>
                  </div>
                </div>
                
                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {tool.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Action Button */}
                <Link
                  href={tool.href}
                  className={`
                    flex items-center justify-center space-x-2 w-full py-3 rounded-lg
                    font-medium transition-all duration-200
                    ${tool.status === 'live' 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30' 
                      : 'bg-white/5 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span>{tool.status === 'live' ? 'Launch Tool' : 'Coming Soon'}</span>
                  {tool.status === 'live' && <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
              
              {/* Hover Effect Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </div>
          )
        })}
      </div>
      
      {/* Coming Soon Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">More Tools Coming Soon</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          We're constantly building new tools to help developers work more efficiently. 
          All tools will remain free and open source.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com/ai-autosite"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-gray-300"
          >
            <Github className="w-5 h-5" />
            <span>View on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="mailto:aiautosite@gmail.com"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 rounded-lg transition-all text-white border border-cyan-500/30"
          >
            <Star className="w-5 h-5" />
            <span>Request a Tool</span>
          </a>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}