// app/tools/photocraft/contexts/FilterContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Filter {
  id: string;
  type: string;
  name: string;
  params: Record<string, any>;
  isActive: boolean;
  intensity: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Filter[];
  thumbnail?: string;
}

interface FilterContextValue {
  filters: Filter[];
  activeFilters: Filter[];
  presets: FilterPreset[];
  addFilter: (filter: Omit<Filter, 'id'>) => void;
  removeFilter: (filterId: string) => void;
  updateFilter: (filterId: string, updates: Partial<Filter>) => void;
  toggleFilter: (filterId: string) => void;
  clearFilters: () => void;
  savePreset: (name: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  reorderFilters: (fromIndex: number, toIndex: number) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [presets, setPresets] = useState<FilterPreset[]>([
    // Default presets
    {
      id: 'vintage',
      name: 'Vintage',
      filters: [
        { id: '1', type: 'sepia', name: 'Sepia', params: { intensity: 0.5 }, isActive: true, intensity: 100 },
        { id: '2', type: 'contrast', name: 'Contrast', params: { value: 1.2 }, isActive: true, intensity: 100 }
      ]
    },
    {
      id: 'cinematic',
      name: 'Cinematic',
      filters: [
        { id: '3', type: 'brightness', name: 'Brightness', params: { value: -10 }, isActive: true, intensity: 100 },
        { id: '4', type: 'contrast', name: 'Contrast', params: { value: 1.3 }, isActive: true, intensity: 100 },
        { id: '5', type: 'saturation', name: 'Saturation', params: { value: 0.8 }, isActive: true, intensity: 100 }
      ]
    }
  ]);

  const activeFilters = filters.filter(f => f.isActive);

  const addFilter = useCallback((filter: Omit<Filter, 'id'>) => {
    const newFilter: Filter = {
      ...filter,
      id: `filter-${Date.now()}-${Math.random()}`
    };
    setFilters(prev => [...prev, newFilter]);
  }, []);

  const removeFilter = useCallback((filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);

  const updateFilter = useCallback((filterId: string, updates: Partial<Filter>) => {
    setFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, ...updates } : f
    ));
  }, []);

  const toggleFilter = useCallback((filterId: string) => {
    setFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, isActive: !f.isActive } : f
    ));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const savePreset = useCallback((name: string) => {
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: [...activeFilters]
    };
    setPresets(prev => [...prev, newPreset]);
  }, [activeFilters]);

  const loadPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setFilters(preset.filters.map(f => ({ ...f, id: `filter-${Date.now()}-${Math.random()}` })));
    }
  }, [presets]);

  const deletePreset = useCallback((presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
  }, []);

  const reorderFilters = useCallback((fromIndex: number, toIndex: number) => {
    setFilters(prev => {
      const newFilters = [...prev];
      const [removed] = newFilters.splice(fromIndex, 1);
      newFilters.splice(toIndex, 0, removed);
      return newFilters;
    });
  }, []);

  const value: FilterContextValue = {
    filters,
    activeFilters,
    presets,
    addFilter,
    removeFilter,
    updateFilter,
    toggleFilter,
    clearFilters,
    savePreset,
    loadPreset,
    deletePreset,
    reorderFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }
  return context;
};