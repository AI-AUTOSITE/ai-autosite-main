// app/blog/test-image-generator-guide/page.tsx

import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowLeft,
  ImageIcon,
  Settings,
  Sliders,
  Download,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Test Image Generator Guide - How to Use | AI AutoSite Blog',
  description:
    'Complete guide to generating test images for development and testing. Learn how to create images with custom size, format, and complexity.',
  keywords:
    'test image generator guide, how to create test images, image compression testing, upload testing, development tools',
  openGraph: {
    title: 'How to Use Test Image Generator - Complete Guide',
    description: 'Step-by-step guide to generating test images for development and testing',
    type: 'article',
    publishedTime: '2025-10-06',
    authors: ['AI AutoSite Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test Image Generator Guide',
    description: 'Learn how to generate test images for development',
  },
}

export default function TestImageGeneratorGuidePage() {
  const publishDate = 'October 2025'
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
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            Developer Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          How to Use Test Image Generator
        </h1>

        <p className="text-xl text-gray-300 leading-relaxed">
          Create custom test images with precise specifications for compression testing, upload
          validation, and performance analysis. This guide covers everything you need to know.
        </p>
      </header>

      {/* Main Content */}
      <div className="prose prose-invert max-w-none space-y-12">
        {/* Section 1: What is Test Image Generator */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <ImageIcon className="text-cyan-400" />
            What is Test Image Generator?
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Test Image Generator is a browser-based tool that creates custom images with specific
            characteristics for testing image processing systems, compression algorithms, and upload
            functionality.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Unlike simple placeholder image services, this tool gives you complete control over
            dimensions, format, compression difficulty, and visual complexity - perfect for edge
            case testing and performance validation.
          </p>
        </section>

        {/* Section 2: Step-by-Step Guide */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Step-by-Step Guide</h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Choose Image Size</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                      Select from presets: Full HD, 4K, Square, Portrait, Thumbnail, Banner
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-cyan-400 flex-shrink-0 mt-0.5" size={16} />
                      Or choose "Custom" to set exact width and height (100-7680px)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select Format and Quality
                  </h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
                      JPEG: Best compatibility, smaller file size
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
                      PNG: Lossless quality, larger file size
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
                      WebP: Modern format, best compression (10-30% smaller)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
                      Adjust quality slider (10-100%) for JPEG/WebP
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Set Compression Difficulty
                  </h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-orange-400 flex-shrink-0 mt-0.5" size={16} />
                      Easy: Simple patterns, gradients - compresses well
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-orange-400 flex-shrink-0 mt-0.5" size={16} />
                      Hard: Complex noise, overlapping shapes - hard to compress
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-orange-400 flex-shrink-0 mt-0.5" size={16} />
                      Choose color mode: Solid, Gradient, Pattern, or Noise
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Generate and Download</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                      Click Preview to see your image before downloading
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                      Set batch count (1-10) for multiple images
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                      Download: Single file or ZIP for batch mode
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Key Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Settings className="text-cyan-400" size={20} />
                Flexible Dimensions
              </h3>
              <p className="text-gray-300 text-sm">
                Choose from common presets or set exact custom dimensions up to 7680×7680px (8K
                resolution).
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <ImageIcon className="text-purple-400" size={20} />
                Multiple Formats
              </h3>
              <p className="text-gray-300 text-sm">
                Generate JPEG, PNG, or WebP images with adjustable quality settings for different
                test scenarios.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="text-orange-400" size={20} />
                Compression Control
              </h3>
              <p className="text-gray-300 text-sm">
                Test with easy-to-compress simple patterns or challenging complex noise to stress
                test your systems.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Download className="text-green-400" size={20} />
                Batch Generation
              </h3>
              <p className="text-gray-300 text-sm">
                Generate up to 10 images at once, automatically packaged as ZIP for convenient bulk
                testing.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Common Use Cases */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Common Use Cases</h2>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Image Compression Testing</h3>
              <p className="text-gray-300 text-sm">
                Test compression algorithms with various complexity levels. Use "Hard" mode with
                noise patterns to challenge lossy compression and identify artifacts.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Upload System Validation</h3>
              <p className="text-gray-300 text-sm">
                Generate images at specific sizes to test file size limits, dimension restrictions,
                and format validation in upload systems.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Performance Benchmarking</h3>
              <p className="text-gray-300 text-sm">
                Create large, complex images to benchmark image processing performance, memory
                usage, and rendering speed in your applications.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Responsive Image Testing</h3>
              <p className="text-gray-300 text-sm">
                Generate multiple sizes (thumbnail, mobile, desktop, 4K) to test responsive image
                systems and srcset implementations.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Format Comparison */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Format Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 text-white font-semibold">Format</th>
                  <th className="p-3 text-white font-semibold">Compression</th>
                  <th className="p-3 text-white font-semibold">Quality</th>
                  <th className="p-3 text-white font-semibold">Browser Support</th>
                  <th className="p-3 text-white font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-3 text-cyan-400 font-medium">JPEG</td>
                  <td className="p-3 text-gray-300">Lossy</td>
                  <td className="p-3 text-gray-300">Good</td>
                  <td className="p-3 text-green-400">100%</td>
                  <td className="p-3 text-gray-300">Photos, gradients</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-3 text-purple-400 font-medium">PNG</td>
                  <td className="p-3 text-gray-300">Lossless</td>
                  <td className="p-3 text-gray-300">Perfect</td>
                  <td className="p-3 text-green-400">100%</td>
                  <td className="p-3 text-gray-300">Graphics, transparency</td>
                </tr>
                <tr>
                  <td className="p-3 text-orange-400 font-medium">WebP</td>
                  <td className="p-3 text-gray-300">Both</td>
                  <td className="p-3 text-gray-300">Excellent</td>
                  <td className="p-3 text-yellow-400">97%</td>
                  <td className="p-3 text-gray-300">Modern web</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Troubleshooting */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Troubleshooting</h2>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-start gap-3 mb-2">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Preview not showing</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Solution:</strong> Click the "Preview" button to generate the image.
                    Large dimensions (4K+) may take 2-3 seconds to render.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-start gap-3 mb-2">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    File size larger than expected
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Solution:</strong> Switch to "Easy" complexity or lower the quality
                    setting. PNG format is always larger than JPEG/WebP. Try WebP for smallest
                    files.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-start gap-3 mb-2">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Browser freezes during generation
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Solution:</strong> Reduce dimensions or batch count. Very large images
                    (6000×6000+) with Hard complexity may strain browser memory. Start with smaller
                    sizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Pro Tips */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Pro Tips</h2>

          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold text-xl">💡</span>
                <span>
                  Use WebP format for modern browsers - it's 25-35% smaller than JPEG at same visual
                  quality
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold text-xl">💡</span>
                <span>
                  Test compression with "Noise" color mode - it's the most challenging scenario for
                  lossy compression
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-400 font-bold text-xl">💡</span>
                <span>
                  Filename includes timestamp so files never overwrite - safe for batch generation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-xl">💡</span>
                <span>All processing is local - no uploads, complete privacy, works offline</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-xl">💡</span>
                <span>
                  Batch mode automatically creates ZIP - perfect for testing multiple upload
                  scenarios at once
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Generate Test Images?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Create custom test images instantly with precise control over size, format, and
          complexity. Perfect for developers and QA engineers.
        </p>
        <Link
          href="/tools/test-image-generator"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Download className="mr-2" size={20} />
          Try It Free
        </Link>
      </section>
    </article>
  )
}
