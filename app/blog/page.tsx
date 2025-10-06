'use client'
import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { BookOpen, MousePointer2, Search, ChevronLeft, ChevronDown, ArrowRight } from 'lucide-react'
import { blogCategories } from '@/lib/blog-config'
import { getPostsByCategory, getPostCount } from '@/lib/blog-posts'
import { getPostBadge, BADGE_TYPES, searchPosts } from '@/lib/blog-utils'
// Import separated components
import { CategoryGrid } from '@/components/blog/CategoryGrid'
import { BlogPostCard } from '../components/blog/BlogPostCard'
import { BlogStats } from '../components/blog/BlogStats'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showPosts, setShowPosts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visiblePostsCount, setVisiblePostsCount] = useState(6)

  // Check mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalArticles = blogCategories.reduce((sum, cat) => sum + getPostCount(cat.id), 0)
    return {
      totalArticles,
      categoriesCount: blogCategories.length,
    }
  }, [])

  // Get and filter posts
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return []
    const posts = getPostsByCategory(selectedCategory)
    return searchQuery ? searchPosts(posts, searchQuery) : posts
  }, [selectedCategory, searchQuery])

  // Handle category selection with transition
  const handleCategorySelect = (categoryId: string) => {
    setIsTransitioning(true)

    setTimeout(() => {
      setSelectedCategory(categoryId)
      setShowPosts(true)
      setVisiblePostsCount(6)
      setIsTransitioning(false)
    }, 300)
  }

  // Clear selection and reset
  const clearSelection = () => {
    setIsTransitioning(true)

    setTimeout(() => {
      setSelectedCategory(null)
      setShowPosts(false)
      setSearchQuery('')
      setIsTransitioning(false)
    }, 300)
  }

  const loadMorePosts = () => setVisiblePostsCount((prev) => prev + 6)

  const selectedCategoryData = blogCategories.find((c) => c.id === selectedCategory)

  return (
    <div
      className={`max-w-6xl mx-auto px-4 py-12 transition-all duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
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

          {/* Category Grid Component */}
          <CategoryGrid
            categories={blogCategories}
            onSelectCategory={handleCategorySelect}
            isMobile={isMobile}
          />

          {/* Statistics Component */}
          <BlogStats
            totalArticles={stats.totalArticles}
            categories={stats.categoriesCount}
            isFree={true}
          />
        </>
      ) : (
        /* === POSTS VIEW === */
        <>
          {/* Back Navigation */}
          <section className="mb-6">
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </button>
          </section>

          {/* Category Header with Search */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6">
              <div className="flex items-center gap-4 mb-4">
                {selectedCategoryData && (
                  <>
                    <selectedCategoryData.icon className="w-12 h-12" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedCategoryData.name}</h2>
                      <p className="text-gray-400">{selectedCategoryData.description}</p>
                      <p className="text-sm text-cyan-400 mt-1">
                        {filteredPosts.length} articles available
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search within ${selectedCategoryData?.name}...`}
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
                {filteredPosts.slice(0, visiblePostsCount).map((post) => {
                  const badgeType = getPostBadge(post)
                  const badge = badgeType ? BADGE_TYPES[badgeType] : null

                  return <BlogPostCard key={post.id} post={post} badge={badge} />
                })}
              </div>

              {/* Load More */}
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

          {/* CTA */}
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
