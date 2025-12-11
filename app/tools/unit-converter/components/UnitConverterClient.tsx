'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeftRight, Copy, Check, Lock, Ruler, Scale, Thermometer, Droplet, Square, HardDrive, Clock, Gauge, LucideIcon } from 'lucide-react'

// Type definitions
interface UnitDefinition {
  name: string
  symbol: string
  factor: number
}

interface CategoryDefinition {
  name: string
  icon: LucideIcon
  baseUnit: string
  units: Record<string, UnitDefinition>
  specialConversion?: boolean
}

// Unit definitions with conversion factors (to base unit)
const UNIT_CATEGORIES: Record<string, CategoryDefinition> = {
  length: {
    name: 'Length',
    icon: Ruler,
    baseUnit: 'meter',
    units: {
      meter: { name: 'Meter', symbol: 'm', factor: 1 },
      kilometer: { name: 'Kilometer', symbol: 'km', factor: 1000 },
      centimeter: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      millimeter: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      mile: { name: 'Mile', symbol: 'mi', factor: 1609.344 },
      yard: { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      foot: { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      inch: { name: 'Inch', symbol: 'in', factor: 0.0254 },
      nauticalMile: { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
    }
  },
  weight: {
    name: 'Weight',
    icon: Scale,
    baseUnit: 'kilogram',
    units: {
      kilogram: { name: 'Kilogram', symbol: 'kg', factor: 1 },
      gram: { name: 'Gram', symbol: 'g', factor: 0.001 },
      milligram: { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
      pound: { name: 'Pound', symbol: 'lb', factor: 0.453592 },
      ounce: { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
      stone: { name: 'Stone', symbol: 'st', factor: 6.35029 },
      metricTon: { name: 'Metric Ton', symbol: 't', factor: 1000 },
      usTon: { name: 'US Ton', symbol: 'ton', factor: 907.185 },
    }
  },
  temperature: {
    name: 'Temperature',
    icon: Thermometer,
    baseUnit: 'celsius',
    units: {
      celsius: { name: 'Celsius', symbol: '°C', factor: 1 },
      fahrenheit: { name: 'Fahrenheit', symbol: '°F', factor: 1 },
      kelvin: { name: 'Kelvin', symbol: 'K', factor: 1 },
    },
    // Special conversion functions for temperature
    specialConversion: true
  },
  volume: {
    name: 'Volume',
    icon: Droplet,
    baseUnit: 'liter',
    units: {
      liter: { name: 'Liter', symbol: 'L', factor: 1 },
      milliliter: { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      cubicMeter: { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      usGallon: { name: 'US Gallon', symbol: 'gal', factor: 3.78541 },
      ukGallon: { name: 'UK Gallon', symbol: 'imp gal', factor: 4.54609 },
      usQuart: { name: 'US Quart', symbol: 'qt', factor: 0.946353 },
      usPint: { name: 'US Pint', symbol: 'pt', factor: 0.473176 },
      usCup: { name: 'US Cup', symbol: 'cup', factor: 0.236588 },
      fluidOunce: { name: 'Fluid Ounce', symbol: 'fl oz', factor: 0.0295735 },
      tablespoon: { name: 'Tablespoon', symbol: 'tbsp', factor: 0.0147868 },
      teaspoon: { name: 'Teaspoon', symbol: 'tsp', factor: 0.00492892 },
    }
  },
  area: {
    name: 'Area',
    icon: Square,
    baseUnit: 'squareMeter',
    units: {
      squareMeter: { name: 'Square Meter', symbol: 'm²', factor: 1 },
      squareKilometer: { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      squareFoot: { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      squareMile: { name: 'Square Mile', symbol: 'mi²', factor: 2589988 },
      acre: { name: 'Acre', symbol: 'ac', factor: 4046.86 },
      hectare: { name: 'Hectare', symbol: 'ha', factor: 10000 },
      squareYard: { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
      squareInch: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
    }
  },
  digital: {
    name: 'Digital Storage',
    icon: HardDrive,
    baseUnit: 'byte',
    units: {
      byte: { name: 'Byte', symbol: 'B', factor: 1 },
      kilobyte: { name: 'Kilobyte', symbol: 'KB', factor: 1024 },
      megabyte: { name: 'Megabyte', symbol: 'MB', factor: 1048576 },
      gigabyte: { name: 'Gigabyte', symbol: 'GB', factor: 1073741824 },
      terabyte: { name: 'Terabyte', symbol: 'TB', factor: 1099511627776 },
      petabyte: { name: 'Petabyte', symbol: 'PB', factor: 1125899906842624 },
      kibibyte: { name: 'Kibibyte (1000)', symbol: 'kB', factor: 1000 },
      mebibyte: { name: 'Mebibyte (1000)', symbol: 'mB', factor: 1000000 },
      gibibyte: { name: 'Gibibyte (1000)', symbol: 'gB', factor: 1000000000 },
    }
  },
  time: {
    name: 'Time',
    icon: Clock,
    baseUnit: 'second',
    units: {
      second: { name: 'Second', symbol: 's', factor: 1 },
      millisecond: { name: 'Millisecond', symbol: 'ms', factor: 0.001 },
      minute: { name: 'Minute', symbol: 'min', factor: 60 },
      hour: { name: 'Hour', symbol: 'hr', factor: 3600 },
      day: { name: 'Day', symbol: 'd', factor: 86400 },
      week: { name: 'Week', symbol: 'wk', factor: 604800 },
      month: { name: 'Month (30d)', symbol: 'mo', factor: 2592000 },
      year: { name: 'Year (365d)', symbol: 'yr', factor: 31536000 },
    }
  },
  speed: {
    name: 'Speed',
    icon: Gauge,
    baseUnit: 'meterPerSecond',
    units: {
      meterPerSecond: { name: 'Meters/Second', symbol: 'm/s', factor: 1 },
      kilometerPerHour: { name: 'Kilometers/Hour', symbol: 'km/h', factor: 0.277778 },
      milePerHour: { name: 'Miles/Hour', symbol: 'mph', factor: 0.44704 },
      knot: { name: 'Knot', symbol: 'kn', factor: 0.514444 },
      footPerSecond: { name: 'Feet/Second', symbol: 'ft/s', factor: 0.3048 },
    }
  }
}

// Popular conversions for quick access
const POPULAR_CONVERSIONS = [
  { from: 'centimeter', to: 'inch', category: 'length', label: 'cm → in' },
  { from: 'celsius', to: 'fahrenheit', category: 'temperature', label: '°C → °F' },
  { from: 'kilogram', to: 'pound', category: 'weight', label: 'kg → lb' },
  { from: 'kilometer', to: 'mile', category: 'length', label: 'km → mi' },
  { from: 'liter', to: 'usGallon', category: 'volume', label: 'L → gal' },
  { from: 'meter', to: 'foot', category: 'length', label: 'm → ft' },
]

export default function UnitConverterClient() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('meter')
  const [toUnit, setToUnit] = useState('foot')
  const [fromValue, setFromValue] = useState('1')
  const [copied, setCopied] = useState(false)

  // Update units when category changes
  useEffect(() => {
    const units = Object.keys(UNIT_CATEGORIES[category].units)
    setFromUnit(units[0])
    setToUnit(units[1] || units[0])
    setFromValue('1')
  }, [category])

  // Temperature conversion functions
  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius: number
    switch (from) {
      case 'fahrenheit':
        celsius = (value - 32) * 5 / 9
        break
      case 'kelvin':
        celsius = value - 273.15
        break
      default:
        celsius = value
    }

    // Convert from Celsius to target
    switch (to) {
      case 'fahrenheit':
        return celsius * 9 / 5 + 32
      case 'kelvin':
        return celsius + 273.15
      default:
        return celsius
    }
  }

  // Convert value
  const convertedValue = useMemo(() => {
    const value = parseFloat(fromValue)
    if (isNaN(value)) return ''

    const cat = UNIT_CATEGORIES[category]
    if (!cat) return ''
    
    // Special handling for temperature
    if (category === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit)
    }

    // Standard conversion via base unit
    const fromUnitDef = cat.units[fromUnit]
    const toUnitDef = cat.units[toUnit]
    if (!fromUnitDef || !toUnitDef) return ''
    
    const baseValue = value * fromUnitDef.factor
    return baseValue / toUnitDef.factor
  }, [fromValue, fromUnit, toUnit, category])

  // Format number with appropriate precision
  const formatNumber = (num: number | string): string => {
    if (typeof num === 'string') return num
    if (isNaN(num)) return ''
    
    // Use scientific notation for very large or small numbers
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 0.0001 && num !== 0)) {
      return num.toExponential(6)
    }
    
    // Regular formatting with up to 10 decimal places, remove trailing zeros
    return parseFloat(num.toFixed(10)).toString()
  }

  // Swap units
  const handleSwap = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    setFromValue(formatNumber(convertedValue))
  }

  // Copy result
  const handleCopy = async () => {
    const fromUnitDef = currentCategory.units[fromUnit]
    const toUnitDef = currentCategory.units[toUnit]
    if (!fromUnitDef || !toUnitDef) return
    
    const text = `${fromValue} ${fromUnitDef.symbol} = ${formatNumber(convertedValue)} ${toUnitDef.symbol}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Quick conversion shortcut
  const applyQuickConversion = (conv: typeof POPULAR_CONVERSIONS[0]) => {
    setCategory(conv.category)
    setTimeout(() => {
      setFromUnit(conv.from)
      setToUnit(conv.to)
      setFromValue('1')
    }, 0)
  }

  const currentCategory = UNIT_CATEGORIES[category]
  if (!currentCategory) return null
  const CategoryIcon = currentCategory.icon

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
        <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-green-300 font-medium">100% Private - Works Offline</p>
          <p className="text-green-400/70 text-xs mt-1">
            All conversions calculated locally • No data sent anywhere • No tracking
          </p>
        </div>
      </div>

      {/* Quick Conversions */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Popular conversions:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CONVERSIONS.map((conv, i) => (
            <button
              key={i}
              onClick={() => applyQuickConversion(conv)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full text-sm transition-colors"
            >
              {conv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selector */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-4">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all ${
                  category === key
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs truncate w-full text-center">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Converter */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
        {/* From */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="flex-1 bg-black/30 text-white text-2xl font-bold p-4 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none"
              placeholder="0"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none min-w-[120px]"
            >
              {Object.entries(currentCategory.units).map(([key, unit]) => (
                <option key={key} value={key} className="bg-gray-900">
                  {unit.symbol} - {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full hover:opacity-90 transition-all shadow-lg shadow-cyan-600/30 active:scale-95"
          >
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* To */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">To</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-black/30 text-cyan-400 text-2xl font-bold p-4 rounded-xl border border-cyan-500/30">
              {formatNumber(convertedValue) || '0'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none min-w-[120px]"
            >
              {Object.entries(currentCategory.units).map(([key, unit]) => (
                <option key={key} value={key} className="bg-gray-900">
                  {unit.symbol} - {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={!convertedValue}
          className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-50'
          }`}
        >
          {copied ? <><Check className="w-5 h-5" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Result</>}
        </button>

        {/* Conversion Formula */}
        {fromValue && convertedValue && (
          <div className="mt-4 p-3 bg-black/20 rounded-lg text-center">
            <p className="text-sm text-gray-400">
              <span className="text-white font-medium">{fromValue}</span>
              {' '}
              {currentCategory.units[fromUnit]?.symbol}
              {' = '}
              <span className="text-cyan-400 font-medium">{formatNumber(convertedValue)}</span>
              {' '}
              {currentCategory.units[toUnit]?.symbol}
            </p>
          </div>
        )}
      </div>

      {/* All Units Reference */}
      <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <CategoryIcon className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-medium">All {currentCategory.name} Units</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {Object.entries(currentCategory.units).map(([key, unit]) => {
            if (key === fromUnit) return null
            const value = parseFloat(fromValue)
            if (isNaN(value)) return null
            
            let converted: number
            if (category === 'temperature') {
              converted = convertTemperature(value, fromUnit, key)
            } else {
              const fromUnitDef = currentCategory.units[fromUnit]
              if (!fromUnitDef) return null
              converted = (value * fromUnitDef.factor) / unit.factor
            }
            
            return (
              <button
                key={key}
                onClick={() => setToUnit(key)}
                className={`p-2 rounded-lg text-left transition-colors ${
                  toUnit === key
                    ? 'bg-cyan-600/20 border border-cyan-600/50'
                    : 'bg-black/20 hover:bg-black/30'
                }`}
              >
                <span className="text-white font-medium">{formatNumber(converted)}</span>
                <span className="text-gray-400 ml-1">{unit.symbol}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
        <p>💡 Click any unit above to set it as target • Swap button reverses conversion</p>
        <p>🔒 All calculations happen in your browser - works completely offline</p>
      </div>
    </div>
  )
}