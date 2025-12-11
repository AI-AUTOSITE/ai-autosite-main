// app/lib/core/status-map.ts
// ===================================
// Status & Category Mapping
// ===================================

// Tool status mapping (for backward compatibility)
// Current tools use: 'live', 'coming', 'maintenance'
export const TOOL_STATUS_MAP = {
  active: 'live',
  live: 'live',
  coming: 'coming',
  'coming-soon': 'coming',
  maintenance: 'maintenance',
} as const

// Blog post status mapping
export const POST_STATUS_MAP = {
  published: 'active',
  active: 'active',
  'coming-soon': 'coming',
  draft: 'draft',
} as const

// Category ID normalization/mapping
// Maps old category names to new ones (for backward compatibility)
export const CATEGORY_MAP = {
  // Old → New mappings
  'business-tools': 'ai-tools',
  'creative-tools': 'editors',
  'quick-tools': 'converters',
  'study-tools': 'learning',
  'learning-hub': 'learning',
  
  // Current categories (identity mapping)
  'converters': 'converters',
  'editors': 'editors',
  'generators': 'generators',
  'analyzers': 'analyzers',
  'privacy': 'privacy',
  'ai-tools': 'ai-tools',
  'dev-tools': 'dev-tools',
  'learning': 'learning',
} as const

// Mapping functions
export function mapToolStatus(status: string): string {
  return TOOL_STATUS_MAP[status as keyof typeof TOOL_STATUS_MAP] || status
}

export function mapPostStatus(status: string): string {
  return POST_STATUS_MAP[status as keyof typeof POST_STATUS_MAP] || status
}

export function mapCategoryId(category: string): string {
  return CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || category
}

// Type exports for strict typing
export type ToolStatus = 'live' | 'coming' | 'maintenance'
export type PostStatus = 'active' | 'coming' | 'draft'
export type CategoryId = 'converters' | 'editors' | 'generators' | 'analyzers' | 'privacy' | 'ai-tools' | 'dev-tools' | 'learning'