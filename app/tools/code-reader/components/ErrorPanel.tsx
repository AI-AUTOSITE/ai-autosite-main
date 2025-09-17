'use client'

import React, { useState } from 'react'
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Copy
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
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Count by severity
  const errorCount = errors.filter(e => e.severity === 'error').length
  const warningCount = errors.filter(e => e.severity === 'warning').length
  const infoCount = errors.filter(e => e.severity === 'info').length
  
  // Get status
  const hasErrors = errorCount > 0
  const hasWarnings = warningCount > 0
  const isClean = errors.length === 0
  
  // Copy error summary
  const copyErrorSummary = () => {
    const summary = `Code Analysis Summary:
• Errors: ${errorCount}
• Warnings: ${warningCount}
• Info: ${infoCount}

Top Issues:
${errors.slice(0, 5).map(e => `- ${e.file}: ${e.message}`).join('\n')}
`
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // If no errors, show clean status
  if (isClean) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-lg border border-green-500/30">
        <CheckCircle size={16} className="text-green-400" />
        <span className="text-sm text-green-400 font-medium">Clean</span>
      </div>
    )
  }
  
  return (
    <div className="relative">
      {/* Summary Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${
            hasErrors 
              ? 'bg-red-500/20 text-red-400 border-red-500/30' 
              : hasWarnings
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}
        >
          {hasErrors ? (
            <AlertCircle size={14} />
          ) : hasWarnings ? (
            <AlertTriangle size={14} />
          ) : (
            <AlertCircle size={14} />
          )}
          
          {/* Error counts */}
          <div className="flex items-center gap-2 text-sm">
            {errorCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="font-bold">{errorCount}</span>
                <span className="text-xs opacity-75">errors</span>
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="font-bold">{warningCount}</span>
                <span className="text-xs opacity-75">warnings</span>
              </span>
            )}
          </div>
          
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        
        {/* Quick actions */}
        {showDetails && (
          <button
            onClick={copyErrorSummary}
            className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-all"
            title="Copy error summary"
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>
      
      {/* Dropdown Details Panel */}
      {showDetails && (
        <div className="absolute top-full left-0 mt-2 w-96 max-h-96 overflow-auto bg-slate-900 rounded-lg border border-white/10 shadow-2xl z-50">
          <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-3 flex justify-between items-center">
            <h4 className="text-sm font-semibold text-white">Code Analysis Details</h4>
            <button
              onClick={() => setShowDetails(false)}
              className="p-1 hover:bg-white/10 rounded transition-all"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
          
          <div className="p-3 space-y-2">
            {/* Errors first */}
            {errors
              .filter(e => e.severity === 'error')
              .slice(0, 3)
              .map((error, i) => (
                <div
                  key={`error-${i}`}
                  className="p-2 bg-red-500/10 rounded border border-red-500/20 cursor-pointer hover:bg-red-500/20 transition-all"
                  onClick={() => {
                    onFileClick?.(error.file)
                    setShowDetails(false)
                  }}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-red-400 font-medium">
                        {error.file.split('/').pop()}
                        {error.line && <span className="opacity-75"> (line {error.line})</span>}
                      </div>
                      <div className="text-xs text-gray-300 mt-0.5">{error.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            
            {/* Warnings */}
            {errors
              .filter(e => e.severity === 'warning')
              .slice(0, 3)
              .map((warning, i) => (
                <div
                  key={`warning-${i}`}
                  className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20 transition-all"
                  onClick={() => {
                    onFileClick?.(warning.file)
                    setShowDetails(false)
                  }}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-yellow-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-yellow-400 font-medium">
                        {warning.file.split('/').pop()}
                      </div>
                      <div className="text-xs text-gray-300 mt-0.5">{warning.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            
            {/* Show more indicator */}
            {errors.length > 6 && (
              <div className="text-center text-xs text-gray-400 pt-2">
                And {errors.length - 6} more issues...
              </div>
            )}
          </div>
          
          {/* Quick stats at bottom */}
          <div className="border-t border-white/10 p-3 bg-slate-800/50">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold text-red-400">{errorCount}</div>
                <div className="text-gray-500">Errors</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-400">{warningCount}</div>
                <div className="text-gray-500">Warnings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-400">{infoCount}</div>
                <div className="text-gray-500">Info</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}