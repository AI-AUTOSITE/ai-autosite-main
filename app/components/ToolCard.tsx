// app/components/ToolCard.tsx
'use client'

import Link from 'next/link'
import { Clock, ArrowRight, Sparkles, Zap } from 'lucide-react'

// ========================================
// Type Definitions
// ========================================
interface ToolCardProps {
  tool: {
    id: string
    name: string
    description: string
    url: string
    emoji?: string
    icon?: string
    timeToUse?: string
    featured?: boolean
    new?: boolean
    status?: string
    badge?: string
    [key: string]: any
  }
  variant?: 'default' | 'compact' | 'featured'
}

// ========================================
// Unified Tool Card Component
// Responsive: Mobile → Tablet → Laptop → Desktop
// ========================================
export default function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  return (
    <Link
      href={tool.url || `/tools/${tool.id}`}
      className="group relative bg-white/5 backdrop-blur-xl rounded-2xl 
                 border border-white/10 hover:border-white/20 hover:bg-white/10
                 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10
                 hover:-translate-y-1 overflow-hidden flex flex-col h-full items-start
                 p-4 sm:p-5 md:p-6"
    >
      {/* Badge Container - Responsive positioning */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5 sm:gap-2 z-10">
        {tool.featured && (
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 
                         bg-purple-500/20 backdrop-blur-sm 
                         border border-purple-500/30 text-purple-300 
                         text-[10px] sm:text-xs font-semibold rounded-full 
                         flex items-center gap-0.5 sm:gap-1">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Featured</span>
            <span className="sm:hidden">★</span>
          </span>
        )}
        {tool.new && (
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 
                         bg-cyan-500/20 backdrop-blur-sm 
                         border border-cyan-500/30 text-cyan-300 
                         text-[10px] sm:text-xs font-semibold rounded-full 
                         flex items-center gap-0.5 sm:gap-1">
            <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">New</span>
            <span className="sm:hidden">N</span>
          </span>
        )}
        {tool.badge && (
          <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 backdrop-blur-sm 
                         text-[10px] sm:text-xs font-semibold rounded-full
                         ${
                           tool.badge === 'AI' 
                             ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                             : tool.badge === 'HOT'
                             ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300'
                             : 'bg-gray-500/20 border border-gray-500/30 text-gray-300'
                         }`}>
            {tool.badge}
          </span>
        )}
      </div>

      {/* Card Content - Same structure as CategoryCard */}
      <div className="relative z-10 flex flex-col flex-1 items-start w-full">
        {/* Icon - Same spacing as CategoryCard */}
        <div className="mb-3 sm:mb-4 w-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                        rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 
                        border border-white/5
                        text-2xl sm:text-3xl md:text-4xl
                        flex items-center justify-center
                        transition-transform group-hover:scale-110">
            <span className="block">{tool.emoji || tool.icon || '🔧'}</span>
          </div>
        </div>

        {/* Title - Same spacing as CategoryCard */}
        <h3 className="block w-full text-base sm:text-lg md:text-xl font-bold text-white 
                     mb-2 line-clamp-1 group-hover:text-cyan-400 
                     transition-colors leading-tight">
          {tool.name}
        </h3>

        {/* Description - Fixed height for consistency */}
        <p className="block w-full text-xs sm:text-sm text-gray-400 
                    line-clamp-2 sm:line-clamp-2 md:line-clamp-3
                    leading-relaxed mb-3 sm:mb-4
                    min-h-[2.5rem] sm:min-h-[2.75rem]">
          {tool.description}
        </p>

        {/* Footer - Same structure as CategoryCard */}
        <div className="w-full flex items-center justify-between 
                      border-t border-white/10 gap-2 mt-auto pt-3 sm:pt-4">
          {/* Time indicator */}
          {tool.timeToUse && (
            <span className="flex items-center gap-1 sm:gap-1.5 
                           text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{tool.timeToUse}</span>
              <span className="sm:hidden">{tool.timeToUse.split(' ')[0]}</span>
            </span>
          )}
          
          {/* CTA Button */}
          <div className="flex items-center gap-1 sm:gap-1.5 
                        text-xs sm:text-sm font-medium text-cyan-400 
                        group-hover:gap-2 transition-all ml-auto">
            <span className="hidden sm:inline">Use tool</span>
            <span className="sm:hidden">Open</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 
                                 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br 
                    from-cyan-500/0 to-purple-500/0 
                    group-hover:from-cyan-500/5 group-hover:to-purple-500/5 
                    transition-all duration-300 pointer-events-none" />
    </Link>
  )
}

// ========================================
// Compact Variant (for lists)
// ========================================
export function ToolCardCompact({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.url || `/tools/${tool.id}`}
      className="group flex items-center gap-3 sm:gap-4 
               p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm
               border border-white/10 hover:border-white/20
               transition-all duration-300 hover:bg-white/10"
    >
      {/* Icon - CENTERED IN BOX */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0
                    rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 
                    border border-white/5
                    text-xl sm:text-2xl text-center
                    flex items-center justify-center">
        {tool.emoji || tool.icon || '🔧'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col items-start">
        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
          <h3 className="w-full text-sm sm:text-base font-bold text-white 
                       line-clamp-1 group-hover:text-cyan-400 transition-colors text-left">
            {tool.name}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            {tool.featured && (
              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 
                             text-[9px] sm:text-[10px] font-semibold rounded">
                ★
              </span>
            )}
            {tool.new && (
              <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 
                             text-[9px] sm:text-[10px] font-semibold rounded">
                N
              </span>
            )}
            {tool.badge && (
              <span className={`px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded
                             ${
                               tool.badge === 'AI' 
                                 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                 : tool.badge === 'HOT'
                                 ? 'bg-orange-500/20 text-orange-400'
                                 : 'bg-gray-500/20 text-gray-400'
                             }`}>
                {tool.badge}
              </span>
            )}
          </div>
        </div>
        <p className="w-full text-xs sm:text-sm text-gray-400 line-clamp-1 text-left">
          {tool.description}
        </p>
      </div>

      {/* Arrow */}
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 
                           group-hover:text-cyan-400 
                           group-hover:translate-x-1 
                           transition-all flex-shrink-0" />
    </Link>
  )
}

// ========================================
// Featured Variant (larger, more prominent)
// ========================================
export function ToolCardFeatured({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.url || `/tools/${tool.id}`}
      className="group relative bg-white/5 backdrop-blur-xl 
                 rounded-2xl sm:rounded-3xl border border-white/10 
                 hover:border-white/20 hover:bg-white/10
                 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10
                 hover:-translate-y-1 overflow-hidden flex flex-col h-full items-start
                 p-6 sm:p-8"
    >
      {/* Featured Badge & Other Badges */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 items-end">
        <span className="px-3 py-1.5 sm:px-4 sm:py-2 
                       bg-purple-500/30 backdrop-blur-sm 
                       border border-purple-500/50 text-purple-200 
                       text-xs sm:text-sm font-bold rounded-full 
                       flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          FEATURED
        </span>
        <div className="flex gap-2">
          {tool.new && (
            <span className="px-2.5 py-1 bg-cyan-500/20 backdrop-blur-sm 
                           border border-cyan-500/30 text-cyan-300 
                           text-xs font-semibold rounded-full">
              New
            </span>
          )}
          {tool.badge && (
            <span className={`px-2.5 py-1 backdrop-blur-sm text-xs font-semibold rounded-full
                           ${
                             tool.badge === 'AI' 
                               ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                               : tool.badge === 'HOT'
                               ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300'
                               : 'bg-gray-500/20 border border-gray-500/30 text-gray-300'
                           }`}>
              {tool.badge}
            </span>
          )}
        </div>
      </div>

      {/* Large Icon - CENTERED IN BOX */}
      <div className="mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 
                      rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 
                      border-2 border-white/10
                      text-5xl sm:text-6xl text-center
                      flex items-center justify-center
                      transition-transform group-hover:scale-110">
          {tool.emoji || tool.icon || '🔧'}
        </div>
      </div>

      {/* Title */}
      <h3 className="w-full text-xl sm:text-2xl md:text-3xl font-bold text-white 
                   mb-3 sm:mb-4 group-hover:text-cyan-400 
                   transition-colors leading-tight text-left">
        {tool.name}
      </h3>

      {/* Description */}
      <p className="w-full text-sm sm:text-base text-gray-300 mb-6 
                  line-clamp-3 leading-relaxed">
        {tool.description}
      </p>

      {/* CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto w-full">
        {tool.timeToUse && (
          <span className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            {tool.timeToUse}
          </span>
        )}
        
        <div className="flex items-center gap-2 text-base font-semibold 
                      text-cyan-400 group-hover:gap-3 transition-all ml-auto">
          <span>Try it now</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br 
                    from-cyan-500/0 via-purple-500/0 to-pink-500/0 
                    group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 
                    transition-all duration-500 pointer-events-none" />
    </Link>
  )
}