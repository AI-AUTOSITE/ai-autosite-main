'use client'

import React, { useState } from 'react'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  FileWarning,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  BookOpen,
  Sparkles,
  Shield,
  Package
} from 'lucide-react'

interface CodeError {
  type: 'unresolved_import' | 'circular_dependency' | 'missing_export' | 'unused_file' | 'type_error'
  severity: 'error' | 'warning' | 'info'
  file: string
  line?: number
  message: string
  details?: string
  quickFix?: string
}

interface ErrorPanelProps {
  errors: CodeError[]
  onFileClick?: (filePath: string) => void
}

export default function ErrorPanel({ errors, onFileClick }: ErrorPanelProps) {
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<'real' | 'external' | 'info' | 'all'>('real')
  const [copied, setCopied] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  
  // エラーを初心者向けに分類
  const categorizeErrors = () => {
    const external = errors.filter(e => 
      e.type === 'missing_export' && 
      (e.details?.includes('lucide-react') || 
       e.details?.includes('next') || 
       e.details?.includes('react'))
    )
    
    const realProblems = errors.filter(e => 
      e.severity === 'error' && 
      !external.includes(e) &&
      e.type !== 'missing_export'
    )
    
    const suggestions = errors.filter(e => 
      e.severity === 'warning' && 
      !external.includes(e)
    )
    
    const info = errors.filter(e => 
      e.severity === 'info' && 
      !external.includes(e)
    )
    
    return { external, realProblems, suggestions, info }
  }
  
  const { external, realProblems, suggestions, info } = categorizeErrors()
  
  // フィルタに応じたエラーを取得
  const getFilteredErrors = () => {
    switch (filter) {
      case 'real':
        return [...realProblems, ...suggestions]
      case 'external':
        return external
      case 'info':
        return info
      case 'all':
        return errors
      default:
        return errors
    }
  }
  
  const filteredErrors = getFilteredErrors()
  
  // グループ化
  const errorsByFile = filteredErrors.reduce((acc, error, index) => {
    if (!acc[error.file]) {
      acc[error.file] = []
    }
    acc[error.file].push({ ...error, index })
    return acc
  }, {} as Record<string, (CodeError & { index: number })[]>)
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="text-red-400" size={16} />
      case 'warning':
        return <AlertTriangle className="text-yellow-400" size={16} />
      case 'info':
        return <Info className="text-blue-400" size={16} />
      default:
        return <Info className="text-gray-400" size={16} />
    }
  }
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'info':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }
  
  const getBeginnerFriendlyMessage = (error: CodeError): string => {
    // 初心者向けにメッセージを変換
    if (error.type === 'missing_export' && error.details?.includes('lucide-react')) {
      return '📦 外部ライブラリのアイコン（正常）'
    }
    if (error.type === 'type_error' && error.message.includes("Avoid using 'any'")) {
      return '💡 型定義を改善できます'
    }
    if (error.type === 'unused_file') {
      return '📄 使われていないファイル'
    }
    if (error.type === 'circular_dependency') {
      return '🔄 ファイルが相互参照しています'
    }
    if (error.type === 'unresolved_import') {
      return '❓ ファイルが見つかりません'
    }
    if (error.message.includes('declared but never used')) {
      return '💤 使われていない変数'
    }
    return error.message
  }
  
  const getBeginnerFriendlyDetails = (error: CodeError): string | undefined => {
    if (error.type === 'missing_export' && error.details?.includes('lucide-react')) {
      return 'これは問題ありません。外部ライブラリは別途インストールされています。'
    }
    if (error.type === 'type_error' && error.message.includes("Avoid using 'any'")) {
      return 'TypeScriptでは具体的な型を指定することで、エラーを事前に防げます。'
    }
    if (error.type === 'unused_file') {
      return 'このファイルは他のファイルから使われていません。削除を検討してください。'
    }
    return error.details
  }
  
  const toggleError = (index: number) => {
    const newExpanded = new Set(expandedErrors)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedErrors(newExpanded)
  }
  
  const copyErrorReport = () => {
    const report = generateBeginnerReport()
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const generateBeginnerReport = () => {
    let report = '# コード分析レポート\n\n'
    report += `作成日時: ${new Date().toLocaleString('ja-JP')}\n\n`
    
    if (realProblems.length > 0) {
      report += `## 🚨 修正が必要な問題 (${realProblems.length}件)\n`
      realProblems.forEach(e => {
        report += `- ${e.file} - ${getBeginnerFriendlyMessage(e)}\n`
      })
      report += '\n'
    }
    
    if (suggestions.length > 0) {
      report += `## 💡 改善の提案 (${suggestions.length}件)\n`
      suggestions.forEach(e => {
        report += `- ${e.file} - ${getBeginnerFriendlyMessage(e)}\n`
      })
      report += '\n'
    }
    
    report += '## 📊 要約\n'
    report += `- 重要な問題: ${realProblems.length}件\n`
    report += `- 改善提案: ${suggestions.length}件\n`
    report += `- 外部ライブラリ関連: ${external.length}件（無視して大丈夫）\n`
    
    return report
  }
  
  if (errors.length === 0) {
    return (
      <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-400" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-green-400">すべて正常です！</h3>
            <p className="text-sm text-gray-400 mt-1">コードに問題は見つかりませんでした。</p>
          </div>
        </div>
      </div>
    )
  }
  
  // 初心者向けサマリー
  const hasRealProblems = realProblems.length > 0
  const onlyExternalErrors = external.length > 0 && realProblems.length === 0 && suggestions.length === 0
  
  return (
    <div className="bg-white/5 rounded-lg border border-white/10">
      {/* 初心者向けステータスバー */}
      <div className={`p-4 border-b border-white/10 ${
        hasRealProblems ? 'bg-red-500/5' : 
        onlyExternalErrors ? 'bg-green-500/5' : 
        'bg-yellow-500/5'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasRealProblems ? (
              <AlertCircle className="text-red-400" size={20} />
            ) : onlyExternalErrors ? (
              <Shield className="text-green-400" size={20} />
            ) : (
              <AlertTriangle className="text-yellow-400" size={20} />
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {hasRealProblems ? '修正が必要な問題があります' :
                 onlyExternalErrors ? '問題ありません（外部ライブラリの通知のみ）' :
                 '改善できる箇所があります'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {hasRealProblems ? `${realProblems.length}件の問題を見つけました` :
                 onlyExternalErrors ? '外部ライブラリの検出は正常な動作です' :
                 `${suggestions.length}件の改善提案があります`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            title="ヘルプ"
          >
            <BookOpen size={16} className="text-gray-300" />
          </button>
        </div>
      </div>
      
      {/* ヘルプセクション */}
      {showHelp && (
        <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="text-blue-400 mt-0.5" size={16} />
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-blue-400 mb-2">初心者ガイド</p>
              <div className="space-y-1">
                <p>🚨 <strong className="text-red-400">赤色のエラー</strong> = すぐに修正が必要</p>
                <p>⚠️ <strong className="text-yellow-400">黄色の警告</strong> = 改善した方が良い</p>
                <p>📦 <strong className="text-green-400">外部ライブラリ</strong> = 無視してOK</p>
                <p>ℹ️ <strong className="text-blue-400">青色の情報</strong> = 参考情報</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* フィルタタブ（初心者向けに簡略化） */}
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setFilter('real')}
            className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
              filter === 'real'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <AlertTriangle size={14} />
            重要 ({realProblems.length + suggestions.length})
          </button>
          <button
            onClick={() => setFilter('external')}
            className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
              filter === 'external'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Package size={14} />
            外部ライブラリ ({external.length})
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 ${
              filter === 'info'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Info size={14} />
            その他 ({info.length})
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={copyErrorReport}
            className="flex-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded text-sm hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-1 border border-cyan-500/30"
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? 'コピー完了！' : 'レポートをコピー'}
          </button>
        </div>
      </div>
      
      {/* Error list */}
      <div className="max-h-96 overflow-y-auto">
        {filteredErrors.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No issues in this category</p>
          </div>
        ) : (
          Object.entries(errorsByFile).map(([file, fileErrors]) => (
            <div key={file} className="border-b border-white/5 last:border-b-0">
              <div className="p-3 bg-white/5">
                <button
                  onClick={() => onFileClick?.(file)}
                  className="text-sm font-medium text-cyan-400 hover:underline"
                >
                  {file.split('/').pop()}
                </button>
                <span className="text-xs text-gray-500 ml-2">
                  ({fileErrors.length} issue{fileErrors.length !== 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="space-y-1 p-2">
                {fileErrors.map(error => {
                  const friendlyMessage = getBeginnerFriendlyMessage(error)
                  const friendlyDetails = getBeginnerFriendlyDetails(error)
                  
                  return (
                    <div
                      key={error.index}
                      className={`rounded-lg border p-3 ${getSeverityColor(error.severity)}`}
                    >
                      <div 
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => toggleError(error.index)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {expandedErrors.has(error.index) ? 
                            <ChevronDown size={14} /> : 
                            <ChevronRight size={14} />
                          }
                          {getSeverityIcon(error.severity)}
                          <span className="text-sm font-medium">
                            {friendlyMessage}
                            {error.line && (
                              <span className="text-xs opacity-70 ml-2">
                                Line {error.line}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      {expandedErrors.has(error.index) && (
                        <div className="mt-2 pl-8 space-y-1">
                          {friendlyDetails && (
                            <div className="text-xs opacity-80">
                              <span className="font-medium">Details:</span> {friendlyDetails}
                            </div>
                          )}
                          {error.quickFix && (
                            <div className="text-xs text-green-400">
                              <span className="font-medium">How to fix:</span> {error.quickFix}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Beginner-friendly explanation */}
      {filter === 'external' && external.length > 0 && (
        <div className="p-4 bg-green-500/10 border-t border-green-500/20">
          <div className="flex items-start gap-2">
            <Shield className="text-green-400 mt-0.5" size={16} />
            <div className="text-sm text-green-400">
              <p className="font-semibold mb-1">These are not problems</p>
              <p className="text-green-400/80">
                External libraries (like lucide-react, Next.js, etc.) are installed separately in your project,
                so these errors don't affect your app's functionality.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}