// app/lib/categories/index.ts

// ===================================
// Type Exports
// ===================================
export type { Tool, Category } from './types'

// ===================================
// Category Exports
// ===================================
export { CATEGORIES } from '../categories-config'

// ===================================
// Tool Collections by Category
// ===================================
import { converters } from './converters'
import { editors } from './editors'
import { generators } from './generators'
import { analyzers } from './analyzers'
import { aiTools } from './ai-tools'
import { devTools } from './dev-tools'
import { learning } from './learning'

// Combine all tools into single array
export const TOOLS: Tool[] = [
  ...converters,
  ...editors,
  ...generators,
  ...analyzers,
  ...aiTools,
  ...devTools,
  ...learning,
]

// Export individual collections for direct access
export { converters, editors, generators, analyzers, aiTools, devTools, learning }

// Tools organized by category ID
export const toolsByCategory = {
  converters: converters,
  editors: editors,
  generators: generators,
  analyzers: analyzers,
  'ai-tools': aiTools,
  'dev-tools': devTools,
  learning: learning,
} as const

// ===================================
// Re-export Utility Functions
// ===================================
export {
  // Category functions
  getEnabledCategories,
  getAllCategories,
  getCategoryById,
  getCategoryByPath,
  getCategoriesWithToolCount,

  // Tool query functions
  getToolsByCategory,
  getLiveTools,
  getLiveToolsByCategory,
  getFeaturedTools,
  getNewTools,
  getComingSoonTools,
  getMaintenanceTools,
  getToolById,
  getToolByUrl,

  // Statistics
  getToolCountByCategory,
  getTotalLiveToolsCount,
  getTotalComingSoonCount,
  getTotalMaintenanceCount,

  // Search
  searchTools,

  // Rankings
  getTopToolsByCategory,

  // Filters
  getApiRequiredTools,
  getToolsByPricing,
  getToolsByProcessingType,
  getToolsWithDependencies,

  // Validation
  validateTool,
} from './utils'

// ===================================
// Compatibility Functions (using TOOLS array)
// ===================================
import type { Tool } from './types'
import * as utils from './utils'

// These functions maintain backward compatibility
// by passing the TOOLS array to the utility functions

export const getToolsByCategoryCompat = (categoryId: string) =>
  utils.getToolsByCategory(TOOLS, categoryId)

export const getLiveToolsCompat = () => utils.getLiveTools(TOOLS)

export const getLiveToolsByCategoryCompat = (categoryId: string) =>
  utils.getLiveToolsByCategory(TOOLS, categoryId)

export const getFeaturedToolsCompat = () => utils.getFeaturedTools(TOOLS)

export const getNewToolsCompat = () => utils.getNewTools(TOOLS)

export const getComingSoonToolsCompat = () => utils.getComingSoonTools(TOOLS)

export const getMaintenanceToolsCompat = () => utils.getMaintenanceTools(TOOLS)

export const getToolByIdCompat = (id: string) => utils.getToolById(TOOLS, id)

export const getToolByUrlCompat = (url: string) => utils.getToolByUrl(TOOLS, url)

export const getToolCountByCategoryCompat = (categoryId: string) =>
  utils.getToolCountByCategory(TOOLS, categoryId)

export const getTotalLiveToolsCountCompat = () => utils.getTotalLiveToolsCount(TOOLS)

export const getTotalComingSoonCountCompat = () => utils.getTotalComingSoonCount(TOOLS)

export const getTotalMaintenanceCountCompat = () => utils.getTotalMaintenanceCount(TOOLS)

export const searchToolsCompat = (query: string, categoryId?: string) =>
  utils.searchTools(TOOLS, query, categoryId)

export const getCategoriesWithToolCountCompat = () => utils.getCategoriesWithToolCount(TOOLS)

export const getTopToolsByUsersCompat = (limit: number = 5) =>
  utils.getTopToolsByUsers(TOOLS, limit)

export const getTopToolsByCategoryCompat = (categoryId: string, limit: number = 3) =>
  utils.getTopToolsByCategory(TOOLS, categoryId, limit)

export const getApiRequiredToolsCompat = () => utils.getApiRequiredTools(TOOLS)

export const getToolsByPricingCompat = (pricing: 'free' | 'freemium' | 'paid') =>
  utils.getToolsByPricing(TOOLS, pricing)

export const getToolsByProcessingTypeCompat = (type: 'local' | 'server' | 'hybrid') =>
  utils.getToolsByProcessingType(TOOLS, type)

export const getToolsWithDependenciesCompat = () => utils.getToolsWithDependencies(TOOLS)