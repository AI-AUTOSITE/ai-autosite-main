import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, FileJson, Table, Download, Code } from 'lucide-react'

export const metadata: Metadata = {
  title: 'JSON to CSV Converter Guide - Easy Data Format Conversion | AI AutoSite',
  description:
    'Learn how to convert JSON to CSV and CSV to JSON. Free online converter for developers and data analysts. Handle API data easily.',
  keywords:
    'json to csv, csv to json, data converter, json converter, csv converter, api data conversion',
  openGraph: {
    title: 'JSON to CSV Converter - Complete Guide',
    description: 'Master data format conversion between JSON and CSV',
    type: 'article',
  },
}

export default function JsonCsvGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '4 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">Dev Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          JSON to CSV Converter Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Convert between JSON and CSV formats easily. Perfect for API data, spreadsheets, and
          database exports.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Convert */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Convert Between JSON and CSV?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <FileJson className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">API Data</h3>
              <p className="text-gray-400 text-sm">Convert API responses to spreadsheets</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Table className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Excel Import</h3>
              <p className="text-gray-400 text-sm">Make JSON data Excel-friendly</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Download className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Database Export</h3>
              <p className="text-gray-400 text-sm">Export database data in both formats</p>
            </div>
          </div>
        </div>

        {/* Format Comparison */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">JSON vs CSV Format</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Aspect</th>
                  <th className="text-white pb-3">JSON</th>
                  <th className="text-white pb-3">CSV</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Structure</td>
                  <td className="py-3 text-blue-400">Nested, hierarchical</td>
                  <td className="py-3 text-green-400">Flat, tabular</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">File Size</td>
                  <td className="py-3">Larger</td>
                  <td className="py-3">Smaller</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Human Readable</td>
                  <td className="py-3">Developer-friendly</td>
                  <td className="py-3">Spreadsheet-friendly</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Data Types</td>
                  <td className="py-3">Preserves types</td>
                  <td className="py-3">All strings</td>
                </tr>
                <tr>
                  <td className="py-3">Best For</td>
                  <td className="py-3">APIs, configs</td>
                  <td className="py-3">Excel, databases</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Use Cases</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">API Integration:</strong> Convert REST API JSON
                responses to CSV for analysis
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Data Migration:</strong> Move data between different
                systems
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Report Generation:</strong> Create Excel-compatible
                reports from JSON
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Backup:</strong> Export database data in portable
                formats
              </p>
            </li>
          </ul>
        </div>

        {/* Pro Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Pro Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">Flatten nested JSON before converting to CSV</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Use consistent data types to avoid conversion issues
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Handle special characters and commas in CSV properly
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">Validate JSON syntax before conversion</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Convert Your Data Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free JSON to CSV converter. No signup required, works instantly in your browser.
        </p>
        <Link
          href="/tools/json-csv"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Code className="mr-2" size={20} />
          Try JSON-CSV Converter
        </Link>
      </section>
    </article>
  )
}
