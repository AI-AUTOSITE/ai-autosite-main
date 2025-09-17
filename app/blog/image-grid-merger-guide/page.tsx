import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Grid3x3, Shield, Zap, Download, Layers, Image, CheckCircle, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Create Numbered Image Grids in Seconds - Complete Guide 2025 | AI AutoSite',
  description: 'Learn how to merge multiple images into numbered grids instantly. No uploads, 100% privacy. Perfect for tutorials, presentations, and comparison charts. Free online tool.',
  keywords: 'image grid maker, photo grid creator, numbered image grid, image collage tool, merge images online, split image tool, privacy-first image tool, local image processing, tutorial image creator, presentation image grid',
  openGraph: {
    title: 'Create Professional Image Grids in Seconds - Free Guide',
    description: 'Master the art of creating numbered image grids for tutorials and presentations. 100% local processing, no uploads required.',
    type: 'article',
    images: ['/og-image-grid-merger.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Numbered Image Grids Instantly',
    description: 'Free guide to creating professional image grids with automatic numbering.',
  }
}

export default function ImageGridMergerGuide() {
  const publishDate = '2025-01-22'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Blog */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        {/* Meta info */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
            Quick Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Create Stunning Image Grids in Seconds
          <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            No Uploads, 100% Privacy, Instant Results
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Discover how to merge multiple images into perfectly numbered grids for tutorials, 
          presentations, and visual guides. Our privacy-first tool processes everything locally 
          in your browser - your images never leave your device.
        </p>
      </header>

      {/* Quick CTA */}
      <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 mb-12 border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Grid3x3 className="w-12 h-12 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Ready to create?</h2>
              <p className="text-gray-400">Start merging images right now</p>
            </div>
          </div>
          <Link
            href="/tools/image-grid-merger"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Zap className="inline-block mr-2" size={18} />
            Try Image Grid Merger
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why You Need an Image Grid Tool</h2>
        <p className="text-gray-300 mb-4">
          Ever tried to create a step-by-step tutorial or comparison chart with multiple images? 
          Traditional image editors make this tedious. You need to manually resize, align, and 
          number each image. Online tools often require uploads, compromising your privacy.
        </p>
        <div className="bg-black/30 rounded-xl p-6 border border-white/10">
          <h3 className="font-semibold text-white mb-3">Common Challenges:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              Manual numbering takes forever
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              Image alignment is frustrating
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              Most tools upload your private images
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              Complex software requires installation
            </li>
          </ul>
        </div>
      </section>

      {/* Solution Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">The Perfect Solution: Image Grid Merger</h2>
        <p className="text-gray-300 mb-6">
          Our tool solves all these problems with cutting-edge browser technology. 
          Create professional image grids in seconds with automatic numbering, perfect alignment, 
          and complete privacy.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Shield className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">100% Private</h3>
            <p className="text-gray-400 text-sm">
              Images process locally. Nothing uploads to servers. Your data stays yours.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Zap className="w-10 h-10 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">
              No upload wait times. Instant processing using your device's power.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Grid3x3 className="w-10 h-10 text-cyan-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Flexible Grids</h3>
            <p className="text-gray-400 text-sm">
              Create up to 8x8 grids with automatic numbering and perfect alignment.
            </p>
          </div>
        </div>
      </section>

      {/* How-To Guide */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">How to Create Image Grids: Step-by-Step</h2>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose Your Grid Layout</h3>
              <p className="text-gray-300">
                Select rows and columns (up to 8x8). The tool automatically calculates the total cells.
                Perfect for tutorials needing 2x2 comparisons or complex 8x8 showcases.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Add Your Images</h3>
              <p className="text-gray-300">
                Drag and drop images or click to select. Images fill cells automatically. 
                You can add multiple images at once - they'll populate empty cells in order.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Toggle Numbering</h3>
              <p className="text-gray-300">
                Enable automatic numbering to add clear labels to each image. 
                Perfect for step-by-step tutorials or reference guides.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Merge & Download</h3>
              <p className="text-gray-300">
                Click merge to combine all images into one grid. Downloads instantly as PNG. 
                The tool automatically handles different image sizes for perfect alignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Advanced Feature: Split & Rebuild</h2>
        <p className="text-gray-300 mb-6">
          Need to split a long screenshot or infographic? Our Split & Rebuild feature offers three powerful modes:
        </p>
        
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Layers className="text-purple-400" />
              Manual Split Mode
            </h3>
            <p className="text-gray-300">
              Click to add split lines anywhere on your image. Drag to adjust positions. 
              Perfect for custom layouts and precise control.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Image className="text-purple-400" />
              Height-Based Split
            </h3>
            <p className="text-gray-300">
              Split images every X pixels. Ideal for breaking long screenshots into 
              social media-friendly sizes.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Download className="text-purple-400" />
              Count-Based Split
            </h3>
            <p className="text-gray-300">
              Divide images into equal parts. Great for creating carousel posts or 
              splitting infographics.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Perfect For These Use Cases</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
            <h3 className="font-semibold text-white mb-3">📚 Educational Content</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Step-by-step tutorials</li>
              <li>• Before/after comparisons</li>
              <li>• Process documentation</li>
              <li>• Visual guides</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="font-semibold text-white mb-3">💼 Professional Use</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Product showcases</li>
              <li>• Portfolio presentations</li>
              <li>• UI/UX comparisons</li>
              <li>• Report visuals</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="font-semibold text-white mb-3">📱 Social Media</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Instagram carousels</li>
              <li>• Twitter threads</li>
              <li>• Pinterest pins</li>
              <li>• LinkedIn posts</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
            <h3 className="font-semibold text-white mb-3">🎨 Creative Projects</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Mood boards</li>
              <li>• Photo collages</li>
              <li>• Design iterations</li>
              <li>• Art progressions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Pro Tips for Perfect Image Grids</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-1">Use Consistent Aspect Ratios</h3>
              <p className="text-gray-300 text-sm">
                For best results, use images with similar aspect ratios. The tool handles different sizes, 
                but consistent ratios create cleaner grids.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-1">Plan Your Grid Size</h3>
              <p className="text-gray-300 text-sm">
                Consider your final use. Social media? Try 2x2 or 3x3. Detailed tutorials? 
                Go for 4x4 or larger.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-1">Preview Before Download</h3>
              <p className="text-gray-300 text-sm">
                Our live preview shows exactly how your grid will look. Adjust numbering and 
                layout before finalizing.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-1">Batch Processing</h3>
              <p className="text-gray-300 text-sm">
                Select multiple images at once. They'll automatically fill available cells in order, 
                saving you time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="mb-12 bg-black/30 rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Shield className="text-green-400" />
          Your Privacy Matters
        </h2>
        <p className="text-gray-300 mb-4">
          Unlike other online tools, Image Grid Merger prioritizes your privacy:
        </p>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span><strong>100% Local Processing:</strong> All operations happen in your browser using Canvas API</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span><strong>No Server Uploads:</strong> Your images never leave your device</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span><strong>No Registration Required:</strong> Start using immediately, no account needed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span><strong>No Data Storage:</strong> We don't store, track, or analyze your images</span>
          </li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <details className="bg-white/5 rounded-xl p-6 border border-white/10 cursor-pointer group">
            <summary className="font-semibold text-white flex items-center justify-between">
              <span>What's the maximum grid size?</span>
              <HelpCircle className="text-cyan-400" size={20} />
            </summary>
            <p className="text-gray-300 mt-3">
              You can create grids up to 8x8 (64 images total). This covers most use cases while 
              maintaining performance and usability.
            </p>
          </details>
          
          <details className="bg-white/5 rounded-xl p-6 border border-white/10 cursor-pointer group">
            <summary className="font-semibold text-white flex items-center justify-between">
              <span>What image formats are supported?</span>
              <HelpCircle className="text-cyan-400" size={20} />
            </summary>
            <p className="text-gray-300 mt-3">
              All common image formats work: JPG, PNG, GIF, WebP, BMP. The tool exports 
              merged grids as PNG for best quality.
            </p>
          </details>
          
          <details className="bg-white/5 rounded-xl p-6 border border-white/10 cursor-pointer group">
            <summary className="font-semibold text-white flex items-center justify-between">
              <span>Can I use this for commercial projects?</span>
              <HelpCircle className="text-cyan-400" size={20} />
            </summary>
            <p className="text-gray-300 mt-3">
              Yes! The tool is free for both personal and commercial use. No attribution required, 
              though we appreciate mentions!
            </p>
          </details>
          
          <details className="bg-white/5 rounded-xl p-6 border border-white/10 cursor-pointer group">
            <summary className="font-semibold text-white flex items-center justify-between">
              <span>How does the split feature work?</span>
              <HelpCircle className="text-cyan-400" size={20} />
            </summary>
            <p className="text-gray-300 mt-3">
              Upload a long image, choose split method (manual, by height, or by count), 
              and the tool splits then arranges pieces horizontally. Perfect for breaking 
              long screenshots or infographics.
            </p>
          </details>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Start Creating Amazing Image Grids</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of creators, educators, and professionals using Image Grid Merger 
          for their visual content needs. Free forever, no strings attached.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tools/image-grid-merger"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Zap className="mr-2" size={20} />
            Try Image Grid Merger Now
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
          >
            Explore More Tools
          </Link>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-12">
        <h3 className="text-xl font-semibold text-white mb-4">Related Tools You Might Like</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/tools/blurtap" className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <h4 className="font-semibold text-white mb-1">BlurTap</h4>
            <p className="text-gray-400 text-sm">Privacy-focused image blur tool</p>
          </Link>
          <Link href="/tools/pdf-tools" className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <h4 className="font-semibold text-white mb-1">PDF Tools</h4>
            <p className="text-gray-400 text-sm">Merge, split, and edit PDFs locally</p>
          </Link>
          <Link href="/tools/text-case" className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <h4 className="font-semibold text-white mb-1">Text Case Converter</h4>
            <p className="text-gray-400 text-sm">Transform text formatting instantly</p>
          </Link>
        </div>
      </section>
    </article>
  )
}