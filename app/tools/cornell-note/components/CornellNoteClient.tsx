'use client'

import { useState, useEffect } from 'react'
import { 
  Download, BookOpen, Settings, Sparkles, X, CheckCircle, ArrowRight,
  Zap, Beaker, History, Languages, Users, Calculator, FileText,
  ChevronDown, ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import jsPDF from 'jspdf'

// ============================================
// Types
// ============================================
type PaperSize = 'A4' | 'Letter' | 'B5'
type LineStyle = 'ruled' | 'grid' | 'dot' | 'blank'
type SubjectTemplate = 'general' | 'science' | 'history' | 'language' | 'meeting' | 'math'

interface NoteConfig {
  subject: string
  date: string
  cueRatio: number
  paperSize: PaperSize
  lineStyle: LineStyle
  subjectTemplate: SubjectTemplate
  showCropMarks: boolean
}

interface SampleData {
  subject: string
  cueNotes: string[]
  mainNotes: string[]
  summary: string
}

// ============================================
// Constants
// ============================================
const PAPER_SIZES = {
  A4: { width: 210, height: 297, name: 'A4 (210×297mm)' },
  Letter: { width: 215.9, height: 279.4, name: 'US Letter' },
  B5: { width: 182, height: 257, name: 'B5 (182×257mm)' }
}

const LINE_STYLES = [
  { value: 'ruled' as LineStyle, label: 'Ruled', icon: '━' },
  { value: 'grid' as LineStyle, label: 'Grid', icon: '▦' },
  { value: 'dot' as LineStyle, label: 'Dot', icon: '⋯' },
  { value: 'blank' as LineStyle, label: 'Blank', icon: '□' }
]

const SUBJECT_TEMPLATES: { value: SubjectTemplate; label: string; icon: React.ReactNode; cueLabels: string[]; noteLabel: string }[] = [
  { 
    value: 'general', 
    label: 'General', 
    icon: <FileText className="w-4 h-4" />,
    cueLabels: ['Questions', 'Keywords'],
    noteLabel: 'Notes & Details'
  },
  { 
    value: 'science', 
    label: 'Science', 
    icon: <Beaker className="w-4 h-4" />,
    cueLabels: ['Hypothesis', 'Variables', 'Questions'],
    noteLabel: 'Observations & Data'
  },
  { 
    value: 'math', 
    label: 'Math', 
    icon: <Calculator className="w-4 h-4" />,
    cueLabels: ['Formulas', 'Key Concepts'],
    noteLabel: 'Problem Solving Steps'
  },
  { 
    value: 'history', 
    label: 'History', 
    icon: <History className="w-4 h-4" />,
    cueLabels: ['Who/What', 'When/Where', 'Why'],
    noteLabel: 'Events & Context'
  },
  { 
    value: 'language', 
    label: 'Language', 
    icon: <Languages className="w-4 h-4" />,
    cueLabels: ['Vocabulary', 'Grammar Points'],
    noteLabel: 'Examples & Usage'
  },
  { 
    value: 'meeting', 
    label: 'Meeting', 
    icon: <Users className="w-4 h-4" />,
    cueLabels: ['Action Items', 'Decisions'],
    noteLabel: 'Discussion Notes'
  },
]

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

// ============================================
// Main Component
// ============================================
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
    lineStyle: 'ruled',
    subjectTemplate: 'general',
    showCropMarks: false
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [showSampleNotice, setShowSampleNotice] = useState(false)
  const [isSampleLoaded, setIsSampleLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

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

  const currentTemplate = SUBJECT_TEMPLATES.find(t => t.value === config.subjectTemplate) || SUBJECT_TEMPLATES[0]

  const generatePDF = () => {
    setIsGenerating(true)
    setPdfGenerated(false)
    
    try {
      const paper = PAPER_SIZES[config.paperSize]
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [paper.width, paper.height]
      })

      const margin = config.showCropMarks ? 20 : 15
      const pageWidth = paper.width - (margin * 2)
      const pageHeight = paper.height - (margin * 2)

      const cueWidth = (pageWidth * config.cueRatio) / 100
      const noteWidth = pageWidth - cueWidth
      const summaryHeight = 50
      const noteHeight = pageHeight - summaryHeight - 30

      // Crop marks
      if (config.showCropMarks) {
        doc.setDrawColor(150, 150, 150)
        doc.setLineWidth(0.2)
        const markLen = 5
        // Top-left
        doc.line(margin - markLen, margin, margin, margin)
        doc.line(margin, margin - markLen, margin, margin)
        // Top-right
        doc.line(paper.width - margin, margin, paper.width - margin + markLen, margin)
        doc.line(paper.width - margin, margin - markLen, paper.width - margin, margin)
        // Bottom-left
        doc.line(margin - markLen, paper.height - margin, margin, paper.height - margin)
        doc.line(margin, paper.height - margin, margin, paper.height - margin + markLen)
        // Bottom-right
        doc.line(paper.width - margin, paper.height - margin, paper.width - margin + markLen, paper.height - margin)
        doc.line(paper.width - margin, paper.height - margin, paper.width - margin, paper.height - margin + markLen)
      }

      // Header
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(config.subject || 'Cornell Notes', margin, margin + 8)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(config.date, paper.width - margin - 40, margin + 8)

      // Subject template label
      if (config.subjectTemplate !== 'general') {
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(`[${currentTemplate.label}]`, margin, margin + 15)
      }

      const startY = margin + 22

      doc.setDrawColor(100, 100, 100)
      doc.setLineWidth(0.3)
      doc.rect(margin, startY, cueWidth, noteHeight)
      
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(currentTemplate.cueLabels.join(' / '), margin + 3, startY + 6)

      doc.rect(margin + cueWidth, startY, noteWidth, noteHeight)
      doc.text(currentTemplate.noteLabel, margin + cueWidth + 3, startY + 6)

      // Lines/Grid/Dots
      if (!isSampleLoaded) {
        const lineSpacing = 8
        
        if (config.lineStyle === 'ruled') {
          doc.setDrawColor(200, 200, 200)
          doc.setLineWidth(0.1)
          for (let y = startY + 15; y < startY + noteHeight; y += lineSpacing) {
            doc.line(margin + cueWidth, y, margin + pageWidth, y)
            doc.line(margin, y, margin + cueWidth, y)
          }
        } else if (config.lineStyle === 'grid') {
          const gridSpacing = 8
          doc.setDrawColor(220, 220, 220)
          doc.setLineWidth(0.1)
          
          for (let x = margin + gridSpacing; x < margin + pageWidth; x += gridSpacing) {
            doc.line(x, startY + 10, x, startY + noteHeight)
          }
          
          for (let y = startY + gridSpacing + 10; y < startY + noteHeight; y += gridSpacing) {
            doc.line(margin, y, margin + pageWidth, y)
          }
        } else if (config.lineStyle === 'dot') {
          const dotSpacing = 5
          doc.setFillColor(180, 180, 180)
          
          for (let x = margin + dotSpacing; x < margin + pageWidth; x += dotSpacing) {
            for (let y = startY + dotSpacing + 10; y < startY + noteHeight; y += dotSpacing) {
              doc.circle(x, y, 0.3, 'F')
            }
          }
        }
      }

      // Sample content
      if (isSampleLoaded) {
        doc.setFontSize(8)
        doc.setTextColor(50, 50, 50)
        doc.setFont('helvetica', 'normal')

        let leftY = startY + 15
        SAMPLE_DATA.cueNotes.forEach(q => {
          const lines = doc.splitTextToSize(q, cueWidth - 6)
          doc.text(lines, margin + 3, leftY)
          leftY += 12
        })

        let rightY = startY + 15
        SAMPLE_DATA.mainNotes.forEach(note => {
          if (note) {
            const lines = doc.splitTextToSize(note, noteWidth - 6)
            doc.text(lines, margin + cueWidth + 3, rightY)
            rightY += note.startsWith('•') ? 7 : 5
          } else {
            rightY += 6
          }
        })
      }

      // Summary Area
      const summaryY = startY + noteHeight
      doc.setDrawColor(100, 100, 100)
      doc.setLineWidth(0.3)
      doc.rect(margin, summaryY, pageWidth, summaryHeight)
      
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('Summary (in your own words):', margin + 3, summaryY + 6)

      if (isSampleLoaded) {
        doc.setFontSize(8)
        doc.setTextColor(50, 50, 50)
        const summaryLines = doc.splitTextToSize(SAMPLE_DATA.summary, pageWidth - 6)
        
        let summaryY_text = summaryY + 14
        summaryLines.forEach((line: string) => {
          doc.text(line, margin + 3, summaryY_text)
          summaryY_text += 4.5
        })
      } else if (config.lineStyle === 'ruled' || config.lineStyle === 'dot') {
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.1)
        for (let y = summaryY + 14; y < summaryY + summaryHeight - 5; y += 8) {
          doc.line(margin + 3, y, margin + pageWidth - 3, y)
        }
      }

      // Footer
      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.text('Generated by ai-autosite.com/tools/cornell-note', margin, paper.height - 8)

      doc.save(`cornell-notes-${config.paperSize}-${Date.now()}.pdf`)
      setPdfGenerated(true)
    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Privacy Badge */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      {/* Sample Notice */}
      {showSampleNotice && (
        <div className="fixed top-4 right-4 z-50 bg-purple-600/90 text-white px-4 py-3 rounded-xl 
                      shadow-lg flex items-center gap-3 animate-fade-in max-w-sm">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">Sample content loaded!</span>
          <button onClick={() => setShowSampleNotice(false)} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              Settings
            </h3>

            <div className="space-y-4">
              {/* Subject/Topic */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject / Topic</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.subject}
                    onChange={(e) => setConfig({...config, subject: e.target.value})}
                    placeholder="Enter your topic..."
                    className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl 
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400
                             transition-colors min-h-[48px]"
                  />
                  {!isSampleLoaded ? (
                    <button
                      onClick={loadSample}
                      className="px-4 py-3 bg-purple-500/20 text-purple-300 rounded-xl 
                               hover:bg-purple-500/30 transition-all font-medium text-sm
                               border border-purple-500/30 flex items-center gap-2 min-h-[48px]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Try Sample</span>
                    </button>
                  ) : (
                    <button
                      onClick={clearSample}
                      className="px-4 py-3 bg-red-500/20 text-red-300 rounded-xl 
                               hover:bg-red-500/30 transition-all font-medium text-sm
                               border border-red-500/30 flex items-center gap-2 min-h-[48px]"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Subject Template */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject Template</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SUBJECT_TEMPLATES.map(template => (
                    <button
                      key={template.value}
                      onClick={() => setConfig({...config, subjectTemplate: template.value})}
                      className={`px-3 py-2.5 rounded-lg font-medium transition-all text-xs
                                flex flex-col items-center gap-1 min-h-[60px] justify-center ${
                        config.subjectTemplate === template.value
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {template.icon}
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Size - Including B5 */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Paper Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PAPER_SIZES) as PaperSize[]).map(size => (
                    <button
                      key={size}
                      onClick={() => setConfig({...config, paperSize: size})}
                      className={`px-4 py-3 rounded-lg font-medium transition-all text-sm
                                min-h-[48px] ${
                        config.paperSize === size
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {size}
                      {size === 'B5' && <span className="block text-[10px] opacity-70">🇯🇵</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Style - Including Dot */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Line Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {LINE_STYLES.map(style => (
                    <button
                      key={style.value}
                      onClick={() => setConfig({...config, lineStyle: style.value})}
                      className={`px-3 py-3 rounded-lg font-medium transition-all text-sm
                                min-h-[48px] flex flex-col items-center gap-1 ${
                        config.lineStyle === style.value
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg">{style.icon}</span>
                      <span className="text-xs">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cue Ratio Slider */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Cue Column Ratio: <span className="text-cyan-400">{config.cueRatio}%</span> / {100 - config.cueRatio}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="40"
                  step="5"
                  value={config.cueRatio}
                  onChange={(e) => setConfig({...config, cueRatio: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                           [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20%</span>
                  <span>30% (Default)</span>
                  <span>40%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex justify-between items-center"
            >
              <span className="text-white font-medium flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                Advanced Options
              </span>
              {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            
            {showAdvanced && (
              <div className="px-4 pb-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showCropMarks}
                    onChange={(e) => setConfig({...config, showCropMarks: e.target.checked})}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-300">Add crop marks (for precise cutting)</span>
                </label>
              </div>
            )}
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
              <span className="text-xs text-gray-500 font-normal ml-2">{config.paperSize}</span>
              {isSampleLoaded && (
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                  Sample
                </span>
              )}
            </h3>

            <div className="bg-white rounded-lg p-4 sm:p-6 aspect-[1/1.4] relative overflow-hidden">
              {/* Crop marks in preview */}
              {config.showCropMarks && (
                <>
                  <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-gray-400" />
                  <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-gray-400" />
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-gray-400" />
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-gray-400" />
                </>
              )}

              {/* Header */}
              <div className="flex justify-between items-start mb-3 sm:mb-4 pb-2 border-b-2 border-gray-300">
                <div>
                  <div className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg truncate pr-2">
                    {config.subject || 'Cornell Notes'}
                  </div>
                  {config.subjectTemplate !== 'general' && (
                    <div className="text-[8px] text-gray-400">[{currentTemplate.label}]</div>
                  )}
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
                  <div className="text-[8px] sm:text-[10px] text-gray-400 font-medium mb-2">
                    {currentTemplate.cueLabels[0]}
                  </div>
                  {isSampleLoaded ? (
                    <div className="space-y-2 text-[7px] sm:text-[8px] text-gray-700">
                      {SAMPLE_DATA.cueNotes.slice(0, 4).map((note, idx) => (
                        <div key={idx} className={idx > 0 ? 'mt-2 sm:mt-3' : ''}>{note}</div>
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
                      {config.lineStyle === 'dot' && (
                        <div className="mt-2 opacity-30">
                          {[...Array(6)].map((_, row) => (
                            <div key={row} className="flex gap-1 mb-2">
                              {[...Array(4)].map((_, col) => (
                                <div key={col} className="w-1 h-1 rounded-full bg-gray-400" />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Note Area */}
                <div className="border-2 border-gray-300 rounded p-2 flex-1 overflow-hidden">
                  <div className="text-[8px] sm:text-[10px] text-gray-400 font-medium mb-2">
                    {currentTemplate.noteLabel}
                  </div>
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
                      {config.lineStyle === 'dot' && (
                        <div className="mt-2 opacity-30">
                          {[...Array(6)].map((_, row) => (
                            <div key={row} className="flex gap-1 mb-2">
                              {[...Array(10)].map((_, col) => (
                                <div key={col} className="w-1 h-1 rounded-full bg-gray-400" />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Summary Area */}
              <div className="mt-2 border-2 border-gray-300 rounded p-2 h-[60px] sm:h-[80px] overflow-hidden">
                <div className="text-[8px] sm:text-[10px] text-gray-400 font-medium mb-1">
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

      {/* Success Banner */}
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

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📄</div>
          <div className="text-xs text-gray-400">A4 / Letter / B5</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📏</div>
          <div className="text-xs text-gray-400">Adjustable ratio</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📚</div>
          <div className="text-xs text-gray-400">6 subject templates</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">⋯</div>
          <div className="text-xs text-gray-400">Ruled / Grid / Dot</div>
        </div>
      </div>
    </div>
  )
}