// app/blog/pdf-to-data-guide/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import {
  FileSpreadsheet,
  Sparkles,
  Table,
  FileText,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Zap,
  Brain,
  Download,
  Clock,
  TrendingUp,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'PDF to CSV/Excel Converter - AI-Powered Table Extraction | AI-AutoSite',
  description:
    'Convert PDF tables to CSV or Excel with AI. Extract data from scanned documents, invoices, and reports with 99% accuracy. Free online tool.',
  keywords:
    'pdf to csv, pdf to excel, table extraction, ai data extraction, pdf converter, csv converter, excel converter, ocr, data processing',
  authors: [{ name: 'AI-AutoSite Team' }],
  creator: 'AI-AutoSite',
  publisher: 'AI-AutoSite',
  robots: 'index, follow, max-image-preview:large',
  openGraph: {
    title: 'PDF to CSV/Excel - AI-Powered Data Extraction Tool',
    description:
      'Extract tables from PDFs with AI. Convert to CSV or Excel format instantly. 99% accuracy.',
    type: 'article',
    url: 'https://ai-autosite.com/blog/pdf-to-data-guide',
    siteName: 'AI-AutoSite',
    publishedTime: '2025-01-30T00:00:00.000Z',
    modifiedTime: '2025-01-30T00:00:00.000Z',
    authors: ['AI-AutoSite Team'],
    tags: ['PDF', 'CSV', 'Excel', 'AI', 'Data Extraction'],
    images: [
      {
        url: 'https://ai-autosite.com/og/pdf-to-data-guide.png',
        width: 1200,
        height: 630,
        alt: 'PDF to Data Converter Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ai_autosite',
    creator: '@ai_autosite',
    title: 'PDF to CSV/Excel - AI Data Extraction',
    description: 'Extract tables from PDFs with AI accuracy. Convert to CSV or Excel instantly.',
    images: ['https://ai-autosite.com/og/pdf-to-data-guide.png'],
  },
  alternates: {
    canonical: 'https://ai-autosite.com/blog/pdf-to-data-guide',
  },
}

export default function PDFtoDataGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link
            href="/tools/pdf-to-data"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            Try PDF to Data
          </Link>
        </nav>
      </header>

      {/* Article */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-POWERED TOOL
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            PDF to CSV/Excel: AI-Powered Data Extraction
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Transform PDF tables into CSV or Excel files with 99% accuracy. Our AI understands
            complex layouts, merged cells, and even scanned documents.
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />1 minute processing
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              AI-Powered
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              99% Accuracy
            </span>
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Ready to extract your data?</h3>
              <p className="text-gray-400">Upload a PDF and get structured data in seconds.</p>
            </div>
            <Link
              href="/tools/pdf-to-data"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
            >
              Launch Converter
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          {/* What is PDF to Data Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">What is PDF to Data Converter?</h2>

            <p className="text-gray-300 mb-6">
              PDF to Data is an AI-powered tool that extracts tables and structured data from PDF
              documents and converts them into CSV or Excel format. Unlike traditional converters,
              our AI understands context, handles complex layouts, and even works with scanned
              documents.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <Brain className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">AI Understanding</h3>
                <p className="text-sm text-gray-400">
                  Intelligently recognizes tables, headers, and data relationships.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <Table className="w-8 h-8 text-teal-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">Complex Tables</h3>
                <p className="text-sm text-gray-400">
                  Handles merged cells, multi-line text, and nested tables.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <Download className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">Multiple Formats</h3>
                <p className="text-sm text-gray-400">
                  Export to CSV for data analysis or Excel for spreadsheet work.
                </p>
              </div>
            </div>
          </section>

          {/* Why AI Makes a Difference Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Why AI Makes All the Difference</h2>

            <div className="bg-orange-500/10 border-l-4 border-orange-400 p-6 mb-6 rounded-r-lg">
              <h3 className="font-semibold text-orange-300 mb-2">Traditional PDF Converters:</h3>
              <ul className="text-orange-200 text-sm space-y-2">
                <li>• Fail with scanned documents</li>
                <li>• Can't understand merged cells</li>
                <li>• Mix up columns and rows</li>
                <li>• Require manual cleanup</li>
              </ul>
            </div>

            <div className="bg-green-500/10 border-l-4 border-green-400 p-6 mb-8 rounded-r-lg">
              <h3 className="font-semibold text-green-300 mb-2">Our AI-Powered Solution:</h3>
              <ul className="text-green-200 text-sm space-y-2">
                <li>• OCR for scanned documents</li>
                <li>• Understands table structure</li>
                <li>• Preserves data relationships</li>
                <li>• Clean, ready-to-use output</li>
              </ul>
            </div>
          </section>

          {/* Perfect For Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Perfect Use Cases</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-emerald-400 mb-3">💰 Financial Reports</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Extract financial data from annual reports, statements, and invoices.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Income statements</li>
                  <li>• Balance sheets</li>
                  <li>• Invoice tables</li>
                  <li>• Transaction records</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-teal-400 mb-3">📊 Research Data</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Convert research papers and academic documents into analyzable data.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Statistical tables</li>
                  <li>• Survey results</li>
                  <li>• Experimental data</li>
                  <li>• Comparison matrices</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-3">🏢 Business Documents</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Transform business PDFs into actionable spreadsheets.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Price lists</li>
                  <li>• Product catalogs</li>
                  <li>• Employee records</li>
                  <li>• Inventory reports</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-purple-400 mb-3">🏛️ Government Forms</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Extract data from official documents and forms.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Tax documents</li>
                  <li>• Census data</li>
                  <li>• Regulatory filings</li>
                  <li>• Public records</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Upload Your PDF</h3>
                  <p className="text-gray-400 text-sm">
                    Drop your PDF file or select from your computer. Supports files up to 50MB.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">AI Analysis</h3>
                  <p className="text-gray-400 text-sm">
                    Our AI scans the document, identifies tables, and understands the structure.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Preview & Edit</h3>
                  <p className="text-gray-400 text-sm">
                    Review the extracted data and make any adjustments if needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Download Results</h3>
                  <p className="text-gray-400 text-sm">
                    Export your data as CSV for analysis or Excel for further processing.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Powerful Features</h2>

            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">OCR Technology</strong>
                      <p className="text-gray-400 text-sm">
                        Extract text from scanned PDFs and images
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Multi-Page Support</strong>
                      <p className="text-gray-400 text-sm">Process entire documents at once</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Format Preservation</strong>
                      <p className="text-gray-400 text-sm">
                        Maintains dates, numbers, and formulas
                      </p>
                    </div>
                  </li>
                </ul>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Smart Detection</strong>
                      <p className="text-gray-400 text-sm">Automatically finds all tables in PDF</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Batch Processing</strong>
                      <p className="text-gray-400 text-sm">
                        Convert multiple tables simultaneously
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Preview Mode</strong>
                      <p className="text-gray-400 text-sm">Check results before downloading</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Details Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Technical Excellence</h2>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-300 mb-3">🤖 AI Technology Stack</h3>
              <div className="grid md:grid-cols-2 gap-6 text-blue-200 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-100 mb-2">Recognition</h4>
                  <ul className="space-y-1">
                    <li>• Advanced OCR engine</li>
                    <li>• Layout analysis algorithms</li>
                    <li>• Table structure detection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-100 mb-2">Processing</h4>
                  <ul className="space-y-1">
                    <li>• Natural language understanding</li>
                    <li>• Context-aware extraction</li>
                    <li>• Data validation & cleanup</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-400">99%</div>
                <div className="text-sm text-gray-400">Accuracy Rate</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-teal-400">50MB</div>
                <div className="text-sm text-gray-400">Max File Size</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">60s</div>
                <div className="text-sm text-gray-400">Avg Processing</div>
              </div>
            </div>
          </section>

          {/* Comparison Table Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Why Choose Our Tool?</h2>

            <div className="overflow-x-auto">
              <table className="w-full border border-white/20 rounded-lg overflow-hidden">
                <thead className="bg-white/10">
                  <tr>
                    <th className="text-left p-4 font-semibold text-white">Feature</th>
                    <th className="text-center p-4 font-semibold text-emerald-400">Our Tool</th>
                    <th className="text-center p-4 font-semibold text-gray-400">Others</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="hover:bg-white/5">
                    <td className="p-4 text-gray-300">Scanned PDFs</td>
                    <td className="p-4 text-center text-green-400">✓ Full Support</td>
                    <td className="p-4 text-center text-red-400">✗ Limited</td>
                  </tr>
                  <tr className="bg-white/5 hover:bg-white/10">
                    <td className="p-4 text-gray-300">Complex Tables</td>
                    <td className="p-4 text-center text-green-400">✓ AI Handles</td>
                    <td className="p-4 text-center text-red-400">✗ Manual Fix</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-4 text-gray-300">Accuracy</td>
                    <td className="p-4 text-center text-green-400">99%</td>
                    <td className="p-4 text-center text-orange-400">70-80%</td>
                  </tr>
                  <tr className="bg-white/5 hover:bg-white/10">
                    <td className="p-4 text-gray-300">Processing Speed</td>
                    <td className="p-4 text-center text-green-400"> 1 minute</td>
                    <td className="p-4 text-center text-orange-400">3-5 minutes</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-4 text-gray-300">Free Tier</td>
                    <td className="p-4 text-center text-green-400">✓ 10 PDFs/day</td>
                    <td className="p-4 text-center text-orange-400">3 PDFs/day</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Pro Tips for Best Results</h2>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-300 mb-1">High Quality PDFs</h3>
                    <p className="text-gray-400 text-sm">
                      For scanned documents, use at least 300 DPI for optimal OCR accuracy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-300 mb-1">Clear Table Borders</h3>
                    <p className="text-gray-400 text-sm">
                      PDFs with visible table borders extract more accurately than borderless
                      tables.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-300 mb-1">Consistent Formatting</h3>
                    <p className="text-gray-400 text-sm">
                      Tables with consistent column widths and row heights process faster.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-300 mb-1">Preview First</h3>
                    <p className="text-gray-400 text-sm">
                      Always preview extracted data before downloading to catch any issues early.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Simple, Transparent Pricing
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <h3 className="font-semibold text-emerald-400 mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-white mb-4">
                $0<span className="text-sm text-gray-400">/month</span>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>10 PDFs per day</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Files up to 10MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>CSV export</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Basic support</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-400/30 rounded-lg p-6">
              <div className="text-xs bg-emerald-500 text-white px-2 py-1 rounded inline-block mb-2">
                POPULAR
              </div>
              <h3 className="font-semibold text-emerald-400 mb-2">Pro Plan</h3>
              <div className="text-3xl font-bold text-white mb-4">
                $19<span className="text-sm text-gray-400">/month</span>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Unlimited PDFs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Files up to 50MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>CSV & Excel export</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Batch processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>API access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Extracting Data from PDFs Today
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of businesses and researchers who save hours of manual data entry with
            our AI-powered extraction tool.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/pdf-to-data"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Try PDF to Data Free
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              View All AI Tools
            </Link>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Related Data Tools</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/tools/json-csv"
              className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h4 className="font-semibold text-white">JSON to CSV</h4>
              </div>
              <p className="text-sm text-gray-400">
                Convert JSON data to CSV format for spreadsheets.
              </p>
            </Link>
            <Link
              href="/tools/pdf-summarizer"
              className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h4 className="font-semibold text-white">PDF Summarizer</h4>
              </div>
              <p className="text-sm text-gray-400">
                Get AI-powered summaries of long PDF documents.
              </p>
            </Link>
            <Link
              href="/tools/token-compressor"
              className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-white">Token Compressor</h4>
              </div>
              <p className="text-sm text-gray-400">
                Compress documents for efficient AI processing.
              </p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
