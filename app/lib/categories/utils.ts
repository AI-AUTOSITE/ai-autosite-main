// app/lib/categories/utils.ts
import type { Tool, Category } from './types'
import { CATEGORIES } from '../categories-config'

// ===================================
// Category Functions
// ===================================

export const getEnabledCategories = () =>
  CATEGORIES.filter((cat) => cat.enabled).sort((a, b) => a.order - b.order)

export const getAllCategories = () => CATEGORIES.sort((a, b) => a.order - b.order)

export const getCategoryById = (id: string) => CATEGORIES.find((cat) => cat.id === id)

export const getCategoryByPath = (path: string) => CATEGORIES.find((cat) => cat.path === path)

// ===================================
// Tool Functions
// ===================================

export const getToolsByCategory = (tools: Tool[], categoryId: string) =>
  tools.filter((tool) => tool.category === categoryId)

export const getLiveTools = (tools: Tool[]) => tools.filter((tool) => tool.status === 'live')

export const getLiveToolsByCategory = (tools: Tool[], categoryId: string) =>
  tools.filter((tool) => tool.category === categoryId && tool.status === 'live')

export const getFeaturedTools = (tools: Tool[]) =>
  tools.filter((tool) => tool.featured && tool.status === 'live')

export const getNewTools = (tools: Tool[]) =>
  tools.filter((tool) => tool.new && tool.status === 'live')

export const getComingSoonTools = (tools: Tool[]) =>
  tools.filter((tool) => tool.status === 'coming')

export const getMaintenanceTools = (tools: Tool[]) =>
  tools.filter((tool) => tool.status === 'maintenance')

export const getToolById = (tools: Tool[], id: string) => tools.find((tool) => tool.id === id)

export const getToolByUrl = (tools: Tool[], url: string) => tools.find((tool) => tool.url === url)

// ===================================
// Statistics Functions
// ===================================

export const getToolCountByCategory = (tools: Tool[], categoryId: string) =>
  tools.filter((tool) => tool.category === categoryId && tool.status === 'live').length

export const getTotalLiveToolsCount = (tools: Tool[]) =>
  tools.filter((tool) => tool.status === 'live').length

export const getTotalComingSoonCount = (tools: Tool[]) =>
  tools.filter((tool) => tool.status === 'coming').length

export const getTotalMaintenanceCount = (tools: Tool[]) =>
  tools.filter((tool) => tool.status === 'maintenance').length

// ===================================
// Search Functions
// ===================================

export const searchTools = (tools: Tool[], query: string, categoryId?: string) => {
  const lowerQuery = query.toLowerCase()
  return tools.filter((tool) => {
    const matchesCategory = !categoryId || categoryId === 'all' || tool.category === categoryId
    const matchesSearch =
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    return matchesCategory && matchesSearch && tool.status === 'live'
  })
}

// ===================================
// Category Enhancement
// ===================================

export const getCategoriesWithToolCount = (tools: Tool[]) => {
  return CATEGORIES.map((category) => ({
    ...category,
    toolCount: getToolCountByCategory(tools, category.id),
  }))
}

// ===================================
// Top Tools Functions
// ===================================

export const getTopToolsByUsers = (tools: Tool[], limit: number = 5) => {
  return tools
    .filter((tool) => tool.status === 'live')
    .sort((a, b) => {
      // featuredを優先
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      // 新しいツールを優先
      if (a.new && !b.new) return -1
      if (!a.new && b.new) return 1

      // 最終的に更新日でソート
      const aDate = a.lastUpdated || '0000-00'
      const bDate = b.lastUpdated || '0000-00'
      return bDate.localeCompare(aDate)
    })
    .slice(0, limit)
}

export const getTopToolsByCategory = (tools: Tool[], categoryId: string, limit: number = 3) => {
  return tools
    .filter((tool) => tool.category === categoryId && tool.status === 'live')
    .sort((a, b) => {
      // featured優先、その後は最新のものから
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      // 両方featuredまたは両方非featuredの場合、更新日でソート
      const aDate = a.lastUpdated || '0000-00'
      const bDate = b.lastUpdated || '0000-00'
      return bDate.localeCompare(aDate)
    })
    .slice(0, limit)
}

// ===================================
// Filter by Properties
// ===================================

export const getApiRequiredTools = (tools: Tool[]) =>
  tools.filter((tool) => tool.apiRequired && tool.status === 'live')

export const getToolsByPricing = (tools: Tool[], pricing: 'free' | 'freemium' | 'paid') =>
  tools.filter((tool) => tool.pricing === pricing && tool.status === 'live')

export const getToolsByProcessingType = (tools: Tool[], type: 'local' | 'server' | 'hybrid') =>
  tools.filter((tool) => tool.dataProcessing === type)

export const getToolsWithDependencies = (tools: Tool[]) =>
  tools.filter((tool) => tool.dependencies && tool.dependencies.length > 0)

// ===================================
// Tool Validation
// ===================================

export const validateTool = (tool: Partial<Tool>): string[] => {
  const errors: string[] = []

  // Required fields
  if (!tool.id) errors.push('Tool ID is required')
  if (!tool.name) errors.push('Tool name is required')
  if (!tool.category) errors.push('Tool category is required')
  if (!tool.url) errors.push('Tool URL is required')
  if (!tool.status) errors.push('Tool status is required')

  // Status validation
  if (tool.status && !['live', 'coming', 'maintenance'].includes(tool.status)) {
    errors.push(`Invalid status: ${tool.status}. Must be 'live', 'coming', or 'maintenance'`)
  }

  // Category validation
  if (tool.category && !CATEGORIES.find((c) => c.id === tool.category)) {
    errors.push(`Invalid category: ${tool.category}`)
  }

  // Category enabled validation
  if (tool.category) {
    const category = CATEGORIES.find((c) => c.id === tool.category)
    if (category && !category.enabled && tool.status === 'live') {
      errors.push(`Cannot set status to 'live' for disabled category: ${tool.category}`)
    }
  }

  // Difficulty validation
  if (
    tool.difficulty &&
    !['Instant', 'Simple', 'Intermediate', 'Advanced'].includes(tool.difficulty)
  ) {
    errors.push(`Invalid difficulty: ${tool.difficulty}`)
  }

  return errors
}