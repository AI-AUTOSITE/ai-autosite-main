// app/components/common/Breadcrumb.tsx
'use client'

import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import type { Tool, Category } from '../../lib/categories'  // ← この行を追加！

interface BreadcrumbProps {
  tool: Tool | undefined
  category: Category | undefined
}

export default function Breadcrumb({ tool, category }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />
        Home
      </Link>
      <ChevronRight className="w-3 h-3" />
      <Link href="/tools" className="hover:text-cyan-400 transition-colors">
        Tools
      </Link>
      {category && (
        <>
          <ChevronRight className="w-3 h-3" />
          <Link 
            href={`/tools?category=${category.id}`} 
            className="hover:text-cyan-400 transition-colors"
          >
            {category.title}
          </Link>
        </>
      )}
      {tool && (
        <>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{tool.name}</span>
        </>
      )}
    </nav>
  )
}