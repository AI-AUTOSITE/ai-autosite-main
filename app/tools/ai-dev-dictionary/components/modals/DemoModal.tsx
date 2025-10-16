// app/tools/ai-dev-dictionary/components/modals/DemoModal.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Loader2 } from 'lucide-react'
import { loadDemo } from '../../lib/demo-loader'

interface DemoComponentProps {
  state: any
  setState: React.Dispatch<React.SetStateAction<any>>
}

type DemoComponent = React.ComponentType<DemoComponentProps>

interface DemoModalProps {
  term: any
  onClose: () => void
}

export default function DemoModal({ term, onClose }: DemoModalProps) {
  const [Demo, setDemo] = useState<DemoComponent | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoState, setDemoState] = useState<any>({
    checkbox: [false, false, false],
    radio: 'option1',
    switch: false,
    tabs: 0,
    pagination: 1,
    stepper: 1,
    carousel: 0,
    progress: 0,
    modal: false,
    dropdown: false,
    drawer: false,
    tooltip: false,
    toast: false,
    alert: false,
  })

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadDemo(term.demoType).then((component: DemoComponent | null) => {
      if (component) {
        setDemo(() => component)
      }
      setLoading(false)
    })
  }, [term.demoType])

  // ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-[9999]"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative bg-slate-900 rounded-none sm:rounded-xl w-full h-full sm:h-auto sm:max-w-4xl 
                   sm:max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 
                        flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">{term.term}</h2>
            <span className="text-xs text-gray-400 mt-1 block">{term.category.replace('-', ' ')}</span>
          </div>
          <button
            onClick={onClose}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center hover:bg-white/10 
                       rounded-lg transition-colors flex-shrink-0 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto h-[calc(100vh-60px)] sm:h-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <div className="p-4 sm:p-6">
            {/* Description */}
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">{term.description}</p>

            {/* Beginner Tip */}
            {term.beginnerTip && (
              <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                              border border-purple-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-lg sm:text-xl flex-shrink-0">💡</span>
                  <p className="text-xs sm:text-sm text-purple-200">{term.beginnerTip}</p>
                </div>
              </div>
            )}

            {/* Demo Area */}
            <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-white/10 mb-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Interactive Demo
              </h3>
              {loading ? (
                <div className="h-48 sm:h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : Demo ? (
                <Demo state={demoState} setState={setDemoState} />
              ) : (
                <div className="h-48 sm:h-64 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Demo not available</p>
                </div>
              )}
            </div>

            {/* AI Synonyms */}
            {term.aiSynonyms && term.aiSynonyms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                  AI Understands These Terms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {term.aiSynonyms.map((synonym: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm 
                                 border border-purple-500/20"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Code Example */}
            {term.codeExample && (
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Code Example
                </h3>
                <div className="bg-slate-950/50 rounded-lg p-3 sm:p-4 overflow-x-auto border border-white/5">
                  <pre className="text-xs text-gray-300 font-mono">
                    <code>{term.codeExample}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}