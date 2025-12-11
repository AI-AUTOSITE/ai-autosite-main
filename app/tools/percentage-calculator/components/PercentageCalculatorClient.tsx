'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, TrendingDown, Tag, DollarSign, Percent, Copy, Check, Trash2, ChevronDown, ChevronUp, Lock, History } from 'lucide-react'

type CalculationType = 'basic' | 'change' | 'what' | 'discount' | 'tip'

interface HistoryItem {
  id: number
  type: CalculationType
  formula: string
  result: string
  timestamp: number
}

interface TabConfig {
  id: CalculationType
  label: string
  shortLabel: string
  icon: React.ReactNode
}

const TABS: TabConfig[] = [
  { id: 'basic', label: 'Basic', shortLabel: 'Basic', icon: <Percent className="w-4 h-4" /> },
  { id: 'change', label: 'Change', shortLabel: 'Chng', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'what', label: 'What %', shortLabel: 'What', icon: <Calculator className="w-4 h-4" /> },
  { id: 'discount', label: 'Discount', shortLabel: 'Disc', icon: <Tag className="w-4 h-4" /> },
  { id: 'tip', label: 'Tip', shortLabel: 'Tip', icon: <DollarSign className="w-4 h-4" /> },
]

const TIP_PRESETS = [10, 15, 18, 20, 25]

const vibrate = (duration: number = 30) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

export default function PercentageCalculatorClient() {
  const [activeTab, setActiveTab] = useState<CalculationType>('basic')
  const [copied, setCopied] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyId, setHistoryId] = useState(0)

  // Basic: X% of Y
  const [basicPercent, setBasicPercent] = useState('')
  const [basicValue, setBasicValue] = useState('')
  const [basicResult, setBasicResult] = useState<number | null>(null)

  // Change: From X to Y
  const [changeFrom, setChangeFrom] = useState('')
  const [changeTo, setChangeTo] = useState('')
  const [changeResult, setChangeResult] = useState<{ percent: number; type: 'increase' | 'decrease' } | null>(null)

  // What: X is what % of Y
  const [whatValue, setWhatValue] = useState('')
  const [whatTotal, setWhatTotal] = useState('')
  const [whatResult, setWhatResult] = useState<number | null>(null)

  // Discount
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [discountResult, setDiscountResult] = useState<{ final: number; saved: number } | null>(null)

  // Tip
  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState('15')
  const [splitCount, setSplitCount] = useState('1')
  const [tipResult, setTipResult] = useState<{ tip: number; total: number; perPerson: number } | null>(null)

  const handleTabChange = (tab: CalculationType) => {
    setActiveTab(tab)
    vibrate(30)
    setShowSteps(false)
  }

  const addToHistory = (type: CalculationType, formula: string, result: string) => {
    const newItem: HistoryItem = {
      id: historyId,
      type,
      formula,
      result,
      timestamp: Date.now(),
    }
    setHistory((prev) => [newItem, ...prev].slice(0, 20))
    setHistoryId((prev) => prev + 1)
  }

  // Calculate Basic Percentage
  useEffect(() => {
    if (basicPercent && basicValue) {
      const percent = parseFloat(basicPercent)
      const value = parseFloat(basicValue)
      if (!isNaN(percent) && !isNaN(value)) {
        const result = (percent / 100) * value
        setBasicResult(result)
        vibrate(10)
      } else {
        setBasicResult(null)
      }
    } else {
      setBasicResult(null)
    }
  }, [basicPercent, basicValue])

  // Calculate Percentage Change
  useEffect(() => {
    if (changeFrom && changeTo) {
      const from = parseFloat(changeFrom)
      const to = parseFloat(changeTo)
      if (!isNaN(from) && !isNaN(to) && from !== 0) {
        const change = ((to - from) / Math.abs(from)) * 100
        setChangeResult({
          percent: Math.abs(change),
          type: change >= 0 ? 'increase' : 'decrease',
        })
        vibrate(10)
      } else {
        setChangeResult(null)
      }
    } else {
      setChangeResult(null)
    }
  }, [changeFrom, changeTo])

  // Calculate What Percentage
  useEffect(() => {
    if (whatValue && whatTotal) {
      const value = parseFloat(whatValue)
      const total = parseFloat(whatTotal)
      if (!isNaN(value) && !isNaN(total) && total !== 0) {
        const result = (value / total) * 100
        setWhatResult(result)
        vibrate(10)
      } else {
        setWhatResult(null)
      }
    } else {
      setWhatResult(null)
    }
  }, [whatValue, whatTotal])

  // Calculate Discount
  useEffect(() => {
    if (originalPrice && discountPercent) {
      const price = parseFloat(originalPrice)
      const discount = parseFloat(discountPercent)
      if (!isNaN(price) && !isNaN(discount)) {
        const saved = (discount / 100) * price
        setDiscountResult({
          saved: saved,
          final: price - saved,
        })
        vibrate(10)
      } else {
        setDiscountResult(null)
      }
    } else {
      setDiscountResult(null)
    }
  }, [originalPrice, discountPercent])

  // Calculate Tip
  useEffect(() => {
    if (billAmount && tipPercent) {
      const bill = parseFloat(billAmount)
      const tip = parseFloat(tipPercent)
      const split = parseInt(splitCount) || 1
      if (!isNaN(bill) && !isNaN(tip)) {
        const tipAmount = (tip / 100) * bill
        const total = bill + tipAmount
        setTipResult({
          tip: tipAmount,
          total: total,
          perPerson: total / split,
        })
        vibrate(10)
      } else {
        setTipResult(null)
      }
    } else {
      setTipResult(null)
    }
  }, [billAmount, tipPercent, splitCount])

  const getCurrentResult = (): string => {
    switch (activeTab) {
      case 'basic':
        return basicResult !== null ? basicResult.toFixed(2) : ''
      case 'change':
        return changeResult ? `${changeResult.percent.toFixed(2)}% ${changeResult.type}` : ''
      case 'what':
        return whatResult !== null ? `${whatResult.toFixed(2)}%` : ''
      case 'discount':
        return discountResult ? `$${discountResult.final.toFixed(2)}` : ''
      case 'tip':
        return tipResult ? `$${tipResult.total.toFixed(2)}` : ''
      default:
        return ''
    }
  }

  const copyResult = async () => {
    const result = getCurrentResult()
    if (result) {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const saveToHistory = () => {
    let formula = ''
    let result = ''
    
    switch (activeTab) {
      case 'basic':
        if (basicResult !== null) {
          formula = `${basicPercent}% of ${basicValue}`
          result = basicResult.toFixed(2)
          addToHistory('basic', formula, result)
        }
        break
      case 'change':
        if (changeResult) {
          formula = `${changeFrom} → ${changeTo}`
          result = `${changeResult.percent.toFixed(2)}% ${changeResult.type}`
          addToHistory('change', formula, result)
        }
        break
      case 'what':
        if (whatResult !== null) {
          formula = `${whatValue} of ${whatTotal}`
          result = `${whatResult.toFixed(2)}%`
          addToHistory('what', formula, result)
        }
        break
      case 'discount':
        if (discountResult) {
          formula = `$${originalPrice} - ${discountPercent}%`
          result = `$${discountResult.final.toFixed(2)}`
          addToHistory('discount', formula, result)
        }
        break
      case 'tip':
        if (tipResult) {
          formula = `$${billAmount} + ${tipPercent}% tip`
          result = `$${tipResult.total.toFixed(2)}`
          addToHistory('tip', formula, result)
        }
        break
    }
    vibrate(30)
  }

  const clearAll = () => {
    setBasicPercent('')
    setBasicValue('')
    setChangeFrom('')
    setChangeTo('')
    setWhatValue('')
    setWhatTotal('')
    setOriginalPrice('')
    setDiscountPercent('')
    setBillAmount('')
    setTipPercent('15')
    setSplitCount('1')
    vibrate(30)
  }

  const getStepByStep = () => {
    switch (activeTab) {
      case 'basic':
        if (basicResult !== null) {
          const p = parseFloat(basicPercent)
          const v = parseFloat(basicValue)
          return [
            { step: 1, desc: 'Convert percentage to decimal', formula: `${p}% ÷ 100 = ${(p / 100).toFixed(4)}` },
            { step: 2, desc: 'Multiply by the value', formula: `${(p / 100).toFixed(4)} × ${v} = ${basicResult.toFixed(2)}` },
            { step: 3, desc: 'Result', formula: `${p}% of ${v} = ${basicResult.toFixed(2)}` },
          ]
        }
        return []
      case 'change':
        if (changeResult) {
          const from = parseFloat(changeFrom)
          const to = parseFloat(changeTo)
          const diff = to - from
          return [
            { step: 1, desc: 'Find the difference', formula: `${to} - ${from} = ${diff.toFixed(2)}` },
            { step: 2, desc: 'Divide by original', formula: `${diff.toFixed(2)} ÷ ${from} = ${(diff / from).toFixed(4)}` },
            { step: 3, desc: 'Convert to percentage', formula: `${(diff / from).toFixed(4)} × 100 = ${changeResult.percent.toFixed(2)}%` },
            { step: 4, desc: 'Result', formula: `${changeResult.percent.toFixed(2)}% ${changeResult.type}` },
          ]
        }
        return []
      case 'what':
        if (whatResult !== null) {
          const v = parseFloat(whatValue)
          const t = parseFloat(whatTotal)
          return [
            { step: 1, desc: 'Divide the part by whole', formula: `${v} ÷ ${t} = ${(v / t).toFixed(4)}` },
            { step: 2, desc: 'Convert to percentage', formula: `${(v / t).toFixed(4)} × 100 = ${whatResult.toFixed(2)}%` },
            { step: 3, desc: 'Result', formula: `${v} is ${whatResult.toFixed(2)}% of ${t}` },
          ]
        }
        return []
      case 'discount':
        if (discountResult) {
          const p = parseFloat(originalPrice)
          const d = parseFloat(discountPercent)
          return [
            { step: 1, desc: 'Calculate discount amount', formula: `${p} × ${d}% = $${discountResult.saved.toFixed(2)}` },
            { step: 2, desc: 'Subtract from original', formula: `$${p} - $${discountResult.saved.toFixed(2)} = $${discountResult.final.toFixed(2)}` },
            { step: 3, desc: 'Result', formula: `You pay $${discountResult.final.toFixed(2)}, save $${discountResult.saved.toFixed(2)}` },
          ]
        }
        return []
      case 'tip':
        if (tipResult) {
          const b = parseFloat(billAmount)
          const t = parseFloat(tipPercent)
          return [
            { step: 1, desc: 'Calculate tip amount', formula: `$${b} × ${t}% = $${tipResult.tip.toFixed(2)}` },
            { step: 2, desc: 'Add to bill', formula: `$${b} + $${tipResult.tip.toFixed(2)} = $${tipResult.total.toFixed(2)}` },
            ...(parseInt(splitCount) > 1 ? [{ step: 3, desc: 'Split between people', formula: `$${tipResult.total.toFixed(2)} ÷ ${splitCount} = $${tipResult.perPerson.toFixed(2)} each` }] : []),
          ]
        }
        return []
      default:
        return []
    }
  }

  const getVisualPercent = () => {
    switch (activeTab) {
      case 'basic':
        return basicResult !== null ? Math.min(100, parseFloat(basicPercent)) : 0
      case 'what':
        return whatResult !== null ? Math.min(100, whatResult) : 0
      case 'discount':
        return discountResult ? parseFloat(discountPercent) : 0
      case 'tip':
        return tipResult ? parseFloat(tipPercent) : 0
      default:
        return 0
    }
  }

  const hasResult = getCurrentResult() !== ''

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All calculations done locally
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-1.5 mb-4">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`min-h-[44px] flex-1 px-2 py-2.5 rounded-lg font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] sm:text-sm">
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Content */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-4">
        {/* Basic Percentage */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">What is X% of Y?</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-400">What is</span>
              <input
                type="number"
                inputMode="decimal"
                value={basicPercent}
                onChange={(e) => setBasicPercent(e.target.value)}
                placeholder="10"
                className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center focus:outline-none focus:border-cyan-400"
              />
              <span className="text-gray-400">% of</span>
              <input
                type="number"
                inputMode="decimal"
                value={basicValue}
                onChange={(e) => setBasicValue(e.target.value)}
                placeholder="200"
                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center focus:outline-none focus:border-cyan-400"
              />
              <span className="text-gray-400">?</span>
            </div>
            {basicResult !== null && (
              <>
                <div className="bg-cyan-600/20 rounded-xl p-4 border border-cyan-600/30">
                  <p className="text-gray-400 text-sm mb-1">Result</p>
                  <p className="text-3xl font-bold text-white">{basicResult.toFixed(2)}</p>
                </div>
                {/* Visual Bar */}
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, parseFloat(basicPercent) || 0)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Percentage Change */}
        {activeTab === 'change' && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Percentage Change</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">From</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={changeFrom}
                  onChange={(e) => setChangeFrom(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">To</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={changeTo}
                  onChange={(e) => setChangeTo(e.target.value)}
                  placeholder="125"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            {changeResult && (
              <div className={`rounded-xl p-4 border ${changeResult.type === 'increase' ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                <p className="text-gray-400 text-sm mb-1">Result</p>
                <div className="flex items-center gap-2">
                  {changeResult.type === 'increase' ? (
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                  <p className={`text-3xl font-bold ${changeResult.type === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                    {changeResult.percent.toFixed(2)}%
                  </p>
                  <span className="text-gray-400">{changeResult.type}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* What Percentage */}
        {activeTab === 'what' && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">X is what % of Y?</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Value (X)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={whatValue}
                  onChange={(e) => setWhatValue(e.target.value)}
                  placeholder="25"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Total (Y)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={whatTotal}
                  onChange={(e) => setWhatTotal(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            {whatResult !== null && (
              <>
                <div className="bg-cyan-600/20 rounded-xl p-4 border border-cyan-600/30">
                  <p className="text-gray-400 text-sm mb-1">Result</p>
                  <p className="text-3xl font-bold text-white">{whatResult.toFixed(2)}%</p>
                  <p className="text-gray-400 text-sm mt-1">{whatValue} is {whatResult.toFixed(2)}% of {whatTotal}</p>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, whatResult)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Discount Calculator */}
        {activeTab === 'discount' && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Discount Calculator</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Original Price</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Discount %</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="20"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            {discountResult && (
              <>
                <div className="bg-cyan-600/20 rounded-xl p-4 border border-cyan-600/30">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Final Price</p>
                      <p className="text-3xl font-bold text-white">${discountResult.final.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">You Save</p>
                      <p className="text-2xl font-bold text-green-400">${discountResult.saved.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${parseFloat(discountPercent) || 0}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Tip Calculator */}
        {activeTab === 'tip' && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Tip Calculator</h3>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Bill Amount</label>
              <input
                type="number"
                inputMode="decimal"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="50.00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Tip %</label>
              <div className="flex gap-2 mb-3">
                {TIP_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setTipPercent(preset.toString())
                      vibrate(30)
                    }}
                    className={`min-h-[44px] flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                      tipPercent === preset.toString()
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Split Between</label>
              <input
                type="number"
                inputMode="numeric"
                value={splitCount}
                onChange={(e) => setSplitCount(e.target.value)}
                min="1"
                placeholder="1"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {tipResult && (
              <div className="bg-cyan-600/20 rounded-xl p-4 border border-cyan-600/30">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Tip</p>
                    <p className="text-2xl font-bold text-white">${tipResult.tip.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">${tipResult.total.toFixed(2)}</p>
                  </div>
                  {parseInt(splitCount) > 1 && (
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-gray-400 text-sm mb-1">Each</p>
                      <p className="text-2xl font-bold text-green-400">${tipResult.perPerson.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {hasResult && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={copyResult}
              className={`min-h-[44px] flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                copied ? 'bg-green-500 text-white' : 'bg-cyan-600 text-white hover:bg-cyan-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
            <button
              onClick={saveToHistory}
              className="min-h-[44px] px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={clearAll}
              className="min-h-[44px] px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step by Step Toggle */}
        {hasResult && (
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="mt-4 w-full p-3 bg-white/5 rounded-lg flex items-center justify-between text-gray-400 hover:text-white transition-all"
          >
            <span className="text-sm">Show step-by-step</span>
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}

        {showSteps && (
          <div className="mt-3 space-y-2">
            {getStepByStep().map((item) => (
              <div key={item.step} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                    <p className="text-white font-mono text-sm">{item.formula}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              <span className="text-white font-medium">History ({history.length})</span>
            </div>
            {showHistory ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          
          {showHistory && (
            <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-2 max-h-60 overflow-y-auto">
              {history.map((item) => (
                <div key={item.id} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">{TABS.find(t => t.id === item.type)?.label}</p>
                    <p className="text-white text-sm">{item.formula} = <span className="text-cyan-400 font-medium">{item.result}</span></p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setHistory([])
                  vibrate(30)
                }}
                className="w-full p-2 text-red-400 text-xs hover:text-red-300 transition-all"
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Examples */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium mb-3">Quick Examples</h3>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="text-gray-400">20% off $50 = <span className="text-white font-medium">$40</span></div>
          <div className="text-gray-400">100 to 125 = <span className="text-white font-medium">25% up</span></div>
          <div className="text-gray-400">25 of 200 = <span className="text-white font-medium">12.5%</span></div>
          <div className="text-gray-400">15% tip on $60 = <span className="text-white font-medium">$9</span></div>
        </div>
      </div>
    </div>
  )
}