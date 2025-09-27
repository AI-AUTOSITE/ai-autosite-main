
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Image, Zap, Shield, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Compress Images for Web - Ultimate Guide 2025 | AI AutoSite',
  description: 'Learn how to compress images for faster websites. Reduce JPG and PNG size by 60-80% without quality loss. Free online tool.',
  keywords: 'image compression, compress images, reduce image size, optimize images for web, image compressor',
  openGraph: {
    title: 'Image Compression Guide - Make Your Website Faster',
    description: 'Complete guide to compressing images for web performance',
    type: 'article',
  },
}

export default function ImageCompressGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '6 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

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
          How to Compress Images Without Losing Quality
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Learn why image compression is crucial for web performance and how to reduce file sizes 
          by 60-80% while keeping your images looking perfect.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Compress */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Compress Images?</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Faster Loading</h3>
              <p className="text-gray-400 text-sm">
                Compressed images load 3-5x faster
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Shield className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Save Bandwidth</h3>
              <p className="text-gray-400 text-sm">
                Use less data for mobile users
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Image className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-1">Better SEO</h3>
              <p className="text-gray-400 text-sm">
                Google ranks faster sites higher
              </p>
            </div>
          </div>
          <p className="text-gray-300">
            Large images are the #1 cause of slow websites. A single uncompressed photo can be 5-10MB, 
            taking 10+ seconds to load on mobile. After compression, that same image might be just 200KB - 
            loading instantly while looking identical.
          </p>
        </div>

        {/* How Much to Compress */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Ideal Image Sizes for Web</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Use Case</th>
                  <th className="text-white pb-3">Max Size</th>
                  <th className="text-white pb-3">Dimensions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Hero images</td>
                  <td className="py-3">200-300KB</td>
                  <td className="py-3">1920x1080px</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Blog images</td>
                  <td className="py-3">100-150KB</td>
                  <td className="py-3">800x600px</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Thumbnails</td>
                  <td className="py-3">20-50KB</td>
                  <td className="py-3">300x300px</td>
                </tr>
                <tr>
                  <td className="py-3">Icons</td>
                  <td className="py-3">5-10KB</td>
                  <td className="py-3">64x64px</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Settings */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Choosing Quality Settings</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">80-90% Quality:</strong> Perfect for photos. No visible difference, 60% smaller files.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">60-80% Quality:</strong> Good for web graphics. Slight quality loss, 70-80% smaller.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Below 60%:</strong> Only for thumbnails. Visible quality loss, 85%+ smaller.
              </p>
            </li>
          </ul>
        </div>

        {/* Step by Step */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How to Compress Images</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p className="text-white font-medium">Choose your quality</p>
                <p className="text-gray-400 text-sm mt-1">
                  Start with 80% for photos, 60% for graphics
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p className="text-white font-medium">Drop your images</p>
                <p className="text-gray-400 text-sm mt-1">
                  Drag and drop or click to select multiple files
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p className="text-white font-medium">Download compressed files</p>
                <p className="text-gray-400 text-sm mt-1">
                  Get all images at once or download individually
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Pro Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Always keep original images as backup before compressing
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Use JPG for photos, PNG for graphics with transparency
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Resize images to actual display size before compressing
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Test different quality levels to find your sweet spot
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Compress Your Images Now
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free online tool. No signup needed. Compress unlimited images and make your website faster today.
        </p>
        <Link 
          href="/tools/image-compress" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Image className="mr-2" size={20} />
          Try Image Compress
        </Link>
      </section>
    </article>
  )
}