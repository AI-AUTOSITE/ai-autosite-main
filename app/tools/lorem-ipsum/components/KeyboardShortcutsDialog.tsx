'use client'

import { X, Keyboard } from 'lucide-react'
import { KEYBOARD_SHORTCUTS } from '../hooks/useKeyboardShortcuts'

interface KeyboardShortcutsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  if (!isOpen) return null

  // Detect if user is on Mac
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-md w-full animate-slide-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                <Keyboard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white" />
            </button>
          </div>

          {/* Shortcuts List */}
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300 text-sm">{shortcut.action}</span>
                <div className="flex items-center gap-1">
                  {(isMac ? shortcut.mac : shortcut.keys).map((key, keyIndex) => (
                    <kbd
                      key={keyIndex}
                      className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded text-xs text-purple-600 dark:text-purple-400 font-mono"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
            <p className="text-xs text-gray-500 text-center">
              Press{' '}
              <kbd className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded text-purple-600 dark:text-purple-400 font-mono">?</kbd>{' '}
              to show this dialog anytime
            </p>
          </div>
        </div>
      </div>
    </>
  )
}