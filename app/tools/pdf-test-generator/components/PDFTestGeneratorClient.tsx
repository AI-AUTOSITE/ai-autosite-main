'use client'

import { useState, useEffect } from 'react'
import { FileDown, FileText, CheckCircle, Loader2, AlertCircle, HelpCircle } from 'lucide-react'
import ToolGuide from '../guide'

interface PDFType {
  id: 'short' | 'medium' | 'long'
  title: string
  wordCount: string
  pages: string
  color: string
  features: string[]
  buttonGradient: string
}

const pdfTypes: PDFType[] = [
  {
    id: 'short',
    title: 'Short PDF',
    wordCount: '~500 words',
    pages: '2 pages',
    color: 'green',
    features: [
      'Basic extraction test',
      'Simple structure',
      'Quick processing'
    ],
    buttonGradient: 'from-green-500 to-teal-500'
  },
  {
    id: 'medium',
    title: 'Medium PDF',
    wordCount: '~1500 words',
    pages: '5-6 pages',
    color: 'blue',
    features: [
      'Multiple sections',
      'Structured content',
      'Realistic document'
    ],
    buttonGradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'long',
    title: 'Long PDF',
    wordCount: '~3000 words',
    pages: '10+ pages',
    color: 'purple',
    features: [
      'Complex structure',
      'Comprehensive test',
      'Full report format'
    ],
    buttonGradient: 'from-purple-500 to-pink-500'
  }
]

// Generate Lorem Ipsum with meaning
const generateMeaningfulText = () => {
  const paragraphs = {
    tech: [
      'The rapid advancement of technology has fundamentally transformed how we live, work, and interact with the world around us. From artificial intelligence to quantum computing, each breakthrough brings new possibilities and challenges that shape our collective future.',
      'Cloud computing has revolutionized the way businesses operate, providing scalable infrastructure that adapts to changing demands. Organizations can now deploy applications globally within minutes, reaching customers across continents with unprecedented efficiency.',
      'Machine learning algorithms have become increasingly sophisticated, enabling computers to recognize patterns and make decisions with accuracy that rivals human expertise. These systems learn from vast datasets, continuously improving their performance through iterative training processes.',
      'The Internet of Things connects billions of devices worldwide, creating a network of smart sensors that collect and share data in real-time. This interconnected ecosystem enables automation, predictive maintenance, and enhanced decision-making across industries.',
      'Blockchain technology offers decentralized solutions for secure transactions and data management. By distributing information across multiple nodes, it creates tamper-resistant records that ensure transparency and accountability in digital interactions.'
    ],
    business: [
      'Modern business strategies require adaptability and innovation to remain competitive in rapidly evolving markets. Companies must balance traditional approaches with emerging technologies to create sustainable growth models that deliver value to stakeholders.',
      'Digital transformation has become essential for organizations seeking to optimize operations and enhance customer experiences. By leveraging data analytics and automation, businesses can streamline processes and make informed decisions based on real-time insights.',
      'Customer engagement has evolved beyond traditional marketing channels, with social media and personalized content playing crucial roles. Successful brands create meaningful connections by understanding customer preferences and delivering tailored experiences across touchpoints.',
      'Supply chain management has become increasingly complex, requiring sophisticated systems to coordinate global networks of suppliers and distributors. Advanced analytics help organizations predict disruptions and optimize inventory levels to meet demand efficiently.',
      'Sustainability initiatives are no longer optional but essential components of corporate strategy. Companies that prioritize environmental responsibility and social impact attract conscious consumers while building resilient business models for the future.'
    ],
    research: [
      'Scientific research continues to push the boundaries of human knowledge, exploring questions that challenge our understanding of the universe. Collaborative efforts across disciplines enable breakthroughs that would be impossible for individual researchers to achieve alone.',
      'Data-driven research methodologies have transformed how we approach complex problems, allowing scientists to analyze vast amounts of information. Statistical models and computational simulations provide insights that guide experimental design and hypothesis testing.',
      'Peer review processes ensure the quality and integrity of scientific publications, maintaining standards that support reproducible research. This systematic evaluation helps identify potential flaws and strengthens the validity of scientific findings before public dissemination.',
      'Interdisciplinary collaboration brings together experts from diverse fields to tackle multifaceted challenges. By combining different perspectives and methodologies, researchers can develop innovative solutions that transcend traditional academic boundaries.',
      'Open science initiatives promote transparency and accessibility in research, making data and publications freely available to the global community. This democratization of knowledge accelerates scientific progress and enables broader participation in discovery.'
    ]
  }
  return paragraphs
}

export default function PDFTestGeneratorClient() {
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [jsPDFLoaded, setJsPDFLoaded] = useState(false)
  const [error, setError] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const [currentlyGenerating, setCurrentlyGenerating] = useState<string | null>(null)

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
    setCurrentlyGenerating(type)
    setError('')

    try {
      const { jsPDF } = (window as any).jspdf
      const doc = new jsPDF()
      const texts = generateMeaningfulText()

      // Helper function to add wrapped text
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const lines = doc.splitTextToSize(text, maxWidth)
        lines.forEach((line: string, index: number) => {
          doc.text(line, x, y + (index * lineHeight))
        })
        return y + (lines.length * lineHeight)
      }

      if (type === 'short') {
        // Short PDF - ~500 words
        doc.setFontSize(24)
        doc.text('Short Test Document', 20, 25)
        doc.setFontSize(12)
        doc.text('Technology and Innovation Report', 20, 35)
        doc.text('Generated: ' + new Date().toLocaleDateString(), 20, 42)
        
        doc.setFontSize(14)
        doc.text('Executive Summary', 20, 60)
        doc.setFontSize(11)
        let y = addWrappedText(texts.tech[0], 20, 72, 170, 6)
        
        doc.setFontSize(14)
        doc.text('Introduction', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[0], 20, y + 27, 170, 6)
        
        // Page 2
        doc.addPage()
        doc.setFontSize(14)
        doc.text('Key Findings', 20, 25)
        doc.setFontSize(11)
        y = addWrappedText(texts.research[0], 20, 37, 170, 6)
        
        doc.setFontSize(14)
        doc.text('Conclusion', 20, y + 15)
        doc.setFontSize(11)
        const conclusion = 'This document demonstrates basic PDF generation capabilities with meaningful content. The structured format includes multiple sections with comprehensive text that simulates real-world documents used for testing and validation purposes.'
        addWrappedText(conclusion, 20, y + 27, 170, 6)
        
        doc.save('test-short.pdf')
        
      } else if (type === 'medium') {
        // Medium PDF - ~1500 words
        doc.setFontSize(26)
        doc.text('Medium Test Document', 20, 25)
        doc.setFontSize(14)
        doc.text('Comprehensive Business Analysis Report', 20, 37)
        doc.setFontSize(11)
        doc.text('Document ID: ' + Math.random().toString(36).substr(2, 9).toUpperCase(), 20, 45)
        doc.text('Generated: ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString(), 20, 52)
        
        doc.setFontSize(16)
        doc.text('Table of Contents', 20, 70)
        doc.setFontSize(11)
        const toc = [
          '1. Executive Summary .......................... Page 1',
          '2. Market Analysis ............................ Page 2',
          '3. Technology Trends .......................... Page 3',
          '4. Business Strategy .......................... Page 4',
          '5. Research Findings .......................... Page 5',
          '6. Recommendations ............................ Page 6'
        ]
        let y = 85
        toc.forEach(item => {
          doc.text(item, 25, y)
          y += 7
        })
        
        // Page 2 - Executive Summary
        doc.addPage()
        doc.setFontSize(18)
        doc.text('1. Executive Summary', 20, 25)
        doc.setFontSize(11)
        y = addWrappedText(texts.tech[0], 20, 38, 170, 6)
        y = addWrappedText(texts.business[0], 20, y + 8, 170, 6)
        
        doc.setFontSize(14)
        doc.text('Key Objectives', 20, y + 15)
        doc.setFontSize(11)
        const objectives = [
          '• Analyze current market conditions and identify growth opportunities',
          '• Evaluate technological capabilities and infrastructure requirements',
          '• Develop strategic recommendations for sustainable expansion',
          '• Assess competitive landscape and market positioning',
          '• Define metrics for measuring success and ROI'
        ]
        y += 27
        objectives.forEach(obj => {
          doc.text(obj, 25, y)
          y += 7
        })
        
        // Page 3 - Market Analysis
        doc.addPage()
        doc.setFontSize(18)
        doc.text('2. Market Analysis', 20, 25)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[1], 20, 38, 170, 6)
        y = addWrappedText(texts.business[2], 20, y + 8, 170, 6)
        
        doc.setFontSize(14)
        doc.text('Market Segments', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[3], 20, y + 27, 170, 6)
        
        // Page 4 - Technology Trends
        doc.addPage()
        doc.setFontSize(18)
        doc.text('3. Technology Trends', 20, 25)
        doc.setFontSize(11)
        y = addWrappedText(texts.tech[1], 20, 38, 170, 6)
        y = addWrappedText(texts.tech[2], 20, y + 8, 170, 6)
        
        doc.setFontSize(14)
        doc.text('Emerging Technologies', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.tech[3], 20, y + 27, 170, 6)
        
        // Page 5 - Business Strategy
        doc.addPage()
        doc.setFontSize(18)
        doc.text('4. Business Strategy', 20, 25)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[4], 20, 38, 170, 6)
        y = addWrappedText(texts.research[1], 20, y + 8, 170, 6)
        
        // Page 6 - Recommendations
        doc.addPage()
        doc.setFontSize(18)
        doc.text('5. Recommendations', 20, 25)
        doc.setFontSize(11)
        const recommendations = [
          '1. Implement phased digital transformation initiative starting Q2 2025',
          '2. Invest in AI and machine learning capabilities for predictive analytics',
          '3. Establish strategic partnerships with technology providers',
          '4. Develop comprehensive training programs for workforce upskilling',
          '5. Create innovation labs for rapid prototyping and testing',
          '6. Enhance cybersecurity infrastructure to protect digital assets',
          '7. Adopt agile methodologies for project management and development',
          '8. Build data governance framework for compliance and quality'
        ]
        y = 38
        recommendations.forEach(rec => {
          doc.text(rec, 25, y)
          y += 8
        })
        
        doc.setFontSize(14)
        doc.text('Next Steps', 20, y + 10)
        doc.setFontSize(11)
        y = addWrappedText('Organizations should prioritize these recommendations based on their specific context and resources. Regular assessment and adjustment of strategies will be essential for successful implementation.', 20, y + 22, 170, 6)
        
        doc.save('test-medium.pdf')
        
      } else if (type === 'long') {
        // Long PDF - ~3000 words
        doc.setFontSize(28)
        doc.text('Comprehensive Research Report', 20, 30)
        doc.setFontSize(16)
        doc.text('Digital Transformation in the Modern Enterprise', 20, 42)
        doc.setFontSize(12)
        doc.text('A Detailed Analysis of Technology, Strategy, and Implementation', 20, 52)
        doc.setFontSize(11)
        doc.text('Document Version: 1.0', 20, 65)
        doc.text('Classification: Public', 20, 72)
        doc.text('Generated: ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString(), 20, 79)
        doc.text('Total Pages: 10+', 20, 86)
        
        doc.setFontSize(16)
        doc.text('Table of Contents', 20, 105)
        doc.setFontSize(11)
        const longToc = [
          '1. Executive Summary .......................... Page 2',
          '2. Introduction ............................... Page 3',
          '3. Current State Analysis ..................... Page 4',
          '4. Technology Assessment ....................... Page 5',
          '5. Market Research ............................. Page 6',
          '6. Competitive Analysis ........................ Page 7',
          '7. Implementation Strategy ..................... Page 8',
          '8. Risk Assessment ............................. Page 9',
          '9. Financial Projections ....................... Page 10',
          '10. Conclusions and Recommendations ............ Page 11'
        ]
        let y = 120
        longToc.forEach(item => {
          doc.text(item, 25, y)
          y += 7
        })
        
        // Page 2 - Executive Summary
        doc.addPage()
        doc.setFontSize(20)
        doc.text('1. Executive Summary', 20, 25)
        doc.setFontSize(11)
        y = 40
        texts.tech.forEach(paragraph => {
          y = addWrappedText(paragraph, 20, y, 170, 6)
          y += 8
        })
        
        // Page 3 - Introduction
        doc.addPage()
        doc.setFontSize(20)
        doc.text('2. Introduction', 20, 25)
        doc.setFontSize(14)
        doc.text('2.1 Background and Context', 20, 40)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[0], 20, 52, 170, 6)
        y = addWrappedText(texts.business[1], 20, y + 8, 170, 6)
        
        doc.setFontSize(14)
        doc.text('2.2 Scope and Objectives', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.research[0], 20, y + 27, 170, 6)
        
        // Page 4 - Current State Analysis
        doc.addPage()
        doc.setFontSize(20)
        doc.text('3. Current State Analysis', 20, 25)
        doc.setFontSize(14)
        doc.text('3.1 Infrastructure Assessment', 20, 40)
        doc.setFontSize(11)
        y = addWrappedText(texts.tech[1], 20, 52, 170, 6)
        
        doc.setFontSize(14)
        doc.text('3.2 Process Evaluation', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[2], 20, y + 27, 170, 6)
        
        doc.setFontSize(14)
        doc.text('3.3 Capability Maturity', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.research[1], 20, y + 27, 170, 6)
        
        // Page 5 - Technology Assessment
        doc.addPage()
        doc.setFontSize(20)
        doc.text('4. Technology Assessment', 20, 25)
        doc.setFontSize(14)
        doc.text('4.1 Cloud Computing Infrastructure', 20, 40)
        doc.setFontSize(11)
        y = addWrappedText(texts.tech[2], 20, 52, 170, 6)
        
        doc.setFontSize(14)
        doc.text('4.2 Data Analytics Platforms', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.tech[3], 20, y + 27, 170, 6)
        
        doc.setFontSize(14)
        doc.text('4.3 Security Considerations', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.tech[4], 20, y + 27, 170, 6)
        
        // Page 6 - Market Research
        doc.addPage()
        doc.setFontSize(20)
        doc.text('5. Market Research', 20, 25)
        doc.setFontSize(14)
        doc.text('5.1 Industry Trends', 20, 40)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[3], 20, 52, 170, 6)
        
        doc.setFontSize(14)
        doc.text('5.2 Customer Insights', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.business[4], 20, y + 27, 170, 6)
        
        doc.setFontSize(14)
        doc.text('5.3 Market Opportunities', 20, y + 15)
        doc.setFontSize(11)
        const marketOpp = 'Emerging markets present significant growth potential for organizations that can adapt their offerings to local needs. Digital channels enable cost-effective expansion into new geographic regions while maintaining operational efficiency.'
        y = addWrappedText(marketOpp, 20, y + 27, 170, 6)
        
        // Page 7 - Competitive Analysis
        doc.addPage()
        doc.setFontSize(20)
        doc.text('6. Competitive Analysis', 20, 25)
        doc.setFontSize(14)
        doc.text('6.1 Competitor Landscape', 20, 40)
        doc.setFontSize(11)
        y = addWrappedText(texts.research[2], 20, 52, 170, 6)
        
        doc.setFontSize(14)
        doc.text('6.2 Competitive Advantages', 20, y + 15)
        doc.setFontSize(11)
        y = addWrappedText(texts.research[3], 20, y + 27, 170, 6)
        
        doc.setFontSize(14)
        doc.text('6.3 Market Positioning', 20, y + 15)
        doc.setFontSize(11)
        const positioning = 'Strategic positioning requires careful consideration of organizational strengths and market demands. Companies must differentiate themselves through unique value propositions that resonate with target audiences.'
        y = addWrappedText(positioning, 20, y + 27, 170, 6)
        
        // Page 8 - Implementation Strategy
        doc.addPage()
        doc.setFontSize(20)
        doc.text('7. Implementation Strategy', 20, 25)
        doc.setFontSize(14)
        doc.text('7.1 Phased Approach', 20, 40)
        doc.setFontSize(11)
        const phases = [
          'Phase 1: Foundation (Months 1-3) - Establish governance framework and baseline assessment',
          'Phase 2: Pilot Programs (Months 4-6) - Launch targeted initiatives in selected departments',
          'Phase 3: Scaling (Months 7-12) - Expand successful pilots across the organization',
          'Phase 4: Optimization (Months 13-18) - Refine processes and maximize value realization',
          'Phase 5: Innovation (Ongoing) - Continuous improvement and emerging technology adoption'
        ]
        y = 52
        phases.forEach(phase => {
          y = addWrappedText(phase, 25, y, 165, 6)
          y += 5
        })
        
        doc.setFontSize(14)
        doc.text('7.2 Change Management', 20, y + 10)
        doc.setFontSize(11)
        y = addWrappedText(texts.research[4], 20, y + 22, 170, 6)
        
        // Page 9 - Risk Assessment
        doc.addPage()
        doc.setFontSize(20)
        doc.text('8. Risk Assessment', 20, 25)
        doc.setFontSize(14)
        doc.text('8.1 Technical Risks', 20, 40)
        doc.setFontSize(11)
        const techRisks = [
          '• System integration complexity may extend implementation timelines',
          '• Legacy infrastructure compatibility could require additional investment',
          '• Data migration challenges might impact operational continuity',
          '• Cybersecurity threats require comprehensive protection strategies'
        ]
        y = 52
        techRisks.forEach(risk => {
          doc.text(risk, 25, y)
          y += 8
        })
        
        doc.setFontSize(14)
        doc.text('8.2 Organizational Risks', 20, y + 10)
        doc.setFontSize(11)
        const orgRisks = [
          '• Resistance to change from employees accustomed to existing processes',
          '• Skills gaps requiring extensive training and development programs',
          '• Resource constraints limiting implementation scope and speed',
          '• Cultural misalignment with digital transformation objectives'
        ]
        y += 22
        orgRisks.forEach(risk => {
          doc.text(risk, 25, y)
          y += 8
        })
        
        doc.setFontSize(14)
        doc.text('8.3 Mitigation Strategies', 20, y + 10)
        doc.setFontSize(11)
        const mitigation = 'Proactive risk management involves regular assessment, stakeholder engagement, and contingency planning. Organizations should establish clear governance structures and communication channels to address challenges as they arise.'
        y = addWrappedText(mitigation, 20, y + 22, 170, 6)
        
        // Page 10 - Financial Projections
        doc.addPage()
        doc.setFontSize(20)
        doc.text('9. Financial Projections', 20, 25)
        doc.setFontSize(14)
        doc.text('9.1 Investment Requirements', 20, 40)
        doc.setFontSize(11)
        const investment = 'Initial investment estimates range from $2-5 million for mid-size organizations, including technology infrastructure, consulting services, and training programs. Costs vary based on organizational complexity and transformation scope.'
        y = addWrappedText(investment, 20, 52, 170, 6)
        
        doc.setFontSize(14)
        doc.text('9.2 ROI Analysis', 20, y + 15)
        doc.setFontSize(11)
        const roi = [
          '• Year 1: -15% (Investment phase)',
          '• Year 2: 5% (Early returns)',
          '• Year 3: 25% (Acceleration)',
          '• Year 4: 45% (Optimization)',
          '• Year 5: 60% (Full value realization)'
        ]
        y += 27
        roi.forEach(item => {
          doc.text(item, 25, y)
          y += 8
        })
        
        doc.setFontSize(14)
        doc.text('9.3 Cost-Benefit Analysis', 20, y + 10)
        doc.setFontSize(11)
        const costBenefit = 'Benefits include operational efficiency gains of 30-40%, customer satisfaction improvements of 25%, and revenue growth potential of 15-20% annually. These projections assume successful implementation and adoption across the organization.'
        y = addWrappedText(costBenefit, 20, y + 22, 170, 6)
        
        // Page 11 - Conclusions
        doc.addPage()
        doc.setFontSize(20)
        doc.text('10. Conclusions and Recommendations', 20, 25)
        doc.setFontSize(14)
        doc.text('10.1 Key Findings', 20, 40)
        doc.setFontSize(11)
        const findings = [
          '1. Digital transformation is essential for maintaining competitive advantage',
          '2. Success requires commitment from leadership and cultural change',
          '3. Phased implementation reduces risk and enables learning',
          '4. Investment in people is as important as technology investment',
          '5. Continuous adaptation is necessary in rapidly changing markets'
        ]
        y = 52
        findings.forEach(finding => {
          doc.text(finding, 25, y)
          y += 8
        })
        
        doc.setFontSize(14)
        doc.text('10.2 Strategic Recommendations', 20, y + 10)
        doc.setFontSize(11)
        const stratRec = [
          '• Establish dedicated transformation office with executive sponsorship',
          '• Develop comprehensive change management and communication plan',
          '• Create innovation culture through incentives and recognition programs',
          '• Build strategic partnerships with technology vendors and consultants',
          '• Implement robust measurement framework for tracking progress'
        ]
        y += 22
        stratRec.forEach(rec => {
          doc.text(rec, 25, y)
          y += 8
        })
        
        doc.setFontSize(14)
        doc.text('10.3 Next Steps', 20, y + 10)
        doc.setFontSize(11)
        const nextSteps = 'Organizations should begin by conducting detailed assessments of current capabilities and defining clear transformation objectives. Stakeholder alignment and resource allocation are critical first steps toward successful implementation.'
        y = addWrappedText(nextSteps, 20, y + 22, 170, 6)
        
        doc.setFontSize(14)
        doc.text('10.4 Closing Remarks', 20, y + 15)
        doc.setFontSize(11)
        const closing = 'This comprehensive report provides a roadmap for digital transformation success. Organizations that embrace change and invest strategically in technology and people will be well-positioned for future growth and innovation.'
        addWrappedText(closing, 20, y + 27, 170, 6)
        
        doc.save('test-long.pdf')
      }

      setGenerated(true)
      setLoading(false)
      setCurrentlyGenerating(null)
      setTimeout(() => setGenerated(false), 3000)
    } catch (err: any) {
      console.error('PDF generation error:', err)
      setError('Failed to generate PDF: ' + err.message)
      setLoading(false)
      setCurrentlyGenerating(null)
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-400'
      },
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400'
      },
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400'
      }
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ToolGuide onClose={() => setShowGuide(false)} />
        </div>
      )}

      {/* Status Messages */}
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
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 mb-6 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400 font-medium">
            PDF generated successfully! Check your downloads.
          </p>
        </div>
      )}

      {/* PDF Options Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {pdfTypes.map((pdfType) => {
          const colorClasses = getColorClasses(pdfType.color)
          const isGenerating = currentlyGenerating === pdfType.id
          
          return (
            <div 
              key={pdfType.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 hover:border-white/20 transition-colors"
            >
              <div className="text-center mb-4">
                <div className={`w-12 h-12 ${colorClasses.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <FileText className={`w-6 h-6 ${colorClasses.text}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {pdfType.title}
                </h3>
                <p className="text-gray-400 text-sm mb-1">{pdfType.wordCount}</p>
                <p className="text-gray-500 text-xs">{pdfType.pages}</p>
              </div>
              
              <ul className="text-gray-300 text-sm space-y-2 mb-6">
                {pdfType.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => generatePDF(pdfType.id)}
                disabled={!jsPDFLoaded || loading}
                className={`w-full py-3 sm:py-3.5 bg-gradient-to-r ${pdfType.buttonGradient} text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileDown className="w-5 h-5" />
                )}
                Generate {pdfType.title.split(' ')[0]}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}