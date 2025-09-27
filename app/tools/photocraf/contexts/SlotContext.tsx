'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { FilterSlot, SlotState, PlanType, PLAN_CONFIGS, CustomFilter } from '../types'

interface SlotContextType {
  slotState: SlotState
  addFilterToSlot: (filter: CustomFilter) => boolean
  removeFilterFromSlot: (slotId: string) => void
  activateSlot: (slotId: string) => void
  deactivateSlot: (slotId: string) => void
  canAddMoreFilters: () => boolean
  upgradePlan: (newPlan: PlanType) => void
  getRemainingSlots: () => number
}

const SlotContext = createContext<SlotContextType | undefined>(undefined)

export function SlotProvider({ children }: { children: React.ReactNode }) {
  const [slotState, setSlotState] = useState<SlotState>(() => {
    // Load saved state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('photoEditor_slotState')
      if (saved) {
        return JSON.parse(saved)
      }
    }

    // Default state
    const defaultPlan: PlanType = 'free'
    const maxSlots = PLAN_CONFIGS[defaultPlan].maxSlots

    return {
      slots: Array.from({ length: maxSlots }, (_, i) => ({
        id: `slot-${i}`,
        filter: null,
        isActive: false,
        order: i,
      })),
      usedSlots: 0,
      maxSlots,
      plan: defaultPlan,
    }
  })

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('photoEditor_slotState', JSON.stringify(slotState))
    }
  }, [slotState])

  const addFilterToSlot = useCallback((filter: CustomFilter): boolean => {
    if (slotState.usedSlots >= slotState.maxSlots) {
      return false
    }

    const emptySlot = slotState.slots.find(slot => !slot.filter)
    if (!emptySlot) {
      return false
    }

    setSlotState(prev => ({
      ...prev,
      slots: prev.slots.map(slot =>
        slot.id === emptySlot.id
          ? { ...slot, filter, isActive: true }
          : slot
      ),
      usedSlots: prev.usedSlots + 1,
    }))

    return true
  }, [slotState.usedSlots, slotState.maxSlots, slotState.slots])

  const removeFilterFromSlot = useCallback((slotId: string) => {
    setSlotState(prev => ({
      ...prev,
      slots: prev.slots.map(slot =>
        slot.id === slotId
          ? { ...slot, filter: null, isActive: false }
          : slot
      ),
      usedSlots: Math.max(0, prev.usedSlots - 1),
    }))
  }, [])

  const activateSlot = useCallback((slotId: string) => {
    setSlotState(prev => ({
      ...prev,
      slots: prev.slots.map(slot =>
        slot.id === slotId
          ? { ...slot, isActive: true }
          : slot
      ),
    }))
  }, [])

  const deactivateSlot = useCallback((slotId: string) => {
    setSlotState(prev => ({
      ...prev,
      slots: prev.slots.map(slot =>
        slot.id === slotId
          ? { ...slot, isActive: false }
          : slot
      ),
    }))
  }, [])

  const canAddMoreFilters = useCallback(() => {
    return slotState.usedSlots < slotState.maxSlots
  }, [slotState.usedSlots, slotState.maxSlots])

  const upgradePlan = useCallback((newPlan: PlanType) => {
    const newMaxSlots = PLAN_CONFIGS[newPlan].maxSlots
    const currentSlots = slotState.slots

    let newSlots: FilterSlot[]
    if (newMaxSlots === Infinity) {
      // Unlimited plan - keep existing slots and add buffer
      newSlots = [
        ...currentSlots,
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `slot-${currentSlots.length + i}`,
          filter: null,
          isActive: false,
          order: currentSlots.length + i,
        })),
      ]
    } else if (newMaxSlots > currentSlots.length) {
      // Upgrade - add more slots
      newSlots = [
        ...currentSlots,
        ...Array.from({ length: newMaxSlots - currentSlots.length }, (_, i) => ({
          id: `slot-${currentSlots.length + i}`,
          filter: null,
          isActive: false,
          order: currentSlots.length + i,
        })),
      ]
    } else {
      // Downgrade - keep only available slots
      newSlots = currentSlots.slice(0, newMaxSlots)
    }

    setSlotState(prev => ({
      ...prev,
      slots: newSlots,
      maxSlots: newMaxSlots,
      plan: newPlan,
      usedSlots: newSlots.filter(slot => slot.filter !== null).length,
    }))
  }, [slotState.slots])

  const getRemainingSlots = useCallback(() => {
    if (slotState.maxSlots === Infinity) {
      return Infinity
    }
    return slotState.maxSlots - slotState.usedSlots
  }, [slotState.maxSlots, slotState.usedSlots])

  const value = {
    slotState,
    addFilterToSlot,
    removeFilterFromSlot,
    activateSlot,
    deactivateSlot,
    canAddMoreFilters,
    upgradePlan,
    getRemainingSlots,
  }

  return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>
}

export function useSlots() {
  const context = useContext(SlotContext)
  if (context === undefined) {
    throw new Error('useSlots must be used within a SlotProvider')
  }
  return context
}