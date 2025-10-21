'use client'

import { useState, useEffect } from 'react'
import { Download, BookOpen, Settings, Sparkles, X, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import jsPDF from 'jspdf'

type PaperSize = 'A4' | 'Letter'
type LineStyle = 'ruled' | 'grid' | 'blank'

interface NoteConfig {
  subject: string
  date: string
  cueRatio: number
  paperSize: PaperSize
  lineStyle: LineStyle
}

interface SampleData {
  subject: string
  cueNotes: string[]
  mainNotes: string[]
  summary: string
}

const PAPER_SIZES = {
  A4: { width: 210, height: 297 },
  Letter: { width: 215.9, height: 279.4 }
}

const SAMPLE_DATA: SampleData = {
  subject: 'Why Cornell Notes Work - Evidence',
  cueNotes: [
    'Why handwriting?',
    'What about typing?',
    'Review benefit?',
    'Grade impact?',
    'Own words why?',
  ],
  mainNotes: [
    '• Handwriting activates 32 brain regions',
    '  (256-electrode EEG study, 2024)',
    '',
    '• Typing activates almost none',
    '  → shallow processing',
    '',
    '• Cue area = built-in testing system',
    '  → 2x faster than re-reading',
    '',
    '• Students scored 9.5% higher',
    '  (24 studies, 3,005 participants)',
    '',
    '• Copying = fooling yourself',
    '  Summarizing = true understanding',
  ],
  summary: 'Cornell Notes work because handwriting creates way more brain connections than typing. The left column lets you test yourself quickly, which is proven to be 2x more effective than just re-reading. Writing summaries in your own words forces deep thinking - you can\'t fake understanding. Research shows students using this method score almost 10% higher on tests.'
}

export default function CornellNoteClient() {
  const [config, setConfig] = useState<NoteConfig>({
    subject: '',
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    cueRatio: 30,
    paperSize: 'A4',
    lineStyle: 'ruled'
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [showSampleNotice, setShowSampleNotice] = useState(false)
  const [isSampleLoaded, setIsSampleLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const loadSample = () => {
    setConfig({
      ...config,
      subject: SAMPLE_DATA.subject
    })
    
    setIsSampleLoaded(true)
    setShowSampleNotice(true)
    
    setTimeout(() => setShowSampleNotice(false), 5000)
  }

  const clearSample = () => {
    setConfig({
      ...config,
      subject: ''
    })
    setIsSampleLoaded(false)
    setShowSampleNotice(false)
  }

  const generatePDF = () => {
    setIsGenerating(true)
    setPdfGenerated(false) // リセット
    
    try {
      const paper = PAPER_SIZES[config.paperSize]
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [paper.width, paper.height]
      })

      const margin = 15
      const pageWidth = paper.width - (margin * 2)
      const pageHeight = paper.height - (margin * 2)

      const cueWidth = (pageWidth * config.cueRatio) / 100
      const noteWidth = pageWidth - cueWidth
      const summaryHeight = 60
      const noteHeight = pageHeight - summaryHeight - 30

      // Header
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(config.subject || 'Cornell Notes', margin, margin + 8)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(config.date, paper.width - margin - 40, margin + 8)

      const startY = margin + 20

      doc.setDrawColor(100, 100, 100)
      doc.rect(margin, startY, cueWidth, noteHeight)
      
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('Questions / Keywords', margin + 5, startY + 7)

      doc.rect(margin + cueWidth, startY, noteWidth, noteHeight)
      doc.text('Notes & Details', margin + cueWidth + 5, startY + 7)

      if (isSampleLoaded) {
        doc.setFontSize(8)
        doc.setTextColor(50, 50, 50)
        doc.setFont('helvetica', 'normal')

        let leftY = startY + 15
        SAMPLE_DATA.cueNotes.forEach(q => {
          const lines = doc.splitTextToSize(q, cueWidth - 10)
          doc.text(lines, margin + 5, leftY)
          leftY += 15
        })

        let rightY = startY + 15
        SAMPLE_DATA.mainNotes.forEach(note => {
          if (note) {
            const lines = doc.splitTextToSize(note, noteWidth - 10)
            doc.text(lines, margin + cueWidth + 5, rightY)
            rightY += note.startsWith('•') ? 8 : 6
          } else {
            rightY += 8
          }
        })

        const summaryY = startY + noteHeight
        doc.setDrawColor(100, 100, 100)
        doc.rect(margin, summaryY, pageWidth, summaryHeight)
        
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text('Summary (3-5 sentences in your own words):', margin + 5, summaryY + 7)

        doc.setFontSize(8)
        doc.setTextColor(50, 50, 50)
        const summaryLines = doc.splitTextToSize(SAMPLE_DATA.summary, pageWidth - 10)
        
        let summaryY_text = summaryY + 15
        summaryLines.forEach((line: string) => {
          doc.text(line, margin + 5, summaryY_text)
          summaryY_text += 5
        })

      } else {
        if (config.lineStyle === 'ruled') {
          const lineSpacing = 8
          doc.setDrawColor(200, 200, 200)
          for (let y = startY + 15; y < startY + noteHeight; y += lineSpacing) {
            doc.line(margin + cueWidth, y, margin + pageWidth, y)
            doc.line(margin, y, margin + cueWidth, y)
          }
        } else if (config.lineStyle === 'grid') {
          const gridSpacing = 8
          doc.setDrawColor(220, 220, 220)
          
          for (let x = margin + gridSpacing; x < margin + pageWidth; x += gridSpacing) {
            doc.line(x, startY, x, startY + noteHeight)
          }
          
          for (let y = startY + gridSpacing; y < startY + noteHeight; y += gridSpacing) {
            doc.line(margin, y, margin + pageWidth, y)
          }
        }

        const summaryY = startY + noteHeight
        doc.setDrawColor(100, 100, 100)
        doc.rect(margin, summaryY, pageWidth, summaryHeight)
        
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text('Summary (3-5 sentences in your own words):', margin + 5, summaryY + 7)

        if (config.lineStyle !== 'blank') {
          doc.setDrawColor(200, 200, 200)
          const summaryLineSpacing = 10
          for (let y = summaryY + 15; y < summaryY + summaryHeight - 5; y += summaryLineSpacing) {
            doc.line(margin + 5, y, margin + pageWidth - 5, y)
          }
        }
      }

      const filename = config.subject 
        ? `cornell-notes-${config.subject.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : `cornell-notes-${Date.now()}.pdf`
      
      doc.save(filename)
      
      // 成功フラグを立てる
      setPdfGenerated(true)
      
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Toast */}
      {showSampleNotice && (
        <div className={`fixed z-50 animate-slide-in ${
          isMobile 
            ? 'top-4 left-4 right-4' 
            : 'top-6 right-6 max-w-md'
        }`}>
          <div className="bg-cyan-500 border border-cyan-400 rounded-xl p-4 
                        flex items-center gap-3 shadow-2xl">
            <Sparkles className="w-5 h-5 text-white flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base">Sample Loaded!</p>
              <p className="text-cyan-100 text-xs sm:text-sm truncate">
                Check preview below
              </p>
            </div>
            <button
              onClick={() => setShowSampleNotice(false)}
              className="p-1 hover:bg-cyan-600 rounded transition-colors flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-base sm:text-lg">
              <Settings className="w-5 h-5 text-cyan-400" />
              Basic Settings
            </h3>

            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Subject/Topic (optional)
                </label>
                <input
                  type="text"
                  value={config.subject}
                  onChange={(e) => {
                    setConfig({...config, subject: e.target.value})
                    if (e.target.value !== SAMPLE_DATA.subject) {
                      setIsSampleLoaded(false)
                    }
                  }}
                  placeholder="e.g., Biology, History"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400
                           transition-colors text-base"
                />
              </div>

              {/* Sample Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={loadSample}
                  disabled={isSampleLoaded}
                  className={`flex-1 px-3 sm:px-4 py-3 rounded-lg transition-all
                           flex items-center justify-center gap-2 font-medium text-sm sm:text-base
                           ${isSampleLoaded 
                             ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300 cursor-not-allowed'
                             : 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-purple-300 hover:from-purple-600/30 hover:to-cyan-600/30'
                           }`}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{isSampleLoaded ? 'Loaded' : 'Sample'}</span>
                </button>

                {isSampleLoaded && (
                  <button
                    onClick={clearSample}
                    className="px-3 sm:px-4 py-3 bg-red-600/20 border border-red-500/30 text-red-300 
                             rounded-lg hover:bg-red-600/30 transition-all
                             flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                    aria-label="Clear sample"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={config.date}
                  onChange={(e) => setConfig({...config, date: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:border-cyan-400 transition-colors text-base"
                />
              </div>

              {/* Cue Area Width */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Left Column Width: <span className="text-white font-semibold">{config.cueRatio}%</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="20"
                    max="40"
                    value={config.cueRatio}
                    onChange={(e) => setConfig({...config, cueRatio: Number(e.target.value)})}
                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:w-6
                             [&::-webkit-slider-thumb]:h-6
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-cyan-500
                             [&::-webkit-slider-thumb]:cursor-pointer
                             [&::-webkit-slider-thumb]:shadow-lg
                             [&::-moz-range-thumb]:w-6
                             [&::-moz-range-thumb]:h-6
                             [&::-moz-range-thumb]:rounded-full
                             [&::-moz-range-thumb]:bg-cyan-500
                             [&::-moz-range-thumb]:border-0
                             [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Narrow (20%)</span>
                  <span>Wide (40%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Format Options */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">Format Options</h3>

            <div className="space-y-4">
              {/* Paper Size */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Paper Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['A4', 'Letter'] as PaperSize[]).map(size => (
                    <button
                      key={size}
                      onClick={() => setConfig({...config, paperSize: size})}
                      className={`px-4 py-3 rounded-lg font-medium transition-all text-base
                                min-h-[48px] ${
                        config.paperSize === size
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Style */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Line Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'ruled' as LineStyle, label: 'Ruled' },
                    { value: 'grid' as LineStyle, label: 'Grid' },
                    { value: 'blank' as LineStyle, label: 'Blank' }
                  ].map(style => (
                    <button
                      key={style.value}
                      onClick={() => setConfig({...config, lineStyle: style.value})}
                      className={`px-3 py-3 rounded-lg font-medium transition-all text-sm
                                min-h-[48px] ${
                        config.lineStyle === style.value
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white 
                     rounded-xl font-semibold hover:opacity-90 transition-all 
                     flex items-center justify-center gap-3 shadow-lg shadow-cyan-600/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     min-h-[56px] text-base sm:text-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate PDF Template
              </>
            )}
          </button>

          {/* Mobile Preview Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white 
                       rounded-lg hover:bg-white/10 transition-all
                       flex items-center justify-center gap-2 font-medium"
            >
              <BookOpen className="w-5 h-5" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
        </div>

        {/* Right: Preview */}
        <div className={`space-y-6 ${isMobile && !showPreview ? 'hidden' : ''}`}>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Preview
              {isSampleLoaded && (
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                  Sample
                </span>
              )}
            </h3>

            <div className="bg-white rounded-lg p-4 sm:p-6 aspect-[1/1.4] relative overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-start mb-3 sm:mb-4 pb-2 border-b-2 border-gray-300">
                <div className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg truncate pr-2">
                  {config.subject || 'Cornell Notes'}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{config.date}</div>
              </div>

              {/* Main Area */}
              <div className="flex gap-2 h-[calc(100%-100px)] sm:h-[calc(100%-120px)]">
                {/* Cue Area */}
                <div 
                  className="border-2 border-gray-300 rounded p-2 overflow-hidden"
                  style={{ width: `${config.cueRatio}%` }}
                >
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium mb-2">Questions</div>
                  {isSampleLoaded ? (
                    <div className="space-y-2 text-[7px] sm:text-[8px] text-gray-700">
                      {SAMPLE_DATA.cueNotes.slice(0, 4).map((note, idx) => (
                        <div key={idx} className={idx > 0 ? 'mt-2 sm:mt-3' : ''}>{note}</div>
                      ))}
                    </div>
                  ) : (
                    config.lineStyle === 'ruled' && (
                      <div className="space-y-2 sm:space-y-3 mt-2">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="border-b border-gray-200" />
                        ))}
                      </div>
                    )
                  )}
                </div>

                {/* Note Area */}
                <div 
                  className="border-2 border-gray-300 rounded p-2 flex-1 overflow-hidden"
                >
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium mb-2">Notes</div>
                  {isSampleLoaded ? (
                    <div className="space-y-0.5 sm:space-y-1 text-[6px] sm:text-[7px] leading-tight text-gray-700">
                      {SAMPLE_DATA.mainNotes.slice(0, 8).map((note, idx) => (
                        <div key={idx} className={note.startsWith('•') ? '' : 'pl-1 sm:pl-2'}>
                          {note}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {config.lineStyle === 'ruled' && (
                        <div className="space-y-2 sm:space-y-3 mt-2">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="border-b border-gray-200" />
                          ))}
                        </div>
                      )}
                      {config.lineStyle === 'grid' && (
                        <div className="grid grid-cols-4 gap-1 sm:gap-2 h-full mt-2">
                          {[...Array(24)].map((_, i) => (
                            <div key={i} className="border border-gray-100" />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Summary Area */}
              <div className="mt-2 border-2 border-gray-300 rounded p-2 h-[60px] sm:h-[80px] overflow-hidden">
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium mb-1">
                  Summary (your own words)
                </div>
                {isSampleLoaded ? (
                  <div className="text-[5px] sm:text-[6px] leading-relaxed text-gray-700">
                    {SAMPLE_DATA.summary.substring(0, 100)}...
                  </div>
                ) : (
                  config.lineStyle !== 'blank' && (
                    <div className="space-y-1.5 sm:space-y-2">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="border-b border-gray-200" />
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ 生成完了後バナー - SEO内部リンク */}
      {pdfGenerated && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 
                      border border-green-500/20 rounded-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">
                ✓ Template Generated Successfully!
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Print it out and start taking better notes. Want to master the Cornell method and boost your retention by 58%?
              </p>
              <Link
                href="/blog/cornell-note-guide"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 
                         text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <BookOpen className="w-4 h-4" />
                Read the Complete Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}