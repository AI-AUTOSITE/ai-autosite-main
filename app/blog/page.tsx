'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Clock, 
  ArrowRight, 
  Star, 
  Sparkles, 
  TrendingUp,
  Filter,
  X,
  MousePointer2,
  Search,
  BookOpen
} from 'lucide-react'
import { blogCategories } from '@/lib/blog-config'
import { getPostsByCategory, getPostCount } from '@/lib/blog-posts'
import { getGridClassName, getCardPaddingClass, getIconSizeClass } from '@/lib/grid-utils'

// Badge types for articles
const BADGE_TYPES = {
  featured: {
    label: 'Featured',
    icon: '⭐',
    className: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black',
    cardBorder: 'hover:border-amber-500/30',
    iconColor: 'text-amber-400',
    glowEffect: 'hover:shadow-amber-500/20'
  },
  new: {
    label: 'New',
    icon: '🆕',
    className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    cardBorder: 'hover:border-green-500/30',
    iconColor: 'text-green-400',
    glowEffect: 'hover:shadow-green-500/20'
  },
  popular: {
    label: 'Popular',
    icon: '🔥',
    className: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
    cardBorder: 'hover:border-orange-500/30',
    iconColor: 'text-orange-400',
    glowEffect: 'hover:shadow-orange-500/20'
  }
}

const getPostBadge = (post: any) => {
  if (post.featured) return 'featured'
  if (post.publishDate === 'January 2025') return 'new'
  if (post.id === 'choosing-the-right-tech-stack' || post.id === 'ai-dev-dictionary') return 'popular'
  return null
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showPosts, setShowPosts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visiblePostsCount, setVisiblePostsCount] = useState(6)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const categories = blogCategories.map(cat => ({
    ...cat,
    count: getPostCount(cat.id)
  }))

  const filteredPosts = selectedCategory ? getPostsByCategory(selectedCategory).filter(post => {
    if (searchQuery === '') return true
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.description.toLowerCase().includes(searchQuery.toLowerCase())
  }) : []

  const scrollToCategory = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setSelectedCategory(categoryId)
      setShowPosts(true)
      setVisiblePostsCount(6)
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }

  const clearSelection = () => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setSelectedCategory(null)
      setShowPosts(false)
      setSearchQuery('')
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }

  const loadMorePosts = () => {
    setVisiblePostsCount(prev => prev + 6)
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 py-12 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Show either categories OR posts, never both */}
      {!showPosts ? (
        /* === CATEGORY SELECTION VIEW === */
        <>
          {/* Hero Section */}
          <section className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 mb-6">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">Knowledge Hub • Guides & Tutorials</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Our
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Knowledge Hub
              </span>
            </h1>
            
            <p className="text-gray-400 mt-4 flex items-center justify-center gap-2">
              <MousePointer2 className="w-4 h-4" />
              Select a category to explore articles
            </p>
          </section>

          {/* Category Grid */}
          <section className="mb-8">
            {/* Mobile Scroll View */}
            {isMobile ? (
              <div className="relative">
                {categories.length > 3 && (
                  <button
                    onClick={() => scrollToCategory('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/80 rounded-full backdrop-blur-sm"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                )}

                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto scrollbar-hide px-8"
                >
                  <div className="flex gap-3 pb-2">
                    {categories.map(cat => {
                      const Icon = cat.icon
                      const postCount = cat.count
                      
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className="flex-shrink-0 flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all bg-white/10 text-gray-300 hover:bg-white/15"
                        >
                          <Icon className="w-5 h-5" />
                          <div className="text-center">
                            <p className="text-sm font-medium">{cat.shortName}</p>
                            <p className="text-xs opacity-70">({postCount} posts)</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {categories.length > 3 && (
                  <button
                    onClick={() => scrollToCategory('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/80 rounded-full backdrop-blur-sm"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            ) : (
              /* Desktop Grid View - Dynamic columns */
              <div className={`grid gap-4 ${getGridClassName(categories.length)}`}>
                {categories.map(cat => {
                  const Icon = cat.icon
                  const postCount = cat.count
                  const paddingClass = getCardPaddingClass(categories.length)
                  const iconSizeClass = getIconSizeClass(categories.length)
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`
                        relative ${paddingClass} rounded-xl transition-all hover:scale-105 
                        flex flex-col items-center justify-center min-h-[180px]
                        bg-white/5 hover:bg-white/10 border border-white/10
                        group cursor-pointer
                      `}
                    >
                      <Icon className={`${iconSizeClass} mb-3 group-hover:scale-110 transition-transform`} />
                      <h3 className="font-semibold text-white mb-1 text-center">{cat.name}</h3>
                      <p className={`text-xs bg-gradient-to-r ${cat.color} bg-clip-text text-transparent mb-2 text-center`}>
                        {cat.description}
                      </p>
                      <p className="text-xs text-gray-400 text-center">{postCount} articles</p>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {/* Quick Stats */}
          <section className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-cyan-400">
                    {categories.reduce((sum, cat) => sum + cat.count, 0)}
                  </p>
                  <p className="text-xs text-gray-400">Total Articles</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-400">
                    {categories.length}
                  </p>
                  <p className="text-xs text-gray-400">Categories</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-400">Free</p>
                  <p className="text-xs text-gray-400">Forever</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* === POSTS VIEW === */
        <>
          {/* Breadcrumb / Back Navigation */}
          <section className="mb-6">
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </button>
          </section>

          {/* Selected Category Header */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">
                  {categories.find(c => c.id === selectedCategory)?.icon && 
                    React.createElement(categories.find(c => c.id === selectedCategory)!.icon, { className: 'w-12 h-12' })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-400">
                    {categories.find(c => c.id === selectedCategory)?.description}
                  </p>
                  <p className="text-sm text-cyan-400 mt-1">
                    {filteredPosts.length} articles available
                  </p>
                </div>
              </div>

              {/* Search within category */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search within ${categories.find(c => c.id === selectedCategory)?.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </section>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <section>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.slice(0, visiblePostsCount).map((post, index) => {
                  const PostIcon = post.icon
                  const badgeType = getPostBadge(post)
                  const badge = badgeType ? BADGE_TYPES[badgeType as keyof typeof BADGE_TYPES] : null
                  
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="group"
                    >
                      <article className={`
                        h-full bg-white/5 rounded-xl p-5
                        border border-white/10
                        transition-all duration-200
                        flex flex-col
                        relative
                        hover:bg-white/10 hover:scale-105
                        ${badge ? `${badge.cardBorder} ${badge.glowEffect} hover:shadow-lg` : 'hover:border-cyan-400/30'}
                      `}>
                        {/* Badge */}
                        {badge && (
                          <div className={`absolute -top-2 -right-2 ${badge.className} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg`}>
                            <span>{badge.icon}</span>
                            <span>{badge.label}</span>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <PostIcon className={`w-5 h-5 ${badge ? badge.iconColor : 'text-cyan-400'}`} />
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h3 className={`font-semibold mb-2 transition-colors line-clamp-2 ${
                          badge ? `text-white group-hover:${badge.iconColor}` : 'text-white group-hover:text-cyan-400'
                        }`}>
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                          {post.description}
                        </p>
                        
                        {post.relatedTool && (
                          <div className="pt-3 mt-auto border-t border-white/5">
                            <span className="text-xs text-gray-500">Related tool:</span>
                            <p className={`text-xs truncate ${badge ? badge.iconColor : 'text-cyan-400'}`}>
                              {post.relatedTool.name}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-400 group-hover:text-gray-300 mt-3">
                          <span>Read article</span>
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>

              {/* Load More Button */}
              {visiblePostsCount < filteredPosts.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMorePosts}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-all"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Show More ({filteredPosts.length - visiblePostsCount} remaining)
                  </button>
                </div>
              )}
            </section>
          ) : (
            /* Empty State */
            <section className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 mb-4">No articles found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all"
              >
                Clear search
              </button>
            </section>
          )}

          {/* CTA Section */}
          <section className="mt-12 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-all"
            >
              Try Our Tools
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </section>
        </>
      )}
    </div>
  )
}