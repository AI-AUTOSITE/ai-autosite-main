// app/components/LiveActivity.tsx
'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, Activity } from 'lucide-react'

interface LiveStats {
  currentUsers: number
  todayTotal: number
  trending: boolean
  popularTools: string[]
}

export function LiveActivity({ toolName }: { toolName?: string }) {
  const [stats, setStats] = useState<LiveStats>({
    currentUsers: 0,
    todayTotal: 0,
    trending: false,
    popularTools: [],
  })

  useEffect(() => {
    // シミュレートされたデータ（本番環境ではAPIから取得）
    const simulateStats = () => {
      setStats({
        currentUsers: Math.floor(Math.random() * 50) + 10,
        todayTotal: Math.floor(Math.random() * 5000) + 1000,
        trending: Math.random() > 0.7,
        popularTools: ['PDF Tools', 'Code Reader', 'JSON Format'],
      })
    }

    // 初回データ取得
    simulateStats()

    // 5秒ごとに更新
    const interval = setInterval(simulateStats, 5000)

    return () => clearInterval(interval)
  }, [toolName])

  return (
    // ✅ translate-y-2 を削除、opacity のみのアニメーション
    // ✅ min-h で高さを事前確保（レイアウトシフト防止）
    <div className="transition-opacity duration-500 opacity-100 min-h-[160px]">
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-400">Live Activity</span>
          </div>

          {stats.trending && (
            <span className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.currentUsers}</p>
              <p className="text-xs text-gray-400">Active now</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.todayTotal.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Uses today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// グローバル統計表示コンポーネント
export function GlobalStats() {
  const [stats] = useState({
    totalUsers: '12.5k',
    totalUses: '2.3M',
    toolsAvailable: 25,
    satisfaction: '99%',
  })

  return (
    // ✅ min-h で高さを事前確保
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 min-h-[100px]">
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
        <p className="text-2xl font-bold text-cyan-400">{stats.totalUsers}</p>
        <p className="text-xs text-gray-400 mt-1">Total Users</p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
        <p className="text-2xl font-bold text-purple-400">{stats.totalUses}</p>
        <p className="text-xs text-gray-400 mt-1">Total Uses</p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
        <p className="text-2xl font-bold text-green-400">{stats.toolsAvailable}</p>
        <p className="text-xs text-gray-400 mt-1">Tools Available</p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center">
        <p className="text-2xl font-bold text-yellow-400">{stats.satisfaction}</p>
        <p className="text-xs text-gray-400 mt-1">Satisfaction</p>
      </div>
    </div>
  )
}