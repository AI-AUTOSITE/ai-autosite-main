// app/tools/[category]/page.tsx
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCategoryById } from '@/lib/categories-config'
import { getToolsByCategory } from '@/lib/unified-data'
import CategoryDetailView from '@/components/CategoryDetailView'
import { mapCategoryId } from '@/lib/core/status-map'

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  // Map old category names to new ones
  const mappedCategoryId = mapCategoryId(params.category)
  const category = getCategoryById(mappedCategoryId)

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
  // Handle old category names (redirect to new ones)
  const mappedCategoryId = mapCategoryId(params.category)
  if (mappedCategoryId !== params.category) {
    redirect(`/tools/${mappedCategoryId}`)
  }

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

  // Remove icon (function) from category before passing to client component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { icon, ...categoryWithoutIcon } = category

  return (
    <div className="min-h-screen bg-gray-800">
      <CategoryDetailView category={categoryWithoutIcon as any} tools={sortedTools} />
    </div>
  )
}