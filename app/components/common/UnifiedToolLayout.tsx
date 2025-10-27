// app/components/common/UnifiedToolLayout.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Info } from 'lucide-react'
import type { Tool, Category } from '../../lib/categories'
import { TOOLS, CATEGORIES } from '../../lib/categories'
import ToolInfoSidebar from './ToolInfoSidebar'
import RelatedTools from './RelatedTools'

interface UnifiedToolLayoutProps {
  children: ReactNode
  toolId?: string
  showToolInfo?: boolean
  showSidebar?: boolean
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

// ヘルパー関数：URLからツールを取得
function getToolByUrl(url: string): Tool | undefined {
  return TOOLS.find((tool) => tool.url === url)
}

// ヘルパー関数：カテゴリーIDからカテゴリーを取得
function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === categoryId)
}

export default function UnifiedToolLayout({
  children,
  toolId,
  showToolInfo = true,
  showSidebar = true,
  containerWidth = 'xl',
}: UnifiedToolLayoutProps) {
  const pathname = usePathname()
  const [tool, setTool] = useState<Tool | undefined>()
  const [category, setCategory] = useState<Category | undefined>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Get tool info from URL or toolId
    const currentTool = toolId ? getToolByUrl(`/tools/${toolId}`) : getToolByUrl(pathname)

    if (currentTool) {
      setTool(currentTool)
      const cat = getCategoryById(currentTool.category)
      setCategory(cat)
    }
  }, [pathname, toolId])

  // Container width classes
  const containerClasses = {
    sm: 'max-w-sm',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[1600px]',
    full: 'max-w-full',
  }

  // Type guard to ensure category has required properties
  const isValidCategory = (cat: Category | undefined): cat is Category => {
    return cat !== undefined
  }

  return (
    <div className={`${containerClasses[containerWidth]} mx-auto px-4 py-8`}>
      {/* Mobile menu button for sidebar */}
      {showSidebar && tool && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-cyan-500 text-white rounded-full p-3 shadow-lg hover:bg-cyan-600 transition-colors"
          aria-label="Toggle tool information"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Info className="w-6 h-6" />}
        </button>
      )}

      {/* Tool header */}
      {tool && (
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{tool.name}</h1>
          {tool.description && <p className="text-lg text-gray-400">{tool.description}</p>}
        </div>
      )}

      {/* Main layout with optional sidebar */}
      <div className={`flex gap-8 ${showSidebar && tool ? 'lg:flex-row flex-col' : ''}`}>
        {/* Main content area */}
        <div className="flex-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
            {children}
          </div>

          {/* Related tools (when no sidebar) - with type guard */}
          {tool && isValidCategory(category) && !showSidebar && (
            <div className="mt-8">
              <RelatedTools currentTool={tool} category={category} />
            </div>
          )}
        </div>

        {/* Desktop sidebar - with type guard */}
        {showSidebar && showToolInfo && tool && isValidCategory(category) && (
          <aside className="hidden lg:block lg:w-80">
            <ToolInfoSidebar tool={tool} category={category} />
          </aside>
        )}

        {/* Mobile sidebar overlay - with type guard */}
        {showSidebar && showToolInfo && tool && isValidCategory(category) && isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 p-4 overflow-y-auto">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="mt-12">
                <ToolInfoSidebar tool={tool} category={category} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related tools (with sidebar) - with type guard */}
      {tool && isValidCategory(category) && showSidebar && (
        <div className="mt-8">
          <RelatedTools currentTool={tool} category={category} />
        </div>
      )}
    </div>
  )
}