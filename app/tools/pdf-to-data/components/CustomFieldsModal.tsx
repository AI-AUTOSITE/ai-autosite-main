'use client'

import { X, Plus, Trash2, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FIELD_SUGGESTIONS } from '../constants'

interface CustomFieldsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (fields: string) => void
  currentFields: string
}

export default function CustomFieldsModal({
  isOpen,
  onClose,
  onConfirm,
  currentFields,
}: CustomFieldsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [fields, setFields] = useState<string[]>(
    currentFields ? currentFields.split(',').map((f) => f.trim()) : []
  )
  const [newField, setNewField] = useState('')
  const [selectedType, setSelectedType] = useState<keyof typeof FIELD_SUGGESTIONS>('general')

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const addField = () => {
    if (newField.trim() && !fields.includes(newField.trim())) {
      setFields([...fields, newField.trim()])
      setNewField('')
    }
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const loadTemplate = () => {
    const templateFields = FIELD_SUGGESTIONS[selectedType]
    setFields([...templateFields])
  }

  const handleConfirm = () => {
    onConfirm(fields.join(', '))
    onClose()
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg 
                   max-h-[90vh] sm:max-h-[70vh] flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <div className="pr-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">Custom Fields</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Specify extraction fields
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 min-w-[44px] min-h-[44px] hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Templates</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as keyof typeof FIELD_SUGGESTIONS)}
                className="flex-1 px-3 py-2.5 min-h-[44px] bg-slate-700 border border-slate-600 
                         rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="manual">Manual</option>
                <option value="report">Report</option>
                <option value="invoice">Invoice</option>
              </select>
              <button
                onClick={loadTemplate}
                className="px-4 py-2.5 min-h-[44px] bg-slate-700 hover:bg-slate-600 text-white 
                         rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Load
              </button>
            </div>
          </div>

          {/* Add Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Add Field</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addField()
                  }
                }}
                placeholder="e.g., Date, ISBN..."
                className="flex-1 px-3 py-2.5 min-h-[44px] bg-slate-700 border border-slate-600 
                         rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none 
                         focus:border-cyan-500"
              />
              <button
                onClick={addField}
                disabled={!newField.trim()}
                className="px-4 py-2.5 min-h-[44px] bg-cyan-500 hover:bg-cyan-600 
                         disabled:bg-slate-700 disabled:cursor-not-allowed text-white 
                         rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Field List */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fields ({fields.length})
            </label>
            <div className="bg-slate-900/50 rounded-lg border border-slate-700 max-h-32 sm:max-h-40 overflow-y-auto">
              {fields.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-500">
                  <FileText className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No fields added</p>
                  <p className="text-xs mt-1">Add or load template</p>
                </div>
              ) : (
                <div className="p-2 sm:p-3 space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 sm:p-2 bg-slate-800 
                               rounded-lg border border-slate-700"
                    >
                      <span className="text-sm text-white pr-2">{field}</span>
                      <button
                        onClick={() => removeField(index)}
                        className="p-2 min-w-[36px] min-h-[36px] hover:bg-red-500/20 text-red-400 
                                 hover:text-red-300 rounded transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions - Mobile optimized */}
        <div className="p-4 sm:p-6 border-t border-slate-700 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] text-gray-400 
                       hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setFields([])
                onConfirm('')
                onClose()
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] text-gray-400 
                       hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
          <button
            onClick={handleConfirm}
            disabled={fields.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-gradient-to-r from-cyan-500 to-blue-500 
                     hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 
                     disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}