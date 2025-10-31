// app/tools/[category]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryById } from '@/lib/categories-config'
import { getToolsByCategory } from '@/lib/unified-data'
import CategoryDetailView from '@/components/CategoryDetailView'

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const category = getCategoryById(params.category)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} - Free Tools | AI AutoSite`,
    description: category.description,
  }
}

// Generate static params for all enabled categories
export async function generateStaticParams() {
  const { getEnabledCategories } = await import('@/lib/categories-config')
  const categories = getEnabledCategories()

  return categories.map((cat) => ({
    category: cat.id,
  }))
}

export default function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const category = getCategoryById(params.category)

  if (!category || category.enabled === false) {
    notFound()
  }

  // Get active tools for this category
  const tools = getToolsByCategory(params.category).filter(
    (tool) => tool.isActive || tool.status === 'live'
  )

  // Sort tools alphabetically by name (server-side default sort)
  const sortedTools = tools.sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '')
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <CategoryDetailView category={category} tools={sortedTools} />
    </div>
  )
}