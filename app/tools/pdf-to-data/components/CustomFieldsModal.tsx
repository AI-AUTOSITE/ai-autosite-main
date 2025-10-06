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
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">Custom Extraction Fields</h2>
            <p className="text-sm text-gray-400 mt-1">
              Specify which fields to extract from your PDF
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quick Templates</label>
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as keyof typeof FIELD_SUGGESTIONS)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="general">General Document</option>
                <option value="academic">Academic Paper</option>
                <option value="manual">Technical Manual</option>
                <option value="report">Report</option>
                <option value="invoice">Invoice</option>
              </select>
              <button
                onClick={loadTemplate}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Load
              </button>
            </div>
          </div>

          {/* Add Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Add Custom Field</label>
            <div className="flex gap-2">
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
                placeholder="e.g., Publication_Date, ISBN, Category..."
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={addField}
                disabled={!newField.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Field List */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fields to Extract ({fields.length})
            </label>
            <div className="bg-slate-900/50 rounded-lg border border-slate-700 max-h-40 overflow-y-auto">
              {fields.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No fields added yet</p>
                  <p className="text-xs mt-1">Add fields manually or load a template</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-slate-800 rounded-lg border border-slate-700"
                    >
                      <span className="text-sm text-white">{field}</span>
                      <button
                        onClick={() => removeField(index)}
                        className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded transition-colors"
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

        {/* Actions */}
        <div className="p-6 border-t border-slate-700 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setFields([])
              onConfirm('')
              onClose()
            }}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Clear & Use Auto
          </button>
          <button
            onClick={handleConfirm}
            disabled={fields.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
          >
            Confirm Fields
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
