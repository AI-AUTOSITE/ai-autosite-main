// app/tools/ai-dev-dictionary/lib/terms/categories.ts

export interface Category {
  id: string
  name: string
  icon: string
}

export const categories: Category[] = [
  { id: 'all', name: 'All Terms', icon: '🎯' },
  { id: 'ui-components', name: 'UI Components', icon: '🎨' },
  { id: 'data-display', name: 'Data Display', icon: '📊' },
  { id: 'forms', name: 'Forms & Input', icon: '📝' },
  { id: 'layout', name: 'Layout', icon: '📐' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' },
  { id: 'feedback', name: 'Feedback', icon: '💬' },
  { id: 'advanced', name: 'Advanced', icon: '⚡' }
]