'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, TrendingDown, Tag, DollarSign, Percent } from 'lucide-react'

type CalculationType = 'basic' | 'change' | 'what' | 'discount' | 'tip'

interface TabConfig {
  id: CalculationType
  label: string
  icon: React.ReactNode
}

const TABS: TabConfig[] = [
  { id: 'basic', label: 'Basic', icon: <Percent className="w-4 h-4" /> },
  { id: 'change', label: 'Change', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'what', label: 'What %', icon: <Calculator className="w-4 h-4" /> },
  { id: 'discount', label: 'Discount', icon: <Tag className="w-4 h-4" /> },
  { id: 'tip', label: 'Tip', icon: <DollarSign className="w-4 h-4" /> },
]

const TIP_PRESETS = [10, 15, 18, 20, 25]

export default function PercentageCalculatorClient() {
  const [activeTab, setActiveTab] = useState<CalculationType>('basic')

  // Basic: X% of Y
  const [basicPercent, setBasicPercent] = useState('')
  const [basicValue, setBasicValue] = useState('')
  const [basicResult, setBasicResult] = useState<number | null>(null)

  // Change: From X to Y
  const [changeFrom, setChangeFrom] = useState('')
  const [changeTo, setChangeTo] = useState('')
  const [changeResult, setChangeResult] = useState<{
    percent: number
    type: 'increase' | 'decrease'
  } | null>(null)

  // What: X is what % of Y
  const [whatValue, setWhatValue] = useState('')
  const [whatTotal, setWhatTotal] = useState('')
  const [whatResult, setWhatResult] = useState<number | null>(null)

  // Discount
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [discountResult, setDiscountResult] = useState<{ final: number; saved: number } | null>(
    null
  )

  // Tip
  const [billAmount, setBillAmount] = useState('')
  const [tipPercent, setTipPercent] = useState('15')
  const [splitCount, setSplitCount] = useState('1')
  const [tipResult, setTipResult] = useState<{
    tip: number
    total: number
    perPerson: number
  } | null>(null)

  // Calculate Basic Percentage
  useEffect(() => {
    if (basicPercent && basicValue) {
      const percent = parseFloat(basicPercent)
      const value = parseFloat(basicValue)
      if (!isNaN(percent) && !isNaN(value)) {
        setBasicResult((percent / 100) * value)
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
        setWhatResult((value / total) * 100)
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
      } else {
        setTipResult(null)
      }
    } else {
      setTipResult(null)
    }
  }, [billAmount, tipPercent, splitCount])

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
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Tab Navigation - Tool First */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-1.5 mb-6">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Content */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        {/* Basic Percentage */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Calculate X% of Y</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Percentage (%)</label>
                <input
                  type="number"
                  value={basicPercent}
                  onChange={(e) => setBasicPercent(e.target.value)}
                  placeholder="25"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Value</label>
                <input
                  type="number"
                  value={basicValue}
                  onChange={(e) => setBasicValue(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
            {basicResult !== null && (
              <div className="bg-cyan-600/20 rounded-xl p-4 border border-cyan-600/30">
                <p className="text-gray-400 text-sm mb-1">Result</p>
                <p className="text-3xl font-bold text-white">{basicResult.toFixed(2)}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {basicPercent}% of {basicValue} = {basicResult.toFixed(2)}
                </p>
              </div>
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
                  value={changeFrom}
                  onChange={(e) => setChangeFrom(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">To</label>
                <input
                  type="number"
                  value={changeTo}
                  onChange={(e) => setChangeTo(e.target.value)}
                  placeholder="150"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
            {changeResult && (
              <div
                className={`${
                  changeResult.type === 'increase'
                    ? 'bg-green-500/20 border-green-500/30'
                    : 'bg-red-500/20 border-red-500/30'
                } rounded-xl p-4 border`}
              >
                <p className="text-gray-400 text-sm mb-1">
                  {changeResult.type === 'increase' ? 'Increase' : 'Decrease'}
                </p>
                <p className="text-3xl font-bold text-white flex items-center gap-2">
                  {changeResult.type === 'increase' ? (
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-400" />
                  )}
                  {changeResult.percent.toFixed(2)}%
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  From {changeFrom} to {changeTo}
                </p>
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
                  value={whatValue}
                  onChange={(e) => setWhatValue(e.target.value)}
                  placeholder="25"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Total (Y)</label>
                <input
                  type="number"
                  value={whatTotal}
                  onChange={(e) => setWhatTotal(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
            {whatResult !== null && (
              <div className="bg-cyan-600/20 rounded-xl p-4 border border-cyan-600/30">
                <p className="text-gray-400 text-sm mb-1">Result</p>
                <p className="text-3xl font-bold text-white">{whatResult.toFixed(2)}%</p>
                <p className="text-gray-400 text-sm mt-1">
                  {whatValue} is {whatResult.toFixed(2)}% of {whatTotal}
                </p>
              </div>
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
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Discount %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="20"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
            {discountResult && (
              <div className="bg-cyan-600/20 rounded-xl p-4 border border-cyan-600/30">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Final Price</p>
                    <p className="text-3xl font-bold text-white">
                      ${discountResult.final.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">You Save</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${discountResult.saved.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
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
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="50.00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Tip %</label>
              <div className="flex gap-2 mb-3">
                {TIP_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTipPercent(preset.toString())}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                      tipPercent === preset.toString()
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value)}
                placeholder="15"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Split Between</label>
              <input
                type="number"
                value={splitCount}
                onChange={(e) => setSplitCount(e.target.value)}
                min="1"
                placeholder="1"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
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
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Each</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${tipResult.perPerson.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clear Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Examples - Simplified */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <h3 className="text-white font-medium mb-3">Quick Examples</h3>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="text-gray-400">
            20% off $50 = <span className="text-white font-medium">$40</span>
          </div>
          <div className="text-gray-400">
            100 to 125 = <span className="text-white font-medium">25% up</span>
          </div>
          <div className="text-gray-400">
            25 of 200 = <span className="text-white font-medium">12.5%</span>
          </div>
          <div className="text-gray-400">
            15% tip on $60 = <span className="text-white font-medium">$9</span>
          </div>
        </div>
      </div>
    </div>
  )
}
