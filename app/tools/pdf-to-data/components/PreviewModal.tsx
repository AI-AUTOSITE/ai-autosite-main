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
  excelUrl
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
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">Preview Extracted Data</h2>
            <p className="text-sm text-gray-400 mt-1">{fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800">
                    {headers.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-slate-700"
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
                      <tr
                        key={rowIdx}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        {cells.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-4 py-3 text-gray-300 border-b border-slate-800"
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
              Showing first 10 rows. Download to see full data.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-700 flex gap-3 justify-end flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          
          {csvUrl && (
            <a
              href={csvUrl}
              download={fileName.replace('.pdf', '.csv')}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 
                       hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg 
                       font-medium transition-all hover:scale-105
                       flex items-center gap-2"
              onClick={onClose}
            >
              <Download className="w-4 h-4" />
              Download CSV
            </a>
          )}
          
          {excelUrl && (
            <a
              href={excelUrl}
              download={fileName.replace('.pdf', '.xlsx')}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 
                       hover:from-green-600 hover:to-emerald-600 text-white rounded-lg 
                       font-medium transition-all hover:scale-105
                       flex items-center gap-2"
              onClick={onClose}
            >
              <Download className="w-4 h-4" />
              Download Excel
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}