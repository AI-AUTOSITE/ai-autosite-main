'use client'

import { useState } from 'react'
import { Settings, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePdfProcessor } from '../hooks/usePdfProcessor'
import { InitialState, ProcessingState, SuccessState } from './DropZoneStates'
import ErrorMessage from './ErrorMessage'
import PrivacyNotice from './PrivacyNotice'
import PreviewModal from './PreviewModal'
import CustomFieldsModal from './CustomFieldsModal'

// Import AI Tool Warning
import { useAIToolWarning } from '@/hooks/useAIToolWarning'
import AIToolWarningModal from '@/components/AIToolWarningModal'

export default function PdfToDataTool() {
  // Router for redirect
  const router = useRouter()

  // AI Tool Warning Hook
  const { showWarning, hasAgreed, isChecking, handleAgree, handleDisagree } = useAIToolWarning()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Custom disagree handler - redirect to home
  const handleCustomDisagree = () => {
    setIsRedirecting(true)
    handleDisagree()
    router.push('/')
  }

  const {
    file,
    csvUrl,
    excelUrl,
    csvPreview,
    error,
    isDragging,
    isProcessing,
    showPreview,
    showCustomFields,
    customFields,
    fileInputRef,
    setIsDragging,
    setShowPreview,
    setShowCustomFields,
    setCustomFields,
    handleDrop,
    handleFileSelect,
    handleReset,
    triggerFileInput,
    confirmDownload,
  } = usePdfProcessor(hasAgreed) // ✅ hasAgreed を渡す

  // ✅ ローディング表示
  if (isChecking || isRedirecting) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {/* ドット表示（必須） */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="mt-6 text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* AI Tool Warning Modal */}
      <AIToolWarningModal
        isOpen={showWarning}
        onAgree={handleAgree}
        onDisagree={handleCustomDisagree}
      />

      {/* Agreement Required Screen */}
      {!hasAgreed ? (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8">
              <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Agreement Required</h3>
              <p className="text-gray-400 text-sm mb-6">
                You must agree to the terms to use this AI-powered tool.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all font-semibold shadow-lg"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Content - Only shown after agreement */
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-3xl mx-auto">
            {/* Custom Fields Button Only - No History */}
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={() => setShowCustomFields(true)}
                disabled={isProcessing}
                className="px-4 py-2.5 min-h-[44px] bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 
                     disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors 
                     flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Custom Fields</span>
                <span className="sm:hidden">Fields</span>
                {customFields && <span className="text-xs text-cyan-400">(Active)</span>}
              </button>
            </div>

            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isProcessing}
              />

              <div
                onClick={triggerFileInput}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (!isProcessing) setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
              relative min-h-[350px] sm:min-h-[400px] rounded-2xl border-2 border-dashed
              flex flex-col items-center justify-center
              transition-all duration-300 bg-white/5 backdrop-blur-sm
              ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02]'
                  : file
                    ? 'border-green-400 bg-green-400/5'
                    : 'border-gray-600 hover:border-cyan-400 hover:bg-white/10 cursor-pointer'
              }
              ${isProcessing ? 'cursor-wait' : ''}
            `}
              >
                {/* State Display */}
                {!file && !isProcessing && <InitialState />}
                {isProcessing && <ProcessingState />}
                {file && !isProcessing && (csvUrl || excelUrl) && (
                  <SuccessState
                    fileName={file.name}
                    csvUrl={csvUrl}
                    excelUrl={excelUrl}
                    onReset={handleReset}
                  />
                )}
              </div>

              {/* Error Message */}
              <ErrorMessage message={error} onReset={handleReset} />
            </div>

            {/* Privacy Notice */}
            <PrivacyNotice />
          </div>

          {/* Preview Modal */}
          {file && (
            <PreviewModal
              isOpen={showPreview}
              onClose={() => setShowPreview(false)}
              csvContent={csvPreview}
              fileName={file.name}
              csvUrl={csvUrl}
              excelUrl={excelUrl}
            />
          )}

          {/* Custom Fields Modal */}
          <CustomFieldsModal
            isOpen={showCustomFields}
            onClose={() => setShowCustomFields(false)}
            onConfirm={setCustomFields}
            currentFields={customFields}
          />
        </div>
      )}
    </>
  )
}