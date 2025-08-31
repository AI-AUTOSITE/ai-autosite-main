// app/tools/ai-dev-dictionary/components/CategoryFilter.tsx
'use client'

interface Category {
  id: string
  name: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  termCounts: Record<string, number>
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  termCounts 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`
            px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2
            ${selectedCategory === category.id
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg scale-105'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }
          `}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          {category.id !== 'all' && termCounts[category.id] && (
            <span className={`
              px-2 py-0.5 text-xs rounded-full
              ${selectedCategory === category.id 
                ? 'bg-white/20' 
                : 'bg-white/10'
              }
            `}>
              {termCounts[category.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}