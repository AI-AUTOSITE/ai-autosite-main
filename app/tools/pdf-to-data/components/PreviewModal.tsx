'use client'

import { X, Download } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  csvContent: string
  fileName: string
  csvUrl: string
  excelUrl: string
}

export default function PreviewModal({
  isOpen,
  onClose,
  csvContent,
  fileName,
  csvUrl,
  excelUrl,
}: PreviewModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  // Parse CSV for table display (first 10 rows)
  const rows = csvContent.split('\n').slice(0, 10)
  const headers = rows[0]?.split(',') || []
  const dataRows = rows.slice(1)

  const modalContent = (
    <div
      className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl 
                   max-h-[90vh] flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <div className="pr-4 flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white">Preview</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">{fileName}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 min-w-[44px] min-h-[44px] hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Preview Content - Horizontally scrollable on mobile */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-800">
                    {headers.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold 
                                 text-gray-300 uppercase tracking-wider border-b border-slate-700 
                                 whitespace-nowrap"
                      >
                        {header.replace(/"/g, '').trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rowIdx) => {
                    const cells = row.split(',')
                    return (
                      <tr key={rowIdx} className="hover:bg-slate-800/50 transition-colors">
                        {cells.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-3 sm:px-4 py-2 sm:py-3 text-gray-300 border-b 
                                     border-slate-800 whitespace-nowrap"
                          >
                            {cell.replace(/"/g, '').trim()}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {rows.length > 10 && (
            <p className="text-xs text-gray-500 mt-3 text-center">
              Showing first 10 rows
            </p>
          )}
        </div>

        {/* Actions - Mobile optimized */}
        <div className="p-4 sm:p-6 border-t border-slate-700 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="order-2 sm:order-1 px-4 py-2.5 min-h-[44px] text-gray-400 
                     hover:text-white transition-colors"
          >
            Close
          </button>

          <div className="order-1 sm:order-2 flex gap-2">
            {csvUrl && (
              <a
                href={csvUrl}
                download={fileName.replace('.pdf', '.csv')}
                className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 min-h-[44px] 
                         bg-gradient-to-r from-cyan-500 to-blue-500 
                         hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg 
                         font-medium transition-all hover:scale-105
                         flex items-center justify-center gap-2"
                onClick={onClose}
              >
                <Download className="w-4 h-4" />
                <span className="sm:hidden">CSV</span>
                <span className="hidden sm:inline">Download CSV</span>
              </a>
            )}

            {excelUrl && (
              <a
                href={excelUrl}
                download={fileName.replace('.pdf', '.xlsx')}
                className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 min-h-[44px] 
                         bg-gradient-to-r from-green-500 to-emerald-500 
                         hover:from-green-600 hover:to-emerald-600 text-white rounded-lg 
                         font-medium transition-all hover:scale-105
                         flex items-center justify-center gap-2"
                onClick={onClose}
              >
                <Download className="w-4 h-4" />
                <span className="sm:hidden">Excel</span>
                <span className="hidden sm:inline">Download Excel</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}