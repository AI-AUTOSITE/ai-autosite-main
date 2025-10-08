'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Ruler,
  Scale,
  Thermometer,
  Droplet,
  ArrowUpDown,
  Copy,
  Check,
} from 'lucide-react'

type Category = 'length' | 'weight' | 'temperature' | 'volume'

interface Unit {
  name: string
  value: string
  symbol: string
  factor?: number
}

const conversionData = {
  length: {
    icon: Ruler,
    color: 'from-blue-400 to-cyan-400',
    units: [
      { name: 'Meter', value: 'm', symbol: 'm', factor: 1 },
      { name: 'Kilometer', value: 'km', symbol: 'km', factor: 0.001 },
      { name: 'Centimeter', value: 'cm', symbol: 'cm', factor: 100 },
      { name: 'Millimeter', value: 'mm', symbol: 'mm', factor: 1000 },
      { name: 'Mile', value: 'mi', symbol: 'mi', factor: 0.000621371 },
      { name: 'Yard', value: 'yd', symbol: 'yd', factor: 1.09361 },
      { name: 'Foot', value: 'ft', symbol: 'ft', factor: 3.28084 },
      { name: 'Inch', value: 'in', symbol: 'in', factor: 39.3701 },
    ],
  },
  weight: {
    icon: Scale,
    color: 'from-green-400 to-emerald-400',
    units: [
      { name: 'Kilogram', value: 'kg', symbol: 'kg', factor: 1 },
      { name: 'Gram', value: 'g', symbol: 'g', factor: 1000 },
      { name: 'Milligram', value: 'mg', symbol: 'mg', factor: 1000000 },
      { name: 'Pound', value: 'lb', symbol: 'lb', factor: 2.20462 },
      { name: 'Ounce', value: 'oz', symbol: 'oz', factor: 35.274 },
      { name: 'Ton', value: 't', symbol: 't', factor: 0.001 },
    ],
  },
  temperature: {
    icon: Thermometer,
    color: 'from-orange-400 to-red-400',
    units: [
      { name: 'Celsius', value: '°C', symbol: '°C' },
      { name: 'Fahrenheit', value: '°F', symbol: '°F' },
      { name: 'Kelvin', value: 'K', symbol: 'K' },
    ],
  },
  volume: {
    icon: Droplet,
    color: 'from-purple-400 to-pink-400',
    units: [
      { name: 'Liter', value: 'L', symbol: 'L', factor: 1 },
      { name: 'Milliliter', value: 'mL', symbol: 'mL', factor: 1000 },
      { name: 'Gallon', value: 'gal', symbol: 'gal', factor: 0.264172 },
      { name: 'Cup', value: 'cup', symbol: 'cup', factor: 4.22675 },
      { name: 'Fl Ounce', value: 'fl oz', symbol: 'fl oz', factor: 33.814 },
      { name: 'Tablespoon', value: 'tbsp', symbol: 'tbsp', factor: 67.628 },
    ],
  },
}

// Popular conversions for quick access
const quickConversions = {
  length: [
    { from: 'mi', to: 'km', label: 'Miles → KM' },
    { from: 'ft', to: 'm', label: 'Feet → M' },
    { from: 'in', to: 'cm', label: 'Inches → CM' },
  ],
  weight: [
    { from: 'lb', to: 'kg', label: 'Pounds → KG' },
    { from: 'oz', to: 'g', label: 'Ounces → G' },
    { from: 'kg', to: 'lb', label: 'KG → Pounds' },
  ],
  temperature: [
    { from: '°C', to: '°F', label: 'C → F' },
    { from: '°F', to: '°C', label: 'F → C' },
    { from: '°C', to: 'K', label: 'C → K' },
  ],
  volume: [
    { from: 'gal', to: 'L', label: 'Gallons → L' },
    { from: 'cup', to: 'mL', label: 'Cups → mL' },
    { from: 'L', to: 'gal', label: 'L → Gallons' },
  ],
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<Category>('length')
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState(conversionData[category].units[0].value)
  const [toUnit, setToUnit] = useState(conversionData[category].units[1].value)
  const [copied, setCopied] = useState(false)
  const [recentConversions, setRecentConversions] = useState<string[]>([])

  // Vibration helper
  const vibrate = (duration: number = 30) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  // Convert temperature
  const convertTemperature = useCallback((value: number, from: string, to: string): number => {
    let celsius = value

    // Convert to Celsius first
    if (from === '°F') {
      celsius = ((value - 32) * 5) / 9
    } else if (from === 'K') {
      celsius = value - 273.15
    }

    // Convert from Celsius to target
    if (to === '°F') {
      return (celsius * 9) / 5 + 32
    } else if (to === 'K') {
      return celsius + 273.15
    }

    return celsius
  }, [])

  // Convert other units
  const convertUnit = useCallback(
    (value: number, from: string, to: string, cat: Category): number => {
      if (cat === 'temperature') {
        return convertTemperature(value, from, to)
      }

      const units = conversionData[cat].units
      const fromUnit = units.find((u) => u.value === from)
      const toUnit = units.find((u) => u.value === to)

      if (!fromUnit?.factor || !toUnit?.factor) return 0

      // Convert to base unit then to target unit
      const baseValue = value / fromUnit.factor
      return baseValue * toUnit.factor
    },
    [convertTemperature]
  )

  // Calculate output value
  const outputValue = useMemo(() => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || inputValue === '') return ''

    const result = convertUnit(value, fromUnit, toUnit, category)

    // Smart formatting
    if (Math.abs(result) >= 1000000) {
      return result.toExponential(3)
    } else if (Math.abs(result) < 0.001 && result !== 0) {
      return result.toExponential(3)
    } else {
      const formatted = result.toFixed(6)
      return parseFloat(formatted).toString()
    }
  }, [inputValue, fromUnit, toUnit, category, convertUnit])

  // Reset units when category changes
  useEffect(() => {
    const units = conversionData[category].units
    setFromUnit(units[0].value)
    setToUnit(units[1].value)
  }, [category])

  // Swap units
  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (outputValue) {
      setInputValue(outputValue)
    }
    vibrate(30) // Swap feedback
  }

  // Quick conversion
  const applyQuickConversion = (from: string, to: string) => {
    setFromUnit(from)
    setToUnit(to)
    if (!inputValue) {
      setInputValue('1')
    }
    vibrate(30) // Quick convert feedback
  }

  // Copy result
  const copyResult = async () => {
    if (!outputValue) return

    const fromSymbol =
      conversionData[category].units.find((u) => u.value === fromUnit)?.symbol || fromUnit
    const toSymbol =
      conversionData[category].units.find((u) => u.value === toUnit)?.symbol || toUnit
    const fullText = `${inputValue} ${fromSymbol} = ${outputValue} ${toSymbol}`

    await navigator.clipboard.writeText(fullText)
    vibrate(30) // Copy feedback
    setCopied(true)

    // Add to recent
    setRecentConversions((prev) => [fullText, ...prev.slice(0, 2)])

    setTimeout(() => setCopied(false), 2000)
  }

  // Clear
  const handleClear = () => {
    setInputValue('')
    vibrate(30) // Clear feedback
  }

  const currentData = conversionData[category]

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Main Display */}
      {outputValue && (
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-white mb-2">{outputValue}</div>
          <div className="text-gray-400">
            {conversionData[category].units.find((u) => u.value === toUnit)?.symbol}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            from {inputValue}{' '}
            {conversionData[category].units.find((u) => u.value === fromUnit)?.symbol}
          </div>
        </div>
      )}

      {/* Category Selector */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 mb-6 border border-white/10">
        <div className="grid grid-cols-4 gap-1">
          {(Object.entries(conversionData) as [Category, typeof currentData][]).map(
            ([key, data]) => {
              const CategoryIcon = data.icon
              const isActive = category === key

              return (
                <button
                  key={key}
                  onClick={() => {
                    setCategory(key)
                    vibrate(30)
                  }}
                  className={`min-h-[44px] py-2 px-1 rounded-xl font-medium transition-all flex flex-col items-center justify-center ${
                    isActive
                      ? `bg-gradient-to-r ${data.color} text-white`
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <CategoryIcon className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] sm:text-xs capitalize leading-tight">{key}</span>
                </button>
              )
            }
          )}
        </div>
      </div>

      {/* Converter Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        {/* Input */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-2 block">From</label>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="number"
              inputMode="decimal"
              autoComplete="off"
              autoFocus={false}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full sm:flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl 
                       text-white text-xl placeholder-gray-500 focus:outline-none 
                       focus:border-cyan-400 transition-all"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full sm:w-32 px-4 py-3 bg-black/30 border border-white/10 rounded-xl 
                       text-white focus:outline-none focus:border-cyan-400 cursor-pointer
                       [&>option]:bg-gray-800 [&>option]:text-white"
            >
              {currentData.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center my-3">
          <button
            onClick={swapUnits}
            className="min-h-[44px] min-w-[44px] p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
            title="Swap units"
          >
            <ArrowUpDown className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        {/* Output */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-2 block">To</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:flex-1 px-4 py-3 bg-black/40 border border-white/20 rounded-xl">
              <div className="text-white text-xl font-medium min-h-[28px]">
                {outputValue || <span className="text-gray-500">Result</span>}
              </div>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full sm:w-32 px-4 py-3 bg-black/30 border border-white/10 rounded-xl 
                       text-white focus:outline-none focus:border-cyan-400 cursor-pointer
                       [&>option]:bg-gray-800 [&>option]:text-white"
            >
              {currentData.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="min-h-[44px] px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
          >
            Clear
          </button>

          <button
            onClick={copyResult}
            disabled={!outputValue}
            className={`min-h-[44px] flex-1 px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-30 
                     disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                       copied
                         ? 'bg-green-500 text-white'
                         : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg'
                     }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Conversions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Convert</h3>
        <div className="grid grid-cols-3 gap-2">
          {quickConversions[category].map((conv, idx) => (
            <button
              key={idx}
              onClick={() => applyQuickConversion(conv.from, conv.to)}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm transition-all ${
                fromUnit === conv.from && toUnit === conv.to
                  ? 'bg-gradient-to-r ' + currentData.color + ' text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {conv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Conversions */}
      {recentConversions.length > 0 && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Recent</h3>
          <div className="space-y-1">
            {recentConversions.map((conv, idx) => (
              <div key={idx} className="text-sm text-gray-300">
                {conv}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}