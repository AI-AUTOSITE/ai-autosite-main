// app/tools/[category]/page.tsx
// Category Tools List Page - Shows all tools in a specific category

import { Metadata } from 'next'
import CategoryPageClient from './CategoryPageClient'

// ========================================
// Dynamic Metadata Generation
// ========================================
export async function generateMetadata({ 
  params 
}: { 
  params: { category: string } 
}): Promise<Metadata> {
  const { category } = params
  
  // Import here to avoid edge runtime issues
  const { getCategoryById } = await import('@/lib/categories-config')
  const categoryInfo = getCategoryById(category)
  
  if (!categoryInfo) {
    return {
      title: 'Category Not Found - AI AutoSite',
      description: 'The requested category could not be found.',
    }
  }

  return {
    title: `${categoryInfo.name} - Free Online Tools | AI AutoSite`,
    description: `${categoryInfo.description} Browse ${categoryInfo.name} tools. No ads, no tracking, 100% free.`,
    keywords: `${categoryInfo.name}, free tools, online tools, ${category}`,
    openGraph: {
      title: `${categoryInfo.name} - AI AutoSite`,
      description: categoryInfo.description,
      type: 'website',
      url: `https://ai-autosite.com/tools/${category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryInfo.name} - AI AutoSite`,
      description: categoryInfo.description,
    },
  }
}

// ========================================
// Category Page Component
// ========================================
export default function CategoryPage({ 
  params 
}: { 
  params: { category: string } 
}) {
  return <CategoryPageClient category={params.category} />
}