// app/tools/ai-dev-dictionary/lib/terms/categories.ts

// Categoryインターフェースを明示的に定義
export interface Category {
  id: string
  name: string
  icon: string
  description?: string
}

export const categories: Category[] = [
  { 
    id: 'all', 
    name: 'All Terms', 
    icon: '🎯',
    description: 'Browse all available UI terms' 
  },
  { 
    id: 'ui-components', 
    name: 'UI Components', 
    icon: '🎨',
    description: 'Modals, cards, buttons, chips, and other interface elements' 
  },
  { 
    id: 'data-display', 
    name: 'Data Display', 
    icon: '📊',
    description: 'Tables, lists, charts, carousels, and data visualization' 
  },
  { 
    id: 'forms', 
    name: 'Forms & Input', 
    icon: '📝',
    description: 'Input fields, checkboxes, selects, and form controls' 
  },
  { 
    id: 'layout', 
    name: 'Layout', 
    icon: '📐',
    description: 'Headers, sidebars, grids, and page structure' 
  },
  { 
    id: 'navigation', 
    name: 'Navigation', 
    icon: '🧭',
    description: 'Menus, breadcrumbs, pagination, and navigation patterns' 
  },
  { 
    id: 'feedback', 
    name: 'Feedback', 
    icon: '💬',
    description: 'Toasts, alerts, loading states, and user notifications' 
  },
  { 
    id: 'advanced', 
    name: 'Advanced', 
    icon: '⚡',
    description: 'Dropdowns, tooltips, drag & drop, and complex interactions' 
  }
]