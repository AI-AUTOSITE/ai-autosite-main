'use client'

import { X, CheckCircle, XCircle, Clock } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface HistoryEntry {
  id: string
  fileName: string
  date: string
  customFields?: string
  success: boolean
}

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryEntry[]
}

export default function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg 
                   max-h-[90vh] flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <div className="pr-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">History</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Recent extractions</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 min-w-[44px] min-h-[44px] hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {history.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Clock className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No history yet</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Your extractions will appear here</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700 
                           hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {entry.success ? (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-sm sm:text-base text-white font-medium truncate">
                          {entry.fileName}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-gray-400">
                        <span>{formatDate(entry.date)}</span>
                        {entry.customFields && (
                          <span className="text-cyan-400 truncate">
                            Fields: {entry.customFields}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.success
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {entry.success ? 'OK' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 min-h-[44px] bg-slate-700 hover:bg-slate-600 text-white 
                     rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}