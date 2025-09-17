'use client'

import { useState } from 'react'
import { FileText, Download, Database, AlertCircle, CheckCircle } from 'lucide-react'

export default function PdfToDataTool() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState('')
  const [csvData, setCsvData] = useState('')
  const [fileName, setFileName] = useState('')

  // CSVダウンロード処理
  const handleExtractCSV = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    setResult('Processing your PDF...')

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/pdf-to-data', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const csv = await response.text()
        setCsvData(csv)
        
        // CSVをダウンロード
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName.replace('.pdf', '.csv') || 'data.csv'
        a.click()
        window.URL.revokeObjectURL(url)
        
        setResult('✅ CSV downloaded successfully! You can also download as Excel.')
      } else {
        const error = await response.text()
        setResult(`❌ Error: ${error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Excelダウンロード処理
  const handleExcelDownload = async () => {
    if (!csvData) {
      alert('Please extract CSV first.')
      return
    }

    try {
      // xlsx ライブラリを動的にインポート
      const XLSX = (await import('xlsx')).default
      
      // CSVをExcelに変換
      const workbook = XLSX.read(csvData, { type: 'string' })
      XLSX.writeFile(workbook, fileName.replace('.pdf', '.xlsx') || 'data.xlsx')
      setResult('✅ Excel file downloaded successfully!')
    } catch (error) {
      setResult(`❌ Error creating Excel: ${error}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ツールタイトル */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          PDF to CSV/Excel Converter
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Extract tables and structured data from PDFs instantly. 
          AI-powered conversion with no signup required.
        </p>
      </div>

      {/* 機能ハイライト */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <Database className="w-10 h-10 text-cyan-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Smart Extraction</h3>
          <p className="text-gray-400 text-sm">AI-powered table and data extraction from any PDF</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <FileText className="w-10 h-10 text-green-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Multiple Formats</h3>
          <p className="text-gray-400 text-sm">Download as CSV for data analysis or Excel for spreadsheets</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <Download className="w-10 h-10 text-purple-400 mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Instant Download</h3>
          <p className="text-gray-400 text-sm">No email required, get your data immediately</p>
        </div>
      </div>

      {/* メインツールエリア */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleExtractCSV} className="space-y-6">
            {/* ファイルアップロード */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload PDF File
              </label>
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                required
                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 transition-colors"
                disabled={isProcessing}
              />
              <p className="mt-2 text-xs text-gray-400">
                Maximum file size: 10MB
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg px-6 py-3 font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5" />
                    Extract to CSV
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleExcelDownload}
                disabled={isProcessing || !csvData}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg px-6 py-3 font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Download as Excel
              </button>
            </div>
          </form>

          {/* 結果表示 */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.includes('✅') ? 'bg-green-500/10 border border-green-500/20' : 
              result.includes('❌') ? 'bg-red-500/10 border border-red-500/20' : 
              'bg-blue-500/10 border border-blue-500/20'
            }`}>
              <p className="text-sm text-gray-300">{result}</p>
            </div>
          )}

          {/* セキュリティ情報 */}
          <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm text-green-400 font-semibold">100% Secure & Private</p>
                <p className="text-xs text-gray-400 mt-1">
                  Your files are never stored on our servers. All processing is done in real-time 
                  and files are deleted immediately after processing.
                </p>
              </div>
            </div>
          </div>

{/* 技術情報 */}
<div className="mt-4 text-center">
  <p className="text-xs text-gray-500">
    Powered by Claude AI • Advanced Data Extraction
  </p>
</div>
        </div>
      </div>
    </div>
  )
}