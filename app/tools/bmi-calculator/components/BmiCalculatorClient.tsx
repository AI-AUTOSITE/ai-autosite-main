'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'

type UnitSystem = 'imperial' | 'metric'

interface BmiResult {
  bmi: number
  category: string
  color: string
}

const BMI_CATEGORIES = [
  { max: 18.5, category: 'Underweight', color: 'text-blue-400' },
  { max: 24.9, category: 'Normal weight', color: 'text-green-400' },
  { max: 29.9, category: 'Overweight', color: 'text-yellow-400' },
  { max: Infinity, category: 'Obese', color: 'text-orange-400' }
]

function calculateBMI(weight: number, height: number, units: UnitSystem): number {
  if (units === 'imperial') {
    const weightKg = weight * 0.453592
    const heightM = height * 0.0254
    return weightKg / (heightM * heightM)
  } else {
    const heightM = height / 100
    return weight / (heightM * heightM)
  }
}

function getBMICategory(bmi: number): BmiResult {
  for (const category of BMI_CATEGORIES) {
    if (bmi < category.max) {
      return {
        bmi,
        category: category.category,
        color: category.color
      }
    }
  }
  return BMI_CATEGORIES[BMI_CATEGORIES.length - 1] as any
}

export default function BmiCalculatorClient() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<BmiResult | null>(null)
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    
    if (unitSystem === 'imperial') {
      if (!heightFt || !weight) {
        setError('Enter height and weight')
        return
      }
      
      const ft = parseFloat(heightFt)
      const inches = parseFloat(heightIn || '0')
      const lbs = parseFloat(weight)
      
      if (ft < 1 || ft > 8 || inches < 0 || inches >= 12 || lbs < 50 || lbs > 1000) {
        setError('Invalid values')
        return
      }
      
      const totalInches = ft * 12 + inches
      const bmi = calculateBMI(lbs, totalInches, unitSystem)
      setResult(getBMICategory(bmi))
      
    } else {
      if (!heightCm || !weight) {
        setError('Enter height and weight')
        return
      }
      
      const cm = parseFloat(heightCm)
      const kg = parseFloat(weight)
      
      if (cm < 100 || cm > 250 || kg < 20 || kg > 500) {
        setError('Invalid values')
        return
      }
      
      const bmi = calculateBMI(kg, cm, unitSystem)
      setResult(getBMICategory(bmi))
    }
  }

  const handleReset = () => {
    setHeightFt('')
    setHeightIn('')
    setHeightCm('')
    setWeight('')
    setResult(null)
    setError('')
  }

  const switchUnits = (system: UnitSystem) => {
    setUnitSystem(system)
    handleReset()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* Unit Toggle - Simplified */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6">
          <button
            onClick={() => switchUnits('imperial')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              unitSystem === 'imperial'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ft / lbs
          </button>
          <button
            onClick={() => switchUnits('metric')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              unitSystem === 'metric'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            cm / kg
          </button>
        </div>

        {/* Input Form - Simplified */}
        <div className="space-y-4">
          {/* Height Input */}
          <div>
            <label className="text-white font-medium mb-2 block">
              Height
            </label>
            {unitSystem === 'imperial' ? (
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      min="1"
                      max="8"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                                placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-8
                                hover:bg-white/15"
                      autoFocus
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="10"
                      min="0"
                      max="11"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                                placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-8
                                hover:bg-white/15"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">in</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                  min="100"
                  max="250"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                            placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-10
                            hover:bg-white/15"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
              </div>
            )}
          </div>

          {/* Weight Input */}
          <div>
            <label className="text-white font-medium mb-2 block">
              Weight
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unitSystem === 'imperial' ? '150' : '70'}
                min={unitSystem === 'imperial' ? '50' : '20'}
                max={unitSystem === 'imperial' ? '1000' : '500'}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                          placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-10
                          hover:bg-white/15"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {unitSystem === 'imperial' ? 'lbs' : 'kg'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-fadeIn">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Calculate Button - Large and Prominent */}
        <button
          onClick={handleCalculate}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl 
                   font-medium text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          Calculate BMI
        </button>

        {/* Result Display - Simplified */}
        {result && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white mb-2">
                {result.bmi.toFixed(1)}
              </h2>
              <p className={`text-2xl font-medium ${result.color}`}>
                {result.category}
              </p>
            </div>

            {/* BMI Scale Visual - Simplified */}
            <div className="mt-6">
              <div className="flex h-6 rounded-lg overflow-hidden">
                <div className="flex-1 bg-blue-500/30" title="Underweight"></div>
                <div className="flex-1 bg-green-500/30" title="Normal"></div>
                <div className="flex-1 bg-yellow-500/30" title="Overweight"></div>
                <div className="flex-1 bg-orange-500/30" title="Obese"></div>
              </div>
              
              {/* Marker */}
              <div className="relative h-2">
                <div 
                  className="absolute top-0 h-2 w-2 bg-white rounded-full -translate-x-1/2 transition-all"
                  style={{
                    left: `${Math.min(Math.max((result.bmi - 15) / 20 * 100, 0), 100)}%`
                  }}
                />
              </div>
              
              {/* Scale Labels */}
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>15</span>
                <span>25</span>
                <span>35</span>
              </div>
            </div>

            {/* Clear button */}
            <button
              onClick={handleReset}
              className="w-full mt-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                       hover:text-white transition-all text-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 BMI = weight (kg) ÷ height² (m²) • Screening tool only, not diagnostic
      </p>
    </div>
  )
}