// app/components/CrossSell.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Sparkles, Users, TrendingUp, Zap } from 'lucide-react'
import { TOOLS, getToolsByCategory, Tool } from '../lib/categories.config'

interface RelatedTool extends Tool {
  correlationScore: number
  sharedUsers: number
  matchReasons: string[]
}

// 関連性スコアの計算ロジック
const calculateCorrelation = (currentTool: Tool, targetTool: Tool): { score: number; reasons: string[] } => {
  let score = 0
  const reasons: string[] = []
  
  // 1. 同じカテゴリ（+40点）
  if (currentTool.category === targetTool.category) {
    score += 40
    reasons.push('Same category')
  }
  
  // 2. タグの重複（各タグ+15点、最大45点）
  const currentTags = currentTool.tags || []
  const targetTags = targetTool.tags || []
  const sharedTags = currentTags.filter(tag => targetTags.includes(tag))
  if (sharedTags.length > 0) {
    score += Math.min(sharedTags.length * 15, 45)
    reasons.push(`${sharedTags.length} shared tags`)
  }
  
  // 3. 処理タイプの一致（+20点）
  if (currentTool.dataProcessing === targetTool.dataProcessing) {
    score += 20
    reasons.push('Similar processing')
  }
  
  // 4. API要件の一致（+10点）
  if (currentTool.apiRequired === targetTool.apiRequired) {
    score += 10
  }
  
  // 5. 難易度の近さ（+15点）
  const difficultyMap: Record<string, number> = {
    'Simple': 1,
    'Intermediate': 2,
    'Advanced': 3
  }
  const currentDiff = difficultyMap[currentTool.difficulty || 'Simple']
  const targetDiff = difficultyMap[targetTool.difficulty || 'Simple']
  if (Math.abs(currentDiff - targetDiff) <= 1) {
    score += 15
  }
  
  // 6. 補完関係の検出（特定のパターン）
  const complementaryPairs: Record<string, string[]> = {
    'pdf-tools': ['ai-summarizer', 'pdf-summarizer'],
    'ai-summarizer': ['pdf-tools', 'text-case'],
    'code-reader': ['json-format', 'tech-stack-analyzer'],
    'json-format': ['code-reader', 'api-testing'],
    'text-case': ['ai-summarizer', 'json-format'],
  }
  
  if (complementaryPairs[currentTool.id]?.includes(targetTool.id)) {
    score += 25
    reasons.push('Complementary tools')
  }
  
  // 7. 人気度ボーナス（+5点）
  if (targetTool.featured) {
    score += 5
    reasons.push('Popular')
  }
  
  // 8. 新しいツールボーナス（+3点）
  if (targetTool.new) {
    score += 3
    reasons.push('New')
  }
  
  return { score: Math.min(score, 100), reasons }
}

// ユーザー数の推定（実際のデータがない場合のシミュレーション）
const estimateSharedUsers = (tool: Tool, correlationScore: number): number => {
  // ベースユーザー数（人気度から推定）
  const baseUsers = tool.featured ? 1000 : 
                    tool.new ? 200 : 
                    500
  
  // users プロパティから実際の数値を抽出
  const actualUsers = tool.users ? 
    parseInt(tool.users.replace(/[^0-9]/g, '')) * (tool.users.includes('k') ? 1000 : 1) : 
    baseUsers
  
  // 相関スコアに基づいて共有ユーザー数を計算
  const sharedPercentage = (correlationScore / 100) * 0.7 // 最大70%が重複
  return Math.floor(actualUsers * sharedPercentage)
}

export function PeopleAlsoUse({ currentToolId }: { currentToolId: string }) {
  const [relatedTools, setRelatedTools] = useState<RelatedTool[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // セッション内の閲覧履歴を管理
    const visited = JSON.parse(sessionStorage.getItem('visitedTools') || '[]')
    if (!visited.includes(currentToolId)) {
      visited.push(currentToolId)
      sessionStorage.setItem('visitedTools', JSON.stringify(visited))
    }
    
    // 動的に関連ツールを計算
    const calculateRelatedTools = () => {
      const currentTool = TOOLS.find(t => t.id === currentToolId)
      if (!currentTool) return []
      
      // すべてのツールとの関連性を計算
      const toolsWithScores = TOOLS
        .filter(t => t.id !== currentToolId && t.status === 'live')
        .map(tool => {
          const { score, reasons } = calculateCorrelation(currentTool, tool)
          const sharedUsers = estimateSharedUsers(tool, score)
          
          return {
            ...tool,
            correlationScore: score,
            sharedUsers,
            matchReasons: reasons
          }
        })
        .filter(t => t.correlationScore > 30) // 30%以上の関連性のみ
        .sort((a, b) => b.correlationScore - a.correlationScore)
        .slice(0, 3)
      
      return toolsWithScores
    }
    
    // データ取得をシミュレート（実際はすぐに計算可能）
    setTimeout(() => {
      setRelatedTools(calculateRelatedTools())
      setLoading(false)
    }, 200)
  }, [currentToolId])
  
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Users className="w-5 h-5 text-cyan-400" />
          People also use
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-700/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (relatedTools.length === 0) return null
  
  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
        <Users className="w-5 h-5 text-cyan-400" />
        People also use
        <span className="text-xs text-gray-400 ml-auto">
          Dynamically matched
        </span>
      </h3>
      
      <div className="space-y-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.url}
            className="block group hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{tool.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {tool.description}
                  </p>
                  {/* マッチ理由の表示 */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tool.matchReasons.slice(0, 2).map((reason, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400/80 rounded"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-right flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-1 text-sm">
                    {tool.correlationScore >= 70 ? (
                      <Zap className="w-3 h-3 text-yellow-400" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    )}
                    <span className={`font-semibold ${
                      tool.correlationScore >= 70 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {tool.correlationScore}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {tool.sharedUsers.toLocaleString()} users
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          href="/tools"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Explore all tools
        </Link>
      </div>
    </div>
  )
}

// 使用パターン分析コンポーネント
export function UsagePatterns({ toolId }: { toolId: string }) {
  const [patterns, setPatterns] = useState<any>(null)
  
  useEffect(() => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    
    // ツールの特性から使用パターンを動的に生成
    const tool = TOOLS.find(t => t.id === toolId)
    if (!tool) return
    
    // カテゴリベースのワークフロー生成
    const generateWorkflows = () => {
      const workflows: string[] = []
      
      if (tool.category === 'productivity-tools') {
        workflows.push('Import → Process → Export')
        workflows.push('Analyze → Optimize → Save')
      } else if (tool.category === 'developer-tools') {
        workflows.push('Code → Analyze → Refactor')
        workflows.push('Debug → Test → Deploy')
      } else if (tool.category === 'ai-tools') {
        workflows.push('Input → AI Process → Review')
        workflows.push('Generate → Edit → Finalize')
      } else {
        workflows.push('Select → Transform → Download')
        workflows.push('Upload → Process → Share')
      }
      
      if (tool.apiRequired) {
        workflows.push('Connect → Sync → Update')
      }
      
      return workflows.slice(0, 3)
    }
    
    // 平均使用時間を難易度から推定
    const avgTimeMap: Record<string, string> = {
      'Simple': '2-3 minutes',
      'Intermediate': '5-7 minutes',
      'Advanced': '10-15 minutes'
    }
    
    setPatterns({
      timeOfDay,
      commonWorkflows: generateWorkflows(),
      peakHours: tool.featured ? '9-11 AM, 2-4 PM' : '2-4 PM UTC',
      averageTime: avgTimeMap[tool.difficulty || 'Simple']
    })
  }, [toolId])
  
  if (!patterns) return null
  
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-cyan-400" />
        Usage Insights
      </h4>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Peak usage:</span>
          <span className="text-gray-300">{patterns.peakHours}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Avg. session:</span>
          <span className="text-gray-300">{patterns.averageTime}</span>
        </div>
        <div className="mt-3">
          <p className="text-gray-400 mb-2">Common workflows:</p>
          <div className="space-y-1">
            {patterns.commonWorkflows.map((flow: string, i: number) => (
              <div key={i} className="text-gray-500 text-xs flex items-start gap-1">
                <span className="text-cyan-400 mt-0.5">→</span>
                <span>{flow}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// デフォルトエクスポート（互換性のため）
export default PeopleAlsoUse