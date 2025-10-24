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
import type { Tool } from './types'
import * as utils from './utils'

export {
  // Category functions
  getEnabledCategories,
  getAllCategories,
  getCategoryById,
  getCategoryByPath,
  getCategoriesWithToolCount,

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
// Simplified Tool Query Functions (Auto-inject TOOLS array)
// ===================================
export const getToolsByCategory = (categoryId: string) =>
  utils.getToolsByCategory(TOOLS, categoryId)

export const getLiveTools = () => utils.getLiveTools(TOOLS)

export const getLiveToolsByCategory = (categoryId: string) =>
  utils.getLiveToolsByCategory(TOOLS, categoryId)

export const getFeaturedTools = () => utils.getFeaturedTools(TOOLS)

export const getNewTools = () => utils.getNewTools(TOOLS)

export const getComingSoonTools = () => utils.getComingSoonTools(TOOLS)

export const getMaintenanceTools = () => utils.getMaintenanceTools(TOOLS)

export const getToolById = (id: string) => utils.getToolById(TOOLS, id)

export const getToolByUrl = (url: string) => utils.getToolByUrl(TOOLS, url)

// ===================================
// Raw Utility Functions (for advanced usage with custom tool arrays)
// ===================================
export {
  getToolsByCategory as getToolsByCategoryRaw,
  getLiveTools as getLiveToolsRaw,
  getLiveToolsByCategory as getLiveToolsByCategoryRaw,
  getFeaturedTools as getFeaturedToolsRaw,
  getNewTools as getNewToolsRaw,
  getComingSoonTools as getComingSoonToolsRaw,
  getMaintenanceTools as getMaintenanceToolsRaw,
  getToolById as getToolByIdRaw,
  getToolByUrl as getToolByUrlRaw,
  getToolCountByCategory as getToolCountByCategoryRaw,
  getTotalLiveToolsCount as getTotalLiveToolsCountRaw,
  getTotalComingSoonCount as getTotalComingSoonCountRaw,
  getTotalMaintenanceCount as getTotalMaintenanceCountRaw,
  searchTools as searchToolsRaw,
  getCategoriesWithToolCount as getCategoriesWithToolCountRaw,
  getTopToolsByUsers as getTopToolsByUsersRaw,
  getTopToolsByCategory as getTopToolsByCategoryRaw,
  getApiRequiredTools as getApiRequiredToolsRaw,
  getToolsByPricing as getToolsByPricingRaw,
  getToolsByProcessingType as getToolsByProcessingTypeRaw,
  getToolsWithDependencies as getToolsWithDependenciesRaw,
} from './utils'