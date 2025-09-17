// app/tools/pdf-tools/hooks/usePageSelection.ts
import { useState } from 'react';

export function usePageSelection() {
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());

  const handlePageSelect = (pageId: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
  };

  return {
    selectedPages,
    handlePageSelect,
    clearSelection,
    setSelectedPages
  };
}