'use client'

import { useState } from 'react'
import { Calculator, Info, Target, Scale, Heart, Ruler, ChevronDown, ChevronUp } from 'lucide-react'

// ============================================
// Types
// ============================================
type UnitSystem = 'imperial' | 'metric'
type BmiStandard = 'who' | 'asia-pacific'
type Sex = 'male' | 'female'

interface BmiResult {
  bmi: number
  bmiPrime: number
  category: string
  color: string
  bgColor: string
  healthRisk: string
}

interface IdealWeight {
  devine: number
  robinson: number
  miller: number
  hamwi: number
  average: number
}

interface GoalWeight {
  toHealthyMin: number
  toHealthyMax: number
  toBmi22: number
  direction: 'lose' | 'gain' | 'maintain'
}

// ============================================
// BMI Standards Configuration
// ============================================
const BMI_STANDARDS = {
  who: {
    name: 'WHO (Global)',
    categories: [
      { max: 16, category: 'Severe Thinness', color: 'text-purple-400', bgColor: 'bg-purple-500/30', healthRisk: 'High' },
      { max: 17, category: 'Moderate Thinness', color: 'text-blue-400', bgColor: 'bg-blue-500/30', healthRisk: 'Moderate' },
      { max: 18.5, category: 'Mild Thinness', color: 'text-cyan-400', bgColor: 'bg-cyan-500/30', healthRisk: 'Low' },
      { max: 25, category: 'Normal', color: 'text-green-400', bgColor: 'bg-green-500/30', healthRisk: 'Low' },
      { max: 30, category: 'Overweight', color: 'text-yellow-400', bgColor: 'bg-yellow-500/30', healthRisk: 'Increased' },
      { max: 35, category: 'Obese Class I', color: 'text-orange-400', bgColor: 'bg-orange-500/30', healthRisk: 'High' },
      { max: 40, category: 'Obese Class II', color: 'text-red-400', bgColor: 'bg-red-500/30', healthRisk: 'Very High' },
      { max: Infinity, category: 'Obese Class III', color: 'text-red-500', bgColor: 'bg-red-600/30', healthRisk: 'Extremely High' },
    ],
    healthyRange: { min: 18.5, max: 25 },
  },
  'asia-pacific': {
    name: 'Asia-Pacific',
    categories: [
      { max: 18.5, category: 'Underweight', color: 'text-blue-400', bgColor: 'bg-blue-500/30', healthRisk: 'Moderate' },
      { max: 23, category: 'Normal', color: 'text-green-400', bgColor: 'bg-green-500/30', healthRisk: 'Low' },
      { max: 25, category: 'Overweight', color: 'text-yellow-400', bgColor: 'bg-yellow-500/30', healthRisk: 'Increased' },
      { max: 30, category: 'Obese Class I', color: 'text-orange-400', bgColor: 'bg-orange-500/30', healthRisk: 'High' },
      { max: Infinity, category: 'Obese Class II', color: 'text-red-400', bgColor: 'bg-red-500/30', healthRisk: 'Very High' },
    ],
    healthyRange: { min: 18.5, max: 23 },
  },
}

// ============================================
// Calculation Functions
// ============================================
function calculateBMI(weightKg: number, heightM: number): number {
  return weightKg / (heightM * heightM)
}

function getBMICategory(bmi: number, standard: BmiStandard): BmiResult {
  const categories = BMI_STANDARDS[standard].categories
  for (const cat of categories) {
    if (bmi < cat.max) {
      return {
        bmi,
        bmiPrime: bmi / 25,
        category: cat.category,
        color: cat.color,
        bgColor: cat.bgColor,
        healthRisk: cat.healthRisk,
      }
    }
  }
  const last = categories[categories.length - 1]
  return {
    bmi,
    bmiPrime: bmi / 25,
    category: last.category,
    color: last.color,
    bgColor: last.bgColor,
    healthRisk: last.healthRisk,
  }
}

function calculateIdealWeight(heightInches: number, sex: Sex): IdealWeight {
  const formulas = {
    devine: sex === 'male' 
      ? 50 + 2.3 * (heightInches - 60)
      : 45.5 + 2.3 * (heightInches - 60),
    robinson: sex === 'male'
      ? 52 + 1.9 * (heightInches - 60)
      : 49 + 1.7 * (heightInches - 60),
    miller: sex === 'male'
      ? 56.2 + 1.41 * (heightInches - 60)
      : 53.1 + 1.36 * (heightInches - 60),
    hamwi: sex === 'male'
      ? 48 + 2.7 * (heightInches - 60)
      : 45.5 + 2.2 * (heightInches - 60),
  }
  
  const average = (formulas.devine + formulas.robinson + formulas.miller + formulas.hamwi) / 4
  
  return { ...formulas, average }
}

function calculateGoalWeight(
  currentWeightKg: number, 
  heightM: number, 
  standard: BmiStandard
): GoalWeight {
  const { min, max } = BMI_STANDARDS[standard].healthyRange
  const healthyMinWeight = min * heightM * heightM
  const healthyMaxWeight = max * heightM * heightM
  const bmi22Weight = 22 * heightM * heightM
  
  const toHealthyMin = currentWeightKg - healthyMaxWeight
  const toHealthyMax = healthyMinWeight - currentWeightKg
  const toBmi22 = currentWeightKg - bmi22Weight
  
  let direction: 'lose' | 'gain' | 'maintain' = 'maintain'
  if (toHealthyMin > 0) direction = 'lose'
  else if (toHealthyMax > 0) direction = 'gain'
  
  return { toHealthyMin, toHealthyMax, toBmi22, direction }
}

function estimateBodyFat(bmi: number, age: number, sex: Sex): number {
  const sexFactor = sex === 'male' ? 1 : 0
  return (1.20 * bmi) + (0.23 * age) - (10.8 * sexFactor) - 5.4
}

function calculateWHtR(waistCm: number, heightCm: number): { ratio: number; risk: string; color: string } {
  const ratio = waistCm / heightCm
  let risk: string
  let color: string
  
  if (ratio < 0.4) {
    risk = 'Underweight risk'
    color = 'text-blue-400'
  } else if (ratio < 0.5) {
    risk = 'Healthy'
    color = 'text-green-400'
  } else if (ratio < 0.6) {
    risk = 'Increased risk'
    color = 'text-yellow-400'
  } else {
    risk = 'High risk'
    color = 'text-red-400'
  }
  
  return { ratio, risk, color }
}

// ============================================
// Gauge Component
// ============================================
function BmiGauge({ bmi, standard }: { bmi: number; standard: BmiStandard }) {
  const minBmi = 15
  const maxBmi = 40
  const clampedBmi = Math.min(Math.max(bmi, minBmi), maxBmi)
  const angle = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 180 - 90
  
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 120" className="w-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="15%" stopColor="#3b82f6" />
            <stop offset="25%" stopColor="#06b6d4" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="55%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="85%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="8" fill="white" />
          <circle cx="100" cy="100" r="4" fill="#1f2937" />
        </g>
        
        <text x="15" y="115" fill="#9ca3af" fontSize="10">15</text>
        <text x="55" y="45" fill="#9ca3af" fontSize="10">20</text>
        <text x="95" y="30" fill="#9ca3af" fontSize="10">25</text>
        <text x="135" y="45" fill="#9ca3af" fontSize="10">30</text>
        <text x="175" y="115" fill="#9ca3af" fontSize="10">40</text>
      </svg>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <div className="text-3xl font-bold text-white">{bmi.toFixed(1)}</div>
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================
export default function BmiCalculatorClient() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial')
  const [bmiStandard, setBmiStandard] = useState<BmiStandard>('who')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weight, setWeight] = useState('')
  
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [age, setAge] = useState('')
  const [sex, setSex] = useState<Sex>('male')
  const [waist, setWaist] = useState('')
  
  const [result, setResult] = useState<BmiResult | null>(null)
  const [idealWeight, setIdealWeight] = useState<IdealWeight | null>(null)
  const [goalWeight, setGoalWeight] = useState<GoalWeight | null>(null)
  const [bodyFat, setBodyFat] = useState<number | null>(null)
  const [whtrResult, setWhtrResult] = useState<{ ratio: number; risk: string; color: string } | null>(null)
  const [error, setError] = useState('')

  const vibrate = (duration: number = 30) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  const handleCalculate = () => {
    setError('')
    setResult(null)
    setIdealWeight(null)
    setGoalWeight(null)
    setBodyFat(null)
    setWhtrResult(null)

    let weightKg: number
    let heightM: number
    let heightInches: number

    if (unitSystem === 'imperial') {
      if (!heightFt || !weight) {
        setError('Please enter height and weight')
        return
      }

      const ft = parseFloat(heightFt)
      const inches = parseFloat(heightIn || '0')
      const lbs = parseFloat(weight)

      if (isNaN(ft) || isNaN(inches) || isNaN(lbs) ||
          ft < 1 || ft > 8 || inches < 0 || inches >= 12 || lbs < 50 || lbs > 1000) {
        setError('Please enter valid values')
        return
      }

      heightInches = ft * 12 + inches
      heightM = heightInches * 0.0254
      weightKg = lbs * 0.453592
    } else {
      if (!heightCm || !weight) {
        setError('Please enter height and weight')
        return
      }

      const cm = parseFloat(heightCm)
      const kg = parseFloat(weight)

      if (isNaN(cm) || isNaN(kg) || cm < 100 || cm > 250 || kg < 20 || kg > 500) {
        setError('Please enter valid values')
        return
      }

      heightM = cm / 100
      heightInches = cm / 2.54
      weightKg = kg
    }

    const bmi = calculateBMI(weightKg, heightM)
    const bmiResult = getBMICategory(bmi, bmiStandard)
    setResult(bmiResult)

    const ideal = calculateIdealWeight(heightInches, sex)
    setIdealWeight(ideal)

    const goal = calculateGoalWeight(weightKg, heightM, bmiStandard)
    setGoalWeight(goal)

    if (age) {
      const ageNum = parseInt(age)
      if (!isNaN(ageNum) && ageNum >= 18 && ageNum <= 100) {
        const bf = estimateBodyFat(bmi, ageNum, sex)
        setBodyFat(Math.max(0, bf))
      }
    }

    if (waist) {
      const waistNum = parseFloat(waist)
      const heightCmNum = heightM * 100
      if (!isNaN(waistNum) && waistNum > 0) {
        const waistCm = unitSystem === 'imperial' ? waistNum * 2.54 : waistNum
        setWhtrResult(calculateWHtR(waistCm, heightCmNum))
      }
    }

    vibrate()
  }

  const handleReset = () => {
    setHeightFt('')
    setHeightIn('')
    setHeightCm('')
    setWeight('')
    setAge('')
    setWaist('')
    setResult(null)
    setIdealWeight(null)
    setGoalWeight(null)
    setBodyFat(null)
    setWhtrResult(null)
    setError('')
  }

  const switchUnits = (system: UnitSystem) => {
    setUnitSystem(system)
    handleReset()
  }

  const formatWeight = (kg: number): string => {
    if (unitSystem === 'imperial') {
      return `${(kg * 2.20462).toFixed(1)} lbs`
    }
    return `${kg.toFixed(1)} kg`
  }

  const formatWeightDiff = (kg: number): string => {
    const absKg = Math.abs(kg)
    if (unitSystem === 'imperial') {
      return `${(absKg * 2.20462).toFixed(1)} lbs`
    }
    return `${absKg.toFixed(1)} kg`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* BMI Standard Toggle */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">BMI Standard</label>
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setBmiStandard('who')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                bmiStandard === 'who'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              WHO (Global)
            </button>
            <button
              onClick={() => setBmiStandard('asia-pacific')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                bmiStandard === 'asia-pacific'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Asia-Pacific
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {bmiStandard === 'who' 
              ? 'Healthy BMI: 18.5 - 25'
              : 'Healthy BMI: 18.5 - 23 (lower threshold for Asian populations)'}
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6">
          <button
            onClick={() => switchUnits('imperial')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              unitSystem === 'imperial'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ft / lbs
          </button>
          <button
            onClick={() => switchUnits('metric')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              unitSystem === 'metric'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            cm / kg
          </button>
        </div>

        {/* Basic Input Form */}
        <div className="space-y-4">
          {/* Height Input */}
          <div>
            <label className="text-white font-medium mb-2 block flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-400" />
              Height
            </label>
            {unitSystem === 'imperial' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="5"
                    min="1"
                    max="8"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                              placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-10
                              hover:bg-white/15"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="10"
                    min="0"
                    max="11"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                              placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-10
                              hover:bg-white/15"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">in</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="175"
                  min="100"
                  max="250"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                            placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-12
                            hover:bg-white/15"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">cm</span>
              </div>
            )}
          </div>

          {/* Weight Input */}
          <div>
            <label className="text-white font-medium mb-2 block flex items-center gap-2">
              <Scale className="w-4 h-4 text-gray-400" />
              Weight
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unitSystem === 'imperial' ? '150' : '70'}
                min={unitSystem === 'imperial' ? '50' : '20'}
                max={unitSystem === 'imperial' ? '1000' : '500'}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                          placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-12
                          hover:bg-white/15"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {unitSystem === 'imperial' ? 'lbs' : 'kg'}
              </span>
            </div>
          </div>

          {/* Sex Selection */}
          <div>
            <label className="text-white font-medium mb-2 block">Sex (for ideal weight calculation)</label>
            <div className="flex bg-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setSex('male')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  sex === 'male'
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  sex === 'female'
                    ? 'bg-pink-500/30 text-pink-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-sm">Advanced Options</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 mt-4 pt-4 border-t border-white/10 animate-fadeIn">
            <div>
              <label className="text-white font-medium mb-2 block flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400" />
                Age (for body fat estimate)
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                            placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-16
                            hover:bg-white/15"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">years</span>
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-2 block flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gray-400" />
                Waist Circumference (for WHtR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder={unitSystem === 'imperial' ? '32' : '80'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                            placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors pr-12
                            hover:bg-white/15"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {unitSystem === 'imperial' ? 'in' : 'cm'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Waist-to-Height Ratio is a better predictor of health risks than BMI alone
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-fadeIn">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl 
                   font-medium text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2
                   active:scale-[0.98]"
        >
          <Calculator className="w-5 h-5" />
          Calculate BMI
        </button>

        {/* Results Section */}
        {result && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn space-y-6">
            
            {/* BMI Gauge */}
            <BmiGauge bmi={result.bmi} standard={bmiStandard} />
            
            {/* Category & Risk */}
            <div className="text-center">
              <p className={`text-2xl font-bold ${result.color}`}>{result.category}</p>
              <p className="text-gray-400 text-sm mt-1">
                Health Risk: <span className={result.color}>{result.healthRisk}</span>
              </p>
            </div>

            {/* BMI Prime */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">BMI Prime</span>
                <span className={`font-bold ${result.bmiPrime < 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.bmiPrime.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {result.bmiPrime < 1 
                  ? 'Below upper limit of healthy range'
                  : `${((result.bmiPrime - 1) * 100).toFixed(0)}% above upper limit`}
              </p>
            </div>

            {/* Goal Weight */}
            {goalWeight && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Weight Goals</span>
                </div>
                
                {goalWeight.direction === 'lose' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">To reach healthy range:</span>
                      <span className="text-yellow-400 font-medium">
                        Lose {formatWeightDiff(goalWeight.toHealthyMin)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">To reach BMI 22:</span>
                      <span className="text-green-400 font-medium">
                        Lose {formatWeightDiff(goalWeight.toBmi22)}
                      </span>
                    </div>
                  </div>
                )}
                
                {goalWeight.direction === 'gain' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">To reach healthy range:</span>
                      <span className="text-blue-400 font-medium">
                        Gain {formatWeightDiff(goalWeight.toHealthyMax)}
                      </span>
                    </div>
                  </div>
                )}
                
                {goalWeight.direction === 'maintain' && (
                  <p className="text-green-400 text-sm">
                    ✓ You&apos;re within the healthy weight range!
                  </p>
                )}
              </div>
            )}

            {/* Ideal Weight */}
            {idealWeight && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-white font-medium">Ideal Weight Range</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Devine:</span>
                    <span className="text-gray-300">{formatWeight(idealWeight.devine)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Robinson:</span>
                    <span className="text-gray-300">{formatWeight(idealWeight.robinson)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Miller:</span>
                    <span className="text-gray-300">{formatWeight(idealWeight.miller)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hamwi:</span>
                    <span className="text-gray-300">{formatWeight(idealWeight.hamwi)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between">
                  <span className="text-gray-400 font-medium">Average:</span>
                  <span className="text-green-400 font-bold">{formatWeight(idealWeight.average)}</span>
                </div>
              </div>
            )}

            {/* Body Fat Estimate */}
            {bodyFat !== null && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Estimated Body Fat %</span>
                  <span className="text-white font-bold">{bodyFat.toFixed(1)}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on Deurenberg formula (estimate only)
                </p>
              </div>
            )}

            {/* WHtR Result */}
            {whtrResult && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Waist-to-Height Ratio</span>
                  <span className="text-white font-bold">{whtrResult.ratio.toFixed(2)}</span>
                </div>
                <p className={`text-sm font-medium ${whtrResult.color}`}>
                  {whtrResult.risk}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Target: keep ratio below 0.5
                </p>
              </div>
            )}

            {/* Clear Button */}
            <button
              onClick={handleReset}
              className="w-full py-3 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 
                       hover:text-white transition-all font-medium"
            >
              Calculate Again
            </button>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 BMI = weight (kg) ÷ height² (m²) • For reference only, not medical advice
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          WHtR may be a better indicator of health risks, especially for abdominal fat
        </p>
      </div>
    </div>
  )
}