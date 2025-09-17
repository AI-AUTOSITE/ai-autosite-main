// app/components/HomePageContent.tsx
'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Search, 
  ChevronRight, 
  Lock, 
  Clock, 
  Users, 
  Star, 
  TrendingUp, 
  Sparkles,
  Filter,
  X,
  Zap,
  Rocket,
  Trophy,
  Flame
} from 'lucide-react'

import { 
  CATEGORIES, 
  TOOLS, 
  getEnabledCategories,
  getFeaturedTools,
  getToolsByCategory,
  searchTools 
} from '@/lib/categories.config'

// Difficulty badge component with animation
// Difficulty badge component with animation
const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors = {
    // 既存のもの（Dev Tools/Learning Hub用）
    'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500/30',
    // Quick Tools用の新しいバッジ
    'Instant': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Quick': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Simple': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border ${colors[difficulty as keyof typeof colors]} animate-pulse-subtle`}>
      {difficulty}
    </span>
  )
}

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 20}s`
          }}
        >
          <Sparkles className="w-3 h-3 text-cyan-400/20" />
        </div>
      ))}
    </div>
  )
}

// Filter notification component with enhanced animation
const FilterNotification = ({ category, toolCount, onClear }: { 
  category: string | null; 
  toolCount: number;
  onClear: () => void;
}) => {
  const categoryData = category && category !== 'all' ? CATEGORIES.find(c => c.id === category) : null
  
  if (!categoryData) return null
  
  return (
    <div className="animate-bounce-in mb-6">
      <div className="relative bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 animate-gradient-shift"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg animate-pulse-glow">
              <Filter className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Filtering by category</p>
              <p className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl animate-bounce-subtle">{categoryData.icon}</span>
                {categoryData.title}
                <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full animate-shine">
                  {toolCount} tools
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-2 hover:bg-white/10 rounded-lg transition-all group hover:rotate-90"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Success animation component
const SuccessRipple = ({ trigger }: { trigger: boolean }) => {
  if (!trigger) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-ripple bg-cyan-500/20 rounded-full w-96 h-96"></div>
    </div>
  )
}

export default function HomePageContent() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [previousCategory, setPreviousCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  // Get enabled categories from config
  const enabledCategories = getEnabledCategories()
  
  // Handle URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
      handleCategoryChange(categoryParam)
    }
  }, [searchParams])

  // Filter tools based on selection and search
  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
                          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch && tool.status === 'live'
  })

  const liveTools = TOOLS.filter(tool => tool.status === 'live')
  const featuredTools = getFeaturedTools()

  // Handle category change with animation
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === selectedCategory) return
    
    setPreviousCategory(selectedCategory)
    setIsTransitioning(true)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 600)
    
    // Start fade out
    setTimeout(() => {
      startTransition(() => {
        setSelectedCategory(newCategory)
        
        // Update URL without page reload
        const url = new URL(window.location.href)
        if (newCategory === 'all') {
          url.searchParams.delete('category')
        } else {
          url.searchParams.set('category', newCategory)
        }
        window.history.pushState({}, '', url)
        
        // Smooth scroll to tools section
        const toolsSection = document.getElementById('tools-grid')
        if (toolsSection) {
          const yOffset = -100
          const y = toolsSection.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      })
      
      // Start fade in
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 200)
  }

  // Clear filter
  const clearFilter = () => {
    handleCategoryChange('all')
    setSearchQuery('')
  }

  return (
    <>
      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) translateX(10px) rotate(120deg);
          }
          66% {
            transform: translateY(20px) translateX(-10px) rotate(240deg);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            transform: scale(1.05) translateY(10px);
          }
          70% {
            transform: scale(0.9) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
        
        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.8);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes card-float {
          0%, 100% {
            transform: translateY(0) rotateX(0) rotateY(0);
          }
          50% {
            transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
          }
        }
        
        @keyframes explosion {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 3s ease forwards;
          background-size: 200% 200%;
        }
        .animate-gradient-shift-once {
  animation: gradient-shift 4s ease-out forwards;
  background-size: 200% 200%;
}
        .animate-shine {
          background: linear-gradient(90deg, 
            rgba(6, 182, 212, 0.2) 0%,
            rgba(6, 182, 212, 0.4) 50%,
            rgba(6, 182, 212, 0.2) 100%);
          background-size: 200% 100%;
          animation: shine 2s linear infinite;
        }
        
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        .animate-card-float:hover {
          animation: card-float 2s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        
        .hover-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s;
        }
        
        .hover-3d:hover {
          transform: perspective(1000px) rotateX(10deg) rotateY(-10deg) scale(1.05);
        }
        
        .particle {
          filter: blur(1px);
        }
      `}</style>

      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Success ripple effect */}
      <SuccessRipple trigger={showSuccess} />

      {/* Hero Section with enhanced animations */}
      <section className="relative z-10 text-center py-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 mb-6 animate-bounce-in">
          <Rocket className="w-4 h-4 text-cyan-400 animate-bounce-subtle" />
          <span className="text-sm text-cyan-400">Free Tools for Developers & Creators</span>
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 animate-slide-up">
  What do you need
  <span className="block text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto] leading-relaxed pb-1">
    to get done today?
  </span>
</h1>
        <p className="text-lg sm:text-xl text-gray-400 mt-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Choose your path: Quick fixes, developer tools, or learning resources.
          All tools work instantly in your browser. No signup required.
        </p>

        {/* Quick Stats with hover animations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {[
            { icon: Lock, color: 'text-cyan-400', label: '100% Private' },
            { icon: Clock, color: 'text-yellow-400', label: 'Instant Use' },
            { icon: Users, color: 'text-green-400', label: '5k+ Users' },
            { icon: Star, color: 'text-purple-400', label: 'Free Forever' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover-3d hover:bg-white/10 transition-all animate-slide-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2 animate-bounce-subtle`} />
              <p className="text-sm text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Cards Section with 3D effects */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center animate-slide-up">
          Choose Your Path
        </h2>
        
        <div className={`grid gap-6 ${
          enabledCategories.length === 2 ? 'md:grid-cols-2' : 
          enabledCategories.length === 3 ? 'md:grid-cols-3' : 
          enabledCategories.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 
          'md:grid-cols-3'
        }`}>
          {enabledCategories.map((category, index) => {
            const categoryTools = getToolsByCategory(category.id)
            const liveToolsCount = categoryTools.filter(t => t.status === 'live').length
            const isSelected = selectedCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-105 hover-3d animate-slide-up ${
                  isSelected 
                    ? 'ring-2 ring-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-2xl shadow-cyan-500/20' 
                    : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} ${
                  isSelected ? 'opacity-70' : 'opacity-50'
                } transition-opacity`}></div>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-gradient-shift"></div>
                </div>
                
                <div className="relative">
                  {/* Badge for new/coming categories */}
                  {category.badge && (
                    <span className="absolute top-0 right-0 px-2 py-1 text-xs bg-yellow-500 text-black rounded-lg font-bold animate-pulse">
                      {category.badge}
                    </span>
                  )}
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-3xl mb-4 ${
                    isSelected ? 'scale-110 animate-bounce-subtle' : ''
                  } transition-transform group-hover:rotate-12`}>
                    {category.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                  <p className="text-sm text-cyan-400 mb-3">{category.tagline}</p>
                  <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {category.benefits.map((benefit, index) => (
                      <div 
                        key={index} 
                        className="flex items-center text-xs text-gray-300 animate-slide-up"
                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                      >
                        <ChevronRight className="w-3 h-3 mr-1 text-cyan-400" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm transition-all ${
                      isSelected ? 'text-cyan-400 font-semibold' : 'text-gray-500'
                    }`}>
                      {liveToolsCount} tools available
                    </span>
                    <ChevronRight className={`w-5 h-5 transition-all ${
                      isSelected 
                        ? 'text-cyan-400 translate-x-1' 
                        : 'text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1'
                    }`} />
                  </div>
                  
                  {/* Selected indicator with glow */}
                  {isSelected && (
                    <>
                      <div className="absolute inset-0 border-2 border-cyan-400 rounded-2xl animate-pulse pointer-events-none"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-20 animate-pulse pointer-events-none"></div>
                    </>
                  )}
                </div>
              </button>
            )
          })}
          
          {/* Coming Soon Categories Preview */}
          {CATEGORIES.filter(c => !c.enabled).length > 0 && (
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gray-900/50 border-2 border-dashed border-gray-700 animate-slide-up" style={{ animationDelay: `${enabledCategories.length * 50}ms` }}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-3xl mb-4 mx-auto animate-bounce-subtle">
                  ➕
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">More Coming Soon</h3>
                <p className="text-sm text-gray-500">
                  New categories including Study Tools, Business Tools, and more
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filter with enhanced animations */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search with glow effect */}
          <div className="relative w-full sm:w-auto sm:min-w-[300px] sm:max-w-md group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all text-base"
            />
          </div>

          {/* Category Filter Pills with enhanced hover */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2.5 rounded-xl border transition-all text-sm font-medium hover-3d ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent scale-105 shadow-lg shadow-cyan-500/25 animate-pulse-glow'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>All Tools</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === 'all' 
                    ? 'bg-white/20 text-white animate-shine' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {liveTools.length}
                </span>
              </span>
            </button>
            
            {enabledCategories.map((category) => {
              const categoryTools = getToolsByCategory(category.id)
              const liveCount = categoryTools.filter(t => t.status === 'live').length
              const isSelected = selectedCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2.5 rounded-xl border transition-all text-sm font-medium hover-3d ${
                    isSelected
                      ? `bg-gradient-to-r ${category.color} text-white border-transparent scale-105 shadow-lg animate-pulse-glow`
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`text-lg ${isSelected ? 'animate-bounce-subtle' : ''}`}>{category.icon}</span>
                    <span className="whitespace-nowrap">{category.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isSelected 
                        ? 'bg-white/20 text-white animate-shine' 
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {liveCount}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filter Notification with enhanced animation */}
      {selectedCategory !== 'all' && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilterNotification 
            category={selectedCategory}
            toolCount={filteredTools.length}
            onClear={clearFilter}
          />
        </section>
      )}

      {/* Featured Tools with 3D cards */}
      {selectedCategory === 'all' && featuredTools.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-shift-once"></div>
</div>
            
            <div className="relative flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-yellow-400 animate-bounce-subtle" />
                  Featured Tools
                </h2>
                <p className="text-gray-400">
                  Our most popular tools, handpicked for you
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool, index) => {
                const category = CATEGORIES.find(c => c.id === tool.category)
                return (
                  <Link 
                    key={tool.id} 
                    href={tool.url} 
                    className="group animate-slide-up hover-3d"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onMouseEnter={() => setHoveredTool(tool.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                  >
                    <div className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all h-full flex flex-col hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                      hoveredTool === tool.id ? 'animate-pulse-glow' : ''
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform`}>
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
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tool.timeToUse}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {tool.users}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tools Grid with staggered animations */}
      <section id="tools-grid" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          {selectedCategory === 'all' 
            ? 'All Available Tools' 
            : `${CATEGORIES.find(c => c.id === selectedCategory)?.title} Collection`}
        </h2>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-all ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          {filteredTools.map((tool, index) => {
            const category = CATEGORIES.find(c => c.id === tool.category)
            return (
              <Link
                key={tool.id}
                href={tool.status === 'live' ? tool.url : '#'}
                className={`group ${tool.status !== 'live' ? 'cursor-not-allowed' : ''} animate-slide-up hover-3d`}
                style={{ animationDelay: `${index * 30}ms` }}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <div className={`bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 transition-all hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10 h-full flex flex-col ${
                  tool.status !== 'live' ? 'opacity-60' : ''
                } ${hoveredTool === tool.id ? 'animate-pulse-glow' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${tool.color} rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl group-hover:rotate-12 transition-transform`}>
                      {tool.icon}
                    </div>
                    <div className="flex items-end gap-1">
                      {tool.new && (
                        <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                          NEW
                        </span>
                      )}
                      {tool.apiRequired && (
                        <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                          AI
                        </span>
                      )}
                      {!tool.new && !tool.apiRequired && tool.status === 'live' && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full animate-pulse-subtle">
                          LIVE
                        </span>
                      )}
                    </div>
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
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tool.timeToUse}
                      </span>
                    </div>
                    {category && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className={`px-2 py-0.5 sm:py-1 rounded bg-gradient-to-r ${category.bgColor}`}>
                          <span className="inline sm:hidden">{category.icon}</span>
                          <span className="hidden sm:inline">{category.icon} {category.title}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {tool.users}
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

        {/* Empty State with animation */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20 animate-bounce-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 animate-pulse-glow">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4 text-lg">No tools found matching your criteria.</p>
            <button
              onClick={clearFilter}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* CTA Section with animation */}
      <section className="relative z-10 py-16 px-4 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4 animate-slide-up">
            Can't find what you need?
          </h3>
          <p className="text-gray-400 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            We're constantly adding new tools based on user feedback. 
            Tell us what would make your work easier.
          </p>
          <Link
            href="/request"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 animate-slide-up hover-3d"
            style={{ animationDelay: '0.2s' }}
          >
            <Rocket className="w-5 h-5 animate-bounce-subtle" />
            <span>Request a Tool</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}