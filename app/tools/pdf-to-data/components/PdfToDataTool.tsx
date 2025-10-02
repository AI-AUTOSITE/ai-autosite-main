'use client'

import { usePdfProcessor } from '../hooks/usePdfProcessor'
import { InitialState, ProcessingState, SuccessState } from './DropZoneStates'
import ErrorMessage from './ErrorMessage'
import PrivacyNotice from './PrivacyNotice'

export default function PdfToDataTool() {
  const {
    file,
    csvUrl,
    excelUrl,
    error,
    isDragging,
    isProcessing,
    fileInputRef,
    setIsDragging,
    handleDrop,
    handleFileSelect,
    handleReset,
    triggerFileInput
  } = usePdfProcessor()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
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
              relative min-h-[400px] rounded-2xl border-2 border-dashed
              flex flex-col items-center justify-center
              transition-all duration-300 bg-white/5 backdrop-blur-sm
              ${isDragging 
                ? 'border-cyan-400 bg-cyan-400/10 scale-102' 
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
          <ErrorMessage message={error} />
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice />
      </div>
    </div>
  )
}