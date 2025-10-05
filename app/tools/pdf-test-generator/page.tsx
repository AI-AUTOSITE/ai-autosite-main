'use client'

import { useState, useEffect } from 'react'
import { FileDown, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

export default function PDFTestGeneratorPage() {
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [jsPDFLoaded, setJsPDFLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    script.async = true
    script.onload = () => {
      console.log('jsPDF loaded')
      setJsPDFLoaded(true)
    }
    script.onerror = () => {
      setError('Failed to load PDF library')
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const generatePDF = (type: 'short' | 'medium' | 'long') => {
    if (!jsPDFLoaded || !(window as any).jspdf) {
      setError('PDF library not loaded yet. Please wait.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const { jsPDF } = (window as any).jspdf
      const doc = new jsPDF()

      if (type === 'short') {
        doc.setFontSize(20)
        doc.text('Short Test Document', 20, 20)
        
        doc.setFontSize(12)
        doc.text('This is a short test PDF for validation purposes.', 20, 40)
        doc.text('It contains approximately 200 words to test the "Short" summary mode.', 20, 50)
        
        doc.text('Key Points:', 20, 70)
        doc.text('- This document tests basic PDF text extraction', 25, 80)
        doc.text('- It should generate a concise bullet-point summary', 25, 90)
        doc.text('- The summary should be 100-200 words', 25, 100)
        
        doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 20, 120)
        doc.text('Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 20, 130)
        doc.text('Ut enim ad minim veniam, quis nostrud exercitation ullamco.', 20, 140)
        
        doc.save('test-short.pdf')
      } 
      else if (type === 'medium') {
        doc.setFontSize(20)
        doc.text('Medium Test Document', 20, 20)
        
        doc.setFontSize(16)
        doc.text('Executive Summary', 20, 40)
        doc.setFontSize(12)
        doc.text('This medium-length document is designed to test the PDF summarizer', 20, 55)
        doc.text('with approximately 800 words of content across multiple sections.', 20, 63)
        
        doc.text('Section 1: Introduction', 20, 85)
        const intro = [
          'Artificial intelligence has revolutionized many industries in recent years.',
          'Machine learning algorithms can now process vast amounts of data efficiently.',
          'Natural language processing enables computers to understand human language.',
          'Deep learning models have achieved remarkable results in image recognition.',
          'The field continues to evolve with new breakthroughs every year.'
        ]
        let y = 95
        intro.forEach(line => {
          doc.text(line, 20, y)
          y += 8
        })
        
        doc.text('Section 2: Key Findings', 20, y + 10)
        y += 20
        const findings = [
          '1. AI adoption has increased by 300% in the past five years',
          '2. Companies using AI report 25% higher productivity',
          '3. Investment in AI research reached $50 billion globally',
          '4. 75% of businesses plan to implement AI by 2025',
          '5. Job market demands for AI skills grew by 400%'
        ]
        findings.forEach(line => {
          doc.text(line, 20, y)
          y += 8
        })
        
        doc.addPage()
        doc.setFontSize(16)
        doc.text('Section 3: Recommendations', 20, 20)
        doc.setFontSize(12)
        doc.text('Based on our findings, we recommend:', 20, 35)
        const recs = [
          '1. Invest in AI training programs',
          '2. Start with small pilot projects',
          '3. Establish data governance policies',
          '4. Collaborate with technology partners',
          '5. Monitor AI performance regularly'
        ]
        y = 50
        recs.forEach(line => {
          doc.text(line, 20, y)
          y += 8
        })
        
        doc.save('test-medium.pdf')
      }
      else if (type === 'long') {
        doc.setFontSize(22)
        doc.text('Comprehensive Research Report', 20, 20)
        doc.setFontSize(14)
        doc.text('The Future of Artificial Intelligence in Business', 20, 35)
        
        doc.setFontSize(16)
        doc.text('Table of Contents', 20, 55)
        doc.setFontSize(11)
        const toc = [
          '1. Executive Summary',
          '2. Introduction', 
          '3. Current State of AI',
          '4. Industry Analysis',
          '5. Recommendations'
        ]
        let y = 70
        toc.forEach(line => {
          doc.text(line, 25, y)
          y += 7
        })
        
        // Page 2
        doc.addPage()
        doc.setFontSize(18)
        doc.text('1. Executive Summary', 20, 20)
        doc.setFontSize(11)
        const exec = [
          'This report examines AI adoption in business. Key findings show 40% annual',
          'growth in technology sectors. Organizations report 25-30% ROI improvements.',
          'Challenges include talent shortages and data quality issues.'
        ]
        y = 35
        exec.forEach(line => {
          doc.text(line, 20, y)
          y += 7
        })
        
        // Page 3
        doc.addPage()
        doc.setFontSize(18)
        doc.text('2. Current State of AI', 20, 20)
        doc.setFontSize(11)
        const current = [
          'AI adoption reached 77% of companies. Common use cases include:',
          '- Customer service automation',
          '- Predictive analytics',
          '- Process automation',
          '- Fraud detection',
          '',
          'Global investment reached $93B in 2023, up from $12B in 2015.'
        ]
        y = 35
        current.forEach(line => {
          if (line.startsWith('-')) {
            doc.text(line, 25, y)
          } else {
            doc.text(line, 20, y)
          }
          y += 7
        })
        
        // Page 4
        doc.addPage()
        doc.setFontSize(18)
        doc.text('3. Industry Analysis', 20, 20)
        doc.setFontSize(11)
        const industries = [
          'Healthcare: AI in medical imaging improved accuracy by 20-30%.',
          'Financial Services: 70% of customer inquiries handled by AI.',
          'Retail: Recommendation engines drive 35% of sales.',
          'Manufacturing: Predictive maintenance reduces downtime by 50%.'
        ]
        y = 35
        industries.forEach(line => {
          doc.text(line, 20, y)
          y += 10
        })
        
        // Page 5
        doc.addPage()
        doc.setFontSize(18)
        doc.text('4. Recommendations', 20, 20)
        doc.setFontSize(11)
        const recommendations = [
          '1. Executive leadership commitment',
          '2. Clear strategy aligned with business goals',
          '3. Investment in data infrastructure',
          '4. Talent development programs',
          '5. Ethical frameworks and governance',
          '',
          'Companies that approach AI strategically will thrive in the AI economy.'
        ]
        y = 35
        recommendations.forEach(line => {
          doc.text(line, 20, y)
          y += 8
        })
        
        doc.save('test-long.pdf')
      }
      
      setGenerated(true)
      setLoading(false)
      setTimeout(() => setGenerated(false), 3000)
    } catch (err: any) {
      console.error('PDF generation error:', err)
      setError('Failed to generate PDF: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-4">
          PDF Test File Generator
        </h1>
        <p className="text-gray-300 text-lg">
          Generate test PDFs for validating your summarizer
        </p>
      </div>

      {!jsPDFLoaded && !error && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
          <Loader2 className="w-5 h-5 text-blue-400 flex-shrink-0 animate-spin" />
          <p className="text-blue-400 font-medium">Loading PDF library...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {generated && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400 font-medium">
            PDF generated successfully! Check your downloads.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Short */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Short PDF</h3>
            <p className="text-gray-400 text-sm mb-4">~200 words, 1 page</p>
          </div>
          <ul className="text-gray-300 text-sm space-y-2 mb-6">
            <li>• Basic extraction test</li>
            <li>• Simple structure</li>
            <li>• Quick processing</li>
          </ul>
          <button
            onClick={() => generatePDF('short')}
            disabled={!jsPDFLoaded || loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
            Generate Short
          </button>
        </div>

        {/* Medium */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Medium PDF</h3>
            <p className="text-gray-400 text-sm mb-4">~800 words, 2-3 pages</p>
          </div>
          <ul className="text-gray-300 text-sm space-y-2 mb-6">
            <li>• Multiple sections</li>
            <li>• Structured content</li>
            <li>• Realistic document</li>
          </ul>
          <button
            onClick={() => generatePDF('medium')}
            disabled={!jsPDFLoaded || loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
            Generate Medium
          </button>
        </div>

        {/* Long */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Long PDF</h3>
            <p className="text-gray-400 text-sm mb-4">~2000 words, 5+ pages</p>
          </div>
          <ul className="text-gray-300 text-sm space-y-2 mb-6">
            <li>• Complex structure</li>
            <li>• Comprehensive test</li>
            <li>• Full report format</li>
          </ul>
          <button
            onClick={() => generatePDF('long')}
            disabled={!jsPDFLoaded || loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
            Generate Long
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">📝 Testing Guide</h3>
        <ol className="text-gray-300 space-y-2 text-sm">
          <li>1. Click a button to generate test PDF</li>
          <li>2. Upload to your PDF summarizer</li>
          <li>3. Select matching summary length</li>
          <li>4. Verify summary quality</li>
        </ol>
      </div>
    </div>
  )
}