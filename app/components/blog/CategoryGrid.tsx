import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BlogCategory } from '@/lib/blog-config'
import { getPostCount } from '@/lib/blog-posts'
import { getGridClassName, getCardPaddingClass, getIconSizeClass } from '@/lib/grid-utils'

interface CategoryWithCount extends BlogCategory {
  count: number
}

interface CategoryGridProps {
  categories: BlogCategory[]
  onSelectCategory: (categoryId: string) => void
  isMobile: boolean
}

// Mobile scroll view component
function CategoryMobileScroll({ 
  categories, 
  onSelectCategory 
}: { 
  categories: CategoryWithCount[]
  onSelectCategory: (categoryId: string) => void 
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const scrollToCategory = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
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
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' // iOS対応
        } as React.CSSProperties}
      >
        <div className="flex gap-3 pb-2">
          {categories.map(cat => {
            const Icon = cat.icon
            
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex-shrink-0 flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all bg-white/10 text-gray-300 hover:bg-white/15"
              >
                <Icon className="w-5 h-5" />
                <div className="text-center">
                  <p className="text-sm font-medium">{cat.shortName}</p>
                  <p className="text-xs opacity-70">({cat.count} posts)</p>
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
  )
}

// Desktop grid view component
function CategoryDesktopGrid({ 
  categories, 
  onSelectCategory 
}: { 
  categories: CategoryWithCount[]
  onSelectCategory: (categoryId: string) => void 
}) {
  const gridClassName = getGridClassName(categories.length)
  const paddingClass = getCardPaddingClass(categories.length)
  const iconSizeClass = getIconSizeClass(categories.length)

  return (
    <div className={`grid gap-4 ${gridClassName}`}>
      {categories.map(cat => {
        const Icon = cat.icon
        
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
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
            <p className="text-xs text-gray-400 text-center">{cat.count} articles</p>
          </button>
        )
      })}
    </div>
  )
}

// Main CategoryGrid component
export function CategoryGrid({ categories, onSelectCategory, isMobile }: CategoryGridProps) {
  const categoriesWithCount: CategoryWithCount[] = categories.map(cat => ({
    ...cat,
    count: getPostCount(cat.id)
  }))

  if (isMobile) {
    return <CategoryMobileScroll categories={categoriesWithCount} onSelectCategory={onSelectCategory} />
  }

  return <CategoryDesktopGrid categories={categoriesWithCount} onSelectCategory={onSelectCategory} />
}