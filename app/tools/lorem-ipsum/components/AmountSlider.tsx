'use client'

import * as Slider from '@radix-ui/react-slider'
import { useState, useEffect } from 'react'

interface AmountSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
}

export function AmountSlider({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  label = 'Amount',
}: AmountSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleValueChange = (values: number[]) => {
    setLocalValue(values[0])
  }

  const handleValueCommit = (values: number[]) => {
    onChange(values[0])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-gray-900 dark:text-white font-medium">{label}</label>
        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-white/5 px-3 py-1 rounded-lg border border-gray-300 dark:border-white/10">
          {localValue}
        </span>
      </div>
      
      <Slider.Root
        value={[localValue]}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        max={max}
        min={min}
        step={step}
        className="relative flex items-center select-none touch-none w-full h-6"
      >
        <Slider.Track className="bg-gray-300 dark:bg-white/10 relative grow rounded-full h-2">
          <Slider.Range className="absolute bg-gradient-to-r from-purple-500 to-purple-600 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white rounded-full shadow-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 cursor-grab active:cursor-grabbing transition-all"
          aria-label={label}
        />
      </Slider.Root>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}