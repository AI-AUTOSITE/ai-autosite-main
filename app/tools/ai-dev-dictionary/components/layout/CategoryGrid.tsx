// app/tools/ai-dev-dictionary/components/core/CategoryGrid.tsx
'use client'

import { techTerms } from '../../lib/terms'
import { Category } from '../../lib/terms/categories'
import { 
  Component, 
  Layout, 
  Database, 
  Edit3, 
  Navigation, 
  MessageCircle, 
  Zap,
  ArrowRight
} from 'lucide-react'

interface CategoryGridProps {
  categories: Category[]
  onSelectCategory: (categoryId: string) => void
}

export default function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  // 各カテゴリーの用語数を計算
  const getCategoryCount = (categoryId: string) => {
    return techTerms.filter(term => term.category === categoryId).length
  }

  // Lucideアイコンマッピング
  const getIcon = (categoryId: string) => {
    const icons: Record<string, JSX.Element> = {
      'ui-components': <Component className="w-8 h-8" />,
      'data-display': <Database className="w-8 h-8" />,
      'forms': <Edit3 className="w-8 h-8" />,
      'layout': <Layout className="w-8 h-8" />,
      'navigation': <Navigation className="w-8 h-8" />,
      'feedback': <MessageCircle className="w-8 h-8" />,
      'advanced': <Zap className="w-8 h-8" />
    }
    return icons[categoryId]
  }

  // カテゴリーごとのスタイル
  const getCategoryStyle = (categoryId: string) => {
    const styles: Record<string, {
      gradient: string
      border: string
      icon: string
      badge: string
    }> = {
      'ui-components': {
        gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
        border: 'border-cyan-500/20 hover:border-cyan-400/50',
        icon: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300'
      },
      'data-display': {
        gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
        border: 'border-blue-500/20 hover:border-blue-400/50',
        icon: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300'
      },
      'forms': {
        gradient: 'from-yellow-500/10 via-yellow-500/5 to-transparent',
        border: 'border-yellow-500/20 hover:border-yellow-400/50',
        icon: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-300'
      },
      'layout': {
        gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
        border: 'border-purple-500/20 hover:border-purple-400/50',
        icon: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-300'
      },
      'navigation': {
        gradient: 'from-green-500/10 via-green-500/5 to-transparent',
        border: 'border-green-500/20 hover:border-green-400/50',
        icon: 'text-green-400',
        badge: 'bg-green-500/20 text-green-300'
      },
      'feedback': {
        gradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
        border: 'border-pink-500/20 hover:border-pink-400/50',
        icon: 'text-pink-400',
        badge: 'bg-pink-500/20 text-pink-300'
      },
      'advanced': {
        gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
        border: 'border-orange-500/20 hover:border-orange-400/50',
        icon: 'text-orange-400',
        badge: 'bg-orange-500/20 text-orange-300'
      }
    }
    return styles[categoryId] || {
      gradient: 'from-gray-500/10 via-gray-500/5 to-transparent',
      border: 'border-gray-500/20',
      icon: 'text-gray-400',
      badge: 'bg-gray-500/20 text-gray-300'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.filter(cat => cat.id !== 'all').map((category) => {
        const count = getCategoryCount(category.id)
        const style = getCategoryStyle(category.id)
        const icon = getIcon(category.id)
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl 
                     border-2 ${style.border} transition-all duration-300 
                     hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50
                     overflow-hidden`}
          >
            {/* 背景グラデーション */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} 
                          opacity-60 group-hover:opacity-100 transition-opacity`} />
            
            {/* コンテンツ */}
            <div className="relative p-6">
              {/* アイコンと用語数の行 */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-black/20 rounded-xl ${style.icon} 
                              group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                  {count} terms
                </span>
              </div>
              
              {/* カテゴリー名 */}
              <h3 className="text-xl font-bold text-white mb-2 text-left">
                {category.name.replace('&', '\n&')}
              </h3>
              
              {/* 説明 */}
              <p className="text-sm text-gray-400 text-left line-clamp-2 mb-4">
                {category.description || `Explore ${count} ${category.name.toLowerCase()} components`}
              </p>
              
              {/* View Termsリンク */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Click to explore</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white 
                                    group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}