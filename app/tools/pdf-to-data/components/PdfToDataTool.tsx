'use client'
import { useState, useRef } from 'react'
import { FileText, Download, Sparkles } from 'lucide-react'

export default function PdfToDataTool() {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csvUrl, setCsvUrl] = useState<string>('')
  const [excelUrl, setExcelUrl] = useState<string>('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      await processFile(droppedFile)
    } else {
      setError('Please use PDF files only')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      await processFile(selectedFile)
    }
  }

  const processFile = async (pdfFile: File) => {
    if (pdfFile.size > 10 * 1024 * 1024) {
      setError('File too big. Max 10MB')
      setTimeout(() => setError(''), 3000)
      return
    }

    setFile(pdfFile)
    setIsProcessing(true)
    setError('')
    
    // Reset previous URLs
    if (csvUrl) URL.revokeObjectURL(csvUrl)
    if (excelUrl) URL.revokeObjectURL(excelUrl)
    
    try {
      // Process both formats simultaneously
      const [csvBlob, excelBlob] = await Promise.all([
        extractData(pdfFile, 'csv'),
        extractData(pdfFile, 'excel')
      ])
      
      if (csvBlob) {
        const url = URL.createObjectURL(csvBlob)
        setCsvUrl(url)
      }
      
      if (excelBlob) {
        const url = URL.createObjectURL(excelBlob)
        setExcelUrl(url)
      }
    } catch (err) {
      setError('Something went wrong. Try again.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const extractData = async (pdfFile: File, format: 'csv' | 'excel'): Promise<Blob | null> => {
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    formData.append('format', format)

    try {
      const response = await fetch('/api/pdf-to-data', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        return await response.blob()
      }
      return null
    } catch {
      return null
    }
  }

  const handleReset = () => {
    setFile(null)
    setCsvUrl('')
    setExcelUrl('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      {/* メインドロップゾーン - layout.tsxのタイトル直下 */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div
          onClick={() => !file && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative min-h-[420px] rounded-2xl border-2 border-dashed
            flex flex-col items-center justify-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-cyan-400 bg-cyan-400/5' 
              : file
                ? 'border-green-400 bg-green-400/5'
                : 'border-gray-600 hover:border-cyan-400 hover:bg-white/5'
            }
            ${isProcessing ? 'cursor-wait' : ''}
          `}
        >
          {!file && !isProcessing && (
            <>
              <FileText className="w-20 h-20 text-gray-500 mb-4" />
              <p className="text-2xl text-gray-300">Drop PDF here</p>
              <p className="text-sm text-gray-500 mt-3">or click to choose</p>
              <p className="text-xs text-gray-600 mt-8">Max 10MB • AI-powered</p>
            </>
          )}

          {isProcessing && (
            <div className="text-center">
              <Sparkles className="w-20 h-20 text-cyan-400 mb-4 animate-pulse mx-auto" />
              <p className="text-2xl text-white">Extracting data...</p>
              <div className="mt-4">
                <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {file && !isProcessing && (csvUrl || excelUrl) && (
            <div className="text-center">
              <FileText className="w-20 h-20 text-green-400 mb-4 mx-auto" />
              <p className="text-2xl text-white mb-2">Done!</p>
              <p className="text-sm text-gray-400 mb-8">{file.name}</p>
              
              {/* ダウンロードボタン - TinyPNG風 */}
              <div className="flex gap-4 justify-center mb-8">
                {csvUrl && (
                  <a
                    href={csvUrl}
                    download={file.name.replace('.pdf', '.csv')}
                    className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download CSV
                  </a>
                )}
                {excelUrl && (
                  <a
                    href={excelUrl}
                    download={file.name.replace('.pdf', '.xlsx')}
                    className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Excel
                  </a>
                )}
              </div>
              
              {/* もう一つ試す */}
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-white transition-colors underline"
              >
                Drop another PDF
              </button>
            </div>
          )}
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500/90 text-white rounded-lg text-sm animate-fadeIn">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}