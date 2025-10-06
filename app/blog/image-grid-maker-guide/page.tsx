// app/blog/image-grid-maker-complete-guide/page.tsx

import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Grid3x3, CheckCircle, Zap, Lock, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Create Perfect Image Grids in Seconds - Complete Guide | AI AutoSite Blog',
  description:
    'Learn how to create numbered photo grids for comparisons, tutorials, and portfolios. Perfect for before/after shots, step-by-step guides, and visual storytelling.',
  keywords:
    'image grid, photo collage, grid maker, before after, tutorial images, photo grid creator, numbered grids',
  openGraph: {
    title: 'Create Perfect Image Grids in Seconds',
    description: 'The ultimate guide to creating numbered photo grids for any purpose',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Perfect Image Grids in Seconds',
    description: 'Learn to make stunning photo grids with our free tool',
  },
}

export default function ImageGridMakerGuidePage() {
  const publishDate = '2025-01-24'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

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
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">Quick Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Create Perfect Image Grids in Seconds
        </h1>

        <p className="text-xl text-gray-300 leading-relaxed">
          Transform multiple images into organized, numbered grids. Perfect for before/after
          comparisons, step-by-step tutorials, and professional portfolios—all in your browser.
        </p>
      </header>

      {/* Main Content */}
      <section className="space-y-12">
        {/* Why Image Grids Matter */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Grid3x3 className="text-cyan-400" />
            Why Image Grids Matter
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              In today's visual world, presenting multiple images clearly is crucial. Whether you're
              showing transformation results, creating tutorials, or building portfolios, image
              grids help tell your story effectively.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our Image Grid Maker eliminates the complexity of photo editing software. No
              downloads, no subscriptions—just drag, drop, and download your perfect grid.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Key Features That Save Time</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
              <Zap className="text-cyan-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Processing</h3>
              <p className="text-gray-300">
                Everything happens in your browser. No uploads, no waiting—see your grid update in
                real-time as you add images.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <Layers className="text-purple-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">Flexible Grids</h3>
              <p className="text-gray-300">
                Create grids from 1×1 to 8×8 (up to 64 images). Perfect for any comparison or
                collection size you need.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
              <CheckCircle className="text-green-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Numbering</h3>
              <p className="text-gray-300">
                Optional number overlays help viewers follow sequences. Perfect for tutorials and
                step-by-step guides.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
              <Lock className="text-orange-400 mb-3" size={24} />
              <h3 className="text-lg font-semibold text-white mb-2">100% Private</h3>
              <p className="text-gray-300">
                Your images never leave your device. All processing happens locally, ensuring
                complete privacy and security.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">How to Create Your Grid</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-semibold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Set Grid Size</h3>
                <p className="text-gray-300">Choose your rows and columns (up to 8×8)</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-semibold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Add Images</h3>
                <p className="text-gray-300">
                  Drag and drop multiple images at once or click to select
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-semibold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Customize</h3>
                <p className="text-gray-300">
                  Toggle numbers on/off, replace any image by clicking its cell
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-semibold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Download</h3>
                <p className="text-gray-300">
                  Click "Merge & Download" to save your grid as a single image
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Perfect For These Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Before/After Comparisons</h3>
              <p className="text-gray-300">
                Show transformations side by side. Ideal for fitness progress, home renovations,
                design changes, or any visual improvements.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Step-by-Step Tutorials</h3>
              <p className="text-gray-300">
                Create numbered sequences for recipes, DIY projects, makeup tutorials, or any
                process that needs visual guidance.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Product Catalogs</h3>
              <p className="text-gray-300">
                Display multiple products or variations in one organized view. Perfect for
                e-commerce, portfolios, or collections.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Social Media Content</h3>
              <p className="text-gray-300">
                Create engaging carousel alternatives, Instagram grids, or Pinterest-ready collages
                that stand out.
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Pro Tips for Better Grids</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Use consistent image sizes:</strong> For the cleanest
                look, use images with similar dimensions
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Batch processing:</strong> Select and drop all images
                at once to fill your grid instantly
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Quick replacements:</strong> Click any filled cell to
                replace just that image without starting over
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Preview first:</strong> Check the live preview before
                downloading to ensure everything looks perfect
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Start Creating Your Image Grid Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          No sign-up required. 100% free. All processing in your browser.
        </p>
        <Link
          href="/tools/image-grid-maker"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Grid3x3 className="mr-2" size={20} />
          Try Image Grid Maker Free
        </Link>
      </section>
    </article>
  )
}
