// app/components/ToolPageComponents.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Lock, Zap, HelpCircle, ChevronDown, Check, X, Info } from 'lucide-react'

// プライバシーバッジコンポーネント
export function PrivacyBadge() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-xl border border-green-500/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-400" />
          <div>
            <p className="font-semibold text-green-400">100% Private</p>
            <p className="text-xs text-gray-400">This tool works entirely in your browser</p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-green-400 hover:text-green-300 transition-colors"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-green-500/20 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">No files uploaded to servers</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">No personal data collected</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Works offline after loading</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Settings saved locally only</span>
          </div>

          <Link
            href="/faq#privacy"
            className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 mt-2"
          >
            <HelpCircle className="w-3 h-3" />
            Learn more about our privacy
          </Link>
        </div>
      )}
    </div>
  )
}

// コスト透明性表示コンポーネント
export function CostTransparency({
  toolId,
  isFree = true,
  apiCost = 0,
  userPrice = 0,
}: {
  toolId: string
  isFree?: boolean
  apiCost?: number
  userPrice?: number
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
        <Info className="w-4 h-4 text-cyan-400" />
        Cost Structure
      </h3>

      {isFree ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Server processing:</span>
            <span className="text-green-400 font-semibold">$0 (Browser only)</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">AI usage:</span>
            <span className="text-gray-300">None</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Storage:</span>
            <span className="text-gray-300">Local only</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-semibold">Your cost:</span>
              <span className="text-green-400 font-bold text-lg">Free Forever</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">API cost:</span>
            <span className="text-gray-300">${apiCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Maintenance (10%):</span>
            <span className="text-gray-300">${(userPrice - apiCost).toFixed(2)}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-semibold">Your cost:</span>
              <span className="text-yellow-400 font-bold text-lg">${userPrice.toFixed(2)}/use</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg">
        <p className="text-xs text-gray-300 italic">
          "If it doesn't cost us to run, it doesn't cost you to use."
        </p>
      </div>
    </div>
  )
}

// ツール使用統計コンポーネント
export function ToolStats({ toolId }: { toolId: string }) {
  const [stats, setStats] = useState({
    totalUses: 0,
    todayUses: 0,
    avgTime: '0s',
    satisfaction: 0,
  })

  useEffect(() => {
    // 統計データをシミュレート
    setStats({
      totalUses: Math.floor(Math.random() * 10000) + 1000,
      todayUses: Math.floor(Math.random() * 500) + 50,
      avgTime: `${Math.floor(Math.random() * 180) + 30}s`,
      satisfaction: Math.floor(Math.random() * 10) + 90,
    })
  }, [toolId])

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-cyan-400">{stats.totalUses.toLocaleString()}</p>
        <p className="text-xs text-gray-400">Total Uses</p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-purple-400">{stats.todayUses}</p>
        <p className="text-xs text-gray-400">Today</p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-green-400">{stats.avgTime}</p>
        <p className="text-xs text-gray-400">Avg. Time</p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-yellow-400">{stats.satisfaction}%</p>
        <p className="text-xs text-gray-400">Satisfaction</p>
      </div>
    </div>
  )
}

// 機能リストコンポーネント
export function FeatureList({ features }: { features: string[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Features</h3>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 使い方ステップコンポーネント
export function HowToUse({ steps }: { steps: string[] }) {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">How to Use</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs text-purple-400 font-bold">{index + 1}</span>
            </div>
            <p className="text-sm text-gray-300">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
