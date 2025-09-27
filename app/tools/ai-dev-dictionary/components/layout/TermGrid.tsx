// app/tools/ai-dev-dictionary/components/core/TermGrid.tsx
'use client'

import TermCard from '../../components/cards/TermCard'

interface TermGridProps {
  terms: any[]
  onSelectTerm: (term: any) => void
}

export default function TermGrid({ terms, onSelectTerm }: TermGridProps) {
  if (terms.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-400">No terms found</p>
        <p className="text-gray-500 mt-2">Try adjusting your search</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {terms.map(term => (
        <TermCard
          key={term.id}
          term={term}
          onSelect={() => onSelectTerm(term)}
        />
      ))}
    </div>
  )
}