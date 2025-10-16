'use client'

import { Settings } from 'lucide-react'
import { usePdfProcessor } from '../hooks/usePdfProcessor'
import { InitialState, ProcessingState, SuccessState } from './DropZoneStates'
import ErrorMessage from './ErrorMessage'
import PrivacyNotice from './PrivacyNotice'
import PreviewModal from './PreviewModal'
import CustomFieldsModal from './CustomFieldsModal'

export default function PdfToDataTool() {
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
  } = usePdfProcessor()

  return (
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
  )
}