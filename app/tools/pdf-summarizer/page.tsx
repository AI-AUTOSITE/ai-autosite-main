// app/tools/pdf-summarizer/page.tsx
'use client'

import { useState } from 'react'
import { Upload, FileText, Sparkles, Download, ChevronRight } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { PrivacyBadge, CostTransparency, ToolStats, HowToUse } from '../../components/ToolPageComponents'
import { LiveActivity } from '../../components/LiveActivity'
import { PeopleAlsoUse } from '../../components/CrossSell'

export default function PDFSummarizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium')
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setSummary('')
      } else {
        alert('Please select a PDF file')
      }
    }
  }
  
  const handleSummarize = async () => {
    if (!file) return
    
    setIsProcessing(true)
    
    // シミュレート処理（本番環境ではAPIを呼び出す）
    setTimeout(() => {
      const demoSummary = `# Executive Summary

This document provides a comprehensive overview of the subject matter, covering key concepts and practical applications.

## Key Points

1. **Main Concept**: The document introduces fundamental principles that form the foundation of the discussed topic.

2. **Implementation Strategy**: Detailed steps and methodologies are outlined for practical application.

3. **Best Practices**: Industry-standard approaches and recommendations are provided for optimal results.

## Important Findings

- The analysis reveals significant patterns in data trends
- Multiple case studies support the proposed framework
- Future implications suggest continued growth in this area

## Recommendations

Based on the analysis, we recommend:
- Immediate implementation of core strategies
- Regular monitoring and adjustment of approaches
- Continued research into emerging trends

## Conclusion

The document successfully demonstrates the viability of the proposed solutions and provides a clear roadmap for implementation.`
      
      setSummary(demoSummary)
      setIsProcessing(false)
    }, 3000)
  }
  
  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'summary.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col overflow-x-hidden">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <Header />

      <main className="flex-1 overflow-x-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          {/* Tool Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full border border-green-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Study Tools Collection</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              PDF Summarizer
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              AI-powered PDF summary generator for quick study reviews. 
              Extract key points and insights from any PDF document in seconds.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Tool Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Area */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <h2 className="text-xl font-bold text-white mb-6">Upload PDF</h2>
                
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF files only (Max 10MB)
                    </p>
                  </label>
                </div>
                
                {file && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{file.name}</span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}
                
                {/* Options */}
                <div className="mt-6">
                  <label className="text-sm text-gray-300 mb-2 block">Summary Length</label>
                  <div className="flex gap-2">
                    {(['short', 'medium', 'long'] as const).map((length) => (
                      <button
                        key={length}
                        onClick={() => setSummaryLength(length)}
                        className={`px-4 py-2 rounded-lg capitalize transition-all ${
                          summaryLength === length
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Summarize Button */}
                <button
                  onClick={handleSummarize}
                  disabled={!file || isProcessing}
                  className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    file && !isProcessing
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Summary
                    </>
                  )}
                </button>
              </div>

              {/* Summary Result */}
              {summary && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Summary</h2>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-gray-900/50 rounded-lg p-6 whitespace-pre-wrap text-gray-300">
                      {summary}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Activity */}
              <LiveActivity toolName="pdf-summarizer" />
              
              {/* Privacy Badge */}
              <PrivacyBadge />
              
              {/* Cost Transparency */}
              <CostTransparency 
                toolId="pdf-summarizer"
                isFree={false}
                apiCost={0.02}
                userPrice={0.03}
              />
              
              {/* Tool Stats */}
              <ToolStats toolId="pdf-summarizer" />
              
              {/* How to Use */}
              <HowToUse 
                steps={[
                  'Upload your PDF document (max 10MB)',
                  'Select your preferred summary length',
                  'Click "Generate Summary" and wait',
                  'Review and download your summary'
                ]}
              />
              
              {/* People Also Use */}
              <PeopleAlsoUse currentToolId="pdf-summarizer" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}