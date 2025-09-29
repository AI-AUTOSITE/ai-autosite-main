// app/blog/image-splitter-paper-sizes/page.tsx

import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Scissors, Printer, FileDown, Maximize2, Grid2x2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Smart Image Splitting for Perfect Printing - A4, Letter & More | AI AutoSite Blog',
  description: 'Split large images into printable paper sizes automatically. Learn how to create posters, banners, and large prints using your standard printer.',
  keywords: 'image splitter, paper size, A4 printing, poster printing, banner printing, image tile, split image for printing',
  openGraph: {
    title: 'Smart Image Splitting for Perfect Printing',
    description: 'Turn any image into perfectly sized prints for your standard printer',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Image Splitting for Perfect Printing',
    description: 'Create posters and banners with your home printer',
  }
}

export default function ImageSplitterGuidePage() {
  const publishDate = '2025-01-24'
  const author = 'AI AutoSite Team'
  const readTime = '6 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Navigation */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
            Quick Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Smart Image Splitting for Perfect Printing
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Transform large images into perfectly sized tiles for any paper format. Create stunning posters, 
          banners, and wall art using just your standard home or office printer.
        </p>
      </header>

      {/* Main Content */}
      <section className="space-y-12">
        
        {/* The Printing Challenge */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Printer className="text-cyan-400" />
            The Home Printing Challenge
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Ever wanted to print a poster but only have an A4 printer? Or needed to create a large 
              banner for an event without expensive printing services? Our Image Splitter solves this 
              universal problem instantly.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By intelligently splitting your image into standard paper sizes, you can print large 
              formats piece by piece, then assemble them into impressive displays—all with the printer 
              you already have.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Smart Features for Perfect Splits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <Grid2x2 className="text-blue-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Split Modes</h3>
              <p className="text-gray-300">
                Choose between paper-based splitting (A4, Letter, Legal) or custom grid splits 
                (2×2, 3×3, etc.) for maximum flexibility.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
              <Maximize2 className="text-green-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Sizing</h3>
              <p className="text-gray-300">
                Automatically calculates the best fit for your chosen paper size, with options 
                for overlap to ensure seamless assembly.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <FileDown className="text-purple-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">Bulk Download</h3>
              <p className="text-gray-300">
                Download all split images as a ZIP file, with each piece numbered for easy 
                assembly. Perfect for large projects.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
              <Scissors className="text-orange-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">Precision Cutting</h3>
              <p className="text-gray-300">
                Visual guides and grid lines help you see exactly where your image will be 
                split before processing.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Paper Sizes */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Supported Paper Sizes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-white mb-2">International (ISO)</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• A4 (210 × 297 mm)</li>
                <li>• A3 (297 × 420 mm)</li>
                <li>• A5 (148 × 210 mm)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">North American</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Letter (8.5 × 11 in)</li>
                <li>• Legal (8.5 × 14 in)</li>
                <li>• Tabloid (11 × 17 in)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Custom Options</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• 2×2 to 10×10 grid</li>
                <li>• Custom dimensions</li>
                <li>• Square splits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step by Step Guide */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">How to Split Your Images</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-semibold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Upload Your Image</h3>
                <p className="text-gray-300">Drag and drop or click to select your image (JPG, PNG, WebP supported)</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-semibold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Choose Split Method</h3>
                <p className="text-gray-300">Select paper size (A4, Letter, etc.) or grid pattern (3×3, 4×4)</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-semibold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Preview Grid</h3>
                <p className="text-gray-300">See exactly how your image will be divided with visual guides</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-semibold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Download All</h3>
                <p className="text-gray-300">Get all pieces as a ZIP file with numbered filenames for easy assembly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Real-World Applications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Event Posters & Banners</h3>
              <p className="text-gray-300">
                Create eye-catching displays for conferences, trade shows, or parties. Print on 
                regular paper and assemble for professional-looking results.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Educational Materials</h3>
              <p className="text-gray-300">
                Print large maps, diagrams, or infographics for classrooms. Perfect for visual 
                learning materials that need to be big and clear.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Home Decor</h3>
              <p className="text-gray-300">
                Transform favorite photos into wall-sized art. Create custom murals or photo 
                walls without expensive large-format printing.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Business Presentations</h3>
              <p className="text-gray-300">
                Print large charts, graphs, or architectural plans. Ideal for meetings where 
                digital displays aren't available.
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Pro Tips for Perfect Prints</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Use high-resolution images:</strong> Start with the highest 
                quality image possible for sharp prints
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Add overlap margins:</strong> Enable 5-10mm overlap for 
                easier alignment when assembling
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Print borderless:</strong> Use your printer's borderless 
                setting to avoid white edges
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Number reference:</strong> Keep the numbered guide handy 
                during assembly
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Test first:</strong> Do a test print of one tile to check 
                colors and sizing before printing all
              </p>
            </li>
          </ul>
        </div>

        {/* Comparison Table */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Split Mode Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-white py-3">Method</th>
                  <th className="text-white py-3">Best For</th>
                  <th className="text-white py-3">Result</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Paper Size (A4)</td>
                  <td className="py-3">Posters, documents</td>
                  <td className="py-3">Exact paper dimensions</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Grid Split (3×3)</td>
                  <td className="py-3">Square images, murals</td>
                  <td className="py-3">Equal-sized tiles</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Custom Size</td>
                  <td className="py-3">Special projects</td>
                  <td className="py-3">Your exact specs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Start Splitting Images Now
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Turn any image into perfectly sized prints. No downloads, no sign-ups, completely free.
        </p>
        <Link
          href="/tools/image-splitter"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Scissors className="mr-2" size={20} />
          Try Image Splitter Free
        </Link>
      </section>
    </article>
  )
}