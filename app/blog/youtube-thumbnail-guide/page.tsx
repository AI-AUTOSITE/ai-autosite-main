import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Youtube, Download, Image, Camera } from 'lucide-react'

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Downloader - Get Video Thumbnails HD | AI AutoSite',
  description:
    'Download YouTube thumbnails in HD quality. Get video thumbnails in all sizes. Free YouTube thumbnail grabber tool.',
  keywords:
    'youtube thumbnail downloader, youtube thumbnail grabber, download youtube thumbnail, video thumbnail download, youtube thumbnail hd',
  openGraph: {
    title: 'YouTube Thumbnail Downloader Guide',
    description: 'Download any YouTube video thumbnail in HD quality',
    type: 'article',
  },
}

export default function YoutubeThumbnailGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '3 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-red-500 hover:text-red-400 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full">Creative Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          YouTube Thumbnail Downloader Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Download YouTube video thumbnails in HD quality. Perfect for creators, researchers, and
          content curators.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Download Thumbnails */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Download YouTube Thumbnails?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Camera className="w-8 h-8 text-red-500 mb-2" />
              <h3 className="text-white font-semibold mb-2">Content Analysis</h3>
              <p className="text-gray-400 text-sm">Study successful thumbnail designs</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Image className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Inspiration</h3>
              <p className="text-gray-400 text-sm">Get ideas for your own thumbnails</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Download className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Archive</h3>
              <p className="text-gray-400 text-sm">Save thumbnails for reference</p>
            </div>
          </div>
        </div>

        {/* Thumbnail Sizes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">YouTube Thumbnail Sizes</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Quality</th>
                  <th className="text-white pb-3">Resolution</th>
                  <th className="text-white pb-3">Best For</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-red-500">Max Resolution</td>
                  <td className="py-3">1280 x 720</td>
                  <td className="py-3">HD displays, printing</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-blue-400">High Quality</td>
                  <td className="py-3">640 x 480</td>
                  <td className="py-3">Web use, presentations</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-400">Standard</td>
                  <td className="py-3">480 x 360</td>
                  <td className="py-3">Social media sharing</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-yellow-400">Medium</td>
                  <td className="py-3">320 x 180</td>
                  <td className="py-3">Previews, galleries</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-400">Small</td>
                  <td className="py-3">120 x 90</td>
                  <td className="py-3">Thumbnails, icons</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How to Download Thumbnails</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ol className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">1.</span>
                <p className="text-gray-300">Copy the YouTube video URL from your browser</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">2.</span>
                <p className="text-gray-300">Paste it into the thumbnail downloader tool</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">3.</span>
                <p className="text-gray-300">Select your preferred quality/size</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">4.</span>
                <p className="text-gray-300">Click download to save the thumbnail</p>
              </li>
            </ol>
          </div>
        </div>

        {/* Thumbnail Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Thumbnail Design Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-red-500">🎨</span>
                <p className="text-gray-300">Use high contrast colors that stand out</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">📸</span>
                <p className="text-gray-300">Include faces with clear expressions</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">📝</span>
                <p className="text-gray-300">Add bold, readable text (max 3-5 words)</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">🎯</span>
                <p className="text-gray-300">Maintain consistent branding across videos</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Download YouTube Thumbnails</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free YouTube thumbnail downloader. Get any video thumbnail in HD quality.
        </p>
        <Link
          href="/tools/youtube-thumbnail"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Youtube className="mr-2" size={20} />
          Try Thumbnail Downloader
        </Link>
      </section>
    </article>
  )
}
